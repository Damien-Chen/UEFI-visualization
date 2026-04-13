# UEFI Developer Tools

Interactive visualization tools for UEFI/EDK2 development hosted on GitHub Pages.

## Tools Included

### 1. Memory Management Visualizer
Interactive visualization of UEFI EDK2 memory management concepts:
- **Data Structures**: LIST_ENTRY, MEMORY_MAP_ENTRY
- **Memory Layout**: System memory regions and initialization
- **Allocation Process**: Step-by-step AllocatePages visualization
- **Deallocation Process**: FreePages and memory coalescing

Supports both English and Traditional Chinese (繁體中文).

### 2. USB HID Key Code Viewer
Interactive keyboard viewer showing USB HID Usage IDs and UEFI EDK2 EFI key codes:
- **US ANSI** (104-key)
- **European ISO** (105-key)
- **Japanese JIS** (109-key)

Hover over any key to see its HID Usage ID and corresponding EFI Key code.

### 3. EDK2 Build Infrastructure Visualizer
Interactive visualization of how EDK2 BaseTools process build metadata into final firmware images:
- **Build Stages**: Setup, AutoGen, MAKE, ImageGen
- **Metadata Flow**: `.dsc`, `.inf`, `.dec`, `.fdf`, `Conf/*.txt`
- **Image Pipeline**: GenSec → GenFfs → GenFv → GenFds
- **Final Outputs**: FV / FD / Capsule / ROM artifacts

Includes bilingual content (English + Traditional Chinese) and references to official EDK2 Build Specification chapters.

### 4. PEI Shadow Process Visualizer
Interactive visualization of the PEI Core shadow process during UEFI boot:
- **Overview**: What PEI Shadow is, why it's needed, and when it happens
- **Memory Architecture**: Flash ROM, Cache as RAM (CAR), and DRAM layout
- **Shadow Flow**: 9-step interactive walkthrough from SEC handoff to DXE handoff
- **Pointer Fixup**: HOB list, PPI database, and stack pointer adjustment
- **Code Analysis**: Key EDK2 source code snippets with explanations

Supports both English and Traditional Chinese (繁體中文).

### 5. SMM/MM Communication Visualizer
Interactive visualization of how DXE triggers and communicates with SMM/Standalone MM:
- **Overview**: What SMM is, why communication is needed, and Standalone MM introduction
- **Memory Architecture**: Normal DRAM, SMRAM/TSEG, and Communication Buffer layout
- **SMI Trigger**: SW SMI via I/O port 0xB2, CPU state save, SMBASE entry, RSM return
- **Communication Flow**: 8-step interactive walkthrough from LocateProtocol to RSM return
- **Buffer Internals**: EFI_SMM_COMMUNICATE_HEADER structure (GUID + MessageLength + Data)
- **Handler Registration**: GUID-based, SW SMI number, and Root SMI handlers
- **Standalone MM**: Side-by-side comparison of Traditional MM vs Standalone MM
- **Code Analysis**: Key EDK2 source from PiSmmIpl, PiSmmCore, and SmiManage

Supports both English and Traditional Chinese (繁體中文).

### 6. PCI Subsystem Visualizer
Interactive visualization of the UEFI EDK2 PCI subsystem covering both x86_64 and ARM64:
- **PCI Configuration Space**: Full 256-byte Type 0/Type 1 header register map with hoverable fields, plus 4K PCIe Extended Config Space
- **Access Mechanism**: Legacy CF8h/CFCh I/O ports vs ECAM/MMCONFIG memory-mapped access, with ECAM address calculation formula
- **PCI Enumeration**: 11-step interactive walkthrough of PciBusDxe — from Host Bridge creation to device enable
- **Root Bridge IO Protocol**: Protocol layering diagram, producer/consumer architecture, function table
- **PCI IO Protocol**: Device-level abstraction call chain from driver → PciIo → RootBridgeIo → hardware
- **Architecture Comparison**: Side-by-side x86_64 vs ARM64 comparison table (access methods, libraries, interrupts, IOMMU)
- **Code Analysis**: Key EDK2 source snippets — bus scan, BAR sizing, PCI IO usage, Root Bridge IO ECAM path

