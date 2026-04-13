/* ------------------------------------------------------------------ */
/*  UEFI Protocol Services Visualizer – Main Script                    */
/*  Sections: structs diagram, OpenProtocol steps, LocateProtocol      */
/*            steps, LocateHandleBuffer steps, attribute table,        */
/*            code tabs                                                */
/* ------------------------------------------------------------------ */

/* ====================== colour constants ========================== */
var C = {
    bg:         '#0b1220',
    bgSoft:     '#111927',
    panel:      'rgba(17,25,39,0.85)',
    text:       '#e6edf3',
    muted:      '#8b9bb0',
    border:     'rgba(20,184,166,0.15)',

    primary:    '#14b8a6',
    primaryDim: 'rgba(20,184,166,0.22)',
    accent:     '#fb923c',
    accentDim:  'rgba(251,146,60,0.22)',
    proto:      '#a78bfa',
    protoDim:   'rgba(167,139,250,0.22)',
    core:       '#38bdf8',
    coreDim:    'rgba(56,189,248,0.22)',
    child:      '#34d399',
    childDim:   'rgba(52,211,153,0.22)',
    warn:       '#f87171',
    warnDim:    'rgba(248,113,113,0.22)',
    locate:     '#22d3ee',
    locateDim:  'rgba(34,211,238,0.22)',

    dimmed:     '#1e2a3a',
    dimText:    '#4a5568',
};

/* ====================== SVG helpers =============================== */
function mkRect(x, y, w, h, fill, stroke, rx, extra) {
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'
         + ' rx="'+(rx||8)+'" fill="'+fill+'" stroke="'+(stroke||'none')+'"'
         + ' stroke-width="1.5"'+(extra||'')+'/>';
}

function mkText(x, y, txt, color, size, anchor, weight, extra) {
    return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'middle')+'"'
         + ' fill="'+(color||C.text)+'" font-family="Space Grotesk,sans-serif"'
         + ' font-size="'+(size||12)+'" font-weight="'+(weight||500)+'"'+(extra||'')+'>'
         + escapeHtml(txt)+'</text>';
}

function mkLine(x1,y1,x2,y2,color,width,dash) {
    return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"'
         + ' stroke="'+(color||C.muted)+'" stroke-width="'+(width||1.5)+'"'
         + (dash?' stroke-dasharray="'+dash+'"':'')+'/>';
}

function mkArrow(x1,y1,x2,y2,color,dashed,id) {
    var aid = id || ('a'+Math.random().toString(36).substr(2,6));
    var dash = dashed ? ' stroke-dasharray="6,4"' : '';
    var col  = color || C.primary;
    return '<defs><marker id="'+aid+'" markerWidth="8" markerHeight="6"'
         + ' refX="7" refY="3" orient="auto">'
         + '<polygon points="0 0,8 3,0 6" fill="'+col+'"/></marker></defs>'
         + '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"'
         + ' stroke="'+col+'" stroke-width="1.8"'+dash+' marker-end="url(#'+aid+')"/>';
}

function mkCurveArrow(x1,y1,cx,cy,x2,y2,color,dashed,id) {
    var aid = id || ('ca'+Math.random().toString(36).substr(2,6));
    var dash = dashed ? ' stroke-dasharray="6,4"' : '';
    var col  = color || C.primary;
    return '<defs><marker id="'+aid+'" markerWidth="8" markerHeight="6"'
         + ' refX="7" refY="3" orient="auto">'
         + '<polygon points="0 0,8 3,0 6" fill="'+col+'"/></marker></defs>'
         + '<path d="M'+x1+','+y1+' Q'+cx+','+cy+' '+x2+','+y2+'"'
         + ' stroke="'+col+'" stroke-width="1.8" fill="none"'+dash+' marker-end="url(#'+aid+')"/>';
}

function mkLabel(x,y,txt,color,size) {
    return '<rect x="'+(x-4)+'" y="'+(y-parseInt(size||11)-2)+'" width="'+(txt.length*(parseInt(size||11)*0.6)+8)+'" height="'+(parseInt(size||11)+6)+'" rx="4" fill="rgba(11,18,32,0.85)"/>'
         + mkText(x,y,txt,color||C.primary,size||11,'start',600);
}

function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ====================== IHANDLE box helper ======================= */
function drawHandle(svg, x, y, label, protocols, opts) {
    opts = opts || {};
    var w = opts.w || 220;
    var headerH = 36;
    var rowH    = 26;
    var h = headerH + protocols.length * rowH + 10;
    var borderColor = opts.borderColor || C.accent;
    var dimmed = opts.dimmed || false;

    svg += mkRect(x, y, w, h, dimmed ? C.dimmed : 'rgba(251,146,60,0.07)', dimmed ? C.dimText : borderColor, 10);
    svg += mkRect(x, y, w, headerH, dimmed ? C.dimmed : 'rgba(251,146,60,0.18)', 'none', '10 10 0 0');
    svg += mkText(x+14, y+14, 'IHANDLE', dimmed ? C.dimText : C.accent, 11, 'start', 700);
    svg += mkText(x+14, y+27, label, dimmed ? C.dimText : C.text, 10, 'start', 500);

    var py = y + headerH + 4;
    protocols.forEach(function(p) {
        var pColor = dimmed ? C.dimText : (p.color || C.proto);
        svg += mkRect(x+8, py+1, w-16, rowH-3, dimmed ? 'rgba(255,255,255,0.02)' : 'rgba(167,139,250,0.08)', dimmed ? 'rgba(255,255,255,0.04)' : 'rgba(167,139,250,0.2)', 5);
        if (p.isNew && !dimmed) {
            svg += mkRect(x+8, py+1, w-16, rowH-3, 'rgba(20,184,166,0.12)', C.primary, 5);
        }
        if (p.highlight && !dimmed) {
            svg += mkRect(x+8, py+1, w-16, rowH-3, 'rgba(56,189,248,0.15)', C.core, 5);
        }
        var nameColor = p.isNew && !dimmed ? C.primary : (p.highlight && !dimmed ? C.core : (p.isDim ? C.dimText : pColor));
        svg += mkText(x+16, py+14, p.name, nameColor, 10, 'start', p.isNew || p.highlight ? 700 : 500);
        if (p.isNew && !dimmed) {
            svg += mkText(x+w-12, py+14, 'NEW', C.primary, 9, 'end', 700);
        }
        py += rowH;
    });
    return svg;
}

/* OPEN_PROTOCOL_DATA box */
function drawOPD(svg, x, y, agent, ctrl, attr, color) {
    var w = 200, h = 95;
    var c = color || C.core;
    svg += mkRect(x, y, w, h, 'rgba(56,189,248,0.08)', c, 8);
    svg += mkText(x+w/2, y+14, 'OPEN_PROTOCOL_DATA', c, 10, 'middle', 700);
    svg += mkLine(x+8, y+22, x+w-8, y+22, c);
    svg += mkText(x+10, y+36, 'Agent: '+agent, C.muted, 9, 'start');
    svg += mkText(x+10, y+50, 'Controller: '+ctrl, C.muted, 9, 'start');
    svg += mkText(x+10, y+64, 'Attributes: '+attr, c, 9, 'start', 600);
    svg += mkText(x+10, y+78, 'OpenCount: 1', C.muted, 9, 'start');
    return svg;
}

/* Driver Handle box */
function drawDriverHandle(svg, x, y, label, active, dimmed) {
    var w = 180, h = 70;
    var bcolor = dimmed ? C.dimText : (active ? C.primary : C.core);
    var bg = dimmed ? C.dimmed : (active ? C.primaryDim : C.coreDim);
    svg += mkRect(x, y, w, h, bg, bcolor, 10);
    svg += mkText(x+w/2, y+18, 'Driver Handle', dimmed?C.dimText:bcolor, 11, 'middle', 700);
    svg += mkLine(x+10, y+26, x+w-10, y+26, dimmed?'#2a3040':bcolor);
    svg += mkText(x+w/2, y+42, label, dimmed?C.dimText:C.text, 10, 'middle', 500);
    svg += mkText(x+w/2, y+58, 'EFI_DRIVER_BINDING_PROTOCOL', dimmed?C.dimText:C.proto, 8, 'middle', 400);
    if (active && !dimmed) {
        svg += mkRect(x, y, w, h, 'none', C.primary, 10, ' stroke-width="2.5" stroke-dasharray="5,3"');
    }
    return svg;
}

