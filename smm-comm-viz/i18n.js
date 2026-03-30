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
    'trigger.title':    'MM 觸發機制 (SMI & MMI)',
    'trigger.subtitle': '理解平台如何觸發並進入 Management Mode (x86 SMM 或 ARM StMM)',

    'trigger.x86.title': 'x86 架構：SMI 觸發',
    'trigger.swsmi.title': '軟體 SMI（SW SMI）',
    'trigger.swsmi.desc':  '透過向 I/O 埠 0xB2 寫入一個位元組值來觸發。這是 DXE 與 SMM 通訊最常用的方式。EFI_SMM_COMMUNICATION_PROTOCOL 的 Communicate() 函式內部就是透過寫入 0xB2 來觸發 SMI。',

    'trigger.hwsmi.title': '硬體 SMI',
    'trigger.hwsmi.desc':  '由硬體事件觸發，例如 GPIO 變化、電源按鈕按下或 ACPI Timer 溢位。這些 SMI 由晶片組產生，CPU 自動回應並強制進入 SMM。',

    'trigger.entry.title': 'SMM 進入流程',
    'trigger.entry.desc':  '當 SMI 觸發時：① 所有 CPU 核心收到 SMI 信號 ② 暫存器狀態存入 SMRAM 的 Save State Area ③ 跳轉至 SMBASE + 0x8000 ④ BSP 執行 SMM Core，AP 進入等待 ⑤ 執行 RSM 返回。',

    'trigger.arm.title': 'ARM 架構：MMI (Management Mode Interrupt) 與 StMM',
    'trigger.smc.title': '同步 MMI (SMC 呼叫)',
    'trigger.smc.desc':  'ARM 平台透過執行 SMC (Secure Monitor Call) 指令主動觸發。這對應於 x86 的 SW SMI，用於正常執行流中的 DXE-to-MM 通訊請求，請求會先進入 EL3，再由 Trusted Firmware 轉發給 S-EL0 的 StMM。',

    'trigger.asyncmmi.title': '非同步 MMI (硬體中斷)',
    'trigger.asyncmmi.desc':  '由硬體事件產生的安全中斷 (FIQ/IRQ)，由中斷控制器 (GIC) 發送給 CPU。GIC 將此中斷標記為 Secure Group，導致 CPU 陷入 EL3 並路由給 SPM (Secure Partition Manager) 處理。',

    'trigger.stmm_entry.title': 'StMM 進入流程 (EL3 -> S-EL0)',
    'trigger.stmm_entry.desc':  '① 觸發 SMC 或硬體安全中斷 ② CPU 陷入最高安全層級 EL3 (TF-A) ③ TF-A 的 SPM 將上下文切換到 Secure World ④ 降級進入 S-EL0 執行 Standalone MM Core ⑤ 處理完成後經 SMC 返回 EL3 再回到 Non-Secure EL1/EL2。',

    'trigger.port.label':    'Trigger (0xB2 / SMC)',
    'trigger.port.desc':     '寫入/呼叫 觸發 MM',
    'trigger.cpu.label':     'CPU 回應 (SMI/EL3)',
    'trigger.cpu.desc':      '核心暫停，陷入安全模式',
    'trigger.smbase.label':  'MM Core 入口',
    'trigger.smbase.desc':   '進入 SMBASE/S-EL0',

    /* ---- flow ---- */
    'flow.title':      '通訊流程',
    'flow.subtitle':   '逐步了解 DXE 與 MM 的完整通訊過程',
    'flow.step.label': '步驟',
    'flow.step.of':    '/',

    'flow.step1.title':  '步驟 1：定位通訊協定',
    'flow.step1.desc':   'DXE 驅動程式透過 gBS->LocateProtocol() 找到 EFI_SMM_COMMUNICATION_PROTOCOL 或 EFI_MM_COMMUNICATION_PROTOCOL 的實例。此協定由 MM IPL 驅動程式在啟動時安裝。',
    'flow.step1.detail': 'MM IPL (Initial Program Loader) 是 DXE 驅動程式，負責載入 MM Core 到安全記憶體並安裝通訊協定。',

    'flow.step2.title':  '步驟 2：填寫通訊標頭',
    'flow.step2.desc':   'DXE 驅動程式填寫 EFI_MM_COMMUNICATE_HEADER 結構：HeaderGuid 設為目標 MM Handler 的 GUID，MessageLength 設為 Data 的大小，Data[] 填入請求的負載資料。',
    'flow.step2.detail': 'HeaderGuid 是 MM Core 用來分派（dispatch）請求到正確 Handler 的關鍵。每個 MM Handler 在註冊時都會指定自己的 GUID。',

    'flow.step3.title':  '步驟 3：呼叫 Communicate()',
    'flow.step3.desc':   'DXE 驅動程式呼叫通訊協定的 Communicate() 函式，傳入緩衝區指標和大小。此函式會驗證參數並準備觸發進入安全模式。',
    'flow.step3.detail': '實作通常位於特定架構的 MM IPL 驅動程式中（例如 x86 的 PiSmmIpl 或 ARM 的 StandaloneMmIpl）。',

    'flow.step4.title':  '步驟 4：觸發 MM (SMI / SMC)',
    'flow.step4.desc':   'Communicate() 內部將通訊緩衝區的位址寫入特定的固定位置。然後觸發硬體特定的中斷/呼叫：x86 上寫入 I/O 埠 0xB2 (SW SMI)；ARM 上發出 SMC 呼叫。',
    'flow.step4.detail': '這會導致處理器陷入最高特權模式 (x86 SMM 或 ARM EL3) 並開始切換到安全環境。',

    'flow.step5.title':  '步驟 5：CPU 進入 MM Core',
    'flow.step5.desc':   'CPU 暫停目前執行，儲存暫存器狀態，並陷入安全模式。Secure Monitor (SMM Foundation 或 ARM TF-A/SPM) 接著將執行流路由至 MM Core 入口點。',
    'flow.step5.detail': '在 x86 上，所有核心在 SMRAM 的 SMBASE 會合；在 ARM 上，EL3 將請求轉發至位於 S-EL0 的 Standalone MM Core。',

    'flow.step6.title':  '步驟 6：MM Core 分派',
    'flow.step6.desc':   'MM Core 讀取通訊緩衝區中的 HeaderGuid，在已註冊的 Handler 列表中搜尋匹配項，然後呼叫 MmiManage() 或 SmiManage() 進行分派。',
    'flow.step6.detail': 'Manage 函式會遍歷所有為該 GUID 註冊的 Handler，依序呼叫它們，直到某個 Handler 回傳 EFI_SUCCESS。',

    'flow.step7.title':  '步驟 7：Handler 處理請求',
    'flow.step7.desc':   '目標 Handler 從通訊緩衝區讀取請求資料（Data[] 區域），執行所需的安全操作（如安全變數讀寫），然後將結果寫回同一個通訊緩衝區。',
    'flow.step7.detail': 'Handler 必須驗證通訊緩衝區位址嚴格位於安全記憶體範圍之外，防止 TOC/TOU 攻擊或緩衝區重疊漏洞。',

    'flow.step8.title':  '步驟 8：返回 Normal World',
    'flow.step8.desc':   '處理完成後，MM Core 將執行流返回 Normal World (x86 透過 RSM，ARM 透過 SMC 返回 EL1/EL2)。DXE 驅動程式接著從通訊緩衝區讀取回應資料。',
    'flow.step8.detail': 'CPU 上下文會被無縫恢復，精確返回到 DXE 驅動程式呼叫 Communicate() 的下一條指令。',

    /* ---- buffer ---- */
    'buffer.title':      '通訊緩衝區內部結構',
    'buffer.subtitle':   '理解 EFI_MM_COMMUNICATE_HEADER 的結構和用途',
    'buffer.desc':       '通訊緩衝區使用 EFI_MM_COMMUNICATE_HEADER (傳統為 EFI_SMM_COMMUNICATE_HEADER) 結構，這是 DXE 和 MM 之間交換資料的標準格式。HeaderGuid 用於路由請求到正確的 Handler，MessageLength 指定 Data 區域的大小，Data 包含實際的請求和回應負載。',

    'buffer.struct':     'EFI_MM_COMMUNICATE_HEADER { HeaderGuid, MessageLength, Data[] }',

    'buffer.guid.title': 'HeaderGuid（EFI_GUID，16 位元組）',
    'buffer.guid.desc':  '唯一識別目標 SMI Handler。SMM Core 用此 GUID 在已註冊的 Handler 列表中搜尋匹配的處理器。每個 SMM 驅動程式在呼叫 SmiHandlerRegister() 時指定自己的 GUID。',

    'buffer.len.title':  'MessageLength（UINTN，4/8 位元組）',
    'buffer.len.desc':   '指定 Data[] 區域的大小（位元組數）。SMM Core 使用此值來確定整個緩衝區的總大小：sizeof(EFI_GUID) + sizeof(UINTN) + MessageLength。Handler 也用此值驗證資料完整性。',

    'buffer.data.title': 'Data[]（可變長度）',
    'buffer.data.desc':  '實際的請求/回應負載。格式由具體的 SMI Handler 定義。DXE 寫入請求時填入，Handler 處理後將回應寫回同一位置。緩衝區必須位於 SMRAM 之外，且 SMM 會驗證位址範圍的合法性。',

    'buffer.validation.title': '緩衝區驗證',
    'buffer.validation.desc':  'SMM Core 在處理通訊緩衝區前會進行嚴格驗證：① 檢查緩衝區位址是否在 SMRAM 範圍之外 ② 確認 MessageLength 不會造成整數溢位 ③ 驗證整個緩衝區（Header + Data）都不與 SMRAM 重疊。這是為了防止攻擊者利用精心構造的緩衝區來讀寫 SMRAM 內容。',

    /* ---- handler ---- */
    'handler.title':      'MM 處理器註冊機制 (SMI & MMI)',
    'handler.subtitle':   '理解 SMM/MM 驅動程式如何註冊 Handler 來處理通訊請求',

    'handler.guid.title': 'GUID-Based Handler（通訊協定用）',
    'handler.guid.desc':  '使用 SmiHandlerRegister() 或 MmiHandlerRegister() 註冊，綁定特定的 GUID。這是 DXE-MM 通訊的標準跨平台(x86/ARM)方式。當 DXE 發送帶有匹配 GUID 的請求時，MM Core 會分派到此 Handler。',

    'handler.sw.title':   '硬體/軟體特定 Handler',
    'handler.sw.desc':    '在 x86 上通常使用 EFI_SMM_SW_DISPATCH2_PROTOCOL 註冊，綁定特定的 SW SMI 號碼；在 ARM 上可能綁定特定硬體中斷。通常用於 ACPI/ASL 程式碼或硬體事件觸發。',

    'handler.root.title': 'Root MM Handler',
    'handler.root.desc':  '使用 SmiHandlerRegister/MmiHandlerRegister 但 GUID 設為 NULL 來註冊。每次 SMI/MMI 觸發時都會被呼叫，不論來源。用於需要處理所有事件的情況，如效能監控或全域除錯。',

    'handler.lifecycle.title': 'MM 驅動程式生命週期與分派 (SmiManage / MmiManage)',
    'handler.lifecycle.desc':  '驅動程式在啟動階段載入安全記憶體後，透過入口點使用 gSmst 或 gMmst 註冊 Handler。當 MM 事件觸發時，MM Core 透過 SmiManage() 或 MmiManage() 遍歷註冊清單，找到對應的 Handler 並分派執行。',

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
    'code.subtitle':       'EDK2 中 SMM/MM 通訊的核心實作',

    'code.communicate.title': 'Communicate() / MmCommunicate()',
    'code.communicate.desc':  'DXE 端的通訊入口函式，由 MM IPL 實作。驗證參數後觸發軟體陷阱（如 SW SMI 或 SMC）。',

    'code.entrypoint.title':  'MmEntryPoint() / SmmEntryPoint()',
    'code.entrypoint.desc':   'MM 的進入點，CPU 從陷阱進入安全模式後執行的第一個高階函式。',

    'code.smimanage.title':   'MmiManage() / SmiManage()',
    'code.smimanage.desc':    'MM Core 的核心分派函式，根據 GUID 找到並呼叫對應的 Handler。',

    'code.register.title':    'MmiHandlerRegister() 範例',
    'code.register.desc':     'MM 驅動程式如何註冊一個 GUID-based Handler。',

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
    'trigger.title':    'MM Trigger Mechanism (SMI & MMI)',
    'trigger.subtitle': 'Understanding how platforms transition into Management Mode (x86 SMM or ARM StMM)',

    'trigger.x86.title': 'x86 Architecture: SMI Trigger',
    'trigger.swsmi.title': 'Software SMI (SW SMI)',
    'trigger.swsmi.desc':  'Triggered by writing a byte value to I/O port 0xB2. This is the most common way for DXE to communicate with SMM. The Communicate() function of EFI_SMM_COMMUNICATION_PROTOCOL internally writes to 0xB2 to trigger the SMI.',

    'trigger.hwsmi.title': 'Hardware SMI',
    'trigger.hwsmi.desc':  'Triggered by hardware events such as GPIO changes, power button presses, or ACPI timer overflow. These SMIs are generated by the chipset, and the CPU responds automatically.',

    'trigger.entry.title': 'SMM Entry Flow',
    'trigger.entry.desc':  'When an SMI fires: ① All CPU cores receive the SMI signal ② State saved to Save State Area in SMRAM ③ Jump to SMBASE + 0x8000 ④ BSP runs SMM Core, APs wait ⑤ RSM instruction returns execution.',

    'trigger.arm.title': 'ARM Architecture: MMI & Standalone MM',
    'trigger.smc.title': 'Sync MMI (SMC Call)',
    'trigger.smc.desc':  'Active trigger on ARM via SMC (Secure Monitor Call) instruction. This is the ARM equivalent of SW SMI, routing DXE-to-MM requests from Non-Secure EL1/EL2 into EL3, where Trusted Firmware forwards it to StMM in Secure-EL0.',

    'trigger.asyncmmi.title': 'Async MMI (Hardware)',
    'trigger.asyncmmi.desc':  'Hardware-generated secure interrupts (FIQ/IRQ) routed by the interrupt controller (GIC). The GIC tags them as Secure Group interrupts, trapping the CPU into EL3, where the SPM (Secure Partition Manager) handles them.',

    'trigger.stmm_entry.title': 'StMM Entry Flow (EL3 -> S-EL0)',
    'trigger.stmm_entry.desc':  '① SMC or Secure Interrupt traps CPU into EL3 (TF-A) ② SPM switches context to Secure World ③ Drops to S-EL0 to execute Standalone MM Core ④ After processing, SMC returns back to EL3, then back to Non-Secure EL1/EL2.',

    'trigger.port.label':    'Trigger (0xB2 / SMC)',
    'trigger.port.desc':     'Write/Call triggers MM',
    'trigger.cpu.label':     'CPU Response (SMI/EL3)',
    'trigger.cpu.desc':      'Cores halt, trap to secure',
    'trigger.smbase.label':  'MM Core Entry',
    'trigger.smbase.desc':   'Jump to SMBASE / S-EL0',

    /* ---- flow ---- */
    'flow.title':      'Communication Flow',
    'flow.subtitle':   'Step-by-step walkthrough of DXE-MM communication',
    'flow.step.label': 'Step',
    'flow.step.of':    '/',

    'flow.step1.title':  'Step 1: Locate Protocol',
    'flow.step1.desc':   'The DXE driver uses gBS->LocateProtocol() to find an instance of EFI_SMM_COMMUNICATION_PROTOCOL or EFI_MM_COMMUNICATION_PROTOCOL. This protocol is installed by the MM IPL driver at boot time.',
    'flow.step1.detail': 'MM IPL (Initial Program Loader) is a DXE driver responsible for loading the MM Core into secure memory and installing the communication protocol.',

    'flow.step2.title':  'Step 2: Fill Communication Header',
    'flow.step2.desc':   'The DXE driver fills the EFI_MM_COMMUNICATE_HEADER structure: sets HeaderGuid to the target MM handler\'s GUID, MessageLength to the size of Data, and populates Data[] with the request payload.',
    'flow.step2.detail': 'The HeaderGuid is the key used by the MM Core to dispatch requests to the correct handler. Each MM handler specifies its own GUID during registration.',

    'flow.step3.title':  'Step 3: Call Communicate()',
    'flow.step3.desc':   'The DXE driver calls the Communicate() function of the protocol, passing the buffer pointer and size. This function validates parameters and prepares to trigger the transition to secure mode.',
    'flow.step3.detail': 'The implementation typically lives in the architecture-specific MM IPL driver (e.g., PiSmmIpl for x86, or StandaloneMmIpl for ARM).',

    'flow.step4.title':  'Step 4: Trigger MM (SMI / SMC)',
    'flow.step4.desc':   'Inside Communicate(), the communication buffer address is written to a well-known location. Then, a hardware-specific trigger is fired: on x86, writing to I/O port 0xB2 (SW SMI); on ARM, issuing an SMC call.',
    'flow.step4.detail': 'This causes the processor to trap into the highest privilege mode (x86 SMM or ARM EL3) and begin the transition into the secure environment.',

    'flow.step5.title':  'Step 5: CPU Enters MM Core',
    'flow.step5.desc':   'The CPU pauses current execution, saves register state, and traps into secure mode. The secure monitor (SMM Foundation or ARM TF-A/SPM) then routes execution to the MM Core entry point.',
    'flow.step5.detail': 'On x86, cores rendezvous in SMRAM at SMBASE. On ARM, EL3 forwards the request to S-EL0 where the Standalone MM Core resides.',

    'flow.step6.title':  'Step 6: MM Core Dispatch',
    'flow.step6.desc':   'The MM Core reads the HeaderGuid from the communication buffer, searches the registered handler list for a match, and calls MmiManage() (or SmiManage) for dispatch.',
    'flow.step6.detail': 'The manage function iterates through all handlers registered for that GUID, calling each in order until one returns EFI_SUCCESS.',

    'flow.step7.title':  'Step 7: Handler Processes Request',
    'flow.step7.desc':   'The target Handler reads request data from the communication buffer\'s Data[] region, performs the required secure operations (e.g., Secure Variable read/write), and writes the result back.',
    'flow.step7.detail': 'The handler must validate that the communication buffer address is strictly outside secure memory to prevent TOC/TOU and buffer overlap attacks.',

    'flow.step8.title':  'Step 8: Return to Normal World',
    'flow.step8.desc':   'After processing, the MM Core returns execution to the normal world (via RSM on x86, or returning through SMC to EL1/EL2 on ARM). The DXE driver reads the response from the communication buffer.',
    'flow.step8.detail': 'The CPU context is seamlessly restored, returning exactly to the instruction following the DXE driver\'s Communicate() call.',

    /* ---- buffer ---- */
    'buffer.title':      'Communication Buffer Internals',
    'buffer.subtitle':   'Understanding the EFI_MM_COMMUNICATE_HEADER structure and usage',
    'buffer.desc':       'The communication buffer uses the EFI_MM_COMMUNICATE_HEADER (traditionally EFI_SMM_COMMUNICATE_HEADER) structure — the standard format for exchanging data between DXE and MM. HeaderGuid routes the request to the correct handler, MessageLength specifies the Data region size, and Data contains the actual request/response payload.',

    'buffer.struct':     'EFI_MM_COMMUNICATE_HEADER { HeaderGuid, MessageLength, Data[] }',

    'buffer.guid.title': 'HeaderGuid (EFI_GUID, 16 bytes)',
    'buffer.guid.desc':  'Uniquely identifies the target SMI handler. The SMM Core uses this GUID to search for a matching handler in its registered handler list. Each SMM driver specifies its own GUID when calling SmiHandlerRegister().',

    'buffer.len.title':  'MessageLength (UINTN, 4/8 bytes)',
    'buffer.len.desc':   'Specifies the size of the Data[] region in bytes. The SMM Core uses this to determine the total buffer size: sizeof(EFI_GUID) + sizeof(UINTN) + MessageLength. Handlers also use this to validate data integrity.',

    'buffer.data.title': 'Data[] (variable length)',
    'buffer.data.desc':  'The actual request/response payload. The format is defined by the specific SMI handler. DXE fills it with the request; the handler processes it and writes the response back to the same location. The buffer must reside outside SMRAM, and SMM validates the address range.',

    'buffer.validation.title': 'Buffer Validation',
    'buffer.validation.desc':  'The SMM Core performs strict validation before processing: ① Checks that the buffer address is outside SMRAM ② Verifies MessageLength does not cause integer overflow ③ Confirms the entire buffer (Header + Data) does not overlap with SMRAM. This prevents attackers from using crafted buffers to read/write SMRAM contents.',

    /* ---- handler ---- */
    'handler.title':      'MM Handler Registration (SMI & MMI)',
    'handler.subtitle':   'How SMM/MM drivers register handlers to process communication requests',

    'handler.guid.title': 'GUID-Based Handler (for Communication Protocol)',
    'handler.guid.desc':  'Registered using SmiHandlerRegister() or MmiHandlerRegister() with a specific GUID. When DXE sends a request with a matching GUID, the MM Core dispatches to this handler. This is the standardized DXE-MM communication pattern across x86 and ARM.',

    'handler.sw.title':   'Hardware/Software Specific Handler',
    'handler.sw.desc':    'Registered using specific dispatch protocols (like EFI_SMM_SW_DISPATCH2_PROTOCOL on x86). Bound to specific SW SMI numbers or hardware events. Often used by ACPI/ASL or specific hardware triggers.',

    'handler.root.title': 'Root MM Handler',
    'handler.root.desc':  'Registered using SmiHandlerRegister/MmiHandlerRegister with a NULL GUID. Called on every SMI/MMI regardless of source. Used for scenarios requiring handling of all events, such as performance monitoring or debugging.',

    'handler.lifecycle.title': 'MM Driver Lifecycle & Dispatch (SmiManage / MmiManage)',
    'handler.lifecycle.desc':  'Drivers are loaded into secure memory during boot. Their entry points register handlers via gSmst->SmiHandlerRegister or gMmst->MmiHandlerRegister. When an MM event fires, the Core loops through registered handlers via SmiManage() / MmiManage() until one handles the event.',

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
    'code.subtitle':       'Core MM communication implementation in EDK2',

    'code.communicate.title': 'Communicate() / MmCommunicate()',
    'code.communicate.desc':  'The DXE-side communication entry function, implemented by the MM IPL. Validates parameters then triggers the secure trap (e.g. SW SMI or SMC).',

    'code.entrypoint.title':  'MmEntryPoint() / SmmEntryPoint()',
    'code.entrypoint.desc':   'The MM entry point — the first high-level function executed after CPU enters secure mode.',

    'code.smimanage.title':   'MmiManage() / SmiManage()',
    'code.smimanage.desc':    'The MM Core\'s central dispatch function. Finds and calls the matching handler by GUID.',

    'code.register.title':    'MmiHandlerRegister() Example',
    'code.register.desc':     'How an MM driver registers a GUID-based handler.',

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
