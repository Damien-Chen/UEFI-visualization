// UEFI EDK2 Memory Management Visualization
// Interactive step-by-step visualization for memory allocation and deallocation

document.addEventListener('DOMContentLoaded', function() {
    initI18n();
    initNavigation();
    initAllocationVisualization();
    initDeallocationVisualization();
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
