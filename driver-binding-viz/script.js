/* ------------------------------------------------------------------ */
/*  UEFI Driver Binding Mechanism Visualizer – Main Script             */
/*  Sections: structs diagram, ConnectController, DisconnectController, */
/*            scenario diagram, code tabs                              */
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
/*  Draws a compact IHANDLE with its protocol list                   */
/*  protocols: [{name, color, isNew, isDim}]                         */
function drawHandle(svg, x, y, label, protocols, opts) {
    opts = opts || {};
    var w = opts.w || 220;
    var headerH = 36;
    var rowH    = 26;
    var h = headerH + protocols.length * rowH + 10;
    var borderColor = opts.borderColor || C.accent;
    var dimmed = opts.dimmed || false;

    /* outer box */
    svg += mkRect(x, y, w, h, dimmed ? C.dimmed : 'rgba(251,146,60,0.07)', dimmed ? C.dimText : borderColor, 10);

    /* header */
    svg += mkRect(x, y, w, headerH, dimmed ? C.dimmed : 'rgba(251,146,60,0.18)', 'none', '10 10 0 0');
    svg += mkText(x+14, y+14, 'IHANDLE', dimmed ? C.dimText : C.accent, 11, 'start', 700);
    svg += mkText(x+14, y+27, label, dimmed ? C.dimText : C.text, 10, 'start', 500);

    /* protocols list */
    var py = y + headerH + 4;
    protocols.forEach(function(p) {
        var pColor = dimmed ? C.dimText : (p.color || C.proto);
        svg += mkRect(x+8, py+1, w-16, rowH-3, dimmed ? 'rgba(255,255,255,0.02)' : 'rgba(167,139,250,0.08)', dimmed ? 'rgba(255,255,255,0.04)' : 'rgba(167,139,250,0.2)', 5);
        if (p.isNew && !dimmed) {
            svg += mkRect(x+8, py+1, w-16, rowH-3, 'rgba(20,184,166,0.12)', C.primary, 5);
        }
        var nameColor = p.isNew && !dimmed ? C.primary : (p.isDim ? C.dimText : pColor);
        svg += mkText(x+16, py+14, p.name, nameColor, 10, 'start', p.isNew ? 700 : 500);
        if (p.isNew && !dimmed) {
            svg += mkText(x+w-12, py+14, 'NEW', C.primary, 9, 'end', 700);
        }
        py += rowH;
    });
    return svg;
}

/* draws an IHANDLE that shows "removed" protocols */
function drawHandleWithRemoved(svg, x, y, label, protocols, opts) {
    opts = opts || {};
    var w = opts.w || 220;
    var headerH = 36;
    var rowH    = 26;
    var h = headerH + protocols.length * rowH + 10;
    var borderColor = opts.borderColor || C.accent;

    svg += mkRect(x, y, w, h, 'rgba(251,146,60,0.07)', borderColor, 10);
    svg += mkRect(x, y, w, headerH, 'rgba(251,146,60,0.18)', 'none', '10 10 0 0');
    svg += mkText(x+14, y+14, 'IHANDLE', C.accent, 11, 'start', 700);
    svg += mkText(x+14, y+27, label, C.text, 10, 'start', 500);

    var py = y + headerH + 4;
    protocols.forEach(function(p) {
        if (p.isRemoving) {
            svg += mkRect(x+8, py+1, w-16, rowH-3, 'rgba(248,113,113,0.12)', C.warn, 5);
            svg += mkText(x+16, py+14, p.name, C.warn, 10, 'start', 500);
            svg += mkText(x+w-12, py+14, 'REMOVED', C.warn, 8, 'end', 700);
        } else {
            svg += mkRect(x+8, py+1, w-16, rowH-3, 'rgba(167,139,250,0.08)', 'rgba(167,139,250,0.2)', 5);
            svg += mkText(x+16, py+14, p.name, p.color || C.proto, 10, 'start', 500);
        }
        py += rowH;
    });
    return svg;
}

