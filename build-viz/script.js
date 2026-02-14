const FLOW_STEPS = [
    {
        titleKey: 'flow.step1.title',
        nodeKey: 'flow.step1.node',
        descKey: 'flow.step1.desc',
        inputKeys: ['flow.step1.in1', 'flow.step1.in2', 'flow.step1.in3'],
        outputKeys: ['flow.step1.out1', 'flow.step1.out2'],
        code: {
            en: `# Environment bootstrap\n> edksetup.bat Rebuild\n\nset WORKSPACE=D:\\edk2\nset EDK_TOOLS_PATH=%WORKSPACE%\\BaseTools\nset PATH=%EDK_TOOLS_PATH%\\Bin\\Win32;%PATH%`,
            'zh-TW': `# 初始化建置環境\n> edksetup.bat Rebuild\n\nset WORKSPACE=D:\\edk2\nset EDK_TOOLS_PATH=%WORKSPACE%\\BaseTools\nset PATH=%EDK_TOOLS_PATH%\\Bin\\Win32;%PATH%`
        }
    },
    {
        titleKey: 'flow.step2.title',
        nodeKey: 'flow.step2.node',
        descKey: 'flow.step2.desc',
        inputKeys: ['flow.step2.in1', 'flow.step2.in2', 'flow.step2.in3'],
        outputKeys: ['flow.step2.out1', 'flow.step2.out2'],
        code: {
            en: `# CLI can override target.txt\nbuild -p OvmfPkg/OvmfPkgX64.dsc -a X64 -b DEBUG -t GCC5\n\n# optional module mode\n# build -p ... -m MdeModulePkg/Application/HelloWorld/HelloWorld.inf`,
            'zh-TW': `# 命令列可覆蓋 target.txt\nbuild -p OvmfPkg/OvmfPkgX64.dsc -a X64 -b DEBUG -t GCC5\n\n# 模組模式\n# build -p ... -m MdeModulePkg/Application/HelloWorld/HelloWorld.inf`
        }
    },
    {
        titleKey: 'flow.step3.title',
        nodeKey: 'flow.step3.node',
        descKey: 'flow.step3.desc',
        inputKeys: ['flow.step3.in1', 'flow.step3.in2', 'flow.step3.in3'],
        outputKeys: ['flow.step3.out1', 'flow.step3.out2'],
        code: {
            en: `# Parse tool definitions and rules\nTOOL_CHAIN_CONF -> tools_def.txt\nBUILD_RULE_CONF -> build_rule.txt\n\n# derive CC / ASL / VFR / GENFW command macros`,
            'zh-TW': `# 解析工具鏈與規則\nTOOL_CHAIN_CONF -> tools_def.txt\nBUILD_RULE_CONF -> build_rule.txt\n\n# 產生 CC / ASL / VFR / GENFW 等命令巨集`
        }
    },
    {
        titleKey: 'flow.step4.title',
        nodeKey: 'flow.step4.node',
        descKey: 'flow.step4.desc',
        inputKeys: ['flow.step4.in1', 'flow.step4.in2', 'flow.step4.in3'],
        outputKeys: ['flow.step4.out1', 'flow.step4.out2'],
        code: {
            en: `# Metadata parse stage\nParse DSC -> components, library classes, PCD policy\nParse INF -> sources, packages, module type\nParse DEC -> includes, GUID/Protocol/PPI, default PCD\nParse FDF -> image layout, conditional directives`,
            'zh-TW': `# Meta-data 解析階段\n解析 DSC -> 元件、library class、PCD 政策\n解析 INF -> source、packages、module type\n解析 DEC -> include、GUID/Protocol/PPI、PCD 預設\n解析 FDF -> 映像版圖與條件式`
        }
    },
    {
        titleKey: 'flow.step5.title',
        nodeKey: 'flow.step5.node',
        descKey: 'flow.step5.desc',
        inputKeys: ['flow.step5.in1', 'flow.step5.in2', 'flow.step5.in3'],
        outputKeys: ['flow.step5.out1', 'flow.step5.out2'],
        code: {
            en: `# AutoGen post-process\nResolve library instances recursively\nApply PCD precedence (CLI > DSC > FDF > INF > DEC)\nGenerate AutoGen.c/AutoGen.h + module/platform makefiles\nEmit AsBuilt INF`,
            'zh-TW': `# AutoGen 後處理\n遞迴解 library instance\n套用 PCD 優先序 (CLI > DSC > FDF > INF > DEC)\n產生 AutoGen.c/AutoGen.h + makefiles\n輸出 AsBuilt INF`
        }
    },
    {
        titleKey: 'flow.step6.title',
        nodeKey: 'flow.step6.node',
        descKey: 'flow.step6.desc',
        inputKeys: ['flow.step6.in1', 'flow.step6.in2', 'flow.step6.in3'],
        outputKeys: ['flow.step6.out1', 'flow.step6.out2'],
        code: {
            en: `# MAKE stage\nmake -f Build/.../Module/OUTPUT/Makefile\n\n# typical artifacts\n*.obj -> *.lib -> PE32/PE32+ -> *.efi`,
            'zh-TW': `# MAKE 階段\nmake -f Build/.../Module/OUTPUT/Makefile\n\n# 常見產物\n*.obj -> *.lib -> PE32/PE32+ -> *.efi`
        }
    },
    {
        titleKey: 'flow.step7.title',
        nodeKey: 'flow.step7.node',
        descKey: 'flow.step7.desc',
        inputKeys: ['flow.step7.in1', 'flow.step7.in2', 'flow.step7.in3'],
        outputKeys: ['flow.step7.out1', 'flow.step7.out2'],
        code: {
            en: `# ImageGen path driven by GenFds\nGenSec:  .efi -> section\nGenFfs:  section -> .ffs\nGenFv:   ffs list -> .fv\nGenFds:  combine FV + regions -> .fd`,
            'zh-TW': `# 由 GenFds 驅動的 ImageGen\nGenSec:  .efi -> section\nGenFfs:  section -> .ffs\nGenFv:   ffs list -> .fv\nGenFds:  組合 FV + regions -> .fd`
        }
    },
    {
        titleKey: 'flow.step8.title',
        nodeKey: 'flow.step8.node',
        descKey: 'flow.step8.desc',
        inputKeys: ['flow.step8.in1', 'flow.step8.in2', 'flow.step8.in3'],
        outputKeys: ['flow.step8.out1', 'flow.step8.out2'],
        code: {
            en: `# Final deliverables\nBuild/OvmfX64/DEBUG_GCC5/FV/*.fv\nBuild/OvmfX64/DEBUG_GCC5/FV/*.fd\nBuild/OvmfX64/DEBUG_GCC5/FV/*.cap (optional)\nBuild/.../*.rom (option ROM path)`,
            'zh-TW': `# 最終交付物\nBuild/OvmfX64/DEBUG_GCC5/FV/*.fv\nBuild/OvmfX64/DEBUG_GCC5/FV/*.fd\nBuild/OvmfX64/DEBUG_GCC5/FV/*.cap (可選)\nBuild/.../*.rom (Option ROM 路徑)`
        }
    }
];

