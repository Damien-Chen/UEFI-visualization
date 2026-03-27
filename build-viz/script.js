/* ── Pipeline Data ── */

const PIPELINE_TOOLS = [
    {
        id: 'build',
        nameKey: 'tool.build.name',
        descKey: 'tool.build.desc',
        inputKey: 'tool.build.input',
        outputKey: 'tool.build.output',
        stage: 'entry',
        x: 113, y: 190, w: 110, h: 44
    },
    {
        id: 'dscparser',
        nameKey: 'tool.dscparser.name',
        descKey: 'tool.dscparser.desc',
        inputKey: 'tool.dscparser.input',
        outputKey: 'tool.dscparser.output',
        stage: 'autogen',
        x: 253, y: 62, w: 100, h: 42
    },
    {
        id: 'infparser',
        nameKey: 'tool.infparser.name',
        descKey: 'tool.infparser.desc',
        inputKey: 'tool.infparser.input',
        outputKey: 'tool.infparser.output',
        stage: 'autogen',
        x: 253, y: 118, w: 100, h: 42
    },
    {
        id: 'decparser',
        nameKey: 'tool.decparser.name',
        descKey: 'tool.decparser.desc',
        inputKey: 'tool.decparser.input',
        outputKey: 'tool.decparser.output',
        stage: 'autogen',
        x: 361, y: 62, w: 100, h: 42
    },
    {
        id: 'fdfparser',
        nameKey: 'tool.fdfparser.name',
        descKey: 'tool.fdfparser.desc',
        inputKey: 'tool.fdfparser.input',
        outputKey: 'tool.fdfparser.output',
        stage: 'autogen',
        x: 361, y: 118, w: 100, h: 42
    },
    {
        id: 'autogen',
        nameKey: 'tool.autogen.name',
        descKey: 'tool.autogen.desc',
        inputKey: 'tool.autogen.input',
        outputKey: 'tool.autogen.output',
        stage: 'autogen',
        x: 253, y: 192, w: 208, h: 42
    },
    {
        id: 'make',
        nameKey: 'tool.make.name',
        descKey: 'tool.make.desc',
        inputKey: 'tool.make.input',
        outputKey: 'tool.make.output',
        stage: 'make',
        x: 495, y: 62, w: 202, h: 42
    },
    {
        id: 'compiler',
        nameKey: 'tool.compiler.name',
        descKey: 'tool.compiler.desc',
        inputKey: 'tool.compiler.input',
        outputKey: 'tool.compiler.output',
        stage: 'make',
        x: 495, y: 130, w: 93, h: 42
    },
    {
        id: 'linker',
        nameKey: 'tool.linker.name',
        descKey: 'tool.linker.desc',
        inputKey: 'tool.linker.input',
        outputKey: 'tool.linker.output',
        stage: 'make',
        x: 596, y: 130, w: 96, h: 42
    },
    {
        id: 'genfw',
        nameKey: 'tool.genfw.name',
        descKey: 'tool.genfw.desc',
        inputKey: 'tool.genfw.input',
        outputKey: 'tool.genfw.output',
        stage: 'make',
        x: 495, y: 198, w: 202, h: 42
    },
    {
        id: 'gensec',
        nameKey: 'tool.gensec.name',
        descKey: 'tool.gensec.desc',
        inputKey: 'tool.gensec.input',
        outputKey: 'tool.gensec.output',
        stage: 'imagegen',
        x: 728, y: 62, w: 108, h: 42
    },
    {
        id: 'genffs',
        nameKey: 'tool.genffs.name',
        descKey: 'tool.genffs.desc',
        inputKey: 'tool.genffs.input',
        outputKey: 'tool.genffs.output',
        stage: 'imagegen',
        x: 728, y: 118, w: 108, h: 42
    },
    {
        id: 'genfv',
        nameKey: 'tool.genfv.name',
        descKey: 'tool.genfv.desc',
        inputKey: 'tool.genfv.input',
        outputKey: 'tool.genfv.output',
        stage: 'imagegen',
        x: 844, y: 62, w: 108, h: 42
    },
    {
        id: 'genfds',
        nameKey: 'tool.genfds.name',
        descKey: 'tool.genfds.desc',
        inputKey: 'tool.genfds.input',
        outputKey: 'tool.genfds.output',
        stage: 'imagegen',
        x: 728, y: 192, w: 224, h: 42
    }
];