/* draws the global driver binding protocol driver handle */
function drawDriverHandle(svg, x, y, label, version, active, dimmed) {
    var w = 190, h = 90;
    var bcolor = dimmed ? C.dimText : (active ? C.primary : C.core);
    var bg = dimmed ? C.dimmed : (active ? C.primaryDim : C.coreDim);
    svg += mkRect(x, y, w, h, bg, bcolor, 10);
    svg += mkText(x+w/2, y+18, 'Driver Handle', dimmed?C.dimText:bcolor, 11, 'middle', 700);
    svg += mkLine(x+10, y+26, x+w-10, y+26, dimmed?'#2a3040':bcolor);
    svg += mkText(x+w/2, y+42, label, dimmed?C.dimText:C.text, 10, 'middle', 500);
    svg += mkText(x+w/2, y+58, 'EFI_DRIVER_BINDING_PROTOCOL', dimmed?C.dimText:C.proto, 9, 'middle', 400);
    svg += mkText(x+w/2, y+72, 'Version: '+version, dimmed?C.dimText:C.muted, 9, 'middle', 400);
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

    var W = 960, H = 420;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    /* ---- global handle list label ---- */
    svg += mkRect(10, 10, 160, 40, 'rgba(56,189,248,0.1)', C.core, 8);
    svg += mkText(90, 28, 'gHandleList', C.core, 12, 'middle', 700);
    svg += mkText(90, 42, '(LIST_ENTRY head)', C.muted, 9, 'middle', 400);

    /* ---- gProtocolDatabase label ---- */
    svg += mkRect(W-175, 10, 165, 40, 'rgba(20,184,166,0.1)', C.primary, 8);
    svg += mkText(W-93, 28, 'gProtocolDatabase', C.primary, 12, 'middle', 700);
    svg += mkText(W-93, 42, '(LIST_ENTRY head)', C.muted, 9, 'middle', 400);

    /* ---- IHANDLE A ---- */
    var hx1 = 60, hy1 = 80;
    svg = drawHandle(svg, hx1, hy1, 'Handle A  (0x7F800000)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:210, borderColor:C.accent});

    /* ---- IHANDLE B ---- */
    var hx2 = 310, hy2 = 80;
    svg = drawHandle(svg, hx2, hy2, 'Handle B  (0x7F900000)', [
        {name:'EFI_DRIVER_BINDING_PROTOCOL', color:C.proto},
        {name:'EFI_COMPONENT_NAME_PROTOCOL', color:C.proto},
    ], {w:220, borderColor:C.accent});

    /* gHandleList → IHANDLE A → IHANDLE B arrows */
    svg += mkArrow(170, 30, hx1+105, hy1, C.core, false, 'gl1');
    svg += mkCurveArrow(hx1+210, hy1+50, 290, hy1+50, hx2, hy1+50, C.accent, false, 'ha_hb');

    /* ---- PROTOCOL_INTERFACE node for EFI_PCI_IO on Handle A ---- */
    var pix = 60, piy = 300;
    var piw = 190, pih = 90;
    svg += mkRect(pix, piy, piw, pih, 'rgba(167,139,250,0.08)', C.proto, 8);
    svg += mkText(pix+piw/2, piy+16, 'PROTOCOL_INTERFACE', C.proto, 11, 'middle', 700);
    svg += mkLine(pix+10, piy+24, pix+piw-10, piy+24, C.proto);
    svg += mkText(pix+10, piy+38, 'Sig: \'pi\'', C.muted, 9, 'start', 400);
    svg += mkText(pix+10, piy+52, 'Handle → Handle A', C.muted, 9, 'start', 400);
    svg += mkText(pix+10, piy+66, 'Protocol → PE_PCI_IO', C.muted, 9, 'start', 400);
    svg += mkText(pix+10, piy+80, 'Interface → 0x7FA00000', C.muted, 9, 'start', 400);

    /* Handle A → PI arrow */
    svg += mkArrow(hx1+60, hy1+108, pix+60, piy, C.proto, false, 'ha_pi');

    /* ---- PROTOCOL_ENTRY for EFI_PCI_IO ---- */
    var pex = W-195, pey = 80;
    var pew = 185, peh = 110;
    svg += mkRect(pex, pey, pew, peh, 'rgba(20,184,166,0.08)', C.primary, 8);
    svg += mkText(pex+pew/2, pey+16, 'PROTOCOL_ENTRY', C.primary, 11, 'middle', 700);
    svg += mkLine(pex+10, pey+24, pex+pew-10, pey+24, C.primary);
    svg += mkText(pex+10, pey+38, 'Sig: \'pe\'', C.muted, 9, 'start', 400);
    svg += mkText(pex+10, pey+52, 'ProtocolID:', C.muted, 9, 'start', 400);
    svg += mkText(pex+10, pey+64, 'EFI_PCI_IO_PROTOCOL_GUID', C.primary, 9, 'start', 600);
    svg += mkText(pex+10, pey+78, 'Protocols → [PI list]', C.muted, 9, 'start', 400);
    svg += mkText(pex+10, pey+92, 'Notify → [callbacks]', C.muted, 9, 'start', 400);

    /* gProtocolDatabase → PE */
    svg += mkArrow(W-175, 30, pex+pew/2, pey, C.primary, false, 'gl2');

    /* PI → PE arrow */
    svg += mkArrow(pix+piw, piy+45, pex, pey+55, C.primary, true, 'pi_pe');
    svg += mkLabel(pix+piw+20, piy+38, 'Protocol →', C.primary, 9);

    /* IHANDLE A Protocols list back-pointer arrow */
    svg += mkCurveArrow(pix+95, piy, 165, 260, hx1+105, hy1+108, C.muted, true, 'pi_back');

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ================================================================== */
/*  SECTION 3: ConnectController Step-by-Step                          */
/* ================================================================== */
var CONN_STEPS = [
    {
        titleKey: 'connect.step1.title',
        descKey:  'connect.step1.desc',
        render: function(W, H) { return renderConnStep1(W, H); }
    },
    {
        titleKey: 'connect.step2.title',
        descKey:  'connect.step2.desc',
        render: function(W, H) { return renderConnStep2(W, H); }
    },
    {
        titleKey: 'connect.step3.title',
        descKey:  'connect.step3.desc',
        render: function(W, H) { return renderConnStep3(W, H); }
    },
    {
        titleKey: 'connect.step4.title',
        descKey:  'connect.step4.desc',
        render: function(W, H) { return renderConnStep4(W, H); }
    },
    {
        titleKey: 'connect.step5.title',
        descKey:  'connect.step5.desc',
        render: function(W, H) { return renderConnStep5(W, H); }
    },
    {
        titleKey: 'connect.step6.title',
        descKey:  'connect.step6.desc',
        render: function(W, H) { return renderConnStep6(W, H); }
    },
    {
        titleKey: 'connect.step7.title',
        descKey:  'connect.step7.desc',
        render: function(W, H) { return renderConnStep7(W, H); }
    },
];

var connStep = 0;

/* Helper: draw the constant "DXE Core" box */
function dxeCoreBox(W) {
    var bx = W/2-90, by = 10, bw = 180, bh = 40;
    var s = mkRect(bx, by, bw, bh, C.coreDim, C.core, 8);
    s += mkText(W/2, by+24, 'DXE Core — ConnectController()', C.core, 11, 'middle', 700);
    return s;
}

/* Helper: draw a driver binding handle */
function driverBox(x, y, name, ver, active, dimmed) {
    return drawDriverHandle('', x, y, name, ver, active, dimmed);
}

/* Step 1: Initial state — device handle with Device Path + PCI IO */
function renderConnStep1(W, H) {
    var s = dxeCoreBox(W);

    /* device handle */
    var hx = 60, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller  (Device Handle)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:270, borderColor:C.accent});

    /* label */
    s += mkText(hx+135, hy+170, 'Created by PCI Bus Driver', C.muted, 10, 'middle', 400);
    s += mkText(hx+135, hy+185, 'No driver bound yet', C.muted, 10, 'middle', 400);

    /* driver handles (dim, not yet involved) */
    s = drawDriverHandle(s, 420, 80, 'USB HCD Driver', '0x10', false, true);
    s = drawDriverHandle(s, 420, 200, 'NVMe Driver', '0x10', false, true);
    s = drawDriverHandle(s, 420, 320, 'SCSI Driver', '0x10', false, true);

    s += mkText(420+95, 75, 'EFI_DRIVER_BINDING_PROTOCOL handles', C.dimText, 10, 'middle', 400);
    return s;
}

/* Step 2: ConnectController called, sort drivers by Version */
function renderConnStep2(W, H) {
    var s = dxeCoreBox(W);

    /* device handle */
    var hx = 60, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller  (Device Handle)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:270, borderColor:C.accent});

    /* arrow from core to device handle */
    s += mkArrow(W/2-90, 30, hx+135, hy, C.core, false, 'c2h');
    s += mkLabel(W/2-100, 26, 'ConnectController(handle)', C.core, 9);

    /* driver list sorted by version */
    var dx = 420;
    s = drawDriverHandle(s, dx, 80,  'USB HCD Driver',  '0x10', false, false);
    s = drawDriverHandle(s, dx, 190, 'NVMe Driver',     '0x08', false, false);
    s = drawDriverHandle(s, dx, 300, 'SCSI Driver',     '0x05', false, false);

    /* sort annotation */
    s += mkRect(dx-10, 70, 210, 340, 'none', C.core, 8, ' stroke-dasharray="5,3"');
    s += mkText(dx+95, 64, 'Sorted by Version (high→low)', C.core, 10, 'middle', 600);

    /* order labels */
    s += mkText(dx+205, 125, '①', C.core, 14, 'start', 700);
    s += mkText(dx+205, 235, '②', C.muted, 14, 'start', 700);
    s += mkText(dx+205, 345, '③', C.muted, 14, 'start', 700);

    return s;
}

