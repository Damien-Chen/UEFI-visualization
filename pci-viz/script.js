/* ------------------------------------------------------------------ */
/*  PCI Subsystem Visualizer – Main Script                             */
/*  Interactive SVG diagrams + step-by-step enumeration flow           */
/* ------------------------------------------------------------------ */

/* ====================== colour constants ========================== */
var C = {
    primary:   '#f97316',
    accent:    '#38bdf8',
    pci:       '#f97316',
    pciDim:    'rgba(249,115,22,0.25)',
    pciFill:   'rgba(249,115,22,0.08)',
    bridge:    '#a78bfa',
    bridgeDim: 'rgba(167,139,250,0.25)',
    bridgeFill:'rgba(167,139,250,0.08)',
    bar:       '#34d399',
    barDim:    'rgba(52,211,153,0.25)',
    barFill:   'rgba(52,211,153,0.08)',
    ecam:      '#38bdf8',
    ecamDim:   'rgba(56,189,248,0.25)',
    ecamFill:  'rgba(56,189,248,0.08)',
    io:        '#fbbf24',
    ioDim:     'rgba(251,191,36,0.25)',
    ioFill:    'rgba(251,191,36,0.08)',
    driver:    '#f472b6',
    driverDim: 'rgba(244,114,182,0.25)',
    driverFill:'rgba(244,114,182,0.08)',
    x86:       '#60a5fa',
    x86Dim:    'rgba(96,165,250,0.25)',
    x86Fill:   'rgba(96,165,250,0.08)',
    arm:       '#4ade80',
    armDim:    'rgba(74,222,128,0.25)',
    armFill:   'rgba(74,222,128,0.08)',
    dimmed:    '#2a3040',
    dimText:   '#4a5568',
    text:      '#e6edf3',
    muted:     '#8b9bb0',
    bg:        '#0c1118',
    arrow:     '#f97316',
    done:      '#34d399',
};

/* ====================== SVG helpers =============================== */
function svgRect(x, y, w, h, fill, stroke, rx) {
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||6)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.5"/>';
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

/* ====================== current config view ======================= */
var currentConfigView = 'type0';

/* ====================== CONFIG SPACE DIAGRAM ====================== */
function renderConfigSpace() {
    var el = document.getElementById('config-diagram');
    if (!el) return;

    if (currentConfigView === 'extended') {
        renderExtendedConfigSpace(el);
        return;
    }

    var W = 960, H = 520;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // Title
    var title = currentConfigView === 'type0' ? 'PCI Type 0 Header (256 bytes)' : 'PCI Type 1 Header (256 bytes)';
    svg += svgText(W/2, 28, title, C.primary, 16, 'middle', 700);

    // Register map — 4 columns of 32 bits each row = 16 bytes per row
    var startX = 40, startY = 50;
    var colW = 220, rowH = 26;
    var cols = 4;
    var totalW = colW * cols;

    // Column headers (byte offsets within each DWORD)
    var byteLabels = ['+3  +2', '+1  +0'];
    svg += svgText(startX + colW * 0.5, startY, '31          24 23          16', C.muted, 9, 'middle', 400);
    svg += svgText(startX + colW * 0.5 + colW*2, startY, '15           8  7            0', C.muted, 9, 'middle', 400);

    startY += 10;

    var regs;
    if (currentConfigView === 'type0') {
        regs = getType0Registers();
    } else {
        regs = getType1Registers();
    }

    for (var i = 0; i < regs.length; i++) {
        var row = regs[i];
        var ry = startY + (i + 1) * rowH;

        // Offset label
        svg += svgText(startX - 8, ry + rowH/2 + 4, row.offset, C.muted, 10, 'end', 500);

        for (var j = 0; j < row.fields.length; j++) {
            var field = row.fields[j];
            var fx = startX + field.x * totalW;
            var fw = field.w * totalW;
            svg += svgRect(fx, ry, fw - 2, rowH - 2, field.fill || C.pciFill, field.stroke || C.pciDim, 4);
            svg += '<text x="'+(fx + fw/2 - 1)+'" y="'+(ry + rowH/2 + 3)+'" text-anchor="middle" fill="'+(field.color || C.pci)+'" font-family="JetBrains Mono,monospace" font-size="10" font-weight="500"'
                 + ' data-reg="'+field.key+'"'
                 + ' style="cursor:pointer;"'
                 + '>'+field.label+'</text>';
            // invisible hover rect
            svg += '<rect x="'+fx+'" y="'+ry+'" width="'+(fw-2)+'" height="'+(rowH-2)+'" fill="transparent" data-reg="'+field.key+'" style="cursor:pointer;"/>';
        }
    }

    svg += '</svg>';
    el.innerHTML = svg;
    attachRegisterTooltips(el);
}

