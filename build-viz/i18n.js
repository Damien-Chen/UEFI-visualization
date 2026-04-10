const translations = {
    'zh-TW': {
        'page.title': 'EDK2 BIOS 編譯流程視覺化',

        'nav.back': '← 回工具列表',
        'nav.title': 'EDK2 Build Infrastructure',
        'nav.overview': '檔案類型',
        'nav.pipeline': '編譯管線',
        'nav.journey': '單檔追蹤',
        'nav.command': '建置命令',
        'nav.references': '參考來源',

        'hero.eyebrow': '從原始檔到可燒錄的 BIOS ROM',
        'hero.title': '你的 INF / DSC / FDF 如何變成 BIOS ROM',
        'hero.desc': '你寫下一個 .inf、.dsc 或 .fdf，build.exe 會呼叫一系列程式對它進行解析、編譯、組裝，最後產生可燒錄的 .fd（BIOS ROM）。點選下方任一檔案類型，追蹤它的完整旅程。',

        'file.inf.title': '模組描述檔 (.inf)',
        'file.inf.desc': '定義模組的來源檔、相依套件、Library Classes、PCD 與模組類型。每個 UEFI 模組（Driver/Library/Application）都有一個 INF。',
        'file.inf.track': '追蹤 INF 路徑 →',

        'file.dsc.title': '平台描述檔 (.dsc)',
        'file.dsc.desc': '定義整個平台要建置哪些模組、Library Class 的對應關係、PCD 值與建置選項。是 build.exe 的主要入口（-p 參數）。',
        'file.dsc.track': '追蹤 DSC 路徑 →',

        'file.fdf.title': '映像佈局檔 (.fdf)',
        'file.fdf.desc': '定義最終 BIOS ROM 的 Flash 佈局：哪些模組放進哪個 FV、FD 各區段大小與位置、Capsule 組成規則。',
        'file.fdf.track': '追蹤 FDF 路徑 →',

        'pipeline.title': '編譯管線：build.exe 呼叫了哪些程式',
        'pipeline.desc': '從你執行 build 指令到產生 BIOS ROM，以下是每支被呼叫的程式及其職責。點擊任一節點查看詳細說明。',
        'pipeline.clickHint': '點擊節點查看詳細說明',

        'pipeline.stage.input': '輸入檔案',
        'pipeline.stage.autogen': 'AutoGen 解析階段',
        'pipeline.stage.make': 'MAKE 編譯階段',
        'pipeline.stage.imagegen': 'ImageGen 組裝階段',
        'pipeline.stage.output': 'BIOS ROM',

        'pipeline.detail.title': '程式詳細說明',
        'pipeline.detail.placeholder': '← 點擊管線上任一程式節點',
        'pipeline.detail.input': '輸入',
        'pipeline.detail.output': '輸出',
        'pipeline.detail.desc': '說明',

        'tool.build.name': 'build.exe',
        'tool.build.desc': 'BaseTools 主要入口程式，負責讀取 target.txt 與命令列參數，決定要建置的平台/模組/架構，然後依序驅動 AutoGen、MAKE、ImageGen 三個階段。',
        'tool.build.input': 'target.txt、命令列參數 (-p/-m/-a/-b/-t)',
        'tool.build.output': '呼叫 AutoGen、MAKE、GenFds 的完整建置流程',

        'tool.dscparser.name': 'DscParser',
        'tool.dscparser.desc': '解析平台 DSC 檔案，讀取 [Defines]、[LibraryClasses]、[Components]、[PcdsFixedAtBuild] 等所有區段，建立平台模組清單與 PCD 政策。',
        'tool.dscparser.input': '*.dsc 平台描述檔',
        'tool.dscparser.output': '模組清單、Library Class 對應表、平台 PCD 值',

        'tool.infparser.name': 'InfParser',
        'tool.infparser.desc': '解析每個模組的 INF 檔案，讀取 [Sources]、[Packages]、[LibraryClasses]、[Pcd]、[BuildOptions] 等區段，建立模組的相依圖。',
        'tool.infparser.input': '*.inf 模組描述檔',
        'tool.infparser.output': '模組來源檔清單、Library 相依、PCD 引用',

        'tool.decparser.name': 'DecParser',
        'tool.decparser.desc': '解析套件宣告 DEC 檔，讀取 [Includes]、[Guids]、[Protocols]、[Ppis]、[PcdsFixedAtBuild] 等區段，提供全域 GUID/Protocol 定義與 PCD 預設值。',
        'tool.decparser.input': '*.dec 套件宣告檔',
        'tool.decparser.output': 'Include 路徑、GUID/Protocol/PPI 表、PCD 預設值',

        'tool.fdfparser.name': 'FdfParser',
        'tool.fdfparser.desc': '解析 FDF 的 Flash 佈局定義，讀取 [FD]、[FV]、[Capsule]、[Rule] 等區段，並解析條件式指令（!if/!ifdef），建立最終的 FV/FD 組裝計畫。',
        'tool.fdfparser.input': '*.fdf Flash 佈局檔',
        'tool.fdfparser.output': 'FD/FV 佈局計畫、FFS 排列順序、條件式結果',

        'tool.autogen.name': 'AutoGen',
        'tool.autogen.desc': '根據前面解析結果，遞迴解析 Library instance、套用 PCD 優先序（CLI > DSC > FDF > INF > DEC），產生每個模組的 AutoGen.c / AutoGen.h（包含 GUID 陣列、入口函式宣告、PCD 存取函式），並產生模組與平台層級的 Makefile。',
        'tool.autogen.input': 'DscParser/InfParser/DecParser/FdfParser 的解析結果',
        'tool.autogen.output': 'AutoGen.c、AutoGen.h、模組 Makefile、平台 Makefile、AsBuilt INF',

        'tool.make.name': 'nmake / make',
        'tool.make.desc': 'Make 工具讀取 AutoGen 產生的 Makefile，依相依性順序呼叫編譯器（CC）、組譯器（ASM）、資源編譯器（VFR/UNI）等工具，最後呼叫連結器產生 PE/COFF 映像。',
        'tool.make.input': 'AutoGen.c/h + 原始碼 (.c/.asm/.vfr) + Makefile',
        'tool.make.output': '*.obj、*.lib、PE/COFF 模組映像',

        'tool.compiler.name': 'CC (gcc/cl.exe)',
        'tool.compiler.desc': '實際執行 C 原始碼編譯的工具，由 tools_def.txt 指定。GCC5 使用 gcc，VS2022 使用 cl.exe，CLANGPDB 使用 clang。編譯旗標由 DSC 的 [BuildOptions] 與 tools_def.txt 共同決定。',
        'tool.compiler.input': '*.c 原始檔、AutoGen.c/h、標頭檔',
        'tool.compiler.output': '*.obj 目的檔',

        'tool.linker.name': 'Linker (ld/link.exe)',
        'tool.linker.desc': '把所有 .obj 與 .lib 連結成 PE32/PE32+ 格式的執行檔，依 MODULE_TYPE 選擇適當的連結腳本與起始位址。',
        'tool.linker.input': '*.obj、*.lib、連結腳本',
        'tool.linker.output': 'PE32/PE32+ 執行檔（含重定位表）',

        'tool.genfw.name': 'GenFw',
        'tool.genfw.desc': '把標準 PE32/PE32+ 執行檔轉換為 UEFI 使用的 .efi 格式，主要工作包含：去除不必要的 section、調整重定位資訊、依 MODULE_TYPE 設定映像類型（TE/PE32）。',
        'tool.genfw.input': 'PE32/PE32+ 執行檔',
        'tool.genfw.output': '*.efi（或 TE 格式）UEFI 模組映像',

        'tool.gensec.name': 'GenSec',
        'tool.gensec.desc': '把 .efi 或其他二進位包裝成 FFS Section，依 FDF Rule 指定的 SectionType（PE32/COMPRESS/UI/VERSION/RAW 等）加上對應的 section header。壓縮型 section 會在此進行 LZ77 或 LZMA 壓縮。',
        'tool.gensec.input': '*.efi 或其他二進位',
        'tool.gensec.output': '*.sec EFI Section（含 section header）',

        'tool.genffs.name': 'GenFfs',
        'tool.genffs.desc': '把一個或多個 Section 封裝成一個 FFS File，加上 EFI_FFS_FILE_HEADER，包含模組的 GUID、檔案類型（PEIM/DXE/APP 等）、屬性與大小資訊。',
        'tool.genffs.input': '*.sec Section 檔（一個或多個）',
        'tool.genffs.output': '*.ffs FFS File（含 FFS header）',

        'tool.genfv.name': 'GenFv',
        'tool.genfv.desc': '讀取 FDF [FV] 區段產生的 FV INF 設定檔，把所有指定的 .ffs 按照對齊要求排列到 FV 映像中，加上 EFI_FIRMWARE_VOLUME_HEADER 與 BlockMap，最後輸出完整的 .fv 映像檔。',
        'tool.genfv.input': 'FV INF 設定、*.ffs 清單',
        'tool.genfv.output': '*.fv Firmware Volume 映像',

        'tool.genfds.name': 'GenFds',
        'tool.genfds.desc': 'ImageGen 階段的總指揮。讀取 FDF 所有區段，依序呼叫 GenSec/GenFfs/GenFv 產生 FV，然後根據 [FD] 把各 FV 與 raw 區域（如 NVRAM/microcode）組裝成最終的 .fd Flash 裝置映像——這就是 BIOS ROM。',
        'tool.genfds.input': 'FDF 佈局、所有模組的 .efi、FV 清單',
        'tool.genfds.output': '*.fd 最終 BIOS ROM 映像',

        'journey.title': '單檔追蹤：選擇你要追蹤的檔案',
        'journey.desc': '選擇 INF、DSC 或 FDF，查看該檔案從被讀取、解析、轉換到最終成為 BIOS ROM 的每一個步驟與對應程式。',

        'journey.tab.inf': '.inf 模組描述',
        'journey.tab.dsc': '.dsc 平台描述',
        'journey.tab.fdf': '.fdf 映像佈局',

        'journey.inf.title': 'INF 的旅程：從模組描述到 BIOS ROM',
        'journey.inf.s1.title': 'DSC 找到這個 INF',
        'journey.inf.s1.program': 'build.exe + DscParser',
        'journey.inf.s1.desc': 'build.exe 讀取 -p 指定的 DSC，DscParser 解析 [Components] 區段，找到這個 INF 的路徑，將它加入模組建置清單。',
        'journey.inf.s1.artifact': 'DSC [Components] 條目',

        'journey.inf.s2.title': 'InfParser 解析 INF 內容',
        'journey.inf.s2.program': 'InfParser',
        'journey.inf.s2.desc': '讀取 [Defines]（MODULE_TYPE、ENTRY_POINT）、[Sources]（.c/.h 檔案）、[Packages]（相依 DEC）、[LibraryClasses]（Library 需求）、[Pcd]（使用的 PCD）、[BuildOptions]（額外編譯旗標）。',
        'journey.inf.s2.artifact': '模組相依圖、來源清單',

        'journey.inf.s3.title': 'AutoGen 產生黏合程式碼',
        'journey.inf.s3.program': 'AutoGen',
        'journey.inf.s3.desc': '解析 LibraryClass 相依（遞迴），套用 PCD 優先序。為此 INF 產生 AutoGen.c（GUID 陣列、ModuleEntryPoint 轉接、PCD 存取器）與 AutoGen.h（ExternLibrary 宣告）。產生模組 Makefile。',
        'journey.inf.s3.artifact': 'AutoGen.c / AutoGen.h / Makefile',

        'journey.inf.s4.title': 'CC 編譯所有 .c 原始檔',
        'journey.inf.s4.program': 'nmake → CC (gcc/cl.exe)',
        'journey.inf.s4.desc': 'nmake/make 依 Makefile 呼叫 CC，把 [Sources] 中每個 .c 及 AutoGen.c 編譯成 .obj，套用 tools_def.txt 與 [BuildOptions] 的旗標。',
        'journey.inf.s4.artifact': '*.obj 目的檔',

        'journey.inf.s5.title': 'Linker 連結成 PE/COFF',
        'journey.inf.s5.program': 'Linker (ld/link.exe)',
        'journey.inf.s5.desc': '把所有 .obj 和解析到的 Library .lib 連結成 PE32/PE32+ 格式執行檔，包含重定位表，供 UEFI 執行環境使用。',
        'journey.inf.s5.artifact': 'PE32/PE32+ 執行檔',

        'journey.inf.s6.title': 'GenFw 轉換為 .efi',
        'journey.inf.s6.program': 'GenFw',
        'journey.inf.s6.desc': '把 PE32 轉換成 UEFI 需要的 .efi 格式（或 TE 格式用於 PEI 階段），移除不必要資訊、調整重定位。',
        'journey.inf.s6.artifact': '*.efi 模組映像',

        'journey.inf.s7.title': 'GenSec 封裝成 Section',
        'journey.inf.s7.program': 'GenSec',
        'journey.inf.s7.desc': '根據 FDF Rule 定義，把 .efi 包成 PE32 Section，可選擇性壓縮（COMPRESS Section），加上 EFI_SECTION_HEADER。',
        'journey.inf.s7.artifact': '*.sec EFI Section',

        'journey.inf.s8.title': 'GenFfs 封裝成 FFS File',
        'journey.inf.s8.program': 'GenFfs',
        'journey.inf.s8.desc': '把 section 打包成 FFS File，加上包含此模組 GUID 的 EFI_FFS_FILE_HEADER，指定檔案類型（PEIM/DXE Driver/Application 等）。',
        'journey.inf.s8.artifact': '*.ffs FFS 檔案',

        'journey.inf.s9.title': 'GenFv / GenFds 組裝進 ROM',
        'journey.inf.s9.program': 'GenFv → GenFds',
        'journey.inf.s9.desc': '.ffs 依 FDF [FV] 規則被 GenFv 組入 Firmware Volume，再由 GenFds 依 [FD] 把所有 FV 與 raw 區域組成最終 .fd BIOS ROM。',
        'journey.inf.s9.artifact': '*.fd BIOS ROM',

        'journey.dsc.title': 'DSC 的旅程：從平台策略到 BIOS ROM',
        'journey.dsc.s1.title': 'build.exe 讀取 DSC 作為入口',
        'journey.dsc.s1.program': 'build.exe',
        'journey.dsc.s1.desc': 'build -p xxx.dsc 指定此 DSC 為平台入口。build.exe 讀取 target.txt 決定 ARCH/TARGET/TOOL_CHAIN_TAG，然後把 DSC 傳給 DscParser。',
        'journey.dsc.s1.artifact': 'ActivePlatform 上下文',

        'journey.dsc.s2.title': 'DscParser 解析所有區段',
        'journey.dsc.s2.program': 'DscParser',
        'journey.dsc.s2.desc': '逐一解析 [Defines]（PLATFORM_NAME、OUTPUT_DIRECTORY、FLASH_DEFINITION）、[LibraryClasses]（Library 實作對應）、[Components]（要建置的模組清單）、[PcdsFixedAtBuild/PcdsPatchableInModule/PcdsDynamic]（PCD 值）。',
        'journey.dsc.s2.artifact': '模組清單、Library 對應表、PCD 值表',

        'journey.dsc.s3.title': 'DSC 中的 Library 對應被套用',
        'journey.dsc.s3.program': 'AutoGen',
        'journey.dsc.s3.desc': 'AutoGen 依照 DSC [LibraryClasses] 的對應關係，為每個模組解析出實際使用的 Library .inf，遞迴解析直到所有 Library 都確定。',
        'journey.dsc.s3.artifact': '每個模組完整的 Library 相依圖',

        'journey.dsc.s4.title': 'DSC PCD 值注入 AutoGen',
        'journey.dsc.s4.program': 'AutoGen',
        'journey.dsc.s4.desc': 'AutoGen 套用 PCD 優先序：命令列 > DSC > FDF > INF > DEC。DSC 中定義的 PCD 值會覆寫 INF/DEC 預設值，並被寫入 AutoGen.c 中的 PCD 存取函式。',
        'journey.dsc.s4.artifact': 'AutoGen.c 中的 PCD 值',

        'journey.dsc.s5.title': '平台 Makefile 驅動所有模組',
        'journey.dsc.s5.program': 'AutoGen → nmake/make',
        'journey.dsc.s5.desc': 'AutoGen 產生平台層級 Makefile，其中列出所有來自 [Components] 的模組 Makefile。nmake/make 依相依順序逐一建置每個模組，每個模組走 INF 路徑的 S4→S6。',
        'journey.dsc.s5.artifact': '所有模組的 *.efi',

        'journey.dsc.s6.title': 'DSC 指定的 FDF 啟動 ImageGen',
        'journey.dsc.s6.program': 'build.exe → GenFds',
        'journey.dsc.s6.desc': 'DSC [Defines] 的 FLASH_DEFINITION 指向 FDF 路徑。build 的 fds 目標觸發 GenFds，GenFds 讀取 FDF 並協調 GenSec/GenFfs/GenFv 把所有 .efi 組裝成 BIOS ROM。',
        'journey.dsc.s6.artifact': '*.fd BIOS ROM',

        'journey.fdf.title': 'FDF 的旅程：從 Flash 佈局到 BIOS ROM',
        'journey.fdf.s1.title': 'DSC 透過 FLASH_DEFINITION 指向 FDF',
        'journey.fdf.s1.program': 'DscParser',
        'journey.fdf.s1.desc': 'DscParser 在 DSC [Defines] 中讀到 FLASH_DEFINITION = xxx.fdf，記錄 FDF 路徑。也可用 build -f 命令列覆寫 FDF 路徑。',
        'journey.fdf.s1.artifact': 'FDF 路徑參考',

        'journey.fdf.s2.title': 'FdfParser 解析 Flash 佈局',
        'journey.fdf.s2.program': 'FdfParser',
        'journey.fdf.s2.desc': '解析所有 FDF 區段：[FD] 定義整個 Flash 裝置大小與各 Region；[FV] 定義每個 Firmware Volume 的大小、屬性與包含哪些 FFS；[Rule] 定義模組包裝規則；[Capsule] 定義更新包。支援條件式指令（!if/!ifdef/!include）。',
        'journey.fdf.s2.artifact': 'FD/FV/Rule/Capsule 佈局物件',

        'journey.fdf.s3.title': 'FDF [FV] 觸發 FFS 封裝',
        'journey.fdf.s3.program': 'GenFds → GenSec → GenFfs',
        'journey.fdf.s3.desc': '對 [FV] 中每個 INF 條目，GenFds 找到對應的 .efi，根據 [Rule] 呼叫 GenSec 封裝 section（選擇性壓縮），再呼叫 GenFfs 封裝成 FFS File，GUID 來自 INF [Defines] 的 FILE_GUID。',
        'journey.fdf.s3.artifact': '每個模組的 *.ffs',

        'journey.fdf.s4.title': 'FDF [FV] 觸發 FV 組裝',
        'journey.fdf.s4.program': 'GenFv',
        'journey.fdf.s4.desc': 'GenFds 為每個 [FV] 區段產生 FV INF（設定檔），呼叫 GenFv 把所有 .ffs 按對齊需求排列到 Firmware Volume 映像中，加上 EFI_FIRMWARE_VOLUME_HEADER 與 BlockMap，填充空白區域。',
        'journey.fdf.s4.artifact': '*.fv Firmware Volume',

        'journey.fdf.s5.title': 'FDF [FD] 組裝最終 BIOS ROM',
        'journey.fdf.s5.program': 'GenFds',
        'journey.fdf.s5.desc': 'GenFds 依照 [FD] 定義把所有 FV 映像與非 FV 的 raw 資料（NVRAM 區域、microcode、VTF）依偏移量排列到最終 .fd 映像中，大小符合實體 Flash 晶片容量。',
        'journey.fdf.s5.artifact': '*.fd 最終 BIOS ROM',

        'command.title': '建置命令組裝器',
        'command.desc': '快速組合 build 命令，並對照它在管線中的作用。',
        'command.platform': '平台 DSC',
        'command.arch': '架構',
        'command.target': '建置目標',
        'command.toolchain': '工具鏈 Tag',
        'command.mode': '建置模式',
        'command.modePlatform': '整平台',
        'command.modeModule': '單模組',
        'command.modulePath': '模組 INF',
        'command.fdfPath': 'FDF 覆寫',
        'command.useFdf': '啟用 -f（覆寫 DSC 中的 FDF）',
        'command.fdsTarget': '附加 fds 目標（觸發 GenFds ImageGen）',
        'command.generated': '產生的命令：',
        'command.notesTitle': '這些參數對應管線的哪裡',
        'command.note1': '-p 指定 DSC → 觸發 DscParser，決定要建置的所有模組與 Library 對應。',
        'command.note2': '-a/-b/-t 決定架構/目標/工具鏈 → 影響 tools_def.txt 中 CC/Linker 的選擇。',
        'command.note3': '-f 覆寫 FDF 路徑 → 影響 FdfParser 讀取的檔案，進而改變 GenFds 的組裝方式。',
        'command.note4': '-m 進入單模組建置，跳過其他 [Components]，只執行該 INF 的完整路徑。',

        'references.title': '本頁參考的官方 EDK2 文檔',
        'references.desc': '以下章節是本視覺化內容的主要依據。',
        'references.r1': '定義三大階段：AutoGen、MAKE、ImageGen。',
        'references.r2': '說明 DSC/FDF/INF/DEC 解析、Library/PCD 優先序與 AutoGen 輸出。',
        'references.r3': '描述 .efi 到 section/FFS/FV/FD 的 ImageGen 路徑。',
        'references.r4': '列出 GenFds 與其子工具：GenSec、GenFfs、GenFv、GenFw、GenVtf。',
        'references.r5': '說明 FDF [FV] 如何驅動 FV 組裝與 GenFv 輸入。',
        'references.r6': '提供 build.exe 實務參數（-p/-m/-a/-b/-t/-f/-D/--pcd）。',

        'footer.text': 'EDK2 BIOS 編譯流程視覺化 | 教學用途'
    },

    'en': {
        'page.title': 'EDK2 BIOS Build Pipeline Visualizer',

        'nav.back': '← Back to Tools',
        'nav.title': 'EDK2 BIOS Build Pipeline',
        'nav.overview': 'File Types',
        'nav.pipeline': 'Build Pipeline',
        'nav.journey': 'File Journey',
        'nav.command': 'Build Command',
        'nav.references': 'References',

        'hero.eyebrow': 'From Source Metadata to Flashable BIOS ROM',
        'hero.title': 'How your INF / DSC / FDF becomes a BIOS ROM',
        'hero.desc': 'When you write a .inf, .dsc or .fdf, build.exe invokes a chain of programs to parse, compile and assemble it into a flashable .fd (BIOS ROM). Select any file type below to trace its complete journey.',

        'file.inf.title': 'Module Description (.inf)',
        'file.inf.desc': 'Defines a module\'s sources, package dependencies, Library Classes, PCDs and module type. Every UEFI module (Driver/Library/Application) has one INF.',
        'file.inf.track': 'Trace INF path →',

        'file.dsc.title': 'Platform Description (.dsc)',
        'file.dsc.desc': 'Defines which modules to build, Library Class mappings, PCD values and build options for the entire platform. This is the main entry point for build.exe (-p flag).',
        'file.dsc.track': 'Trace DSC path →',

        'file.fdf.title': 'Flash Layout (.fdf)',
        'file.fdf.desc': 'Defines the final BIOS ROM flash layout: which modules go in which FV, FD region sizes and offsets, and Capsule composition rules.',
        'file.fdf.track': 'Trace FDF path →',

        'pipeline.title': 'Build Pipeline: Programs invoked by build.exe',
        'pipeline.desc': 'From running the build command to a BIOS ROM, here is every program called and what it does. Click any node for a detailed explanation.',
        'pipeline.clickHint': 'Click a node for details',

        'pipeline.stage.input': 'Input Files',
        'pipeline.stage.autogen': 'AutoGen Parse Stage',
        'pipeline.stage.make': 'MAKE Compile Stage',
        'pipeline.stage.imagegen': 'ImageGen Assemble Stage',
        'pipeline.stage.output': 'BIOS ROM',

        'pipeline.detail.title': 'Program Details',
        'pipeline.detail.placeholder': '← Click any program node in the pipeline',
        'pipeline.detail.input': 'Input',
        'pipeline.detail.output': 'Output',
        'pipeline.detail.desc': 'Description',

        'tool.build.name': 'build.exe',
        'tool.build.desc': 'The main BaseTools entry point. Reads target.txt and CLI args to determine platform/module/arch, then drives the AutoGen, MAKE and ImageGen stages in sequence.',
        'tool.build.input': 'target.txt, CLI args (-p/-m/-a/-b/-t)',
        'tool.build.output': 'Complete build pipeline: AutoGen → MAKE → GenFds',

        'tool.dscparser.name': 'DscParser',
        'tool.dscparser.desc': 'Parses the platform DSC file, reading [Defines], [LibraryClasses], [Components], [PcdsFixedAtBuild], etc. Builds the platform module list and PCD policy.',
        'tool.dscparser.input': '*.dsc platform description file',
        'tool.dscparser.output': 'Module list, Library Class mappings, platform PCD values',

        'tool.infparser.name': 'InfParser',
        'tool.infparser.desc': 'Parses each module\'s INF file, reading [Sources], [Packages], [LibraryClasses], [Pcd], [BuildOptions], etc. Builds the module dependency graph.',
        'tool.infparser.input': '*.inf module description file',
        'tool.infparser.output': 'Module source list, Library dependencies, PCD references',

        'tool.decparser.name': 'DecParser',
        'tool.decparser.desc': 'Parses package declaration DEC files, reading [Includes], [Guids], [Protocols], [Ppis], [PcdsFixedAtBuild], etc. Provides global GUID/Protocol definitions and PCD defaults.',
        'tool.decparser.input': '*.dec package declaration file',
        'tool.decparser.output': 'Include paths, GUID/Protocol/PPI table, PCD defaults',

        'tool.fdfparser.name': 'FdfParser',
        'tool.fdfparser.desc': 'Parses the FDF flash layout definition, reading [FD], [FV], [Capsule], [Rule] sections and processing !if/!ifdef conditionals. Builds the FV/FD assembly plan.',
        'tool.fdfparser.input': '*.fdf flash layout file',
        'tool.fdfparser.output': 'FD/FV layout plan, FFS ordering, conditional results',

        'tool.autogen.name': 'AutoGen',
        'tool.autogen.desc': 'Uses parser results to recursively resolve Library instances, apply PCD precedence (CLI > DSC > FDF > INF > DEC), and generate AutoGen.c/AutoGen.h (GUID arrays, entry point stubs, PCD accessors) plus module and platform-level Makefiles.',
        'tool.autogen.input': 'DscParser/InfParser/DecParser/FdfParser results',
        'tool.autogen.output': 'AutoGen.c, AutoGen.h, module Makefiles, platform Makefile, AsBuilt INF',

        'tool.make.name': 'nmake / make',
        'tool.make.desc': 'Reads AutoGen-generated Makefiles and invokes the compiler (CC), assembler (ASM), resource compilers (VFR/UNI) and linker in dependency order to produce PE/COFF images.',
        'tool.make.input': 'AutoGen.c/h + source files (.c/.asm/.vfr) + Makefiles',
        'tool.make.output': '*.obj, *.lib, PE/COFF module images',

        'tool.compiler.name': 'CC (gcc / cl.exe)',
        'tool.compiler.desc': 'The actual C compiler, specified by tools_def.txt. GCC5 uses gcc, VS2022 uses cl.exe, CLANGPDB uses clang. Compiler flags come from tools_def.txt and DSC [BuildOptions].',
        'tool.compiler.input': '*.c sources, AutoGen.c/h, header files',
        'tool.compiler.output': '*.obj object files',

        'tool.linker.name': 'Linker (ld / link.exe)',
        'tool.linker.desc': 'Links all .obj and .lib files into a PE32/PE32+ executable with a relocation table, using the correct linker script and base address for the MODULE_TYPE.',
        'tool.linker.input': '*.obj, *.lib, linker script',
        'tool.linker.output': 'PE32/PE32+ executable (with relocation table)',

        'tool.genfw.name': 'GenFw',
        'tool.genfw.desc': 'Converts a standard PE32/PE32+ executable into the .efi format used by UEFI. Strips unnecessary sections, adjusts relocation info, sets image type (TE/PE32) based on MODULE_TYPE.',
        'tool.genfw.input': 'PE32/PE32+ executable',
        'tool.genfw.output': '*.efi (or TE format) UEFI module image',

        'tool.gensec.name': 'GenSec',
        'tool.gensec.desc': 'Wraps a .efi or other binary into an EFI FFS Section per the SectionType in the FDF Rule (PE32/COMPRESS/UI/VERSION/RAW, etc.). COMPRESS sections are LZ77 or LZMA compressed here.',
        'tool.gensec.input': '*.efi or other binary',
        'tool.gensec.output': '*.sec EFI Section (with section header)',

        'tool.genffs.name': 'GenFfs',
        'tool.genffs.desc': 'Packs one or more Sections into an FFS File, adding an EFI_FFS_FILE_HEADER with the module\'s GUID, file type (PEIM/DXE/APP, etc.), attributes and size.',
        'tool.genffs.input': '*.sec Section files (one or more)',
        'tool.genffs.output': '*.ffs FFS File (with FFS header)',

        'tool.genfv.name': 'GenFv',
        'tool.genfv.desc': 'Reads the FV INF config generated from FDF [FV] sections, aligns and packs all .ffs into a Firmware Volume image with EFI_FIRMWARE_VOLUME_HEADER, BlockMap and padding.',
        'tool.genfv.input': 'FV INF config, *.ffs file list',
        'tool.genfv.output': '*.fv Firmware Volume image',

        'tool.genfds.name': 'GenFds',
        'tool.genfds.desc': 'The ImageGen orchestrator. Reads all FDF sections, calls GenSec/GenFfs/GenFv to build FVs, then assembles all FVs and raw regions (NVRAM/microcode/VTF) per [FD] into the final .fd — the BIOS ROM.',
        'tool.genfds.input': 'FDF layout, all module .efi files, FV list',
        'tool.genfds.output': '*.fd final BIOS ROM image',

        'journey.title': 'File Journey: Select a file to trace',
        'journey.desc': 'Select INF, DSC or FDF to see every step and program involved — from first being read to becoming the final BIOS ROM.',

        'journey.tab.inf': '.inf Module',
        'journey.tab.dsc': '.dsc Platform',
        'journey.tab.fdf': '.fdf Flash Layout',

        'journey.inf.title': 'INF Journey: From module description to BIOS ROM',
        'journey.inf.s1.title': 'DSC locates this INF',
        'journey.inf.s1.program': 'build.exe + DscParser',
        'journey.inf.s1.desc': 'build.exe reads the DSC from -p. DscParser parses the [Components] section, finds this INF path and adds it to the module build list.',
        'journey.inf.s1.artifact': 'DSC [Components] entry',

        'journey.inf.s2.title': 'InfParser reads the INF',
        'journey.inf.s2.program': 'InfParser',
        'journey.inf.s2.desc': 'Reads [Defines] (MODULE_TYPE, ENTRY_POINT), [Sources] (.c/.h files), [Packages] (dependent DECs), [LibraryClasses] (Library requirements), [Pcd] (used PCDs), [BuildOptions] (extra flags).',
        'journey.inf.s2.artifact': 'Module dependency graph, source list',

        'journey.inf.s3.title': 'AutoGen generates glue code',
        'journey.inf.s3.program': 'AutoGen',
        'journey.inf.s3.desc': 'Resolves LibraryClass dependencies recursively, applies PCD precedence. Generates AutoGen.c (GUID array, ModuleEntryPoint wrapper, PCD accessors), AutoGen.h (ExternLibrary declarations) and a module Makefile.',
        'journey.inf.s3.artifact': 'AutoGen.c / AutoGen.h / Makefile',

        'journey.inf.s4.title': 'CC compiles all .c sources',
        'journey.inf.s4.program': 'nmake → CC (gcc / cl.exe)',
        'journey.inf.s4.desc': 'nmake/make invokes CC for each .c in [Sources] and AutoGen.c, applying flags from tools_def.txt and [BuildOptions].',
        'journey.inf.s4.artifact': '*.obj object files',

        'journey.inf.s5.title': 'Linker links into PE/COFF',
        'journey.inf.s5.program': 'Linker (ld / link.exe)',
        'journey.inf.s5.desc': 'Links all .obj and resolved Library .lib files into a PE32/PE32+ executable with relocation table for the UEFI execution environment.',
        'journey.inf.s5.artifact': 'PE32/PE32+ executable',

        'journey.inf.s6.title': 'GenFw converts to .efi',
        'journey.inf.s6.program': 'GenFw',
        'journey.inf.s6.desc': 'Converts PE32 to the .efi format needed by UEFI (or TE format for PEI-phase modules). Strips unnecessary data and adjusts relocations.',
        'journey.inf.s6.artifact': '*.efi module image',

        'journey.inf.s7.title': 'GenSec wraps into Section',
        'journey.inf.s7.program': 'GenSec',
        'journey.inf.s7.desc': 'Wraps .efi into a PE32 Section per the FDF Rule. Optionally compresses (COMPRESS Section using LZ77/LZMA). Adds EFI_SECTION_HEADER.',
        'journey.inf.s7.artifact': '*.sec EFI Section',

        'journey.inf.s8.title': 'GenFfs packs into FFS File',
        'journey.inf.s8.program': 'GenFfs',
        'journey.inf.s8.desc': 'Packs the section into an FFS File with EFI_FFS_FILE_HEADER containing this module\'s GUID and file type (PEIM/DXE Driver/Application, etc.).',
        'journey.inf.s8.artifact': '*.ffs FFS file',

        'journey.inf.s9.title': 'GenFv / GenFds assembles into ROM',
        'journey.inf.s9.program': 'GenFv → GenFds',
        'journey.inf.s9.desc': '.ffs is placed into a Firmware Volume by GenFv per FDF [FV] rules, then GenFds assembles all FVs and raw regions per [FD] into the final .fd BIOS ROM.',
        'journey.inf.s9.artifact': '*.fd BIOS ROM',

        'journey.dsc.title': 'DSC Journey: From platform policy to BIOS ROM',
        'journey.dsc.s1.title': 'build.exe reads DSC as entry point',
        'journey.dsc.s1.program': 'build.exe',
        'journey.dsc.s1.desc': 'build -p xxx.dsc sets this DSC as the platform entry. build.exe reads target.txt for ARCH/TARGET/TOOL_CHAIN_TAG defaults then passes the DSC to DscParser.',
        'journey.dsc.s1.artifact': 'ActivePlatform context',

        'journey.dsc.s2.title': 'DscParser reads all sections',
        'journey.dsc.s2.program': 'DscParser',
        'journey.dsc.s2.desc': 'Parses [Defines] (PLATFORM_NAME, OUTPUT_DIRECTORY, FLASH_DEFINITION), [LibraryClasses] (Library mappings), [Components] (module list), [Pcds*] (PCD values for all types).',
        'journey.dsc.s2.artifact': 'Module list, Library mapping table, PCD value table',

        'journey.dsc.s3.title': 'DSC Library mappings applied',
        'journey.dsc.s3.program': 'AutoGen',
        'journey.dsc.s3.desc': 'AutoGen uses the DSC [LibraryClasses] mappings to resolve the actual Library .inf for each module, recursively until all Library dependencies are satisfied.',
        'journey.dsc.s3.artifact': 'Complete Library dependency graph per module',

        'journey.dsc.s4.title': 'DSC PCD values injected into AutoGen',
        'journey.dsc.s4.program': 'AutoGen',
        'journey.dsc.s4.desc': 'AutoGen applies PCD precedence: CLI > DSC > FDF > INF > DEC. DSC PCD values override INF/DEC defaults and are written into PCD accessor functions in AutoGen.c.',
        'journey.dsc.s4.artifact': 'PCD values in AutoGen.c',

        'journey.dsc.s5.title': 'Platform Makefile drives all modules',
        'journey.dsc.s5.program': 'AutoGen → nmake/make',
        'journey.dsc.s5.desc': 'AutoGen generates a platform-level Makefile listing all module Makefiles from [Components]. nmake/make builds each in dependency order, each following INF path steps S4→S6.',
        'journey.dsc.s5.artifact': '*.efi for all modules',

        'journey.dsc.s6.title': 'DSC\'s FDF triggers ImageGen',
        'journey.dsc.s6.program': 'build.exe → GenFds',
        'journey.dsc.s6.desc': 'DSC [Defines] FLASH_DEFINITION points to the FDF. The build fds target triggers GenFds, which reads the FDF and coordinates GenSec/GenFfs/GenFv to assemble all .efi into the BIOS ROM.',
        'journey.dsc.s6.artifact': '*.fd BIOS ROM',

        'journey.fdf.title': 'FDF Journey: From flash layout to BIOS ROM',
        'journey.fdf.s1.title': 'DSC points to FDF via FLASH_DEFINITION',
        'journey.fdf.s1.program': 'DscParser',
        'journey.fdf.s1.desc': 'DscParser reads FLASH_DEFINITION = xxx.fdf from DSC [Defines] and records the FDF path. Can also be overridden with build -f on the command line.',
        'journey.fdf.s1.artifact': 'FDF path reference',

        'journey.fdf.s2.title': 'FdfParser reads the flash layout',
        'journey.fdf.s2.program': 'FdfParser',
        'journey.fdf.s2.desc': 'Parses [FD] (flash device size and regions), [FV] (Firmware Volume size, attributes and FFS contents), [Rule] (module wrapping rules), [Capsule] (update capsule). Handles !if/!ifdef/!include conditionals.',
        'journey.fdf.s2.artifact': 'FD/FV/Rule/Capsule layout objects',

        'journey.fdf.s3.title': 'FDF [FV] triggers FFS packaging',
        'journey.fdf.s3.program': 'GenFds → GenSec → GenFfs',
        'journey.fdf.s3.desc': 'For each INF entry in [FV], GenFds finds the .efi, calls GenSec to wrap into sections per the [Rule] (optionally compressing), then calls GenFfs to pack into an FFS File with the GUID from INF FILE_GUID.',
        'journey.fdf.s3.artifact': '*.ffs per module',

        'journey.fdf.s4.title': 'FDF [FV] triggers FV assembly',
        'journey.fdf.s4.program': 'GenFv',
        'journey.fdf.s4.desc': 'GenFds generates a FV INF config for each [FV] section, then calls GenFv to align and pack all .ffs into a Firmware Volume with EFI_FIRMWARE_VOLUME_HEADER, BlockMap and padding.',
        'journey.fdf.s4.artifact': '*.fv Firmware Volume',

        'journey.fdf.s5.title': 'FDF [FD] assembles the final BIOS ROM',
        'journey.fdf.s5.program': 'GenFds',
        'journey.fdf.s5.desc': 'GenFds places all FV images and raw data regions (NVRAM, microcode, VTF) at their specified offsets per [FD] to produce the final .fd matching the physical flash chip capacity.',
        'journey.fdf.s5.artifact': '*.fd final BIOS ROM',

        'command.title': 'Build Command Builder',
        'command.desc': 'Compose a build command and see which pipeline programs it activates.',
        'command.platform': 'Platform DSC',
        'command.arch': 'Architecture',
        'command.target': 'Build target',
        'command.toolchain': 'Toolchain tag',
        'command.mode': 'Build mode',
        'command.modePlatform': 'Platform',
        'command.modeModule': 'Single module',
        'command.modulePath': 'Module INF',
        'command.fdfPath': 'FDF override',
        'command.useFdf': 'Enable -f (override DSC\'s FDF)',
        'command.fdsTarget': 'Append fds target (trigger GenFds ImageGen)',
        'command.generated': 'Generated command:',
        'command.notesTitle': 'How these flags map to the pipeline',
        'command.note1': '-p selects DSC → triggers DscParser, defines the entire module set and Library mappings.',
        'command.note2': '-a/-b/-t set arch/target/toolchain → determines which CC/Linker in tools_def.txt is used.',
        'command.note3': '-f overrides the FDF path → changes what FdfParser reads and how GenFds assembles the ROM.',
        'command.note4': '-m builds only this INF, skipping other [Components], but still uses full platform context.',

        'references.title': 'Official EDK2 docs referenced for this page',
        'references.desc': 'The pipeline and naming on this page are based on the following specification chapters.',
        'references.r1': 'Defines the 3 major stages: AutoGen, MAKE and ImageGen.',
        'references.r2': 'Details DSC/FDF/INF/DEC parsing, Library/PCD precedence and AutoGen outputs.',
        'references.r3': 'Documents the .efi → section/FFS/FV/FD conversion path.',
        'references.r4': 'Shows GenFds invocation and sub-tools: GenSec, GenFfs, GenFv, GenFw, GenVtf.',
        'references.r5': 'Explains how [FV] in FDF drives FV composition and the generated FV INF for GenFv.',
        'references.r6': 'Covers practical build.exe options: -p/-m/-a/-b/-t/-f/-D and --pcd.',

        'footer.text': 'EDK2 BIOS Build Pipeline Visualization | Educational purpose'
    }
};

let currentLang = 'zh-TW';

function t(key, params = {}) {
    let text = (translations[currentLang] && translations[currentLang][key]) ||
        (translations.en && translations.en[key]) ||
        key;

    Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}

function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        const value = t(key);

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = value;
        } else {
            el.innerHTML = value;
        }
    });

    document.title = t('page.title');
}

function setLanguage(lang) {
    currentLang = translations[lang] ? lang : 'en';
    localStorage.setItem('uefi-viz-lang', currentLang);

    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    document.documentElement.lang = currentLang;
    updatePageTranslations();

    if (typeof refreshDynamicContent === 'function') {
        refreshDynamicContent();
    }
    if (typeof updateBuildCommand === 'function') {
        updateBuildCommand();
    }
}

function initI18n() {
    const saved = localStorage.getItem('uefi-viz-lang') || 'zh-TW';

    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    setLanguage(saved);
}

function getCurrentLang() {
    return currentLang;
}