/* Step 3: Supported() called, USB driver matches */
function renderConnStep3(W, H) {
    var s = dxeCoreBox(W);

    var hx = 60, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller  (Device Handle)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:270, borderColor:C.accent});

    var dx = 420;
    s = drawDriverHandle(s, dx, 80, 'USB HCD Driver', '0x10', true, false);
    s = drawDriverHandle(s, dx, 190, 'NVMe Driver',   '0x08', false, true);
    s = drawDriverHandle(s, dx, 300, 'SCSI Driver',   '0x05', false, true);

    /* Supported() call arrow */
    s += mkArrow(dx, 120, hx+270, hy+60, C.primary, false, 's_call');
    s += mkLabel(dx-5, 115, 'Supported(ControllerHandle)?', C.primary, 9);

    /* OpenProtocol inside Supported */
    var bx = 60, by = 240;
    s += mkRect(bx, by, 270, 70, 'rgba(56,189,248,0.08)', C.core, 8);
    s += mkText(bx+135, by+16, 'Inside Supported():', C.core, 10, 'middle', 700);
    s += mkText(bx+135, by+32, 'OpenProtocol(EFI_PCI_IO_PROTOCOL, TEST)', C.muted, 9, 'middle', 400);
    s += mkText(bx+135, by+48, 'Read Class Code → 0x0C0330 ✓  (USB XHCI)', C.child, 9, 'middle', 600);
    s += mkText(bx+135, by+64, 'Returns EFI_SUCCESS', C.primary, 9, 'middle', 700);

    /* return arrow */
    s += mkArrow(hx+270, hy+100, dx, 150, C.child, true, 's_ret');
    s += mkLabel(hx+275, hy+90, 'EFI_SUCCESS', C.child, 9);

    return s;
}

/* Step 4: Start() called */
function renderConnStep4(W, H) {
    var s = dxeCoreBox(W);

    var hx = 60, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller  (Device Handle)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:270, borderColor:C.accent});

    var dx = 420;
    s = drawDriverHandle(s, dx, 80, 'USB HCD Driver', '0x10', true, false);

    /* Start() call arrow */
    s += mkArrow(dx, 130, hx+270, hy+80, C.accent, false, 'st_call');
    s += mkLabel(dx-5, 125, 'Start(ControllerHandle)', C.accent, 9);

    /* Steps box */
    var bx = 430, by = 200;
    s += mkRect(bx, by, 500, 175, 'rgba(251,146,60,0.07)', C.accent, 10);
    s += mkText(bx+250, by+18, 'Inside Start():', C.accent, 11, 'middle', 700);
    s += mkLine(bx+10, by+26, bx+490, by+26, C.accent);
    var lines = [
        '① OpenProtocol(EFI_PCI_IO_PROTOCOL, BY_DRIVER)',
        '② Initialize XHCI controller hardware',
        '③ Allocate internal data structures (AllocatePool)',
        '④ InstallProtocolInterface(Handle,',
        '     &gEfiUsb2HcProtocolGuid, Interface)',
    ];
    lines.forEach(function(l, i) {
        s += mkText(bx+16, by+44+i*24, l, i===3||i===4 ? C.primary : C.muted, 9.5, 'start', i===0||i===3?600:400);
    });

    return s;
}

/* Step 5: IHANDLE after Start() — new protocol installed */
function renderConnStep5(W, H) {
    var s = dxeCoreBox(W);

    /* updated handle */
    var hx = 60, hy = 60;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller  (Device Handle)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
        {name:'EFI_USB2_HC_PROTOCOL',     color:C.proto, isNew:true},
    ], {w:270, borderColor:C.accent});

    /* PROTOCOL_INTERFACE new node */
    var pix = 60, piy = 280;
    var piw = 200, pih = 100;
    s += mkRect(pix, piy, piw, pih, 'rgba(20,184,166,0.08)', C.primary, 8);
    s += mkText(pix+piw/2, piy+14, 'NEW PROTOCOL_INTERFACE', C.primary, 11, 'middle', 700);
    s += mkLine(pix+8, piy+22, pix+piw-8, piy+22, C.primary);
    s += mkText(pix+10, piy+36, 'Sig: \'pi\'', C.muted, 9, 'start');
    s += mkText(pix+10, piy+50, 'Handle → XHCI Handle', C.muted, 9, 'start');
    s += mkText(pix+10, piy+64, 'Protocol → PE_USB2_HC', C.muted, 9, 'start');
    s += mkText(pix+10, piy+78, 'Interface → USB2_HC_Instance', C.muted, 9, 'start');
    s += mkText(pix+10, piy+92, 'OpenList → [USB HCD Driver]', C.muted, 9, 'start');

    /* arrow from handle protocols to new PI */
    s += mkArrow(hx+135, hy+118, pix+100, piy, C.primary, false, 'h_npi');
    s += mkLabel(hx+140, hy+108, 'Protocols list', C.primary, 9);

    /* PROTOCOL_ENTRY */
    var pex = 400, pey = 60;
    s += mkRect(pex, pey, 200, 100, 'rgba(20,184,166,0.08)', C.primary, 8);
    s += mkText(pex+100, pey+14, 'PROTOCOL_ENTRY', C.primary, 11, 'middle', 700);
    s += mkLine(pex+8, pey+22, pex+192, pey+22, C.primary);
    s += mkText(pex+10, pey+36, 'EFI_USB2_HC_PROTOCOL_GUID', C.primary, 9, 'start', 600);
    s += mkText(pex+10, pey+50, 'Protocols → [this PI]', C.muted, 9, 'start');
    s += mkText(pex+10, pey+64, 'Notify → [fire callbacks!]', C.child, 9, 'start', 600);
    s += mkText(pex+10, pey+80, 'AllEntries → gProtocolDatabase', C.muted, 9, 'start');

    /* PI → PE */
    s += mkArrow(pix+piw, piy+40, pex, pey+50, C.primary, true, 'pi_pe2');
    s += mkLabel(pix+piw+5, piy+36, '.Protocol →', C.primary, 9);

    /* Notify fired */
    var nx = 400, ny = 200;
    s += mkRect(nx, ny, 200, 50, 'rgba(52,211,153,0.08)', C.child, 8);
    s += mkText(nx+100, ny+18, '🔔  RegisterProtocolNotify', C.child, 10, 'middle', 700);
    s += mkText(nx+100, ny+36, 'callbacks fired!', C.child, 10, 'middle', 400);
    s += mkArrow(pex+100, pey+100, nx+100, ny, C.child, true, 'pe_notify');

    return s;
}

