/* ------------------------------------------------------------------ */
/*  PEI Shadow Process Visualizer – i18n                              */
/*  Bilingual: English (en) + Traditional Chinese (zh-TW)             */
/* ------------------------------------------------------------------ */

const translations = {
'zh-TW': {
    'page.title': 'PEI Shadow 流程視覺化',

    /* ---- nav ---- */
    'nav.back':          '← 返回工具列表',
    'nav.overview':      '概述',
    'nav.architecture':  '記憶體架構',
    'nav.flow':          'Shadow 流程',
    'nav.fixup':         '指標修正',
    'nav.code':          '程式碼解析',
    'nav.references':    '參考資源',

    /* ---- overview ---- */
    'overview.title':    'PEI Shadow 流程概述',
    'overview.subtitle': '理解 PEI 階段從 Flash 到 RAM 的遷移過程',

    'overview.what.title': '什麼是 PEI Shadow？',
    'overview.what.desc':  'PEI（Pre-EFI Initialization）Shadow 是 UEFI 開機流程中的關鍵步驟。在永久記憶體（DRAM）初始化完成後，PEI Core 將自身從 Flash ROM 複製（Shadow）到 DRAM 中執行，以獲得更快的執行速度和完整的讀寫能力。',

    'overview.why.title': '為什麼需要 Shadow？',
    'overview.why.desc':  'Flash ROM 是唯讀且存取速度慢的。在 DRAM 可用之前，PEI Core 必須在 Flash 上就地執行（XIP），並使用 Cache as RAM（CAR）作為臨時記憶體。一旦 DRAM 初始化完成，將 PEI Core 搬移到 DRAM 可以大幅提升效能。',

    'overview.when.title': '何時發生 Shadow？',
    'overview.when.desc':  'Shadow 發生在 Memory Init PEIM 完成 DRAM 訓練並呼叫 PeiInstallPeiMemory() 之後。PEI Core 收到通知後，立即開始搬移流程，包括複製自身、遷移堆疊和 HOB 列表，然後從新的 DRAM 位址重新進入。',

    /* ---- phase timeline ---- */
    'phase.sec':      'SEC 階段',
    'phase.pei.pre':  'PEI（記憶體前）',
    'phase.shadow':   'Shadow 轉換',
    'phase.pei.post': 'PEI（記憶體後）',
    'phase.dxe':      'DXE 階段',

    /* ---- architecture ---- */
    'arch.title':    '記憶體架構',
    'arch.subtitle': '了解 PEI 階段涉及的三種記憶體區域',

    'arch.flash.title': 'Flash ROM',
    'arch.flash.desc':  '儲存韌體映像的非揮發性記憶體。PEI Core 和 PEIMs 最初從這裡就地執行（XIP）。存取速度慢，且為唯讀。',
    'arch.car.title':   'Cache as RAM（CAR）',
    'arch.car.desc':    '在永久記憶體可用之前，CPU 快取被配置為臨時 RAM。提供少量空間（通常 256 KB – 1 MB）用於堆疊、堆積和 HOB 列表。',
    'arch.dram.title':  '永久記憶體（DRAM）',
    'arch.dram.desc':   '系統主記憶體，由 Memory Init PEIM 初始化。初始化完成後成為 PEI Core 和後續 PEIMs 的執行環境。',

    'arch.flash.bfv':     '開機韌體卷（BFV）',
    'arch.flash.sec':     'SEC Core',
    'arch.flash.peicore': 'PEI Core',
    'arch.flash.peims':   'PEIMs',
    'arch.flash.dxefv':   'DXE 韌體卷',

    'arch.car.stack': '堆疊（Stack）',
    'arch.car.heap':  '堆積（Heap）',
    'arch.car.hob':   'HOB 列表',
    'arch.car.ppidb': 'PPI 資料庫',

    'arch.dram.empty':   '（未初始化）',
    'arch.dram.peicore': 'PEI Core（Shadow）',
    'arch.dram.stack':   '新堆疊',
    'arch.dram.hob':     '新 HOB 列表',
    'arch.dram.peims':   'PEIMs（已載入）',
    'arch.dram.free':    '可用空間',

    /* ---- flow ---- */
    'flow.title':      'Shadow 流程',
    'flow.subtitle':   '逐步了解 PEI Shadow 的完整過程',
    'flow.step.label': '步驟',
    'flow.step.of':    '/',

    'flow.step1.title':  'SEC → PEI 交接',
    'flow.step1.desc':   'SEC 階段初始化 CAR（透過 MTRR 設定 CPU 快取為 No-Eviction Mode），在 BFV 中找到 PEI Core 入口點，建立 SecCoreData 結構（包含臨時 RAM 資訊），然後將控制權轉交給 PEI Core。',
    'flow.step1.detail': 'SEC 透過 Reset Vector 開始執行，進入保護模式，設定臨時記憶體環境。',

    'flow.step2.title':  'PEI Core 初始化（XIP）',
    'flow.step2.desc':   'PEI Core 從 Flash 就地執行（eXecute In Place）。使用 CAR 空間建立堆疊和堆積，初始化 PPI 資料庫和 HOB 列表。此時所有程式碼都從 Flash 讀取執行，資料儲存在 CAR 中。',
    'flow.step2.detail': 'XIP 表示程式碼直接從 Flash 位址空間讀取並執行，無需複製到 RAM。',

    'flow.step3.title':  '記憶體前 PEIM 分派',
    'flow.step3.desc':   'PEI Dispatcher 開始從 BFV 中尋找和執行 PEIMs。這些 PEIM 以 XIP 模式執行，主要包括 CPU 初始化、晶片組早期配置等。每個 PEIM 可以安裝 PPI 供其他模組使用。',
    'flow.step3.detail': 'Dispatcher 使用 Dependency Expression（DEPEX）確定 PEIM 的執行順序。',

    'flow.step4.title':  '記憶體探索（Memory Init）',
    'flow.step4.desc':   'Memory Init PEIM（如 Intel MRC）執行 DRAM 訓練和初始化。完成後呼叫 PeiInstallPeiMemory() 註冊可用的永久記憶體範圍。這會觸發 gEfiPeiMemoryDiscoveredPpiGuid 通知。',
    'flow.step4.detail': 'DRAM 訓練包括：通道偵測、時序校準、電壓調整、ECC 設定等。',

    'flow.step5.title':  'PEI Core Shadow 複製',
    'flow.step5.desc':   'PEI Core 收到永久記憶體通知後，將自身從 Flash（BFV）複製到 DRAM。複製包括 PEI Core 的完整映像。新的副本位於 DRAM 中較高的位址區域。',
    'flow.step5.detail': 'Shadow 複製使用 CopyMem 將 PEI Core FV 從 Flash 位址複製到 DRAM 位址。',

    'flow.step6.title':  '堆疊與 HOB 遷移',
    'flow.step6.desc':   '將堆疊從 CAR 遷移到 DRAM 中的新位置。同時，HOB（Hand-Off Block）列表也從 CAR 堆積遷移到 DRAM。所有在 CAR 中的資料結構都需要搬移到永久記憶體。',
    'flow.step6.detail': '遷移過程中需要保持堆疊內容的完整性，並更新堆疊指標。',

    'flow.step7.title':  '指標修正（Fixup）',
    'flow.step7.desc':   '由於程式碼和資料移動到了新位址，所有內部指標都需要修正。包括 HOB 列表中的指標、PPI 資料庫中的指標、以及堆疊中的返回位址。修正值 = 新位址 − 舊位址。',
    'flow.step7.detail': '指標修正是 Shadow 過程中最容易出錯的部分，必須確保所有引用都已更新。',

    'flow.step8.title':  'PEI Core 重新進入',
    'flow.step8.desc':   'PEI Core 切換到 DRAM 中的新堆疊，然後跳轉到 DRAM 中 PEI Core 的新入口點。從這一刻起，PEI Core 完全從 DRAM 執行，不再依賴 Flash 或 CAR。',
    'flow.step8.detail': '重新進入後，CAR 可以被關閉（Tear Down），CPU 快取恢復正常模式。',

    'flow.step9.title':  '記憶體後分派與 DXE 交接',
    'flow.step9.desc':   'PEI Core 在 DRAM 中繼續分派剩餘的 PEIMs。這些 PEIM 可以載入到 DRAM 中執行（不再需要 XIP）。最終，DXE IPL PEIM 被分派，它找到 DXE Core 並將控制權轉交給 DXE 階段。',
    'flow.step9.detail': 'HOB 列表作為 PEI → DXE 的主要資訊傳遞機制。',

    /* ---- fixup ---- */
    'fixup.title':    '指標修正詳解',
    'fixup.subtitle': '了解 Shadow 後的位址轉換',
    'fixup.desc':     '當 PEI Core 從 Flash 複製到 DRAM 時，所有內部指標仍然指向舊的 Flash / CAR 位址。指標修正（Fixup）過程將這些指標更新為新的 DRAM 位址。',
    'fixup.formula':  '新指標 = 舊指標 + (DRAM 基址 − Flash 基址)',
    'fixup.hob.title': 'HOB 列表指標修正',
    'fixup.hob.desc':  'HOB 列表是一個鏈結串列。每個 HOB 的 Next 指標都需要從 CAR 位址更新為 DRAM 位址。',
    'fixup.ppi.title': 'PPI 資料庫指標修正',
    'fixup.ppi.desc':  'PPI 描述子中的 GUID 指標和介面指標需要更新。指向 Flash 中 PEIM 的 PPI 指標保持不變，指向 CAR 中資料的指標需要修正。',
    'fixup.stack.title': '堆疊指標修正',
    'fixup.stack.desc':  '堆疊中的返回位址和框架指標需要根據 PEI Core 在 DRAM 中的新位址進行調整。',

    /* ---- code ---- */
    'code.title':    '關鍵程式碼解析',
    'code.subtitle': 'EDK2 原始碼中 PEI Shadow 的核心實作',
    'code.install.title': 'PeiInstallPeiMemory()',
    'code.install.desc':  '由 Memory Init PEIM 呼叫，註冊永久記憶體。這是觸發 Shadow 流程的起點。',
    'code.shadow.title':  'PeiCore Shadow 邏輯',
    'code.shadow.desc':   'PEI Core 主函式中處理 Shadow 的核心邏輯。檢查是否有永久記憶體，如果有則執行搬移。',
    'code.migrate.title': '堆疊遷移',
    'code.migrate.desc':  '將堆疊從 CAR 遷移到永久記憶體的關鍵流程。',

    /* ---- references ---- */
    'ref.title':          '參考資源',
    'ref.subtitle':       '深入學習 PEI Shadow 流程的相關資料',
    'ref.spec':           'PI 規格書',
    'ref.spec.desc':      'UEFI Platform Initialization 規格書 Volume 1：PEI Core Interface',
    'ref.edk2':           'EDK2 原始碼',
    'ref.edk2.desc':      'PeiMain — PEI Core 實作原始碼',
    'ref.edk2.dispatch':  'PEI Dispatcher',
    'ref.edk2.dispatch.desc': 'PEI Dispatcher 分派器原始碼',
    'ref.mem':            'MdeModulePkg',
    'ref.mem.desc':       'PEI 記憶體管理相關模組',
},

/* ================================================================ */

'en': {
    'page.title': 'PEI Shadow Process Visualization',

    /* ---- nav ---- */
    'nav.back':          '\u2190 Back to Tools',
    'nav.overview':      'Overview',
    'nav.architecture':  'Architecture',
    'nav.flow':          'Shadow Flow',
    'nav.fixup':         'Pointer Fixup',
    'nav.code':          'Code',
    'nav.references':    'References',

    /* ---- overview ---- */
    'overview.title':    'PEI Shadow Process Overview',
    'overview.subtitle': 'Understanding the PEI Core migration from Flash to RAM',

    'overview.what.title': 'What is PEI Shadow?',
    'overview.what.desc':  'PEI (Pre-EFI Initialization) Shadow is a critical step in the UEFI boot process. After permanent memory (DRAM) is initialized, PEI Core copies (shadows) itself from Flash ROM to DRAM for faster execution speed and full read/write capability.',

    'overview.why.title': 'Why Shadow?',
    'overview.why.desc':  'Flash ROM is read-only and slow to access. Before DRAM is available, PEI Core must execute in place (XIP) on Flash, using Cache as RAM (CAR) as temporary memory. Once DRAM is initialized, moving PEI Core to DRAM significantly improves performance.',

    'overview.when.title': 'When Does Shadow Happen?',
    'overview.when.desc':  'Shadow occurs after the Memory Init PEIM completes DRAM training and calls PeiInstallPeiMemory(). PEI Core then begins the migration: copying itself, migrating the stack and HOB list, then re-entering from the new DRAM address.',

    /* ---- phase timeline ---- */
    'phase.sec':      'SEC Phase',
    'phase.pei.pre':  'PEI (Pre-Memory)',
    'phase.shadow':   'Shadow Transition',
    'phase.pei.post': 'PEI (Post-Memory)',
    'phase.dxe':      'DXE Phase',

    /* ---- architecture ---- */
    'arch.title':    'Memory Architecture',
    'arch.subtitle': 'The three memory regions involved in the PEI phase',

    'arch.flash.title': 'Flash ROM',
    'arch.flash.desc':  'Non-volatile memory storing the firmware image. PEI Core and PEIMs initially execute in place (XIP) from here. Slow access speed, read-only.',
    'arch.car.title':   'Cache as RAM (CAR)',
    'arch.car.desc':    'Before permanent memory is available, CPU cache is configured as temporary RAM. Provides limited space (typically 256 KB \u2013 1 MB) for stack, heap, and HOB list.',
    'arch.dram.title':  'Permanent Memory (DRAM)',
    'arch.dram.desc':   'System main memory, initialized by the Memory Init PEIM. After initialization it becomes the execution environment for PEI Core and subsequent PEIMs.',

    'arch.flash.bfv':     'Boot Firmware Volume (BFV)',
    'arch.flash.sec':     'SEC Core',
    'arch.flash.peicore': 'PEI Core',
    'arch.flash.peims':   'PEIMs',
    'arch.flash.dxefv':   'DXE Firmware Volume',

    'arch.car.stack': 'Stack',
    'arch.car.heap':  'Heap',
    'arch.car.hob':   'HOB List',
    'arch.car.ppidb': 'PPI Database',

    'arch.dram.empty':   '(Uninitialized)',
    'arch.dram.peicore': 'PEI Core (Shadowed)',
    'arch.dram.stack':   'New Stack',
    'arch.dram.hob':     'New HOB List',
    'arch.dram.peims':   'PEIMs (Loaded)',
    'arch.dram.free':    'Free Space',

    /* ---- flow ---- */
    'flow.title':      'Shadow Flow',
    'flow.subtitle':   'Step-by-step walkthrough of the PEI Shadow process',
    'flow.step.label': 'Step',
    'flow.step.of':    '/',

    'flow.step1.title':  'SEC \u2192 PEI Handoff',
    'flow.step1.desc':   'SEC phase initializes CAR (configures CPU cache to No-Eviction Mode via MTRR), locates PEI Core entry point in BFV, creates the SecCoreData structure (containing temp RAM info), then transfers control to PEI Core.',
    'flow.step1.detail': 'SEC starts execution from Reset Vector, enters protected mode, and sets up the temporary memory environment.',

    'flow.step2.title':  'PEI Core Initialization (XIP)',
    'flow.step2.desc':   'PEI Core executes in place (eXecute In Place) from Flash. Uses CAR space to set up stack and heap, initializes PPI database and HOB list. All code reads from Flash; data is stored in CAR.',
    'flow.step2.detail': 'XIP means code is read and executed directly from the Flash address space without being copied to RAM.',

    'flow.step3.title':  'Pre-Memory PEIM Dispatch',
    'flow.step3.desc':   'PEI Dispatcher begins finding and executing PEIMs from BFV. These PEIMs run in XIP mode for CPU initialization, chipset early configuration, etc. Each PEIM can install PPIs for other modules to consume.',
    'flow.step3.detail': 'The Dispatcher uses Dependency Expressions (DEPEX) to determine PEIM execution order.',

    'flow.step4.title':  'Memory Discovery (Memory Init)',
    'flow.step4.desc':   'Memory Init PEIM (e.g. Intel MRC) performs DRAM training and initialization. Upon completion it calls PeiInstallPeiMemory() to register the available permanent memory range, triggering gEfiPeiMemoryDiscoveredPpiGuid notification.',
    'flow.step4.detail': 'DRAM training includes channel detection, timing calibration, voltage adjustment, ECC configuration, etc.',

    'flow.step5.title':  'PEI Core Shadow Copy',
    'flow.step5.desc':   'PEI Core receives the permanent memory notification and copies itself from Flash (BFV) to DRAM. The copy includes the complete PEI Core image. The new copy resides in the upper address region of DRAM.',
    'flow.step5.detail': 'Shadow copy uses CopyMem to transfer the PEI Core FV from its Flash address to a DRAM address.',

    'flow.step6.title':  'Stack & HOB Migration',
    'flow.step6.desc':   'The stack migrates from CAR to a new location in DRAM. The HOB (Hand-Off Block) list also migrates from the CAR heap to DRAM. All data structures in CAR must be moved to permanent memory.',
    'flow.step6.detail': 'The migration must preserve stack content integrity and update the stack pointer.',

    'flow.step7.title':  'Pointer Fixup',
    'flow.step7.desc':   'Since code and data have moved to new addresses, all internal pointers must be fixed up. This includes pointers in the HOB list, PPI database, and return addresses on the stack. Fixup delta = new address \u2212 old address.',
    'flow.step7.detail': 'Pointer fixup is the most error-prone part of the shadow process; every reference must be updated.',

    'flow.step8.title':  'PEI Core Re-entry',
    'flow.step8.desc':   'PEI Core switches to the new stack in DRAM, then jumps to the new PEI Core entry point in DRAM. From this moment PEI Core executes entirely from DRAM, no longer depending on Flash or CAR.',
    'flow.step8.detail': 'After re-entry CAR can be torn down and the CPU cache returns to normal mode.',

    'flow.step9.title':  'Post-Shadow Dispatch & DXE Handoff',
    'flow.step9.desc':   'PEI Core continues dispatching remaining PEIMs from DRAM. These PEIMs can be loaded into DRAM for execution (no longer XIP). Finally the DXE IPL PEIM is dispatched, locating DXE Core and transferring control to the DXE phase.',
    'flow.step9.detail': 'The HOB list serves as the primary information-passing mechanism from PEI to DXE.',

    /* ---- fixup ---- */
    'fixup.title':      'Pointer Fixup Details',
    'fixup.subtitle':   'Understanding post-shadow address translation',
    'fixup.desc':       'When PEI Core is copied from Flash to DRAM, all internal pointers still reference old Flash / CAR addresses. The fixup process updates them to new DRAM addresses.',
    'fixup.formula':    'NewPtr = OldPtr + (DRAM_Base \u2212 Flash_Base)',
    'fixup.hob.title':  'HOB List Pointer Fixup',
    'fixup.hob.desc':   'The HOB list is a linked list. Each HOB\u2019s Next pointer must be updated from its CAR address to the corresponding DRAM address.',
    'fixup.ppi.title':  'PPI Database Pointer Fixup',
    'fixup.ppi.desc':   'GUID pointers and interface pointers in PPI descriptors need updating. PPI pointers to PEIMs in Flash remain unchanged; pointers to data in CAR must be fixed.',
    'fixup.stack.title': 'Stack Pointer Fixup',
    'fixup.stack.desc':  'Return addresses and frame pointers on the stack must be adjusted based on PEI Core\u2019s new location in DRAM.',

    /* ---- code ---- */
    'code.title':         'Key Code Analysis',
    'code.subtitle':      'Core PEI Shadow implementation in EDK2 source',
    'code.install.title': 'PeiInstallPeiMemory()',
    'code.install.desc':  'Called by the Memory Init PEIM to register permanent memory. This is the trigger point for the Shadow process.',
    'code.shadow.title':  'PeiCore Shadow Logic',
    'code.shadow.desc':   'Core shadow logic inside the PEI Core main function. Checks for permanent memory availability and performs migration.',
    'code.migrate.title': 'Stack Migration',
    'code.migrate.desc':  'Key flow for migrating the stack from CAR to permanent memory.',

    /* ---- references ---- */
    'ref.title':          'References',
    'ref.subtitle':       'Resources for deeper learning about PEI Shadow',
    'ref.spec':           'PI Specification',
    'ref.spec.desc':      'UEFI Platform Initialization Specification Volume 1: PEI Core Interface',
    'ref.edk2':           'EDK2 Source',
    'ref.edk2.desc':      'PeiMain \u2014 PEI Core implementation source',
    'ref.edk2.dispatch':  'PEI Dispatcher',
    'ref.edk2.dispatch.desc': 'PEI Dispatcher implementation source code',
    'ref.mem':            'MdeModulePkg',
    'ref.mem.desc':       'PEI memory-management related modules',
}
};

/* ------------------------------------------------------------------ */
/*  Runtime helpers                                                    */
/* ------------------------------------------------------------------ */

let currentLang = 'zh-TW';

function t(key, params) {
    let text = (translations[currentLang] && translations[currentLang][key])
            || translations.en[key]
            || key;
    if (params) {
        Object.keys(params).forEach(function (p) {
            text = text.replace('{' + p + '}', params[p]);
        });
    }
    return text;
}

function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t(key);
        } else {
            el.innerHTML = t(key);
        }
    });
    document.title = t('page.title');
}

function setLanguage(lang) {
    currentLang = translations[lang] ? lang : 'en';
    localStorage.setItem('uefi-viz-lang', currentLang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    updatePageTranslations();

    /* Re-render dynamic content */
    if (typeof renderArchDiagram  === 'function') renderArchDiagram();
    if (typeof renderFlowStep     === 'function') renderFlowStep(typeof currentFlowStep !== 'undefined' ? currentFlowStep : 0);
    if (typeof renderFixupDiagram === 'function') renderFixupDiagram();
}

function initI18n() {
    var saved = localStorage.getItem('uefi-viz-lang') || 'zh-TW';
    setLanguage(saved);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });
}