/* ================================================================== */
/*  SECTION 2: Structs Relationship Diagram                            */
/* ================================================================== */
function renderStructsDiagram() {
    var el = document.getElementById('structs-diagram-container');
    if (!el) return;

    var W = 960, H = 360;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    /* IHANDLE */
    var hx = 30, hy = 30;
    svg = drawHandle(svg, hx, hy, 'Device Handle (0x7F800000)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto, highlight:true},
    ], {w:240, borderColor:C.accent});

    /* PROTOCOL_INTERFACE for PCI IO */
    var pix = 330, piy = 30;
    var piw = 200, pih = 110;
    svg += mkRect(pix, piy, piw, pih, 'rgba(167,139,250,0.08)', C.proto, 8);
    svg += mkText(pix+piw/2, piy+14, 'PROTOCOL_INTERFACE', C.proto, 11, 'middle', 700);
    svg += mkLine(pix+8, piy+22, pix+piw-8, piy+22, C.proto);
    svg += mkText(pix+10, piy+36, 'Sig: \'pi\'', C.muted, 9, 'start');
    svg += mkText(pix+10, piy+50, 'Handle -> Device Handle', C.muted, 9, 'start');
    svg += mkText(pix+10, piy+64, 'Protocol -> PE_PCI_IO', C.muted, 9, 'start');
    svg += mkText(pix+10, piy+78, 'Interface -> 0x7FA00000', C.muted, 9, 'start');
    svg += mkText(pix+10, piy+92, 'OpenList -> [OPD chain]', C.core, 9, 'start', 600);

    /* Arrow Handle -> PI */
    svg += mkArrow(hx+240, hy+70, pix, piy+50, C.proto, false, 'h_pi');
    svg += mkLabel(hx+245, hy+64, 'Protocols list', C.proto, 9);

    /* OPEN_PROTOCOL_DATA #1 */
    var op1x = 590, op1y = 20;
    svg = drawOPD(svg, op1x, op1y, 'USB HCD Driver', 'XHCI Handle', 'BY_DRIVER', C.core);

    /* OPEN_PROTOCOL_DATA #2 */
    var op2x = 590, op2y = 135;
    svg = drawOPD(svg, op2x, op2y, 'USB Bus Driver', 'USB Keyboard', 'BY_CHILD_CTRL', C.child);

    /* PI -> OPD arrows */
    svg += mkArrow(pix+piw, piy+92, op1x, op1y+47, C.core, false, 'pi_opd1');
    svg += mkLabel(pix+piw+5, piy+86, 'OpenList', C.core, 9);
    svg += mkArrow(op1x+100, op1y+95, op2x+100, op2y, C.child, true, 'opd_chain');
    svg += mkLabel(op1x+105, op1y+105, 'Link (next)', C.muted, 8);

    /* Annotation */
    svg += mkRect(30, 260, 920, 80, 'rgba(56,189,248,0.06)', C.core, 10);
    svg += mkText(490, 285, 'DisconnectController scans OPEN_PROTOCOL_DATA to find which drivers manage this protocol.', C.core, 11, 'middle', 600);
    svg += mkText(490, 305, 'BY_DRIVER records identify the managing driver; BY_CHILD_CONTROLLER records identify child handles.', C.muted, 10, 'middle', 400);
    svg += mkText(490, 325, 'This tracking chain is what makes OpenProtocol more powerful than HandleProtocol.', C.muted, 10, 'middle', 400);

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ================================================================== */
/*  SECTION 3: OpenProtocol Step-by-Step (8 steps)                     */
/* ================================================================== */
var OPEN_STEPS = [
    { titleKey:'open.step1.title', descKey:'open.step1.desc', render: function(W,H){ return renderOpenStep1(W,H); } },
    { titleKey:'open.step2.title', descKey:'open.step2.desc', render: function(W,H){ return renderOpenStep2(W,H); } },
    { titleKey:'open.step3.title', descKey:'open.step3.desc', render: function(W,H){ return renderOpenStep3(W,H); } },
    { titleKey:'open.step4.title', descKey:'open.step4.desc', render: function(W,H){ return renderOpenStep4(W,H); } },
    { titleKey:'open.step5.title', descKey:'open.step5.desc', render: function(W,H){ return renderOpenStep5(W,H); } },
    { titleKey:'open.step6.title', descKey:'open.step6.desc', render: function(W,H){ return renderOpenStep6(W,H); } },
    { titleKey:'open.step7.title', descKey:'open.step7.desc', render: function(W,H){ return renderOpenStep7(W,H); } },
    { titleKey:'open.step8.title', descKey:'open.step8.desc', render: function(W,H){ return renderOpenStep8(W,H); } },
];
var openStep = 0;

function dxeCoreBox(W, label) {
    var bx = W/2-120, by = 10, bw = 240, bh = 40;
    var s = mkRect(bx, by, bw, bh, C.coreDim, C.core, 8);
    s += mkText(W/2, by+24, label || 'DXE Core — OpenProtocol()', C.core, 11, 'middle', 700);
    return s;
}

/* Step 1: Initial State */
function renderOpenStep1(W, H) {
    var s = dxeCoreBox(W);

    var hx = 40, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:240, borderColor:C.accent});

    s += mkText(hx+120, hy+155, 'OpenList: (empty)', C.muted, 10, 'middle', 400);

    s = drawDriverHandle(s, 380, 80, 'USB HCD Driver', false, false);

    /* annotation */
    s += mkRect(380, 180, 300, 70, 'rgba(139,155,176,0.06)', C.muted, 8);
    s += mkText(530, 200, 'No driver has opened PCI IO yet', C.muted, 10, 'middle', 400);
    s += mkText(530, 218, 'PROTOCOL_INTERFACE.OpenList is empty', C.muted, 10, 'middle', 400);
    s += mkText(530, 236, 'Ready for OpenProtocol call', C.core, 10, 'middle', 600);

    return s;
}

/* Step 2: CoreOpenProtocol Called */
function renderOpenStep2(W, H) {
    var s = dxeCoreBox(W);

    var hx = 40, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:240, borderColor:C.accent});

    s = drawDriverHandle(s, 380, 80, 'USB HCD Driver', true, false);

    /* call arrow */
    s += mkArrow(380, 115, W/2+120, 30, C.core, false, 'call');
    s += mkLabel(385, 105, 'gBS->OpenProtocol()', C.core, 9);

    /* Parameters box */
    var bx = 380, by = 190;
    s += mkRect(bx, by, 540, 180, 'rgba(56,189,248,0.07)', C.core, 10);
    s += mkText(bx+270, by+18, 'OpenProtocol Parameters:', C.core, 11, 'middle', 700);
    s += mkLine(bx+10, by+26, bx+530, by+26, C.core);
    var params = [
        ['Handle',          'ControllerHandle  (USB XHCI)'],
        ['Protocol',        '&gEfiPciIoProtocolGuid'],
        ['Interface',       '&PciIo  (OUT — will receive pointer)'],
        ['AgentHandle',     'This->DriverBindingHandle  (USB HCD)'],
        ['ControllerHandle','ControllerHandle  (USB XHCI)'],
        ['Attributes',      'EFI_OPEN_PROTOCOL_BY_DRIVER  (0x10)'],
    ];
    params.forEach(function(p, i) {
        s += mkText(bx+16, by+44+i*24, p[0]+':', C.text, 9.5, 'start', 600);
        s += mkText(bx+160, by+44+i*24, p[1], i===5 ? C.core : C.muted, 9.5, 'start', i===5 ? 700 : 400);
    });

    return s;
}

/* Step 3: Validate Handle */
function renderOpenStep3(W, H) {
    var s = dxeCoreBox(W);

    var hx = 40, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:240, borderColor:C.accent});

    /* validation highlight */
    s += mkRect(hx, hy, 240, 36, 'none', C.child, 10, ' stroke-width="2.5" stroke-dasharray="5,3"');

    /* check box */
    var cx = 350, cy = 80;
    s += mkRect(cx, cy, 320, 90, 'rgba(52,211,153,0.08)', C.child, 10);
    s += mkText(cx+160, cy+18, 'CoreValidateHandle()', C.child, 11, 'middle', 700);
    s += mkLine(cx+10, cy+26, cx+310, cy+26, C.child);
    s += mkText(cx+16, cy+42, '1. Check pointer != NULL', C.muted, 9.5, 'start');
    s += mkText(cx+16, cy+58, '2. IHANDLE.Signature == \'hand\' (0x68616E64)', C.child, 9.5, 'start', 600);
    s += mkText(cx+16, cy+74, '3. Handle is in gHandleList', C.muted, 9.5, 'start');

    s += mkArrow(hx+120, hy, cx, cy+45, C.child, false, 'val');

    /* result */
    s += mkRect(cx, cy+110, 320, 40, 'rgba(52,211,153,0.12)', C.child, 8);
    s += mkText(cx+160, cy+134, 'Signature matches -> Handle is VALID', C.child, 11, 'middle', 700);

    return s;
}