const STAGE_REGIONS = [
    { id: 'autogen', labelKey: 'pipeline.stage.autogen', x: 246, y: 28, w: 222, h: 256 },
    { id: 'make',    labelKey: 'pipeline.stage.make',    x: 488, y: 28, w: 216, h: 256 },
    { id: 'imagegen',labelKey: 'pipeline.stage.imagegen',x: 720, y: 28, w: 260, h: 256 }
];

/* ── Journey Data ── */

const JOURNEY_STEPS = {
    inf: [
        { titleKey: 'journey.inf.s1.title', programKey: 'journey.inf.s1.program', descKey: 'journey.inf.s1.desc', artifactKey: 'journey.inf.s1.artifact' },
        { titleKey: 'journey.inf.s2.title', programKey: 'journey.inf.s2.program', descKey: 'journey.inf.s2.desc', artifactKey: 'journey.inf.s2.artifact' },
        { titleKey: 'journey.inf.s3.title', programKey: 'journey.inf.s3.program', descKey: 'journey.inf.s3.desc', artifactKey: 'journey.inf.s3.artifact' },
        { titleKey: 'journey.inf.s4.title', programKey: 'journey.inf.s4.program', descKey: 'journey.inf.s4.desc', artifactKey: 'journey.inf.s4.artifact' },
        { titleKey: 'journey.inf.s5.title', programKey: 'journey.inf.s5.program', descKey: 'journey.inf.s5.desc', artifactKey: 'journey.inf.s5.artifact' },
        { titleKey: 'journey.inf.s6.title', programKey: 'journey.inf.s6.program', descKey: 'journey.inf.s6.desc', artifactKey: 'journey.inf.s6.artifact' },
        { titleKey: 'journey.inf.s7.title', programKey: 'journey.inf.s7.program', descKey: 'journey.inf.s7.desc', artifactKey: 'journey.inf.s7.artifact' },
        { titleKey: 'journey.inf.s8.title', programKey: 'journey.inf.s8.program', descKey: 'journey.inf.s8.desc', artifactKey: 'journey.inf.s8.artifact' },
        { titleKey: 'journey.inf.s9.title', programKey: 'journey.inf.s9.program', descKey: 'journey.inf.s9.desc', artifactKey: 'journey.inf.s9.artifact' }
    ],
    dsc: [
        { titleKey: 'journey.dsc.s1.title', programKey: 'journey.dsc.s1.program', descKey: 'journey.dsc.s1.desc', artifactKey: 'journey.dsc.s1.artifact' },
        { titleKey: 'journey.dsc.s2.title', programKey: 'journey.dsc.s2.program', descKey: 'journey.dsc.s2.desc', artifactKey: 'journey.dsc.s2.artifact' },
        { titleKey: 'journey.dsc.s3.title', programKey: 'journey.dsc.s3.program', descKey: 'journey.dsc.s3.desc', artifactKey: 'journey.dsc.s3.artifact' },
        { titleKey: 'journey.dsc.s4.title', programKey: 'journey.dsc.s4.program', descKey: 'journey.dsc.s4.desc', artifactKey: 'journey.dsc.s4.artifact' },
        { titleKey: 'journey.dsc.s5.title', programKey: 'journey.dsc.s5.program', descKey: 'journey.dsc.s5.desc', artifactKey: 'journey.dsc.s5.artifact' },
        { titleKey: 'journey.dsc.s6.title', programKey: 'journey.dsc.s6.program', descKey: 'journey.dsc.s6.desc', artifactKey: 'journey.dsc.s6.artifact' }
    ],
    fdf: [
        { titleKey: 'journey.fdf.s1.title', programKey: 'journey.fdf.s1.program', descKey: 'journey.fdf.s1.desc', artifactKey: 'journey.fdf.s1.artifact' },
        { titleKey: 'journey.fdf.s2.title', programKey: 'journey.fdf.s2.program', descKey: 'journey.fdf.s2.desc', artifactKey: 'journey.fdf.s2.artifact' },
        { titleKey: 'journey.fdf.s3.title', programKey: 'journey.fdf.s3.program', descKey: 'journey.fdf.s3.desc', artifactKey: 'journey.fdf.s3.artifact' },
        { titleKey: 'journey.fdf.s4.title', programKey: 'journey.fdf.s4.program', descKey: 'journey.fdf.s4.desc', artifactKey: 'journey.fdf.s4.artifact' },
        { titleKey: 'journey.fdf.s5.title', programKey: 'journey.fdf.s5.program', descKey: 'journey.fdf.s5.desc', artifactKey: 'journey.fdf.s5.artifact' }
    ]
};

