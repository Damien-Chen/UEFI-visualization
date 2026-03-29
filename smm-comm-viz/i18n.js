/* ------------------------------------------------------------------ */
/*  SMM/MM Communication Visualizer – i18n                             */
/*  Bilingual: English (en) + Traditional Chinese (zh-TW)              */
/* ------------------------------------------------------------------ */

const translations = {
'zh-TW': {
    'page.title': 'SMM/MM 通訊機制視覺化',

    /* ---- nav ---- */
    'nav.back':          '← 返回工具列表',
    'nav.overview':      '概述',
    'nav.architecture':  '記憶體架構',
    'nav.trigger':       'SMI 觸發',
    'nav.flow':          '通訊流程',
    'nav.buffer':        '通訊緩衝區',
    'nav.handler':       '處理器註冊',
    'nav.standalone':    'Standalone MM',
    'nav.code':          '程式碼解析',
    'nav.references':    '參考資源',

    /* ---- overview ---- */
    'overview.title':    'SMM/MM 通訊機制概述',
    'overview.subtitle': '理解 DXE 如何觸發並與 SMM (System Management Mode) 溝通',

    'overview.what.title': '什麼是 SMM？',
    'overview.what.desc':  'SMM（System Management Mode）是 x86 處理器中最高特權的執行模式。它運行在獨立的記憶體空間（SMRAM）中，對作業系統完全透明。UEFI 韌體使用 SMM 來處理需要高安全性的操作，例如韌體更新、電源管理和安全策略執行。SMM 透過 SMI（System Management Interrupt）觸發進入。',

    'overview.why.title': '為什麼需要 SMM 通訊？',
    'overview.why.desc':  'DXE 驅動程式和作業系統無法直接存取 SMRAM，因此需要一個安全的通訊機制。EFI_SMM_COMMUNICATION_PROTOCOL 提供了標準化的方式，讓 DXE 環境可以向 SMM 中的處理器發送請求並接收回應，同時維持 SMM 的安全隔離性。',

    'overview.standalone.title': '什麼是 Standalone MM？',
    'overview.standalone.desc':  'Standalone MM 是傳統 SMM 的進化版本。它不依賴 DXE 環境進行初始化，使用獨立的入口點（MM_STANDALONE），提供更好的安全隔離性。它同時支援 x86（SMM）和 ARM（TrustZone/OP-TEE）架構，使用統一的 EFI_MM_COMMUNICATION_PROTOCOL。',

    /* ---- phase timeline ---- */
    'phase.dxe':     'DXE 驅動程式',
    'phase.comm':    '準備通訊緩衝區',
    'phase.smi':     '觸發 SMI',
    'phase.smm':     'SMM 處理',
    'phase.ret':     '返回結果',

    /* ---- architecture ---- */
    'arch.title':    '記憶體架構',
    'arch.subtitle': 'DXE 與 SMM 通訊涉及的記憶體區域',

    'arch.dram.title': '一般 DRAM（DXE 可存取）',
    'arch.dram.desc':  'DXE 驅動程式和作業系統可以自由存取的系統記憶體。通訊緩衝區位於此區域，因為 DXE 和 SMM 都需要能讀寫它。包含 DXE 驅動程式、UEFI 服務表和一般資料。',
    'arch.smram.title': 'SMRAM（SMM 專用）',
    'arch.smram.desc':  'System Management RAM，僅在 SMM 模式下可存取。包含 SMM Core、已註冊的 SMI Handler 和 SMM 驅動程式。在 SmmReadyToLock 事件後被硬體鎖定，防止任何非 SMM 程式碼存取。通常位於 TSEG 區域。',
    'arch.comm.title': '通訊緩衝區',
    'arch.comm.desc':  '位於 SMRAM 之外的共享記憶體區域。DXE 驅動程式寫入請求資料，觸發 SMI 後 SMM Handler 讀取請求並寫回回應。SMM 會驗證此緩衝區的位址範圍，確保它不會指向 SMRAM 內部（防止安全漏洞）。',

    'arch.label.dram':       '一般 DRAM',
    'arch.label.dxe':        'DXE 驅動程式',
    'arch.label.uefi_svc':   'UEFI 服務',
    'arch.label.comm_buf':   '通訊緩衝區',
    'arch.label.os_region':  'OS 記憶體',
    'arch.label.smram':      'SMRAM (TSEG)',
    'arch.label.smm_core':   'SMM Core',
    'arch.label.smi_handler':'SMI Handlers',
    'arch.label.smm_driver': 'SMM 驅動程式',
    'arch.label.save_state': 'CPU Save State',

    /* ---- trigger ---- */
    'trigger.title':    'SMI 觸發機制',
    'trigger.subtitle': '理解 System Management Interrupt 如何觸發 SMM',

    'trigger.swsmi.title': '軟體 SMI（SW SMI）',
    'trigger.swsmi.desc':  '透過向 I/O 埠 0xB2 寫入一個位元組值來觸發。這是 DXE 與 SMM 通訊最常用的方式。EFI_SMM_COMMUNICATION_PROTOCOL 的 Communicate() 函式內部就是透過寫入 0xB2 來觸發 SMI。',

    'trigger.hwsmi.title': '硬體 SMI',
    'trigger.hwsmi.desc':  '由硬體事件觸發，例如 GPIO 變化、電源按鈕按下或 ACPI Timer 溢位。這些 SMI 由晶片組產生，CPU 自動回應。',

    'trigger.entry.title': 'SMM 進入流程',
    'trigger.entry.desc':  '當 SMI 觸發時：① 所有 CPU 核心收到 SMI 信號 ② 每個核心儲存目前狀態到 SMRAM 中的 Save State Area ③ 所有核心跳轉到 SMBASE + 0x8000（SMI entry point）④ BSP（Bootstrap Processor）執行 SMM Foundation / SMM Core ⑤ AP（Application Processors）進入等待狀態 ⑥ 處理完成後執行 RSM 指令返回。',

    'trigger.port.label':    'I/O Port 0xB2',
    'trigger.port.desc':     '寫入觸發 SW SMI',
    'trigger.cpu.label':     'CPU 回應',
    'trigger.cpu.desc':      '所有核心暫停，儲存狀態',
    'trigger.smbase.label':  'SMBASE 入口',
    'trigger.smbase.desc':   '跳轉到 SMBASE + 0x8000',

    /* ---- flow ---- */
    'flow.title':      '通訊流程',
    'flow.subtitle':   '逐步了解 DXE 與 SMM 的完整通訊過程',
    'flow.step.label': '步驟',
    'flow.step.of':    '/',

    'flow.step1.title':  '步驟 1：定位通訊協定',
    'flow.step1.desc':   'DXE 驅動程式透過 gBS->LocateProtocol() 找到 EFI_SMM_COMMUNICATION_PROTOCOL 的實例。此協定由 PiSmmIpl 驅動程式在啟動時安裝。',
    'flow.step1.detail': 'PiSmmIpl（SMM Initial Program Loader）是 DXE 驅動程式，負責載入 SMM Core 到 SMRAM 並安裝通訊協定。',

    'flow.step2.title':  '步驟 2：填寫通訊標頭',
    'flow.step2.desc':   'DXE 驅動程式填寫 EFI_SMM_COMMUNICATE_HEADER 結構：HeaderGuid 設為目標 SMI Handler 的 GUID，MessageLength 設為 Data 的大小，Data[] 填入請求的負載資料。',
    'flow.step2.detail': 'HeaderGuid 是 SMM Core 用來分派（dispatch）請求到正確 Handler 的關鍵。每個 SMI Handler 在註冊時都會指定自己的 GUID。',

    'flow.step3.title':  '步驟 3：呼叫 Communicate()',
    'flow.step3.desc':   'DXE 驅動程式呼叫 EFI_SMM_COMMUNICATION_PROTOCOL.Communicate()，傳入緩衝區指標和大小。此函式會驗證參數並準備觸發 SMI。',
    'flow.step3.detail': 'Communicate() 的實作位於 MdeModulePkg/Core/PiSmmIpl/PiSmmIpl.c 中的 SmmCommunicationCommunicate() 函式。',

    'flow.step4.title':  '步驟 4：觸發 SW SMI',
    'flow.step4.desc':   'Communicate() 內部將通訊緩衝區的位址寫入特定的固定位置（或透過 SMRAM 中的共享變數傳遞），然後向 I/O 埠 0xB2 寫入 SW SMI 值，觸發 System Management Interrupt。',
    'flow.step4.detail': '實際寫入 I/O 埠的操作使用 IoWrite8(0xB2, value)。這會導致晶片組產生 SMI# 信號給所有 CPU。',

    'flow.step5.title':  '步驟 5：CPU 進入 SMM',
    'flow.step5.desc':   '所有 CPU 核心收到 SMI 信號後：暫停目前執行、將暫存器狀態儲存到 Save State Area（位於 SMRAM）、跳轉到 SMBASE + 0x8000。BSP 核心負責執行 SMM Foundation。',
    'flow.step5.detail': 'SMI 是不可遮蔽的中斷，比 NMI 優先級更高。所有核心必須在 SMM 中會合（rendezvous），確保同步處理。',

    'flow.step6.title':  '步驟 6：SMM Core 分派',
    'flow.step6.desc':   'SMM Foundation 進入 SmmEntryPoint()，接著 SMM Core 讀取通訊緩衝區中的 HeaderGuid，在已註冊的 SMI Handler 列表中搜尋匹配的 Handler，然後呼叫 SmiManage() 進行分派。',
    'flow.step6.detail': 'SmiManage() 會遍歷所有為該 GUID 註冊的 Handler，依序呼叫它們，直到某個 Handler 回傳 EFI_SUCCESS 或所有 Handler 都被呼叫完畢。',

    'flow.step7.title':  '步驟 7：Handler 處理請求',
    'flow.step7.desc':   'SMI Handler 從通訊緩衝區讀取請求資料（Data[] 區域），執行所需的安全操作（如讀寫 SPI Flash、存取安全暫存器等），然後將結果寫回同一個通訊緩衝區的 Data[] 中。',
    'flow.step7.detail': 'Handler 必須驗證通訊緩衝區位址不在 SMRAM 範圍內（SmmIsBufferOutsideSmmValid()），防止 TOC/TOU 攻擊。',

    'flow.step8.title':  '步驟 8：RSM 返回 DXE',
    'flow.step8.desc':   '處理完成後，SMM Core 執行 RSM（Resume from SMM）指令。CPU 從 Save State Area 恢復所有暫存器狀態，返回到 DXE 驅動程式呼叫 Communicate() 的下一條指令。DXE 驅動程式從通訊緩衝區讀取回應資料。',
    'flow.step8.detail': 'RSM 是從 SMM 返回的唯一方式。它會自動從 SMRAM 中的 Save State 恢復 CPU 上下文，無縫回到 Ring 0 DXE 環境。',

    /* ---- buffer ---- */
    'buffer.title':      '通訊緩衝區內部結構',
    'buffer.subtitle':   '理解 EFI_SMM_COMMUNICATE_HEADER 的結構和用途',
    'buffer.desc':       '通訊緩衝區使用 EFI_SMM_COMMUNICATE_HEADER 結構，這是 DXE 和 SMM 之間交換資料的標準格式。HeaderGuid 用於路由請求到正確的 Handler，MessageLength 指定 Data 區域的大小，Data 包含實際的請求和回應負載。',

    'buffer.struct':     'EFI_SMM_COMMUNICATE_HEADER { HeaderGuid, MessageLength, Data[] }',

    'buffer.guid.title': 'HeaderGuid（EFI_GUID，16 位元組）',
    'buffer.guid.desc':  '唯一識別目標 SMI Handler。SMM Core 用此 GUID 在已註冊的 Handler 列表中搜尋匹配的處理器。每個 SMM 驅動程式在呼叫 SmiHandlerRegister() 時指定自己的 GUID。',

    'buffer.len.title':  'MessageLength（UINTN，4/8 位元組）',
    'buffer.len.desc':   '指定 Data[] 區域的大小（位元組數）。SMM Core 使用此值來確定整個緩衝區的總大小：sizeof(EFI_GUID) + sizeof(UINTN) + MessageLength。Handler 也用此值驗證資料完整性。',

    'buffer.data.title': 'Data[]（可變長度）',
    'buffer.data.desc':  '實際的請求/回應負載。格式由具體的 SMI Handler 定義。DXE 寫入請求時填入，Handler 處理後將回應寫回同一位置。緩衝區必須位於 SMRAM 之外，且 SMM 會驗證位址範圍的合法性。',

    'buffer.validation.title': '緩衝區驗證',
    'buffer.validation.desc':  'SMM Core 在處理通訊緩衝區前會進行嚴格驗證：① 檢查緩衝區位址是否在 SMRAM 範圍之外 ② 確認 MessageLength 不會造成整數溢位 ③ 驗證整個緩衝區（Header + Data）都不與 SMRAM 重疊。這是為了防止攻擊者利用精心構造的緩衝區來讀寫 SMRAM 內容。',

    /* ---- handler ---- */
    'handler.title':      'SMI Handler 註冊機制',
    'handler.subtitle':   '理解 SMM 驅動程式如何註冊 Handler 來處理通訊請求',

    'handler.guid.title': 'GUID-Based Handler（通訊協定用）',
    'handler.guid.desc':  '使用 SmiHandlerRegister() 註冊，綁定特定的 GUID。當 DXE 透過 EFI_SMM_COMMUNICATION_PROTOCOL 發送帶有匹配 GUID 的請求時，SMM Core 會分派到此 Handler。這是最常用的 DXE-SMM 通訊方式。',

    'handler.sw.title':   'SW SMI Number Handler',
    'handler.sw.desc':    '使用 EFI_SMM_SW_DISPATCH2_PROTOCOL 註冊，綁定特定的 SW SMI 號碼（0x00-0xFF）。當對應的 SW SMI 號碼被觸發時呼叫。通常用於 ACPI/ASL 程式碼觸發的 SMI。',

    'handler.root.title': 'Root SMI Handler',
    'handler.root.desc':  '使用 SmiHandlerRegister() 但 GUID 設為 NULL 來註冊。每次 SMI 觸發時都會被呼叫，不論 SMI 來源。用於需要處理所有 SMI 事件的情況，如效能監控或除錯。',

    'handler.lifecycle.title': 'SMM 驅動程式生命週期',
    'handler.lifecycle.desc':  'SMM 驅動程式在 DXE 階段由 SMM IPL 載入到 SMRAM 中。載入後，驅動程式的入口點被呼叫，此時它可以使用 SMM 服務表（gSmst）來註冊 Handler。一旦 SmmReadyToLock 信號觸發，SMRAM 被鎖定，不再能載入新的 SMM 驅動程式。Handler 在系統整個生命週期中持續存在，即使在 ExitBootServices 之後。',

    /* ---- standalone ---- */
    'standalone.title':    'Standalone MM 與傳統 MM 比較',
    'standalone.subtitle': '理解兩種 MM 架構的差異和各自的優勢',

    'standalone.traditional.title': '傳統 MM（Traditional MM）',
    'standalone.traditional.items': [
        'SMM IPL（DXE 驅動程式）負責載入 SMM Core 到 SMRAM',
        'SMM 驅動程式在初始化階段可存取 DXE 服務（gBS、gDS）',
        '使用 EFI_SMM_COMMUNICATION_PROTOCOL',
        'SMM Core 依賴 DXE 環境完成設定',
        '僅支援 x86 架構（需要 SMM 硬體支援）',
        '較大的攻擊面（DXE 環境可能被汙染）',
    ],

    'standalone.standalone.title': 'Standalone MM',
    'standalone.standalone.items': [
        'MM Foundation 由平台韌體直接載入，不依賴 DXE',
        'MM 驅動程式使用 MM_STANDALONE 入口點，無法存取 DXE 服務',
        '使用 EFI_MM_COMMUNICATION_PROTOCOL（結構相同，更通用的命名）',
        'MM Core 獨立初始化，不需要 DXE 環境',
        '同時支援 x86（SMM）和 ARM（TrustZone/OP-TEE）',
        '更小的攻擊面，更好的安全隔離',
    ],

    /* ---- code ---- */
    'code.title':          '關鍵程式碼解析',
    'code.subtitle':       'EDK2 中 SMM 通訊的核心實作',

    'code.communicate.title': 'SmmCommunicationCommunicate()',
    'code.communicate.desc':  'DXE 端的通訊入口函式，由 PiSmmIpl 實作。驗證參數後觸發 SW SMI。',

    'code.entrypoint.title':  'SmmEntryPoint()',
    'code.entrypoint.desc':   'SMM 的進入點，CPU 從 SMI 進入後執行的第一個高階函式。',

    'code.smimanage.title':   'SmiManage()',
    'code.smimanage.desc':    'SMM Core 的核心分派函式，根據 GUID 找到並呼叫對應的 Handler。',

    'code.register.title':    'SmiHandlerRegister() 範例',
    'code.register.desc':     'SMM 驅動程式如何註冊一個 GUID-based SMI Handler。',

    /* ---- references ---- */
    'ref.title':         '參考資源',
    'ref.subtitle':      '深入了解 SMM 通訊的學習資源',
    'ref.spec':          'PI Specification',
    'ref.spec.desc':     'UEFI PI 規格書 Volume 4：System Management Mode Core Interface',
    'ref.edk2':          'EDK2 SMM Core 原始碼',
    'ref.edk2.desc':     'MdeModulePkg/Core/PiSmmCore — SMM Core 分派器實作',
    'ref.ipl':           'PiSmmIpl 原始碼',
    'ref.ipl.desc':      'MdeModulePkg/Core/PiSmmIpl — SMM 通訊協定實作',
    'ref.standalone':    'Standalone MM Core',
    'ref.standalone.desc': 'StandaloneMmPkg — Standalone MM Core 和基礎建設',
},

'en': {
    'page.title': 'SMM/MM Communication Visualizer',

    /* ---- nav ---- */
    'nav.back':          '← Back to Tools',
    'nav.overview':      'Overview',
    'nav.architecture':  'Architecture',
    'nav.trigger':       'SMI Trigger',
    'nav.flow':          'Comm Flow',
    'nav.buffer':        'Buffer Layout',
    'nav.handler':       'Handler Reg.',
    'nav.standalone':    'Standalone MM',
    'nav.code':          'Code',
    'nav.references':    'References',

    /* ---- overview ---- */
    'overview.title':    'SMM/MM Communication Overview',
    'overview.subtitle': 'Understanding how DXE triggers and communicates with SMM (System Management Mode)',

    'overview.what.title': 'What is SMM?',
    'overview.what.desc':  'SMM (System Management Mode) is the highest-privilege execution mode on x86 processors. It runs in an isolated memory space (SMRAM), completely transparent to the OS. UEFI firmware uses SMM for security-critical operations such as firmware updates, power management, and security policy enforcement. SMM is entered via SMI (System Management Interrupt).',

    'overview.why.title': 'Why SMM Communication?',
    'overview.why.desc':  'DXE drivers and the OS cannot directly access SMRAM, so a secure communication mechanism is needed. EFI_SMM_COMMUNICATION_PROTOCOL provides a standardized way for the DXE environment to send requests to and receive responses from SMM handlers, while maintaining SMM\'s security isolation.',

    'overview.standalone.title': 'What is Standalone MM?',
    'overview.standalone.desc':  'Standalone MM is an evolution of traditional SMM. It does not depend on the DXE environment for initialization, uses an independent entry point (MM_STANDALONE), and offers better security isolation. It supports both x86 (SMM) and ARM (TrustZone/OP-TEE) architectures via the unified EFI_MM_COMMUNICATION_PROTOCOL.',

    /* ---- phase timeline ---- */
    'phase.dxe':     'DXE Driver',
    'phase.comm':    'Prepare Comm Buffer',
    'phase.smi':     'Trigger SMI',
    'phase.smm':     'SMM Processing',
    'phase.ret':     'Return Result',

    /* ---- architecture ---- */
    'arch.title':    'Memory Architecture',
    'arch.subtitle': 'Memory regions involved in DXE-SMM communication',

    'arch.dram.title': 'Normal DRAM (DXE-accessible)',
    'arch.dram.desc':  'System memory freely accessible by DXE drivers and the OS. The communication buffer resides here since both DXE and SMM need to read/write it. Contains DXE drivers, UEFI service tables, and general data.',
    'arch.smram.title': 'SMRAM (SMM-only)',
    'arch.smram.desc':  'System Management RAM, accessible only in SMM mode. Contains the SMM Core, registered SMI handlers, and SMM drivers. Hardware-locked after SmmReadyToLock to prevent any non-SMM code access. Typically located in the TSEG region.',
    'arch.comm.title': 'Communication Buffer',
    'arch.comm.desc':  'A shared memory region outside SMRAM. DXE drivers write request data, trigger an SMI, and the SMM handler reads the request and writes back a response. SMM validates the buffer address range to ensure it does not point inside SMRAM (preventing security vulnerabilities).',

    'arch.label.dram':       'Normal DRAM',
    'arch.label.dxe':        'DXE Drivers',
    'arch.label.uefi_svc':   'UEFI Services',
    'arch.label.comm_buf':   'Comm Buffer',
    'arch.label.os_region':  'OS Memory',
    'arch.label.smram':      'SMRAM (TSEG)',
    'arch.label.smm_core':   'SMM Core',
    'arch.label.smi_handler':'SMI Handlers',
    'arch.label.smm_driver': 'SMM Drivers',
    'arch.label.save_state': 'CPU Save State',

    /* ---- trigger ---- */
    'trigger.title':    'SMI Trigger Mechanism',
    'trigger.subtitle': 'Understanding how System Management Interrupts trigger SMM',

    'trigger.swsmi.title': 'Software SMI (SW SMI)',
    'trigger.swsmi.desc':  'Triggered by writing a byte value to I/O port 0xB2. This is the most common way for DXE to communicate with SMM. The Communicate() function of EFI_SMM_COMMUNICATION_PROTOCOL internally writes to 0xB2 to trigger the SMI.',

    'trigger.hwsmi.title': 'Hardware SMI',
    'trigger.hwsmi.desc':  'Triggered by hardware events such as GPIO changes, power button presses, or ACPI timer overflow. These SMIs are generated by the chipset, and the CPU responds automatically.',

    'trigger.entry.title': 'SMM Entry Flow',
    'trigger.entry.desc':  'When an SMI fires: ① All CPU cores receive the SMI signal ② Each core saves its current state to the Save State Area in SMRAM ③ All cores jump to SMBASE + 0x8000 (SMI entry point) ④ BSP (Bootstrap Processor) runs the SMM Foundation / SMM Core ⑤ APs (Application Processors) enter a wait state ⑥ Upon completion, the RSM instruction returns execution.',

    'trigger.port.label':    'I/O Port 0xB2',
    'trigger.port.desc':     'Write triggers SW SMI',
    'trigger.cpu.label':     'CPU Response',
    'trigger.cpu.desc':      'All cores halt, save state',
    'trigger.smbase.label':  'SMBASE Entry',
    'trigger.smbase.desc':   'Jump to SMBASE + 0x8000',

    /* ---- flow ---- */
    'flow.title':      'Communication Flow',
    'flow.subtitle':   'Step-by-step walkthrough of DXE-SMM communication',
    'flow.step.label': 'Step',
    'flow.step.of':    '/',

    'flow.step1.title':  'Step 1: Locate Protocol',
    'flow.step1.desc':   'The DXE driver uses gBS->LocateProtocol() to find an instance of EFI_SMM_COMMUNICATION_PROTOCOL. This protocol is installed by the PiSmmIpl driver at boot time.',
    'flow.step1.detail': 'PiSmmIpl (SMM Initial Program Loader) is a DXE driver responsible for loading the SMM Core into SMRAM and installing the communication protocol.',

    'flow.step2.title':  'Step 2: Fill Communication Header',
    'flow.step2.desc':   'The DXE driver fills the EFI_SMM_COMMUNICATE_HEADER structure: sets HeaderGuid to the target SMI handler\'s GUID, MessageLength to the size of Data, and populates Data[] with the request payload.',
    'flow.step2.detail': 'The HeaderGuid is the key used by the SMM Core to dispatch requests to the correct handler. Each SMI handler specifies its own GUID during registration.',

    'flow.step3.title':  'Step 3: Call Communicate()',
    'flow.step3.desc':   'The DXE driver calls EFI_SMM_COMMUNICATION_PROTOCOL.Communicate(), passing the buffer pointer and size. This function validates parameters and prepares to trigger the SMI.',
    'flow.step3.detail': 'The implementation lives in MdeModulePkg/Core/PiSmmIpl/PiSmmIpl.c as SmmCommunicationCommunicate().',

    'flow.step4.title':  'Step 4: Trigger SW SMI',
    'flow.step4.desc':   'Inside Communicate(), the communication buffer address is written to a well-known location (or passed via a shared SMRAM variable), then a SW SMI value is written to I/O port 0xB2, triggering a System Management Interrupt.',
    'flow.step4.detail': 'The actual I/O port write uses IoWrite8(0xB2, value). This causes the chipset to assert SMI# to all CPUs.',

    'flow.step5.title':  'Step 5: CPU Enters SMM',
    'flow.step5.desc':   'All CPU cores receive the SMI signal: they pause current execution, save register state to the Save State Area (in SMRAM), and jump to SMBASE + 0x8000. The BSP core runs the SMM Foundation.',
    'flow.step5.detail': 'SMI is a non-maskable interrupt with higher priority than NMI. All cores must rendezvous in SMM to ensure synchronized processing.',

    'flow.step6.title':  'Step 6: SMM Core Dispatch',
    'flow.step6.desc':   'The SMM Foundation enters SmmEntryPoint(), then the SMM Core reads the HeaderGuid from the communication buffer, searches the registered SMI handler list for a match, and calls SmiManage() for dispatch.',
    'flow.step6.detail': 'SmiManage() iterates through all handlers registered for that GUID, calling each in order until one returns EFI_SUCCESS or all have been called.',

    'flow.step7.title':  'Step 7: Handler Processes Request',
    'flow.step7.desc':   'The SMI handler reads request data from the communication buffer\'s Data[] region, performs the required secure operations (e.g., SPI Flash read/write, secure register access), and writes the result back to the same Data[] area.',
    'flow.step7.detail': 'The handler must validate the communication buffer address is outside SMRAM (SmmIsBufferOutsideSmmValid()) to prevent TOC/TOU attacks.',

    'flow.step8.title':  'Step 8: RSM Returns to DXE',
    'flow.step8.desc':   'After processing, the SMM Core executes the RSM (Resume from SMM) instruction. The CPU restores all register state from the Save State Area and returns to the instruction following the DXE driver\'s Communicate() call. The DXE driver reads the response from the communication buffer.',
    'flow.step8.detail': 'RSM is the only way to exit SMM. It automatically restores the CPU context from the Save State in SMRAM, seamlessly returning to the Ring 0 DXE environment.',

    /* ---- buffer ---- */
    'buffer.title':      'Communication Buffer Internals',
    'buffer.subtitle':   'Understanding the EFI_SMM_COMMUNICATE_HEADER structure and usage',
    'buffer.desc':       'The communication buffer uses the EFI_SMM_COMMUNICATE_HEADER structure — the standard format for exchanging data between DXE and SMM. HeaderGuid routes the request to the correct handler, MessageLength specifies the Data region size, and Data contains the actual request/response payload.',

    'buffer.struct':     'EFI_SMM_COMMUNICATE_HEADER { HeaderGuid, MessageLength, Data[] }',

    'buffer.guid.title': 'HeaderGuid (EFI_GUID, 16 bytes)',
    'buffer.guid.desc':  'Uniquely identifies the target SMI handler. The SMM Core uses this GUID to search for a matching handler in its registered handler list. Each SMM driver specifies its own GUID when calling SmiHandlerRegister().',

    'buffer.len.title':  'MessageLength (UINTN, 4/8 bytes)',
    'buffer.len.desc':   'Specifies the size of the Data[] region in bytes. The SMM Core uses this to determine the total buffer size: sizeof(EFI_GUID) + sizeof(UINTN) + MessageLength. Handlers also use this to validate data integrity.',

    'buffer.data.title': 'Data[] (variable length)',
    'buffer.data.desc':  'The actual request/response payload. The format is defined by the specific SMI handler. DXE fills it with the request; the handler processes it and writes the response back to the same location. The buffer must reside outside SMRAM, and SMM validates the address range.',

    'buffer.validation.title': 'Buffer Validation',
    'buffer.validation.desc':  'The SMM Core performs strict validation before processing: ① Checks that the buffer address is outside SMRAM ② Verifies MessageLength does not cause integer overflow ③ Confirms the entire buffer (Header + Data) does not overlap with SMRAM. This prevents attackers from using crafted buffers to read/write SMRAM contents.',

    /* ---- handler ---- */
    'handler.title':      'SMI Handler Registration',
    'handler.subtitle':   'How SMM drivers register handlers to process communication requests',

    'handler.guid.title': 'GUID-Based Handler (for Communication Protocol)',
    'handler.guid.desc':  'Registered using SmiHandlerRegister() with a specific GUID. When DXE sends a request with a matching GUID via EFI_SMM_COMMUNICATION_PROTOCOL, the SMM Core dispatches to this handler. This is the most common DXE-SMM communication pattern.',

    'handler.sw.title':   'SW SMI Number Handler',
    'handler.sw.desc':    'Registered using EFI_SMM_SW_DISPATCH2_PROTOCOL with a specific SW SMI number (0x00-0xFF). Called when the corresponding SW SMI number is triggered. Typically used for SMIs triggered by ACPI/ASL code.',

    'handler.root.title': 'Root SMI Handler',
    'handler.root.desc':  'Registered using SmiHandlerRegister() with NULL GUID. Called on every SMI regardless of source. Used for scenarios requiring handling of all SMI events, such as performance monitoring or debugging.',

    'handler.lifecycle.title': 'SMM Driver Lifecycle',
    'handler.lifecycle.desc':  'SMM drivers are loaded into SMRAM by the SMM IPL during the DXE phase. Once loaded, the driver\'s entry point is called, where it uses the SMM System Table (gSmst) to register handlers. After SmmReadyToLock is signaled, SMRAM is locked and no new SMM drivers can be loaded. Handlers persist for the entire system lifetime, even after ExitBootServices.',

    /* ---- standalone ---- */
    'standalone.title':    'Standalone MM vs Traditional MM',
    'standalone.subtitle': 'Understanding the differences between the two MM architectures',

    'standalone.traditional.title': 'Traditional MM',
    'standalone.traditional.items': [
        'SMM IPL (DXE driver) loads SMM Core into SMRAM',
        'SMM drivers can access DXE services (gBS, gDS) during initialization',
        'Uses EFI_SMM_COMMUNICATION_PROTOCOL',
        'SMM Core depends on DXE environment for setup',
        'x86-only (requires SMM hardware support)',
        'Larger attack surface (DXE environment may be compromised)',
    ],

    'standalone.standalone.title': 'Standalone MM',
    'standalone.standalone.items': [
        'MM Foundation loaded directly by platform firmware, no DXE dependency',
        'MM drivers use MM_STANDALONE entry point, cannot access DXE services',
        'Uses EFI_MM_COMMUNICATION_PROTOCOL (same structure, more generic naming)',
        'MM Core initializes independently without DXE environment',
        'Supports both x86 (SMM) and ARM (TrustZone/OP-TEE)',
        'Smaller attack surface, better security isolation',
    ],

    /* ---- code ---- */
    'code.title':          'Key Code Analysis',
    'code.subtitle':       'Core SMM communication implementation in EDK2',

    'code.communicate.title': 'SmmCommunicationCommunicate()',
    'code.communicate.desc':  'The DXE-side communication entry function, implemented by PiSmmIpl. Validates parameters then triggers SW SMI.',

    'code.entrypoint.title':  'SmmEntryPoint()',
    'code.entrypoint.desc':   'The SMM entry point — the first high-level function executed after CPU enters SMM via SMI.',

    'code.smimanage.title':   'SmiManage()',
    'code.smimanage.desc':    'The SMM Core\'s central dispatch function. Finds and calls the matching handler by GUID.',

    'code.register.title':    'SmiHandlerRegister() Example',
    'code.register.desc':     'How an SMM driver registers a GUID-based SMI handler.',

    /* ---- references ---- */
    'ref.title':         'References',
    'ref.subtitle':      'Resources for deeper learning about SMM communication',
    'ref.spec':          'PI Specification',
    'ref.spec.desc':     'UEFI PI Specification Volume 4: System Management Mode Core Interface',
    'ref.edk2':          'EDK2 SMM Core Source',
    'ref.edk2.desc':     'MdeModulePkg/Core/PiSmmCore — SMM Core dispatcher implementation',
    'ref.ipl':           'PiSmmIpl Source',
    'ref.ipl.desc':      'MdeModulePkg/Core/PiSmmIpl — SMM communication protocol implementation',
    'ref.standalone':    'Standalone MM Core',
    'ref.standalone.desc': 'StandaloneMmPkg — Standalone MM Core and infrastructure',
},
};

/* ------------------------------------------------------------------ */
/*  i18n engine (same pattern as other viz tools)                      */
/* ------------------------------------------------------------------ */
let currentLang = localStorage.getItem('smm-comm-viz-lang') || 'zh-TW';

function t(key) {
    var lang = translations[currentLang] || translations['en'];
    return lang[key] !== undefined ? lang[key] : (translations['en'][key] !== undefined ? translations['en'][key] : key);
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        var val = t(key);
        if (val !== key) {
            el.textContent = val;
        }
    });
    document.title = t('page.title');
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('smm-comm-viz-lang', lang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    applyTranslations();

    // re-render diagrams with new language
    if (typeof renderArchDiagram === 'function') renderArchDiagram();
    if (typeof renderTriggerDiagram === 'function') renderTriggerDiagram();
    if (typeof renderBufferDiagram === 'function') renderBufferDiagram();
    if (typeof renderFlowStep === 'function') renderFlowStep(typeof currentFlowStep !== 'undefined' ? currentFlowStep : 0);
}

/* ---- boot ---- */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { setLang(this.getAttribute('data-lang')); });
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    applyTranslations();
});