/* Step 4: Find PROTOCOL_INTERFACE */
function renderOpenStep4(W, H) {
    var s = dxeCoreBox(W);

    var hx = 30, hy = 70;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto, highlight:true},
    ], {w:230, borderColor:C.accent});

    /* Walk arrow */
    s += mkArrow(hx+115, hy+36, hx+115, hy+44, C.core, false, 'walk0');

    /* PROTOCOL_INTERFACE found */
    var pix = 310, piy = 70;
    s += mkRect(pix, piy, 220, 100, 'rgba(56,189,248,0.1)', C.core, 8);
    s += mkText(pix+110, piy+14, 'PROTOCOL_INTERFACE (found)', C.core, 10, 'middle', 700);
    s += mkLine(pix+8, piy+22, pix+212, piy+22, C.core);
    s += mkText(pix+10, piy+36, 'Protocol -> PE_PCI_IO_PROTOCOL', C.core, 9, 'start', 600);
    s += mkText(pix+10, piy+50, 'Handle -> XHCI Controller', C.muted, 9, 'start');
    s += mkText(pix+10, piy+64, 'Interface -> 0x7FA00000', C.muted, 9, 'start');
    s += mkText(pix+10, piy+78, 'OpenList -> [will add OPD]', C.core, 9, 'start', 600);

    s += mkArrow(hx+230, hy+80, pix, piy+50, C.core, false, 'find_pi');
    s += mkLabel(hx+235, hy+74, 'GUID match!', C.core, 9);

    /* search visual */
    s += mkRect(580, 70, 340, 120, 'rgba(139,155,176,0.06)', C.muted, 8);
    s += mkText(750, 90, 'CoreGetProtocolInterface()', C.text, 10, 'middle', 600);
    s += mkLine(590, 98, 910, 98, C.muted);
    s += mkText(600, 114, 'Walk IHANDLE.Protocols linked list:', C.muted, 9, 'start');
    s += mkText(600, 132, '  PI #1: EFI_DEVICE_PATH_PROTOCOL  (skip)', C.dimText, 9, 'start');
    s += mkText(600, 150, '  PI #2: EFI_PCI_IO_PROTOCOL       (MATCH!)', C.core, 9, 'start', 700);
    s += mkText(600, 170, 'Return PROTOCOL_INTERFACE pointer', C.child, 9, 'start', 600);

    return s;
}

/* Step 5: Simple Attributes */
function renderOpenStep5(W, H) {
    var s = dxeCoreBox(W, 'DXE Core — Attribute Dispatch');

    /* Three attribute boxes */
    var bw = 280, bh = 110, gap = 20, startX = 40;

    /* BY_HANDLE_PROTOCOL */
    s += mkRect(startX, 70, bw, bh, 'rgba(251,146,60,0.07)', C.accent, 10);
    s += mkText(startX+bw/2, 88, 'BY_HANDLE_PROTOCOL (0x01)', C.accent, 10, 'middle', 700);
    s += mkLine(startX+10, 96, startX+bw-10, 96, C.accent);
    s += mkText(startX+12, 112, 'Creates OPEN_PROTOCOL_DATA', C.muted, 9, 'start');
    s += mkText(startX+12, 128, 'AgentHandle = caller image', C.muted, 9, 'start');
    s += mkText(startX+12, 144, 'No exclusive check', C.muted, 9, 'start');
    s += mkText(startX+12, 160, 'Used by HandleProtocol()', C.accent, 9, 'start', 600);

    /* GET_PROTOCOL */
    var gx = startX + bw + gap;
    s += mkRect(gx, 70, bw, bh, 'rgba(139,155,176,0.06)', C.muted, 10);
    s += mkText(gx+bw/2, 88, 'GET_PROTOCOL (0x02)', C.muted, 10, 'middle', 700);
    s += mkLine(gx+10, 96, gx+bw-10, 96, C.muted);
    s += mkText(gx+12, 112, 'Creates OPEN_PROTOCOL_DATA', C.muted, 9, 'start');
    s += mkText(gx+12, 128, 'AgentHandle = image handle', C.muted, 9, 'start');
    s += mkText(gx+12, 144, 'No exclusive check', C.muted, 9, 'start');
    s += mkText(gx+12, 160, 'DXE Core internal only', C.muted, 9, 'start', 600);

    /* TEST_PROTOCOL */
    var tx = gx + bw + gap;
    s += mkRect(tx, 70, bw, bh, 'rgba(52,211,153,0.07)', C.child, 10);
    s += mkText(tx+bw/2, 88, 'TEST_PROTOCOL (0x04)', C.child, 10, 'middle', 700);
    s += mkLine(tx+10, 96, tx+bw-10, 96, C.child);
    s += mkText(tx+12, 112, 'NO OPEN_PROTOCOL_DATA created', C.child, 9, 'start', 600);
    s += mkText(tx+12, 128, 'Interface pointer NOT returned', C.child, 9, 'start', 600);
    s += mkText(tx+12, 144, 'Only checks existence', C.muted, 9, 'start');
    s += mkText(tx+12, 160, 'Returns EFI_SUCCESS if found', C.child, 9, 'start');

    /* Summary */
    s += mkRect(40, 210, 880, 50, 'rgba(56,189,248,0.06)', C.core, 8);
    s += mkText(480, 232, 'These 3 attributes are "simple" — no conflict detection, no driver disconnect logic.', C.core, 10, 'middle', 600);
    s += mkText(480, 248, 'For full driver model tracking, use BY_DRIVER, EXCLUSIVE, or BY_CHILD_CONTROLLER.', C.muted, 9, 'middle', 400);

    return s;
}

/* Step 6: BY_DRIVER conflict */
function renderOpenStep6(W, H) {
    var s = dxeCoreBox(W, 'DXE Core — BY_DRIVER (0x10)');

    /* Device Handle */
    var hx = 30, hy = 70;
    s = drawHandle(s, hx, hy, 'XHCI Controller', [
        {name:'EFI_PCI_IO_PROTOCOL', color:C.proto, highlight:true},
    ], {w:200, borderColor:C.accent});

    /* Scenario A: Success (no conflict) */
    s += mkRect(270, 60, 300, 155, 'rgba(52,211,153,0.06)', C.child, 10);
    s += mkText(420, 78, 'Scenario A: No Conflict', C.child, 10, 'middle', 700);
    s += mkLine(280, 86, 560, 86, C.child);
    s += mkText(280, 102, 'OpenList scan: no BY_DRIVER record found', C.muted, 9, 'start');
    s += mkText(280, 120, 'Create new OPEN_PROTOCOL_DATA:', C.muted, 9, 'start');
    s += mkText(290, 138, 'AgentHandle = USB HCD Driver', C.core, 9, 'start', 600);
    s += mkText(290, 154, 'ControllerHandle = XHCI Handle', C.muted, 9, 'start');
    s += mkText(290, 170, 'Attributes = BY_DRIVER', C.core, 9, 'start', 600);
    s += mkText(290, 188, 'Add to PI.OpenList -> Return EFI_SUCCESS', C.child, 9, 'start', 700);
    s += mkRect(545, 192, 15, 15, C.child, 'none', 4);
    s += mkText(552, 203, '✓', C.child, 11, 'middle', 700);

    /* Scenario B: Conflict */
    s += mkRect(600, 60, 340, 155, 'rgba(248,113,113,0.06)', C.warn, 10);
    s += mkText(770, 78, 'Scenario B: Conflict!', C.warn, 10, 'middle', 700);
    s += mkLine(610, 86, 930, 86, C.warn);
    s += mkText(610, 102, 'OpenList scan: existing BY_DRIVER found!', C.warn, 9, 'start', 600);
    s += mkText(610, 120, 'Existing record:', C.muted, 9, 'start');
    s += mkText(620, 138, 'AgentHandle = NVMe Driver (different!)', C.warn, 9, 'start', 600);
    s += mkText(620, 154, 'Attributes = BY_DRIVER', C.warn, 9, 'start');
    s += mkText(610, 172, 'Another driver already manages this!', C.muted, 9, 'start');
    s += mkText(610, 190, 'Return EFI_ACCESS_DENIED', C.warn, 9, 'start', 700);
    s += mkRect(925, 192, 15, 15, C.warn, 'none', 4);
    s += mkText(932, 203, '✗', C.warn, 11, 'middle', 700);

    /* explanation */
    s += mkRect(30, 240, 900, 45, 'rgba(56,189,248,0.06)', C.core, 8);
    s += mkText(480, 258, 'BY_DRIVER ensures exclusive management: only ONE driver can BY_DRIVER-open the same protocol on the same handle.', C.core, 10, 'middle', 600);
    s += mkText(480, 274, 'This prevents two drivers from conflicting when managing the same hardware controller.', C.muted, 9, 'middle', 400);

    return s;
}