/* Step 6: Child handle creation */
function renderConnStep6(W, H) {
    var s = dxeCoreBox(W);

    /* parent handle */
    var hx = 30, hy = 60;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL'},
        {name:'EFI_PCI_IO_PROTOCOL'},
        {name:'EFI_USB2_HC_PROTOCOL', isNew:false, color:C.primary},
    ], {w:210, borderColor:C.accent});

    /* USB Bus Driver now active */
    var dx = 280, dy = 60;
    s = drawDriverHandle(s, dx, dy, 'USB Bus Driver', '0x10', true, false);

    /* Start() arrow */
    s += mkArrow(dx, dy+45, hx+210, hy+70, C.accent, false, 'usb_start');
    s += mkLabel(dx-5, dy+40, 'Bus Driver Start()', C.accent, 9);

    /* child handles */
    var children = [
        {y: 60,  label:'USB Device 1 (HID Keyboard)', protos:['EFI_DEVICE_PATH_PROTOCOL','EFI_USB_IO_PROTOCOL']},
        {y: 190, label:'USB Device 2 (Mass Storage)',  protos:['EFI_DEVICE_PATH_PROTOCOL','EFI_USB_IO_PROTOCOL']},
        {y: 320, label:'USB Device 3 (HID Mouse)',     protos:['EFI_DEVICE_PATH_PROTOCOL','EFI_USB_IO_PROTOCOL']},
    ];

    children.forEach(function(c) {
        s = drawHandle(s, 500, c.y, c.label,
            c.protos.map(function(n){ return {name:n, color:C.proto, isNew:true}; }),
            {w:230, borderColor: C.child});
        s += mkArrow(dx+190, dy+45, 500, c.y+40, C.child, true, 'usb_ch'+c.y);
        s += mkLabel(480, c.y+36, 'child handle', C.child, 9);
    });

    s += mkText(500+115, 55, 'InstallMultipleProtocolInterfaces()', C.child, 10, 'middle', 600);

    return s;
}

/* Step 7: Complete */
function renderConnStep7(W, H) {
    var s = dxeCoreBox(W);

    /* XHCI handle */
    s = drawHandle(s, 30, 70, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
        {name:'EFI_USB2_HC_PROTOCOL',     color:C.primary},
    ], {w:200, borderColor:C.accent});

    /* USB Bus Driver handle */
    s = drawDriverHandle(s, 280, 70, 'USB Bus Driver', '0x10', false, false);

    /* child handles */
    s = drawHandle(s, 520, 60, 'USB Keyboard', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:180, borderColor:C.child});
    s = drawHandle(s, 520, 185, 'USB Storage', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:180, borderColor:C.child});
    s = drawHandle(s, 520, 310, 'USB Mouse', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:180, borderColor:C.child});

    /* checkmark / done banner */
    s += mkRect(170, 370, 290, 40, 'rgba(52,211,153,0.12)', C.child, 10);
    s += mkText(315, 394, '✓  ConnectController() Complete', C.child, 12, 'middle', 700);

    return s;
}

function updateConnStep() {
    var step = CONN_STEPS[connStep];
    var desc = document.getElementById('conn-description');
    var svgEl = document.getElementById('conn-svg');
    var ind   = document.getElementById('conn-indicator');
    if (!desc || !svgEl || !step) return;

    desc.innerHTML = '<h3>'+escapeHtml(t(step.titleKey))+'</h3><p>'+escapeHtml(t(step.descKey))+'</p>';
    var content = step.render(960, 420);
    svgEl.innerHTML = content;
    ind.textContent = (connStep+1)+' / '+CONN_STEPS.length;

    document.getElementById('conn-prev').disabled = (connStep === 0);
    document.getElementById('conn-next').disabled = (connStep === CONN_STEPS.length-1);
}

/* ================================================================== */
/*  SECTION 4: DisconnectController Step-by-Step                       */
/* ================================================================== */
var DIS_STEPS = [
    { titleKey:'disconnect.step1.title', descKey:'disconnect.step1.desc', render: function(W,H){ return renderDisStep1(W,H); } },
    { titleKey:'disconnect.step2.title', descKey:'disconnect.step2.desc', render: function(W,H){ return renderDisStep2(W,H); } },
    { titleKey:'disconnect.step3.title', descKey:'disconnect.step3.desc', render: function(W,H){ return renderDisStep3(W,H); } },
    { titleKey:'disconnect.step4.title', descKey:'disconnect.step4.desc', render: function(W,H){ return renderDisStep4(W,H); } },
    { titleKey:'disconnect.step5.title', descKey:'disconnect.step5.desc', render: function(W,H){ return renderDisStep5(W,H); } },
    { titleKey:'disconnect.step6.title', descKey:'disconnect.step6.desc', render: function(W,H){ return renderDisStep6(W,H); } },
];

var disStep = 0;

function disCoreBox(W) {
    var bx = W/2-100, by = 10, bw = 200, bh = 40;
    var s = mkRect(bx, by, bw, bh, 'rgba(248,113,113,0.12)', C.warn, 8);
    s += mkText(W/2, by+24, 'DXE Core — DisconnectController()', C.warn, 11, 'middle', 700);
    return s;
}

function renderDisStep1(W, H) {
    var s = disCoreBox(W);

    /* full handle */
    var hx = 50, hy = 70;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
        {name:'EFI_USB2_HC_PROTOCOL',     color:C.primary},
    ], {w:220, borderColor:C.accent});

    /* OPEN_PROTOCOL_DATA annotation */
    var ox = 330, oy = 100;
    s += mkRect(ox, oy, 260, 110, 'rgba(251,146,60,0.08)', C.accent, 8);
    s += mkText(ox+130, oy+16, 'OPEN_PROTOCOL_DATA', C.accent, 11, 'middle', 700);
    s += mkLine(ox+8, oy+24, ox+252, oy+24, C.accent);
    s += mkText(ox+12, oy+40, 'AgentHandle: USB HCD Driver', C.muted, 9, 'start');
    s += mkText(ox+12, oy+54, 'ControllerHandle: XHCI Handle', C.muted, 9, 'start');
    s += mkText(ox+12, oy+68, 'Attributes: BY_DRIVER', C.accent, 9, 'start', 600);
    s += mkText(ox+12, oy+82, '→ Identifies USB HCD Driver', C.muted, 9, 'start');
    s += mkText(ox+12, oy+96, '   is managing this handle', C.muted, 9, 'start');

    s += mkArrow(W/2-100, 30, ox+130, oy, C.warn, false, 'dis1');
    s += mkLabel(W/2-115, 26, 'DisconnectController(handle)', C.warn, 9);
    s += mkArrow(hx+220, hy+80, ox, oy+55, C.accent, true, 'dis1b');
    s += mkLabel(hx+225, hy+74, 'OpenList scan', C.accent, 9);

    /* child handles (still alive) */
    s = drawHandle(s, 650, 80, 'USB Keyboard (child)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:180, borderColor:C.child});
    s = drawHandle(s, 650, 220, 'USB Storage (child)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:180, borderColor:C.child});

    return s;
}

function renderDisStep2(W, H) {
    var s = disCoreBox(W);

    /* parent */
    var hx = 50, hy = 70;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
        {name:'EFI_USB2_HC_PROTOCOL',     color:C.primary},
    ], {w:220, borderColor:C.accent});

    /* child handles being disconnected first */
    s = drawHandle(s, 350, 80, 'USB Keyboard (child)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:200, borderColor:C.warn});
    s = drawHandle(s, 350, 220, 'USB Storage (child)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_USB_IO_PROTOCOL',      color:C.child},
    ], {w:200, borderColor:C.warn});

    s += mkRect(340, 68, 222, 230, 'none', C.warn, 8, ' stroke-dasharray="6,3"');
    s += mkText(450, 62, 'Stop children FIRST', C.warn, 10, 'middle', 700);

    s += mkArrow(W/2-100, 30, 450, 68, C.warn, false, 'dis2');

    /* annotation */
    var ax = 620, ay = 120;
    s += mkRect(ax, ay, 290, 70, 'rgba(248,113,113,0.07)', C.warn, 8);
    s += mkText(ax+145, ay+16, 'Recursive Stop Order:', C.warn, 10, 'middle', 700);
    s += mkText(ax+12, ay+34, '1. DisconnectController(child handles)', C.muted, 9, 'start');
    s += mkText(ax+12, ay+50, '2. Then DisconnectController(parent)', C.muted, 9, 'start');
    s += mkText(ax+12, ay+64, '   (prevents dangling child handles)', C.muted, 8, 'start');

    return s;
}

