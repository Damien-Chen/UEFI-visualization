// Internationalization (i18n) System for UEFI Memory Management Visualization

const translations = {
    'zh-TW': {
        // Navigation
        'nav.dataStructures': '資料結構',
        'nav.memoryLayout': '記憶體配置圖',
        'nav.allocation': '記憶體配置',
        'nav.deallocation': '記憶體釋放',
        
        // Section 1: Data Structures
        'section1.title': '1. 基礎資料結構',
        'section1.1.title': '1.1 LIST_ENTRY 雙向鏈結串列',
        'section1.1.desc': '<code>LIST_ENTRY</code> 是 EDK2 中最基礎的資料結構，用於實現雙向鏈結串列。它被嵌入到其他結構體中，用於將多個結構體串連起來。',
        'section1.1.diagram': 'LIST_ENTRY 結構圖解',
        
        'section1.2.title': '1.2 MEMORY_MAP_ENTRY 記憶體描述結構',
        'section1.2.desc': '<code>MEMORY_MAP_ENTRY</code> 描述一塊連續的記憶體區域，包含其類型、起始位址、頁數等資訊。多個 MEMORY_MAP_ENTRY 透過 LIST_ENTRY 串連成記憶體映射表。',
        'section1.2.diagram': 'MEMORY_MAP_ENTRY 結構與串連',
        
        'section1.3.title': '1.3 EFI_MEMORY_TYPE 記憶體類型',
        
        // Memory Types
        'memType.reserved': '保留記憶體，不可使用',
        'memType.loaderCode': 'OS Loader 程式碼',
        'memType.loaderData': 'OS Loader 資料',
        'memType.bsCode': 'Boot Services 程式碼',
        'memType.bsData': 'Boot Services 資料',
        'memType.rtCode': 'Runtime Services 程式碼',
        'memType.rtData': 'Runtime Services 資料',
        'memType.conventional': '可用的空閒記憶體',
        'memType.acpiReclaim': 'ACPI 可回收記憶體',
        'memType.acpiNvs': 'ACPI NVS 記憶體',
        'memType.mmio': '記憶體映射 I/O',
        'memType.persistent': '持久性記憶體',
        
        // Section 2: Memory Layout
        'section2.title': '2. 記憶體初始化配置圖',
        'section2.1.title': '2.1 系統記憶體整體佈局',
        'section2.1.desc': '在 UEFI 系統啟動過程中，記憶體會被劃分為不同的區域。以下是一個典型的記憶體佈局範例：',
        'section2.2.title': '2.2 記憶體映射表初始狀態',
        'section2.2.desc': '系統啟動後，記憶體管理器會建立一個 Memory Map 鏈結串列來追蹤所有記憶體區域的狀態：',
        
        // Memory blocks
        'memBlock.mmio': 'MMIO 區域',
        'memBlock.mmioDesc': 'PCIe, LAPIC, IO-APIC',
        'memBlock.smram': 'SMRAM (SMM)',
        'memBlock.smramDesc': '系統管理模式',
        'memBlock.pci': 'PCI Memory Hole',
        'memBlock.pciDesc': 'PCI 設備記憶體映射',
        'memBlock.dxe': 'DXE Memory Pool',
        'memBlock.dxeDesc': 'DXE 驅動程式、Protocols',
        'memBlock.dxeSize': '主要可用記憶體區域',
        'memBlock.runtime': 'Runtime Services',
        'memBlock.runtimeDesc': 'Runtime Code & Data',
        'memBlock.boot': 'Boot Services',
        'memBlock.bootDesc': 'Boot Code & Data',
        'memBlock.legacy': 'Legacy 區域',
        'memBlock.legacyDesc': 'VGA Buffer, Option ROMs',
        'memBlock.low': 'Low Memory',
        'memBlock.lowDesc': 'IVT, BDA, EBDA',
        
        // Section 3: Allocation
        'section3.title': '3. 記憶體配置流程',
        'section3.1.title': '3.1 AllocatePages 配置流程',
        'section3.1.desc': '當呼叫 <code>gBS->AllocatePages()</code> 時，記憶體管理器會執行以下步驟來找到適合的記憶體區塊：',
        'section3.2.title': '3.2 配置演算法詳解',
        'section3.2.algo': 'First-Fit 演算法',
        'section3.2.step1': '從 gMemoryMap 鏈結串列的頭部開始遍歷',
        'section3.2.step2': '對每個 MEMORY_MAP_ENTRY 檢查：',
        'section3.2.step2a': '類型是否為 EfiConventionalMemory（可用記憶體）',
        'section3.2.step2b': '大小是否足夠容納請求的頁數',
        'section3.2.step2c': '位址是否符合對齊要求',
        'section3.2.step3': '找到第一個符合條件的區塊後停止搜尋',
        'section3.2.step4': '分割該區塊，更新記憶體映射表',
        
        // Section 4: Deallocation
        'section4.title': '4. 記憶體釋放流程',
        'section4.1.title': '4.1 FreePages 釋放流程',
        'section4.1.desc': '當呼叫 <code>gBS->FreePages()</code> 時，記憶體管理器會將記憶體歸還並嘗試合併相鄰的空閒區塊：',
        'section4.2.title': '4.2 記憶體合併 (Coalescing)',
        'section4.2.desc': '釋放記憶體後，管理器會檢查相鄰區塊是否也是空閒的，如果是則合併它們以減少碎片化：',
        'section4.2.before': '合併前',
        'section4.2.after': '合併後',
        'section4.2.free': 'Free',
        'section4.2.releasing': 'Releasing',
        'section4.2.pages': '頁',
        
        // Controls
        'btn.prev': '← 上一步',
        'btn.next': '下一步 →',
        'btn.reset': '重置',
        'step.indicator': '步驟 {current} / {total}',
        
        // Footer
        'footer.text': 'UEFI EDK2 記憶體管理視覺化 | 教育用途',
        
        // Allocation Steps
        'alloc.step1.title': '步驟 1：接收配置請求',
        'alloc.step1.desc': '應用程式呼叫 <code>AllocatePages(AllocateAnyPages, EfiBootServicesData, 4, &Address)</code><br>請求配置 <strong>4 頁 (16KB)</strong> 的 Boot Services Data 記憶體',
        'alloc.step2.title': '步驟 2：從 gMemoryMap 開始遍歷',
        'alloc.step2.desc': '記憶體管理器從 <code>gMemoryMap</code> 連結串列的頭部開始<br>取得第一個 <code>MEMORY_MAP_ENTRY</code> 節點',
        'alloc.step3.title': '步驟 3：檢查第一個區塊',
        'alloc.step3.desc': '檢查第一個 Entry：<strong>Reserved Memory (0x00000000 - 0x0009FFFF)</strong><br>類型為 Reserved，<span style="color: #ef4444;">不符合條件</span>，繼續下一個',
        'alloc.step4.title': '步驟 4：檢查第二個區塊',
        'alloc.step4.desc': '檢查第二個 Entry：<strong>MMIO (0x000A0000 - 0x000FFFFF)</strong><br>類型為 MMIO，<span style="color: #ef4444;">不符合條件</span>，繼續下一個',
        'alloc.step5.title': '步驟 5：找到可用區塊！',
        'alloc.step5.desc': '檢查第三個 Entry：<strong>Conventional Memory (0x00100000 - 0x0FFFFFFF)</strong><br>類型為 ConventionalMemory，<span style="color: #22c55e;">符合條件！</span><br>檢查大小：需要 4 頁，可用 65280 頁 ✓',
        'alloc.step6.title': '步驟 6：分割記憶體區塊',
        'alloc.step6.desc': '將原本的大區塊分割成兩部分：<br>1. <strong>已配置區塊</strong>：0x00100000 - 0x00103FFF (4 頁, Boot Services Data)<br>2. <strong>剩餘可用區塊</strong>：0x00104000 - 0x0FFFFFFF (Conventional Memory)',
        'alloc.step7.title': '步驟 7：配置完成',
        'alloc.step7.desc': '記憶體配置成功！<br>回傳位址：<strong>0x00100000</strong><br>記憶體映射表已更新，新增一個 Boot Services Data 區塊',
        
        // Deallocation Steps
        'free.step1.title': '步驟 1：接收釋放請求',
        'free.step1.desc': '應用程式呼叫 <code>FreePages(0x00200000, 4)</code><br>請求釋放位址 <strong>0x00200000</strong> 的 <strong>4 頁</strong> 記憶體',
        'free.step2.title': '步驟 2：搜尋對應的記憶體區塊',
        'free.step2.desc': '遍歷 <code>gMemoryMap</code> 找到包含位址 0x00200000 的區塊<br>驗證該區塊的類型和大小是否正確',
        'free.step3.title': '步驟 3：驗證釋放請求',
        'free.step3.desc': '找到區塊：<strong>BootServicesData (0x00200000 - 0x00203FFF)</strong><br>驗證：類型可釋放 ✓，大小匹配 ✓',
        'free.step4.title': '步驟 4：將區塊類型改為 Conventional',
        'free.step4.desc': '將找到的區塊類型從 <strong>BootServicesData</strong> 改為 <strong>ConventionalMemory</strong><br>此時記憶體已標記為可用',
        'free.step5.title': '步驟 5：檢查並合併相鄰區塊',
        'free.step5.desc': '檢查前後相鄰的區塊是否也是 ConventionalMemory<br>如果是，則合併它們以減少記憶體碎片',
        'free.step6.title': '步驟 6：釋放完成',
        'free.step6.desc': '記憶體釋放成功！<br>相鄰的空閒區塊已合併，減少了記憶體碎片<br>回傳 <strong>EFI_SUCCESS</strong>',
        
        // Diagram labels
        'diagram.checking': '檢查中',
        'diagram.searching': '搜尋中...',
        'diagram.found': '找到目標!',
        'diagram.notMatch': '✗ 不符合',
        'diagram.match': '✓ 找到!',
        'diagram.newAlloc': '★ 新配置',
        'diagram.allocComplete': '✓ 配置完成！回傳位址:',
        'diagram.allocSuccess': '✓ 記憶體配置成功完成',
        'diagram.mapUpdated': 'gMemoryMap 已更新，新增 BootServicesData 區塊',
        'diagram.justReleased': '剛釋放',
        'diagram.canMerge': '可合併 ↔',
        'diagram.merging': '合併相鄰的 Conventional Memory 區塊',
        'diagram.merged': '(合併後)',
        'diagram.mergedInfo': '原本 3 個區塊已合併為 1 個大區塊',
        'diagram.freeComplete': '✓ 記憶體釋放完成！減少了記憶體碎片',
        'diagram.returnSuccess': '回傳 EFI_SUCCESS',
        'diagram.verifying': '驗證中: 類型 ✓ 大小 ✓',
        'diagram.verified': '驗證通過，準備釋放'
    },
    
    'en': {
        // Navigation
        'nav.dataStructures': 'Data Structures',
        'nav.memoryLayout': 'Memory Layout',
        'nav.allocation': 'Allocation',
        'nav.deallocation': 'Deallocation',
        
        // Section 1: Data Structures
        'section1.title': '1. Basic Data Structures',
        'section1.1.title': '1.1 LIST_ENTRY Doubly Linked List',
        'section1.1.desc': '<code>LIST_ENTRY</code> is the most fundamental data structure in EDK2, used to implement doubly linked lists. It is embedded in other structures to link multiple structures together.',
        'section1.1.diagram': 'LIST_ENTRY Structure Diagram',
        
        'section1.2.title': '1.2 MEMORY_MAP_ENTRY Memory Descriptor',
        'section1.2.desc': '<code>MEMORY_MAP_ENTRY</code> describes a contiguous memory region, containing its type, start address, page count, etc. Multiple MEMORY_MAP_ENTRYs are linked via LIST_ENTRY to form a memory map.',
        'section1.2.diagram': 'MEMORY_MAP_ENTRY Structure and Linking',
        
        'section1.3.title': '1.3 EFI_MEMORY_TYPE Memory Types',
        
        // Memory Types
        'memType.reserved': 'Reserved memory, not usable',
        'memType.loaderCode': 'OS Loader code',
        'memType.loaderData': 'OS Loader data',
        'memType.bsCode': 'Boot Services code',
        'memType.bsData': 'Boot Services data',
        'memType.rtCode': 'Runtime Services code',
        'memType.rtData': 'Runtime Services data',
        'memType.conventional': 'Available free memory',
        'memType.acpiReclaim': 'ACPI reclaimable memory',
        'memType.acpiNvs': 'ACPI NVS memory',
        'memType.mmio': 'Memory Mapped I/O',
        'memType.persistent': 'Persistent memory',
        
        // Section 2: Memory Layout
        'section2.title': '2. Memory Initialization Layout',
        'section2.1.title': '2.1 System Memory Overall Layout',
        'section2.1.desc': 'During UEFI system boot, memory is divided into different regions. Here is a typical memory layout example:',
        'section2.2.title': '2.2 Memory Map Initial State',
        'section2.2.desc': 'After system boot, the memory manager creates a Memory Map linked list to track the state of all memory regions:',
        
        // Memory blocks
        'memBlock.mmio': 'MMIO Region',
        'memBlock.mmioDesc': 'PCIe, LAPIC, IO-APIC',
        'memBlock.smram': 'SMRAM (SMM)',
        'memBlock.smramDesc': 'System Management Mode',
        'memBlock.pci': 'PCI Memory Hole',
        'memBlock.pciDesc': 'PCI Device Memory Mapping',
        'memBlock.dxe': 'DXE Memory Pool',
        'memBlock.dxeDesc': 'DXE Drivers, Protocols',
        'memBlock.dxeSize': 'Main usable memory region',
        'memBlock.runtime': 'Runtime Services',
        'memBlock.runtimeDesc': 'Runtime Code & Data',
        'memBlock.boot': 'Boot Services',
        'memBlock.bootDesc': 'Boot Code & Data',
        'memBlock.legacy': 'Legacy Region',
        'memBlock.legacyDesc': 'VGA Buffer, Option ROMs',
        'memBlock.low': 'Low Memory',
        'memBlock.lowDesc': 'IVT, BDA, EBDA',
        
        // Section 3: Allocation
        'section3.title': '3. Memory Allocation Process',
        'section3.1.title': '3.1 AllocatePages Process',
        'section3.1.desc': 'When calling <code>gBS->AllocatePages()</code>, the memory manager performs the following steps to find a suitable memory block:',
        'section3.2.title': '3.2 Allocation Algorithm Details',
        'section3.2.algo': 'First-Fit Algorithm',
        'section3.2.step1': 'Start traversing from the head of the gMemoryMap linked list',
        'section3.2.step2': 'Check each MEMORY_MAP_ENTRY:',
        'section3.2.step2a': 'Is the type EfiConventionalMemory (available memory)?',
        'section3.2.step2b': 'Is the size sufficient for the requested pages?',
        'section3.2.step2c': 'Does the address meet alignment requirements?',
        'section3.2.step3': 'Stop searching after finding the first matching block',
        'section3.2.step4': 'Split the block and update the memory map',
        
        // Section 4: Deallocation
        'section4.title': '4. Memory Deallocation Process',
        'section4.1.title': '4.1 FreePages Process',
        'section4.1.desc': 'When calling <code>gBS->FreePages()</code>, the memory manager returns the memory and attempts to merge adjacent free blocks:',
        'section4.2.title': '4.2 Memory Coalescing',
        'section4.2.desc': 'After freeing memory, the manager checks if adjacent blocks are also free, and merges them to reduce fragmentation:',
        'section4.2.before': 'Before Merge',
        'section4.2.after': 'After Merge',
        'section4.2.free': 'Free',
        'section4.2.releasing': 'Releasing',
        'section4.2.pages': 'Pages',
        
        // Controls
        'btn.prev': '← Previous',
        'btn.next': 'Next →',
        'btn.reset': 'Reset',
        'step.indicator': 'Step {current} / {total}',
        
        // Footer
        'footer.text': 'UEFI EDK2 Memory Management Visualization | Educational Purpose',
        
        // Allocation Steps
        'alloc.step1.title': 'Step 1: Receive Allocation Request',
        'alloc.step1.desc': 'Application calls <code>AllocatePages(AllocateAnyPages, EfiBootServicesData, 4, &Address)</code><br>Requesting <strong>4 pages (16KB)</strong> of Boot Services Data memory',
        'alloc.step2.title': 'Step 2: Start Traversing gMemoryMap',
        'alloc.step2.desc': 'Memory manager starts from the head of <code>gMemoryMap</code> linked list<br>Get the first <code>MEMORY_MAP_ENTRY</code> node',
        'alloc.step3.title': 'Step 3: Check First Block',
        'alloc.step3.desc': 'Check first Entry: <strong>Reserved Memory (0x00000000 - 0x0009FFFF)</strong><br>Type is Reserved, <span style="color: #ef4444;">does not match</span>, continue to next',
        'alloc.step4.title': 'Step 4: Check Second Block',
        'alloc.step4.desc': 'Check second Entry: <strong>MMIO (0x000A0000 - 0x000FFFFF)</strong><br>Type is MMIO, <span style="color: #ef4444;">does not match</span>, continue to next',
        'alloc.step5.title': 'Step 5: Found Available Block!',
        'alloc.step5.desc': 'Check third Entry: <strong>Conventional Memory (0x00100000 - 0x0FFFFFFF)</strong><br>Type is ConventionalMemory, <span style="color: #22c55e;">matches!</span><br>Check size: need 4 pages, available 65280 pages ✓',
        'alloc.step6.title': 'Step 6: Split Memory Block',
        'alloc.step6.desc': 'Split the original large block into two parts:<br>1. <strong>Allocated block</strong>: 0x00100000 - 0x00103FFF (4 pages, Boot Services Data)<br>2. <strong>Remaining free block</strong>: 0x00104000 - 0x0FFFFFFF (Conventional Memory)',
        'alloc.step7.title': 'Step 7: Allocation Complete',
        'alloc.step7.desc': 'Memory allocation successful!<br>Return address: <strong>0x00100000</strong><br>Memory map updated with new Boot Services Data block',
        
        // Deallocation Steps
        'free.step1.title': 'Step 1: Receive Free Request',
        'free.step1.desc': 'Application calls <code>FreePages(0x00200000, 4)</code><br>Requesting to free <strong>4 pages</strong> at address <strong>0x00200000</strong>',
        'free.step2.title': 'Step 2: Search for Memory Block',
        'free.step2.desc': 'Traverse <code>gMemoryMap</code> to find the block containing address 0x00200000<br>Verify the block type and size are correct',
        'free.step3.title': 'Step 3: Validate Free Request',
        'free.step3.desc': 'Found block: <strong>BootServicesData (0x00200000 - 0x00203FFF)</strong><br>Validation: Type is freeable ✓, Size matches ✓',
        'free.step4.title': 'Step 4: Change Block Type to Conventional',
        'free.step4.desc': 'Change the block type from <strong>BootServicesData</strong> to <strong>ConventionalMemory</strong><br>Memory is now marked as available',
        'free.step5.title': 'Step 5: Check and Merge Adjacent Blocks',
        'free.step5.desc': 'Check if adjacent blocks before and after are also ConventionalMemory<br>If so, merge them to reduce memory fragmentation',
        'free.step6.title': 'Step 6: Free Complete',
        'free.step6.desc': 'Memory freed successfully!<br>Adjacent free blocks have been merged, reducing fragmentation<br>Return <strong>EFI_SUCCESS</strong>',
        
        // Diagram labels
        'diagram.checking': 'Checking',
        'diagram.searching': 'Searching...',
        'diagram.found': 'Target Found!',
        'diagram.notMatch': '✗ Not Match',
        'diagram.match': '✓ Found!',
        'diagram.newAlloc': '★ New Alloc',
        'diagram.allocComplete': '✓ Allocation Complete! Return addr:',
        'diagram.allocSuccess': '✓ Memory Allocation Successful',
        'diagram.mapUpdated': 'gMemoryMap updated with new BootServicesData block',
        'diagram.justReleased': 'Just Released',
        'diagram.canMerge': 'Can Merge ↔',
        'diagram.merging': 'Merging adjacent Conventional Memory blocks',
        'diagram.merged': '(Merged)',
        'diagram.mergedInfo': 'Original 3 blocks merged into 1 large block',
        'diagram.freeComplete': '✓ Memory Free Complete! Reduced fragmentation',
        'diagram.returnSuccess': 'Return EFI_SUCCESS',
        'diagram.verifying': 'Verifying: Type ✓ Size ✓',
        'diagram.verified': 'Verified, ready to free'
    }
};

let currentLang = 'zh-TW';

function initI18n() {
    // Set initial language from localStorage or default to zh-TW
    const savedLang = localStorage.getItem('uefi-viz-lang') || 'zh-TW';
    setLanguage(savedLang);
    
    // Add click handlers to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('uefi-viz-lang', lang);
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    updatePageTranslations();
    
    // Re-render dynamic content
    if (typeof renderAllocStep === 'function') {
        renderAllocStep(currentAllocStep);
    }
    if (typeof renderFreeStep === 'function') {
        renderFreeStep(currentFreeStep);
    }
}

function t(key, params = {}) {
    let text = translations[currentLang][key] || translations['en'][key] || key;
    
    // Replace parameters like {current} and {total}
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

function updatePageTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translation = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translation;
        } else {
            el.innerHTML = translation;
        }
    });
    
    // Update page title
    document.title = currentLang === 'zh-TW' ? 
        'UEFI EDK2 記憶體管理視覺化' : 
        'UEFI EDK2 Memory Management Visualization';
}

function getCurrentLang() {
    return currentLang;
}
