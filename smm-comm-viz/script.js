/* ------------------------------------------------------------------ */
/*  SMM/MM Communication Visualizer – Main Script                      */
/*  Interactive SVG diagrams + step-by-step flow                       */
/* ------------------------------------------------------------------ */

/* ====================== colour constants ========================== */
var C = {
    primary:   '#ef4444',
    accent:    '#22d3ee',
    dxe:       '#34d399',
    dxeDim:    'rgba(52,211,153,0.25)',
    dxeFill:   'rgba(52,211,153,0.08)',
    smm:       '#ef4444',
    smmDim:    'rgba(239,68,68,0.25)',
    smmFill:   'rgba(239,68,68,0.08)',
    smram:     '#f472b6',
    smramDim:  'rgba(244,114,182,0.25)',
    smramFill: 'rgba(244,114,182,0.08)',
    comm:      '#fbbf24',
    commDim:   'rgba(251,191,36,0.25)',
    commFill:  'rgba(251,191,36,0.08)',
    cpu:       '#a78bfa',
    cpuDim:    'rgba(167,139,250,0.25)',
    cpuFill:   'rgba(167,139,250,0.08)',
    mm:        '#22d3ee',
    mmDim:     'rgba(34,211,238,0.25)',
    mmFill:    'rgba(34,211,238,0.08)',
    dimmed:    '#2a3040',
    dimText:   '#4a5568',
    text:      '#e6edf3',
    muted:     '#8b9bb0',
    bg:        '#0c1118',
    arrow:     '#ef4444',
    done:      '#34d399',
};

/* ====================== SVG helpers =============================== */
function svgRect(x, y, w, h, fill, stroke, rx) {
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||8)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.5"/>';
}
function svgText(x, y, text, color, size, anchor, weight) {
    return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'middle')+'" fill="'+(color||C.text)+'" font-family="Space Grotesk,sans-serif" font-size="'+(size||13)+'" font-weight="'+(weight||500)+'">'+text+'</text>';
}
function svgArrow(x1, y1, x2, y2, color, dashed) {
    var mid = 'M'+x1+','+y1+' L'+x2+','+y2;
    var dash = dashed ? ' stroke-dasharray="6,4"' : '';
    var id = 'arrow_' + Math.random().toString(36).substr(2,5);
    return '<defs><marker id="'+id+'" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="'+(color||C.arrow)+'"/></marker></defs>'
         + '<path d="'+mid+'" stroke="'+(color||C.arrow)+'" stroke-width="2" fill="none" marker-end="url(#'+id+')"'+dash+'/>';
}
function svgCurveArrow(x1, y1, cx1, cy1, cx2, cy2, x2, y2, color, dashed) {
    var d = 'M'+x1+','+y1+' C'+cx1+','+cy1+' '+cx2+','+cy2+' '+x2+','+y2;
    var dash = dashed ? ' stroke-dasharray="6,4"' : '';
    var id = 'carrow_' + Math.random().toString(36).substr(2,5);
    return '<defs><marker id="'+id+'" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="'+(color||C.arrow)+'"/></marker></defs>'
         + '<path d="'+d+'" stroke="'+(color||C.arrow)+'" stroke-width="2" fill="none" marker-end="url(#'+id+')"'+dash+'/>';
}