let currentFlowStep = 0;

function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function linesToTspans(lines, startX, startY, lineHeight) {
    return lines
        .map((line, index) => `<tspan x="${startX}" y="${startY + index * lineHeight}">${escapeXml(line)}</tspan>`)
        .join('');
}

function getFlowCode(step) {
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'en';
    return step.code[lang] || step.code.en;
}

function renderFlowDiagram(stepIndex) {
    const svg = document.getElementById('flow-svg');
    if (!svg) {
        return;
    }

    const nodeW = 116;
    const nodeH = 56;
    const startX = 16;
    const gap = 22;
    const nodeY = 44;

    let svgContent = `
        <defs>
            <marker id="flow-arrow-head" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#6ab7be"></path>
            </marker>
        </defs>
        <line class="flow-stage-line" x1="20" y1="72" x2="1085" y2="72"></line>
    `;

    FLOW_STEPS.forEach((step, index) => {
        const x = startX + index * (nodeW + gap);
        let cls = 'future';
        if (index < stepIndex) {
            cls = 'done';
        } else if (index === stepIndex) {
            cls = 'current';
        }

        svgContent += `
            <g class="flow-node ${cls}">
                <rect class="flow-node-rect" x="${x}" y="${nodeY}" rx="10" width="${nodeW}" height="${nodeH}"></rect>
                <text class="flow-node-text" x="${x + nodeW / 2}" y="${nodeY + 24}">${escapeXml(t(step.nodeKey))}</text>
                <text class="flow-node-sub" x="${x + nodeW / 2}" y="${nodeY + 42}">S${index + 1}</text>
            </g>
        `;

        if (index < FLOW_STEPS.length - 1) {
            let arrowCls = '';
            if (index < stepIndex - 1) {
                arrowCls = 'done';
            } else if (index === stepIndex - 1) {
                arrowCls = 'current';
            }
            svgContent += `
                <path class="flow-arrow ${arrowCls}" marker-end="url(#flow-arrow-head)"
                    d="M ${x + nodeW} 72 L ${x + nodeW + gap - 8} 72"></path>
            `;
        }
    });

    const selectedStep = FLOW_STEPS[stepIndex];
    const inputLines = selectedStep.inputKeys.map((key) => `- ${t(key)}`);
    const outputLines = selectedStep.outputKeys.map((key) => `- ${t(key)}`);

    svgContent += `
        <rect class="flow-io-box" x="22" y="140" rx="12" width="1078" height="160"></rect>
        <text class="flow-io-title" x="44" y="168">${escapeXml(t('flow.inputTitle'))}</text>
        <text class="flow-io-line">${linesToTspans(inputLines, 44, 190, 20)}</text>

        <text class="flow-io-title" x="568" y="168">${escapeXml(t('flow.outputTitle'))}</text>
        <text class="flow-io-line">${linesToTspans(outputLines, 568, 190, 20)}</text>
    `;

    svg.innerHTML = svgContent;
}