/* Step 7: EXCLUSIVE */
function renderOpenStep7(W, H) {
    var s = dxeCoreBox(W, 'DXE Core — EXCLUSIVE (0x20)');

    /* Device Handle */
    var hx = 30, hy = 70;
    s = drawHandle(s, hx, hy, 'XHCI Controller', [
        {name:'EFI_PCI_IO_PROTOCOL', color:C.proto, highlight:true},
    ], {w:200, borderColor:C.accent});

    /* Existing driver */
    s = drawDriverHandle(s, 270, 70, 'Original Driver', false, false);

    /* Existing OPD */
    s += mkRect(270, 160, 180, 60, 'rgba(248,113,113,0.1)', C.warn, 8, ' stroke-dasharray="5,3"');
    s += mkText(360, 180, 'Existing OPD (BY_DRIVER)', C.warn, 9, 'middle', 600);
    s += mkText(360, 198, 'Agent: Original Driver', C.warn, 9, 'middle', 400);

    /* Override driver */
    s = drawDriverHandle(s, 500, 70, 'Override Driver', true, false);

    /* Flow */
    s += mkRect(500, 170, 420, 195, 'rgba(248,113,113,0.06)', C.warn, 10);
    s += mkText(710, 188, 'EXCLUSIVE Override Flow:', C.warn, 11, 'middle', 700);
    s += mkLine(510, 196, 910, 196, C.warn);
    var steps = [
        '1. Scan OpenList: found BY_DRIVER record for Original Driver',
        '2. Call CoreDisconnectController(Handle, OriginalDriver)',
        '3. Original Driver\'s Stop() is called -> cleanup',
        '4. Existing OPEN_PROTOCOL_DATA removed',
        '5. Create new OPD: Agent=Override Driver, Attr=EXCLUSIVE',
        '6. Return EFI_SUCCESS — override complete',
    ];
    steps.forEach(function(st, i) {
        var col = (i===1||i===2) ? C.warn : (i===4||i===5 ? C.child : C.muted);
        s += mkText(512, 214+i*22, st, col, 9, 'start', (i===1||i===4)?600:400);
    });

    /* arrow */
    s += mkArrow(500, 105, 450, 140, C.warn, false, 'exc_disc');

    return s;
}