/* ── State ── */

let activeToolId = null;
let activeJourneyTab = 'inf';

/* ── Utilities ── */

function escapeXml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ── Pipeline SVG ── */

function renderPipelineSVG() {
    const svg = document.getElementById('pipeline-svg');
    if (!svg) return;

    let html = `<defs>
        <marker id="parrow" markerWidth="8" markerHeight="7" refX="7" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="rgba(126,168,187,0.55)"></path>
        </marker>
    </defs>`;

    /* Stage background regions */
    STAGE_REGIONS.forEach(reg => {
        html += `<rect class="p-stage-bg" x="${reg.x}" y="${reg.y}" width="${reg.w}" height="${reg.h}" rx="10"></rect>`;
        html += `<text class="p-stage-label" x="${reg.x + reg.w / 2}" y="${reg.y + 17}">${escapeXml(t(reg.labelKey))}</text>`;
    });

    /* Input endpoint: x=10 to x=96 */
    html += `
        <rect class="p-endpoint-rect" x="10" y="182" width="92" height="56" rx="10"></rect>
        <text class="p-endpoint-text" x="56" y="207">${escapeXml(t('pipeline.stage.input'))}</text>
        <text class="p-endpoint-text" style="fill:#53b7de;font-size:9px" x="56" y="222">.inf / .dsc / .fdf</text>
    `;

    /* Main flow arrows */
    /* Input → build.exe (96 → 111) */
    html += `<path class="p-arrow" marker-end="url(#parrow)" d="M102,210 L111,210"></path>`;
    /* build.exe → AutoGen stage (223 → 244) */
    html += `<path class="p-arrow" marker-end="url(#parrow)" d="M223,212 L244,212"></path>`;
    /* AutoGen → MAKE (468 → 486) */
    html += `<path class="p-arrow" marker-end="url(#parrow)" d="M469,156 L486,156"></path>`;
    /* MAKE → ImageGen (704 → 718) */
    html += `<path class="p-arrow" marker-end="url(#parrow)" d="M705,156 L718,156"></path>`;
    /* ImageGen → Output (981 → 998) */
    html += `<path class="p-arrow" marker-end="url(#parrow)" d="M981,212 L998,212"></path>`;

    /* Output endpoint: x=1000 to x=1088 */
    html += `
        <rect class="p-endpoint-rect" style="stroke:rgba(255,159,90,0.5)" x="1000" y="182" width="90" height="56" rx="10"></rect>
        <text class="p-endpoint-text" style="fill:#ff9f5a" x="1045" y="207">${escapeXml(t('pipeline.stage.output'))}</text>
        <text class="p-endpoint-text" style="fill:#ff9f5a;font-size:9px" x="1045" y="222">*.fd</text>
    `;

    /* Tool nodes */
    PIPELINE_TOOLS.forEach(tool => {
        const cx = tool.x + tool.w / 2;
        const cy = tool.y + tool.h / 2;
        const isActive = tool.id === activeToolId;
        const stageClass = `pnode-${tool.stage}`;
        const activeClass = isActive ? 'active' : '';

        html += `
            <g class="pnode-group ${stageClass}" data-tool="${tool.id}" style="cursor:pointer">
                <rect class="pnode-rect ${activeClass}" x="${tool.x}" y="${tool.y}" width="${tool.w}" height="${tool.h}" rx="8"></rect>
                <text class="pnode-text" x="${cx}" y="${cy - 3}">${escapeXml(t(tool.nameKey))}</text>
            </g>
        `;
    });

    svg.innerHTML = html;

    /* Attach click handlers after DOM insert */
    svg.querySelectorAll('.pnode-group').forEach(g => {
        g.addEventListener('click', () => {
            const toolId = g.dataset.tool;
            showToolDetail(toolId);
        });
    });
}

function showToolDetail(toolId) {
    const tool = PIPELINE_TOOLS.find(item => item.id === toolId);
    if (!tool) return;

    activeToolId = toolId;
    renderPipelineSVG();

    const placeholder = document.getElementById('detail-placeholder');
    const content = document.getElementById('detail-content');
    const nameEl = document.getElementById('detail-name');
    const descEl = document.getElementById('detail-desc');
    const inputEl = document.getElementById('detail-input');
    const outputEl = document.getElementById('detail-output');

    if (!placeholder || !content) return;

    placeholder.classList.add('hidden');
    content.classList.remove('hidden');

    nameEl.textContent = t(tool.nameKey);
    descEl.textContent = t(tool.descKey);
    inputEl.textContent = t(tool.inputKey);
    outputEl.textContent = t(tool.outputKey);
}

