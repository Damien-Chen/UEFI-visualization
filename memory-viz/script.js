// UEFI EDK2 Memory Management Visualization
// Interactive step-by-step visualization for memory allocation and deallocation

document.addEventListener('DOMContentLoaded', function() {
    initI18n();
    initNavigation();
    initAllocationVisualization();
    initDeallocationVisualization();
    initPoolVisualization();
    initTimelineVisualization();
    initS4ResumeVisualization();
    initPolicyComparator();
    initFragmentationHeatmap();
    initRuntimeHandoff();
    initCodeLinking();
    initExportToolbar();
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// Memory Allocation Visualization
// ============================================

function getAllocationSteps() {
    return [
        {
            titleKey: 'alloc.step1.title',
            descKey: 'alloc.step1.desc',
            code: `// Allocation Request
EFI_STATUS Status;
EFI_PHYSICAL_ADDRESS Address;

Status = gBS->AllocatePages (
    AllocateAnyPages,           // Type: Any address
    EfiBootServicesData,        // Memory type
    4,                          // Pages (4 * 4KB = 16KB)
    &Address                    // Output: Allocated address
);`,
            diagram: 'step1'
        },
        {
            titleKey: 'alloc.step2.title',
            descKey: 'alloc.step2.desc',
            code: `// CoreAllocatePages internal logic
MEMORY_MAP_ENTRY  *Entry;
LIST_ENTRY        *Link;

// Start traversing from list head
Link = gMemoryMap.ForwardLink;
while (Link != &gMemoryMap) {
    Entry = CR(Link, MEMORY_MAP_ENTRY, Link, MEMORY_MAP_SIGNATURE);
    // Check this Entry...
    Link = Link->ForwardLink;
}`,
            diagram: 'step2'
        },
        {
            titleKey: 'alloc.step3.title',
            descKey: 'alloc.step3.desc',
            code: `// Check memory type
if (Entry->Type != EfiConventionalMemory) {
    // This block is not available memory, skip
    Link = Link->ForwardLink;
    continue;
}`,
            diagram: 'step3'
        },
        {
            titleKey: 'alloc.step4.title',
            descKey: 'alloc.step4.desc',
            code: `// Continue traversing
Link = Link->ForwardLink;
Entry = CR(Link, MEMORY_MAP_ENTRY, Link, MEMORY_MAP_SIGNATURE);

// MMIO region is not Conventional Memory either
if (Entry->Type != EfiConventionalMemory) {
    continue;
}`,
            diagram: 'step4'
        },
        {
            titleKey: 'alloc.step5.title',
            descKey: 'alloc.step5.desc',
            code: `// Found available memory block
if (Entry->Type == EfiConventionalMemory) {
    UINT64 NumberOfPages = (Entry->End - Entry->Start + 1) >> EFI_PAGE_SHIFT;
    
    if (NumberOfPages >= RequestedPages) {
        // Found a block large enough!
        // Calculate allocation start address
        *Memory = Entry->Start;
        break;
    }
}`,
            diagram: 'step5'
        },
        {
            titleKey: 'alloc.step6.title',
            descKey: 'alloc.step6.desc',
            code: `// Split block - create new allocated entry
MEMORY_MAP_ENTRY *AllocatedEntry = AllocateMemoryMapEntry();
AllocatedEntry->Start = Entry->Start;
AllocatedEntry->End = Entry->Start + (RequestedPages << EFI_PAGE_SHIFT) - 1;
AllocatedEntry->Type = MemoryType;  // EfiBootServicesData

// Update original block's start address
Entry->Start = AllocatedEntry->End + 1;

// Insert new block into list
InsertTailList(&Entry->Link, &AllocatedEntry->Link);`,
            diagram: 'step6'
        },
        {
            titleKey: 'alloc.step7.title',
            descKey: 'alloc.step7.desc',
            code: `// Allocation successful
*Memory = 0x00100000;
return EFI_SUCCESS;

// Now gMemoryMap contains:
// [Reserved] -> [MMIO] -> [BootServicesData] -> [Conventional] -> ...
//                         ^^^ Newly allocated block`,
            diagram: 'step7'
        }
    ];
}

let currentAllocStep = 0;

function initAllocationVisualization() {
    const prevBtn = document.getElementById('alloc-prev');
    const nextBtn = document.getElementById('alloc-next');
    const resetBtn = document.getElementById('alloc-reset');
    
    if (!prevBtn || !nextBtn || !resetBtn) return;
    
    prevBtn.addEventListener('click', () => changeAllocStep(-1));
    nextBtn.addEventListener('click', () => changeAllocStep(1));
    resetBtn.addEventListener('click', () => resetAllocVisualization());
    
    renderAllocStep(0);
}

function changeAllocStep(delta) {
    const steps = getAllocationSteps();
    const newStep = currentAllocStep + delta;
    if (newStep >= 0 && newStep < steps.length) {
        currentAllocStep = newStep;
        renderAllocStep(currentAllocStep);
    }
}

function resetAllocVisualization() {
    currentAllocStep = 0;
    renderAllocStep(0);
}

function renderAllocStep(stepIndex) {
    const steps = getAllocationSteps();
    const step = steps[stepIndex];
    
    // Update description using translations
    const descEl = document.getElementById('alloc-description');
    descEl.innerHTML = `<h3>${t(step.titleKey)}</h3><p>${t(step.descKey)}</p>`;
    descEl.classList.add('fade-in');
    setTimeout(() => descEl.classList.remove('fade-in'), 500);
    
    // Update code
    const codeEl = document.getElementById('alloc-code-content');
    codeEl.textContent = step.code;
    
    // Update diagram
    renderAllocDiagram(stepIndex);
    
    // Update buttons and step indicator
    document.getElementById('alloc-prev').disabled = stepIndex === 0;
    document.getElementById('alloc-next').disabled = stepIndex === steps.length - 1;
    document.getElementById('alloc-step-indicator').textContent = 
        t('step.indicator', { current: stepIndex + 1, total: steps.length });
}

function renderAllocDiagram(stepIndex) {
    const svg = document.getElementById('alloc-svg');
    
    const memoryEntries = [
        { id: 'reserved', type: 'Reserved', start: '0x00000000', end: '0x0009FFFF', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
        { id: 'mmio', type: 'MMIO', start: '0x000A0000', end: '0x000FFFFF', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
        { id: 'conv', type: 'Conventional', start: '0x00100000', end: '0x0FFFFFFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { id: 'runtime', type: 'RuntimeServices', start: '0x10000000', end: '0x100FFFFF', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)' }
    ];

    let svgContent = `
        <defs>
            <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
            </marker>
            <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
            </marker>
            <marker id="arrow-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b"/>
            </marker>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
    `;

    // gMemoryMap head
    svgContent += `
        <g class="head">
            <rect x="20" y="200" width="100" height="50" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="70" y="220" fill="#f59e0b" font-size="11" text-anchor="middle" font-weight="600">gMemoryMap</text>
            <text x="70" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">(List Head)</text>
        </g>
    `;

    // Render entries based on step
    if (stepIndex < 6) {
        // Original state - 4 entries
        memoryEntries.forEach((entry, idx) => {
            const x = 160 + idx * 175;
            const isSearching = (stepIndex === 2 && idx === 0) || 
                               (stepIndex === 3 && idx === 1) || 
                               (stepIndex === 4 && idx === 2) ||
                               (stepIndex === 5 && idx === 2);
            const isFound = stepIndex >= 5 && idx === 2;
            
            let extraStyle = '';
            if (isSearching && !isFound) {
                extraStyle = 'filter: drop-shadow(0 0 10px ' + entry.color + ')';
            }
            if (isFound) {
                extraStyle = 'filter: drop-shadow(0 0 15px #22c55e)';
            }
            
            svgContent += `
                <g class="entry" style="${extraStyle}">
                    <rect x="${x}" y="150" width="160" height="150" rx="8" 
                          fill="${entry.bgColor}" stroke="${entry.color}" stroke-width="2"
                          ${isSearching ? 'stroke-dasharray="5,5"' : ''}/>
                    <text x="${x + 80}" y="175" fill="${entry.color}" font-size="12" text-anchor="middle" font-weight="600">${entry.type}</text>
                    <line x1="${x}" y1="185" x2="${x + 160}" y2="185" stroke="#475569" stroke-width="1"/>
                    <text x="${x + 10}" y="205" fill="#94a3b8" font-size="10" font-family="Consolas">Start: ${entry.start}</text>
                    <text x="${x + 10}" y="225" fill="#94a3b8" font-size="10" font-family="Consolas">End: ${entry.end}</text>
                    <text x="${x + 10}" y="245" fill="#94a3b8" font-size="10" font-family="Consolas">Type: ${entry.type}</text>
                    
                    <rect x="${x + 10}" y="255" width="140" height="25" rx="4" fill="#334155" stroke="#475569" stroke-dasharray="3"/>
                    <text x="${x + 80}" y="272" fill="#64748b" font-size="9" text-anchor="middle">LIST_ENTRY Link</text>
                </g>
            `;

            // Connecting arrows
            if (idx === 0) {
                svgContent += `<path d="M 120 225 L 155 225" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow-green)"/>`;
            }
            if (idx < memoryEntries.length - 1) {
                svgContent += `
                    <path d="M ${x + 160} 265 Q ${x + 180} 240 ${x + 175} 265" stroke="#22c55e" stroke-width="1.5" fill="none" marker-end="url(#arrow-green)"/>
                    <path d="M ${x + 175} 275 Q ${x + 180} 300 ${x + 160} 275" stroke="#3b82f6" stroke-width="1.5" fill="none" marker-end="url(#arrow-blue)"/>
                `;
            }
        });

        // Search pointer for steps 2-5
        if (stepIndex >= 1 && stepIndex <= 4) {
            const pointerX = 160 + (stepIndex - 1) * 175 + 80;
            svgContent += `
                <g class="pointer">
                    <path d="M ${pointerX} 120 L ${pointerX} 145" stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow-orange)"/>
                    <text x="${pointerX}" y="110" fill="#f59e0b" font-size="11" text-anchor="middle" font-weight="600">檢查中</text>
                </g>
            `;
        }

        // Status indicators
        if (stepIndex >= 2 && stepIndex <= 4) {
            for (let i = 0; i < stepIndex - 1; i++) {
                const statusX = 160 + i * 175 + 80;
                svgContent += `
                    <text x="${statusX}" y="320" fill="#ef4444" font-size="11" text-anchor="middle">✗ 不符合</text>
                `;
            }
        }

        if (stepIndex >= 5) {
            svgContent += `
                <text x="${160 + 0 * 175 + 80}" y="320" fill="#ef4444" font-size="11" text-anchor="middle">✗ Reserved</text>
                <text x="${160 + 1 * 175 + 80}" y="320" fill="#ef4444" font-size="11" text-anchor="middle">✗ MMIO</text>
                <text x="${160 + 2 * 175 + 80}" y="320" fill="#22c55e" font-size="11" text-anchor="middle">✓ 找到!</text>
            `;
        }

    } else if (stepIndex === 6) {
        // After split - show new allocated block
        const splitEntries = [
            { type: 'Reserved', start: '0x00000000', end: '0x0009FFFF', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', width: 130 },
            { type: 'MMIO', start: '0x000A0000', end: '0x000FFFFF', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', width: 130 },
            { type: 'BootServicesData', start: '0x00100000', end: '0x00103FFF', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)', width: 140, isNew: true },
            { type: 'Conventional', start: '0x00104000', end: '0x0FFFFFFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', width: 140 },
            { type: 'RuntimeServices', start: '0x10000000', end: '0x100FFFFF', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)', width: 130 }
        ];

        let currentX = 150;
        splitEntries.forEach((entry, idx) => {
            const extraStyle = entry.isNew ? 'filter: drop-shadow(0 0 15px #3b82f6)' : '';
            
            svgContent += `
                <g class="entry" style="${extraStyle}">
                    <rect x="${currentX}" y="150" width="${entry.width}" height="150" rx="8" 
                          fill="${entry.bgColor}" stroke="${entry.color}" stroke-width="${entry.isNew ? 3 : 2}"/>
                    <text x="${currentX + entry.width/2}" y="175" fill="${entry.color}" font-size="${entry.isNew ? 11 : 10}" text-anchor="middle" font-weight="600">${entry.type}</text>
                    <line x1="${currentX}" y1="185" x2="${currentX + entry.width}" y2="185" stroke="#475569" stroke-width="1"/>
                    <text x="${currentX + 5}" y="205" fill="#94a3b8" font-size="9" font-family="Consolas">Start: ${entry.start}</text>
                    <text x="${currentX + 5}" y="220" fill="#94a3b8" font-size="9" font-family="Consolas">End: ${entry.end}</text>
                    ${entry.isNew ? '<text x="' + (currentX + entry.width/2) + '" y="245" fill="#3b82f6" font-size="10" text-anchor="middle" font-weight="600">★ 新配置</text>' : ''}
                    
                    <rect x="${currentX + 5}" y="260" width="${entry.width - 10}" height="20" rx="4" fill="#334155" stroke="#475569" stroke-dasharray="3"/>
                    <text x="${currentX + entry.width/2}" y="274" fill="#64748b" font-size="8" text-anchor="middle">LIST_ENTRY</text>
                </g>
            `;
            
            if (idx === 0) {
                svgContent += `<path d="M 120 225 L ${currentX - 5} 225" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow-green)"/>`;
            }
            
            currentX += entry.width + 10;
        });

        svgContent += `
            <text x="450" y="330" fill="#22c55e" font-size="13" text-anchor="middle" font-weight="600">✓ 配置完成！回傳位址: 0x00100000</text>
        `;
    } else {
        // Step 7 - Final state
        const finalEntries = [
            { type: 'Reserved', start: '0x00000000', end: '0x0009FFFF', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
            { type: 'MMIO', start: '0x000A0000', end: '0x000FFFFF', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
            { type: 'BootServicesData', start: '0x00100000', end: '0x00103FFF', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)', isNew: true },
            { type: 'Conventional', start: '0x00104000', end: '0x0FFFFFFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
            { type: 'RuntimeServices', start: '0x10000000', end: '0x100FFFFF', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)' }
        ];

        finalEntries.forEach((entry, idx) => {
            const x = 150 + idx * 145;
            svgContent += `
                <g class="entry" ${entry.isNew ? 'style="filter: drop-shadow(0 0 10px #3b82f6)"' : ''}>
                    <rect x="${x}" y="150" width="135" height="150" rx="8" 
                          fill="${entry.bgColor}" stroke="${entry.color}" stroke-width="2"/>
                    <text x="${x + 67}" y="175" fill="${entry.color}" font-size="10" text-anchor="middle" font-weight="600">${entry.type}</text>
                    <line x1="${x}" y1="185" x2="${x + 135}" y2="185" stroke="#475569" stroke-width="1"/>
                    <text x="${x + 5}" y="205" fill="#94a3b8" font-size="9" font-family="Consolas">Start: ${entry.start}</text>
                    <text x="${x + 5}" y="220" fill="#94a3b8" font-size="9" font-family="Consolas">End: ${entry.end}</text>
                </g>
            `;
        });

        svgContent += `
            <text x="450" y="350" fill="#22c55e" font-size="14" text-anchor="middle" font-weight="600">✓ 記憶體配置成功完成</text>
            <text x="450" y="375" fill="#94a3b8" font-size="12" text-anchor="middle">gMemoryMap 已更新，新增 BootServicesData 區塊</text>
        `;
    }

    svg.innerHTML = svgContent;
}

// ============================================
// Memory Deallocation Visualization
// ============================================

function getDeallocationSteps() {
    return [
        {
            titleKey: 'free.step1.title',
            descKey: 'free.step1.desc',
            code: `// Free Request
EFI_STATUS Status;

Status = gBS->FreePages (
    0x00200000,    // Memory address to free
    4              // Pages (4 * 4KB = 16KB)
);`
        },
        {
            titleKey: 'free.step2.title',
            descKey: 'free.step2.desc',
            code: `// Search for Entry containing this address
MEMORY_MAP_ENTRY *Entry;
LIST_ENTRY *Link;

for (Link = gMemoryMap.ForwardLink; 
     Link != &gMemoryMap; 
     Link = Link->ForwardLink) {
    
    Entry = CR(Link, MEMORY_MAP_ENTRY, Link, MEMORY_MAP_SIGNATURE);
    
    if (Entry->Start <= Address && Address <= Entry->End) {
        // Found the block containing this address
        break;
    }
}`
        },
        {
            titleKey: 'free.step3.title',
            descKey: 'free.step3.desc',
            code: `// Validate free request
if (Entry->Type == EfiConventionalMemory) {
    // Error: Trying to free already free memory
    return EFI_NOT_FOUND;
}

UINT64 EntryPages = (Entry->End - Entry->Start + 1) >> EFI_PAGE_SHIFT;
if (NumberOfPages > EntryPages) {
    // Error: Requested pages exceed block size
    return EFI_INVALID_PARAMETER;
}`
        },
        {
            titleKey: 'free.step4.title',
            descKey: 'free.step4.desc',
            code: `// Change memory type to Conventional (available)
Entry->Type = EfiConventionalMemory;

// Block state now:
// [BootServicesData] -> [Conventional]  (just freed)
//                       ^^^ Marked as available`
        },
        {
            titleKey: 'free.step5.title',
            descKey: 'free.step5.desc',
            code: `// Check if can merge with previous block
PreviousEntry = CR(Entry->Link.BackLink, MEMORY_MAP_ENTRY, Link, ...);
if (PreviousEntry->Type == EfiConventionalMemory &&
    PreviousEntry->End + 1 == Entry->Start) {
    // Can merge!
    PreviousEntry->End = Entry->End;
    RemoveEntryList(&Entry->Link);
    FreeMemoryMapEntry(Entry);
    Entry = PreviousEntry;
}

// Check if can merge with next block
NextEntry = CR(Entry->Link.ForwardLink, MEMORY_MAP_ENTRY, Link, ...);
if (NextEntry->Type == EfiConventionalMemory &&
    Entry->End + 1 == NextEntry->Start) {
    // Can merge!
    Entry->End = NextEntry->End;
    RemoveEntryList(&NextEntry->Link);
    FreeMemoryMapEntry(NextEntry);
}`
        },
        {
            titleKey: 'free.step6.title',
            descKey: 'free.step6.desc',
            code: `// Free successful
return EFI_SUCCESS;

// Merged gMemoryMap:
// [...] -> [Conventional (larger after merge)] -> [...]
//          ^^^ Previously scattered free blocks merged`
        }
    ];
}

let currentFreeStep = 0;

function initDeallocationVisualization() {
    const prevBtn = document.getElementById('free-prev');
    const nextBtn = document.getElementById('free-next');
    const resetBtn = document.getElementById('free-reset');
    
    if (!prevBtn || !nextBtn || !resetBtn) return;
    
    prevBtn.addEventListener('click', () => changeFreeStep(-1));
    nextBtn.addEventListener('click', () => changeFreeStep(1));
    resetBtn.addEventListener('click', () => resetFreeVisualization());
    
    renderFreeStep(0);
}

function changeFreeStep(delta) {
    const steps = getDeallocationSteps();
    const newStep = currentFreeStep + delta;
    if (newStep >= 0 && newStep < steps.length) {
        currentFreeStep = newStep;
        renderFreeStep(currentFreeStep);
    }
}

function resetFreeVisualization() {
    currentFreeStep = 0;
    renderFreeStep(0);
}

function renderFreeStep(stepIndex) {
    const steps = getDeallocationSteps();
    const step = steps[stepIndex];
    
    // Update description using translations
    const descEl = document.getElementById('free-description');
    descEl.innerHTML = `<h3>${t(step.titleKey)}</h3><p>${t(step.descKey)}</p>`;
    descEl.classList.add('fade-in');
    setTimeout(() => descEl.classList.remove('fade-in'), 500);
    
    // Update code
    const codeEl = document.getElementById('free-code-content');
    codeEl.textContent = step.code;
    
    // Update diagram
    renderFreeDiagram(stepIndex);
    
    // Update buttons and step indicator
    document.getElementById('free-prev').disabled = stepIndex === 0;
    document.getElementById('free-next').disabled = stepIndex === steps.length - 1;
    document.getElementById('free-step-indicator').textContent = 
        t('step.indicator', { current: stepIndex + 1, total: steps.length });
}

function renderFreeDiagram(stepIndex) {
    const svg = document.getElementById('free-svg');
    
    let svgContent = `
        <defs>
            <marker id="free-arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
            </marker>
            <marker id="free-arrow-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b"/>
            </marker>
        </defs>
    `;

    // gMemoryMap head
    svgContent += `
        <g class="head">
            <rect x="20" y="200" width="100" height="50" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="70" y="220" fill="#f59e0b" font-size="11" text-anchor="middle" font-weight="600">gMemoryMap</text>
            <text x="70" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">(List Head)</text>
        </g>
    `;

    if (stepIndex < 4) {
        // Initial state with allocated block
        const entries = [
            { type: 'Conventional', start: '0x00100000', end: '0x001FFFFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
            { type: 'BootServicesData', start: '0x00200000', end: '0x00203FFF', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)', isTarget: true },
            { type: 'Conventional', start: '0x00204000', end: '0x0FFFFFFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' }
        ];

        entries.forEach((entry, idx) => {
            const x = 160 + idx * 220;
            const isSearching = stepIndex >= 1 && stepIndex <= 2 && entry.isTarget;
            const isFound = stepIndex >= 2 && entry.isTarget;
            
            let extraStyle = '';
            if (isSearching || isFound) {
                extraStyle = `filter: drop-shadow(0 0 15px ${entry.color})`;
            }
            
            svgContent += `
                <g class="entry" style="${extraStyle}">
                    <rect x="${x}" y="140" width="200" height="170" rx="8" 
                          fill="${entry.bgColor}" stroke="${entry.color}" stroke-width="${entry.isTarget ? 3 : 2}"
                          ${isSearching ? 'stroke-dasharray="5,5"' : ''}/>
                    <text x="${x + 100}" y="165" fill="${entry.color}" font-size="12" text-anchor="middle" font-weight="600">${entry.type}</text>
                    <line x1="${x}" y1="175" x2="${x + 200}" y2="175" stroke="#475569" stroke-width="1"/>
                    <text x="${x + 10}" y="200" fill="#94a3b8" font-size="11" font-family="Consolas">Start: ${entry.start}</text>
                    <text x="${x + 10}" y="220" fill="#94a3b8" font-size="11" font-family="Consolas">End: ${entry.end}</text>
                    <text x="${x + 10}" y="240" fill="#94a3b8" font-size="11" font-family="Consolas">Type: ${entry.type}</text>
                    
                    <rect x="${x + 10}" y="255" width="180" height="30" rx="4" fill="#334155" stroke="#475569" stroke-dasharray="3"/>
                    <text x="${x + 100}" y="275" fill="#64748b" font-size="10" text-anchor="middle">LIST_ENTRY Link</text>
                </g>
            `;

            if (idx === 0) {
                svgContent += `<path d="M 120 225 L 155 225" stroke="#22c55e" stroke-width="2" marker-end="url(#free-arrow-green)"/>`;
            }
        });

        // Search pointer
        if (stepIndex >= 1 && stepIndex <= 2) {
            svgContent += `
                <g class="pointer">
                    <path d="M 480 110 L 480 135" stroke="#f59e0b" stroke-width="3" marker-end="url(#free-arrow-orange)"/>
                    <text x="480" y="100" fill="#f59e0b" font-size="12" text-anchor="middle" font-weight="600">${stepIndex === 1 ? '搜尋中...' : '找到目標!'}</text>
                </g>
            `;
        }

        if (stepIndex >= 2) {
            svgContent += `
                <text x="480" y="330" fill="${stepIndex === 2 ? '#f59e0b' : '#22c55e'}" font-size="12" text-anchor="middle">
                    ${stepIndex === 2 ? '驗證中: 類型 ✓ 大小 ✓' : stepIndex === 3 ? '驗證通過，準備釋放' : ''}
                </text>
            `;
        }

    } else if (stepIndex === 4) {
        // Showing merge process
        const entries = [
            { type: 'Conventional', start: '0x00100000', end: '0x001FFFFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', canMerge: true },
            { type: 'Conventional', start: '0x00200000', end: '0x00203FFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.3)', isReleasing: true },
            { type: 'Conventional', start: '0x00204000', end: '0x0FFFFFFF', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', canMerge: true }
        ];

        entries.forEach((entry, idx) => {
            const x = 160 + idx * 220;
            
            svgContent += `
                <g class="entry" style="filter: drop-shadow(0 0 ${entry.isReleasing ? 15 : 8}px #22c55e)">
                    <rect x="${x}" y="140" width="200" height="170" rx="8" 
                          fill="${entry.bgColor}" stroke="${entry.color}" stroke-width="2"
                          ${entry.canMerge ? 'stroke-dasharray="8,4"' : ''}/>
                    <text x="${x + 100}" y="165" fill="${entry.color}" font-size="12" text-anchor="middle" font-weight="600">${entry.type}</text>
                    <line x1="${x}" y1="175" x2="${x + 200}" y2="175" stroke="#475569" stroke-width="1"/>
                    <text x="${x + 10}" y="200" fill="#94a3b8" font-size="11" font-family="Consolas">Start: ${entry.start}</text>
                    <text x="${x + 10}" y="220" fill="#94a3b8" font-size="11" font-family="Consolas">End: ${entry.end}</text>
                    ${entry.isReleasing ? '<text x="' + (x + 100) + '" y="250" fill="#22c55e" font-size="11" text-anchor="middle" font-weight="600">剛釋放</text>' : ''}
                    ${entry.canMerge ? '<text x="' + (x + 100) + '" y="250" fill="#f59e0b" font-size="11" text-anchor="middle">可合併 ↔</text>' : ''}
                </g>
            `;
        });

        // Merge arrows
        svgContent += `
            <path d="M 360 225 L 375 225" stroke="#f59e0b" stroke-width="3"/>
            <path d="M 575 225 L 560 225" stroke="#f59e0b" stroke-width="3"/>
            <text x="480" y="350" fill="#f59e0b" font-size="13" text-anchor="middle" font-weight="600">合併相鄰的 Conventional Memory 區塊</text>
        `;

    } else {
        // Final merged state
        svgContent += `
            <g class="entry" style="filter: drop-shadow(0 0 15px #22c55e)">
                <rect x="200" y="140" width="500" height="170" rx="8" 
                      fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" stroke-width="3"/>
                <text x="450" y="170" fill="#22c55e" font-size="14" text-anchor="middle" font-weight="600">Conventional Memory (合併後)</text>
                <line x1="200" y1="185" x2="700" y2="185" stroke="#475569" stroke-width="1"/>
                <text x="220" y="210" fill="#94a3b8" font-size="12" font-family="Consolas">Start: 0x00100000</text>
                <text x="220" y="235" fill="#94a3b8" font-size="12" font-family="Consolas">End: 0x0FFFFFFF</text>
                <text x="220" y="260" fill="#22c55e" font-size="12">原本 3 個區塊已合併為 1 個大區塊</text>
                
                <rect x="220" y="275" width="460" height="25" rx="4" fill="#334155" stroke="#475569" stroke-dasharray="3"/>
                <text x="450" y="292" fill="#64748b" font-size="10" text-anchor="middle">LIST_ENTRY Link</text>
            </g>
            
            <path d="M 120 225 L 195 225" stroke="#22c55e" stroke-width="2" marker-end="url(#free-arrow-green)"/>
            
            <text x="450" y="350" fill="#22c55e" font-size="14" text-anchor="middle" font-weight="600">✓ 記憶體釋放完成！減少了記憶體碎片</text>
            <text x="450" y="375" fill="#94a3b8" font-size="12" text-anchor="middle">回傳 EFI_SUCCESS</text>
        `;
    }

    svg.innerHTML = svgContent;
}

// ============================================
// Pool Allocation Visualization (Section 5)
// ============================================

function getPoolSteps() {
    return [
        {
            titleKey: 'pool.step1.title',
            descKey: 'pool.step1.desc',
            code: `// Pool Allocation Request
EFI_STATUS Status;
VOID       *Buffer;

Status = gBS->AllocatePool (
    EfiBootServicesData,   // Memory type
    128,                   // Size in bytes
    &Buffer                // Output: pointer
);`
        },
        {
            titleKey: 'pool.step2.title',
            descKey: 'pool.step2.desc',
            code: `// CoreAllocatePool internal logic
// Add POOL_HEAD header size
UINTN NewSize = Size + sizeof(POOL_HEAD);
// NewSize = 128 + 32 = 160 bytes

// Determine if this is a small or large allocation
// Small: <= MAX_POOL_SIZE (page-managed slab)
// Large: allocate dedicated pages
if (NewSize > MAX_POOL_SIZE) {
    // Allocate whole pages via AllocatePages
} else {
    // Use pool slab allocator
}`
        },
        {
            titleKey: 'pool.step3.title',
            descKey: 'pool.step3.desc',
            code: `// Find pool for this memory type
POOL *Pool = &mPoolHead[MemoryType];

// Search free list for a block >= NewSize
LIST_ENTRY *FreeList;
POOL_FREE  *Free;

FreeList = &Pool->FreeList[BinIndex];
if (!IsListEmpty(FreeList)) {
    Free = CR(FreeList->ForwardLink, POOL_FREE, Link, ...);
    // Found a free block in the bin!
}`
        },
        {
            titleKey: 'pool.step4.title',
            descKey: 'pool.step4.desc',
            code: `// Carve allocation from the free block
POOL_HEAD *Head = (POOL_HEAD *)Free;

Head->Signature = POOL_HEAD_SIGNATURE;  // 'phd0'
Head->Size      = NewSize;              // 160
Head->Type      = MemoryType;           // EfiBootServicesData

// If remaining space is large enough,
// put it back on the free list
UINTN Remaining = Free->Size - NewSize;
if (Remaining >= MIN_POOL_SIZE) {
    POOL_FREE *NewFree = (POOL_FREE *)((UINT8 *)Head + NewSize);
    InsertHeadList(&Pool->FreeList[NewBin], &NewFree->Link);
}`
        },
        {
            titleKey: 'pool.step5.title',
            descKey: 'pool.step5.desc',
            code: `// Return pointer to user data area
// (just past the POOL_HEAD header)
*Buffer = (VOID *)(Head + 1);
// *Buffer = &Head->Data[0]

return EFI_SUCCESS;

// Memory layout:
// [POOL_HEAD (32B)] [User Data (128B)] [Free ...]
//                   ^^^ returned pointer`
        }
    ];
}

let currentPoolStep = 0;

function initPoolVisualization() {
    const prevBtn = document.getElementById('pool-prev');
    const nextBtn = document.getElementById('pool-next');
    const resetBtn = document.getElementById('pool-reset');

    if (!prevBtn || !nextBtn || !resetBtn) return;

    prevBtn.addEventListener('click', () => changePoolStep(-1));
    nextBtn.addEventListener('click', () => changePoolStep(1));
    resetBtn.addEventListener('click', () => resetPoolVisualization());

    renderPoolStep(0);
}

function changePoolStep(delta) {
    const steps = getPoolSteps();
    const newStep = currentPoolStep + delta;
    if (newStep >= 0 && newStep < steps.length) {
        currentPoolStep = newStep;
        renderPoolStep(currentPoolStep);
    }
}

function resetPoolVisualization() {
    currentPoolStep = 0;
    renderPoolStep(0);
}

function renderPoolStep(stepIndex) {
    const steps = getPoolSteps();
    const step = steps[stepIndex];

    const descEl = document.getElementById('pool-description');
    descEl.innerHTML = `<h3>${t(step.titleKey)}</h3><p>${t(step.descKey)}</p>`;
    descEl.classList.add('fade-in');
    setTimeout(() => descEl.classList.remove('fade-in'), 500);

    const codeEl = document.getElementById('pool-code-content');
    codeEl.textContent = step.code;

    renderPoolDiagram(stepIndex);

    document.getElementById('pool-prev').disabled = stepIndex === 0;
    document.getElementById('pool-next').disabled = stepIndex === steps.length - 1;
    document.getElementById('pool-step-indicator').textContent =
        t('step.indicator', { current: stepIndex + 1, total: steps.length });
}

function renderPoolDiagram(stepIndex) {
    const svg = document.getElementById('pool-svg');
    const pageW = 800, pageH = 80, pageX = 50, pageY = 60;
    const headW = 120, dataW = 200, freeW = pageW - headW - dataW;

    let s = `<defs>
        <marker id="pool-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
        </marker>
    </defs>`;

    // Pool page outline
    s += `<rect x="${pageX}" y="${pageY}" width="${pageW}" height="${pageH}" rx="6"
          fill="rgba(59,130,246,0.08)" stroke="#475569" stroke-width="2"/>`;
    s += `<text x="${pageX + pageW/2}" y="${pageY - 10}" fill="#94a3b8" font-size="12" text-anchor="middle">${t('pool.pageHeader')}</text>`;

    // POOL_HEAD block
    const headColor = stepIndex >= 3 ? '#3b82f6' : '#475569';
    const headBg = stepIndex >= 3 ? 'rgba(59,130,246,0.25)' : 'rgba(71,85,105,0.15)';
    s += `<rect x="${pageX}" y="${pageY}" width="${headW}" height="${pageH}" rx="6"
          fill="${headBg}" stroke="${headColor}" stroke-width="2"
          ${stepIndex === 3 ? 'style="filter: drop-shadow(0 0 10px #3b82f6)"' : ''}/>`;
    s += `<text x="${pageX + headW/2}" y="${pageY + 25}" fill="${headColor}" font-size="11" text-anchor="middle" font-weight="600">POOL_HEAD</text>`;
    s += `<text x="${pageX + headW/2}" y="${pageY + 42}" fill="#94a3b8" font-size="9" text-anchor="middle">Sig: 'phd0'</text>`;
    s += `<text x="${pageX + headW/2}" y="${pageY + 56}" fill="#94a3b8" font-size="9" text-anchor="middle">Size: 160</text>`;
    s += `<text x="${pageX + headW/2}" y="${pageY + 70}" fill="#94a3b8" font-size="9" text-anchor="middle">Type: BsData</text>`;

    // Data block
    const dataX = pageX + headW;
    const dataColor = stepIndex >= 4 ? '#22c55e' : '#475569';
    const dataBg = stepIndex >= 4 ? 'rgba(34,197,94,0.2)' : 'rgba(71,85,105,0.1)';
    s += `<rect x="${dataX}" y="${pageY}" width="${dataW}" height="${pageH}"
          fill="${dataBg}" stroke="${dataColor}" stroke-width="2"
          ${stepIndex === 4 ? 'style="filter: drop-shadow(0 0 12px #22c55e)"' : ''}/>`;
    s += `<text x="${dataX + dataW/2}" y="${pageY + 35}" fill="${dataColor}" font-size="12" text-anchor="middle" font-weight="600">${t('pool.data')}</text>`;
    s += `<text x="${dataX + dataW/2}" y="${pageY + 55}" fill="#94a3b8" font-size="10" text-anchor="middle">128 bytes</text>`;

    // Free space
    const freeX = dataX + dataW;
    s += `<rect x="${freeX}" y="${pageY}" width="${freeW}" height="${pageH}" rx="6"
          fill="rgba(34,197,94,0.08)" stroke="#475569" stroke-width="1" stroke-dasharray="5,3"/>`;
    s += `<text x="${freeX + freeW/2}" y="${pageY + 40}" fill="#64748b" font-size="11" text-anchor="middle">${t('pool.free')}</text>`;
    s += `<text x="${freeX + freeW/2}" y="${pageY + 58}" fill="#64748b" font-size="9" text-anchor="middle">${4096 - 160} bytes</text>`;

    // Step-specific annotations
    if (stepIndex === 0) {
        s += `<text x="${pageX + pageW/2}" y="${pageY + pageH + 40}" fill="#f59e0b" font-size="13" text-anchor="middle" font-weight="600">
            AllocatePool(EfiBootServicesData, 128, &Buffer)</text>`;
    }
    if (stepIndex === 1) {
        s += `<rect x="250" y="180" width="400" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>`;
        s += `<text x="450" y="205" fill="#f59e0b" font-size="12" text-anchor="middle" font-weight="600">Size Calculation</text>`;
        s += `<text x="270" y="230" fill="#94a3b8" font-size="11">Request: 128 bytes + POOL_HEAD: 32 bytes = 160 bytes</text>`;
        s += `<text x="270" y="250" fill="#94a3b8" font-size="11">160 ≤ MAX_POOL_SIZE → Use slab allocator</text>`;
    }
    if (stepIndex === 2) {
        s += `<path d="M 450 ${pageY + pageH + 10} L 450 ${pageY + pageH + 35}" stroke="#f59e0b" stroke-width="3" marker-end="url(#pool-arrow)"/>`;
        s += `<text x="450" y="${pageY + pageH + 55}" fill="#f59e0b" font-size="12" text-anchor="middle" font-weight="600">${t('diagram.searching')}</text>`;

        const arrY = 200;
        for (let i = 0; i < 5; i++) {
            const ax = 150 + i * 140;
            const isTarget = i === 2;
            s += `<rect x="${ax}" y="${arrY}" width="120" height="50" rx="6"
                  fill="${isTarget ? 'rgba(59,130,246,0.2)' : '#1e293b'}" stroke="${isTarget ? '#3b82f6' : '#475569'}" stroke-width="${isTarget ? 2 : 1}"/>`;
            const types = ['Reserved', 'LoaderData', 'BsData', 'RtData', 'Conv'];
            s += `<text x="${ax + 60}" y="${arrY + 20}" fill="${isTarget ? '#3b82f6' : '#94a3b8'}" font-size="10" text-anchor="middle" font-weight="${isTarget ? '600' : '400'}">${types[i]}</text>`;
            s += `<text x="${ax + 60}" y="${arrY + 38}" fill="#64748b" font-size="9" text-anchor="middle">mPoolHead[${i}]</text>`;
        }
        s += `<text x="430" y="${arrY - 10}" fill="#f59e0b" font-size="11" text-anchor="middle">↓ ${t('policy.selected')}</text>`;
    }
    if (stepIndex === 4) {
        s += `<path d="M ${dataX + 10} ${pageY + pageH + 15} L ${dataX + 10} ${pageY + pageH + 5}" stroke="#22c55e" stroke-width="3" marker-end="url(#pool-arrow)"/>`;
        s += `<text x="${dataX + dataW/2}" y="${pageY + pageH + 35}" fill="#22c55e" font-size="13" text-anchor="middle" font-weight="600">
            ✓ *Buffer = &Head->Data[0]</text>`;
        s += `<text x="${dataX + dataW/2}" y="${pageY + pageH + 55}" fill="#94a3b8" font-size="11" text-anchor="middle">EFI_SUCCESS</text>`;
    }

    svg.innerHTML = s;
}

// ============================================
// Boot Timeline Visualization (Section 6)
// ============================================

function getTimelinePhases() {
    return {
        sec: {
            entries: [
                { type: 'Reserved', start: 0, size: 10, color: '#ef4444' },
                { type: 'T-RAM (Cache-as-RAM)', start: 10, size: 5, color: '#f59e0b' },
                { type: 'Uninitialized', start: 15, size: 85, color: '#475569' }
            ]
        },
        pei: {
            entries: [
                { type: 'Reserved', start: 0, size: 10, color: '#ef4444' },
                { type: 'PEI Core', start: 10, size: 5, color: '#3b82f6' },
                { type: 'PEI Heap', start: 15, size: 8, color: '#06b6d4' },
                { type: 'Conventional', start: 23, size: 57, color: '#22c55e' },
                { type: 'MMIO', start: 80, size: 10, color: '#f59e0b' },
                { type: 'Reserved', start: 90, size: 10, color: '#ef4444' }
            ]
        },
        dxe: {
            entries: [
                { type: 'Reserved', start: 0, size: 6, color: '#ef4444' },
                { type: 'BsCode', start: 6, size: 8, color: '#3b82f6' },
                { type: 'BsData', start: 14, size: 10, color: '#60a5fa' },
                { type: 'RtCode', start: 24, size: 5, color: '#a855f7' },
                { type: 'RtData', start: 29, size: 4, color: '#c084fc' },
                { type: 'Conventional', start: 33, size: 37, color: '#22c55e' },
                { type: 'ACPI NVS', start: 70, size: 5, color: '#14b8a6' },
                { type: 'MMIO', start: 75, size: 15, color: '#f59e0b' },
                { type: 'Reserved', start: 90, size: 10, color: '#ef4444' }
            ]
        },
        bds: {
            entries: [
                { type: 'Reserved', start: 0, size: 6, color: '#ef4444' },
                { type: 'BsCode', start: 6, size: 10, color: '#3b82f6' },
                { type: 'BsData', start: 16, size: 12, color: '#60a5fa' },
                { type: 'LoaderCode', start: 28, size: 4, color: '#f97316' },
                { type: 'RtCode', start: 32, size: 5, color: '#a855f7' },
                { type: 'RtData', start: 37, size: 4, color: '#c084fc' },
                { type: 'Conventional', start: 41, size: 24, color: '#22c55e' },
                { type: 'ACPI Reclaim', start: 65, size: 3, color: '#2dd4bf' },
                { type: 'ACPI NVS', start: 68, size: 7, color: '#14b8a6' },
                { type: 'MMIO', start: 75, size: 15, color: '#f59e0b' },
                { type: 'Reserved', start: 90, size: 10, color: '#ef4444' }
            ]
        },
        exit: {
            entries: [
                { type: 'Reserved', start: 0, size: 6, color: '#ef4444' },
                { type: 'Conventional', start: 6, size: 26, color: '#22c55e' },
                { type: 'RtCode', start: 32, size: 5, color: '#a855f7' },
                { type: 'RtData', start: 37, size: 4, color: '#c084fc' },
                { type: 'Conventional', start: 41, size: 24, color: '#22c55e' },
                { type: 'ACPI NVS', start: 65, size: 10, color: '#14b8a6' },
                { type: 'MMIO', start: 75, size: 15, color: '#f59e0b' },
                { type: 'Reserved', start: 90, size: 10, color: '#ef4444' }
            ]
        },
        os: {
            entries: [
                { type: 'Reserved', start: 0, size: 6, color: '#ef4444' },
                { type: 'OS Managed', start: 6, size: 26, color: '#22c55e' },
                { type: 'RtCode', start: 32, size: 5, color: '#a855f7' },
                { type: 'RtData', start: 37, size: 4, color: '#c084fc' },
                { type: 'OS Managed', start: 41, size: 24, color: '#22c55e' },
                { type: 'ACPI NVS', start: 65, size: 10, color: '#14b8a6' },
                { type: 'MMIO', start: 75, size: 15, color: '#f59e0b' },
                { type: 'Reserved', start: 90, size: 10, color: '#ef4444' }
            ]
        }
    };
}

function initTimelineVisualization() {
    const phases = document.querySelectorAll('.timeline-phase');
    if (!phases.length) return;

    phases.forEach(btn => {
        btn.addEventListener('click', () => {
            phases.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTimelineMap(btn.dataset.phase);
        });
    });

    renderTimelineMap('sec');
}

function renderTimelineMap(phase) {
    const svg = document.getElementById('timeline-svg');
    if (!svg) return;
    const data = getTimelinePhases()[phase];
    if (!data) return;

    const barY = 40, barH = 60, barX = 50, barW = 800;
    let s = '';

    s += `<text x="${barX + barW/2}" y="25" fill="#94a3b8" font-size="13" text-anchor="middle" font-weight="600">${phase.toUpperCase()} Phase Memory Map</text>`;

    data.entries.forEach(entry => {
        const x = barX + (entry.start / 100) * barW;
        const w = (entry.size / 100) * barW;
        s += `<rect x="${x}" y="${barY}" width="${w}" height="${barH}" fill="${entry.color}" opacity="0.7" stroke="#0f172a" stroke-width="1"/>`;
        if (w > 50) {
            s += `<text x="${x + w/2}" y="${barY + barH/2 - 5}" fill="white" font-size="10" text-anchor="middle" font-weight="600">${entry.type}</text>`;
            s += `<text x="${x + w/2}" y="${barY + barH/2 + 12}" fill="rgba(255,255,255,0.7)" font-size="9" text-anchor="middle">${entry.size}%</text>`;
        }
    });

    s += `<text x="${barX}" y="${barY + barH + 20}" fill="#64748b" font-size="9">0x00000000</text>`;
    s += `<text x="${barX + barW}" y="${barY + barH + 20}" fill="#64748b" font-size="9" text-anchor="end">0xFFFFFFFF</text>`;
    s += `<text x="${barX + barW/2}" y="${barY + barH + 20}" fill="#64748b" font-size="9" text-anchor="middle">Address Space</text>`;

    const legendTypes = [...new Set(data.entries.map(e => e.type))];
    const legendY = barY + barH + 40;
    legendTypes.forEach((type, i) => {
        const lx = barX + (i % 5) * 170;
        const ly = legendY + Math.floor(i / 5) * 20;
        const entry = data.entries.find(e => e.type === type);
        s += `<rect x="${lx}" y="${ly}" width="12" height="12" rx="2" fill="${entry.color}" opacity="0.7"/>`;
        s += `<text x="${lx + 18}" y="${ly + 10}" fill="#94a3b8" font-size="10">${type}</text>`;
    });

    svg.innerHTML = s;
}

// ============================================
// S4 Resume Memory Map (Section 7)
// ============================================

function getS4Phases() {
    return {
        wake: {
            entries: [
                { type: 'Reserved', start: 0, size: 5, color: '#ef4444' },
                { type: 'ACPI NVS', start: 5, size: 15, color: '#14b8a6' },
                { type: 'LoaderCode', start: 20, size: 10, color: '#f97316' },
                { type: 'MMIO', start: 30, size: 10, color: '#f59e0b' },
                { type: 'Uninitialized', start: 40, size: 60, color: '#475569' }
            ]
        },
        firmware: {
            entries: [
                { type: 'Reserved', start: 0, size: 5, color: '#ef4444' },
                { type: 'ACPI NVS', start: 5, size: 15, color: '#14b8a6' },
                { type: 'BsCode', start: 20, size: 12, color: '#3b82f6' },
                { type: 'BsData', start: 32, size: 12, color: '#60a5fa' },
                { type: 'MMIO', start: 44, size: 12, color: '#f59e0b' },
                { type: 'Conventional', start: 56, size: 39, color: '#22c55e' }
            ]
        },
        remap: {
            entries: [
                { type: 'Reserved', start: 0, size: 5, color: '#ef4444' },
                { type: 'ACPI NVS', start: 5, size: 15, color: '#14b8a6' },
                { type: 'RtCode', start: 20, size: 8, color: '#a855f7' },
                { type: 'RtData', start: 28, size: 8, color: '#c084fc' },
                { type: 'BsCode', start: 36, size: 8, color: '#3b82f6' },
                { type: 'BsData', start: 44, size: 8, color: '#60a5fa' },
                { type: 'MMIO', start: 52, size: 12, color: '#f59e0b' },
                { type: 'Conventional', start: 64, size: 36, color: '#22c55e' }
            ]
        },
        handoff: {
            entries: [
                { type: 'Reserved', start: 0, size: 7, color: '#ef4444' },
                { type: 'ACPI NVS', start: 7, size: 15, color: '#14b8a6' },
                { type: 'RtCode', start: 22, size: 8, color: '#a855f7' },
                { type: 'RtData', start: 30, size: 8, color: '#c084fc' },
                { type: 'OS Managed', start: 38, size: 50, color: '#22c55e' },
                { type: 'MMIO', start: 88, size: 12, color: '#f59e0b' }
            ]
        }
    };
}

function initS4ResumeVisualization() {
    const phases = document.querySelectorAll('.timeline-bar.s4 .timeline-phase');
    if (!phases.length) return;

    phases.forEach(btn => {
        btn.addEventListener('click', () => {
            phases.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderS4Map(btn.dataset.s4phase);
        });
    });

    renderS4Map('wake');
}

function renderS4Map(phase) {
    const svg = document.getElementById('s4-svg');
    if (!svg) return;
    const data = getS4Phases()[phase];
    if (!data) return;

    const barY = 40, barH = 60, barX = 50, barW = 800;
    let s = '';

    const phaseLabel = (phase || '').toUpperCase();
    s += `<text x="${barX + barW/2}" y="25" fill="#94a3b8" font-size="13" text-anchor="middle" font-weight="600">S4 ${phaseLabel} Memory Map</text>`;

    data.entries.forEach(entry => {
        const x = barX + (entry.start / 100) * barW;
        const w = (entry.size / 100) * barW;
        s += `<rect x="${x}" y="${barY}" width="${w}" height="${barH}" fill="${entry.color}" opacity="0.7" stroke="#0f172a" stroke-width="1"/>`;
        if (w > 50) {
            s += `<text x="${x + w/2}" y="${barY + barH/2 - 5}" fill="white" font-size="10" text-anchor="middle" font-weight="600">${entry.type}</text>`;
            s += `<text x="${x + w/2}" y="${barY + barH/2 + 12}" fill="rgba(255,255,255,0.7)" font-size="9" text-anchor="middle">${entry.size}%</text>`;
        }
    });

    s += `<text x="${barX}" y="${barY + barH + 20}" fill="#64748b" font-size="9">0x00000000</text>`;
    s += `<text x="${barX + barW}" y="${barY + barH + 20}" fill="#64748b" font-size="9" text-anchor="end">0xFFFFFFFF</text>`;
    s += `<text x="${barX + barW/2}" y="${barY + barH + 20}" fill="#64748b" font-size="9" text-anchor="middle">Address Space</text>`;

    const legendTypes = [...new Set(data.entries.map(e => e.type))];
    const legendY = barY + barH + 40;
    legendTypes.forEach((type, i) => {
        const lx = barX + (i % 5) * 170;
        const ly = legendY + Math.floor(i / 5) * 20;
        const entry = data.entries.find(e => e.type === type);
        s += `<rect x="${lx}" y="${ly}" width="12" height="12" rx="2" fill="${entry.color}" opacity="0.7"/>`;
        s += `<text x="${lx + 18}" y="${ly + 10}" fill="#94a3b8" font-size="10">${type}</text>`;
    });

    svg.innerHTML = s;
}

// ============================================
// Policy Comparator (Section 7)
// ============================================

function getPolicyMemoryLayout() {
    return [
        { type: 'BsData', pages: 8, color: '#3b82f6', bgColor: 'rgba(59,130,246,0.2)' },
        { type: 'Conventional', pages: 6, color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)' },
        { type: 'BsData', pages: 4, color: '#3b82f6', bgColor: 'rgba(59,130,246,0.2)' },
        { type: 'Conventional', pages: 4, color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)' },
        { type: 'RtData', pages: 6, color: '#a855f7', bgColor: 'rgba(168,85,247,0.15)' },
        { type: 'Conventional', pages: 12, color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)' },
        { type: 'BsData', pages: 3, color: '#3b82f6', bgColor: 'rgba(59,130,246,0.2)' },
        { type: 'Conventional', pages: 8, color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)' }
    ];
}

function initPolicyComparator() {
    const buttons = document.querySelectorAll('.policy-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPolicyDiagram(btn.dataset.policy);
        });
    });

    renderPolicyDiagram('first-fit');
}

function renderPolicyDiagram(policy) {
    const svg = document.getElementById('policy-svg');
    const resultEl = document.getElementById('policy-result');
    if (!svg) return;

    const layout = getPolicyMemoryLayout();
    const requestPages = 4;
    const totalPages = layout.reduce((sum, b) => sum + b.pages, 0);
    const barX = 50, barY = 50, barW = 800, barH = 80;

    let s = '';
    let selectedIdx = -1;

    const convBlocks = layout.map((b, i) => ({ ...b, idx: i })).filter(b => b.type === 'Conventional' && b.pages >= requestPages);

    if (policy === 'first-fit') {
        selectedIdx = convBlocks.length > 0 ? convBlocks[0].idx : -1;
    } else if (policy === 'best-fit') {
        if (convBlocks.length > 0) {
            convBlocks.sort((a, b) => a.pages - b.pages);
            selectedIdx = convBlocks[0].idx;
        }
    } else if (policy === 'next-fit') {
        const startIdx = 3;
        for (let i = 0; i < layout.length; i++) {
            const idx = (startIdx + i) % layout.length;
            if (layout[idx].type === 'Conventional' && layout[idx].pages >= requestPages) {
                selectedIdx = idx;
                break;
            }
        }
    }

    let currentX = barX;
    layout.forEach((block, idx) => {
        const w = (block.pages / totalPages) * barW;
        const isSelected = idx === selectedIdx;
        const isConvSmall = block.type === 'Conventional' && block.pages < requestPages;
        let strokeW = isSelected ? 3 : 2;
        let extra = isSelected ? `style="filter: drop-shadow(0 0 12px ${block.color})"` : '';

        s += `<g ${extra}>`;
        s += `<rect x="${currentX}" y="${barY}" width="${w}" height="${barH}" rx="4"
              fill="${block.bgColor}" stroke="${block.color}" stroke-width="${strokeW}"
              ${isConvSmall ? 'stroke-dasharray="4,3"' : ''}/>`;

        if (w > 30) {
            s += `<text x="${currentX + w/2}" y="${barY + 25}" fill="${block.color}" font-size="10" text-anchor="middle" font-weight="600">${block.type}</text>`;
            s += `<text x="${currentX + w/2}" y="${barY + 45}" fill="#94a3b8" font-size="10" text-anchor="middle">${block.pages} ${t('frag.pages')}</text>`;
        }

        if (block.type === 'Conventional') {
            if (isSelected) {
                s += `<text x="${currentX + w/2}" y="${barY + barH + 20}" fill="#22c55e" font-size="10" text-anchor="middle" font-weight="600">✓ ${t('policy.selected')}</text>`;
            } else if (block.pages < requestPages) {
                s += `<text x="${currentX + w/2}" y="${barY + barH + 20}" fill="#ef4444" font-size="9" text-anchor="middle">✗ too small</text>`;
            } else {
                s += `<text x="${currentX + w/2}" y="${barY + barH + 20}" fill="#64748b" font-size="9" text-anchor="middle">${t('policy.skipped')}</text>`;
            }
        }

        s += `</g>`;
        currentX += w;
    });

    s += `<text x="${barX + barW/2}" y="30" fill="#f59e0b" font-size="13" text-anchor="middle" font-weight="600">${policy.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — ${t('policy.request')}</text>`;

    if (policy === 'next-fit') {
        s += `<text x="${barX}" y="${barY + barH + 50}" fill="#f59e0b" font-size="10">Start ↓ index 3</text>`;
    }

    svg.innerHTML = s;

    if (resultEl) {
        const selectedBlock = selectedIdx >= 0 ? layout[selectedIdx] : null;
        if (selectedBlock) {
            const waste = selectedBlock.pages - requestPages;
            resultEl.innerHTML = `<strong>${policy.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong>: ` +
                `${t('policy.selected')} block #${selectedIdx + 1} (${selectedBlock.pages} ${t('frag.pages')}) — ` +
                `${t('policy.fragAfter')} ${waste} ${t('frag.pages')} internal waste`;
        } else {
            resultEl.textContent = 'No suitable block found.';
        }
    }
}

// ============================================
// Fragmentation Heatmap (Section 8)
// ============================================

let fragMemory = [];
let fragOps = 0;
let fragAllocId = 0;

function initFragmentationHeatmap() {
    const allocBtn = document.getElementById('frag-allocate');
    const freeBtn = document.getElementById('frag-free');
    const resetBtn = document.getElementById('frag-reset');

    if (!allocBtn || !freeBtn || !resetBtn) return;

    allocBtn.addEventListener('click', fragAllocate);
    freeBtn.addEventListener('click', fragFree);
    resetBtn.addEventListener('click', fragReset);

    fragReset();
}

function fragReset() {
    fragMemory = [{ type: 'free', size: 64, id: 0 }];
    fragOps = 0;
    fragAllocId = 1;
    renderFragHeatmap();
}

function fragAllocate() {
    const sizes = [2, 4, 6, 8];
    const size = sizes[Math.floor(Math.random() * sizes.length)];

    for (let i = 0; i < fragMemory.length; i++) {
        if (fragMemory[i].type === 'free' && fragMemory[i].size >= size) {
            const remaining = fragMemory[i].size - size;
            const newBlock = { type: 'alloc', size: size, id: fragAllocId++ };
            if (remaining > 0) {
                fragMemory.splice(i, 1, newBlock, { type: 'free', size: remaining, id: 0 });
            } else {
                fragMemory.splice(i, 1, newBlock);
            }
            fragOps++;
            renderFragHeatmap();
            return;
        }
    }
    fragOps++;
    renderFragHeatmap();
}

function fragFree() {
    const allocBlocks = fragMemory.filter(b => b.type === 'alloc');
    if (allocBlocks.length === 0) return;

    const target = allocBlocks[Math.floor(Math.random() * allocBlocks.length)];
    const idx = fragMemory.indexOf(target);
    fragMemory[idx] = { type: 'free', size: target.size, id: 0 };

    for (let i = fragMemory.length - 1; i > 0; i--) {
        if (fragMemory[i].type === 'free' && fragMemory[i - 1].type === 'free') {
            fragMemory[i - 1].size += fragMemory[i].size;
            fragMemory.splice(i, 1);
        }
    }

    fragOps++;
    renderFragHeatmap();
}

function renderFragHeatmap() {
    const svg = document.getElementById('frag-svg');
    if (!svg) return;

    const totalSize = fragMemory.reduce((s, b) => s + b.size, 0);
    const barX = 10, barY = 20, barW = 880, barH = 70;
    let s = '';
    let currentX = barX;

    const allocColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#84cc16'];

    fragMemory.forEach(block => {
        const w = (block.size / totalSize) * barW;
        if (block.type === 'free') {
            s += `<rect x="${currentX}" y="${barY}" width="${w}" height="${barH}" rx="3"
                  fill="rgba(34,197,94,0.15)" stroke="#22c55e" stroke-width="1"/>`;
            if (w > 20) {
                s += `<text x="${currentX + w/2}" y="${barY + barH/2 + 4}" fill="#22c55e" font-size="${w > 40 ? 10 : 8}" text-anchor="middle">${block.size}</text>`;
            }
        } else {
            const color = allocColors[block.id % allocColors.length];
            s += `<rect x="${currentX}" y="${barY}" width="${w}" height="${barH}" rx="3"
                  fill="${color}" opacity="0.6" stroke="${color}" stroke-width="1"/>`;
            if (w > 20) {
                s += `<text x="${currentX + w/2}" y="${barY + barH/2 + 4}" fill="white" font-size="${w > 40 ? 10 : 8}" text-anchor="middle">${block.size}</text>`;
            }
        }
        currentX += w;
    });

    svg.innerHTML = s;

    const freeBlocks = fragMemory.filter(b => b.type === 'free');
    const totalFree = freeBlocks.reduce((s, b) => s + b.size, 0);
    const largestFree = freeBlocks.length > 0 ? Math.max(...freeBlocks.map(b => b.size)) : 0;
    const fragRatio = totalFree > 0 ? Math.round((1 - largestFree / totalFree) * 100) : 0;

    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('frag-free-blocks', freeBlocks.length);
    el('frag-largest-free', largestFree + ' ' + t('frag.pages'));
    el('frag-ratio', fragRatio + '%');
    el('frag-total-free', totalFree + ' ' + t('frag.pages'));
    el('frag-ops', fragOps);
}

// ============================================
// Runtime Handoff Visualization (Section 9)
// ============================================

function initRuntimeHandoff() {
    renderHandoffDiagram();
}

function renderHandoffDiagram() {
    const beforeSvg = document.getElementById('handoff-before-svg');
    const afterSvg = document.getElementById('handoff-after-svg');
    if (!beforeSvg || !afterSvg) return;

    const beforeEntries = [
        { type: 'Reserved', color: '#ef4444', size: 8 },
        { type: 'BsCode', color: '#3b82f6', size: 12 },
        { type: 'BsData', color: '#60a5fa', size: 15 },
        { type: 'RtCode', color: '#a855f7', size: 8 },
        { type: 'RtData', color: '#c084fc', size: 6 },
        { type: 'Conventional', color: '#22c55e', size: 25 },
        { type: 'ACPI Reclaim', color: '#2dd4bf', size: 5 },
        { type: 'ACPI NVS', color: '#14b8a6', size: 8 },
        { type: 'MMIO', color: '#f59e0b', size: 13 }
    ];

    const afterEntries = [
        { type: 'Reserved', color: '#ef4444', size: 8 },
        { type: 'Conventional', color: '#22c55e', size: 27, note: t('handoff.reclaimed') },
        { type: 'RtCode', color: '#a855f7', size: 8, note: t('handoff.survives') },
        { type: 'RtData', color: '#c084fc', size: 6, note: t('handoff.survives') },
        { type: 'Conventional', color: '#22c55e', size: 25 },
        { type: 'Conventional', color: '#22c55e', size: 5, note: t('handoff.reclaimed') },
        { type: 'ACPI NVS', color: '#14b8a6', size: 8, note: t('handoff.survives') },
        { type: 'MMIO', color: '#f59e0b', size: 13 }
    ];

    function renderVerticalMap(svg, entries) {
        const total = entries.reduce((s, e) => s + e.size, 0);
        const mapX = 20, mapW = 360, mapY = 10, mapH = 370;
        let s = '';
        let currentY = mapY;

        entries.forEach(entry => {
            const h = (entry.size / total) * mapH;
            s += `<rect x="${mapX}" y="${currentY}" width="${mapW}" height="${h}"
                  fill="${entry.color}" opacity="0.5" stroke="#0f172a" stroke-width="1"/>`;
            if (h > 18) {
                s += `<text x="${mapX + 10}" y="${currentY + h/2 + 4}" fill="white" font-size="10" font-weight="600">${entry.type}</text>`;
                s += `<text x="${mapX + mapW - 10}" y="${currentY + h/2 + 4}" fill="rgba(255,255,255,0.7)" font-size="9" text-anchor="end">${entry.size}%</text>`;
            }
            if (entry.note && h > 14) {
                s += `<text x="${mapX + mapW/2}" y="${currentY + h/2 + 16}" fill="rgba(255,255,255,0.6)" font-size="8" text-anchor="middle" font-style="italic">${entry.note}</text>`;
            }
            currentY += h;
        });

        svg.innerHTML = s;
    }

    renderVerticalMap(beforeSvg, beforeEntries);
    renderVerticalMap(afterSvg, afterEntries);
}

// ============================================
// Code-to-Visual Linking (Feature 6)
// ============================================

function initCodeLinking() {
    document.querySelectorAll('[data-highlight]').forEach(el => {
        el.classList.add('code-highlight-link');
        el.addEventListener('mouseenter', () => {
            const targetId = el.dataset.highlight;
            const svgEl = document.querySelector(`[data-link-id="${targetId}"]`);
            if (svgEl) svgEl.classList.add('svg-linked-highlight');
        });
        el.addEventListener('mouseleave', () => {
            document.querySelectorAll('.svg-linked-highlight').forEach(e => e.classList.remove('svg-linked-highlight'));
        });
    });
}

// ============================================
// Export Toolbar (Feature 7)
// ============================================

function initExportToolbar() {
    const toggleBtn = document.getElementById('export-toggle');
    const dropdown = document.getElementById('export-dropdown');
    const svgBtn = document.getElementById('export-svg');
    const pngBtn = document.getElementById('export-png');

    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.export-toolbar')) {
            dropdown.classList.add('hidden');
        }
    });

    if (svgBtn) {
        svgBtn.addEventListener('click', () => {
            const svgEl = findVisibleSvg();
            if (!svgEl) return;

            navigator.clipboard.writeText(svgEl.outerHTML).then(() => {
                svgBtn.textContent = t('export.copied');
                setTimeout(() => { svgBtn.textContent = t('export.copySvg'); }, 2000);
            });
            dropdown.classList.add('hidden');
        });
    }

    if (pngBtn) {
        pngBtn.addEventListener('click', () => {
            const svgEl = findVisibleSvg();
            if (!svgEl) return;

            const svgData = new XMLSerializer().serializeToString(svgEl);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = function () {
                canvas.width = img.width * 2;
                canvas.height = img.height * 2;
                ctx.scale(2, 2);
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);

                const pngUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'uefi-memory-viz.png';
                link.href = pngUrl;
                link.click();
            };
            img.src = url;
            dropdown.classList.add('hidden');
        });
    }
}

function findVisibleSvg() {
    const svgs = document.querySelectorAll('svg[id]');
    for (const svg of svgs) {
        const rect = svg.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 100) {
            return svg;
        }
    }
    return svgs[0] || null;
}