/* Step 8: BY_CHILD_CONTROLLER */
function renderOpenStep8(W, H) {
    var s = dxeCoreBox(W, 'DXE Core — BY_CHILD_CONTROLLER (0x08)');

    /* Parent Handle */
    var hx = 30, hy = 70;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller (Parent)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
        {name:'EFI_USB2_HC_PROTOCOL',     color:C.primary},
    ], {w:240, borderColor:C.accent});

    /* Bus Driver */
    s = drawDriverHandle(s, 310, 70, 'USB Bus Driver', true, false);

    /* Child Handles */
    var chx = 550, chy = 70;
    s = drawHandle(s, chx, chy, 'USB Keyboard (Child)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:200, borderColor:C.child});

    var ch2x = 550, ch2y = 210;
    s = drawHandle(s, ch2x, ch2y, 'USB Storage (Child)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:200, borderColor:C.child});

    /* BY_CHILD_CONTROLLER arrows */
    s += mkArrow(310+90, 140, hx+240, hy+95, C.child, false, 'bus_open');
    s += mkLabel(315, 145, 'OpenProtocol(BY_CHILD)', C.child, 9);

    /* OPD records */
    s += mkRect(790, 70, 160, 80, 'rgba(52,211,153,0.08)', C.child, 8);
    s += mkText(870, 86, 'OPD Record #1', C.child, 9, 'middle', 700);
    s += mkLine(800, 94, 940, 94, C.child);
    s += mkText(800, 108, 'Agent: USB Bus', C.muted, 8, 'start');
    s += mkText(800, 122, 'Ctrl: USB Keyboard', C.child, 8, 'start', 600);
    s += mkText(800, 136, 'Attr: BY_CHILD_CTRL', C.child, 8, 'start', 600);

    s += mkRect(790, 170, 160, 80, 'rgba(52,211,153,0.08)', C.child, 8);
    s += mkText(870, 186, 'OPD Record #2', C.child, 9, 'middle', 700);
    s += mkLine(800, 194, 940, 194, C.child);
    s += mkText(800, 208, 'Agent: USB Bus', C.muted, 8, 'start');
    s += mkText(800, 222, 'Ctrl: USB Storage', C.child, 8, 'start', 600);
    s += mkText(800, 236, 'Attr: BY_CHILD_CTRL', C.child, 8, 'start', 600);

    s += mkArrow(chx+200, chy+40, 790, 110, C.child, true, 'ch1_opd');
    s += mkArrow(ch2x+200, ch2y+40, 790, 210, C.child, true, 'ch2_opd');

    /* explanation */
    s += mkRect(30, 340, 920, 45, 'rgba(52,211,153,0.06)', C.child, 8);
    s += mkText(490, 358, 'BY_CHILD_CONTROLLER records the parent-child relationship on the PARENT\'s protocol.', C.child, 10, 'middle', 600);
    s += mkText(490, 374, 'DisconnectController(Parent) scans these records to Stop() all children FIRST.', C.muted, 9, 'middle', 400);

    return s;
}

function updateOpenStep() {
    var step = OPEN_STEPS[openStep];
    var desc = document.getElementById('open-description');
    var svgEl = document.getElementById('open-svg');
    var ind   = document.getElementById('open-indicator');
    if (!desc || !svgEl || !step) return;

    desc.innerHTML = '<h3>'+escapeHtml(t(step.titleKey))+'</h3><p>'+escapeHtml(t(step.descKey))+'</p>';
    svgEl.innerHTML = step.render(960, 440);
    ind.textContent = (openStep+1)+' / '+OPEN_STEPS.length;

    document.getElementById('open-prev').disabled = (openStep === 0);
    document.getElementById('open-next').disabled = (openStep === OPEN_STEPS.length-1);
}

/* ================================================================== */
/*  SECTION 6: LocateProtocol Step-by-Step (4 steps)                   */
/* ================================================================== */
var LOC_STEPS = [
    { titleKey:'locp.step1.title', descKey:'locp.step1.desc', render: function(W,H){ return renderLocStep1(W,H); } },
    { titleKey:'locp.step2.title', descKey:'locp.step2.desc', render: function(W,H){ return renderLocStep2(W,H); } },
    { titleKey:'locp.step3.title', descKey:'locp.step3.desc', render: function(W,H){ return renderLocStep3(W,H); } },
    { titleKey:'locp.step4.title', descKey:'locp.step4.desc', render: function(W,H){ return renderLocStep4(W,H); } },
];
var locStep = 0;

function locCoreBox(W) {
    var bx = W/2-130, by = 10, bw = 260, bh = 40;
    var s = mkRect(bx, by, bw, bh, C.primaryDim, C.primary, 8);
    s += mkText(W/2, by+24, 'DXE Core — LocateProtocol()', C.primary, 11, 'middle', 700);
    return s;
}

function renderLocStep1(W, H) {
    var s = locCoreBox(W);

    /* Caller */
    var cx = 40, cy = 80;
    s += mkRect(cx, cy, 200, 70, 'rgba(56,189,248,0.08)', C.core, 10);
    s += mkText(cx+100, cy+18, 'DXE Driver (caller)', C.core, 11, 'middle', 700);
    s += mkLine(cx+10, cy+26, cx+190, cy+26, C.core);
    s += mkText(cx+10, cy+42, 'Needs: gEfiSmmComm...', C.muted, 9, 'start');
    s += mkText(cx+10, cy+58, 'Protocol GUID', C.muted, 9, 'start');

    /* call */
    s += mkArrow(cx+200, cy+35, W/2-130, 30, C.primary, false, 'loc_call');
    s += mkLabel(cx+205, cy+28, 'LocateProtocol(GUID, NULL, &Iface)', C.primary, 9);

    /* System handles (showing the protocol is somewhere) */
    var handles = [
        {y:80, label:'Handle A', protos:['EFI_DEVICE_PATH_PROTOCOL'], dim:true},
        {y:180, label:'Handle B', protos:['EFI_SMM_COMMUNICATION_PROTOCOL'], dim:false},
        {y:280, label:'Handle C', protos:['EFI_BLOCK_IO_PROTOCOL'], dim:true},
    ];
    handles.forEach(function(h) {
        s = drawHandle(s, 600, h.y, h.label,
            h.protos.map(function(n) { return {name:n, color: h.dim ? C.dimText : C.primary}; }),
            {w:210, borderColor: h.dim ? C.dimText : C.primary, dimmed: h.dim});
    });

    s += mkText(705, 70, 'Handle Database', C.muted, 10, 'middle', 400);
    s += mkText(100, 180, '?', C.core, 28, 'middle', 700);

    return s;
}

function renderLocStep2(W, H) {
    var s = locCoreBox(W);

    /* gProtocolDatabase */
    s += mkRect(40, 70, 200, 40, 'rgba(20,184,166,0.1)', C.primary, 8);
    s += mkText(140, 86, 'gProtocolDatabase', C.primary, 11, 'middle', 700);
    s += mkText(140, 102, '(LIST_ENTRY head)', C.muted, 9, 'middle');

    /* Protocol Entries chain */
    var entries = [
        {x:40,  y:140, guid:'EFI_DEVICE_PATH_PROTOCOL_GUID', match:false},
        {x:300, y:140, guid:'EFI_SMM_COMMUNICATION_GUID',    match:true},
        {x:560, y:140, guid:'EFI_BLOCK_IO_PROTOCOL_GUID',    match:false},
    ];
    entries.forEach(function(e) {
        var col = e.match ? C.primary : C.dimText;
        var bg  = e.match ? 'rgba(20,184,166,0.1)' : C.dimmed;
        s += mkRect(e.x, e.y, 230, 70, bg, col, 8);
        s += mkText(e.x+115, e.y+16, 'PROTOCOL_ENTRY', col, 10, 'middle', 700);
        s += mkLine(e.x+8, e.y+24, e.x+222, e.y+24, col);
        s += mkText(e.x+10, e.y+40, e.guid, col, 8, 'start', e.match?700:400);
        s += mkText(e.x+10, e.y+56, 'Protocols -> [PI list]', e.match?C.primary:C.dimText, 8, 'start');
        if (e.match) {
            s += mkRect(e.x, e.y, 230, 70, 'none', C.primary, 8, ' stroke-width="2.5" stroke-dasharray="5,3"');
            s += mkText(e.x+115, e.y+80, 'GUID MATCH!', C.primary, 10, 'middle', 700);
        }
    });

    /* chain arrows */
    s += mkArrow(140, 110, entries[0].x+115, entries[0].y, C.muted, true, 'gpd_e0');
    s += mkArrow(entries[0].x+230, entries[0].y+35, entries[1].x, entries[1].y+35, C.muted, true, 'e0_e1');
    s += mkArrow(entries[1].x+230, entries[1].y+35, entries[2].x, entries[2].y+35, C.muted, true, 'e1_e2');

    /* search visual */
    s += mkText(50, 260, 'CoreFindProtocolEntry() walks gProtocolDatabase comparing each PE.ProtocolID with requested GUID', C.muted, 9, 'start');

    return s;
}

function renderLocStep3(W, H) {
    var s = locCoreBox(W);

    /* PE found */
    var pex = 40, pey = 70;
    s += mkRect(pex, pey, 250, 80, 'rgba(20,184,166,0.1)', C.primary, 8);
    s += mkText(pex+125, pey+16, 'PROTOCOL_ENTRY (matched)', C.primary, 10, 'middle', 700);
    s += mkLine(pex+8, pey+24, pex+242, pey+24, C.primary);
    s += mkText(pex+10, pey+40, 'ProtocolID: EFI_SMM_COMM_GUID', C.primary, 9, 'start', 600);
    s += mkText(pex+10, pey+56, 'Protocols -> [PI list head]', C.primary, 9, 'start');

    /* PROTOCOL_INTERFACE */
    var pix = 350, piy = 70;
    s += mkRect(pix, piy, 230, 100, 'rgba(167,139,250,0.1)', C.proto, 8);
    s += mkText(pix+115, piy+16, 'PROTOCOL_INTERFACE #1', C.proto, 10, 'middle', 700);
    s += mkLine(pix+8, piy+24, pix+222, piy+24, C.proto);
    s += mkText(pix+10, piy+40, 'Handle -> PiSmmIpl Handle', C.muted, 9, 'start');
    s += mkText(pix+10, piy+56, 'Protocol -> this PE', C.muted, 9, 'start');
    s += mkText(pix+10, piy+72, 'Interface -> 0x7FB00000', C.primary, 9, 'start', 700);
    s += mkText(pix+10, piy+88, '(SMM_COMMUNICATION instance)', C.muted, 9, 'start');

    /* Arrow PE -> PI */
    s += mkArrow(pex+250, pey+50, pix, piy+50, C.proto, false, 'pe_pi');
    s += mkLabel(pex+255, pey+44, 'First in Protocols list', C.proto, 9);

    /* Result highlight */
    s += mkRect(pix+8, piy+66, 214, 14, 'rgba(20,184,166,0.15)', C.primary, 3);

    /* explanation */
    s += mkRect(40, 200, 540, 40, 'rgba(20,184,166,0.08)', C.primary, 8);
    s += mkText(310, 224, 'Take first PROTOCOL_INTERFACE from PE.Protocols list', C.primary, 10, 'middle', 600);

    return s;
}

function renderLocStep4(W, H) {
    var s = locCoreBox(W);

    /* PI */
    var pix = 40, piy = 80;
    s += mkRect(pix, piy, 230, 80, 'rgba(167,139,250,0.08)', C.proto, 8);
    s += mkText(pix+115, piy+16, 'PROTOCOL_INTERFACE', C.proto, 10, 'middle', 700);
    s += mkLine(pix+8, piy+24, pix+222, piy+24, C.proto);
    s += mkText(pix+10, piy+40, 'Interface -> 0x7FB00000', C.primary, 9, 'start', 700);
    s += mkText(pix+10, piy+56, '(SMM_COMMUNICATION instance)', C.muted, 9, 'start');

    /* Caller receives */
    var rx = 340, ry = 80;
    s += mkRect(rx, ry, 260, 80, 'rgba(52,211,153,0.08)', C.child, 10);
    s += mkText(rx+130, ry+18, 'Caller receives:', C.child, 11, 'middle', 700);
    s += mkLine(rx+10, ry+26, rx+250, ry+26, C.child);
    s += mkText(rx+16, ry+42, '*Interface = 0x7FB00000', C.child, 10, 'start', 700);
    s += mkText(rx+16, ry+58, 'Return: EFI_SUCCESS', C.child, 10, 'start', 700);

    s += mkArrow(pix+230, piy+40, rx, ry+40, C.child, false, 'pi_caller');
    s += mkLabel(pix+235, piy+34, 'Interface pointer', C.child, 9);

    /* warning note */
    s += mkRect(40, 200, 560, 60, 'rgba(251,146,60,0.06)', C.accent, 8);
    s += mkText(320, 220, 'Note: LocateProtocol does NOT create OPEN_PROTOCOL_DATA.', C.accent, 10, 'middle', 700);
    s += mkText(320, 240, 'No consumer tracking. If you need tracking, use OpenProtocol(BY_DRIVER) after locating.', C.muted, 9, 'middle', 400);

    return s;
}

function updateLocStep() {
    var step = LOC_STEPS[locStep];
    var desc = document.getElementById('loc-description');
    var svgEl = document.getElementById('loc-svg');
    var ind   = document.getElementById('loc-indicator');
    if (!desc || !svgEl || !step) return;

    desc.innerHTML = '<h3>'+escapeHtml(t(step.titleKey))+'</h3><p>'+escapeHtml(t(step.descKey))+'</p>';
    svgEl.innerHTML = step.render(960, 380);
    ind.textContent = (locStep+1)+' / '+LOC_STEPS.length;

    document.getElementById('loc-prev').disabled = (locStep === 0);
    document.getElementById('loc-next').disabled = (locStep === LOC_STEPS.length-1);
}

/* ================================================================== */
/*  SECTION 7: LocateHandleBuffer Step-by-Step (5 steps)               */
/* ================================================================== */
var BUF_STEPS = [
    { titleKey:'locbuf.step1.title', descKey:'locbuf.step1.desc', render: function(W,H){ return renderBufStep1(W,H); } },
    { titleKey:'locbuf.step2.title', descKey:'locbuf.step2.desc', render: function(W,H){ return renderBufStep2(W,H); } },
    { titleKey:'locbuf.step3.title', descKey:'locbuf.step3.desc', render: function(W,H){ return renderBufStep3(W,H); } },
    { titleKey:'locbuf.step4.title', descKey:'locbuf.step4.desc', render: function(W,H){ return renderBufStep4(W,H); } },
    { titleKey:'locbuf.step5.title', descKey:'locbuf.step5.desc', render: function(W,H){ return renderBufStep5(W,H); } },
];
var bufStep = 0;

function bufCoreBox(W) {
    var bx = W/2-140, by = 10, bw = 280, bh = 40;
    var s = mkRect(bx, by, bw, bh, C.protoDim, C.proto, 8);
    s += mkText(W/2, by+24, 'DXE Core — LocateHandleBuffer()', C.proto, 11, 'middle', 700);
    return s;
}

function renderBufStep1(W, H) {
    var s = bufCoreBox(W);

    /* Caller */
    var cx = 40, cy = 80;
    s += mkRect(cx, cy, 220, 60, 'rgba(167,139,250,0.08)', C.proto, 10);
    s += mkText(cx+110, cy+18, 'Boot Manager (caller)', C.proto, 11, 'middle', 700);
    s += mkLine(cx+10, cy+26, cx+210, cy+26, C.proto);
    s += mkText(cx+10, cy+42, 'Needs: all BLOCK_IO handles', C.muted, 9, 'start');

    s += mkArrow(cx+220, cy+30, W/2-140, 30, C.proto, false, 'buf_call');

    /* System handles with BLOCK_IO */
    var handles = [
        {y:80,  label:'NVMe Namespace',  has:true},
        {y:160, label:'SATA Disk',       has:true},
        {y:240, label:'USB Mass Storage', has:true},
        {y:320, label:'Network Ctrl',    has:false},
    ];

    handles.forEach(function(h) {
        var protos = h.has
            ? [{name:'EFI_BLOCK_IO_PROTOCOL', color:C.proto}]
            : [{name:'EFI_NETWORK_PROTOCOL', color:C.dimText}];
        s = drawHandle(s, 550, h.y, h.label, protos,
            {w:190, borderColor: h.has ? C.proto : C.dimText, dimmed: !h.has});
    });

    s += mkText(645, 70, 'Handle Database', C.muted, 10, 'middle', 400);
    s += mkText(645, 418, '3 of 4 handles match BLOCK_IO', C.proto, 10, 'middle', 600);

    return s;
}

function renderBufStep2(W, H) {
    var s = bufCoreBox(W);

    /* PROTOCOL_ENTRY */
    var pex = 40, pey = 80;
    s += mkRect(pex, pey, 260, 80, 'rgba(167,139,250,0.1)', C.proto, 8);
    s += mkText(pex+130, pey+16, 'PROTOCOL_ENTRY', C.proto, 10, 'middle', 700);
    s += mkLine(pex+8, pey+24, pex+252, pey+24, C.proto);
    s += mkText(pex+10, pey+40, 'ProtocolID: EFI_BLOCK_IO_PROTOCOL', C.proto, 9, 'start', 600);
    s += mkText(pex+10, pey+56, 'Protocols -> [3 PIs linked]', C.proto, 9, 'start');

    /* First call visualization */
    var bx = 350, by = 70;
    s += mkRect(bx, by, 560, 130, 'rgba(167,139,250,0.06)', C.proto, 10);
    s += mkText(bx+280, by+18, 'CoreLocateHandle() — First Call (sizing)', C.proto, 11, 'middle', 700);
    s += mkLine(bx+10, by+26, bx+550, by+26, C.proto);
    s += mkText(bx+16, by+44, 'BufferSize = 0  (passed in)', C.muted, 9.5, 'start');
    s += mkText(bx+16, by+62, 'Walk PE.Protocols: count = 3 matching PIs', C.proto, 9.5, 'start', 600);
    s += mkText(bx+16, by+80, 'Required size = 3 * sizeof(EFI_HANDLE) = 24 bytes', C.text, 9.5, 'start', 600);
    s += mkText(bx+16, by+98, 'Return: EFI_BUFFER_TOO_SMALL', C.accent, 9.5, 'start', 700);
    s += mkText(bx+16, by+116, 'BufferSize = 24 (written back)', C.accent, 9.5, 'start', 600);

    s += mkArrow(pex+260, pey+40, bx, by+60, C.proto, false, 'pe_loc');

    return s;
}

function renderBufStep3(W, H) {
    var s = bufCoreBox(W);

    /* Allocation */
    var bx = 40, by = 80;
    s += mkRect(bx, by, 880, 100, 'rgba(251,146,60,0.06)', C.accent, 10);
    s += mkText(bx+440, by+18, 'CoreAllocatePool() — Allocate Buffer', C.accent, 11, 'middle', 700);
    s += mkLine(bx+10, by+26, bx+870, by+26, C.accent);
    s += mkText(bx+16, by+44, 'Size: 24 bytes (3 * sizeof(EFI_HANDLE))', C.text, 10, 'start', 600);
    s += mkText(bx+16, by+62, 'Type: EfiBootServicesData', C.muted, 10, 'start');
    s += mkText(bx+16, by+80, 'Address: 0x7FC00000 (allocated by pool allocator)', C.accent, 10, 'start', 600);

    /* Buffer visual */
    var bufX = 200, bufY = 220;
    s += mkRect(bufX, bufY, 560, 60, 'rgba(251,146,60,0.08)', C.accent, 8);
    s += mkText(bufX+280, bufY+16, 'Allocated Buffer (24 bytes, uninitialized)', C.accent, 10, 'middle', 700);
    s += mkLine(bufX+8, bufY+24, bufX+552, bufY+24, C.accent);

    /* 3 slots */
    var slotW = 170;
    for (var i = 0; i < 3; i++) {
        var sx = bufX + 15 + i * (slotW + 15);
        s += mkRect(sx, bufY+30, slotW, 22, 'rgba(139,155,176,0.08)', C.muted, 4);
        s += mkText(sx+slotW/2, bufY+44, 'Buffer['+i+']: (empty)', C.dimText, 9, 'middle');
    }

    return s;
}

function renderBufStep4(W, H) {
    var s = bufCoreBox(W);

    /* PE -> PI chain visualization */
    var pex = 40, pey = 70;
    s += mkRect(pex, pey, 180, 50, 'rgba(167,139,250,0.1)', C.proto, 8);
    s += mkText(pex+90, pey+16, 'PROTOCOL_ENTRY', C.proto, 10, 'middle', 700);
    s += mkText(pex+90, pey+36, 'EFI_BLOCK_IO_PROTOCOL', C.proto, 8, 'middle');

    /* 3 PIs */
    var pis = [
        {x:260, label:'NVMe Namespace', addr:'0x7F800000'},
        {x:475, label:'SATA Disk',      addr:'0x7F900000'},
        {x:690, label:'USB Storage',    addr:'0x7FA00000'},
    ];
    pis.forEach(function(p, i) {
        s += mkRect(p.x, pey, 190, 60, 'rgba(167,139,250,0.08)', C.proto, 8);
        s += mkText(p.x+95, pey+16, 'PROTOCOL_INTERFACE #'+(i+1), C.proto, 9, 'middle', 600);
        s += mkLine(p.x+8, pey+24, p.x+182, pey+24, C.proto);
        s += mkText(p.x+10, pey+38, 'Handle -> '+p.label, C.muted, 8, 'start');
        s += mkText(p.x+10, pey+52, 'IHANDLE @ '+p.addr, C.proto, 8, 'start', 600);
    });

    /* chain arrows */
    s += mkArrow(pex+180, pey+25, pis[0].x, pey+25, C.proto, true, 'pe_pi1');
    s += mkArrow(pis[0].x+190, pey+25, pis[1].x, pey+25, C.muted, true, 'pi1_pi2');
    s += mkArrow(pis[1].x+190, pey+25, pis[2].x, pey+25, C.muted, true, 'pi2_pi3');

    /* Buffer being filled */
    var bufX = 200, bufY = 180;
    s += mkRect(bufX, bufY, 560, 70, 'rgba(52,211,153,0.08)', C.child, 8);
    s += mkText(bufX+280, bufY+16, 'Buffer[] — Being Filled', C.child, 10, 'middle', 700);
    s += mkLine(bufX+8, bufY+24, bufX+552, bufY+24, C.child);

    var slotW = 170;
    var colors = [C.proto, C.proto, C.proto];
    pis.forEach(function(p, i) {
        var sx = bufX + 15 + i * (slotW + 15);
        s += mkRect(sx, bufY+32, slotW, 28, 'rgba(167,139,250,0.12)', C.proto, 4);
        s += mkText(sx+slotW/2, bufY+44, 'Buffer['+i+'] = '+p.addr, C.proto, 9, 'middle', 600);

        /* arrow from PI to buffer slot */
        s += mkArrow(p.x+95, pey+60, sx+slotW/2, bufY+32, C.child, true, 'pi_buf'+i);
    });

    /* explanation */
    s += mkRect(40, 280, 880, 40, 'rgba(167,139,250,0.06)', C.proto, 8);
    s += mkText(480, 304, 'CoreLocateHandle() walks PE.Protocols chain, collects each PI.Handle into the buffer.', C.proto, 10, 'middle', 600);

    return s;
}

function renderBufStep5(W, H) {
    var s = bufCoreBox(W);

    /* Result */
    var rx = 100, ry = 80;
    s += mkRect(rx, ry, 760, 130, 'rgba(52,211,153,0.08)', C.child, 10);
    s += mkText(rx+380, ry+18, 'Return to Caller', C.child, 12, 'middle', 700);
    s += mkLine(rx+10, ry+28, rx+750, ry+28, C.child);
    s += mkText(rx+16, ry+48, 'NumberOfHandles = 3', C.child, 11, 'start', 700);
    s += mkText(rx+16, ry+68, 'Buffer[0] = 0x7F800000  (NVMe Namespace)', C.proto, 10, 'start', 600);
    s += mkText(rx+16, ry+86, 'Buffer[1] = 0x7F900000  (SATA Disk)', C.proto, 10, 'start', 600);
    s += mkText(rx+16, ry+104, 'Buffer[2] = 0x7FA00000  (USB Mass Storage)', C.proto, 10, 'start', 600);
    s += mkText(rx+500, ry+48, 'Return: EFI_SUCCESS', C.child, 11, 'start', 700);

    /* FreePool reminder */
    s += mkRect(100, 240, 760, 70, 'rgba(248,113,113,0.06)', C.warn, 10);
    s += mkText(480, 262, 'IMPORTANT: Caller MUST call gBS->FreePool(Buffer) after use!', C.warn, 11, 'middle', 700);
    s += mkText(480, 282, 'The buffer was allocated by CoreAllocatePool inside LocateHandleBuffer.', C.muted, 9.5, 'middle', 400);
    s += mkText(480, 298, 'Forgetting to free causes a memory leak that persists until ExitBootServices().', C.muted, 9.5, 'middle', 400);

    /* done banner */
    s += mkRect(W/2-160, 340, 320, 44, 'rgba(52,211,153,0.12)', C.child, 10);
    s += mkText(W/2, 366, '✓  LocateHandleBuffer() Complete', C.child, 12, 'middle', 700);

    return s;
}

function updateBufStep() {
    var step = BUF_STEPS[bufStep];
    var desc = document.getElementById('buf-description');
    var svgEl = document.getElementById('buf-svg');
    var ind   = document.getElementById('buf-indicator');
    if (!desc || !svgEl || !step) return;

    desc.innerHTML = '<h3>'+escapeHtml(t(step.titleKey))+'</h3><p>'+escapeHtml(t(step.descKey))+'</p>';
    svgEl.innerHTML = step.render(960, 420);
    ind.textContent = (bufStep+1)+' / '+BUF_STEPS.length;

    document.getElementById('buf-prev').disabled = (bufStep === 0);
    document.getElementById('buf-next').disabled = (bufStep === BUF_STEPS.length-1);
}

/* ================================================================== */
/*  SECTION 4: Attribute Comparison Table                              */
/* ================================================================== */
function renderAttrTable() {
    var tbl = document.getElementById('attr-table');
    if (!tbl) return;

    var cols = [
        t('attr.col.attribute'), t('attr.col.tracking'), t('attr.col.exclusive'),
        t('attr.col.disconnect'), t('attr.col.typical'), t('attr.col.example')
    ];

    var rows = [
        { name:'attr.byhandle', badge:['yes','no','no'] },
        { name:'attr.get',      badge:['yes','no','no'] },
        { name:'attr.test',     badge:['no','no','no'] },
        { name:'attr.bydriver', badge:['yes','warn','no'] },
        { name:'attr.bychild',  badge:['yes','no','no'] },
        { name:'attr.exclusive',badge:['yes','warn','warn'] },
    ];

    var html = '<thead><tr>';
    cols.forEach(function(c) { html += '<th>'+escapeHtml(c)+'</th>'; });
    html += '</tr></thead><tbody>';

    rows.forEach(function(r) {
        html += '<tr>';
        html += '<td class="attr-name">'+escapeHtml(t(r.name+'.name'))+'</td>';
        html += '<td>'+escapeHtml(t(r.name+'.tracking'))+'</td>';

        /* exclusive */
        var excText = t(r.name+'.exclusive');
        var excClass = r.badge[1]==='warn'?'badge-warn':'badge-no';
        html += '<td><span class="'+excClass+'">'+escapeHtml(excText)+'</span></td>';

        /* disconnect */
        var disText = t(r.name+'.disconnect');
        var disClass = r.badge[2]==='warn'?'badge-warn':'badge-no';
        html += '<td><span class="'+disClass+'">'+escapeHtml(disText)+'</span></td>';

        html += '<td>'+escapeHtml(t(r.name+'.typical'))+'</td>';
        html += '<td>'+escapeHtml(t(r.name+'.example'))+'</td>';
        html += '</tr>';
    });

    html += '</tbody>';
    tbl.innerHTML = html;
}

/* ================================================================== */
/*  SECTION 9: Code Tabs                                               */
/* ================================================================== */
var CODE_OPEN = [
'<span class="cm">// MdeModulePkg/Core/Dxe/Hand/Handle.c (simplified)</span>',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">CoreOpenProtocol</span> (',
'  <span class="kw">IN</span>  <span class="tp">EFI_HANDLE</span>  UserHandle,',
'  <span class="kw">IN</span>  <span class="tp">EFI_GUID</span>    *Protocol,',
'  <span class="kw">OUT</span> <span class="tp">VOID</span>        **Interface  <span class="cm">OPTIONAL</span>,',
'  <span class="kw">IN</span>  <span class="tp">EFI_HANDLE</span>  ImageHandle,',
'  <span class="kw">IN</span>  <span class="tp">EFI_HANDLE</span>  ControllerHandle,',
'  <span class="kw">IN</span>  <span class="tp">UINT32</span>      Attributes',
')',
'{',
'  <span class="tp">PROTOCOL_INTERFACE</span>  *Prot;',
'  <span class="tp">OPEN_PROTOCOL_DATA</span>  *OpenData;',
'',
'  <span class="cm">// 1. Validate handles</span>',
'  <span class="kw">if</span> (<span class="fn">CoreValidateHandle</span>(UserHandle) == <span class="kw">NULL</span>)',
'    <span class="kw">return</span> EFI_INVALID_PARAMETER;',
'',
'  <span class="cm">// 2. Find PROTOCOL_INTERFACE matching the GUID</span>',
'  Prot = <span class="fn">CoreGetProtocolInterface</span>(UserHandle, Protocol);',
'  <span class="kw">if</span> (Prot == <span class="kw">NULL</span>) <span class="kw">return</span> EFI_UNSUPPORTED;',
'',
'  <span class="cm">// 3. TEST_PROTOCOL — just check existence</span>',
'  <span class="kw">if</span> (Attributes == EFI_OPEN_PROTOCOL_TEST_PROTOCOL) {',
'    <span class="kw">return</span> EFI_SUCCESS;  <span class="cm">// no interface, no tracking</span>',
'  }',
'',
'  <span class="cm">// 4. BY_DRIVER — conflict check</span>',
'  <span class="kw">if</span> (Attributes & EFI_OPEN_PROTOCOL_BY_DRIVER) {',
'    <span class="kw">for</span> each OpenData in Prot->OpenList {',
'      <span class="kw">if</span> (OpenData->Attributes & BY_DRIVER',
'          && OpenData->AgentHandle != ImageHandle) {',
'        <span class="kw">return</span> EFI_ACCESS_DENIED;  <span class="cm">// another driver!</span>',
'      }',
'    }',
'  }',
'',
'  <span class="cm">// 5. EXCLUSIVE — disconnect existing drivers</span>',
'  <span class="kw">if</span> (Attributes & EFI_OPEN_PROTOCOL_EXCLUSIVE) {',
'    <span class="kw">for</span> each OpenData in Prot->OpenList {',
'      <span class="kw">if</span> (OpenData->Attributes & BY_DRIVER) {',
'        <span class="fn">CoreDisconnectController</span>(',
'          UserHandle, OpenData->AgentHandle, <span class="kw">NULL</span>);',
'      }',
'    }',
'  }',
'',
'  <span class="cm">// 6. Create/update OPEN_PROTOCOL_DATA</span>',
'  OpenData = <span class="fn">AllocateZeroPool</span>(<span class="kw">sizeof</span>(<span class="tp">OPEN_PROTOCOL_DATA</span>));',
'  OpenData->AgentHandle      = ImageHandle;',
'  OpenData->ControllerHandle = ControllerHandle;',
'  OpenData->Attributes       = Attributes;',
'  OpenData->OpenCount         = <span class="num">1</span>;',
'  <span class="fn">InsertTailList</span>(&Prot->OpenList, &OpenData->Link);',
'',
'  *Interface = Prot->Interface;',
'  <span class="kw">return</span> EFI_SUCCESS;',
'}',
].join('\n');

var CODE_LOCATE = [
'<span class="cm">// MdeModulePkg/Core/Dxe/Hand/Locate.c (simplified)</span>',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">CoreLocateProtocol</span> (',
'  <span class="kw">IN</span>  <span class="tp">EFI_GUID</span>  *Protocol,',
'  <span class="kw">IN</span>  <span class="tp">VOID</span>      *Registration  <span class="cm">OPTIONAL</span>,',
'  <span class="kw">OUT</span> <span class="tp">VOID</span>      **Interface',
')',
'{',
'  <span class="tp">PROTOCOL_ENTRY</span>      *ProtEntry;',
'  <span class="tp">PROTOCOL_INTERFACE</span>  *Prot;',
'  <span class="tp">LIST_ENTRY</span>          *Link;',
'',
'  <span class="cm">// 1. Find PROTOCOL_ENTRY in gProtocolDatabase</span>',
'  ProtEntry = <span class="fn">CoreFindProtocolEntry</span>(Protocol, <span class="kw">FALSE</span>);',
'  <span class="kw">if</span> (ProtEntry == <span class="kw">NULL</span>) <span class="kw">return</span> EFI_NOT_FOUND;',
'',
'  <span class="cm">// 2. If Registration provided, use notify-based search</span>',
'  <span class="cm">// 3. Otherwise, get first entry from Protocols list</span>',
'  <span class="kw">if</span> (<span class="fn">IsListEmpty</span>(&ProtEntry->Protocols)) {',
'    <span class="kw">return</span> EFI_NOT_FOUND;',
'  }',
'',
'  Link = ProtEntry->Protocols.ForwardLink;',
'  Prot = CR(Link, <span class="tp">PROTOCOL_INTERFACE</span>, ByProtocol,',
'           PROTOCOL_INTERFACE_SIGNATURE);',
'',
'  <span class="cm">// 4. Return the interface pointer</span>',
'  *Interface = Prot->Interface;',
'  <span class="kw">return</span> EFI_SUCCESS;',
'}',
].join('\n');

var CODE_LOCBUF = [
'<span class="cm">// MdeModulePkg/Core/Dxe/Hand/Locate.c (simplified)</span>',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">CoreLocateHandleBuffer</span> (',
'  <span class="kw">IN</span>     <span class="tp">EFI_LOCATE_SEARCH_TYPE</span>  SearchType,',
'  <span class="kw">IN</span>     <span class="tp">EFI_GUID</span>                *Protocol   <span class="cm">OPTIONAL</span>,',
'  <span class="kw">IN</span>     <span class="tp">VOID</span>                    *SearchKey  <span class="cm">OPTIONAL</span>,',
'  <span class="kw">IN OUT</span> <span class="tp">UINTN</span>                   *NoHandles,',
'  <span class="kw">OUT</span>    <span class="tp">EFI_HANDLE</span>              **Buffer',
')',
'{',
'  <span class="tp">EFI_STATUS</span>  Status;',
'  <span class="tp">UINTN</span>       BufferSize;',
'',
'  <span class="cm">// 1. First call — get required buffer size</span>',
'  BufferSize = <span class="num">0</span>;',
'  Status = <span class="fn">CoreLocateHandle</span>(',
'             SearchType, Protocol, SearchKey,',
'             &BufferSize, <span class="kw">NULL</span>);',
'  <span class="cm">// Returns EFI_BUFFER_TOO_SMALL, BufferSize filled</span>',
'',
'  <span class="cm">// 2. Allocate the buffer</span>',
'  *Buffer = <span class="fn">AllocatePool</span>(BufferSize);',
'  <span class="kw">if</span> (*Buffer == <span class="kw">NULL</span>) <span class="kw">return</span> EFI_OUT_OF_RESOURCES;',
'',
'  <span class="cm">// 3. Second call — fill the buffer</span>',
'  Status = <span class="fn">CoreLocateHandle</span>(',
'             SearchType, Protocol, SearchKey,',
'             &BufferSize, *Buffer);',
'',
'  *NoHandles = BufferSize / <span class="kw">sizeof</span>(<span class="tp">EFI_HANDLE</span>);',
'  <span class="kw">return</span> Status;',
'',
'  <span class="cm">// Note: Caller MUST FreePool(*Buffer) when done!</span>',
'}',
].join('\n');

function initCodeTabs() {
    var pre = document.getElementById('code-open-pre');
    if (pre) pre.innerHTML = CODE_OPEN;
    pre = document.getElementById('code-locate-pre');
    if (pre) pre.innerHTML = CODE_LOCATE;
    pre = document.getElementById('code-locbuf-pre');
    if (pre) pre.innerHTML = CODE_LOCBUF;

    document.querySelectorAll('.code-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var name = tab.dataset.tab;
            document.querySelectorAll('.code-tab').forEach(function(t){ t.classList.remove('active'); });
            document.querySelectorAll('.code-pane').forEach(function(p){ p.classList.remove('active'); });
            tab.classList.add('active');
            var pane = document.getElementById('pane-'+name);
            if (pane) pane.classList.add('active');
        });
    });
}