function getType0Registers() {
    // Each row: offset label, array of fields
    // Each field: x (0-1 fraction of total width), w (fraction), label, key, fill, stroke, color
    return [
        { offset: '00h', fields: [
            { x: 0,    w: 0.5,  label: 'Device ID',       key: 'deviceid',   fill: C.pciFill,    stroke: C.pciDim,    color: C.pci },
            { x: 0.5,  w: 0.5,  label: 'Vendor ID',       key: 'vendorid',   fill: C.pciFill,    stroke: C.pciDim,    color: C.pci },
        ]},
        { offset: '04h', fields: [
            { x: 0,    w: 0.5,  label: 'Status',           key: 'status',     fill: C.ecamFill,   stroke: C.ecamDim,   color: C.ecam },
            { x: 0.5,  w: 0.5,  label: 'Command',          key: 'command',    fill: C.ecamFill,   stroke: C.ecamDim,   color: C.ecam },
        ]},
        { offset: '08h', fields: [
            { x: 0,    w: 0.25, label: 'Class',            key: 'classcode',  fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.25, w: 0.25, label: 'SubCls',           key: 'classcode',  fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.5,  w: 0.25, label: 'ProgIF',           key: 'classcode',  fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.75, w: 0.25, label: 'RevID',            key: 'revisionid', fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
        ]},
        { offset: '0Ch', fields: [
            { x: 0,    w: 0.25, label: 'BIST',             key: 'bist',       fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.25, w: 0.25, label: 'HdrType',          key: 'headertype', fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.5,  w: 0.25, label: 'LatTmr',           key: 'latency',    fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.75, w: 0.25, label: 'CchLn',            key: 'cacheline',  fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
        ]},
        { offset: '10h', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 0 (Base Address Register 0)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '14h', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 1 (Base Address Register 1)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '18h', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 2 (Base Address Register 2)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '1Ch', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 3 (Base Address Register 3)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '20h', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 4 (Base Address Register 4)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '24h', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 5 (Base Address Register 5)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '28h', fields: [
            { x: 0,    w: 1.0,  label: 'CardBus CIS Pointer',             key: 'bar', fill: C.driverFill, stroke: C.driverDim, color: C.driver },
        ]},
        { offset: '2Ch', fields: [
            { x: 0,    w: 0.5,  label: 'Subsystem Device ID', key: 'subsystem', fill: C.driverFill, stroke: C.driverDim, color: C.driver },
            { x: 0.5,  w: 0.5,  label: 'Subsystem Vendor ID', key: 'subsystem', fill: C.driverFill, stroke: C.driverDim, color: C.driver },
        ]},
        { offset: '30h', fields: [
            { x: 0,    w: 1.0,  label: 'Expansion ROM Base Address',       key: 'exprom', fill: C.driverFill, stroke: C.driverDim, color: C.driver },
        ]},
        { offset: '34h', fields: [
            { x: 0,    w: 0.25, label: 'Reserved',         key: 'capptr',     fill: 'rgba(42,48,64,0.5)', stroke: C.dimmed,   color: C.dimText },
            { x: 0.25, w: 0.25, label: 'Reserved',         key: 'capptr',     fill: 'rgba(42,48,64,0.5)', stroke: C.dimmed,   color: C.dimText },
            { x: 0.5,  w: 0.25, label: 'Reserved',         key: 'capptr',     fill: 'rgba(42,48,64,0.5)', stroke: C.dimmed,   color: C.dimText },
            { x: 0.75, w: 0.25, label: 'CapPtr',           key: 'capptr',     fill: C.ecamFill,   stroke: C.ecamDim,   color: C.ecam },
        ]},
        { offset: '38h', fields: [
            { x: 0,    w: 1.0,  label: 'Reserved',         key: 'capptr',     fill: 'rgba(42,48,64,0.5)', stroke: C.dimmed, color: C.dimText },
        ]},
        { offset: '3Ch', fields: [
            { x: 0,    w: 0.25, label: 'MaxLat',           key: 'intline',    fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.25, w: 0.25, label: 'MinGnt',           key: 'intline',    fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.5,  w: 0.25, label: 'IntPin',           key: 'intpin',     fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.75, w: 0.25, label: 'IntLine',          key: 'intline',    fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
        ]},
    ];
}

function getType1Registers() {
    return [
        { offset: '00h', fields: [
            { x: 0,    w: 0.5,  label: 'Device ID',       key: 'deviceid',   fill: C.pciFill,    stroke: C.pciDim,    color: C.pci },
            { x: 0.5,  w: 0.5,  label: 'Vendor ID',       key: 'vendorid',   fill: C.pciFill,    stroke: C.pciDim,    color: C.pci },
        ]},
        { offset: '04h', fields: [
            { x: 0,    w: 0.5,  label: 'Status',           key: 'status',     fill: C.ecamFill,   stroke: C.ecamDim,   color: C.ecam },
            { x: 0.5,  w: 0.5,  label: 'Command',          key: 'command',    fill: C.ecamFill,   stroke: C.ecamDim,   color: C.ecam },
        ]},
        { offset: '08h', fields: [
            { x: 0,    w: 0.25, label: 'Class',            key: 'classcode',  fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.25, w: 0.25, label: 'SubCls',           key: 'classcode',  fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.5,  w: 0.25, label: 'ProgIF',           key: 'classcode',  fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.75, w: 0.25, label: 'RevID',            key: 'revisionid', fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
        ]},
        { offset: '0Ch', fields: [
            { x: 0,    w: 0.25, label: 'BIST',             key: 'bist',       fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.25, w: 0.25, label: 'HdrType',          key: 'headertype', fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.5,  w: 0.25, label: 'LatTmr',           key: 'latency',    fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.75, w: 0.25, label: 'CchLn',            key: 'cacheline',  fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
        ]},
        { offset: '10h', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 0 (Base Address Register 0)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '14h', fields: [
            { x: 0,    w: 1.0,  label: 'BAR 1 (Base Address Register 1)',  key: 'bar', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '18h', fields: [
            { x: 0,    w: 0.25, label: 'SecLat',           key: 'latency',    fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.25, w: 0.25, label: 'SubBus',           key: 'subbus',     fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.5,  w: 0.25, label: 'SecBus',           key: 'secbus',     fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.75, w: 0.25, label: 'PriBus',           key: 'pribus',     fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
        ]},
        { offset: '1Ch', fields: [
            { x: 0,    w: 0.25, label: 'SecSts',           key: 'status',     fill: C.ecamFill,   stroke: C.ecamDim,   color: C.ecam },
            { x: 0.25, w: 0.25, label: 'IOLmt',            key: 'iobase',     fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.5,  w: 0.25, label: 'IOBase',           key: 'iobase',     fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.75, w: 0.25, label: '',                 key: 'iobase',     fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
        ]},
        { offset: '20h', fields: [
            { x: 0,    w: 0.5,  label: 'Memory Limit',     key: 'membase',    fill: C.barFill,    stroke: C.barDim,    color: C.bar },
            { x: 0.5,  w: 0.5,  label: 'Memory Base',      key: 'membase',    fill: C.barFill,    stroke: C.barDim,    color: C.bar },
        ]},
        { offset: '24h', fields: [
            { x: 0,    w: 0.5,  label: 'Prefetch Limit',   key: 'prefbase',   fill: C.barFill,    stroke: C.barDim,    color: C.bar },
            { x: 0.5,  w: 0.5,  label: 'Prefetch Base',    key: 'prefbase',   fill: C.barFill,    stroke: C.barDim,    color: C.bar },
        ]},
        { offset: '28h', fields: [
            { x: 0,    w: 1.0,  label: 'Prefetchable Base Upper 32 Bits',  key: 'prefbase', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '2Ch', fields: [
            { x: 0,    w: 1.0,  label: 'Prefetchable Limit Upper 32 Bits', key: 'prefbase', fill: C.barFill, stroke: C.barDim, color: C.bar },
        ]},
        { offset: '30h', fields: [
            { x: 0,    w: 0.5,  label: 'I/O Limit Upper 16', key: 'iobase',  fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.5,  w: 0.5,  label: 'I/O Base Upper 16',  key: 'iobase',  fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
        ]},
        { offset: '34h', fields: [
            { x: 0,    w: 0.75, label: 'Reserved',         key: 'capptr',     fill: 'rgba(42,48,64,0.5)', stroke: C.dimmed, color: C.dimText },
            { x: 0.75, w: 0.25, label: 'CapPtr',           key: 'capptr',     fill: C.ecamFill,   stroke: C.ecamDim,   color: C.ecam },
        ]},
        { offset: '38h', fields: [
            { x: 0,    w: 1.0,  label: 'Expansion ROM Base Address',       key: 'exprom', fill: C.driverFill, stroke: C.driverDim, color: C.driver },
        ]},
        { offset: '3Ch', fields: [
            { x: 0,    w: 0.5,  label: 'Bridge Control',   key: 'bridgectrl', fill: C.bridgeFill, stroke: C.bridgeDim, color: C.bridge },
            { x: 0.5,  w: 0.25, label: 'IntPin',           key: 'intpin',     fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
            { x: 0.75, w: 0.25, label: 'IntLine',          key: 'intline',    fill: C.ioFill,     stroke: C.ioDim,     color: C.io },
        ]},
    ];
}

function renderExtendedConfigSpace(el) {
    var W = 960, H = 400;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    svg += svgText(W/2, 28, 'PCIe Extended Configuration Space (4096 bytes)', C.accent, 16, 'middle', 700);

    var startX = 60, startY = 55;
    var totalW = W - 120, rowH = 30;

    // Standard 256 bytes
    svg += svgRect(startX, startY, totalW, rowH * 2, C.pciFill, C.pciDim, 6);
    svg += svgText(startX + totalW/2, startY + rowH, 'Standard PCI Header (0x000 - 0x0FF) — 256 bytes', C.pci, 13, 'middle', 600);
    svg += svgText(startX - 8, startY + rowH, '0x000', C.muted, 10, 'end', 500);

    // Extended capabilities
    var extCaps = [
        { name: 'PCIe Capability',               offset: '0x100', color: C.ecam,   fill: C.ecamFill,   stroke: C.ecamDim },
        { name: 'AER (Advanced Error Reporting)', offset: '0x100+', color: C.driver, fill: C.driverFill, stroke: C.driverDim },
        { name: 'ACS (Access Control Services)',  offset: '',      color: C.bridge, fill: C.bridgeFill, stroke: C.bridgeDim },
        { name: 'ARI (Alt Routing-ID)',           offset: '',      color: C.bar,    fill: C.barFill,    stroke: C.barDim },
        { name: 'L1 PM Substates',               offset: '',      color: C.io,     fill: C.ioFill,     stroke: C.ioDim },
        { name: 'DPC (Downstream Port Contain.)', offset: '',      color: C.arm,    fill: C.armFill,    stroke: C.armDim },
        { name: 'SR-IOV (Single Root I/O Virt.)', offset: '',      color: C.x86,    fill: C.x86Fill,    stroke: C.x86Dim },
        { name: '... more capabilities ...',      offset: '',      color: C.muted,  fill: 'rgba(42,48,64,0.5)', stroke: C.dimmed },
    ];

    var capY = startY + rowH * 2 + 15;
    svg += svgText(startX - 8, capY + 12, '0x100', C.muted, 10, 'end', 500);

    for (var i = 0; i < extCaps.length; i++) {
        var cap = extCaps[i];
        var cy = capY + i * (rowH + 4);
        svg += svgRect(startX, cy, totalW, rowH, cap.fill, cap.stroke, 4);
        svg += svgText(startX + totalW/2, cy + rowH/2 + 4, cap.name, cap.color, 12, 'middle', 500);
    }

    var lastY = capY + extCaps.length * (rowH + 4) + 5;
    svg += svgText(startX - 8, lastY, '0xFFF', C.muted, 10, 'end', 500);

    // Annotation: linked list
    svg += svgText(W - 60, startY + 20, 'Each extended capability', C.muted, 10, 'end', 400);
    svg += svgText(W - 60, startY + 34, 'has a Next Pointer field', C.muted, 10, 'end', 400);
    svg += svgText(W - 60, startY + 48, 'forming a linked list', C.muted, 10, 'end', 400);

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ====================== register tooltip ========================== */
function attachRegisterTooltips(container) {
    var tooltip = document.getElementById('reg-tooltip');
    if (!tooltip) return;

    var els = container.querySelectorAll('[data-reg]');
    els.forEach(function(el) {
        el.addEventListener('mouseenter', function(e) {
            var key = e.target.getAttribute('data-reg');
            var name = e.target.textContent || key;
            var desc = t('reg.' + key);
            tooltip.querySelector('.tt-name').textContent = name;
            tooltip.querySelector('.tt-offset').textContent = key;
            tooltip.querySelector('.tt-desc').textContent = desc;
            tooltip.classList.add('visible');
        });
        el.addEventListener('mousemove', function(e) {
            tooltip.style.left = (e.clientX + 16) + 'px';
            tooltip.style.top  = (e.clientY + 16) + 'px';
        });
        el.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });
    });
}

/* ====================== ACCESS DIAGRAM ============================ */
function renderAccessDiagram() {
    var el = document.getElementById('access-diagram');
    if (!el) return;

    var W = 960, H = 380;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // Two columns: x86 left, ARM right
    var midX = W / 2;
    var colW = 380, colH = 310;
    var leftX = midX - colW - 20;
    var rightX = midX + 20;
    var topY = 40;

    // x86 column
    svg += svgRect(leftX, topY, colW, colH, C.x86Fill, C.x86Dim, 12);
    svg += svgText(leftX + colW/2, topY + 25, 'x86_64', C.x86, 15, 'middle', 700);

    // CF8/CFC path
    var bx = leftX + 20, by = topY + 50, bw = colW - 40, bh = 50;
    svg += svgRect(bx, by, bw, bh, 'rgba(249,115,22,0.08)', C.pciDim, 8);
    svg += svgText(bx + bw/2, by + 18, 'Legacy: CF8h / CFCh (I/O Ports)', C.pci, 11, 'middle', 600);
    svg += svgText(bx + bw/2, by + 36, 'PciCf8Lib — 256-byte space only', C.muted, 10, 'middle', 400);

    // ECAM path
    var ey = by + bh + 15;
    svg += svgRect(bx, ey, bw, bh, C.ecamFill, C.ecamDim, 8);
    svg += svgText(bx + bw/2, ey + 18, 'ECAM / MMCONFIG (Memory-Mapped)', C.ecam, 11, 'middle', 600);
    svg += svgText(bx + bw/2, ey + 36, 'PciExpressLib — Full 4K space', C.muted, 10, 'middle', 400);

    // Hardware box
    var hy = ey + bh + 30;
    svg += svgRect(bx, hy, bw, 45, 'rgba(42,48,64,0.5)', C.dimmed, 8);
    svg += svgText(bx + bw/2, hy + 16, 'PCI Host Bridge Hardware', C.text, 12, 'middle', 600);
    svg += svgText(bx + bw/2, hy + 34, 'Chipset / PCH / RC', C.muted, 10, 'middle', 400);

    // Arrows
    svg += svgArrow(bx + bw/2, by + bh, bx + bw/2 - 30, hy, C.pci, false);
    svg += svgArrow(bx + bw/2, ey + bh, bx + bw/2 + 30, hy, C.ecam, false);

    // MCFG note
    var my = hy + 55;
    svg += svgRect(bx + 20, my, bw - 40, 35, 'rgba(249,115,22,0.06)', 'rgba(249,115,22,0.15)', 6);
    svg += svgText(bx + bw/2, my + 22, 'MCFG ACPI Table → ECAM Base Address', C.pci, 10, 'middle', 500);

    // ARM column
    svg += svgRect(rightX, topY, colW, colH, C.armFill, C.armDim, 12);
    svg += svgText(rightX + colW/2, topY + 25, 'ARM64', C.arm, 15, 'middle', 700);

    var abx = rightX + 20, aby = topY + 50, abw = colW - 40;

    // ECAM only
    svg += svgRect(abx, aby, abw, 65, C.ecamFill, C.ecamDim, 8);
    svg += svgText(abx + abw/2, aby + 18, 'ECAM Only (Memory-Mapped)', C.ecam, 11, 'middle', 600);
    svg += svgText(abx + abw/2, aby + 36, 'PciSegmentLib (ECAM impl)', C.muted, 10, 'middle', 400);
    svg += svgText(abx + abw/2, aby + 52, 'No I/O port support on ARM', C.muted, 9, 'middle', 400);

    // Hardware box
    var ahy = aby + 65 + 30;
    svg += svgRect(abx, ahy, abw, 45, 'rgba(42,48,64,0.5)', C.dimmed, 8);
    svg += svgText(abx + abw/2, ahy + 16, 'PCI Host Bridge (SoC)', C.text, 12, 'middle', 600);
    svg += svgText(abx + abw/2, ahy + 34, 'ARM SoC PCIe RC', C.muted, 10, 'middle', 400);

    svg += svgArrow(abx + abw/2, aby + 65, abx + abw/2, ahy, C.ecam, false);

    // MCFG / DT note
    var amy = ahy + 55;
    svg += svgRect(abx + 10, amy, abw - 20, 35, 'rgba(74,222,128,0.06)', 'rgba(74,222,128,0.15)', 6);
    svg += svgText(abx + abw/2, amy + 22, 'MCFG ACPI Table or Device Tree → Base', C.arm, 10, 'middle', 500);

    // CF8h format at bottom
    svg += svgText(midX, H - 15, t('access.cf8.format'), C.muted, 9, 'middle', 400);

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ====================== ENUMERATION STEP ENGINE =================== */
var currentEnumStep = 0;
var ENUM_TOTAL_STEPS = 11;

function renderEnumStep(step) {
    currentEnumStep = step;
    var el = document.getElementById('enum-diagram');
    if (!el) return;

    // update controls
    document.getElementById('enum-prev').disabled = (step === 0);
    document.getElementById('enum-next').disabled = (step === ENUM_TOTAL_STEPS - 1);
    document.getElementById('enum-indicator').textContent = 'Step ' + (step + 1) + ' / ' + ENUM_TOTAL_STEPS;

    // update description
    var si = step + 1;
    document.getElementById('enum-step-title').textContent = t('enum.step'+si+'.title');
    document.getElementById('enum-step-desc').textContent  = t('enum.step'+si+'.desc');
    document.getElementById('enum-step-detail').textContent = t('enum.step'+si+'.detail');

    // render SVG
    var W = 960, H = 440;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // Draw the bus topology that builds progressively
    svg += renderEnumTopology(step, W, H);

    svg += '</svg>';
    el.innerHTML = svg;
}

function renderEnumTopology(step, W, H) {
    var s = '';

    // Layout constants
    var hostX = W/2 - 80, hostY = 20, hostW = 160, hostH = 40;
    var rbX = W/2 - 70, rbY = 90, rbW = 140, rbH = 36;
    var busY = 155, busW = W - 100, busX = 50;
    var devW = 110, devH = 55, devGap = 20;

    // Color states
    var activeColor = C.pci;
    var doneColor = C.done;
    var pendingColor = C.dimmed;
    var pendingText = C.dimText;

    // Step 1: Host Bridge
    var hbColor = step >= 0 ? (step > 0 ? doneColor : activeColor) : pendingColor;
    var hbText  = step >= 0 ? C.text : pendingText;
    s += svgRect(hostX, hostY, hostW, hostH, step >= 0 ? 'rgba(249,115,22,0.1)' : 'rgba(42,48,64,0.5)', hbColor, 8);
    s += svgText(hostX + hostW/2, hostY + 16, 'PCI Host Bridge', hbText, 11, 'middle', 600);
    s += svgText(hostX + hostW/2, hostY + 32, 'ResourceAlloc Protocol', step >= 0 ? C.muted : pendingText, 9, 'middle', 400);

    // Step 2: Root Bridge
    var rbColor = step >= 1 ? (step > 1 ? doneColor : activeColor) : pendingColor;
    var rbTextC = step >= 1 ? C.text : pendingText;
    s += svgRect(rbX, rbY, rbW, rbH, step >= 1 ? C.bridgeFill : 'rgba(42,48,64,0.5)', rbColor, 8);
    s += svgText(rbX + rbW/2, rbY + 14, 'Root Bridge', rbTextC, 11, 'middle', 600);
    s += svgText(rbX + rbW/2, rbY + 29, 'RootBridgeIo', step >= 1 ? C.muted : pendingText, 9, 'middle', 400);

    if (step >= 1) {
        s += svgArrow(hostX + hostW/2, hostY + hostH, rbX + rbW/2, rbY, step > 1 ? doneColor : activeColor, false);
    }

    // Step 3+: PciBusDxe box
    var pciBusX = rbX + rbW + 30, pciBusY = rbY, pciBusW = 130, pciBusH = 36;
    if (step >= 2) {
        var pbColor = step > 2 ? doneColor : activeColor;
        s += svgRect(pciBusX, pciBusY, pciBusW, pciBusH, C.ecamFill, pbColor, 8);
        s += svgText(pciBusX + pciBusW/2, pciBusY + 14, 'PciBusDxe', C.text, 11, 'middle', 600);
        s += svgText(pciBusX + pciBusW/2, pciBusY + 29, 'DriverBinding', C.muted, 9, 'middle', 400);
        s += svgArrow(rbX + rbW, rbY + rbH/2, pciBusX, pciBusY + pciBusH/2, pbColor, true);
    }

    // Bus 0 line
    if (step >= 3) {
        var lineY = busY + 10;
        s += '<line x1="'+busX+'" y1="'+lineY+'" x2="'+(busX+busW)+'" y2="'+lineY+'" stroke="'+(step > 3 ? doneColor : activeColor)+'" stroke-width="2"/>';
        s += svgText(busX, lineY - 8, 'Bus 0', step > 3 ? C.muted : activeColor, 11, 'start', 600);
        s += svgArrow(rbX + rbW/2, rbY + rbH, rbX + rbW/2, lineY, step > 3 ? doneColor : activeColor, false);
    }

    // Devices on Bus 0
    var devices = [
        { label: 'Dev 0:0', sub: 'NVMe Ctrl', type: 'endpoint' },
        { label: 'Dev 1:0', sub: 'PCI Bridge', type: 'bridge' },
        { label: 'Dev 2:0', sub: 'USB Ctrl',   type: 'endpoint' },
        { label: 'Dev 3:0', sub: 'NIC',        type: 'endpoint' },
    ];

    var devStartX = busX + 40;
    var devSpacing = (busW - 80) / devices.length;

    if (step >= 4) {
        var lineY = busY + 10;
        for (var i = 0; i < devices.length; i++) {
            var d = devices[i];
            var dx = devStartX + i * devSpacing;
            var dy = lineY + 20;
            var isActive = (step === 4 && i === 0) || (step === 4);
            var isDone = step > 4;
            var fillC, strokeC, textC;

            if (d.type === 'bridge') {
                fillC = isDone || step >= 4 ? C.bridgeFill : 'rgba(42,48,64,0.5)';
                strokeC = isDone ? doneColor : (step >= 4 ? C.bridge : pendingColor);
                textC = isDone || step >= 4 ? C.text : pendingText;
            } else {
                fillC = isDone || step >= 4 ? C.pciFill : 'rgba(42,48,64,0.5)';
                strokeC = isDone ? doneColor : (step >= 4 ? C.pci : pendingColor);
                textC = isDone || step >= 4 ? C.text : pendingText;
            }

            s += '<line x1="'+(dx+devW/2)+'" y1="'+lineY+'" x2="'+(dx+devW/2)+'" y2="'+dy+'" stroke="'+strokeC+'" stroke-width="1.5"/>';
            s += svgRect(dx, dy, devW, devH, fillC, strokeC, 8);
            s += svgText(dx + devW/2, dy + 18, d.label, textC, 10, 'middle', 600);
            s += svgText(dx + devW/2, dy + 34, d.sub, isDone || step >= 4 ? C.muted : pendingText, 9, 'middle', 400);

            // Vendor ID check marks for step 5
            if (step >= 5 && step <= 5) {
                s += svgText(dx + devW - 8, dy + 12, '0x8086', C.bar, 8, 'end', 500);
            }
        }
    }

    // Step 5: detection highlight
    if (step === 5) {
        s += svgText(W/2, H - 30, 'Vendor ID != 0xFFFF → Device Present  |  Check Header Type Bit 7', C.pci, 11, 'middle', 500);
    }

    // Step 6: PCI_IO_DEVICE structures
    if (step >= 6) {
        for (var i = 0; i < devices.length; i++) {
            var dx = devStartX + i * devSpacing;
            var dy = busY + 10 + 20 + devH + 10;
            s += svgRect(dx + 5, dy, devW - 10, 22, 'rgba(56,189,248,0.06)', C.ecamDim, 4);
            s += svgText(dx + devW/2, dy + 15, 'PCI_IO_DEVICE', C.ecam, 8, 'middle', 500);
        }
    }

    // Step 7: BAR sizing annotation
    if (step === 7) {
        var annY = H - 65;
        s += svgRect(80, annY, W - 160, 50, 'rgba(52,211,153,0.06)', C.barDim, 8);
        s += svgText(W/2, annY + 18, 'BAR Sizing: Write 0xFFFFFFFF → Read Back → Calculate Size', C.bar, 12, 'middle', 600);
        s += svgText(W/2, annY + 38, 'Bit 0: Mem(0)/IO(1) | Bit 1-2: 32-bit/64-bit | ~(readback & mask) + 1 = size', C.muted, 10, 'middle', 400);
    }

    // Step 8: Resource submission
    if (step === 8) {
        var annY = H - 65;
        s += svgRect(80, annY, W - 160, 50, 'rgba(249,115,22,0.06)', C.pciDim, 8);
        s += svgText(W/2, annY + 18, 'SubmitResources() → Host Bridge', C.pci, 12, 'middle', 600);
        s += svgText(W/2, annY + 38, 'Aggregate MMIO + I/O + Prefetchable requirements from all devices', C.muted, 10, 'middle', 400);
    }

    // Step 9: Address assignment
    if (step === 9) {
        for (var i = 0; i < devices.length; i++) {
            var dx = devStartX + i * devSpacing;
            var dy = busY + 10 + 20;
            // Show BAR address
            s += svgText(dx + devW/2, dy + devH - 4, '0x' + ((0xA0000000 + i * 0x10000000).toString(16)).toUpperCase(), C.bar, 8, 'middle', 600);
        }
        var annY = H - 45;
        s += svgText(W/2, annY, 'NotifyPhase(SetResources) → Program BAR addresses', C.bar, 11, 'middle', 500);
    }

    // Step 10: PCI IO Protocol
    if (step >= 10) {
        for (var i = 0; i < devices.length; i++) {
            var dx = devStartX + i * devSpacing;
            var dy = busY + 10 + 20 + devH + 35;
            s += svgRect(dx, dy, devW, 22, C.driverFill, C.driverDim, 4);
            s += svgText(dx + devW/2, dy + 15, 'EFI_PCI_IO_PROTOCOL', C.driver, 8, 'middle', 500);
        }
    }

    // Step 11: Command register enable
    if (step >= 10) {
        var annY = H - 45;
        var msg = step === 10 ? 'Install EFI_PCI_IO_PROTOCOL on each device Handle'
                              : 'Set Command Register: Bit 1 (Mem Enable) + Bit 2 (Bus Master)';
        var msgC = step === 10 ? C.driver : C.pci;
        s += svgText(W/2, annY, msg, msgC, 11, 'middle', 500);
    }

    // Secondary bus from bridge (visible from step 6+)
    if (step >= 6) {
        var bridgeIdx = 1;
        var bx = devStartX + bridgeIdx * devSpacing;
        var by2 = busY + 10 + 20 + devH + (step >= 6 ? 65 : 30);
        var bus1LineY = by2 + 15;
        var bus1X1 = bx - 60;
        var bus1X2 = bx + devW + 60;

        s += '<line x1="'+bus1X1+'" y1="'+bus1LineY+'" x2="'+bus1X2+'" y2="'+bus1LineY+'" stroke="'+C.bridge+'" stroke-width="1.5" stroke-dasharray="4,3"/>';
        s += svgText(bus1X1, bus1LineY - 6, 'Bus 1', C.bridge, 9, 'start', 600);

        // Downstream device
        var ddy = bus1LineY + 15;
        s += '<line x1="'+(bx+devW/2)+'" y1="'+bus1LineY+'" x2="'+(bx+devW/2)+'" y2="'+ddy+'" stroke="'+C.bridge+'" stroke-width="1"/>';
        s += svgRect(bx + 5, ddy, devW - 10, 40, C.barFill, C.barDim, 6);
        s += svgText(bx + devW/2, ddy + 15, 'Dev 0:0', C.text, 9, 'middle', 600);
        s += svgText(bx + devW/2, ddy + 30, 'GPU', C.muted, 8, 'middle', 400);
    }

    return s;
}

/* ====================== ROOT BRIDGE IO DIAGRAM ==================== */
function renderRootBridgeDiagram() {
    var el = document.getElementById('rootbridge-diagram');
    if (!el) return;

    var W = 960, H = 320;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // Layered architecture: DXE Driver → PciBusDxe → Root Bridge IO → Hardware
    var layers = [
        { label: 'DXE Drivers / PciBusDxe',          sub: 'Consumer',       color: C.ecam,   fill: C.ecamFill,   dim: C.ecamDim },
        { label: 'EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL',  sub: 'Pci / Mem / Io / Map / AllocateBuffer / Configuration', color: C.pci, fill: C.pciFill, dim: C.pciDim },
        { label: 'Platform Implementation',           sub: 'PciHostBridgeDxe (x86: CF8+ECAM | ARM: ECAM only)', color: C.bridge, fill: C.bridgeFill, dim: C.bridgeDim },
        { label: 'Hardware',                          sub: 'PCI Host Bridge / Root Complex / PCIe RC', color: C.muted, fill: 'rgba(42,48,64,0.5)', dim: C.dimmed },
    ];

    var layerH = 55, gap = 18;
    var lx = 100, lw = W - 200;
    var startY = 30;

    for (var i = 0; i < layers.length; i++) {
        var l = layers[i];
        var ly = startY + i * (layerH + gap);
        svg += svgRect(lx, ly, lw, layerH, l.fill, l.dim, 10);
        svg += svgText(lx + lw/2, ly + 22, l.label, l.color, 13, 'middle', 600);
        svg += svgText(lx + lw/2, ly + 42, l.sub, C.muted, 10, 'middle', 400);

        if (i < layers.length - 1) {
            svg += svgArrow(lx + lw/2, ly + layerH, lx + lw/2, ly + layerH + gap, layers[i+1].color, false);
        }
    }

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ====================== PCI IO DIAGRAM ============================ */
function renderPciIoDiagram() {
    var el = document.getElementById('pciio-diagram');
    if (!el) return;

    var W = 960, H = 380;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">';

    // Layered call chain
    var layers = [
        { label: 'Device Driver (NVMe, USB, NIC, GOP ...)',  sub: 'Consumer — does not know Bus:Dev:Fun',  color: C.driver, fill: C.driverFill, dim: C.driverDim },
        { label: 'EFI_PCI_IO_PROTOCOL',                      sub: 'Pci / Mem / Io / Map / GetLocation / Attributes / RomImage',  color: C.pci, fill: C.pciFill, dim: C.pciDim },
        { label: 'PciBusDxe (translates to RootBridgeIo)',    sub: 'Fills in Segment:Bus:Dev:Fun automatically',  color: C.ecam, fill: C.ecamFill, dim: C.ecamDim },
        { label: 'EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL',          sub: 'Pci.Read/Write with full BDF address',  color: C.bridge, fill: C.bridgeFill, dim: C.bridgeDim },
        { label: 'Hardware (CF8/CFC or ECAM)',                sub: 'Actual register read/write',  color: C.muted, fill: 'rgba(42,48,64,0.5)', dim: C.dimmed },
    ];

    var layerH = 50, gap = 16;
    var lx = 80, lw = W - 160;
    var startY = 25;

    for (var i = 0; i < layers.length; i++) {
        var l = layers[i];
        var ly = startY + i * (layerH + gap);
        svg += svgRect(lx, ly, lw, layerH, l.fill, l.dim, 10);
        svg += svgText(lx + lw/2, ly + 20, l.label, l.color, 12, 'middle', 600);
        svg += svgText(lx + lw/2, ly + 38, l.sub, C.muted, 10, 'middle', 400);

        if (i < layers.length - 1) {
            svg += svgArrow(lx + lw/2, ly + layerH, lx + lw/2, ly + layerH + gap, layers[i+1].color, false);
        }
    }

    svg += '</svg>';
    el.innerHTML = svg;
}

/* ====================== ARCH COMPARISON TABLE ===================== */
function renderArchComparison() {
    var el = document.getElementById('arch-table-container');
    if (!el) return;

    var rows = [
        { key: 'access' },
        { key: 'discovery' },
        { key: 'ioport' },
        { key: 'resource' },
        { key: 'lib' },
        { key: 'interrupt' },
        { key: 'dma' },
    ];

    var html = '<div class="arch-table-wrapper"><table class="arch-table">';
    html += '<thead><tr>';
    html += '<th>' + t('arch.col.feature') + '</th>';
    html += '<th>' + t('arch.col.x86') + '</th>';
    html += '<th>' + t('arch.col.arm') + '</th>';
    html += '</tr></thead><tbody>';

    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        html += '<tr>';
        html += '<td>' + t('arch.row.' + r.key) + '</td>';
        html += '<td>' + t('arch.row.' + r.key + '.x86') + '</td>';
        html += '<td>' + t('arch.row.' + r.key + '.arm') + '</td>';
        html += '</tr>';
    }

    html += '</tbody></table></div>';
    el.innerHTML = html;
}

/* ====================== scroll spy ================================ */
function setupScrollSpy() {
    var sections = document.querySelectorAll('.section, .panel');
    var navLinks = document.querySelectorAll('.nav-link');

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                navLinks.forEach(function(link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function(sec) {
        if (sec.id) observer.observe(sec);
    });
}

/* ====================== DOMContentLoaded ========================== */
document.addEventListener('DOMContentLoaded', function() {

    // render all static diagrams
    renderConfigSpace();
    renderAccessDiagram();
    renderRootBridgeDiagram();
    renderPciIoDiagram();
    renderArchComparison();

    // initial enum step
    renderEnumStep(0);

    // enum controls
    document.getElementById('enum-prev').addEventListener('click', function() {
        if (currentEnumStep > 0) {
            currentEnumStep--;
            renderEnumStep(currentEnumStep);
        }
    });
    document.getElementById('enum-next').addEventListener('click', function() {
        if (currentEnumStep < ENUM_TOTAL_STEPS - 1) {
            currentEnumStep++;
            renderEnumStep(currentEnumStep);
        }
    });
    document.getElementById('enum-reset').addEventListener('click', function() {
        currentEnumStep = 0;
        renderEnumStep(0);
    });

    // config space toggles
    document.querySelectorAll('.config-toggle-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.config-toggle-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentConfigView = btn.getAttribute('data-view');
            renderConfigSpace();
        });
    });

    // scroll spy
    setupScrollSpy();

    // override setLang to re-render diagrams
    var origSetLang = window.setLang;
    if (origSetLang) {
        window.setLang = function(lang) {
            origSetLang(lang);
            renderArchComparison();
        };
    }
});
