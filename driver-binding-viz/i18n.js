/* ------------------------------------------------------------------ */
/*  UEFI Driver Binding Mechanism Visualizer – i18n                    */
/*  Bilingual: English (en) + Traditional Chinese (zh-TW)              */
/* ------------------------------------------------------------------ */

const translations = {
'zh-TW': {
    'page.title': 'UEFI Driver Binding 機制視覺化',

    /* ---- nav ---- */
    'nav.back':         '← 返回工具列表',
    'nav.overview':     '概述',
    'nav.structs':      '內部結構',
    'nav.connect':      'ConnectController',
    'nav.disconnect':   'DisconnectController',
    'nav.scenario':     '實際案例',
    'nav.code':         '程式碼解析',
    'nav.references':   '參考資源',

    /* ---- overview ---- */
    'overview.title':    'UEFI Driver Binding Protocol 概述',
    'overview.subtitle': '理解 EDK2 驅動程式如何被動態綁定到設備',

    'overview.what.title': '什麼是 Driver Binding Protocol？',
    'overview.what.desc':  'EFI_DRIVER_BINDING_PROTOCOL 是 UEFI 驅動程式模型的核心。每個符合 UEFI 驅動程式模型的驅動程式都必須實作此協定，並將其安裝在自己的映像句柄（Image Handle）上。DXE Core 透過 ConnectController() 服務，以此協定為媒介，動態地將驅動程式與設備句柄（Device Handle）綁定。',

    'overview.why.title': '為什麼需要此機制？',
    'overview.why.desc':  'UEFI 採用資料驅動的設備探測模型：驅動程式不在載入時就與硬體綁定，而是由系統在需要時透過標準 API 進行匹配。這使得驅動程式的新增或替換不需修改核心，提供高度的可擴充性與可替換性。',

    'overview.three.title': '三個核心函式',
    'overview.supported.title': 'Supported()',
    'overview.supported.desc':  '測試此驅動程式是否支援指定的 Controller Handle。通常嘗試開啟特定協定（例如 PCI I/O Protocol）並驗證 Vendor ID/Device ID。必須是冪等操作，不得改變系統狀態。',
    'overview.start.title': 'Start()',
    'overview.start.desc':  '在指定的 Controller Handle 上啟動此驅動程式。在此函式中：①開啟所需協定（BY_DRIVER）②配置硬體資源③在控制器或子句柄上安裝此驅動程式提供的協定。',
    'overview.stop.title': 'Stop()',
    'overview.stop.desc':  '從指定的 Controller Handle 停止此驅動程式。必須撤銷 Start() 所做的一切：①解除安裝協定②關閉開啟的協定③銷毀子句柄④釋放所有資源。',

    'overview.connect.title': 'ConnectController() 的角色',
    'overview.connect.desc':  'DXE Core 提供的 BS->ConnectController() 是驅動程式綁定的入口。它遍歷所有已安裝的 EFI_DRIVER_BINDING_PROTOCOL，對每個協定依優先順序（Version 欄位）呼叫 Supported()，找到匹配的驅動程式後呼叫 Start()。',

    /* ---- structs ---- */
    'structs.title':    '內部核心資料結構',
    'structs.subtitle': 'EDK2 DXE Core 如何在記憶體中表示句柄與協定',

    'structs.ihandle.title': 'IHANDLE — 句柄的核心表示',
    'structs.ihandle.desc':  '每個 EFI_HANDLE 實際上是一個指向 IHANDLE 結構的指標。IHANDLE 是 EDK2 Core 私有的結構（定義於 DxeMain.h），外部程式碼只能看到 VOID* 類型的 EFI_HANDLE。',
    'structs.ihandle.sig':   'Signature：魔法數字 \'hand\'，用於驗證指標有效性',
    'structs.ihandle.all':   'AllHandles：連接到全域句柄資料庫 gHandleList 的 LIST_ENTRY',
    'structs.ihandle.protos':'Protocols：此句柄上所有已安裝協定的 LIST_ENTRY 鏈結串列頭部',
    'structs.ihandle.key':   'Key：單調遞增的唯一識別鍵，供 LocateHandleBuffer 使用',

    'structs.proto_iface.title': 'PROTOCOL_INTERFACE — 協定安裝記錄',
    'structs.proto_iface.desc':  '每次呼叫 InstallProtocolInterface() 都會建立一個 PROTOCOL_INTERFACE 結構，記錄「在哪個句柄上安裝了哪個協定、介面指標是什麼」。',
    'structs.proto_iface.sig':   'Signature：\'pi\'，有效性驗證',
    'structs.proto_iface.link':  'Link：連接到所屬 IHANDLE.Protocols 串列的 LIST_ENTRY',
    'structs.proto_iface.handle':'Handle：回指所屬的 IHANDLE',
    'structs.proto_iface.pe':    'Protocol：指向對應 PROTOCOL_ENTRY 的指標（含 GUID）',
    'structs.proto_iface.iface': 'Interface：指向實際協定結構的 void* 指標',
    'structs.proto_iface.open':  'OpenList：透過 OpenProtocol() 開啟此協定的所有記錄串列',

    'structs.proto_entry.title': 'PROTOCOL_ENTRY — 全域協定登錄',
    'structs.proto_entry.desc':  'PROTOCOL_ENTRY 是全域協定資料庫（gProtocolDatabase）中的一個項目，代表某個 GUID 對應的協定類型。同一 GUID 在整個系統中只有一個 PROTOCOL_ENTRY。',
    'structs.proto_entry.sig':   'Signature：\'pe\'',
    'structs.proto_entry.all':   'AllEntries：連接到 gProtocolDatabase 串列',
    'structs.proto_entry.guid':  'ProtocolID：此協定的 EFI_GUID',
    'structs.proto_entry.protos':'Protocols：所有安裝了此協定的 PROTOCOL_INTERFACE 串列',
    'structs.proto_entry.notify':'Notify：此協定的 RegisterProtocolNotify 回呼串列',

    'structs.diagram.title': '三層結構關係圖',
    'structs.diagram.desc':  'gHandleList 串聯所有 IHANDLE；每個 IHANDLE.Protocols 串聯其上所有 PROTOCOL_INTERFACE；每個 PROTOCOL_INTERFACE.Protocol 回指全域 PROTOCOL_ENTRY。',

    /* ---- connect ---- */
    'connect.title':    'ConnectController 逐步流程',
    'connect.subtitle': '觀察 DXE Core 如何將驅動程式動態綁定到設備句柄，以及 IHANDLE 在每個步驟的變化',

    'connect.step1.title': '步驟 1：初始狀態',
    'connect.step1.desc':  '一個 USB XHCI 控制器的設備句柄已由 PCI Bus Driver 建立，並安裝了 EFI_DEVICE_PATH_PROTOCOL 和 EFI_PCI_IO_PROTOCOL。尚未有 USB Host Controller Driver 綁定到此句柄。',
    'connect.step2.title': '步驟 2：ConnectController() 被呼叫',
    'connect.step2.desc':  'BDS 或其他驅動程式呼叫 gBS->ConnectController(ControllerHandle, NULL, NULL, TRUE)。DXE Core 首先在全域句柄列表中找到所有安裝了 EFI_DRIVER_BINDING_PROTOCOL 的句柄，並依 Version 欄位排序（高優先）。',
    'connect.step3.title': '步驟 3：Supported() 輪詢',
    'connect.step3.desc':  'Core 對排序後的每個驅動程式依序呼叫其 Supported() 函式，傳入 ControllerHandle。驅動程式在 Supported() 中嘗試 OpenProtocol(EFI_PCI_IO_PROTOCOL, BY_DRIVER) 並讀取 Class Code，確認是 USB XHCI 控制器後回傳 EFI_SUCCESS。',
    'connect.step4.title': '步驟 4：Start() 被呼叫',
    'connect.step4.desc':  'Supported() 回傳 EFI_SUCCESS 後，Core 立即呼叫同一驅動程式的 Start()。驅動程式在 Start() 中：① 正式 OpenProtocol(EFI_PCI_IO_PROTOCOL, BY_DRIVER) ② 初始化 XHCI 控制器硬體 ③ 建立內部資料結構 ④ 呼叫 InstallProtocolInterface 在 ControllerHandle 上安裝 EFI_USB2_HC_PROTOCOL。',
    'connect.step5.title': '步驟 5：協定安裝後的 IHANDLE',
    'connect.step5.desc':  'InstallProtocolInterface() 建立新的 PROTOCOL_INTERFACE 節點，插入 IHANDLE.Protocols 串列。同時更新全域 PROTOCOL_ENTRY(EFI_USB2_HC_PROTOCOL) 的 Protocols 串列，並觸發已登錄的 RegisterProtocolNotify 回呼。',
    'connect.step6.title': '步驟 6：子句柄建立（Bus Driver）',
    'connect.step6.desc':  'Start() 完成後，USB Bus Driver 的 ConnectController 會接著執行。USB Bus Driver 在 Start() 中為每個偵測到的 USB 裝置呼叫 InstallMultipleProtocolInterfaces，建立子 EFI_HANDLE，並在子句柄上安裝 EFI_DEVICE_PATH_PROTOCOL 和 EFI_USB_IO_PROTOCOL。',
    'connect.step7.title': '步驟 7：完成',
    'connect.step7.desc':  'ConnectController() 完成。此時 XHCI 控制器句柄已有 Device Path、PCI IO、USB2 HC 三個協定；每個 USB 設備子句柄各有 Device Path 和 USB IO 協定。系統可以透過這些協定與硬體互動。',

    /* ---- disconnect ---- */
    'disconnect.title':    'DisconnectController / Stop() 逐步流程',
    'disconnect.subtitle': '觀察 DXE Core 如何拆除驅動程式綁定並清理 IHANDLE',

    'disconnect.step1.title': '步驟 1：DisconnectController() 被呼叫',
    'disconnect.step1.desc':  '呼叫 gBS->DisconnectController(ControllerHandle, NULL, NULL)。DXE Core 在 ControllerHandle 的 Protocols 串列中，找出所有透過 BY_DRIVER 模式開啟協定的驅動程式記錄（OPEN_PROTOCOL_DATA）。',
    'disconnect.step2.title': '步驟 2：先停止子句柄',
    'disconnect.step2.desc':  'Core 必須先遞迴停止所有子句柄。對 USB Bus Driver 建立的每個子 Handle 呼叫 DisconnectController，確保子驅動程式都已執行 Stop() 後，才繼續停止父控制器上的驅動程式。',
    'disconnect.step3.title': '步驟 3：Stop() 被呼叫',
    'disconnect.step3.desc':  'Core 呼叫 USB Host Controller Driver 的 Stop(ControllerHandle, NumberOfChildren, ChildHandleBuffer)。驅動程式在 Stop() 中：① 卸載 EFI_USB2_HC_PROTOCOL（UninstallProtocolInterface）② 停止硬體 ③ 關閉開啟的 EFI_PCI_IO_PROTOCOL（CloseProtocol）④ 釋放所有配置的記憶體。',
    'disconnect.step4.title': '步驟 4：UninstallProtocolInterface',
    'disconnect.step4.desc':  'UninstallProtocolInterface() 從 IHANDLE.Protocols 串列中移除對應的 PROTOCOL_INTERFACE 節點，並從全域 PROTOCOL_ENTRY.Protocols 串列中取消鏈結。如果該協定有 RegisterProtocolNotify 回呼，會通知已登錄的事件。',
    'disconnect.step5.title': '步驟 5：子句柄銷毀',
    'disconnect.step5.desc':  'USB Bus Driver 的 Stop() 呼叫 UninstallMultipleProtocolInterfaces 移除子句柄上的所有協定，然後呼叫 FreePool 釋放 IHANDLE 記憶體，並從 gHandleList 中取消鏈結。子 EFI_HANDLE 現在是無效指標。',
    'disconnect.step6.title': '步驟 6：完成 — 還原初始狀態',
    'disconnect.step6.desc':  'DisconnectController() 完成。ControllerHandle 的 IHANDLE.Protocols 串列已回到只剩 EFI_DEVICE_PATH_PROTOCOL 和 EFI_PCI_IO_PROTOCOL 的初始狀態。USB 子句柄已不存在。',

    /* ---- scenario ---- */
    'scenario.title':    '實際案例：PCI 設備完整綁定鏈',
    'scenario.subtitle': '從 PCI 列舉到 Disk I/O Protocol 的完整 Driver Binding 過程',
    'scenario.desc':     '以下展示一個 NVMe SSD 連接在 PCIe 匯流排上時，完整的 Driver Binding 鏈：PCI Host Bridge Driver → PCI Bus Driver → NVMe Controller Driver。每一層的父驅動程式建立子句柄後，下一層驅動程式再綁定到子句柄。',

    'scenario.layer0': 'PCI Host Bridge（Root Handle）',
    'scenario.layer1': 'PCI Bus Driver 建立 PCI Device Handles',
    'scenario.layer2': 'NVMe Driver 綁定到 NVMe PCI Device',
    'scenario.layer3': 'Partition Driver 建立磁碟分割子句柄',

    'scenario.l0.desc': 'PCI Host Bridge Driver 在 Root Bridge Handle 上安裝 EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL。此句柄代表整個 PCI 匯流排空間。',
    'scenario.l1.desc': 'PCI Bus Driver 的 Start() 列舉所有 PCI 設備，對每個設備建立子 EFI_HANDLE，安裝 EFI_PCI_IO_PROTOCOL 和 EFI_DEVICE_PATH_PROTOCOL。',
    'scenario.l2.desc': 'NVMe Controller Driver 的 Supported() 確認 PCI Class Code 為 0x010802（NVMe），Start() 初始化控制器並安裝 EFI_NVM_EXPRESS_PASS_THRU_PROTOCOL 和 EFI_BLOCK_IO_PROTOCOL。',
    'scenario.l3.desc': 'Partition Driver 透過 EFI_BLOCK_IO_PROTOCOL 讀取 GPT 表，對每個分割區建立子句柄，安裝 EFI_BLOCK_IO_PROTOCOL（分割區範圍）和 EFI_DEVICE_PATH_PROTOCOL（含 GPT 分割區節點）。',

    /* ---- code ---- */
    'code.title':    '關鍵程式碼解析',
    'code.subtitle': 'EDK2 DXE Core 中實作 Driver Binding 的核心程式碼',

    'code.connect.title': 'CoreConnectController() 核心邏輯',
    'code.connect.file':  '來源：MdeModulePkg/Core/Dxe/Hand/DriverSupport.c',
    'code.install.title': 'CoreInstallProtocolInterface() 核心邏輯',
    'code.install.file':  '來源：MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'code.binding.title': '典型 Driver Binding Protocol 實作',
    'code.binding.file':  '範例：一個簡化的 USB Host Controller Driver',

    /* ---- references ---- */
    'references.title':  '參考資源',
    'references.desc':   '以下規格文件與原始碼是本頁面的知識來源',

    'ref.uefi.title':   'UEFI Specification 2.10 — Section 11: Protocols — Driver Binding Protocol',
    'ref.uefi.desc':    '定義 EFI_DRIVER_BINDING_PROTOCOL 結構、Supported/Start/Stop 語義、ConnectController/DisconnectController 演算法。',
    'ref.pi.title':     'UEFI Platform Initialization Specification — Volume 2: Driver Execution Environment',
    'ref.pi.desc':      '定義 DXE Core 服務、驅動程式模型、IHANDLE/PROTOCOL_INTERFACE 記憶體模型。',
    'ref.edk2.hand':    'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'ref.edk2.hand.desc':'CoreInstallProtocolInterface、CoreUninstallProtocolInterface、CoreLocateHandle 的實作。',
    'ref.edk2.drv':     'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/DriverSupport.c',
    'ref.edk2.drv.desc':'CoreConnectController、CoreDisconnectController、CoreConnectSingleController 的實作。',
    'ref.edk2.main':    'EDK2 Source: MdeModulePkg/Core/Dxe/DxeMain.h',
    'ref.edk2.main.desc':'IHANDLE、PROTOCOL_INTERFACE、PROTOCOL_ENTRY、OPEN_PROTOCOL_DATA 結構定義。',

    /* ---- buttons ---- */
    'btn.prev':  '← 上一步',
    'btn.next':  '下一步 →',
    'btn.reset': '重置',

    /* ---- footer ---- */
    'footer.text': 'UEFI Driver Binding 機制視覺化 | 教育用途',
},

/* ================================================================== */
/*  English                                                             */
/* ================================================================== */
'en': {
    'page.title': 'UEFI Driver Binding Mechanism Visualizer',

    /* ---- nav ---- */
    'nav.back':         '← Back to Tools',
    'nav.overview':     'Overview',
    'nav.structs':      'Data Structures',
    'nav.connect':      'ConnectController',
    'nav.disconnect':   'DisconnectController',
    'nav.scenario':     'Real Scenario',
    'nav.code':         'Code Walkthrough',
    'nav.references':   'References',

    /* ---- overview ---- */
    'overview.title':    'UEFI Driver Binding Protocol Overview',
    'overview.subtitle': 'Understanding how EDK2 drivers are dynamically bound to device handles',

    'overview.what.title': 'What is the Driver Binding Protocol?',
    'overview.what.desc':  'EFI_DRIVER_BINDING_PROTOCOL is the core of the UEFI Driver Model. Every UEFI-model-compliant driver must implement this protocol and install it on its own Image Handle. The DXE Core uses ConnectController() to dynamically bind drivers to device handles through this protocol as an intermediary.',

    'overview.why.title': 'Why this mechanism?',
    'overview.why.desc':  'UEFI uses a data-driven device probing model: drivers are not bound to hardware at load time. Instead, the system matches them on demand through standardized APIs. This allows adding or replacing drivers without modifying the core, providing high extensibility and replaceability.',

    'overview.three.title': 'Three Core Functions',
    'overview.supported.title': 'Supported()',
    'overview.supported.desc':  'Tests whether the driver supports a given Controller Handle. Typically tries to open a specific protocol (e.g. PCI I/O Protocol) and checks Vendor ID/Device ID. Must be idempotent — must not change system state.',
    'overview.start.title': 'Start()',
    'overview.start.desc':  'Starts the driver on a given Controller Handle. Inside Start(): ① Open required protocols (BY_DRIVER) ② Configure hardware resources ③ Install protocols on the controller or child handles.',
    'overview.stop.title': 'Stop()',
    'overview.stop.desc':  'Stops the driver on a given Controller Handle. Must undo everything Start() did: ① Uninstall protocols ② Close opened protocols ③ Destroy child handles ④ Free all resources.',

    'overview.connect.title': 'The Role of ConnectController()',
    'overview.connect.desc':  'BS->ConnectController() provided by DXE Core is the entry point for driver binding. It iterates all installed EFI_DRIVER_BINDING_PROTOCOL instances, calls Supported() for each in priority order (by Version field), and calls Start() on the first match.',

    /* ---- structs ---- */
    'structs.title':    'Internal Core Data Structures',
    'structs.subtitle': 'How the EDK2 DXE Core represents handles and protocols in memory',

    'structs.ihandle.title': 'IHANDLE — The Core Handle Representation',
    'structs.ihandle.desc':  'Every EFI_HANDLE is actually a pointer to an IHANDLE structure. IHANDLE is a private EDK2 Core structure (defined in DxeMain.h); external code only sees VOID* as EFI_HANDLE.',
    'structs.ihandle.sig':   'Signature: magic number \'hand\', used to validate pointer integrity',
    'structs.ihandle.all':   'AllHandles: LIST_ENTRY linking into the global handle database gHandleList',
    'structs.ihandle.protos':'Protocols: LIST_ENTRY head of all installed PROTOCOL_INTERFACEs on this handle',
    'structs.ihandle.key':   'Key: monotonically increasing unique key, used by LocateHandleBuffer',

    'structs.proto_iface.title': 'PROTOCOL_INTERFACE — Protocol Installation Record',
    'structs.proto_iface.desc':  'Every call to InstallProtocolInterface() creates a PROTOCOL_INTERFACE structure recording "on which handle was which protocol installed, and what is the interface pointer".',
    'structs.proto_iface.sig':   'Signature: \'pi\', validity check',
    'structs.proto_iface.link':  'Link: LIST_ENTRY linking into the owning IHANDLE.Protocols list',
    'structs.proto_iface.handle':'Handle: back-pointer to the owning IHANDLE',
    'structs.proto_iface.pe':    'Protocol: pointer to the corresponding PROTOCOL_ENTRY (contains GUID)',
    'structs.proto_iface.iface': 'Interface: void* pointer to the actual protocol structure',
    'structs.proto_iface.open':  'OpenList: list of all OPEN_PROTOCOL_DATA records (consumers of this protocol)',

    'structs.proto_entry.title': 'PROTOCOL_ENTRY — Global Protocol Registry',
    'structs.proto_entry.desc':  'PROTOCOL_ENTRY is an entry in the global protocol database (gProtocolDatabase) representing a protocol type identified by a GUID. There is exactly one PROTOCOL_ENTRY per GUID in the entire system.',
    'structs.proto_entry.sig':   'Signature: \'pe\'',
    'structs.proto_entry.all':   'AllEntries: links into gProtocolDatabase list',
    'structs.proto_entry.guid':  'ProtocolID: the EFI_GUID of this protocol',
    'structs.proto_entry.protos':'Protocols: list of all PROTOCOL_INTERFACEs installed with this GUID',
    'structs.proto_entry.notify':'Notify: list of RegisterProtocolNotify callbacks for this protocol',

    'structs.diagram.title': 'Three-Layer Structure Relationship',
    'structs.diagram.desc':  'gHandleList chains all IHANDLEs; each IHANDLE.Protocols chains all its PROTOCOL_INTERFACEs; each PROTOCOL_INTERFACE.Protocol back-references the global PROTOCOL_ENTRY.',

    /* ---- connect ---- */
    'connect.title':    'ConnectController Step-by-Step',
    'connect.subtitle': 'Watch how DXE Core dynamically binds a driver to a device handle, and how IHANDLE changes at each step',

    'connect.step1.title': 'Step 1: Initial State',
    'connect.step1.desc':  'A USB XHCI controller device handle has been created by the PCI Bus Driver with EFI_DEVICE_PATH_PROTOCOL and EFI_PCI_IO_PROTOCOL installed. No USB Host Controller Driver is yet bound to this handle.',
    'connect.step2.title': 'Step 2: ConnectController() Called',
    'connect.step2.desc':  'BDS or another driver calls gBS->ConnectController(ControllerHandle, NULL, NULL, TRUE). DXE Core first finds all handles with EFI_DRIVER_BINDING_PROTOCOL installed in the global handle list, and sorts them by Version field (higher = higher priority).',
    'connect.step3.title': 'Step 3: Supported() Polling',
    'connect.step3.desc':  'Core calls each driver\'s Supported() in sorted order, passing in ControllerHandle. The USB driver tries OpenProtocol(EFI_PCI_IO_PROTOCOL, BY_DRIVER) and reads the PCI Class Code, confirming it is a USB XHCI controller (0x0C0330) and returns EFI_SUCCESS.',
    'connect.step4.title': 'Step 4: Start() Called',
    'connect.step4.desc':  'After Supported() returns EFI_SUCCESS, Core immediately calls the same driver\'s Start(). The driver: ① Formally OpenProtocol(EFI_PCI_IO_PROTOCOL, BY_DRIVER) ② Initializes the XHCI controller hardware ③ Creates internal data structures ④ Calls InstallProtocolInterface to install EFI_USB2_HC_PROTOCOL on ControllerHandle.',
    'connect.step5.title': 'Step 5: IHANDLE After Start()',
    'connect.step5.desc':  'InstallProtocolInterface() creates a new PROTOCOL_INTERFACE node and inserts it into the IHANDLE.Protocols list. It also updates the global PROTOCOL_ENTRY(EFI_USB2_HC_PROTOCOL).Protocols list and fires any RegisterProtocolNotify callbacks.',
    'connect.step6.title': 'Step 6: Child Handle Creation (Bus Driver)',
    'connect.step6.desc':  'After Start() completes, ConnectController for the USB Bus Driver runs next. USB Bus Driver\'s Start() calls InstallMultipleProtocolInterfaces for each detected USB device, creating a child EFI_HANDLE with EFI_DEVICE_PATH_PROTOCOL and EFI_USB_IO_PROTOCOL installed.',
    'connect.step7.title': 'Step 7: Complete',
    'connect.step7.desc':  'ConnectController() is done. The XHCI controller handle now has Device Path, PCI IO, and USB2 HC protocols; each USB device child handle has Device Path and USB IO. The system can now interact with hardware through these protocols.',

    /* ---- disconnect ---- */
    'disconnect.title':    'DisconnectController / Stop() Step-by-Step',
    'disconnect.subtitle': 'Watch how DXE Core tears down driver bindings and cleans up IHANDLE',

    'disconnect.step1.title': 'Step 1: DisconnectController() Called',
    'disconnect.step1.desc':  'gBS->DisconnectController(ControllerHandle, NULL, NULL) is called. DXE Core inspects the ControllerHandle\'s Protocols list, finding all OPEN_PROTOCOL_DATA records with BY_DRIVER attribute to identify which drivers are managing this handle.',
    'disconnect.step2.title': 'Step 2: Stop Child Handles First',
    'disconnect.step2.desc':  'Core must recursively stop all child handles first. DisconnectController is called on each child Handle created by the USB Bus Driver, ensuring all child drivers have executed Stop() before proceeding to stop drivers on the parent controller.',
    'disconnect.step3.title': 'Step 3: Stop() Called',
    'disconnect.step3.desc':  'Core calls USB Host Controller Driver\'s Stop(ControllerHandle, NumberOfChildren, ChildHandleBuffer). The driver: ① Uninstalls EFI_USB2_HC_PROTOCOL (UninstallProtocolInterface) ② Stops hardware ③ Closes the EFI_PCI_IO_PROTOCOL (CloseProtocol) ④ Frees all allocated memory.',
    'disconnect.step4.title': 'Step 4: UninstallProtocolInterface',
    'disconnect.step4.desc':  'UninstallProtocolInterface() removes the corresponding PROTOCOL_INTERFACE node from IHANDLE.Protocols list and unlinks it from the global PROTOCOL_ENTRY.Protocols list. Any RegisterProtocolNotify events for this protocol are notified.',
    'disconnect.step5.title': 'Step 5: Child Handle Destruction',
    'disconnect.step5.desc':  'USB Bus Driver\'s Stop() calls UninstallMultipleProtocolInterfaces to remove all protocols from child handles, then FreePool to release the IHANDLE memory and unlink from gHandleList. The child EFI_HANDLEs are now invalid pointers.',
    'disconnect.step6.title': 'Step 6: Complete — Restored to Initial State',
    'disconnect.step6.desc':  'DisconnectController() is complete. The ControllerHandle\'s IHANDLE.Protocols list is back to only EFI_DEVICE_PATH_PROTOCOL and EFI_PCI_IO_PROTOCOL. USB child handles no longer exist.',

    /* ---- scenario ---- */
    'scenario.title':    'Real-World Scenario: Full PCI Device Binding Chain',
    'scenario.subtitle': 'Complete Driver Binding chain from PCI enumeration to Disk I/O Protocol',
    'scenario.desc':     'This shows the complete Driver Binding chain for an NVMe SSD on a PCIe bus: PCI Host Bridge Driver → PCI Bus Driver → NVMe Controller Driver. Each parent driver creates child handles which the next-layer driver then binds to.',

    'scenario.layer0': 'PCI Host Bridge (Root Handle)',
    'scenario.layer1': 'PCI Bus Driver creates PCI Device Handles',
    'scenario.layer2': 'NVMe Driver binds to NVMe PCI Device',
    'scenario.layer3': 'Partition Driver creates partition child handles',

    'scenario.l0.desc': 'PCI Host Bridge Driver installs EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL on the Root Bridge Handle, representing the entire PCI bus space.',
    'scenario.l1.desc': 'PCI Bus Driver\'s Start() enumerates all PCI devices and creates child EFI_HANDLEs for each, installing EFI_PCI_IO_PROTOCOL and EFI_DEVICE_PATH_PROTOCOL.',
    'scenario.l2.desc': 'NVMe Controller Driver\'s Supported() confirms PCI Class Code is 0x010802 (NVMe). Start() initializes the controller and installs EFI_NVM_EXPRESS_PASS_THRU_PROTOCOL and EFI_BLOCK_IO_PROTOCOL.',
    'scenario.l3.desc': 'Partition Driver reads the GPT table via EFI_BLOCK_IO_PROTOCOL, creates child handles per partition, installs EFI_BLOCK_IO_PROTOCOL (partition range) and EFI_DEVICE_PATH_PROTOCOL (with GPT partition node).',

    /* ---- code ---- */
    'code.title':    'Key Code Walkthrough',
    'code.subtitle': 'Core EDK2 DXE source code implementing the Driver Binding mechanism',

    'code.connect.title': 'CoreConnectController() Core Logic',
    'code.connect.file':  'Source: MdeModulePkg/Core/Dxe/Hand/DriverSupport.c',
    'code.install.title': 'CoreInstallProtocolInterface() Core Logic',
    'code.install.file':  'Source: MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'code.binding.title': 'Typical Driver Binding Protocol Implementation',
    'code.binding.file':  'Example: Simplified USB Host Controller Driver',

    /* ---- references ---- */
    'references.title':  'References',
    'references.desc':   'The following specifications and source files are the knowledge basis for this page',

    'ref.uefi.title':   'UEFI Specification 2.10 — Section 11: Protocols — Driver Binding Protocol',
    'ref.uefi.desc':    'Defines EFI_DRIVER_BINDING_PROTOCOL structure, Supported/Start/Stop semantics, ConnectController/DisconnectController algorithm.',
    'ref.pi.title':     'UEFI Platform Initialization Specification — Volume 2: Driver Execution Environment',
    'ref.pi.desc':      'Defines DXE Core services, driver model, IHANDLE/PROTOCOL_INTERFACE memory model.',
    'ref.edk2.hand':    'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/Handle.c',
    'ref.edk2.hand.desc':'Implementation of CoreInstallProtocolInterface, CoreUninstallProtocolInterface, CoreLocateHandle.',
    'ref.edk2.drv':     'EDK2 Source: MdeModulePkg/Core/Dxe/Hand/DriverSupport.c',
    'ref.edk2.drv.desc':'Implementation of CoreConnectController, CoreDisconnectController, CoreConnectSingleController.',
    'ref.edk2.main':    'EDK2 Source: MdeModulePkg/Core/Dxe/DxeMain.h',
    'ref.edk2.main.desc':'Structure definitions for IHANDLE, PROTOCOL_INTERFACE, PROTOCOL_ENTRY, OPEN_PROTOCOL_DATA.',

    /* ---- buttons ---- */
    'btn.prev':  '← Prev',
    'btn.next':  'Next →',
    'btn.reset': 'Reset',

    /* ---- footer ---- */
    'footer.text': 'UEFI Driver Binding Mechanism Visualizer | Educational Purpose',
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