function renderDisStep3(W, H) {
    var s = disCoreBox(W);

    /* handle with USB2HC being removed */
    var hx = 50, hy = 70;
    s = drawHandleWithRemoved(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
        {name:'EFI_USB2_HC_PROTOCOL',     isRemoving:true},
    ], {w:220, borderColor:C.accent});

    /* driver */
    s = drawDriverHandle(s, 340, 80, 'USB HCD Driver', '0x10', true, false);

    /* Stop() arrow */
    s += mkArrow(340, 120, hx+220, hy+80, C.warn, false, 'stop_call');
    s += mkLabel(335, 115, 'Stop(ControllerHandle)', C.warn, 9);

    /* Stop steps box */
    var bx = 560, by = 70;
    s += mkRect(bx, by, 380, 170, 'rgba(248,113,113,0.07)', C.warn, 10);
    s += mkText(bx+190, by+18, 'Inside Stop():', C.warn, 11, 'middle', 700);
    s += mkLine(bx+10, by+26, bx+370, by+26, C.warn);
    var lines = [
        '① UninstallProtocolInterface(',
        '   Handle, &gEfiUsb2HcProtocolGuid, Interface)',
        '② Stop XHCI hardware (halt controller)',
        '③ CloseProtocol(Handle, EFI_PCI_IO,',
        '   DriverBinding, ControllerHandle)',
        '④ FreePool(UsbHcDev)  — free private data',
    ];
    lines.forEach(function(l,i) {
        var color = (i===0||i===1) ? C.primary : (i===2 ? C.accent : (i===5 ? C.warn : C.muted));
        s += mkText(bx+16, by+44+i*20, l, color, 9, 'start', i===0?600:400);
    });

    return s;
}

function renderDisStep4(W, H) {
    var s = disCoreBox(W);

    /* handle — USB2HC removed */
    var hx = 50, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:220, borderColor:C.accent});
    s += mkText(hx+110, hy+140, 'EFI_USB2_HC_PROTOCOL removed', C.warn, 10, 'middle', 400);

    /* removed PI floating */
    var pix = 340, piy = 80;
    s += mkRect(pix, piy, 200, 85, 'rgba(248,113,113,0.07)', C.warn, 8, ' stroke-dasharray="5,3"');
    s += mkText(pix+100, piy+14, 'PROTOCOL_INTERFACE (freed)', C.warn, 10, 'middle', 600);
    s += mkLine(pix+8, piy+22, pix+192, piy+22, C.warn);
    s += mkText(pix+10, piy+36, 'Removed from IHANDLE.Protocols', C.muted, 9, 'start');
    s += mkText(pix+10, piy+50, 'Unlinked from PE.Protocols', C.muted, 9, 'start');
    s += mkText(pix+10, piy+64, 'FreePool() called', C.warn, 9, 'start', 600);
    s += mkText(pix+10, piy+78, 'Memory reclaimed', C.muted, 9, 'start');

    /* protocol entry updated */
    var pex = 600, pey = 80;
    s += mkRect(pex, pey, 200, 85, 'rgba(20,184,166,0.07)', C.primary, 8);
    s += mkText(pex+100, pey+14, 'PROTOCOL_ENTRY', C.primary, 10, 'middle', 700);
    s += mkLine(pex+8, pey+22, pex+192, pey+22, C.primary);
    s += mkText(pex+10, pey+36, 'EFI_USB2_HC_PROTOCOL_GUID', C.primary, 9, 'start', 600);
    s += mkText(pex+10, pey+50, 'Protocols list: (empty)', C.muted, 9, 'start');
    s += mkText(pex+10, pey+64, 'Notify callbacks fired', C.child, 9, 'start', 600);
    s += mkText(pex+10, pey+78, 'Entry stays in gProtocolDatabase', C.muted, 9, 'start');

    s += mkArrow(hx+220, hy+60, pix, piy+42, C.warn, true, 'unlink1');
    s += mkArrow(pix+200, piy+42, pex, pey+42, C.primary, true, 'unlink2');

    return s;
}

function renderDisStep5(W, H) {
    var s = disCoreBox(W);

    /* parent handle (still OK) */
    var hx = 50, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:210, borderColor:C.accent});

    /* child handles being destroyed */
    var children = [
        {x:350, y:80},
        {x:350, y:220},
    ];
    children.forEach(function(c) {
        s += mkRect(c.x, c.y, 190, 90, 'rgba(248,113,113,0.07)', C.warn, 8, ' stroke-dasharray="5,3"');
        s += mkText(c.x+95, c.y+18, 'child IHANDLE (destroyed)', C.warn, 10, 'middle', 600);
        s += mkLine(c.x+8, c.y+26, c.x+182, c.y+26, C.warn);
        s += mkText(c.x+10, c.y+44, 'UninstallMultipleProtocolInterfaces()', C.muted, 8.5, 'start');
        s += mkText(c.x+10, c.y+60, 'RemoveEntryList(&IHANDLE.AllHandles)', C.muted, 8.5, 'start');
        s += mkText(c.x+10, c.y+76, 'FreePool(ChildHandle)', C.warn, 8.5, 'start', 600);
    });

    /* annotation */
    var ax = 620, ay = 100;
    s += mkRect(ax, ay, 290, 90, 'rgba(248,113,113,0.07)', C.warn, 8);
    s += mkText(ax+145, ay+18, 'Child Handle Teardown:', C.warn, 10, 'middle', 700);
    s += mkText(ax+12, ay+36, '1. Uninstall all protocols from child', C.muted, 9, 'start');
    s += mkText(ax+12, ay+50, '2. Remove from gHandleList', C.muted, 9, 'start');
    s += mkText(ax+12, ay+64, '3. FreePool the IHANDLE struct', C.muted, 9, 'start');
    s += mkText(ax+12, ay+80, '4. EFI_HANDLE pointer is now INVALID', C.warn, 9, 'start', 600);

    return s;
}