Supports both English and Traditional Chinese (繁體中文).

### 7. Driver Binding Mechanism Visualizer
Interactive step-by-step visualization of the UEFI EDK2 Driver Binding Protocol lifecycle:
- **Overview**: What Driver Binding Protocol is and the three core functions (Supported/Start/Stop)
- **Data Structures**: IHANDLE, PROTOCOL_INTERFACE, PROTOCOL_ENTRY internals
- **ConnectController**: 7-step interactive walkthrough from initial state to complete binding
- **DisconnectController**: 6-step teardown flow with recursive child handle cleanup
- **Real Scenario**: Full PCI device binding chain (Host Bridge → PCI Bus → NVMe → Partition)
- **Code Analysis**: CoreConnectController, CoreInstallProtocolInterface, Driver Binding example

Supports both English and Traditional Chinese (繁體中文).

### 8. Protocol Services Visualizer
Interactive visualization of the four core UEFI EDK2 Protocol access functions:
- **Overview**: What Protocol Services are and why four different functions exist
- **Data Structures**: OPEN_PROTOCOL_DATA tracking chain, PROTOCOL_INTERFACE.OpenList
- **OpenProtocol**: 8-step interactive walkthrough covering all 6 attributes (BY_HANDLE_PROTOCOL, GET_PROTOCOL, TEST_PROTOCOL, BY_DRIVER, EXCLUSIVE, BY_CHILD_CONTROLLER)
- **Attribute Comparison**: Side-by-side table of all 6 attributes with tracking, exclusivity, and use cases
- **HandleProtocol**: Legacy wrapper explanation and why it's not recommended for drivers
- **LocateProtocol**: 4-step walkthrough showing gProtocolDatabase → PROTOCOL_ENTRY → first PROTOCOL_INTERFACE
- **LocateHandleBuffer**: 5-step walkthrough showing two-pass sizing/filling pattern
- **Common Patterns**: Supported() check, Start() binding, singleton lookup, device enumeration, bus child patterns
- **Code Analysis**: CoreOpenProtocol, CoreLocateProtocol, CoreLocateHandleBuffer source walkthrough

Supports both English and Traditional Chinese (繁體中文).

## Deployment

This project is configured for automatic deployment to GitHub Pages.

### Setup Instructions

1. Create a new GitHub repository
2. Push this project to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/uefi-dev-tools.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions**
   - The workflow will automatically deploy on push to `main`

4. Access your site at: `https://YOUR_USERNAME.github.io/uefi-dev-tools/`

## Project Structure

```
uefi-dev-tools/
├── index.html              # Landing page with tool selection
├── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment workflow
├── memory-viz/             # Memory Management Visualizer
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── i18n.js
├── build-viz/              # EDK2 Build Infrastructure Visualizer
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── i18n.js
├── pei-shadow-viz/         # PEI Shadow Process Visualizer
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── i18n.js
├── smm-comm-viz/           # SMM/MM Communication Visualizer
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── i18n.js
├── pci-viz/                # PCI Subsystem Visualizer
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── i18n.js
├── driver-binding-viz/     # Driver Binding Mechanism Visualizer
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── i18n.js
├── protocol-srv-viz/       # Protocol Services Visualizer
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── i18n.js
└── hid-viewer/             # USB HID Key Code Viewer
    ├── index.html
    ├── index.css
    └── index.js
```

## References

- [UEFI Specifications](https://uefi.org/specifications)
- [EDK2 Source Code](https://github.com/tianocore/edk2)
- [EDK II Build Specification](https://tianocore-docs.github.io/edk2-BuildSpecification/)
- [USB HID Usage Tables](https://www.usb.org/hid)

## License

© 2025 Damien Chen. All rights reserved.