/* ================================================================== */
/*  Nav highlight on scroll                                            */
/* ================================================================== */
function initNavHighlight() {
    var sections = document.querySelectorAll('section[id], header[id]');
    var links    = document.querySelectorAll('.nav-link');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                links.forEach(function(l){ l.classList.remove('active'); });
                var active = document.querySelector('.nav-link[href="#'+entry.target.id+'"]');
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function(s){ observer.observe(s); });
}

/* ================================================================== */
/*  Language change hook                                               */
/* ================================================================== */
function onLangChange() {
    updateOpenStep();
    updateLocStep();
    updateBufStep();
    renderAttrTable();
}

/* ================================================================== */
/*  Init                                                               */
/* ================================================================== */
document.addEventListener('DOMContentLoaded', function() {

    /* structs diagram */
    renderStructsDiagram();

    /* attribute table */
    renderAttrTable();

    /* OpenProtocol steps */
    updateOpenStep();
    document.getElementById('open-prev').addEventListener('click', function() {
        if (openStep > 0) { openStep--; updateOpenStep(); }
    });
    document.getElementById('open-next').addEventListener('click', function() {
        if (openStep < OPEN_STEPS.length-1) { openStep++; updateOpenStep(); }
    });
    document.getElementById('open-reset').addEventListener('click', function() {
        openStep = 0; updateOpenStep();
    });

    /* LocateProtocol steps */
    updateLocStep();
    document.getElementById('loc-prev').addEventListener('click', function() {
        if (locStep > 0) { locStep--; updateLocStep(); }
    });
    document.getElementById('loc-next').addEventListener('click', function() {
        if (locStep < LOC_STEPS.length-1) { locStep++; updateLocStep(); }
    });
    document.getElementById('loc-reset').addEventListener('click', function() {
        locStep = 0; updateLocStep();
    });

    /* LocateHandleBuffer steps */
    updateBufStep();
    document.getElementById('buf-prev').addEventListener('click', function() {
        if (bufStep > 0) { bufStep--; updateBufStep(); }
    });
    document.getElementById('buf-next').addEventListener('click', function() {
        if (bufStep < BUF_STEPS.length-1) { bufStep++; updateBufStep(); }
    });
    document.getElementById('buf-reset').addEventListener('click', function() {
        bufStep = 0; updateBufStep();
    });

    /* keyboard navigation */
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowLeft') {
            if (openStep > 0) { openStep--; updateOpenStep(); }
            if (locStep > 0)  { locStep--;  updateLocStep();  }
            if (bufStep > 0)  { bufStep--;  updateBufStep();  }
        }
        if (e.key === 'ArrowRight') {
            if (openStep < OPEN_STEPS.length - 1) { openStep++; updateOpenStep(); }
            if (locStep < LOC_STEPS.length - 1)   { locStep++;  updateLocStep();  }
            if (bufStep < BUF_STEPS.length - 1)   { bufStep++;  updateBufStep();  }
        }
    });

    /* code tabs */
    initCodeTabs();

    /* nav */
    initNavHighlight();
});