function renderFlowStep(stepIndex) {
    const step = FLOW_STEPS[stepIndex];

    const descriptionEl = document.getElementById('flow-description');
    const titleNode = descriptionEl.querySelector('h3');
    const bodyNode = descriptionEl.querySelector('p');

    titleNode.textContent = t(step.titleKey);
    bodyNode.textContent = t(step.descKey);

    const codeEl = document.getElementById('flow-code-content');
    codeEl.textContent = getFlowCode(step);

    document.getElementById('flow-prev').disabled = stepIndex === 0;
    document.getElementById('flow-next').disabled = stepIndex === FLOW_STEPS.length - 1;
    document.getElementById('flow-indicator').textContent = t('step.indicator', {
        current: stepIndex + 1,
        total: FLOW_STEPS.length
    });

    renderFlowDiagram(stepIndex);
}

function changeFlowStep(delta) {
    const next = currentFlowStep + delta;
    if (next < 0 || next >= FLOW_STEPS.length) {
        return;
    }

    currentFlowStep = next;
    renderFlowStep(currentFlowStep);
}

function initFlowVisualization() {
    const prevBtn = document.getElementById('flow-prev');
    const nextBtn = document.getElementById('flow-next');
    const resetBtn = document.getElementById('flow-reset');

    if (!prevBtn || !nextBtn || !resetBtn) {
        return;
    }

    prevBtn.addEventListener('click', () => changeFlowStep(-1));
    nextBtn.addEventListener('click', () => changeFlowStep(1));
    resetBtn.addEventListener('click', () => {
        currentFlowStep = 0;
        renderFlowStep(currentFlowStep);
    });

    renderFlowStep(currentFlowStep);
}

function initNavigation() {
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) {
                return;
            }
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visible.length === 0) {
                return;
            }

            const currentId = visible[0].target.id;
            links.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
            });
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: [0.1, 0.25, 0.4, 0.6]
        });

        sections.forEach((section) => observer.observe(section));
    }
}

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

    if (platform) {
        cmd.push(`-p ${platform}`);
    }

    if (mode === 'module' && modulePath) {
        cmd.push(`-m ${modulePath}`);
    }

    cmd.push(`-a ${arch}`);
    cmd.push(`-b ${target}`);
    cmd.push(`-t ${toolchain}`);

    if (useFdf && fdfPath) {
        cmd.push(`-f ${fdfPath}`);
    }

    if (addFds) {
        cmd.push('fds');
    }

    const output = document.getElementById('build-command-output');
    output.textContent = `${t('command.generated')}\n${cmd.join(' ')}`;
}

function initBuildCommandBuilder() {
    const modeSelect = document.getElementById('mode-select');
    const moduleField = document.getElementById('module-field');
    const controls = [
        'platform-input',
        'arch-select',
        'target-select',
        'toolchain-select',
        'mode-select',
        'module-input',
        'fdf-input',
        'fdf-enable',
        'fds-enable'
    ];

    modeSelect.addEventListener('change', () => {
        moduleField.classList.toggle('hidden', modeSelect.value !== 'module');
        updateBuildCommand();
    });

    controls.forEach((id) => {
        const el = document.getElementById(id);
        const evt = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';
        el.addEventListener(evt, updateBuildCommand);
    });

    moduleField.classList.toggle('hidden', modeSelect.value !== 'module');
    updateBuildCommand();
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        if (event.key === 'ArrowLeft') {
            changeFlowStep(-1);
            event.preventDefault();
        }

        if (event.key === 'ArrowRight') {
            changeFlowStep(1);
            event.preventDefault();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initI18n();
    initNavigation();
    initFlowVisualization();
    initBuildCommandBuilder();
    initKeyboardShortcuts();
});
