/* ------------------------------------------------------------------ */
/*  PCI Subsystem Visualizer – i18n                                    */
/*  Bilingual: English (en) + Traditional Chinese (zh-TW)              */
/* ------------------------------------------------------------------ */

const translations = {
'zh-TW': {
    'page.title': 'UEFI PCI 子系統視覺化',

    /* ---- nav ---- */
    'nav.back':          '← 返回工具列表',
    'nav.overview':      '概述',
    'nav.configspace':   '配置空間',
    'nav.access':        '存取機制',
    'nav.enumeration':   'PCI 列舉',
    'nav.rootbridge':    'Root Bridge IO',
    'nav.pciio':         'PCI IO',
    'nav.archcompare':   '架構比較',
    'nav.code':          '程式碼解析',
    'nav.references':    '參考資源',

    /* ---- overview ---- */
    'overview.title':    'UEFI PCI 子系統概述',
    'overview.subtitle': '理解 UEFI EDK2 如何發現、列舉和管理 PCI/PCIe 設備',

    'overview.what.title': '什麼是 PCI/PCIe？',
    'overview.what.desc':  'PCI（Peripheral Component Interconnect）和其後續版本 PCIe（PCI Express）是電腦中最重要的匯流排標準。幾乎所有現代外接設備（網路卡、顯示卡、NVMe SSD、USB 控制器）都透過 PCIe 連接到 CPU。每個 PCI 設備擁有一個標準化的配置空間（Configuration Space），供韌體和作業系統發現和配置設備。',

    'overview.why.title': '為什麼 BIOS 工程師需要理解 PCI？',
    'overview.why.desc':  'UEFI 韌體負責在作業系統啟動之前完成所有 PCI 設備的發現和初始化。這包括：掃描所有匯流排發現設備、讀取和配置 BAR（Base Address Register）、分配記憶體和 I/O 資源、安裝 PCI IO Protocol 供驅動程式使用。任何 PCI 初始化錯誤都可能導致設備無法使用或系統無法開機。',

    'overview.arch.title': 'x86_64 vs ARM64',
    'overview.arch.desc':  'x86 平台支援兩種配置空間存取方式：傳統 I/O 埠（CF8h/CFCh）和記憶體映射（ECAM/MMCONFIG）。ARM64 平台僅使用 ECAM（Enhanced Configuration Access Mechanism）透過記憶體映射存取。EDK2 透過抽象層（PciSegmentLib、PciHostBridgeDxe）統一兩種架構的差異。',

    /* ---- phase timeline ---- */
    'phase.pei':     'PEI 階段',
    'phase.dxe':     'DXE 列舉',
    'phase.assign':  '資源分配',
    'phase.driver':  '驅動安裝',
    'phase.bds':     'BDS 啟動',

    /* ---- config space ---- */
    'config.title':    'PCI 配置空間',
    'config.subtitle': '完整的 256-byte PCI 標頭和 4K PCIe 延伸配置空間',

    'config.type0.title': 'Type 0 標頭（端點設備）',
    'config.type0.desc':  '所有 PCI/PCIe 端點設備（網路卡、顯示卡、NVMe 控制器等）使用 Type 0 標頭。包含 6 個 BAR（Base Address Register），用於映射設備的記憶體或 I/O 區間。Vendor ID 和 Device ID 是設備的唯一標識，驅動程式透過這兩個值來匹配對應的驅動程式。',

    'config.type1.title': 'Type 1 標頭（PCI 橋接器）',
    'config.type1.desc':  'PCI-to-PCI 橋接器使用 Type 1 標頭。橋接器負責連接不同的 PCI 匯流排段，包含 Primary、Secondary 和 Subordinate Bus Number 來定義匯流排階層。橋接器也定義了下游設備可使用的 I/O、Memory 和 Prefetchable Memory 範圍。',

    'config.extended.title': 'PCIe 延伸配置空間',
    'config.extended.desc':  'PCIe 將配置空間從 256 bytes 擴展到 4096 bytes（0x100-0xFFF）。延伸空間包含 PCIe 特有的 Capability 結構，如 AER（Advanced Error Reporting）、ACS（Access Control Services）、L1 PM Substates 等。延伸空間只能透過 ECAM（記憶體映射）存取，不支援傳統 CF8/CFC 方式。',

    'config.toggle.type0': 'Type 0（端點）',
    'config.toggle.type1': 'Type 1（橋接器）',
    'config.toggle.extended': 'PCIe 延伸',

    /* ---- config register details ---- */
    'reg.vendorid':     'Vendor ID — 由 PCI-SIG 分配的廠商識別碼（如 Intel=8086h, AMD=1022h）',
    'reg.deviceid':     'Device ID — 廠商自訂的設備型號識別碼',
    'reg.command':      'Command — 控制設備行為（Memory Space Enable, Bus Master Enable 等）',
    'reg.status':       'Status — 設備狀態旗標（Capabilities List, Interrupt Status 等）',
    'reg.revisionid':   'Revision ID — 設備硬體修訂版本',
    'reg.classcode':    'Class Code — 設備功能分類（3 bytes: Base Class, Sub-Class, Prog IF）',
    'reg.cacheline':    'Cache Line Size — 系統快取行大小（以 DWORD 為單位）',
    'reg.latency':      'Latency Timer — PCI 匯流排仲裁延遲計時器',
    'reg.headertype':   'Header Type — 標頭類型（Bit 7: 多功能設備, Bit 0-6: 0=端點, 1=橋接器）',
    'reg.bist':         'BIST — 內建自我測試（Built-In Self Test）',
    'reg.bar':          'BAR — Base Address Register: 定義設備的記憶體或 I/O 映射區間',
    'reg.subsystem':    'Subsystem Vendor/Device ID — 子系統（主機板/OEM）識別碼',
    'reg.exprom':       'Expansion ROM — Option ROM 基底位址',
    'reg.capptr':       'Capabilities Pointer — 指向第一個 Capability 結構的偏移量',
    'reg.intline':      'Interrupt Line — 中斷線路號（由韌體填入）',
    'reg.intpin':       'Interrupt Pin — 設備使用的中斷引腳（INTA# ~ INTD#）',
    'reg.pribus':       'Primary Bus — 橋接器上游匯流排號',
    'reg.secbus':       'Secondary Bus — 橋接器下游匯流排號',
    'reg.subbus':       'Subordinate Bus — 橋接器下游可達的最大匯流排號',
    'reg.iobase':       'I/O Base/Limit — 橋接器轉發的 I/O 地址範圍',
    'reg.membase':      'Memory Base/Limit — 橋接器轉發的不可預取記憶體範圍',
    'reg.prefbase':     'Prefetchable Base/Limit — 橋接器轉發的可預取記憶體範圍',
    'reg.bridgectrl':   'Bridge Control — 橋接器控制暫存器（ISA Mode, VGA Enable 等）',

    /* ---- access ---- */
    'access.title':    '配置空間存取機制',
    'access.subtitle': 'x86 與 ARM 平台如何讀寫 PCI 配置空間',

    'access.x86.title':    'x86_64 存取方式',
    'access.legacy.title': '傳統 I/O 埠方式（CF8h/CFCh）',
    'access.legacy.desc':  '最早的 PCI 配置空間存取方式。向 0xCF8（CONFIG_ADDRESS）寫入匯流排/設備/功能/偏移量的組合值，然後從 0xCFC（CONFIG_DATA）讀寫資料。此方式僅支援 256 bytes 配置空間，且同一時間只能存取一個暫存器，需要鎖定保護。EDK2 對應 PciCf8Lib。',

    'access.ecam.title': 'ECAM / MMCONFIG 方式',
    'access.ecam.desc':  'PCIe 引入的記憶體映射存取機制。MCFG ACPI 表提供 ECAM 基底位址，完整的配置空間被映射到連續的記憶體區域。位址計算：ECAM_BASE + (Bus << 20) + (Dev << 15) + (Fun << 12) + Offset。支援完整 4K 延伸配置空間，且可使用普通記憶體讀寫指令。EDK2 對應 PciExpressLib。',

    'access.arm.title':   'ARM64 存取方式',
    'access.arm.ecam.title': '純 ECAM（記憶體映射）',
    'access.arm.ecam.desc':  'ARM64 平台不支援 I/O 埠，完全依賴 ECAM 記憶體映射存取 PCI 配置空間。ECAM 基底位址同樣由 MCFG ACPI 表或設備樹提供。存取方式與 x86 ECAM 相同，使用同一位址計算公式。EDK2 透過 PciSegmentLib 提供統一的抽象介面。',

    'access.formula.title': '位址計算公式',
    'access.formula': 'ECAM_BASE + (Bus << 20) + (Dev << 15) + (Fun << 12) + Offset',

    'access.cf8.format': 'CF8h 格式: [31]=Enable | [23:16]=Bus | [15:11]=Dev | [10:8]=Fun | [7:2]=Offset | [1:0]=00',

    /* ---- enumeration ---- */
    'enum.title':    'PCI 列舉流程',
    'enum.subtitle': 'PciBusDxe 完整的設備發現與資源分配流程',

    'enum.step1.title':  '步驟 1：Host Bridge 資源分配協議',
    'enum.step1.desc':   '平台程式碼產生 EFI_PCI_HOST_BRIDGE_RESOURCE_ALLOCATION_PROTOCOL',
    'enum.step1.detail': '平台的 PciHostBridgeDxe 驅動程式啟動，根據平台的硬體拓撲（通常由 ACPI 表或硬體暫存器描述），建立 Host Bridge 和 Root Bridge 資料結構。它安裝 EFI_PCI_HOST_BRIDGE_RESOURCE_ALLOCATION_PROTOCOL 到 Host Bridge Handle 上，供後續的 PCI Bus 驅動程式使用。',

    'enum.step2.title':  '步驟 2：建立 Root Bridge',
    'enum.step2.desc':   'PciHostBridgeDxe 建立 Root Bridge，安裝 EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL',
    'enum.step2.detail': '對於每個 PCI Root Bridge（一個系統可能有多個），驅動程式分配 PCI_ROOT_BRIDGE_INSTANCE 結構，初始化匯流排範圍（如 Bus 0-255）和資源視窗（MMIO、I/O、Prefetchable Memory），然後在對應的 Handle 上安裝 EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL。',

    'enum.step3.title':  '步驟 3：PciBusDxe 啟動',
    'enum.step3.desc':   'PciBusDxe 透過 Supported()/Start() 綁定到 Root Bridge Handle',
    'enum.step3.detail': 'PciBusDxe 是 UEFI Bus Driver，它實作 EFI_DRIVER_BINDING_PROTOCOL。在 Supported() 中檢查 Handle 是否有 PCI Root Bridge IO Protocol。在 Start() 中開始列舉流程，透過 OpenProtocol() 取得 Root Bridge IO Protocol 的存取權。',

    'enum.step4.title':  '步驟 4：匯流排掃描',
    'enum.step4.desc':   '遍歷 Bus 0-255, Device 0-31, Function 0-7',
    'enum.step4.detail': 'PciBusDxe 使用三層迴圈掃描 PCI 拓撲。對每個 Bus:Dev:Fun 組合，讀取配置空間偏移 0x00 處的 Vendor ID。如果 Vendor ID 為 0xFFFF，表示該位置沒有設備。對於存在的設備，檢查 Header Type 的 Bit 7 來判斷是否為多功能設備。',

    'enum.step5.title':  '步驟 5：設備偵測',
    'enum.step5.desc':   '讀取 Vendor ID（0xFFFF = 無設備），檢查 Header Type Bit 7（多功能）',
    'enum.step5.detail': '當 Vendor ID ≠ 0xFFFF 時，設備存在。讀取 Header Type 暫存器：Bit 0-6 指示標頭類型（0x00=Type 0 端點, 0x01=Type 1 橋接器），Bit 7 指示多功能設備。如果 Function 0 的 Bit 7 為 0，則跳過 Function 1-7 的掃描。',

    'enum.step6.title':  '步驟 6：建立設備結構',
    'enum.step6.desc':   '為每個發現的設備分配 PCI_IO_DEVICE 結構',
    'enum.step6.detail': 'PciBusDxe 為每個偵測到的設備建立 PCI_IO_DEVICE 內部資料結構，記錄 Bus/Dev/Fun、Vendor/Device ID、Class Code、Header Type 等資訊。如果發現 Type 1（橋接器），還會遞迴掃描橋接器下游的匯流排。',

    'enum.step7.title':  '步驟 7：BAR 大小探測',
    'enum.step7.desc':   '寫入 0xFFFFFFFF → 讀回 → 計算大小和類型（MMIO/IO/64-bit）',
    'enum.step7.detail': 'BAR sizing 是 PCI 列舉的關鍵步驟。對每個 BAR：① 儲存原始值 ② 寫入全 1（0xFFFFFFFF）③ 讀回值，低位的固定 bits 表示對齊需求（即大小）④ 恢復原始值。Bit 0 區分 Memory（0）或 I/O（1）BAR。Memory BAR 的 Bit 1-2 指示 32-bit 或 64-bit 定址。',

    'enum.step8.title':  '步驟 8：資源需求提交',
    'enum.step8.desc':   '收集所有資源需求 → 提交給 Host Bridge 進行分配',
    'enum.step8.detail': 'PciBusDxe 匯總所有設備的資源需求（MMIO 大小、I/O 範圍、Prefetchable Memory），透過 EFI_PCI_HOST_BRIDGE_RESOURCE_ALLOCATION_PROTOCOL 的 SubmitResources() 提交給 Host Bridge。Host Bridge 與平台邏輯協作，決定每個資源視窗的起始位址。',

    'enum.step9.title':  '步驟 9：位址分配',
    'enum.step9.desc':   'Host Bridge 分配位址視窗 → 寫入 BAR 位址',
    'enum.step9.detail': 'Host Bridge 完成資源分配後（透過 NotifyPhase(EfiPciHostBridgeSetResources)），PciBusDxe 從 GetProposedResources() 取得分配結果，將計算好的基底位址寫入每個設備的 BAR 暫存器和橋接器的 Base/Limit 暫存器。',

    'enum.step10.title': '步驟 10：安裝 PCI IO Protocol',
    'enum.step10.desc':  '在每個設備 Handle 上安裝 EFI_PCI_IO_PROTOCOL',
    'enum.step10.detail':'PciBusDxe 為每個列舉到的 PCI 設備建立一個新的 Handle，並安裝 EFI_PCI_IO_PROTOCOL 實例。這個 Protocol 提供了設備特定驅動程式所需的所有存取功能（配置空間讀寫、MMIO 存取、DMA 映射等）。',

    'enum.step11.title': '步驟 11：啟用設備',
    'enum.step11.desc':  '設定 Command 暫存器：Memory Space Enable, Bus Master Enable',
    'enum.step11.detail':'最後，PciBusDxe 或設備驅動程式透過寫入 PCI Command 暫存器（偏移 0x04）來啟用設備。設定 Bit 1（Memory Space Enable）允許 MMIO 存取，設定 Bit 2（Bus Master Enable）允許設備發起 DMA 傳輸。設備此時才真正可以正常運作。',

    /* ---- root bridge io ---- */
    'rb.title':    'PCI Root Bridge IO Protocol',
    'rb.subtitle': '平台層級的 PCI 存取抽象',

    'rb.producer': '生產者：PciHostBridgeDxe（平台特定）',
    'rb.consumer': '消費者：PciBusDxe、Option ROM 載入器',

    'rb.desc': 'EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL 是平台提供的最底層 PCI 存取介面。它直接與硬體互動（CF8/CFC 或 ECAM），為上層的 PciBusDxe 提供統一的匯流排存取能力。每個 Root Bridge 都有獨立的 Protocol 實例。',

    'rb.pci.title':     'Pci.Read / Pci.Write',
    'rb.pci.desc':      '讀寫指定 Bus:Dev:Fun 的 PCI 配置空間暫存器',
    'rb.mem.title':     'Mem.Read / Mem.Write',
    'rb.mem.desc':      '讀寫 PCI 記憶體映射區間（MMIO BAR 對應的位址）',
    'rb.io.title':      'Io.Read / Io.Write',
    'rb.io.desc':       '讀寫 PCI I/O 映射區間（I/O BAR 對應的埠位址）',
    'rb.map.title':     'Map / Unmap',
    'rb.map.desc':      'DMA 緩衝區映射：將系統記憶體位址轉換為 PCI 設備可存取的匯流排位址',
    'rb.alloc.title':   'AllocateBuffer / FreeBuffer',
    'rb.alloc.desc':    '分配/釋放適合 DMA 使用的記憶體緩衝區（考慮對齊和定址限制）',
    'rb.config.title':  'Configuration',
    'rb.config.desc':   '回傳 Root Bridge 的資源配置資訊（MMIO 視窗、I/O 視窗、匯流排範圍）',

    /* ---- pci io ---- */
    'pciio.title':    'PCI IO Protocol',
    'pciio.subtitle': '設備層級的 PCI 存取介面',

    'pciio.producer': '生產者：PciBusDxe（自動為每個設備安裝）',
    'pciio.consumer': '消費者：設備驅動程式（NVMe、USB、網路卡、GOP 等）',

    'pciio.desc': 'EFI_PCI_IO_PROTOCOL 是 PCI 設備驅動程式最常使用的介面。它封裝了設備的 Segment:Bus:Dev:Fun 資訊，驅動程式不需要知道設備的拓撲位置。PciBusDxe 在列舉完成後為每個 PCI 設備自動安裝此 Protocol。',

    'pciio.pci.title':      'Pci.Read / Pci.Write',
    'pciio.pci.desc':       '讀寫此設備的配置空間（自動填入 BDF）',
    'pciio.mem.title':      'Mem.Read / Mem.Write',
    'pciio.mem.desc':       '讀寫此設備的 MMIO BAR 區間（指定 BAR 索引 + 偏移量）',
    'pciio.io.title':       'Io.Read / Io.Write',
    'pciio.io.desc':        '讀寫此設備的 I/O BAR 區間',
    'pciio.map.title':      'Map / Unmap',
    'pciio.map.desc':       'DMA 映射：將主機記憶體位址轉為設備可存取的匯流排位址',
    'pciio.alloc.title':    'AllocateBuffer / FreeBuffer',
    'pciio.alloc.desc':     '配置 DMA 相容的記憶體',
    'pciio.getloc.title':   'GetLocation',
    'pciio.getloc.desc':    '回傳此設備的 Segment:Bus:Dev:Fun 位置資訊',
    'pciio.attr.title':     'Attributes / GetBarAttributes / SetBarAttributes',
    'pciio.attr.desc':      '查詢/設定設備屬性和 BAR 的資源描述',
    'pciio.rom.title':      'RomImage / RomSize',
    'pciio.rom.desc':       '存取設備的 Option ROM 映像',

    'pciio.callchain': '呼叫鏈路',
    'pciio.callchain.desc': '設備驅動程式呼叫 PCI IO Protocol → PciBusDxe 轉換為 Root Bridge IO 呼叫（填入 BDF）→ Root Bridge IO 執行實際硬體存取',

    /* ---- arch compare ---- */
    'arch.title':    'x86_64 vs ARM64 架構比較',
    'arch.subtitle': 'PCI 子系統在不同架構的關鍵差異',

    'arch.col.feature':  '特性',
    'arch.col.x86':      'x86_64',
    'arch.col.arm':      'ARM64',

    'arch.row.access':   '配置空間存取',
    'arch.row.access.x86': 'CF8/CFC（傳統）+ ECAM（PCIe）',
    'arch.row.access.arm': '僅 ECAM（記憶體映射）',

    'arch.row.discovery': 'Root Bridge 發現',
    'arch.row.discovery.x86': '平台程式碼 + ACPI',
    'arch.row.discovery.arm': 'ACPI（MCFG/IORT）或設備樹',

    'arch.row.ioport':  'I/O 埠空間',
    'arch.row.ioport.x86': '原生支援（IN/OUT 指令）',
    'arch.row.ioport.arm': '不支援（部分平台透過 MMIO 模擬）',

    'arch.row.resource': '資源分配',
    'arch.row.resource.x86': 'MMIO + I/O + Prefetchable Memory',
    'arch.row.resource.arm': '僅 MMIO + Prefetchable Memory（無原生 I/O）',

    'arch.row.lib':      'EDK2 存取庫',
    'arch.row.lib.x86':  'PciCf8Lib / PciExpressLib / PciSegmentLib',
    'arch.row.lib.arm':  'PciSegmentLib（ECAM 實作）',

    'arch.row.interrupt': '中斷',
    'arch.row.interrupt.x86': 'INTx（傳統）+ MSI/MSI-X',
    'arch.row.interrupt.arm': 'MSI/MSI-X（透過 GICv3 ITS）',

    'arch.row.dma': 'DMA / IOMMU',
    'arch.row.dma.x86': 'Intel VT-d / AMD-Vi',
    'arch.row.dma.arm': 'ARM SMMU（System MMU）',

    /* ---- code ---- */
    'code.title':    '程式碼解析',
    'code.subtitle': 'EDK2 PCI 子系統核心程式碼片段',

    'code.scan.title':  'PCI 匯流排掃描 (PciBusDxe)',
    'code.scan.desc':   'PciBusDxe/PciEnumerator.c 中的核心掃描邏輯：遍歷所有 Bus:Dev:Fun 組合，讀取 Vendor ID 來偵測設備存在性。',

    'code.bar.title':   'BAR 大小探測',
    'code.bar.desc':    'BAR sizing 邏輯：寫入全 1 然後讀回，根據低位固定 bits 計算對齊需求（即 BAR 大小）。',

    'code.pciio.title': 'PCI IO Protocol 使用範例',
    'code.pciio.desc':  '設備驅動程式如何透過 EFI_PCI_IO_PROTOCOL 讀取 Vendor/Device ID。',

    'code.rootbridge.title': 'Root Bridge IO 配置空間存取',
    'code.rootbridge.desc':  'Root Bridge IO Protocol 如何讀寫 PCI 配置空間（ECAM 路徑）。',

    /* ---- references ---- */
    'ref.title':    '參考資源',
    'ref.subtitle': '延伸閱讀與官方規格',

    'ref.pci.title': 'PCI/PCIe 規格',
    'ref.edk2.title': 'EDK2 原始碼',
    'ref.uefi.title': 'UEFI/PI 規格',
    'ref.other.title': '其他資源',
},

'en': {
    'page.title': 'UEFI PCI Subsystem Visualizer',

    /* ---- nav ---- */
    'nav.back':          '← Back to Tools',
    'nav.overview':      'Overview',
    'nav.configspace':   'Config Space',
    'nav.access':        'Access',
    'nav.enumeration':   'Enumeration',
    'nav.rootbridge':    'Root Bridge IO',
    'nav.pciio':         'PCI IO',
    'nav.archcompare':   'Arch Compare',
    'nav.code':          'Code',
    'nav.references':    'References',

    /* ---- overview ---- */
    'overview.title':    'UEFI PCI Subsystem Overview',
    'overview.subtitle': 'Understanding how UEFI EDK2 discovers, enumerates, and manages PCI/PCIe devices',

    'overview.what.title': 'What is PCI/PCIe?',
    'overview.what.desc':  'PCI (Peripheral Component Interconnect) and its successor PCIe (PCI Express) are the most important bus standards in modern computers. Nearly all peripheral devices (NICs, GPUs, NVMe SSDs, USB controllers) connect to the CPU via PCIe. Each PCI device has a standardized Configuration Space that firmware and the OS use to discover and configure the device.',

    'overview.why.title': 'Why should BIOS engineers understand PCI?',
    'overview.why.desc':  'UEFI firmware is responsible for discovering and initializing all PCI devices before the OS boots. This includes: scanning all buses to discover devices, reading and configuring BARs (Base Address Registers), allocating memory and I/O resources, and installing PCI IO Protocols for drivers. Any PCI initialization error can render devices unusable or prevent the system from booting.',

    'overview.arch.title': 'x86_64 vs ARM64',
    'overview.arch.desc':  'x86 platforms support two config space access methods: legacy I/O ports (CF8h/CFCh) and memory-mapped (ECAM/MMCONFIG). ARM64 platforms use ECAM (Enhanced Configuration Access Mechanism) via memory-mapped access only. EDK2 unifies both architectures through abstraction layers (PciSegmentLib, PciHostBridgeDxe).',

    /* ---- phase timeline ---- */
    'phase.pei':     'PEI Phase',
    'phase.dxe':     'DXE Enum',
    'phase.assign':  'Resource Alloc',
    'phase.driver':  'Driver Install',
    'phase.bds':     'BDS Boot',

    /* ---- config space ---- */
    'config.title':    'PCI Configuration Space',
    'config.subtitle': 'Full 256-byte PCI header and 4K PCIe Extended Configuration Space',

    'config.type0.title': 'Type 0 Header (Endpoint Device)',
    'config.type0.desc':  'All PCI/PCIe endpoint devices (NICs, GPUs, NVMe controllers, etc.) use the Type 0 header. It contains 6 BARs (Base Address Registers) for mapping device memory or I/O regions. Vendor ID and Device ID uniquely identify the device, and drivers match against these values.',

    'config.type1.title': 'Type 1 Header (PCI Bridge)',
    'config.type1.desc':  'PCI-to-PCI bridges use the Type 1 header. Bridges connect different PCI bus segments and contain Primary, Secondary, and Subordinate Bus Numbers that define the bus hierarchy. Bridges also define the I/O, Memory, and Prefetchable Memory windows for downstream devices.',

    'config.extended.title': 'PCIe Extended Config Space',
    'config.extended.desc':  'PCIe extends the configuration space from 256 bytes to 4096 bytes (0x100-0xFFF). The extended space contains PCIe-specific capability structures such as AER (Advanced Error Reporting), ACS (Access Control Services), L1 PM Substates, etc. Extended space can only be accessed via ECAM (memory-mapped), not via legacy CF8/CFC.',

    'config.toggle.type0': 'Type 0 (Endpoint)',
    'config.toggle.type1': 'Type 1 (Bridge)',
    'config.toggle.extended': 'PCIe Extended',

    /* ---- config register details ---- */
    'reg.vendorid':     'Vendor ID — Manufacturer identifier assigned by PCI-SIG (e.g., Intel=8086h, AMD=1022h)',
    'reg.deviceid':     'Device ID — Vendor-assigned device model identifier',
    'reg.command':      'Command — Controls device behavior (Memory Space Enable, Bus Master Enable, etc.)',
    'reg.status':       'Status — Device status flags (Capabilities List, Interrupt Status, etc.)',
    'reg.revisionid':   'Revision ID — Hardware revision of the device',
    'reg.classcode':    'Class Code — Device function classification (3 bytes: Base Class, Sub-Class, Prog IF)',
    'reg.cacheline':    'Cache Line Size — System cache line size in DWORDs',
    'reg.latency':      'Latency Timer — PCI bus arbitration latency timer',
    'reg.headertype':   'Header Type — Header format (Bit 7: multi-function, Bit 0-6: 0=endpoint, 1=bridge)',
    'reg.bist':         'BIST — Built-In Self Test register',
    'reg.bar':          'BAR — Base Address Register: defines device memory or I/O mapping region',
    'reg.subsystem':    'Subsystem Vendor/Device ID — Board/OEM identifiers',
    'reg.exprom':       'Expansion ROM — Option ROM base address',
    'reg.capptr':       'Capabilities Pointer — Offset to first capability structure',
    'reg.intline':      'Interrupt Line — IRQ number (filled in by firmware)',
    'reg.intpin':       'Interrupt Pin — Which interrupt pin the device uses (INTA# ~ INTD#)',
    'reg.pribus':       'Primary Bus — Upstream bus number of bridge',
    'reg.secbus':       'Secondary Bus — Downstream bus number of bridge',
    'reg.subbus':       'Subordinate Bus — Highest downstream bus reachable through bridge',
    'reg.iobase':       'I/O Base/Limit — I/O address range forwarded by bridge',
    'reg.membase':      'Memory Base/Limit — Non-prefetchable memory range forwarded by bridge',
    'reg.prefbase':     'Prefetchable Base/Limit — Prefetchable memory range forwarded by bridge',
    'reg.bridgectrl':   'Bridge Control — Bridge control register (ISA Mode, VGA Enable, etc.)',

    /* ---- access ---- */
    'access.title':    'Configuration Space Access Mechanism',
    'access.subtitle': 'How x86 and ARM platforms read/write PCI configuration space',

    'access.x86.title':    'x86_64 Access Methods',
    'access.legacy.title': 'Legacy I/O Port Method (CF8h/CFCh)',
    'access.legacy.desc':  'The original PCI config space access method. Write a composite Bus/Device/Function/Offset value to port 0xCF8 (CONFIG_ADDRESS), then read/write data from port 0xCFC (CONFIG_DATA). This method only supports the 256-byte config space and can access only one register at a time, requiring lock protection. Corresponds to EDK2 PciCf8Lib.',

    'access.ecam.title': 'ECAM / MMCONFIG Method',
    'access.ecam.desc':  'Memory-mapped access mechanism introduced by PCIe. The MCFG ACPI table provides the ECAM base address, and the entire config space is mapped to a contiguous memory region. Address calculation: ECAM_BASE + (Bus << 20) + (Dev << 15) + (Fun << 12) + Offset. Supports the full 4K extended config space and uses normal memory read/write instructions. Corresponds to EDK2 PciExpressLib.',

    'access.arm.title':   'ARM64 Access Method',
    'access.arm.ecam.title': 'Pure ECAM (Memory-Mapped)',
    'access.arm.ecam.desc':  'ARM64 platforms do not support I/O ports and rely entirely on ECAM memory-mapped access for PCI config space. The ECAM base address is similarly provided by the MCFG ACPI table or Device Tree. Access is identical to x86 ECAM using the same address formula. EDK2 provides a unified abstraction through PciSegmentLib.',

    'access.formula.title': 'Address Calculation Formula',
    'access.formula': 'ECAM_BASE + (Bus << 20) + (Dev << 15) + (Fun << 12) + Offset',

    'access.cf8.format': 'CF8h Format: [31]=Enable | [23:16]=Bus | [15:11]=Dev | [10:8]=Fun | [7:2]=Offset | [1:0]=00',

    /* ---- enumeration ---- */
    'enum.title':    'PCI Enumeration Flow',
    'enum.subtitle': 'Complete device discovery and resource allocation flow in PciBusDxe',

    'enum.step1.title':  'Step 1: Host Bridge Resource Allocation Protocol',
    'enum.step1.desc':   'Platform code produces EFI_PCI_HOST_BRIDGE_RESOURCE_ALLOCATION_PROTOCOL',
    'enum.step1.detail': 'The platform\'s PciHostBridgeDxe driver starts and, based on the hardware topology (typically described by ACPI tables or hardware registers), creates Host Bridge and Root Bridge data structures. It installs EFI_PCI_HOST_BRIDGE_RESOURCE_ALLOCATION_PROTOCOL on the Host Bridge Handle for use by the PCI Bus driver.',

    'enum.step2.title':  'Step 2: Create Root Bridges',
    'enum.step2.desc':   'PciHostBridgeDxe creates Root Bridges, installs EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL',
    'enum.step2.detail': 'For each PCI Root Bridge (a system may have multiple), the driver allocates a PCI_ROOT_BRIDGE_INSTANCE structure, initializes the bus range (e.g., Bus 0-255) and resource windows (MMIO, I/O, Prefetchable Memory), then installs EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL on the corresponding Handle.',

    'enum.step3.title':  'Step 3: PciBusDxe Starts',
    'enum.step3.desc':   'PciBusDxe binds to Root Bridge Handle via Supported()/Start()',
    'enum.step3.detail': 'PciBusDxe is a UEFI Bus Driver implementing EFI_DRIVER_BINDING_PROTOCOL. Supported() checks if the Handle has PCI Root Bridge IO Protocol. Start() begins the enumeration process by calling OpenProtocol() to obtain access to the Root Bridge IO Protocol.',

    'enum.step4.title':  'Step 4: Bus Scan',
    'enum.step4.desc':   'Iterate Bus 0-255, Device 0-31, Function 0-7',
    'enum.step4.detail': 'PciBusDxe uses a triple-nested loop to scan the PCI topology. For each Bus:Dev:Fun combination, it reads the Vendor ID at config space offset 0x00. If Vendor ID is 0xFFFF, no device is present at that location. For present devices, it checks Header Type Bit 7 to determine if it is a multi-function device.',

    'enum.step5.title':  'Step 5: Device Detection',
    'enum.step5.desc':   'Read Vendor ID (0xFFFF = no device), check Header Type Bit 7 (multi-function)',
    'enum.step5.detail': 'When Vendor ID ≠ 0xFFFF, a device is present. Read Header Type register: Bits 0-6 indicate header type (0x00=Type 0 endpoint, 0x01=Type 1 bridge), Bit 7 indicates multi-function device. If Function 0 Bit 7 is 0, skip scanning Functions 1-7.',

    'enum.step6.title':  'Step 6: Create Device Structure',
    'enum.step6.desc':   'Allocate PCI_IO_DEVICE structure for each discovered device',
    'enum.step6.detail': 'PciBusDxe creates a PCI_IO_DEVICE internal data structure for each detected device, recording Bus/Dev/Fun, Vendor/Device ID, Class Code, Header Type, etc. If a Type 1 (bridge) is found, it recursively scans the bus downstream of the bridge.',

    'enum.step7.title':  'Step 7: BAR Sizing',
    'enum.step7.desc':   'Write 0xFFFFFFFF → read back → determine size & type (MMIO/IO/64-bit)',
    'enum.step7.detail': 'BAR sizing is a critical step. For each BAR: ① Save original value ② Write all 1s (0xFFFFFFFF) ③ Read back — fixed low bits indicate alignment requirement (i.e., size) ④ Restore original value. Bit 0 distinguishes Memory (0) or I/O (1) BAR. Memory BAR Bits 1-2 indicate 32-bit or 64-bit addressing.',

    'enum.step8.title':  'Step 8: Submit Resource Requirements',
    'enum.step8.desc':   'Collect all resource requirements → submit to Host Bridge for allocation',
    'enum.step8.detail': 'PciBusDxe aggregates all device resource requirements (MMIO sizes, I/O ranges, Prefetchable Memory) and submits them to the Host Bridge via SubmitResources() of EFI_PCI_HOST_BRIDGE_RESOURCE_ALLOCATION_PROTOCOL. The Host Bridge, in coordination with platform logic, determines the starting address for each resource window.',

    'enum.step9.title':  'Step 9: Address Assignment',
    'enum.step9.desc':   'Host Bridge assigns address windows → program BAR addresses',
    'enum.step9.detail': 'After the Host Bridge completes resource allocation (via NotifyPhase(EfiPciHostBridgeSetResources)), PciBusDxe retrieves the results from GetProposedResources() and programs the computed base addresses into each device\'s BAR registers and bridge Base/Limit registers.',

    'enum.step10.title': 'Step 10: Install PCI IO Protocol',
    'enum.step10.desc':  'Install EFI_PCI_IO_PROTOCOL on each device Handle',
    'enum.step10.detail':'PciBusDxe creates a new Handle for each enumerated PCI device and installs an EFI_PCI_IO_PROTOCOL instance. This Protocol provides all access functions that device-specific drivers need (config space read/write, MMIO access, DMA mapping, etc.).',

    'enum.step11.title': 'Step 11: Enable Devices',
    'enum.step11.desc':  'Set Command register: Memory Space Enable, Bus Master Enable',
    'enum.step11.detail':'Finally, PciBusDxe or the device driver writes to the PCI Command register (offset 0x04) to enable the device. Setting Bit 1 (Memory Space Enable) allows MMIO access, and Bit 2 (Bus Master Enable) allows the device to initiate DMA transfers. The device is now fully operational.',

    /* ---- root bridge io ---- */
    'rb.title':    'PCI Root Bridge IO Protocol',
    'rb.subtitle': 'Platform-level PCI access abstraction',

    'rb.producer': 'Producer: PciHostBridgeDxe (platform-specific)',
    'rb.consumer': 'Consumer: PciBusDxe, Option ROM loader',

    'rb.desc': 'EFI_PCI_ROOT_BRIDGE_IO_PROTOCOL is the lowest-level PCI access interface provided by the platform. It interacts directly with hardware (CF8/CFC or ECAM), providing unified bus access capability for the upper-layer PciBusDxe. Each Root Bridge has an independent Protocol instance.',

    'rb.pci.title':     'Pci.Read / Pci.Write',
    'rb.pci.desc':      'Read/write PCI config space registers at specified Bus:Dev:Fun',
    'rb.mem.title':     'Mem.Read / Mem.Write',
    'rb.mem.desc':      'Read/write PCI memory-mapped regions (MMIO BAR addresses)',
    'rb.io.title':      'Io.Read / Io.Write',
    'rb.io.desc':       'Read/write PCI I/O mapped regions (I/O BAR port addresses)',
    'rb.map.title':     'Map / Unmap',
    'rb.map.desc':      'DMA buffer mapping: translate system memory addresses to PCI bus addresses accessible by devices',
    'rb.alloc.title':   'AllocateBuffer / FreeBuffer',
    'rb.alloc.desc':    'Allocate/free DMA-suitable memory buffers (considering alignment and addressing constraints)',
    'rb.config.title':  'Configuration',
    'rb.config.desc':   'Return the Root Bridge resource configuration (MMIO windows, I/O windows, bus range)',

    /* ---- pci io ---- */
    'pciio.title':    'PCI IO Protocol',
    'pciio.subtitle': 'Device-level PCI access interface',

    'pciio.producer': 'Producer: PciBusDxe (auto-installed per device)',
    'pciio.consumer': 'Consumer: Device drivers (NVMe, USB, NIC, GOP, etc.)',

    'pciio.desc': 'EFI_PCI_IO_PROTOCOL is the most commonly used interface by PCI device drivers. It encapsulates the device\'s Segment:Bus:Dev:Fun information, so drivers don\'t need to know the device\'s topology location. PciBusDxe automatically installs this Protocol for each PCI device after enumeration.',

    'pciio.pci.title':      'Pci.Read / Pci.Write',
    'pciio.pci.desc':       'Read/write this device\'s config space (BDF auto-filled)',
    'pciio.mem.title':      'Mem.Read / Mem.Write',
    'pciio.mem.desc':       'Read/write this device\'s MMIO BAR region (specify BAR index + offset)',
    'pciio.io.title':       'Io.Read / Io.Write',
    'pciio.io.desc':        'Read/write this device\'s I/O BAR region',
    'pciio.map.title':      'Map / Unmap',
    'pciio.map.desc':       'DMA mapping: translate host memory addresses to bus addresses accessible by device',
    'pciio.alloc.title':    'AllocateBuffer / FreeBuffer',
    'pciio.alloc.desc':     'Allocate DMA-compatible memory',
    'pciio.getloc.title':   'GetLocation',
    'pciio.getloc.desc':    'Return this device\'s Segment:Bus:Dev:Fun location',
    'pciio.attr.title':     'Attributes / GetBarAttributes / SetBarAttributes',
    'pciio.attr.desc':      'Query/set device attributes and BAR resource descriptors',
    'pciio.rom.title':      'RomImage / RomSize',
    'pciio.rom.desc':       'Access the device\'s Option ROM image',

    'pciio.callchain': 'Call Chain',
    'pciio.callchain.desc': 'Device driver calls PCI IO Protocol → PciBusDxe translates to Root Bridge IO call (fills in BDF) → Root Bridge IO performs actual hardware access',

    /* ---- arch compare ---- */
    'arch.title':    'x86_64 vs ARM64 Architecture Comparison',
    'arch.subtitle': 'Key differences in the PCI subsystem across architectures',

    'arch.col.feature':  'Feature',
    'arch.col.x86':      'x86_64',
    'arch.col.arm':      'ARM64',

    'arch.row.access':   'Config Space Access',
    'arch.row.access.x86': 'CF8/CFC (legacy) + ECAM (PCIe)',
    'arch.row.access.arm': 'ECAM only (memory-mapped)',

    'arch.row.discovery': 'Root Bridge Discovery',
    'arch.row.discovery.x86': 'Platform code + ACPI',
    'arch.row.discovery.arm': 'ACPI (MCFG/IORT) or Device Tree',

    'arch.row.ioport':  'I/O Port Space',
    'arch.row.ioport.x86': 'Natively supported (IN/OUT instructions)',
    'arch.row.ioport.arm': 'Not supported (some platforms emulate via MMIO)',

    'arch.row.resource': 'Resource Allocation',
    'arch.row.resource.x86': 'MMIO + I/O + Prefetchable Memory',
    'arch.row.resource.arm': 'MMIO + Prefetchable Memory only (no native I/O)',

    'arch.row.lib':      'EDK2 Access Library',
    'arch.row.lib.x86':  'PciCf8Lib / PciExpressLib / PciSegmentLib',
    'arch.row.lib.arm':  'PciSegmentLib (ECAM implementation)',

    'arch.row.interrupt': 'Interrupts',
    'arch.row.interrupt.x86': 'INTx (legacy) + MSI/MSI-X',
    'arch.row.interrupt.arm': 'MSI/MSI-X (via GICv3 ITS)',

    'arch.row.dma': 'DMA / IOMMU',
    'arch.row.dma.x86': 'Intel VT-d / AMD-Vi',
    'arch.row.dma.arm': 'ARM SMMU (System MMU)',

    /* ---- code ---- */
    'code.title':    'Code Analysis',
    'code.subtitle': 'Key EDK2 PCI subsystem source code snippets',

    'code.scan.title':  'PCI Bus Scan (PciBusDxe)',
    'code.scan.desc':   'Core scanning logic in PciBusDxe/PciEnumerator.c: iterates all Bus:Dev:Fun combinations, reads Vendor ID to detect device presence.',

    'code.bar.title':   'BAR Sizing',
    'code.bar.desc':    'BAR sizing logic: write all 1s then read back, compute alignment requirement (i.e., BAR size) from fixed low bits.',

    'code.pciio.title': 'PCI IO Protocol Usage Example',
    'code.pciio.desc':  'How a device driver reads Vendor/Device ID through EFI_PCI_IO_PROTOCOL.',

    'code.rootbridge.title': 'Root Bridge IO Config Space Access',
    'code.rootbridge.desc':  'How Root Bridge IO Protocol reads/writes PCI config space (ECAM path).',

    /* ---- references ---- */
    'ref.title':    'References',
    'ref.subtitle': 'Further reading and official specifications',

    'ref.pci.title': 'PCI/PCIe Specifications',
    'ref.edk2.title': 'EDK2 Source Code',
    'ref.uefi.title': 'UEFI/PI Specifications',
    'ref.other.title': 'Other Resources',
}
};

var currentLang = localStorage.getItem('pci-viz-lang') || 'en';

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
    localStorage.setItem('pci-viz-lang', lang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    applyTranslations();

    // re-render diagrams with new language
    if (typeof renderConfigSpace === 'function') renderConfigSpace();
    if (typeof renderAccessDiagram === 'function') renderAccessDiagram();
    if (typeof renderEnumStep === 'function') renderEnumStep(typeof currentEnumStep !== 'undefined' ? currentEnumStep : 0);
    if (typeof renderRootBridgeDiagram === 'function') renderRootBridgeDiagram();
    if (typeof renderPciIoDiagram === 'function') renderPciIoDiagram();
    if (typeof renderArchComparison === 'function') renderArchComparison();
}

/* ---- boot ---- */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { setLang(this.getAttribute('data-lang')); });
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    applyTranslations();
});
