const translations = {
    'zh-TW': {
        'page.title': 'EDK2 BaseTools 建置流程視覺化',

        'nav.back': '← Back to Tools',
        'nav.title': 'EDK2 Build Infrastructure',
        'nav.architecture': '架構總覽',
        'nav.flow': '建置流程',
        'nav.journey': 'DSC/INF/FDF 路徑',
        'nav.command': '建置命令',
        'nav.references': '參考來源',

        'hero.eyebrow': 'From Meta-data to Firmware Image',
        'hero.title': 'EDK2 BaseTools 如何把 .dsc / .inf / .fdf 組成最終 FV',
        'hero.desc': '本頁依照 EDK II Build Specification：AutoGen 解析平台 meta-data、MAKE 產生模組二進位，再由 ImageGen 透過 GenSec、GenFfs、GenFv、GenFds 組裝最終韌體映像。',

        'artifact.dsc.title': '平台描述 (DSC)',
        'artifact.dsc.desc': '定義平台要建置的模組、Library Class 對應、平台 PCD 與建置選項，並可指定 FDF。',
        'artifact.inf.title': '模組描述 (INF)',
        'artifact.inf.desc': '描述模組來源檔、套件相依、ModuleType、BuildOptions 與二進位項目。',
        'artifact.dec.title': '套件宣告 (DEC)',
        'artifact.dec.desc': '提供套件 include 路徑、GUID/Protocol/PPI 宣告與 PCD 預設值。',
        'artifact.fdf.title': '映像佈局 (FDF)',
        'artifact.fdf.desc': '定義 [FV]/[FD]/[Capsule] 版面、FFS 排列與 Flash 區域配置規則。',
        'artifact.conf.title': '建置設定 (Conf)',
        'artifact.conf.desc': 'target.txt、tools_def.txt、build_rule.txt 決定架構、工具鏈與規則。',
        'artifact.fv.title': '最終韌體映像',
        'artifact.fv.desc': 'ImageGen 先組成 FV，再由 GenFds 產生最終 FD / Capsule / ROM 輸出。',

        'flow.title': 'BaseTools 管線（官方 3 階段模型）',
        'flow.desc': '依序觀察從 edksetup / build.exe 到最終韌體映像輸出的每個階段。',
        'flow.codeTitle': '代表命令 / 內部動作',
        'flow.inputTitle': '本階段主要輸入',
        'flow.outputTitle': '本階段主要輸出',

        'btn.prev': '← 上一步',
        'btn.next': '下一步 →',
        'btn.reset': '重置',
        'step.indicator': '步驟 {current} / {total}',

        'flow.step1.title': '階段 1：初始化建置環境',
        'flow.step1.node': 'Setup',
        'flow.step1.desc': '執行 edksetup，建立 WORKSPACE / EDK_TOOLS_PATH 與 PATH，並準備 Conf 設定。',
        'flow.step1.in1': 'edksetup.bat / edksetup.sh',
        'flow.step1.in2': 'WORKSPACE、EDK_TOOLS_PATH',
        'flow.step1.in3': 'Conf/target.txt',
        'flow.step1.out1': '可執行 build.exe 的環境',
        'flow.step1.out2': '預設平台與工具鏈上下文',

        'flow.step2.title': '階段 2：決定要建什麼',
        'flow.step2.node': 'Select',
        'flow.step2.desc': '依 target.txt 與命令列參數 (-p/-m/-a/-b/-t) 決定 ActivePlatform、模組模式與建置矩陣。',
        'flow.step2.in1': 'target.txt 的 ACTIVE_PLATFORM / TARGET_ARCH / TARGET / TOOL_CHAIN_TAG',
        'flow.step2.in2': 'build 命令列覆寫參數',
        'flow.step2.in3': '工作目錄中的 DSC/INF',
        'flow.step2.out1': 'PlatformBuild 或 SingleModuleBuild 模式',
        'flow.step2.out2': '最終的 Arch / Target / ToolChain 組合',

        'flow.step3.title': '階段 3：解析工具鏈與規則',
        'flow.step3.node': 'ToolConf',
        'flow.step3.desc': '解析 TOOL_CHAIN_CONF (tools_def.txt) 與 BUILD_RULE_CONF (build_rule.txt)，建出工具與規則資料庫。',
        'flow.step3.in1': 'TOOL_CHAIN_CONF -> tools_def.txt',
        'flow.step3.in2': 'BUILD_RULE_CONF -> build_rule.txt',
        'flow.step3.in3': 'DSC/INF 可能追加的 BuildOptions',
        'flow.step3.out1': '<TOOLCODE> / <TOOLCODE>_FLAGS',
        'flow.step3.out2': '副檔名到建置規則的對應圖',

        'flow.step4.title': '階段 4：解析 DSC / INF / DEC / FDF',
        'flow.step4.node': 'MetaParse',
        'flow.step4.desc': '收集平台模組、LibraryClass、PCD、套件與映像佈局資訊；FDF 在 AutoGen 階段先提供 PCD 相關資訊。',
        'flow.step4.in1': 'DSC（平台組態與元件清單）',
        'flow.step4.in2': 'INF / DEC（模組與套件 metadata）',
        'flow.step4.in3': 'FDF（條件式與 PCD 參考）',
        'flow.step4.out1': '模組與套件依賴圖',
        'flow.step4.out2': '平台層級的 PCD / Library 候選集合',

        'flow.step5.title': '階段 5：AutoGen 後處理',
        'flow.step5.node': 'AutoGen',
        'flow.step5.desc': '解析 Library instance 與 PCD 優先序，產生 AutoGen 程式碼、Makefiles 與 AsBuilt INF。',
        'flow.step5.in1': 'LibraryClasses 與 <LibraryClasses> 區段',
        'flow.step5.in2': 'PCD 優先序（CLI -> DSC -> FDF -> INF -> DEC）',
        'flow.step5.in3': '.uni / .idf / .vfr 等特殊來源',
        'flow.step5.out1': 'AutoGen.c / AutoGen.h 與 Build 目錄結構',
        'flow.step5.out2': '模組與平台 Makefiles、AsBuilt INF',

        'flow.step6.title': '階段 6：MAKE 階段',
        'flow.step6.node': 'MAKE',
        'flow.step6.desc': '由 Makefiles 呼叫外部工具鏈進行編譯與連結，輸出 PE/COFF 與 .efi 模組映像。',
        'flow.step6.in1': 'AutoGen 輸出與 Makefiles',
        'flow.step6.in2': '來源檔、標頭、套件 include 路徑',
        'flow.step6.in3': '工具鏈定義與旗標',
        'flow.step6.out1': 'PE32/PE32+/COFF 與 .efi',
        'flow.step6.out2': '中繼產物（obj/map/pdb 等）',

        'flow.step7.title': '階段 7：ImageGen / GenFds 協調',
        'flow.step7.node': 'ImageGen',
        'flow.step7.desc': '若執行 fds 目標，build 會進入 ImageGen：GenSec 產生 section，GenFfs 產生 FFS，GenFv 產生 FV，再由 GenFds 組 FD。',
        'flow.step7.in1': '.efi 與其他二進位輸入',
        'flow.step7.in2': 'FDF [FV]/[FD]/[Capsule] 規則',
        'flow.step7.in3': '來自 build 的 -D 巨集與上下文',
        'flow.step7.out1': '.sec -> .ffs -> .fv 中間結果',
        'flow.step7.out2': '由 GenFds 控制的映像組裝流程',

        'flow.step8.title': '階段 8：最終韌體輸出',
        'flow.step8.node': 'Final',
        'flow.step8.desc': '產生最終 FD/FV/Capsule（必要時含 Option ROM），作為燒錄、更新或發布用二進位。',
        'flow.step8.in1': 'ImageGen 產生的 FV / FFS / section',
        'flow.step8.in2': '[FD] 區域與可直接包含的 binary',
        'flow.step8.in3': 'Capsule / ROM 目標設定',
        'flow.step8.out1': '最終 .fd / .fv / .cap / .rom',
        'flow.step8.out2': '可發布或燒錄的韌體映像',

        'journey.title': '.dsc / .inf / .fdf 如何收斂到最終 FV',
        'journey.desc': 'DSC 決定平台策略、INF 描述模組、FDF 定義映像版圖；BaseTools 解析後把所有資訊組成最終韌體。',
        'journey.diagramTitle': '相依與責任邊界圖',
        'journey.tableTitle': '階段輸入 / 輸出矩陣',
        'journey.boxDsc': '平台策略',
        'journey.boxInf': '模組配方',
        'journey.boxDec': '套件宣告',
        'journey.boxConf': '建置旋鈕',
        'journey.boxAutoGenTitle': 'AutoGen + Makefiles',
        'journey.boxAutoGenDesc': '解 library / PCD 與建圖',
        'journey.boxMakeTitle': 'MAKE 階段',
        'journey.boxMakeDesc': '編譯 / 連結成 .efi',
        'journey.boxImageGenTitle': 'GenFds 協調',
        'journey.boxImageGenDesc': 'GenSec → GenFfs → GenFv',
        'journey.final': 'Final FV / FD / Capsule',

        'journey.table.stage': '階段',
        'journey.table.input': '主要輸入',
        'journey.table.output': '主要輸出',

        'journey.row.setup.stage': '環境建立',
        'journey.row.setup.input': 'WORKSPACE、EDK_TOOLS_PATH、Conf/target.txt',
        'journey.row.setup.output': 'Active platform / toolchain 上下文',

        'journey.row.autogen.stage': 'AutoGen 解析',
        'journey.row.autogen.input': 'DSC + INF + DEC + FDF(+PCD)',
        'journey.row.autogen.output': 'AutoGen.c/h、Makefiles、AsBuilt INF',

        'journey.row.make.stage': 'MAKE 階段',
        'journey.row.make.input': 'Makefiles + source + tools_def',
        'journey.row.make.output': 'PE/COFF 與 .efi 模組',

        'journey.row.image.stage': 'ImageGen 階段',
        'journey.row.image.input': '.efi + FDF [FV]/[FD] 佈局規則',
        'journey.row.image.output': '.sec/.ffs/.fv 與最終 .fd',

        'command.title': '建置命令組裝器',
        'command.desc': '快速組合常用 build 命令，並對照它在流程中的作用。',
        'command.platform': '平台 DSC',
        'command.arch': '架構',
        'command.target': '建置目標',
        'command.toolchain': '工具鏈 Tag',
        'command.mode': '建置模式',
        'command.modePlatform': '整平台',
        'command.modeModule': '單模組',
        'command.modulePath': '模組 INF',
        'command.fdfPath': 'FDF 覆寫',
        'command.useFdf': '啟用 -f (覆寫 FDF)',
        'command.fdsTarget': '附加 fds 目標（觸發 ImageGen/GenFds）',
        'command.generated': '產生的命令：',
        'command.notesTitle': '這些參數為什麼重要',
        'command.note1': '-p 指定平台 DSC，決定模組集合、Library 對應與平台 PCD 政策。',
        'command.note2': '-a/-b/-t 指定架構、目標與工具鏈；命令列會覆蓋 target.txt。',
        'command.note3': '-f 可覆蓋 DSC 內 FDF，fds 目標會進入 GenFds 影像生成。',
        'command.note4': '-m 進入單模組建置，但仍沿用平台上下文。',

        'references.title': '本頁已核對的官方 EDK2 文檔',
        'references.desc': '以下章節是本視覺化內容的主要依據。',
        'references.r1': '定義三大階段：AutoGen、MAKE、ImageGen。',
        'references.r2': '說明 DSC/FDF/INF/DEC 解析、Library/PCD 優先序與 AutoGen 輸出。',
        'references.r3': '描述 .efi 到 section/FFS/FV/FD 的 ImageGen 路徑。',
        'references.r4': '列出 GenFds 與其子工具：GenSec、GenFfs、GenFv、GenFw、GenVtf。',
        'references.r5': '說明 FDF [FV] 如何驅動 FV 組裝與 GenFv 輸入。',
        'references.r6': '提供 build.exe 實務參數（-p/-m/-a/-b/-t/-f/-D/--pcd）。',

        'footer.text': 'EDK2 BaseTools 建置流程視覺化 | 教學用途'
    },

    'en': {
        'page.title': 'EDK2 BaseTools Build Flow Visualizer',

        'nav.back': '← Back to Tools',
        'nav.title': 'EDK2 Build Infrastructure',
        'nav.architecture': 'Architecture',
        'nav.flow': 'Build Flow',
        'nav.journey': 'DSC/INF/FDF Journey',
        'nav.command': 'Build Command',
        'nav.references': 'References',

        'hero.eyebrow': 'From Meta-data to Firmware Image',
        'hero.title': 'How EDK2 BaseTools turn .dsc / .inf / .fdf into final FV',
        'hero.desc': 'This page follows the official EDK II Build Specification: AutoGen parses platform meta-data, the MAKE stage produces module binaries, then ImageGen assembles final images through GenSec, GenFfs, GenFv and GenFds.',

        'artifact.dsc.title': 'Platform Description (DSC)',
        'artifact.dsc.desc': 'Defines active modules, library class mappings, platform PCD policy, build options, and optional FDF path.',
        'artifact.inf.title': 'Module Description (INF)',
        'artifact.inf.desc': 'Describes module sources, package dependencies, module type, build options and binary sections.',
        'artifact.dec.title': 'Package Declaration (DEC)',
        'artifact.dec.desc': 'Provides package include paths, GUID/Protocol/PPI declarations and package-level PCD defaults.',
        'artifact.fdf.title': 'Flash Layout (FDF)',
        'artifact.fdf.desc': 'Defines [FV]/[FD]/[Capsule] layout rules, FFS placement and flash-region composition.',
        'artifact.conf.title': 'Build Configuration (Conf)',
        'artifact.conf.desc': 'target.txt, tools_def.txt and build_rule.txt resolve architecture, toolchain and invocation rules.',
        'artifact.fv.title': 'Firmware Images',
        'artifact.fv.desc': 'ImageGen creates FV first, then GenFds produces final FD / Capsule / ROM outputs.',

        'flow.title': 'BaseTools pipeline (official 3-stage model)',
        'flow.desc': 'Walk through each stage from edksetup/build.exe inputs to final firmware image outputs.',
        'flow.codeTitle': 'Representative command / operation',
        'flow.inputTitle': 'Main input for this stage',
        'flow.outputTitle': 'Main output for this stage',

        'btn.prev': '← Previous',
        'btn.next': 'Next →',
        'btn.reset': 'Reset',
        'step.indicator': 'Step {current} / {total}',

        'flow.step1.title': 'Stage 1: Initialize build environment',
        'flow.step1.node': 'Setup',
        'flow.step1.desc': 'Run edksetup to establish WORKSPACE / EDK_TOOLS_PATH / PATH and prepare Conf defaults.',
        'flow.step1.in1': 'edksetup.bat / edksetup.sh',
        'flow.step1.in2': 'WORKSPACE and EDK_TOOLS_PATH',
        'flow.step1.in3': 'Conf/target.txt defaults',
        'flow.step1.out1': 'Environment ready for build.exe',
        'flow.step1.out2': 'Default platform/toolchain context',

        'flow.step2.title': 'Stage 2: Determine what to build',
        'flow.step2.node': 'Select',
        'flow.step2.desc': 'Use target.txt and CLI options (-p/-m/-a/-b/-t) to resolve ActivePlatform, mode and build matrix.',
        'flow.step2.in1': 'ACTIVE_PLATFORM / TARGET_ARCH / TARGET / TOOL_CHAIN_TAG in target.txt',
        'flow.step2.in2': 'Command-line overrides',
        'flow.step2.in3': 'DSC/INF found in working dir',
        'flow.step2.out1': 'PlatformBuild or SingleModuleBuild mode',
        'flow.step2.out2': 'Resolved Arch / Target / ToolChain combinations',

        'flow.step3.title': 'Stage 3: Parse toolchain and build rules',
        'flow.step3.node': 'ToolConf',
        'flow.step3.desc': 'Parse TOOL_CHAIN_CONF (tools_def.txt) and BUILD_RULE_CONF (build_rule.txt) into tool/rule databases.',
        'flow.step3.in1': 'TOOL_CHAIN_CONF -> tools_def.txt',
        'flow.step3.in2': 'BUILD_RULE_CONF -> build_rule.txt',
        'flow.step3.in3': 'DSC/INF build option overrides',
        'flow.step3.out1': '<TOOLCODE> / <TOOLCODE>_FLAGS macros',
        'flow.step3.out2': 'Extension-to-rule dependency graph',

        'flow.step4.title': 'Stage 4: Parse DSC / INF / DEC / FDF',
        'flow.step4.node': 'MetaParse',
        'flow.step4.desc': 'Collect modules, library classes, PCD data, package dependencies and flash-layout intent from metadata.',
        'flow.step4.in1': 'DSC (platform policy + component list)',
        'flow.step4.in2': 'INF / DEC (module + package metadata)',
        'flow.step4.in3': 'FDF (conditionals + PCD references)',
        'flow.step4.out1': 'Module/package dependency graph',
        'flow.step4.out2': 'Platform-level PCD and library candidate sets',

        'flow.step5.title': 'Stage 5: AutoGen post-processing',
        'flow.step5.node': 'AutoGen',
        'flow.step5.desc': 'Resolve library instances and PCD precedence, then generate AutoGen code, makefiles and AsBuilt INF.',
        'flow.step5.in1': 'LibraryClasses and <LibraryClasses> scopes',
        'flow.step5.in2': 'PCD precedence (CLI -> DSC -> FDF -> INF -> DEC)',
        'flow.step5.in3': '.uni / .idf / .vfr and related metadata',
        'flow.step5.out1': 'AutoGen.c / AutoGen.h and build directories',
        'flow.step5.out2': 'Module/platform makefiles and AsBuilt INF',

        'flow.step6.title': 'Stage 6: MAKE stage',
        'flow.step6.node': 'MAKE',
        'flow.step6.desc': 'Use generated makefiles and toolchain flags to compile/link modules into PE/COFF and .efi binaries.',
        'flow.step6.in1': 'AutoGen output and makefiles',
        'flow.step6.in2': 'Source files, includes and package headers',
        'flow.step6.in3': 'Tool definitions and flags',
        'flow.step6.out1': 'PE32/PE32+/COFF and .efi outputs',
        'flow.step6.out2': 'Intermediate artifacts (obj/map/pdb)',

        'flow.step7.title': 'Stage 7: ImageGen / GenFds orchestration',
        'flow.step7.node': 'ImageGen',
        'flow.step7.desc': 'When fds target is requested, build enters ImageGen: GenSec -> GenFfs -> GenFv, orchestrated by GenFds.',
        'flow.step7.in1': '.efi and additional binary inputs',
        'flow.step7.in2': 'FDF [FV]/[FD]/[Capsule] layout rules',
        'flow.step7.in3': 'Build context and -D macro values',
        'flow.step7.out1': '.sec -> .ffs -> .fv intermediates',
        'flow.step7.out2': 'GenFds-driven image assembly',

        'flow.step8.title': 'Stage 8: Final firmware outputs',
        'flow.step8.node': 'Final',
        'flow.step8.desc': 'Produce final FD/FV/Capsule outputs (and Option ROM when applicable) for flash/update/release usage.',
        'flow.step8.in1': 'ImageGen-produced FV / FFS / section data',
        'flow.step8.in2': '[FD] regions and raw binary inclusions',
        'flow.step8.in3': 'Capsule / ROM target directives',
        'flow.step8.out1': 'Final .fd / .fv / .cap / .rom artifacts',
        'flow.step8.out2': 'Deployable firmware image set',

        'journey.title': 'How .dsc / .inf / .fdf converge into final FV',
        'journey.desc': 'DSC defines platform policy, INF defines module build recipe, FDF defines image layout; BaseTools resolves and assembles all of them.',
        'journey.diagramTitle': 'Dependency and ownership map',
        'journey.tableTitle': 'Stage input/output matrix',
        'journey.boxDsc': 'Platform policy',
        'journey.boxInf': 'Module recipe',
        'journey.boxDec': 'Package metadata',
        'journey.boxConf': 'Build knobs',
        'journey.boxAutoGenTitle': 'AutoGen + Makefiles',
        'journey.boxAutoGenDesc': 'Resolve libs, PCDs and graph',
        'journey.boxMakeTitle': 'MAKE stage',
        'journey.boxMakeDesc': 'Compile / link into .efi',
        'journey.boxImageGenTitle': 'GenFds orchestration',
        'journey.boxImageGenDesc': 'GenSec → GenFfs → GenFv',
        'journey.final': 'Final FV / FD / Capsule',

        'journey.table.stage': 'Stage',
        'journey.table.input': 'Primary input',
        'journey.table.output': 'Primary output',

        'journey.row.setup.stage': 'Environment setup',
        'journey.row.setup.input': 'WORKSPACE, EDK_TOOLS_PATH, Conf/target.txt',
        'journey.row.setup.output': 'Active platform/toolchain context',

        'journey.row.autogen.stage': 'AutoGen parse',
        'journey.row.autogen.input': 'DSC + INF + DEC + FDF(+PCD)',
        'journey.row.autogen.output': 'AutoGen.c/h, makefiles, AsBuilt INF',

        'journey.row.make.stage': 'MAKE stage',
        'journey.row.make.input': 'Makefiles + sources + tools_def',
        'journey.row.make.output': 'PE/COFF and .efi module binaries',

        'journey.row.image.stage': 'ImageGen stage',
        'journey.row.image.input': '.efi + FDF [FV]/[FD] layout rules',
        'journey.row.image.output': '.sec/.ffs/.fv and final .fd',

        'command.title': 'Build command builder',
        'command.desc': 'Compose practical build commands and map them to the pipeline behavior.',
        'command.platform': 'Platform DSC',
        'command.arch': 'Architecture',
        'command.target': 'Build target',
        'command.toolchain': 'Toolchain tag',
        'command.mode': 'Build mode',
        'command.modePlatform': 'Platform',
        'command.modeModule': 'Single module',
        'command.modulePath': 'Module INF',
        'command.fdfPath': 'FDF override',
        'command.useFdf': 'Enable -f (override FDF)',
        'command.fdsTarget': 'Append fds target (trigger ImageGen/GenFds)',
        'command.generated': 'Generated command:',
        'command.notesTitle': 'Why these options matter',
        'command.note1': '-p selects platform graph, module set, library mapping and platform PCD policy.',
        'command.note2': '-a/-b/-t choose architecture, target and toolchain; CLI overrides target.txt.',
        'command.note3': '-f overrides FDF from DSC, and fds target drives GenFds image generation.',
        'command.note4': '-m switches to module-only build while still using platform context.',

        'references.title': 'Official EDK2 docs checked for this page',
        'references.desc': 'The flow and naming on this page are derived from the chapters below.',
        'references.r1': 'Defines the 3 major stages: AutoGen, MAKE and ImageGen.',
        'references.r2': 'Details DSC/FDF/INF/DEC parsing, library/PCD precedence and AutoGen outputs.',
        'references.r3': 'Documents the .efi -> section/FFS/FV/FD conversion path.',
        'references.r4': 'Shows GenFds invocation and sub-tools: GenSec, GenFfs, GenFv, GenFw, GenVtf.',
        'references.r5': 'Explains how [FV] in FDF drives FV composition and generated FV INF for GenFv.',
        'references.r6': 'Covers practical build.exe options such as -p/-m/-a/-b/-t/-f/-D and --pcd.',

        'footer.text': 'EDK2 BaseTools Build Flow Visualization | Educational purpose'
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
    localStorage.setItem('uefi-build-viz-lang', currentLang);

    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    document.documentElement.lang = currentLang;
    updatePageTranslations();

    if (typeof renderFlowStep === 'function') {
        renderFlowStep(currentFlowStep || 0);
    }
    if (typeof updateBuildCommand === 'function') {
        updateBuildCommand();
    }
}

function initI18n() {
    const saved = localStorage.getItem('uefi-build-viz-lang') || 'zh-TW';

    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    setLanguage(saved);
}

function getCurrentLang() {
    return currentLang;
}
