/* ------------------------------------------------------------------ */
/*  UEFI Protocol Services Visualizer – i18n                           */
/*  Bilingual: English (en) + Traditional Chinese (zh-TW)              */
/* ------------------------------------------------------------------ */

const translations = {
'zh-TW': {
    'page.title': 'UEFI Protocol 服務視覺化',

    /* ---- nav ---- */
    'nav.back':         '← 返回工具列表',
    'nav.overview':     '概述',
    'nav.structs':      '資料結構',
    'nav.open':         'OpenProtocol',
    'nav.attributes':   '屬性比較',
    'nav.handle':       'HandleProtocol',
    'nav.locate':       'LocateProtocol',
    'nav.locatebuf':    'LocateHandleBuffer',
    'nav.patterns':     '常見模式',
    'nav.code':         '程式碼解析',
    'nav.references':   '參考資源',

    /* ---- overview ---- */
    'overview.title':    'UEFI Protocol Services 概述',
    'overview.subtitle': '理解 EDK2 中如何存取和查詢 Handle Database 上的 Protocol 介面',

    'overview.what.title': '什麼是 Protocol Services？',
    'overview.what.desc':  'Protocol Services 是 UEFI Boot Services Table 中一組用來發現和存取 Protocol 介面的 API。它們是驅動程式與硬體、驅動程式與驅動程式之間溝通的核心橋樑。每個 Protocol 以 GUID 識別，安裝在 Handle 上，透過這些服務讀取。',

    'overview.why.title': '為什麼有 4 個不同的函式？',
    'overview.why.desc':  'EFI 1.0 僅有 HandleProtocol；UEFI 2.0 引入了 OpenProtocol 以支援驅動程式模型的排他性開啟與追蹤機制。LocateProtocol 簡化了查找系統全域單例（singleton）協定的流程，而 LocateHandleBuffer 提供了一次取得所有匹配 Handle 的便利方式。四個函式在不同場景各有最佳用途。',

    'overview.open.title': 'OpenProtocol',
    'overview.open.desc':  '最完整的協定存取函式。支援 6 種開啟屬性（Attributes），可追蹤誰開啟了哪個協定，支援排他性存取和衝突偵測。UEFI 驅動程式模型的標準用法。',
    'overview.handle.title': 'HandleProtocol',
    'overview.handle.desc':  'EFI 1.0 的簡化版。等同於 OpenProtocol 加 BY_HANDLE_PROTOCOL 屬性。無法追蹤開啟者身份，不建議在 UEFI 驅動程式模型中使用。',
    'overview.locate.title': 'LocateProtocol',
    'overview.locate.desc':  '在整個 Handle Database 中找到第一個安裝了指定 GUID 協定的 Handle，直接返回 Interface 指標。最適合查找系統全域的單例協定。',
    'overview.locatebuf.title': 'LocateHandleBuffer',
    'overview.locatebuf.desc':  '找出所有安裝了指定協定的 Handle，配置並回傳一個 EFI_HANDLE 陣列。呼叫者必須 FreePool 回傳的緩衝區。用於列舉所有符合條件的設備。',

    /* ---- structs ---- */
    'structs.title':    '核心資料結構',
    'structs.subtitle': '理解 DXE Core 如何在記憶體中追蹤協定的開啟記錄',

    'structs.opd.desc':  '每次 OpenProtocol 呼叫（除 TEST_PROTOCOL 外）都會建立一筆 OPEN_PROTOCOL_DATA 記錄，掛在 PROTOCOL_INTERFACE.OpenList 上。它記錄了「誰（AgentHandle）」以「哪種模式（Attributes）」開啟了這個協定介面，以及「在哪個控制器（ControllerHandle）」的上下文中。',
    'structs.opd.sig':   'Signature：驗證用魔法數字',
    'structs.opd.link':  'Link：連接到 PROTOCOL_INTERFACE.OpenList 的 LIST_ENTRY',
    'structs.opd.agent': 'AgentHandle：開啟此協定的驅動程式映像句柄',
    'structs.opd.ctrl':  'ControllerHandle：被管理的控制器句柄（BY_DRIVER 時使用）',
    'structs.opd.attr':  'Attributes：開啟模式（BY_DRIVER, EXCLUSIVE, BY_CHILD_CONTROLLER 等）',
    'structs.opd.cnt':   'OpenCount：參考計數',

    'structs.pi.desc':   'PROTOCOL_INTERFACE 代表「某個 Handle 上安裝了某個協定」的記錄。其 OpenList 欄位是所有開啟此協定的消費者追蹤串列的頭部。',
    'structs.pi.openlist':'OpenList：所有 OPEN_PROTOCOL_DATA 記錄組成的串列頭部',

    'structs.diagram.title': 'OpenProtocol 追蹤鏈',
    'structs.diagram.desc':  'IHANDLE.Protocols → PROTOCOL_INTERFACE → OPEN_PROTOCOL_DATA 鏈。DXE Core 透過此鏈確認哪些驅動程式正在使用哪些協定，並在 DisconnectController 時據此決定需要 Stop 哪些驅動程式。',

    /* ---- open protocol ---- */
    'open.title':    'OpenProtocol 逐步流程',
    'open.subtitle': '觀察 DXE Core 如何處理每種開啟屬性，以及 OPEN_PROTOCOL_DATA 如何被建立',

    'open.step1.title': '步驟 1：初始狀態',
    'open.step1.desc':  '一個設備 Handle 上已安裝了 EFI_DEVICE_PATH_PROTOCOL 和 EFI_PCI_IO_PROTOCOL。右方有一個 USB 驅動程式的 Driver Handle。目前 PCI IO 協定的 OpenList 為空，沒有任何驅動程式開啟過它。',
    'open.step2.title': '步驟 2：CoreOpenProtocol() 被呼叫',
    'open.step2.desc':  '驅動程式呼叫 gBS->OpenProtocol(Handle, &gEfiPciIoProtocolGuid, &PciIo, DriverHandle, ControllerHandle, Attributes)。DXE Core 進入 CoreOpenProtocol()，首先取得 CoreAcquireProtocolLock() 確保執行緒安全。',
    'open.step3.title': '步驟 3：驗證 Handle',
    'open.step3.desc':  'CoreValidateHandle() 檢查傳入的 Handle 指標是否為有效的 IHANDLE：驗證 Signature 欄位是否等於 EFI_HANDLE_SIGNATURE (\'hand\')。若無效，回傳 EFI_INVALID_PARAMETER。',
    'open.step4.title': '步驟 4：查找 PROTOCOL_INTERFACE',
    'open.step4.desc':  'DXE Core 遍歷 IHANDLE.Protocols 串列，比對每個 PROTOCOL_INTERFACE 的 Protocol→ProtocolID (GUID)。找到 EFI_PCI_IO_PROTOCOL 的 PROTOCOL_INTERFACE 節點。若找不到指定 GUID，回傳 EFI_UNSUPPORTED。',
    'open.step5.title': '步驟 5：簡單屬性 — BY_HANDLE_PROTOCOL / GET_PROTOCOL / TEST_PROTOCOL',
    'open.step5.desc':  'BY_HANDLE_PROTOCOL：建立 OPEN_PROTOCOL_DATA（AgentHandle=呼叫者映像），不做排他性檢查。GET_PROTOCOL：僅限 Core 內部使用，建立記錄。TEST_PROTOCOL：不回傳 Interface 指標，不建立任何記錄，僅確認協定存在即回傳 EFI_SUCCESS。',
    'open.step6.title': '步驟 6：BY_DRIVER — 排他性衝突檢查',
    'open.step6.desc':  'Core 掃描目標 PROTOCOL_INTERFACE 的 OpenList：若已有另一筆 BY_DRIVER 記錄（AgentHandle 不同），且該代理仍然有效，則回傳 EFI_ACCESS_DENIED。這確保同一控制器上同一協定只被一個驅動程式以 BY_DRIVER 模式開啟。若無衝突，建立新的 OPEN_PROTOCOL_DATA(BY_DRIVER)。',
    'open.step7.title': '步驟 7：EXCLUSIVE — 斷開現有驅動程式並接管',
    'open.step7.desc':  'EXCLUSIVE 屬性更為強力：若發現已有 BY_DRIVER 記錄，Core 先呼叫 CoreDisconnectController() 將現有驅動程式斷開（觸發其 Stop()），然後以 EXCLUSIVE 模式建立新的 OPEN_PROTOCOL_DATA。這主要用於 Platform Driver Override Protocol 等場景。',
    'open.step8.title': '步驟 8：BY_CHILD_CONTROLLER — 匯流排驅動程式子句柄追蹤',
    'open.step8.desc':  '匯流排驅動程式（如 PCI Bus Driver）在子句柄上開啟父句柄的協定時使用此屬性。AgentHandle = 匯流排驅動程式映像，ControllerHandle = 子句柄。Core 建立 OPEN_PROTOCOL_DATA 記錄此父子關係，DisconnectController 時可據此先停止子句柄。',

    /* ---- attributes ---- */
    'attr.title':    'OpenProtocol 六種屬性完整比較',
    'attr.subtitle': '每種屬性的行為差異、追蹤記錄、排他性、及典型使用場景',

    'attr.col.attribute': '屬性',
    'attr.col.tracking':  '建立追蹤記錄',
    'attr.col.exclusive': '排他性檢查',
    'attr.col.disconnect':'斷開現有驅動',
    'attr.col.typical':   '典型使用者',
    'attr.col.example':   '實際用例',

    'attr.byhandle.name': 'BY_HANDLE_PROTOCOL',
    'attr.byhandle.tracking': '是 (AgentHandle=NULL)',
    'attr.byhandle.exclusive': '否',
    'attr.byhandle.disconnect': '否',
    'attr.byhandle.typical': '應用程式、Shell',
    'attr.byhandle.example': 'HandleProtocol() 內部',

    'attr.get.name': 'GET_PROTOCOL',
    'attr.get.tracking': '是 (AgentHandle=映像)',
    'attr.get.exclusive': '否',
    'attr.get.disconnect': '否',
    'attr.get.typical': 'DXE Core 內部',
    'attr.get.example': 'Core 內部服務',

    'attr.test.name': 'TEST_PROTOCOL',
    'attr.test.tracking': '否',
    'attr.test.exclusive': '否',
    'attr.test.disconnect': '否',
    'attr.test.typical': '快速存在確認',
    'attr.test.example': '檢查協定是否已安裝',

    'attr.bydriver.name': 'BY_DRIVER',
    'attr.bydriver.tracking': '是（完整追蹤）',
    'attr.bydriver.exclusive': '是 — 已占用時阻止',
    'attr.bydriver.disconnect': '否',
    'attr.bydriver.typical': 'UEFI 驅動程式',
    'attr.bydriver.example': 'Supported() / Start()',

    'attr.bychild.name': 'BY_CHILD_CONTROLLER',
    'attr.bychild.tracking': '是（子句柄追蹤）',
    'attr.bychild.exclusive': '否',
    'attr.bychild.disconnect': '否',
    'attr.bychild.typical': '匯流排驅動程式',
    'attr.bychild.example': 'PCI Bus / USB Bus',

    'attr.exclusive.name': 'EXCLUSIVE',
    'attr.exclusive.tracking': '是（完整追蹤）',
    'attr.exclusive.exclusive': '是 — 斷開後接管',
    'attr.exclusive.disconnect': '是',
    'attr.exclusive.typical': '特殊覆蓋',
    'attr.exclusive.example': 'Platform Driver Override',

    /* ---- handle protocol ---- */
    'handlep.title':    'HandleProtocol — 簡化包裝',
    'handlep.subtitle': '理解 HandleProtocol 是 OpenProtocol 的 Legacy 封裝',
    'handlep.desc':     'HandleProtocol() 是 EFI 1.0 原始 API。在 UEFI 2.x 中，它的內部實作僅是對 OpenProtocol() 的一層薄包裝，使用 BY_HANDLE_PROTOCOL 屬性。',
    'handlep.equiv':    '等效呼叫',
    'handlep.equiv.desc': 'HandleProtocol(Handle, Protocol, &Interface) 在 DXE Core 內部等同於：OpenProtocol(Handle, Protocol, &Interface, gDxeCoreImageHandle, NULL, EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL)',
    'handlep.warn.title': '為什麼不建議在驅動程式中使用？',
    'handlep.warn.desc':  'HandleProtocol 不提供 AgentHandle/ControllerHandle 追蹤資訊。DisconnectController 無法識別協定的使用者，導致系統在嘗試拆除驅動程式綁定時，無法正確通知相關驅動程式執行清理。在 UEFI 驅動程式模型中，應始終使用 OpenProtocol(BY_DRIVER)。',

    /* ---- locate protocol ---- */
    'locp.title':    'LocateProtocol 逐步流程',
    'locp.subtitle': '觀察 DXE Core 如何在 gProtocolDatabase 中找到第一個匹配的協定實例',

    'locp.step1.title': '步驟 1：呼叫者需要單例協定',
    'locp.step1.desc':  '驅動程式需要找到系統全域的 EFI_SMM_COMMUNICATION_PROTOCOL。這個協定在系統中只安裝了一個實例（由 PiSmmIpl 驅動程式安裝）。驅動程式呼叫 gBS->LocateProtocol(&gEfiSmmCommunicationProtocolGuid, NULL, &Interface)。',
    'locp.step2.title': '步驟 2：查找 PROTOCOL_ENTRY',
    'locp.step2.desc':  'CoreLocateProtocol() 呼叫 CoreFindProtocolEntry() 在 gProtocolDatabase 串列中尋找匹配 GUID 的 PROTOCOL_ENTRY。此串列串聯系統中所有已知的協定 GUID。',
    'locp.step3.title': '步驟 3：取得第一個 PROTOCOL_INTERFACE',
    'locp.step3.desc':  '從 PROTOCOL_ENTRY.Protocols 串列中取出第一個 PROTOCOL_INTERFACE 節點。此節點的 Interface 欄位指向實際的協定結構實例。',
    'locp.step4.title': '步驟 4：回傳 Interface 指標',
    'locp.step4.desc':  '將 PROTOCOL_INTERFACE.Interface 指標回傳給呼叫者。注意：LocateProtocol 不建立 OPEN_PROTOCOL_DATA 記錄，不追蹤消費者身份。如需追蹤，應先 LocateProtocol 取得 Handle，再用 OpenProtocol(BY_DRIVER) 正式開啟。',

    /* ---- locate handle buffer ---- */
    'locbuf.title':    'LocateHandleBuffer 逐步流程',
    'locbuf.subtitle': '觀察 DXE Core 如何收集所有符合條件的 Handle 並配置回傳緩衝區',

    'locbuf.step1.title': '步驟 1：呼叫者需要列舉裝置',
    'locbuf.step1.desc':  '驅動程式需要找出系統中所有安裝了 EFI_BLOCK_IO_PROTOCOL 的 Handle（代表所有區塊儲存裝置）。呼叫 gBS->LocateHandleBuffer(ByProtocol, &gEfiBlockIoProtocolGuid, NULL, &Count, &Buffer)。',
    'locbuf.step2.title': '步驟 2：第一次呼叫 — 取得所需大小',
    'locbuf.step2.desc':  'CoreLocateHandleBuffer 內部先以 BufferSize=0 呼叫 CoreLocateHandle()。Core 遍歷 PROTOCOL_ENTRY.Protocols 串列計算匹配數量，回傳 EFI_BUFFER_TOO_SMALL 及所需位元組數。',
    'locbuf.step3.title': '步驟 3：配置緩衝區',
    'locbuf.step3.desc':  'CoreLocateHandleBuffer 呼叫 CoreAllocatePool() 配置足夠的記憶體來容納 Handle 陣列。此記憶體由 Boot Services 管理。',
    'locbuf.step4.title': '步驟 4：第二次呼叫 — 填充 Handle 陣列',
    'locbuf.step4.desc':  '以實際緩衝區再次呼叫 CoreLocateHandle()。Core 遍歷 PROTOCOL_ENTRY.Protocols，沿每個 PROTOCOL_INTERFACE.Handle 收集唯一的 IHANDLE 指標，填入緩衝區。',
    'locbuf.step5.title': '步驟 5：回傳結果',
    'locbuf.step5.desc':  '回傳 NumberOfHandles（Handle 總數）和 Buffer（EFI_HANDLE 陣列指標）給呼叫者。重要提醒：呼叫者使用完畢後必須呼叫 gBS->FreePool(Buffer) 釋放此緩衝區，否則造成記憶體洩漏。',

    /* ---- patterns ---- */
    'patterns.title':    '常見使用模式',
    'patterns.subtitle': 'BIOS 工程師在日常開發中最常用的協定服務模式',

    'patterns.supported.title': 'Supported() 檢查模式',
    'patterns.supported.desc':  '在 Supported() 中用 OpenProtocol(BY_DRIVER) 嘗試開啟目標協定，檢查設備屬性後立即 CloseProtocol()。必須為冪等操作，不改變任何狀態。',
    'patterns.start.title': 'Start() 綁定模式',
    'patterns.start.desc':  '在 Start() 中用 OpenProtocol(BY_DRIVER) 正式取得排他性存取權，初始化硬體，安裝新協定。BY_DRIVER 確保不會有其他驅動程式同時管理此控制器。',
    'patterns.singleton.title': '單例查找模式',
    'patterns.singleton.desc':  '使用 LocateProtocol() 查找系統全域的單例協定，如 EFI_VARIABLE_ARCH_PROTOCOL、EFI_SMM_COMMUNICATION_PROTOCOL。這些協定在系統中只有一個實例。',
    'patterns.enumerate.title': '設備列舉模式',
    'patterns.enumerate.desc':  '使用 LocateHandleBuffer(ByProtocol) 取得所有匹配的 Handle，然後對每個 Handle 呼叫 OpenProtocol 取得 Interface。常用於在啟動管理器中列舉所有 Block IO 裝置。',
    'patterns.buschild.title': '匯流排子句柄模式',
    'patterns.buschild.desc':  '匯流排驅動程式在子句柄上使用 OpenProtocol(BY_CHILD_CONTROLLER) 開啟父句柄的協定，建立親子關係追蹤。DisconnectController 據此知道需先停止子句柄。',

    /* ---- code ---- */
    'code.title':    '關鍵程式碼解析',
    'code.subtitle': 'EDK2 DXE Core 中實作協定服務的核心原始碼',

    'code.open.title':     'CoreOpenProtocol() 核心邏輯',
    'code.open.file':      '來源：MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'code.locate.title':   'CoreLocateProtocol() 核心邏輯',
    'code.locate.file':    '來源：MdeModulePkg/Core/Dxe/Hand/Locate.c',
    'code.locbuf.title':   'CoreLocateHandleBuffer() 核心邏輯',
    'code.locbuf.file':    '來源：MdeModulePkg/Core/Dxe/Hand/Locate.c',

    /* ---- references ---- */
    'references.title':  '參考資源',
    'references.desc':   '以下規格文件與原始碼是本頁面的知識來源',

    'ref.uefi.title':       'UEFI Specification 2.10 — Section 7.3: Protocol Handler Services',
    'ref.uefi.desc':        '定義 OpenProtocol、HandleProtocol、LocateProtocol、LocateHandleBuffer 的完整語義和參數。',
    'ref.edk2.handle':      'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'ref.edk2.handle.desc': 'CoreOpenProtocol、CoreHandleProtocol、CoreOpenProtocolInformation 的實作。',
    'ref.edk2.locate':      'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/Locate.c',
    'ref.edk2.locate.desc': 'CoreLocateProtocol、CoreLocateHandle、CoreLocateHandleBuffer 的實作。',
    'ref.edk2.main':        'EDK2 Source: MdeModulePkg/Core/Dxe/DxeMain.h',
    'ref.edk2.main.desc':   'OPEN_PROTOCOL_DATA、PROTOCOL_INTERFACE、PROTOCOL_ENTRY 結構定義。',
    'ref.pi.title':         'UEFI Platform Initialization Specification — Volume 2',
    'ref.pi.desc':          'DXE Core 服務、驅動程式模型、Handle Database 記憶體模型。',

    /* ---- buttons ---- */
    'btn.prev':  '← 上一步',
    'btn.next':  '下一步 →',
    'btn.reset': '重置',

    /* ---- footer ---- */
    'footer.text': 'UEFI Protocol Services 視覺化 | 教育用途',
},

/* ================================================================== */
/*  English                                                             */
/* ================================================================== */
'en': {
    'page.title': 'UEFI Protocol Services Visualizer',

    /* ---- nav ---- */
    'nav.back':         '← Back to Tools',
    'nav.overview':     'Overview',
    'nav.structs':      'Data Structures',
    'nav.open':         'OpenProtocol',
    'nav.attributes':   'Attributes',
    'nav.handle':       'HandleProtocol',
    'nav.locate':       'LocateProtocol',
    'nav.locatebuf':    'LocateHandleBuffer',
    'nav.patterns':     'Patterns',
    'nav.code':         'Code',
    'nav.references':   'References',

    /* ---- overview ---- */
    'overview.title':    'UEFI Protocol Services Overview',
    'overview.subtitle': 'Understanding how EDK2 discovers and accesses protocol interfaces on the Handle Database',

    'overview.what.title': 'What are Protocol Services?',
    'overview.what.desc':  'Protocol Services are a set of APIs in the UEFI Boot Services Table used to discover and access protocol interfaces. They are the core bridge for driver-to-hardware and driver-to-driver communication. Each protocol is identified by a GUID, installed on a Handle, and accessed through these services.',

    'overview.why.title': 'Why 4 different functions?',
    'overview.why.desc':  'EFI 1.0 only had HandleProtocol. UEFI 2.0 introduced OpenProtocol to support the driver model\'s exclusive-open and tracking mechanism. LocateProtocol simplifies finding system-wide singleton protocols, while LocateHandleBuffer provides a convenient way to get all matching handles at once. Each function has its optimal use case.',

    'overview.open.title': 'OpenProtocol',
    'overview.open.desc':  'The most complete protocol access function. Supports 6 open attributes, tracks who opened which protocol, supports exclusive access and conflict detection. The standard function for UEFI driver model drivers.',
    'overview.handle.title': 'HandleProtocol',
    'overview.handle.desc':  'Legacy simplified wrapper from EFI 1.0. Equivalent to OpenProtocol with BY_HANDLE_PROTOCOL attribute. No agent/controller tracking — not recommended for UEFI driver model use.',
    'overview.locate.title': 'LocateProtocol',
    'overview.locate.desc':  'Finds the first handle with a given protocol GUID in the entire Handle Database and returns the interface pointer directly. Best for system-wide singleton protocol lookup.',
    'overview.locatebuf.title': 'LocateHandleBuffer',
    'overview.locatebuf.desc':  'Finds ALL handles with a given protocol, allocates and returns an EFI_HANDLE array. Caller must FreePool the returned buffer. Used for enumerating all matching devices.',

    /* ---- structs ---- */
    'structs.title':    'Core Data Structures',
    'structs.subtitle': 'How the DXE Core tracks protocol open records in memory',

    'structs.opd.desc':  'Every OpenProtocol call (except TEST_PROTOCOL) creates an OPEN_PROTOCOL_DATA record linked to PROTOCOL_INTERFACE.OpenList. It records "who (AgentHandle)" opened this protocol interface with "which mode (Attributes)" and in "which controller context (ControllerHandle)".',
    'structs.opd.sig':   'Signature: magic number for validation',
    'structs.opd.link':  'Link: LIST_ENTRY into PROTOCOL_INTERFACE.OpenList',
    'structs.opd.agent': 'AgentHandle: driver image handle that opened this protocol',
    'structs.opd.ctrl':  'ControllerHandle: the managed controller handle (for BY_DRIVER)',
    'structs.opd.attr':  'Attributes: open mode (BY_DRIVER, EXCLUSIVE, BY_CHILD_CONTROLLER, etc.)',
    'structs.opd.cnt':   'OpenCount: reference count',

    'structs.pi.desc':   'PROTOCOL_INTERFACE represents "a protocol installed on a handle". Its OpenList field is the head of the tracking chain for all consumers of this protocol.',
    'structs.pi.openlist':'OpenList: head of the OPEN_PROTOCOL_DATA list tracking all consumers',

    'structs.diagram.title': 'OpenProtocol Tracking Chain',
    'structs.diagram.desc':  'IHANDLE.Protocols → PROTOCOL_INTERFACE → OPEN_PROTOCOL_DATA chain. DXE Core uses this chain to determine which drivers are using which protocols, and during DisconnectController, which drivers need to be stopped.',

    /* ---- open protocol ---- */
    'open.title':    'OpenProtocol Step-by-Step',
    'open.subtitle': 'Watch how DXE Core processes each open attribute and creates OPEN_PROTOCOL_DATA tracking records',

    'open.step1.title': 'Step 1: Initial State',
    'open.step1.desc':  'A device handle has EFI_DEVICE_PATH_PROTOCOL and EFI_PCI_IO_PROTOCOL installed. A USB driver\'s Driver Handle is on the right. The PCI IO protocol\'s OpenList is currently empty — no driver has opened it yet.',
    'open.step2.title': 'Step 2: CoreOpenProtocol() Called',
    'open.step2.desc':  'The driver calls gBS->OpenProtocol(Handle, &gEfiPciIoProtocolGuid, &PciIo, DriverHandle, ControllerHandle, Attributes). DXE Core enters CoreOpenProtocol(), first acquiring CoreAcquireProtocolLock() for thread safety.',
    'open.step3.title': 'Step 3: Validate Handle',
    'open.step3.desc':  'CoreValidateHandle() checks whether the passed Handle pointer is a valid IHANDLE: verifies Signature field equals EFI_HANDLE_SIGNATURE (\'hand\'). Returns EFI_INVALID_PARAMETER if invalid.',
    'open.step4.title': 'Step 4: Find PROTOCOL_INTERFACE',
    'open.step4.desc':  'DXE Core walks the IHANDLE.Protocols list, comparing each PROTOCOL_INTERFACE\'s Protocol→ProtocolID (GUID). Finds the PROTOCOL_INTERFACE node for EFI_PCI_IO_PROTOCOL. Returns EFI_UNSUPPORTED if the GUID is not found.',
    'open.step5.title': 'Step 5: Simple Attributes — BY_HANDLE_PROTOCOL / GET_PROTOCOL / TEST_PROTOCOL',
    'open.step5.desc':  'BY_HANDLE_PROTOCOL: creates OPEN_PROTOCOL_DATA (AgentHandle=caller image), no exclusive check. GET_PROTOCOL: Core-internal use only, creates record. TEST_PROTOCOL: does NOT return Interface pointer, creates NO record — only confirms protocol exists and returns EFI_SUCCESS.',
    'open.step6.title': 'Step 6: BY_DRIVER — Exclusive Conflict Check',
    'open.step6.desc':  'Core scans the target PROTOCOL_INTERFACE\'s OpenList: if another BY_DRIVER record exists (different AgentHandle) and that agent is still valid, returns EFI_ACCESS_DENIED. This ensures only one driver can BY_DRIVER-open the same protocol on the same controller. If no conflict, creates a new OPEN_PROTOCOL_DATA(BY_DRIVER).',
    'open.step7.title': 'Step 7: EXCLUSIVE — Disconnect Existing Driver and Take Over',
    'open.step7.desc':  'EXCLUSIVE is more aggressive: if an existing BY_DRIVER record is found, Core first calls CoreDisconnectController() to disconnect the current driver (triggering its Stop()), then creates a new OPEN_PROTOCOL_DATA with EXCLUSIVE mode. This is primarily used for Platform Driver Override Protocol scenarios.',
    'open.step8.title': 'Step 8: BY_CHILD_CONTROLLER — Bus Driver Child Tracking',
    'open.step8.desc':  'Bus drivers (e.g. PCI Bus Driver) use this attribute when opening a parent handle\'s protocol on behalf of a child handle. AgentHandle = bus driver image, ControllerHandle = child handle. Core creates OPEN_PROTOCOL_DATA recording this parent-child relationship. DisconnectController can then stop child handles first.',

    /* ---- attributes ---- */
    'attr.title':    'OpenProtocol — All 6 Attributes Compared',
    'attr.subtitle': 'Behavioral differences, tracking records, exclusivity, and typical use cases for each attribute',

    'attr.col.attribute': 'Attribute',
    'attr.col.tracking':  'Creates Tracking',
    'attr.col.exclusive': 'Exclusive Check',
    'attr.col.disconnect':'Disconnects Existing',
    'attr.col.typical':   'Typical User',
    'attr.col.example':   'Real Example',

    'attr.byhandle.name': 'BY_HANDLE_PROTOCOL',
    'attr.byhandle.tracking': 'Yes (AgentHandle=NULL)',
    'attr.byhandle.exclusive': 'No',
    'attr.byhandle.disconnect': 'No',
    'attr.byhandle.typical': 'Applications, Shell',
    'attr.byhandle.example': 'Inside HandleProtocol()',

    'attr.get.name': 'GET_PROTOCOL',
    'attr.get.tracking': 'Yes (AgentHandle=Image)',
    'attr.get.exclusive': 'No',
    'attr.get.disconnect': 'No',
    'attr.get.typical': 'DXE Core internal',
    'attr.get.example': 'Core internal services',

    'attr.test.name': 'TEST_PROTOCOL',
    'attr.test.tracking': 'No',
    'attr.test.exclusive': 'No',
    'attr.test.disconnect': 'No',
    'attr.test.typical': 'Quick existence check',
    'attr.test.example': 'Check if protocol exists',

    'attr.bydriver.name': 'BY_DRIVER',
    'attr.bydriver.tracking': 'Yes (full tracking)',
    'attr.bydriver.exclusive': 'Yes — blocks if taken',
    'attr.bydriver.disconnect': 'No',
    'attr.bydriver.typical': 'UEFI model drivers',
    'attr.bydriver.example': 'Supported() / Start()',

    'attr.bychild.name': 'BY_CHILD_CONTROLLER',
    'attr.bychild.tracking': 'Yes (child tracking)',
    'attr.bychild.exclusive': 'No',
    'attr.bychild.disconnect': 'No',
    'attr.bychild.typical': 'Bus drivers',
    'attr.bychild.example': 'PCI Bus / USB Bus',

    'attr.exclusive.name': 'EXCLUSIVE',
    'attr.exclusive.tracking': 'Yes (full tracking)',
    'attr.exclusive.exclusive': 'Yes — disconnects & takes',
    'attr.exclusive.disconnect': 'Yes',
    'attr.exclusive.typical': 'Special override',
    'attr.exclusive.example': 'Platform Driver Override',

    /* ---- handle protocol ---- */
    'handlep.title':    'HandleProtocol — The Legacy Wrapper',
    'handlep.subtitle': 'Understanding HandleProtocol as a thin wrapper around OpenProtocol',
    'handlep.desc':     'HandleProtocol() is the original EFI 1.0 API. In UEFI 2.x, its implementation is simply a thin wrapper around OpenProtocol() using the BY_HANDLE_PROTOCOL attribute.',
    'handlep.equiv':    'Equivalent Call',
    'handlep.equiv.desc': 'HandleProtocol(Handle, Protocol, &Interface) internally equals: OpenProtocol(Handle, Protocol, &Interface, gDxeCoreImageHandle, NULL, EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL)',
    'handlep.warn.title': 'Why not recommended for drivers?',
    'handlep.warn.desc':  'HandleProtocol provides no AgentHandle/ControllerHandle tracking information. DisconnectController cannot identify protocol consumers, making it unable to properly notify drivers to clean up when tearing down driver bindings. In the UEFI driver model, always use OpenProtocol(BY_DRIVER) instead.',

    /* ---- locate protocol ---- */
    'locp.title':    'LocateProtocol Step-by-Step',
    'locp.subtitle': 'Watch how DXE Core finds the first matching protocol instance in gProtocolDatabase',

    'locp.step1.title': 'Step 1: Caller Needs a Singleton Protocol',
    'locp.step1.desc':  'A driver needs to find the system-wide EFI_SMM_COMMUNICATION_PROTOCOL. This protocol has only one instance in the system (installed by PiSmmIpl). The driver calls gBS->LocateProtocol(&gEfiSmmCommunicationProtocolGuid, NULL, &Interface).',
    'locp.step2.title': 'Step 2: Find PROTOCOL_ENTRY',
    'locp.step2.desc':  'CoreLocateProtocol() calls CoreFindProtocolEntry() to search the gProtocolDatabase linked list for a PROTOCOL_ENTRY matching the requested GUID. This list chains all known protocol GUIDs in the system.',
    'locp.step3.title': 'Step 3: Get First PROTOCOL_INTERFACE',
    'locp.step3.desc':  'From the PROTOCOL_ENTRY.Protocols list, take the first PROTOCOL_INTERFACE node. This node\'s Interface field points to the actual protocol structure instance.',
    'locp.step4.title': 'Step 4: Return Interface Pointer',
    'locp.step4.desc':  'Returns PROTOCOL_INTERFACE.Interface to the caller. Note: LocateProtocol does NOT create OPEN_PROTOCOL_DATA — it does not track consumers. If tracking is needed, first LocateProtocol to get the handle, then use OpenProtocol(BY_DRIVER) to formally open it.',

    /* ---- locate handle buffer ---- */
    'locbuf.title':    'LocateHandleBuffer Step-by-Step',
    'locbuf.subtitle': 'Watch how DXE Core collects all matching handles and allocates the return buffer',

    'locbuf.step1.title': 'Step 1: Caller Needs to Enumerate Devices',
    'locbuf.step1.desc':  'A driver needs to find all handles with EFI_BLOCK_IO_PROTOCOL (representing all block storage devices). It calls gBS->LocateHandleBuffer(ByProtocol, &gEfiBlockIoProtocolGuid, NULL, &Count, &Buffer).',
    'locbuf.step2.title': 'Step 2: First Pass — Get Required Size',
    'locbuf.step2.desc':  'CoreLocateHandleBuffer internally calls CoreLocateHandle() with BufferSize=0. Core walks the PROTOCOL_ENTRY.Protocols chain counting matching handles, returns EFI_BUFFER_TOO_SMALL with the required byte count.',
    'locbuf.step3.title': 'Step 3: Allocate Buffer',
    'locbuf.step3.desc':  'CoreLocateHandleBuffer calls CoreAllocatePool() to allocate enough memory for the handle array. This memory is managed by Boot Services.',
    'locbuf.step4.title': 'Step 4: Second Pass — Fill Handle Array',
    'locbuf.step4.desc':  'Calls CoreLocateHandle() again with the actual buffer. Core walks PROTOCOL_ENTRY.Protocols, follows each PROTOCOL_INTERFACE.Handle pointer to collect unique IHANDLE pointers into the buffer.',
    'locbuf.step5.title': 'Step 5: Return Results',
    'locbuf.step5.desc':  'Returns NumberOfHandles (total count) and Buffer (EFI_HANDLE array pointer) to the caller. Important: Caller MUST call gBS->FreePool(Buffer) after use, otherwise this causes a memory leak.',

    /* ---- patterns ---- */
    'patterns.title':    'Common Usage Patterns',
    'patterns.subtitle': 'The most frequently used protocol service patterns in daily BIOS development',

    'patterns.supported.title': 'Supported() Check Pattern',
    'patterns.supported.desc':  'In Supported(), use OpenProtocol(BY_DRIVER) to tentatively open the target protocol, check device properties, then immediately CloseProtocol(). Must be idempotent — no state changes allowed.',
    'patterns.start.title': 'Start() Binding Pattern',
    'patterns.start.desc':  'In Start(), use OpenProtocol(BY_DRIVER) to formally acquire exclusive access, initialize hardware, install new protocols. BY_DRIVER ensures no other driver can simultaneously manage this controller.',
    'patterns.singleton.title': 'Singleton Lookup Pattern',
    'patterns.singleton.desc':  'Use LocateProtocol() to find system-wide singleton protocols like EFI_VARIABLE_ARCH_PROTOCOL, EFI_SMM_COMMUNICATION_PROTOCOL. These protocols have only one instance system-wide.',
    'patterns.enumerate.title': 'Device Enumeration Pattern',
    'patterns.enumerate.desc':  'Use LocateHandleBuffer(ByProtocol) to get all matching handles, then OpenProtocol on each handle to get the interface. Commonly used in boot managers to enumerate all Block IO devices.',
    'patterns.buschild.title': 'Bus Driver Child Pattern',
    'patterns.buschild.desc':  'Bus drivers use OpenProtocol(BY_CHILD_CONTROLLER) on the parent handle for each child, establishing parent-child relationship tracking. DisconnectController uses this to stop children first.',

    /* ---- code ---- */
    'code.title':    'Key Code Walkthrough',
    'code.subtitle': 'Core EDK2 DXE source implementing the Protocol Services',

    'code.open.title':     'CoreOpenProtocol() Core Logic',
    'code.open.file':      'Source: MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'code.locate.title':   'CoreLocateProtocol() Core Logic',
    'code.locate.file':    'Source: MdeModulePkg/Core/Dxe/Hand/Locate.c',
    'code.locbuf.title':   'CoreLocateHandleBuffer() Core Logic',
    'code.locbuf.file':    'Source: MdeModulePkg/Core/Dxe/Hand/Locate.c',

    /* ---- references ---- */
    'references.title':  'References',
    'references.desc':   'Specifications and source files used as the knowledge basis for this page',

    'ref.uefi.title':       'UEFI Specification 2.10 — Section 7.3: Protocol Handler Services',
    'ref.uefi.desc':        'Defines complete semantics and parameters for OpenProtocol, HandleProtocol, LocateProtocol, LocateHandleBuffer.',
    'ref.edk2.handle':      'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'ref.edk2.handle.desc': 'Implementation of CoreOpenProtocol, CoreHandleProtocol, CoreOpenProtocolInformation.',
    'ref.edk2.locate':      'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/Locate.c',
    'ref.edk2.locate.desc': 'Implementation of CoreLocateProtocol, CoreLocateHandle, CoreLocateHandleBuffer.',
    'ref.edk2.main':        'EDK2 Source: MdeModulePkg/Core/Dxe/DxeMain.h',
    'ref.edk2.main.desc':   'Structure definitions for OPEN_PROTOCOL_DATA, PROTOCOL_INTERFACE, PROTOCOL_ENTRY.',
    'ref.pi.title':         'UEFI Platform Initialization Specification — Volume 2',
    'ref.pi.desc':          'DXE Core services, driver model, Handle Database memory model.',

    /* ---- buttons ---- */
    'btn.prev':  '← Prev',
    'btn.next':  'Next →',
    'btn.reset': 'Reset',

    /* ---- footer ---- */
    'footer.text': 'UEFI Protocol Services Visualizer | Educational Purpose',
},
};

/* ================================================================== */
/*  i18n engine (identical pattern to other visualizers)               */
/* ================================================================== */
var _lang = 'zh-TW';

function t(key) {
    var dict = translations[_lang] || translations['en'];
    return dict[key] || translations['en'][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
        el.title = t(el.getAttribute('data-i18n-title'));
    });
    var titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = t('page.title');
}

function setLang(lang) {
    _lang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('uefi-viz-lang', lang);
    applyTranslations();
    document.querySelectorAll('.lang-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.lang === lang);
    });
    if (typeof onLangChange === 'function') onLangChange(lang);
}

document.addEventListener('DOMContentLoaded', function() {
    var saved = localStorage.getItem('uefi-viz-lang') || 'zh-TW';
    _lang = saved;
    document.documentElement.lang = saved;
    document.querySelectorAll('.lang-btn').forEach(function(b) {
        b.addEventListener('click', function() { setLang(b.dataset.lang); });
        b.classList.toggle('active', b.dataset.lang === saved);
    });
    applyTranslations();
});