/* ====================== architecture diagram ====================== */
function renderArchDiagram() {
    var el = document.getElementById('arch-diagram');
    if (!el) return;

    var W = 960, H = 480;
    var colW = 260, colH = 380, gap = 50;
    var startX = (W - 3 * colW - 2 * gap) / 2;
    var startY = 55;

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // defs for glow
    svg += '<defs>';
    svg += '<filter id="glowDxe" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    svg += '<filter id="glowSmram" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    svg += '</defs>';

    var cols = [
        {
            x: startX, label: t('arch.label.dram'), color: C.dxe, fill: C.dxeFill, border: C.dxeDim,
            addr: '0x00000000',
            blocks: [
                { h: 55, label: t('arch.label.dxe'),      color: C.dxe },
                { h: 50, label: t('arch.label.uefi_svc'),  color: C.dxe },
                { h: 65, label: t('arch.label.comm_buf'),  color: C.comm, isBuf: true },
                { h: 70, label: t('arch.label.os_region'), color: C.dimmed, textColor: C.dimText },
            ]
        },
        {
            x: startX + colW + gap, label: t('arch.label.smram'), color: C.smram, fill: C.smramFill, border: C.smramDim,
            addr: 'TSEG Base',
            blocks: [
                { h: 60, label: t('arch.label.smm_core'),    color: C.smm },
                { h: 60, label: t('arch.label.smi_handler'),  color: C.smram },
                { h: 55, label: t('arch.label.smm_driver'),   color: C.smram },
                { h: 55, label: t('arch.label.save_state'),   color: C.cpu },
            ]
        },
        {
            x: startX + 2*(colW + gap), label: 'I/O & CPU', color: C.cpu, fill: C.cpuFill, border: C.cpuDim,
            addr: '',
            blocks: [
                { h: 55, label: 'I/O Port 0xB2', color: C.comm },
                { h: 55, label: 'SMI# Signal',   color: C.smm },
                { h: 55, label: 'SMBASE + 0x8000', color: C.cpu },
                { h: 55, label: 'RSM Instruction', color: C.mm },
            ]
        },
    ];

    cols.forEach(function(col) {
        // column background
        svg += svgRect(col.x, startY, colW, colH, col.fill, col.border, 12);
        // column title
        svg += svgText(col.x + colW/2, startY - 14, col.label, col.color, 15, 'middle', 700);
        // address label
        if (col.addr) {
            svg += svgText(col.x + colW/2, startY + colH + 20, col.addr, C.muted, 11, 'middle', 400);
        }

        var by = startY + 16;
        var pad = 12;
        col.blocks.forEach(function(b) {
            var bw = colW - 2*pad;
            var bx = col.x + pad;
            svg += svgRect(bx, by, bw, b.h, b.isBuf ? C.commFill : 'rgba(0,0,0,0.2)', b.color ? (b.color + '40') : 'rgba(255,255,255,0.05)', 6);
            svg += '<rect x="'+bx+'" y="'+by+'" width="4" height="'+b.h+'" rx="2" fill="'+b.color+'"/>';
            svg += svgText(bx + bw/2 + 2, by + b.h/2 + 5, b.label, b.textColor || b.color, 12, 'middle', 500);
            by += b.h + 10;
        });
    });

    // arrows: DXE comm buffer -> I/O port
    var pad = 12;
    var bufY = startY + 16 + 55 + 10 + 50 + 10 + 32;
    var ioX = startX + 2*(colW + gap);
    svg += svgArrow(startX + colW, bufY, ioX, startY + 16 + 27, C.comm, false);

    // arrow: I/O port -> SMRAM SMM Core
    svg += svgArrow(ioX, startY + 16 + 55 + 10 + 27, startX + colW + gap + colW, startY + 16 + 30, C.smm, false);

    // arrow: SMRAM -> comm buffer (response, dashed)
    svg += svgCurveArrow(
        startX + colW + gap, startY + 16 + 60 + 10 + 30,
        startX + colW + gap - 40, startY + colH - 20,
        startX + colW/2, startY + colH + 5,
        startX + colW - pad, bufY + 15,
        C.done, true
    );

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ====================== trigger diagram =========================== */
function renderTriggerDiagram() {
    var el = document.getElementById('trigger-diagram');
    if (!el) return;

    var W = 960, H = 320;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // boxes
    var boxes = [
        { x: 40,  y: 100, w: 160, h: 100, label: 'DXE Driver',       sub: 'IoWrite8(0xB2, val)', color: C.dxe, fill: C.dxeFill },
        { x: 260, y: 100, w: 140, h: 100, label: 'I/O Port 0xB2',    sub: t('trigger.port.desc'), color: C.comm, fill: C.commFill },
        { x: 460, y: 100, w: 160, h: 100, label: 'Chipset',          sub: 'SMI# → all CPUs', color: C.smm, fill: C.smmFill },
        { x: 680, y: 40,  w: 240, h: 70,  label: 'SMBASE + 0x8000',  sub: 'SMM Entry Point', color: C.cpu, fill: C.cpuFill },
        { x: 680, y: 130, w: 240, h: 70,  label: 'SMM Core',         sub: 'SmmEntryPoint() → SmiManage()', color: C.smram, fill: C.smramFill },
        { x: 680, y: 220, w: 240, h: 70,  label: 'RSM',              sub: t('trigger.smbase.desc') || 'Resume from SMM', color: C.mm, fill: C.mmFill },
    ];

    boxes.forEach(function(b) {
        svg += svgRect(b.x, b.y, b.w, b.h, b.fill, b.color+'60', 10);
        svg += svgText(b.x + b.w/2, b.y + b.h/2 - 6, b.label, b.color, 13, 'middle', 600);
        svg += svgText(b.x + b.w/2, b.y + b.h/2 + 14, b.sub, C.muted, 10, 'middle', 400);
    });

    // arrows
    svg += svgArrow(200, 150, 260, 150, C.comm);
    svg += svgArrow(400, 150, 460, 150, C.smm);
    svg += svgArrow(620, 150, 680, 75,  C.cpu);
    svg += svgArrow(680 + 120, 110, 680 + 120, 130, C.smram);
    svg += svgArrow(680 + 120, 200, 680 + 120, 220, C.mm);

    // return arrow (dashed)
    svg += svgCurveArrow(680, 260, 400, 290, 200, 290, 120, 200, C.done, true);

    // title labels
    svg += svgText(W/2, 30, t('trigger.title'), C.text, 16, 'middle', 700);

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ====================== buffer diagram ============================ */
function renderBufferDiagram() {
    var el = document.getElementById('buffer-diagram');
    if (!el) return;

    var W = 960, H = 240;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    var startX = 80, startY = 40;
    var totalW = 800;
    var h = 80;

    // whole buffer outline
    svg += svgRect(startX, startY, totalW, h, 'rgba(0,0,0,0.2)', C.comm+'60', 10);

    // HeaderGuid section
    var guidW = 200;
    svg += svgRect(startX + 4, startY + 4, guidW - 4, h - 8, C.smmFill, C.smm+'60', 8);
    svg += svgText(startX + guidW/2, startY + h/2 - 6, 'HeaderGuid', C.smm, 14, 'middle', 600);
    svg += svgText(startX + guidW/2, startY + h/2 + 14, 'EFI_GUID (16 bytes)', C.muted, 10, 'middle', 400);

    // MessageLength section
    var lenX = startX + guidW;
    var lenW = 160;
    svg += svgRect(lenX + 2, startY + 4, lenW - 4, h - 8, C.cpuFill, C.cpu+'60', 8);
    svg += svgText(lenX + lenW/2, startY + h/2 - 6, 'MessageLength', C.cpu, 14, 'middle', 600);
    svg += svgText(lenX + lenW/2, startY + h/2 + 14, 'UINTN (4/8 bytes)', C.muted, 10, 'middle', 400);

    // Data section
    var dataX = lenX + lenW;
    var dataW = totalW - guidW - lenW;
    svg += svgRect(dataX + 2, startY + 4, dataW - 8, h - 8, C.dxeFill, C.dxe+'60', 8);
    svg += svgText(dataX + dataW/2, startY + h/2 - 6, 'Data[]', C.dxe, 14, 'middle', 600);
    svg += svgText(dataX + dataW/2, startY + h/2 + 14, 'Variable length payload', C.muted, 10, 'middle', 400);

    // offset labels below
    svg += svgText(startX, startY + h + 20, 'Offset 0', C.muted, 11, 'start', 400);
    svg += svgText(lenX, startY + h + 20, '+16', C.muted, 11, 'start', 400);
    svg += svgText(dataX, startY + h + 20, '+16+sizeof(UINTN)', C.muted, 11, 'start', 400);
    svg += svgText(startX + totalW, startY + h + 20, '+16+sizeof(UINTN)+MessageLength', C.muted, 11, 'end', 400);

    // description labels
    svg += svgText(startX + guidW/2, startY + h + 50, t('buffer.guid.title'), C.smm, 11, 'middle', 600);
    svg += svgText(lenX + lenW/2, startY + h + 50, t('buffer.len.title'), C.cpu, 11, 'middle', 600);
    svg += svgText(dataX + dataW/2, startY + h + 50, t('buffer.data.title'), C.dxe, 11, 'middle', 600);

    // title
    svg += svgText(W/2, 26, 'EFI_SMM_COMMUNICATE_HEADER', C.comm, 16, 'middle', 700);

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ====================== flow step definitions ===================== */
var TOTAL_STEPS = 8;
var currentFlowStep = 0;

function renderFlowStep(step) {
    var el = document.getElementById('flow-diagram');
    if (!el) return;

    var W = 960, H = 440;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // define regions
    var dxeBox  = { x: 30,  y: 50, w: 200, h: 340, label: 'DXE Environment',  color: C.dxe,   fill: C.dxeFill,   border: C.dxeDim };
    var commBox = { x: 280, y: 50, w: 160, h: 340, label: t('arch.label.comm_buf'), color: C.comm,  fill: C.commFill,  border: C.commDim };
    var ioBox   = { x: 490, y: 50, w: 100, h: 120, label: 'I/O 0xB2',        color: C.comm,  fill: C.commFill,  border: C.commDim };
    var cpuBox  = { x: 490, y: 200, w: 100, h: 100, label: 'CPU / SMI#',     color: C.cpu,   fill: C.cpuFill,   border: C.cpuDim };
    var smmBox  = { x: 640, y: 50, w: 280, h: 340, label: 'SMM (SMRAM)',      color: C.smm,   fill: C.smmFill,   border: C.smmDim };

    var allBoxes = [dxeBox, commBox, ioBox, cpuBox, smmBox];

    // draw all regions (dimmed by default, highlighted per step)
    allBoxes.forEach(function(b) {
        var opacity = '0.3';
        // highlight logic per step
        if (step === 0 && b === dxeBox) opacity = '1';
        if (step === 1 && (b === dxeBox || b === commBox)) opacity = '1';
        if (step === 2 && (b === dxeBox || b === commBox)) opacity = '1';
        if (step === 3 && (b === dxeBox || b === commBox || b === ioBox)) opacity = '1';
        if (step === 4 && (b === ioBox || b === cpuBox || b === smmBox)) opacity = '1';
        if (step === 5 && (b === smmBox || b === commBox)) opacity = '1';
        if (step === 6 && (b === smmBox || b === commBox)) opacity = '1';
        if (step === 7) opacity = '1';

        svg += '<g opacity="'+opacity+'">';
        svg += svgRect(b.x, b.y, b.w, b.h, b.fill, b.border, 12);
        svg += svgText(b.x + b.w/2, b.y + 24, b.label, b.color, 12, 'middle', 700);
        svg += '</g>';
    });

    // inner blocks for DXE
    var dxeInner = [
        { y: 90,  h: 45, label: 'LocateProtocol()', color: C.dxe },
        { y: 145, h: 45, label: 'Fill Header',       color: C.dxe },
        { y: 200, h: 45, label: 'Communicate()',     color: C.dxe },
        { y: 255, h: 45, label: 'Read Response',     color: C.done },
    ];
    dxeInner.forEach(function(b, i) {
        var active = false;
        if (step === 0 && i === 0) active = true;
        if (step === 1 && i === 1) active = true;
        if (step === 2 && i === 2) active = true;
        if (step === 3 && i === 2) active = true;
        if (step === 7 && i === 3) active = true;

        var op = active ? '1' : '0.25';
        svg += '<g opacity="'+op+'">';
        svg += svgRect(dxeBox.x + 10, b.y, dxeBox.w - 20, b.h, 'rgba(0,0,0,0.3)', b.color+'50', 6);
        svg += svgText(dxeBox.x + dxeBox.w/2, b.y + b.h/2 + 4, b.label, active ? b.color : C.dimText, 11, 'middle', 600);
        svg += '</g>';
    });

    // inner blocks for comm buffer
    var bufInner = [
        { y: 90,  h: 55, label: 'HeaderGuid',    color: C.smm },
        { y: 155, h: 45, label: 'MessageLength',  color: C.cpu },
        { y: 210, h: 80, label: 'Data[]',         color: C.dxe },
    ];
    bufInner.forEach(function(b) {
        var active = step >= 1;
        var op = active ? '1' : '0.2';
        svg += '<g opacity="'+op+'">';
        svg += svgRect(commBox.x + 10, b.y, commBox.w - 20, b.h, 'rgba(0,0,0,0.3)', b.color+'50', 6);
        svg += svgText(commBox.x + commBox.w/2, b.y + b.h/2 + 4, b.label, active ? b.color : C.dimText, 11, 'middle', 500);
        svg += '</g>';
    });

    // inner blocks for SMM
    var smmInner = [
        { y: 90,  h: 40, label: 'SmmEntryPoint()',  color: C.smm },
        { y: 140, h: 40, label: 'SmiManage()',      color: C.smram },
        { y: 190, h: 50, label: 'SMI Handler',      color: C.smram },
        { y: 250, h: 40, label: 'RSM',              color: C.mm },
    ];
    smmInner.forEach(function(b, i) {
        var active = false;
        if (step === 4 && i === 0) active = true;
        if (step === 5 && (i === 0 || i === 1)) active = true;
        if (step === 6 && i === 2) active = true;
        if (step === 7 && i === 3) active = true;

        var op = (step >= 4 && step <= 7) ? (active ? '1' : '0.3') : '0.15';
        svg += '<g opacity="'+op+'">';
        svg += svgRect(smmBox.x + 10, b.y, smmBox.w - 20, b.h, 'rgba(0,0,0,0.3)', b.color+'50', 6);
        svg += svgText(smmBox.x + smmBox.w/2, b.y + b.h/2 + 4, b.label, active ? b.color : C.dimText, 11, 'middle', 600);
        svg += '</g>';
    });

    // animated arrows per step
    if (step === 0) {
        // highlight: DXE locates protocol
        svg += svgText(dxeBox.x + dxeBox.w/2, dxeBox.y + dxeBox.h + 20, 'gBS->LocateProtocol(&gEfiSmmCommunicationProtocolGuid, ...)', C.dxe, 10, 'middle', 500);
    }
    if (step === 1) {
        // DXE -> comm buffer
        svg += svgArrow(dxeBox.x + dxeBox.w, 167, commBox.x, 167, C.comm);
        svg += svgText((dxeBox.x + dxeBox.w + commBox.x)/2, 157, 'Fill GUID + Data', C.comm, 10, 'middle', 500);
    }
    if (step === 2) {
        // DXE calls Communicate
        svg += svgArrow(dxeBox.x + dxeBox.w, 222, commBox.x, 160, C.dxe);
        svg += svgText((dxeBox.x + dxeBox.w + commBox.x)/2, 180, 'Communicate(CommBuffer, &Size)', C.dxe, 10, 'middle', 500);
    }
    if (step === 3) {
        // comm buffer addr -> I/O port 0xB2
        svg += svgArrow(commBox.x + commBox.w, 120, ioBox.x, 100, C.comm);
        svg += svgArrow(dxeBox.x + dxeBox.w, 222, ioBox.x, 120, C.comm, true);
        svg += svgText(ioBox.x + ioBox.w/2, ioBox.y + ioBox.h + 16, 'IoWrite8(0xB2, SwSmiValue)', C.comm, 10, 'middle', 500);
    }
    if (step === 4) {
        // I/O -> CPU -> SMM
        svg += svgArrow(ioBox.x + ioBox.w/2, ioBox.y + ioBox.h, cpuBox.x + cpuBox.w/2, cpuBox.y, C.cpu);
        svg += svgArrow(cpuBox.x + cpuBox.w, cpuBox.y + cpuBox.h/2, smmBox.x, 110, C.smm);
        svg += svgText(cpuBox.x + cpuBox.w/2, cpuBox.y + cpuBox.h + 16, 'All cores → SMBASE + 0x8000', C.cpu, 10, 'middle', 500);
    }
    if (step === 5) {
        // SMM reads comm buffer
        svg += svgArrow(smmBox.x, 160, commBox.x + commBox.w, 120, C.smram, true);
        svg += svgText((smmBox.x + commBox.x + commBox.w)/2, 130, 'Read HeaderGuid → dispatch', C.smram, 10, 'middle', 500);
    }
    if (step === 6) {
        // handler reads/writes comm buffer
        svg += svgArrow(smmBox.x, 215, commBox.x + commBox.w, 230, C.smram);
        svg += svgArrow(commBox.x + commBox.w, 250, smmBox.x, 235, C.done, true);
        svg += svgText((smmBox.x + commBox.x + commBox.w)/2, 260, 'Handler R/W Data[]', C.smram, 10, 'middle', 500);
    }
    if (step === 7) {
        // RSM return -> DXE reads response
        svg += svgCurveArrow(smmBox.x, 270, smmBox.x - 80, 350, dxeBox.x + dxeBox.w + 40, 350, dxeBox.x + dxeBox.w, 277, C.done, true);
        svg += svgArrow(commBox.x, 250, dxeBox.x + dxeBox.w, 277, C.done);
        svg += svgText(W/2, H - 20, 'RSM → CPU restores state → DXE reads response', C.done, 11, 'middle', 600);
    }

    svg += '</svg>';
    el.innerHTML = svg;

    // update description
    var stepNum = step + 1;
    document.getElementById('flow-step-title').textContent = t('flow.step'+stepNum+'.title');
    document.getElementById('flow-step-desc').textContent  = t('flow.step'+stepNum+'.desc');
    document.getElementById('flow-step-detail').textContent = t('flow.step'+stepNum+'.detail');

    // update indicator
    var label = t('flow.step.label');
    var of_   = t('flow.step.of');
    document.getElementById('flow-indicator').textContent = label + ' ' + stepNum + ' ' + of_ + ' ' + TOTAL_STEPS;

    // update buttons
    document.getElementById('flow-prev').disabled = (step === 0);
    document.getElementById('flow-next').disabled = (step === TOTAL_STEPS - 1);
}

/* ====================== standalone comparison lists =============== */
function renderComparisonLists() {
    var tradList = document.getElementById('traditional-list');
    var standList = document.getElementById('standalone-list');
    if (!tradList || !standList) return;

    var tradItems = t('standalone.traditional.items');
    var standItems = t('standalone.standalone.items');

    tradList.innerHTML = '';
    standList.innerHTML = '';

    if (Array.isArray(tradItems)) {
        tradItems.forEach(function(item) {
            var li = document.createElement('li');
            li.textContent = item;
            tradList.appendChild(li);
        });
    }
    if (Array.isArray(standItems)) {
        standItems.forEach(function(item) {
            var li = document.createElement('li');
            li.textContent = item;
            standList.appendChild(li);
        });
    }
}

/* ====================== nav highlight on scroll =================== */
function setupScrollSpy() {
    var sections = document.querySelectorAll('.section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function update() {
        var scrollY = window.scrollY || window.pageYOffset;
        var current = '';
        sections.forEach(function(sec) {
            if (sec.offsetTop - 120 <= scrollY) {
                current = sec.id;
            }
        });
        navLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ====================== boot ====================================== */
document.addEventListener('DOMContentLoaded', function() {

    // render all static diagrams
    renderArchDiagram();
    renderTriggerDiagram();
    renderBufferDiagram();
    renderComparisonLists();

    // initial flow step
    renderFlowStep(0);

    // flow controls
    document.getElementById('flow-prev').addEventListener('click', function() {
        if (currentFlowStep > 0) {
            currentFlowStep--;
            renderFlowStep(currentFlowStep);
        }
    });
    document.getElementById('flow-next').addEventListener('click', function() {
        if (currentFlowStep < TOTAL_STEPS - 1) {
            currentFlowStep++;
            renderFlowStep(currentFlowStep);
        }
    });
    document.getElementById('flow-reset').addEventListener('click', function() {
        currentFlowStep = 0;
        renderFlowStep(0);
    });

    // scroll spy
    setupScrollSpy();

    // override setLang to also re-render comparison lists
    var origSetLang = window.setLang;
    if (origSetLang) {
        window.setLang = function(lang) {
            origSetLang(lang);
            renderComparisonLists();
        };
    }
});