/* ── Journey Tabs & Timeline ── */

function renderJourneyTimeline(tab) {
    const container = document.getElementById('journey-content');
    if (!container) return;

    const steps = JOURNEY_STEPS[tab];
    if (!steps) return;

    const titleKey = `journey.${tab}.title`;

    let html = `<p class="journey-timeline-title">${escapeXml(t(titleKey))}</p>`;
    html += `<div class="timeline">`;

    steps.forEach((step, index) => {
        const isLast = index === steps.length - 1;
        html += `
            <div class="timeline-step" data-file="${tab}">
                <div class="step-number-col">
                    <div class="step-number">${index + 1}</div>
                    ${!isLast ? '<div class="step-line"></div>' : ''}
                </div>
                <div class="step-body">
                    <div class="step-header">
                        <span class="step-title">${escapeXml(t(step.titleKey))}</span>
                        <span class="step-program">${escapeXml(t(step.programKey))}</span>
                    </div>
                    <p class="step-desc">${escapeXml(t(step.descKey))}</p>
                    <span class="step-artifact">${escapeXml(t(step.artifactKey))}</span>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function setActiveTab(tab) {
    activeJourneyTab = tab;

    document.querySelectorAll('.journey-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    renderJourneyTimeline(tab);
}

function initJourneyTabs() {
    document.querySelectorAll('.journey-tab').forEach(btn => {
        btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });

    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            const journeySection = document.getElementById('journey');
            if (journeySection) {
                journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setTimeout(() => setActiveTab(tab), 400);
        });
    });

    renderJourneyTimeline(activeJourneyTab);
}

/* ── Language change refresh ── */

function refreshDynamicContent() {
    renderPipelineSVG();
    renderJourneyTimeline(activeJourneyTab);
    if (activeToolId) {
        showToolDetail(activeToolId);
    }
}

/* ── Navigation ── */

function initNavigation() {
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver(entries => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visible.length === 0) return;

            const currentId = visible[0].target.id;
            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
            });
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: [0.1, 0.25, 0.4, 0.6]
        });

        sections.forEach(section => observer.observe(section));
    }
}

/* ── Build Command Builder ── */

function updateBuildCommand() {
    const platform = document.getElementById('platform-input').value.trim();
    const arch = document.getElementById('arch-select').value;
    const target = document.getElementById('target-select').value;
    const toolchain = document.getElementById('toolchain-select').value;
    const mode = document.getElementById('mode-select').value;
    const modulePath = document.getElementById('module-input').value.trim();
    const fdfPath = document.getElementById('fdf-input').value.trim();
    const useFdf = document.getElementById('fdf-enable').checked;
    const addFds = document.getElementById('fds-enable').checked;

    const cmd = ['build'];

    if (platform) cmd.push(`-p ${platform}`);
    if (mode === 'module' && modulePath) cmd.push(`-m ${modulePath}`);
    cmd.push(`-a ${arch}`);
    cmd.push(`-b ${target}`);
    cmd.push(`-t ${toolchain}`);
    if (useFdf && fdfPath) cmd.push(`-f ${fdfPath}`);
    if (addFds) cmd.push('fds');

    const output = document.getElementById('build-command-output');
    if (output) {
        output.textContent = `${t('command.generated')}\n${cmd.join(' \\\n    ')}`;
    }
}

function initBuildCommandBuilder() {
    const modeSelect = document.getElementById('mode-select');
    const moduleField = document.getElementById('module-field');
    if (!modeSelect) return;

    const controls = [
        'platform-input', 'arch-select', 'target-select', 'toolchain-select',
        'mode-select', 'module-input', 'fdf-input', 'fdf-enable', 'fds-enable'
    ];

    modeSelect.addEventListener('change', () => {
        moduleField.classList.toggle('hidden', modeSelect.value !== 'module');
        updateBuildCommand();
    });

    controls.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const evt = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';
        el.addEventListener(evt, updateBuildCommand);
    });

    moduleField.classList.toggle('hidden', modeSelect.value !== 'module');
    updateBuildCommand();
}

/* ── Init ── */

document.addEventListener('DOMContentLoaded', () => {
    initI18n();
    initNavigation();
    renderPipelineSVG();
    initJourneyTabs();
    initBuildCommandBuilder();
});
