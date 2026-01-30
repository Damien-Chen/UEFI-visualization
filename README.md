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
└── hid-viewer/             # USB HID Key Code Viewer
    ├── index.html
    ├── index.css
    └── index.js
```

## References

- [UEFI Specifications](https://uefi.org/specifications)
- [EDK2 Source Code](https://github.com/tianocore/edk2)
- [USB HID Usage Tables](https://www.usb.org/hid)

## License

© 2025 Damien Chen. All rights reserved.