function renderDisStep6(W, H) {
    var s = disCoreBox(W);

    /* restored handle */
    var hx = 60, hy = 80;
    s = drawHandle(s, hx, hy, 'USB XHCI Controller  (Device Handle)', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.proto},
    ], {w:260, borderColor:C.accent});
    s += mkText(hx+130, hy+150, '← Same as initial state', C.muted, 10, 'middle', 400);

    /* driver (dim — no longer managing) */
    s = drawDriverHandle(s, 400, 80, 'USB HCD Driver', '0x10', false, true);
    s += mkText(400+95, 195, 'No longer managing', C.dimText, 10, 'middle', 400);
    s += mkText(400+95, 208, 'XHCI Controller', C.dimText, 10, 'middle', 400);

    /* child handles gone */
    var cx = 670, cy = 100;
    s += mkRect(cx, cy, 200, 80, 'rgba(248,113,113,0.05)', 'rgba(248,113,113,0.2)', 8, ' stroke-dasharray="4,3"');
    s += mkText(cx+100, cy+28, 'USB Child Handles', C.dimText, 11, 'middle', 600);
    s += mkText(cx+100, cy+46, '(no longer exist)', C.dimText, 10, 'middle', 400);
    s += mkText(cx+100, cy+64, 'Memory freed', C.warn, 10, 'middle', 400);

    /* done banner */
    s += mkRect(W/2-160, 360, 320, 44, 'rgba(52,211,153,0.12)', C.child, 10);
    s += mkText(W/2, 385, '✓  DisconnectController() Complete', C.child, 12, 'middle', 700);

    return s;
}

function updateDisStep() {
    var step = DIS_STEPS[disStep];
    var desc = document.getElementById('dis-description');
    var svgEl = document.getElementById('dis-svg');
    var ind   = document.getElementById('dis-indicator');
    if (!desc || !svgEl || !step) return;

    desc.innerHTML = '<h3>'+escapeHtml(t(step.titleKey))+'</h3><p>'+escapeHtml(t(step.descKey))+'</p>';
    svgEl.innerHTML = step.render(960, 420);
    ind.textContent = (disStep+1)+' / '+DIS_STEPS.length;

    document.getElementById('dis-prev').disabled = (disStep === 0);
    document.getElementById('dis-next').disabled = (disStep === DIS_STEPS.length-1);
}

/* ================================================================== */
/*  SECTION 5: Scenario Diagram                                        */
/* ================================================================== */
function renderScenarioDiagram() {
    var el = document.getElementById('scenario-diagram-container');
    if (!el) return;

    var W = 920, H = 500;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    /* title row */
    s += mkRect(0, 0, W, H, 'rgba(0,0,0,0.25)', 'none', 0);

    /* Layer 0: PCI Host Bridge */
    var l0x = 30, l0y = 20;
    s = drawHandle(s, l0x, l0y, 'PCI Root Bridge Handle', [
        {name:'EFI_DEVICE_PATH_PROTOCOL',      color:C.proto},
        {name:'EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL', color:C.primary, isNew:false},
    ], {w:240, borderColor:C.core});

    /* Layer 1: PCI Device for NVMe */
    var l1x = 340, l1y = 20;
    s = drawHandle(s, l1x, l1y, 'NVMe PCI Device Handle', [
        {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
        {name:'EFI_PCI_IO_PROTOCOL',      color:C.accent, isNew:false},
    ], {w:235, borderColor:C.accent});

    /* arrow L0 → L1 */
    s += mkArrow(l0x+240, l0y+50, l1x, l1y+50, C.accent, false, 'l0l1');
    s += mkLabel((l0x+240+l1x)/2-50, l0y+44, 'PCI Bus Driver\ncreates child', C.accent, 9);

    /* Layer 2: NVMe device handle with NVMe protocols */
    var l2x = 640, l2y = 20;
    s = drawHandle(s, l2x, l2y, 'NVMe Namespace Handle', [
        {name:'EFI_DEVICE_PATH_PROTOCOL',           color:C.proto},
        {name:'EFI_NVM_EXPRESS_PASS_THRU_PROTOCOL', color:C.proto, isNew:false},
        {name:'EFI_BLOCK_IO_PROTOCOL',              color:C.primary, isNew:false},
    ], {w:240, borderColor:C.primary});

    s += mkArrow(l1x+235, l1y+50, l2x, l2y+60, C.primary, false, 'l1l2');
    s += mkLabel((l1x+235+l2x)/2-50, l1y+44, 'NVMe Driver\nStart()', C.primary, 9);

    /* Partition child handles */
    var partitions = [
        {y:240, name:'GPT Partition 1 (EFI System)'},
        {y:355, name:'GPT Partition 2 (OS Data)'},
    ];

    partitions.forEach(function(p, i) {
        s = drawHandle(s, l2x, p.y, p.name, [
            {name:'EFI_DEVICE_PATH_PROTOCOL', color:C.proto},
            {name:'EFI_BLOCK_IO_PROTOCOL',    color:C.child, isNew:false},
            {name:'EFI_DISK_IO_PROTOCOL',     color:C.child, isNew:false},
        ], {w:240, borderColor:C.child});
        s += mkArrow(l2x+120, l2y+186, l2x+120, p.y, C.child, false, 'l2p'+i);
    });

    s += mkLabel(l2x+245, 285, 'Partition Driver\ncreates children', C.child, 9);

    /* gHandleList vertical chain on the left */
    s += mkRect(8, l0y+10, 18, H-40, 'rgba(56,189,248,0.08)', C.core, 4);
    s += mkText(17, H/2, 'gHandleList', C.core, 9, 'middle', 600, ' transform="rotate(-90,17,'+(H/2)+')"');
    s += mkArrow(8+9, l0y+10, l0x, l0y+40, C.core, true, 'gl_l0');
    s += mkArrow(8+9, 170,    l1x, l1y+40, C.core, true, 'gl_l1');
    s += mkArrow(8+9, 260,    l2x, l2y+40, C.core, true, 'gl_l2');

    s += '</svg>';
    el.innerHTML = s;
}

/* ================================================================== */
/*  SECTION 6: Code Tabs                                               */
/* ================================================================== */
var CODE_CONNECT = [
'<span class="cm">// MdeModulePkg/Core/Dxe/Hand/DriverSupport.c (simplified)</span>',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">CoreConnectController</span> (',
'  <span class="kw">IN</span> <span class="tp">EFI_HANDLE</span>                ControllerHandle,',
'  <span class="kw">IN</span> <span class="tp">EFI_HANDLE</span>                *DriverImageHandle   <span class="cm">OPTIONAL</span>,',
'  <span class="kw">IN</span> <span class="tp">EFI_DEVICE_PATH_PROTOCOL</span>  *RemainingDevicePath <span class="cm">OPTIONAL</span>,',
'  <span class="kw">IN</span> <span class="tp">BOOLEAN</span>                   Recursive',
')',
'{',
'  <span class="tp">IHANDLE</span>                  *Handle;',
'  <span class="tp">LIST_ENTRY</span>               *Link;',
'  <span class="tp">PROTOCOL_INTERFACE</span>       *Prot;',
'  <span class="tp">EFI_DRIVER_BINDING_PROTOCOL</span> *DriverBinding;',
'',
'  <span class="cm">// Validate the controller handle</span>',
'  Handle = <span class="fn">CoreValidateHandle</span> (ControllerHandle);',
'  <span class="kw">if</span> (Handle == <span class="kw">NULL</span>) { <span class="kw">return</span> EFI_INVALID_PARAMETER; }',
'',
'  <span class="cm">// Collect all handles with EFI_DRIVER_BINDING_PROTOCOL</span>',
'  <span class="cm">// Sort by Version field (higher Version = higher priority)</span>',
'  <span class="fn">CoreConnectSingleController</span> (',
'    ControllerHandle,',
'    DriverImageHandle,',
'    RemainingDevicePath',
'  );',
'',
'  <span class="cm">// If Recursive, connect all newly created child handles too</span>',
'  <span class="kw">if</span> (Recursive) {',
'    <span class="cm">// Walk all handles, find children, connect them</span>',
'    <span class="kw">for</span> each child handle created during Start() {',
'      <span class="fn">CoreConnectController</span> (ChildHandle, <span class="kw">NULL</span>, <span class="kw">NULL</span>, <span class="kw">TRUE</span>);',
'    }',
'  }',
'}',
'',
'<span class="cm">// Inner function: tries each driver binding in Version order</span>',
'<span class="tp">VOID</span>',
'<span class="fn">CoreConnectSingleController</span> (...)',
'{',
'  <span class="kw">for</span> each DriverBinding in sorted list {',
'    <span class="cm">// Call Supported() — must NOT change state</span>',
'    Status = DriverBinding-><span class="fn">Supported</span> (',
'               DriverBinding, ControllerHandle,',
'               RemainingDevicePath);',
'    <span class="kw">if</span> (!EFI_ERROR (Status)) {',
'      <span class="cm">// Supported! Call Start()</span>',
'      Status = DriverBinding-><span class="fn">Start</span> (',
'                 DriverBinding, ControllerHandle,',
'                 RemainingDevicePath);',
'    }',
'  }',
'}',
].join('\n');

var CODE_INSTALL = [
'<span class="cm">// MdeModulePkg/Core/Dxe/Hand/Handle.c (simplified)</span>',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">CoreInstallProtocolInterface</span> (',
'  <span class="kw">IN OUT</span> <span class="tp">EFI_HANDLE</span>  *UserHandle,',
'  <span class="kw">IN</span>     <span class="tp">EFI_GUID</span>    *Protocol,',
'  <span class="kw">IN</span>     <span class="tp">EFI_INTERFACE_TYPE</span> InterfaceType,',
'  <span class="kw">IN</span>     <span class="tp">VOID</span>        *Interface',
')',
'{',
'  <span class="tp">PROTOCOL_INTERFACE</span>  *Prot;',
'  <span class="tp">PROTOCOL_ENTRY</span>      *ProtEntry;',
'  <span class="tp">IHANDLE</span>             *Handle;',
'',
'  <span class="cm">// If *UserHandle is NULL, allocate a new IHANDLE</span>',
'  <span class="kw">if</span> (*UserHandle == <span class="kw">NULL</span>) {',
'    Handle = <span class="fn">AllocateZeroPool</span> (<span class="kw">sizeof</span> (<span class="tp">IHANDLE</span>));',
'    Handle->Signature = EFI_HANDLE_SIGNATURE;  <span class="cm">// \'hand\'</span>',
'    <span class="fn">InitializeListHead</span> (&Handle->Protocols);',
'    <span class="cm">// Link into the global gHandleList</span>',
'    <span class="fn">InsertTailList</span> (&gHandleList, &Handle->AllHandles);',
'  } <span class="kw">else</span> {',
'    Handle = <span class="fn">CoreValidateHandle</span> (*UserHandle);',
'  }',
'',
'  <span class="cm">// Look up or create PROTOCOL_ENTRY for this GUID</span>',
'  ProtEntry = <span class="fn">CoreFindProtocolEntry</span> (Protocol, <span class="kw">TRUE</span>);',
'',
'  <span class="cm">// Allocate and fill a new PROTOCOL_INTERFACE node</span>',
'  Prot = <span class="fn">AllocateZeroPool</span> (<span class="kw">sizeof</span> (<span class="tp">PROTOCOL_INTERFACE</span>));',
'  Prot->Signature = PROTOCOL_INTERFACE_SIGNATURE; <span class="cm">// \'pi\'</span>',
'  Prot->Handle    = Handle;',
'  Prot->Protocol  = ProtEntry;',
'  Prot->Interface = Interface;',
'  <span class="fn">InitializeListHead</span> (&Prot->OpenList);',
'',
'  <span class="cm">// Link into IHANDLE.Protocols list</span>',
'  <span class="fn">InsertTailList</span> (&Handle->Protocols, &Prot->Link);',
'',
'  <span class="cm">// Link into PROTOCOL_ENTRY.Protocols list</span>',
'  <span class="fn">InsertTailList</span> (&ProtEntry->Protocols, &Prot->ByProtocol);',
'',
'  <span class="cm">// Fire RegisterProtocolNotify callbacks</span>',
'  <span class="fn">CoreNotifyProtocolEntry</span> (ProtEntry);',
'',
'  *UserHandle = Handle;',
'  <span class="kw">return</span> EFI_SUCCESS;',
'}',
].join('\n');

var CODE_BINDING = [
'<span class="cm">// Example: Simplified USB Host Controller Driver Binding</span>',
'',
'<span class="tp">EFI_DRIVER_BINDING_PROTOCOL</span> gUsbHcDriverBinding = {',
'  <span class="fn">UsbHcDriverBindingSupported</span>,  <span class="cm">// Supported()</span>',
'  <span class="fn">UsbHcDriverBindingStart</span>,      <span class="cm">// Start()</span>',
'  <span class="fn">UsbHcDriverBindingStop</span>,       <span class="cm">// Stop()</span>',
'  <span class="num">0x10</span>,                          <span class="cm">// Version (priority)</span>',
'  <span class="kw">NULL</span>,                          <span class="cm">// ImageHandle (filled at init)</span>',
'  <span class="kw">NULL</span>                           <span class="cm">// DriverBindingHandle</span>',
'};',
'',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">UsbHcDriverBindingSupported</span> (',
'  <span class="kw">IN</span> <span class="tp">EFI_DRIVER_BINDING_PROTOCOL</span> *This,',
'  <span class="kw">IN</span> <span class="tp">EFI_HANDLE</span>                  ControllerHandle,',
'  <span class="kw">IN</span> <span class="tp">EFI_DEVICE_PATH_PROTOCOL</span>    *RemainingDevicePath',
')',
'{',
'  <span class="tp">EFI_PCI_IO_PROTOCOL</span>  *PciIo;',
'  <span class="tp">EFI_STATUS</span>            Status;',
'  <span class="tp">USB_CLASSC</span>            UsbClassCReg;',
'',
'  <span class="cm">// Try to open PCI I/O Protocol with TEST_PROTOCOL (non-exclusive)</span>',
'  Status = gBS-><span class="fn">OpenProtocol</span> (',
'             ControllerHandle,',
'             &gEfiPciIoProtocolGuid,',
'             (<span class="tp">VOID</span> **) &PciIo,',
'             This->DriverBindingHandle,',
'             ControllerHandle,',
'             EFI_OPEN_PROTOCOL_BY_DRIVER',
'           );',
'  <span class="kw">if</span> (EFI_ERROR (Status)) { <span class="kw">return</span> Status; }',
'',
'  <span class="cm">// Read PCI Class Code to check for USB XHCI (0x0C 0x03 0x30)</span>',
'  Status = PciIo-><span class="fn">Pci.Read</span> (PciIo, EfiPciIoWidthUint8,',
'                    PCI_CLASSCODE_OFFSET, <span class="num">3</span>, &UsbClassCReg);',
'  gBS-><span class="fn">CloseProtocol</span> (ControllerHandle, &gEfiPciIoProtocolGuid,',
'                   This->DriverBindingHandle, ControllerHandle);',
'',
'  <span class="kw">if</span> (UsbClassCReg.BaseCode  != PCI_CLASS_SERIAL        ||',
'      UsbClassCReg.SubClassCode != PCI_CLASS_SERIAL_USB   ||',
'      UsbClassCReg.PI           != PCI_IF_UHCI) {',
'    <span class="kw">return</span> EFI_UNSUPPORTED;',
'  }',
'  <span class="kw">return</span> EFI_SUCCESS;  <span class="cm">// This driver supports this controller</span>',
'}',
'',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">UsbHcDriverBindingStart</span> (...)',
'{',
'  <span class="cm">// 1. Allocate private context structure</span>',
'  UsbHcDev = <span class="fn">AllocateZeroPool</span> (<span class="kw">sizeof</span> (<span class="tp">USB_HC_DEV</span>));',
'',
'  <span class="cm">// 2. Open PCI I/O exclusively (BY_DRIVER)</span>',
'  gBS-><span class="fn">OpenProtocol</span> (ControllerHandle, &gEfiPciIoProtocolGuid,',
'                  &UsbHcDev->PciIo, ..., EFI_OPEN_PROTOCOL_BY_DRIVER);',
'',
'  <span class="cm">// 3. Initialize XHCI controller hardware</span>',
'  <span class="fn">XhciHcReset</span> (UsbHcDev);',
'',
'  <span class="cm">// 4. Install EFI_USB2_HC_PROTOCOL on the controller handle</span>',
'  <span class="kw">return</span> gBS-><span class="fn">InstallMultipleProtocolInterfaces</span> (',
'               &ControllerHandle,',
'               &gEfiUsb2HcProtocolGuid, &UsbHcDev->Usb2Hc,',
'               <span class="kw">NULL</span>',
'             );',
'}',
'',
'<span class="tp">EFI_STATUS</span>',
'<span class="fn">UsbHcDriverBindingStop</span> (...)',
'{',
'  <span class="cm">// 1. Uninstall the protocol we installed in Start()</span>',
'  gBS-><span class="fn">UninstallMultipleProtocolInterfaces</span> (',
'         ControllerHandle,',
'         &gEfiUsb2HcProtocolGuid, &UsbHcDev->Usb2Hc,',
'         <span class="kw">NULL</span>',
'       );',
'',
'  <span class="cm">// 2. Stop hardware</span>',
'  <span class="fn">XhciHcHaltAndReset</span> (UsbHcDev);',
'',
'  <span class="cm">// 3. Release PCI I/O ownership</span>',
'  gBS-><span class="fn">CloseProtocol</span> (ControllerHandle, &gEfiPciIoProtocolGuid,',
'                   This->DriverBindingHandle, ControllerHandle);',
'',
'  <span class="cm">// 4. Free private context</span>',
'  <span class="fn">FreePool</span> (UsbHcDev);',
'  <span class="kw">return</span> EFI_SUCCESS;',
'}',
].join('\n');

function initCodeTabs() {
    var pre = document.getElementById('code-connect-pre');
    if (pre) pre.innerHTML = CODE_CONNECT;
    pre = document.getElementById('code-install-pre');
    if (pre) pre.innerHTML = CODE_INSTALL;
    pre = document.getElementById('code-binding-pre');
    if (pre) pre.innerHTML = CODE_BINDING;

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
    updateConnStep();
    updateDisStep();
}

/* ================================================================== */
/*  Init                                                               */
/* ================================================================== */
document.addEventListener('DOMContentLoaded', function() {

    /* structs diagram */
    renderStructsDiagram();

    /* connect steps */
    updateConnStep();
    document.getElementById('conn-prev').addEventListener('click', function() {
        if (connStep > 0) { connStep--; updateConnStep(); }
    });
    document.getElementById('conn-next').addEventListener('click', function() {
        if (connStep < CONN_STEPS.length-1) { connStep++; updateConnStep(); }
    });
    document.getElementById('conn-reset').addEventListener('click', function() {
        connStep = 0; updateConnStep();
    });

    /* disconnect steps */
    updateDisStep();
    document.getElementById('dis-prev').addEventListener('click', function() {
        if (disStep > 0) { disStep--; updateDisStep(); }
    });
    document.getElementById('dis-next').addEventListener('click', function() {
        if (disStep < DIS_STEPS.length-1) { disStep++; updateDisStep(); }
    });
    document.getElementById('dis-reset').addEventListener('click', function() {
        disStep = 0; updateDisStep();
    });

    /* scenario */
    renderScenarioDiagram();

    /* code tabs */
    initCodeTabs();

    /* nav */
    initNavHighlight();
});
