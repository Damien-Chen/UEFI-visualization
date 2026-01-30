/**
 * USB HID & UEFI EDK2 Keyboard Code Viewer
 * 
 * This script provides:
 * - Complete HID Usage ID to EFI Key code mapping
 * - Support for US ANSI, European ISO, and Japanese JIS layouts
 * - Interactive hover functionality to display key information
 */

// ============================================
// HID Usage ID to Key Data Mapping
// ============================================

const KEY_DATA = {
    // Error codes (0x00-0x03)
    0x00: { name: 'Reserved', efiKey: null, scanCode: null },
    0x01: { name: 'ErrorRollOver', efiKey: null, scanCode: null },
    0x02: { name: 'POSTFail', efiKey: null, scanCode: null },
    0x03: { name: 'ErrorUndefined', efiKey: null, scanCode: null },

    // Letters A-Z (0x04-0x1D)
    0x04: { name: 'A', efiKey: 'EfiKeyC1', scanCode: 'SCAN_NULL' },
    0x05: { name: 'B', efiKey: 'EfiKeyB5', scanCode: 'SCAN_NULL' },
    0x06: { name: 'C', efiKey: 'EfiKeyB3', scanCode: 'SCAN_NULL' },
    0x07: { name: 'D', efiKey: 'EfiKeyC3', scanCode: 'SCAN_NULL' },
    0x08: { name: 'E', efiKey: 'EfiKeyD3', scanCode: 'SCAN_NULL' },
    0x09: { name: 'F', efiKey: 'EfiKeyC4', scanCode: 'SCAN_NULL' },
    0x0A: { name: 'G', efiKey: 'EfiKeyC5', scanCode: 'SCAN_NULL' },
    0x0B: { name: 'H', efiKey: 'EfiKeyC6', scanCode: 'SCAN_NULL' },
    0x0C: { name: 'I', efiKey: 'EfiKeyD8', scanCode: 'SCAN_NULL' },
    0x0D: { name: 'J', efiKey: 'EfiKeyC7', scanCode: 'SCAN_NULL' },
    0x0E: { name: 'K', efiKey: 'EfiKeyC8', scanCode: 'SCAN_NULL' },
    0x0F: { name: 'L', efiKey: 'EfiKeyC9', scanCode: 'SCAN_NULL' },
    0x10: { name: 'M', efiKey: 'EfiKeyB7', scanCode: 'SCAN_NULL' },
    0x11: { name: 'N', efiKey: 'EfiKeyB6', scanCode: 'SCAN_NULL' },
    0x12: { name: 'O', efiKey: 'EfiKeyD9', scanCode: 'SCAN_NULL' },
    0x13: { name: 'P', efiKey: 'EfiKeyD10', scanCode: 'SCAN_NULL' },
    0x14: { name: 'Q', efiKey: 'EfiKeyD1', scanCode: 'SCAN_NULL' },
    0x15: { name: 'R', efiKey: 'EfiKeyD4', scanCode: 'SCAN_NULL' },
    0x16: { name: 'S', efiKey: 'EfiKeyC2', scanCode: 'SCAN_NULL' },
    0x17: { name: 'T', efiKey: 'EfiKeyD5', scanCode: 'SCAN_NULL' },
    0x18: { name: 'U', efiKey: 'EfiKeyD7', scanCode: 'SCAN_NULL' },
    0x19: { name: 'V', efiKey: 'EfiKeyB4', scanCode: 'SCAN_NULL' },
    0x1A: { name: 'W', efiKey: 'EfiKeyD2', scanCode: 'SCAN_NULL' },
    0x1B: { name: 'X', efiKey: 'EfiKeyB2', scanCode: 'SCAN_NULL' },
    0x1C: { name: 'Y', efiKey: 'EfiKeyD6', scanCode: 'SCAN_NULL' },
    0x1D: { name: 'Z', efiKey: 'EfiKeyB1', scanCode: 'SCAN_NULL' },

    // Numbers 1-0 (0x1E-0x27)
    0x1E: { name: '1 !', efiKey: 'EfiKeyE1', scanCode: 'SCAN_NULL' },
    0x1F: { name: '2 @', efiKey: 'EfiKeyE2', scanCode: 'SCAN_NULL' },
    0x20: { name: '3 #', efiKey: 'EfiKeyE3', scanCode: 'SCAN_NULL' },
    0x21: { name: '4 $', efiKey: 'EfiKeyE4', scanCode: 'SCAN_NULL' },
    0x22: { name: '5 %', efiKey: 'EfiKeyE5', scanCode: 'SCAN_NULL' },
    0x23: { name: '6 ^', efiKey: 'EfiKeyE6', scanCode: 'SCAN_NULL' },
    0x24: { name: '7 &', efiKey: 'EfiKeyE7', scanCode: 'SCAN_NULL' },
    0x25: { name: '8 *', efiKey: 'EfiKeyE8', scanCode: 'SCAN_NULL' },
    0x26: { name: '9 (', efiKey: 'EfiKeyE9', scanCode: 'SCAN_NULL' },
    0x27: { name: '0 )', efiKey: 'EfiKeyE10', scanCode: 'SCAN_NULL' },

    // Special keys (0x28-0x38)
    0x28: { name: 'Enter', efiKey: 'EfiKeyEnter', scanCode: 'SCAN_NULL' },
    0x29: { name: 'Escape', efiKey: 'EfiKeyEsc', scanCode: 'SCAN_ESC (0x17)' },
    0x2A: { name: 'Backspace', efiKey: 'EfiKeyBackSpace', scanCode: 'SCAN_NULL' },
    0x2B: { name: 'Tab', efiKey: 'EfiKeyTab', scanCode: 'SCAN_NULL' },
    0x2C: { name: 'Space', efiKey: 'EfiKeySpaceBar', scanCode: 'SCAN_NULL' },
    0x2D: { name: '- _', efiKey: 'EfiKeyE11', scanCode: 'SCAN_NULL' },
    0x2E: { name: '= +', efiKey: 'EfiKeyE12', scanCode: 'SCAN_NULL' },
    0x2F: { name: '[ {', efiKey: 'EfiKeyD11', scanCode: 'SCAN_NULL' },
    0x30: { name: '] }', efiKey: 'EfiKeyD12', scanCode: 'SCAN_NULL' },
    0x31: { name: '\\ |', efiKey: 'EfiKeyD13', scanCode: 'SCAN_NULL' },
    0x32: { name: 'Non-US # ~', efiKey: 'EfiKeyC12', scanCode: 'SCAN_NULL' },
    0x33: { name: '; :', efiKey: 'EfiKeyC10', scanCode: 'SCAN_NULL' },
    0x34: { name: '\' "', efiKey: 'EfiKeyC11', scanCode: 'SCAN_NULL' },
    0x35: { name: '` ~', efiKey: 'EfiKeyE0', scanCode: 'SCAN_NULL' },
    0x36: { name: ', <', efiKey: 'EfiKeyB8', scanCode: 'SCAN_NULL' },
    0x37: { name: '. >', efiKey: 'EfiKeyB9', scanCode: 'SCAN_NULL' },
    0x38: { name: '/ ?', efiKey: 'EfiKeyB10', scanCode: 'SCAN_NULL' },

    // Caps Lock (0x39)
    0x39: { name: 'Caps Lock', efiKey: 'EfiKeyCapsLock', scanCode: 'SCAN_NULL' },

    // Function keys F1-F12 (0x3A-0x45)
    0x3A: { name: 'F1', efiKey: 'EfiKeyF1', scanCode: 'SCAN_F1 (0x0B)' },
    0x3B: { name: 'F2', efiKey: 'EfiKeyF2', scanCode: 'SCAN_F2 (0x0C)' },
    0x3C: { name: 'F3', efiKey: 'EfiKeyF3', scanCode: 'SCAN_F3 (0x0D)' },
    0x3D: { name: 'F4', efiKey: 'EfiKeyF4', scanCode: 'SCAN_F4 (0x0E)' },
    0x3E: { name: 'F5', efiKey: 'EfiKeyF5', scanCode: 'SCAN_F5 (0x0F)' },
    0x3F: { name: 'F6', efiKey: 'EfiKeyF6', scanCode: 'SCAN_F6 (0x10)' },
    0x40: { name: 'F7', efiKey: 'EfiKeyF7', scanCode: 'SCAN_F7 (0x11)' },
    0x41: { name: 'F8', efiKey: 'EfiKeyF8', scanCode: 'SCAN_F8 (0x12)' },
    0x42: { name: 'F9', efiKey: 'EfiKeyF9', scanCode: 'SCAN_F9 (0x13)' },
    0x43: { name: 'F10', efiKey: 'EfiKeyF10', scanCode: 'SCAN_F10 (0x14)' },
    0x44: { name: 'F11', efiKey: 'EfiKeyF11', scanCode: 'SCAN_NULL' },
    0x45: { name: 'F12', efiKey: 'EfiKeyF12', scanCode: 'SCAN_NULL' },

    // Print Screen, Scroll Lock, Pause (0x46-0x48)
    0x46: { name: 'Print Screen', efiKey: 'EfiKeyPrint', scanCode: 'SCAN_NULL' },
    0x47: { name: 'Scroll Lock', efiKey: 'EfiKeySLck', scanCode: 'SCAN_NULL' },
    0x48: { name: 'Pause', efiKey: 'EfiKeyPause', scanCode: 'SCAN_NULL' },

    // Navigation keys (0x49-0x52)
    0x49: { name: 'Insert', efiKey: 'EfiKeyIns', scanCode: 'SCAN_INSERT (0x07)' },
    0x4A: { name: 'Home', efiKey: 'EfiKeyHome', scanCode: 'SCAN_HOME (0x05)' },
    0x4B: { name: 'Page Up', efiKey: 'EfiKeyPgUp', scanCode: 'SCAN_PAGE_UP (0x09)' },
    0x4C: { name: 'Delete', efiKey: 'EfiKeyDel', scanCode: 'SCAN_DELETE (0x08)' },
    0x4D: { name: 'End', efiKey: 'EfiKeyEnd', scanCode: 'SCAN_END (0x06)' },
    0x4E: { name: 'Page Down', efiKey: 'EfiKeyPgDn', scanCode: 'SCAN_PAGE_DOWN (0x0A)' },
    0x4F: { name: 'Right Arrow', efiKey: 'EfiKeyRightArrow', scanCode: 'SCAN_RIGHT (0x03)' },
    0x50: { name: 'Left Arrow', efiKey: 'EfiKeyLeftArrow', scanCode: 'SCAN_LEFT (0x04)' },
    0x51: { name: 'Down Arrow', efiKey: 'EfiKeyDownArrow', scanCode: 'SCAN_DOWN (0x02)' },
    0x52: { name: 'Up Arrow', efiKey: 'EfiKeyUpArrow', scanCode: 'SCAN_UP (0x01)' },

    // Numpad (0x53-0x63)
    0x53: { name: 'Num Lock', efiKey: 'EfiKeyNLck', scanCode: 'SCAN_NULL' },
    0x54: { name: 'Numpad /', efiKey: 'EfiKeySlash', scanCode: 'SCAN_NULL' },
    0x55: { name: 'Numpad *', efiKey: 'EfiKeyAsterisk', scanCode: 'SCAN_NULL' },
    0x56: { name: 'Numpad -', efiKey: 'EfiKeyMinus', scanCode: 'SCAN_NULL' },
    0x57: { name: 'Numpad +', efiKey: 'EfiKeyPlus', scanCode: 'SCAN_NULL' },
    0x58: { name: 'Numpad Enter', efiKey: 'EfiKeyEnter', scanCode: 'SCAN_NULL' },
    0x59: { name: 'Numpad 1', efiKey: 'EfiKeyOne', scanCode: 'SCAN_END (0x06)' },
    0x5A: { name: 'Numpad 2', efiKey: 'EfiKeyTwo', scanCode: 'SCAN_DOWN (0x02)' },
    0x5B: { name: 'Numpad 3', efiKey: 'EfiKeyThree', scanCode: 'SCAN_PAGE_DOWN (0x0A)' },
    0x5C: { name: 'Numpad 4', efiKey: 'EfiKeyFour', scanCode: 'SCAN_LEFT (0x04)' },
    0x5D: { name: 'Numpad 5', efiKey: 'EfiKeyFive', scanCode: 'SCAN_NULL' },
    0x5E: { name: 'Numpad 6', efiKey: 'EfiKeySix', scanCode: 'SCAN_RIGHT (0x03)' },
    0x5F: { name: 'Numpad 7', efiKey: 'EfiKeySeven', scanCode: 'SCAN_HOME (0x05)' },
    0x60: { name: 'Numpad 8', efiKey: 'EfiKeyEight', scanCode: 'SCAN_UP (0x01)' },
    0x61: { name: 'Numpad 9', efiKey: 'EfiKeyNine', scanCode: 'SCAN_PAGE_UP (0x09)' },
    0x62: { name: 'Numpad 0', efiKey: 'EfiKeyZero', scanCode: 'SCAN_INSERT (0x07)' },
    0x63: { name: 'Numpad .', efiKey: 'EfiKeyPeriod', scanCode: 'SCAN_DELETE (0x08)' },

    // Non-US \ and | (0x64)
    0x64: { name: 'Non-US \\ |', efiKey: 'EfiKeyB0', scanCode: 'SCAN_NULL' },

    // Application/Menu key (0x65)
    0x65: { name: 'Application', efiKey: 'EfiKeyA4', scanCode: 'SCAN_NULL' },

    // Power (0x66)
    0x66: { name: 'Power', efiKey: null, scanCode: 'SCAN_NULL' },

    // Keypad = (0x67)
    0x67: { name: 'Numpad =', efiKey: null, scanCode: 'SCAN_NULL' },

    // F13-F24 (0x68-0x73)
    0x68: { name: 'F13', efiKey: null, scanCode: 'SCAN_NULL' },
    0x69: { name: 'F14', efiKey: null, scanCode: 'SCAN_NULL' },
    0x6A: { name: 'F15', efiKey: null, scanCode: 'SCAN_NULL' },
    0x6B: { name: 'F16', efiKey: null, scanCode: 'SCAN_NULL' },
    0x6C: { name: 'F17', efiKey: null, scanCode: 'SCAN_NULL' },
    0x6D: { name: 'F18', efiKey: null, scanCode: 'SCAN_NULL' },
    0x6E: { name: 'F19', efiKey: null, scanCode: 'SCAN_NULL' },
    0x6F: { name: 'F20', efiKey: null, scanCode: 'SCAN_NULL' },
    0x70: { name: 'F21', efiKey: null, scanCode: 'SCAN_NULL' },
    0x71: { name: 'F22', efiKey: null, scanCode: 'SCAN_NULL' },
    0x72: { name: 'F23', efiKey: null, scanCode: 'SCAN_NULL' },
    0x73: { name: 'F24', efiKey: null, scanCode: 'SCAN_NULL' },

    // International keys (0x87-0x8B for JIS)
    0x87: { name: 'International1 (\\_ ろ)', efiKey: 'EfiKeyB0', scanCode: 'SCAN_NULL' },
    0x88: { name: 'International2 (ひらがな)', efiKey: 'EfiKeyA3', scanCode: 'SCAN_NULL' },
    0x89: { name: 'International3 (¥ |)', efiKey: 'EfiKeyD13', scanCode: 'SCAN_NULL' },
    0x8A: { name: 'International4 (変換)', efiKey: 'EfiKeyA2', scanCode: 'SCAN_NULL' },
    0x8B: { name: 'International5 (無変換)', efiKey: 'EfiKeyA1', scanCode: 'SCAN_NULL' },

    // Modifier keys (0xE0-0xE7)
    0xE0: { name: 'Left Control', efiKey: 'EfiKeyLCtrl', scanCode: 'SCAN_NULL' },
    0xE1: { name: 'Left Shift', efiKey: 'EfiKeyLShift', scanCode: 'SCAN_NULL' },
    0xE2: { name: 'Left Alt', efiKey: 'EfiKeyA0', scanCode: 'SCAN_NULL' },
    0xE3: { name: 'Left Windows', efiKey: 'EfiKeyA1', scanCode: 'SCAN_NULL' },
    0xE4: { name: 'Right Control', efiKey: 'EfiKeyRCtrl', scanCode: 'SCAN_NULL' },
    0xE5: { name: 'Right Shift', efiKey: 'EfiKeyRShift', scanCode: 'SCAN_NULL' },
    0xE6: { name: 'Right Alt', efiKey: 'EfiKeyA3', scanCode: 'SCAN_NULL' },
    0xE7: { name: 'Right Windows', efiKey: 'EfiKeyA4', scanCode: 'SCAN_NULL' },
};

// ============================================
// Keyboard Layout Definitions
// ============================================

// Numpad Layout (Common for all)
const NUMPAD_LAYOUT = [
    { hid: 0x53, label: 'Num' }, { hid: 0x54, label: '/' }, { hid: 0x55, label: '*' }, { hid: 0x56, label: '-' },
    { hid: 0x5F, label: '7' }, { hid: 0x60, label: '8' }, { hid: 0x61, label: '9' }, { hid: 0x57, label: '+', tall: true },
    { hid: 0x5C, label: '4' }, { hid: 0x5D, label: '5' }, { hid: 0x5E, label: '6' },
    { hid: 0x59, label: '1' }, { hid: 0x5A, label: '2' }, { hid: 0x5B, label: '3' }, { hid: 0x58, label: 'Ent', tall: true },
    { hid: 0x62, label: '0', wide: true }, { hid: 0x63, label: '.' }
];

// Nav Block Layout (Common for ANSI/ISO)
const NAV_BLOCK_COMMON = [
    {
        sections: [[
            { hid: 0x46, label: 'PrtSc', size: '1' },
            { hid: 0x47, label: 'ScrLk', size: '1' },
            { hid: 0x48, label: 'Pause', size: '1' },
        ]]
    },
    { gap: true },
    {
        sections: [[
            { hid: 0x49, label: 'Ins', size: '1' },
            { hid: 0x4A, label: 'Home', size: '1' },
            { hid: 0x4B, label: 'PgUp', size: '1' },
        ]]
    },
    {
        sections: [[
            { hid: 0x4C, label: 'Del', size: '1' },
            { hid: 0x4D, label: 'End', size: '1' },
            { hid: 0x4E, label: 'PgDn', size: '1' },
        ]]
    },
    { gap: true, size: '2' }, // Empty space above arrows
    {
        sections: [[
            { spacer: true, size: '1' },
            { hid: 0x52, label: '↑', size: '1' },
            { spacer: true, size: '1' },
        ]]
    },
    {
        sections: [[
            { hid: 0x50, label: '←', size: '1' },
            { hid: 0x51, label: '↓', size: '1' },
            { hid: 0x4F, label: '→', size: '1' },
        ]]
    }
];

// US ANSI 104-key layout
const LAYOUT_ANSI = {
    name: 'US ANSI',
    main: [
        // Function row
        {
            sections: [[
                { hid: 0x29, label: 'Esc', size: '1' },
                { spacer: true, size: '1' },
                { hid: 0x3A, label: 'F1', size: '1' },
                { hid: 0x3B, label: 'F2', size: '1' },
                { hid: 0x3C, label: 'F3', size: '1' },
                { hid: 0x3D, label: 'F4', size: '1' },
                { spacer: true, size: '0-5' },
                { hid: 0x3E, label: 'F5', size: '1' },
                { hid: 0x3F, label: 'F6', size: '1' },
                { hid: 0x40, label: 'F7', size: '1' },
                { hid: 0x41, label: 'F8', size: '1' },
                { spacer: true, size: '0-5' },
                { hid: 0x42, label: 'F9', size: '1' },
                { hid: 0x43, label: 'F10', size: '1' },
                { hid: 0x44, label: 'F11', size: '1' },
                { hid: 0x45, label: 'F12', size: '1' },
            ]]
        },
        // Number row
        {
            sections: [[
                { hid: 0x35, label: '`', size: '1' },
                { hid: 0x1E, label: '1', size: '1' },
                { hid: 0x1F, label: '2', size: '1' },
                { hid: 0x20, label: '3', size: '1' },
                { hid: 0x21, label: '4', size: '1' },
                { hid: 0x22, label: '5', size: '1' },
                { hid: 0x23, label: '6', size: '1' },
                { hid: 0x24, label: '7', size: '1' },
                { hid: 0x25, label: '8', size: '1' },
                { hid: 0x26, label: '9', size: '1' },
                { hid: 0x27, label: '0', size: '1' },
                { hid: 0x2D, label: '-', size: '1' },
                { hid: 0x2E, label: '=', size: '1' },
                { hid: 0x2A, label: 'Backspace', size: '2', modifier: true },
            ]]
        },
        // QWERTY row
        {
            sections: [[
                { hid: 0x2B, label: 'Tab', size: '1-5', modifier: true },
                { hid: 0x14, label: 'Q', size: '1' },
                { hid: 0x1A, label: 'W', size: '1' },
                { hid: 0x08, label: 'E', size: '1' },
                { hid: 0x15, label: 'R', size: '1' },
                { hid: 0x17, label: 'T', size: '1' },
                { hid: 0x1C, label: 'Y', size: '1' },
                { hid: 0x18, label: 'U', size: '1' },
                { hid: 0x0C, label: 'I', size: '1' },
                { hid: 0x12, label: 'O', size: '1' },
                { hid: 0x13, label: 'P', size: '1' },
                { hid: 0x2F, label: '[', size: '1' },
                { hid: 0x30, label: ']', size: '1' },
                { hid: 0x31, label: '\\', size: '1-5' },
            ]]
        },
        // Home row
        {
            sections: [[
                { hid: 0x39, label: 'Caps', size: '1-75', modifier: true },
                { hid: 0x04, label: 'A', size: '1' },
                { hid: 0x16, label: 'S', size: '1' },
                { hid: 0x07, label: 'D', size: '1' },
                { hid: 0x09, label: 'F', size: '1' },
                { hid: 0x0A, label: 'G', size: '1' },
                { hid: 0x0B, label: 'H', size: '1' },
                { hid: 0x0D, label: 'J', size: '1' },
                { hid: 0x0E, label: 'K', size: '1' },
                { hid: 0x0F, label: 'L', size: '1' },
                { hid: 0x33, label: ';', size: '1' },
                { hid: 0x34, label: '\'', size: '1' },
                { hid: 0x28, label: 'Enter', size: '2-25', modifier: true },
            ]]
        },
        // Bottom row
        {
            sections: [[
                { hid: 0xE1, label: 'Shift', size: '2-25', modifier: true },
                { hid: 0x1D, label: 'Z', size: '1' },
                { hid: 0x1B, label: 'X', size: '1' },
                { hid: 0x06, label: 'C', size: '1' },
                { hid: 0x19, label: 'V', size: '1' },
                { hid: 0x05, label: 'B', size: '1' },
                { hid: 0x11, label: 'N', size: '1' },
                { hid: 0x10, label: 'M', size: '1' },
                { hid: 0x36, label: ',', size: '1' },
                { hid: 0x37, label: '.', size: '1' },
                { hid: 0x38, label: '/', size: '1' },
                { hid: 0xE5, label: 'Shift', size: '2-75', modifier: true },
            ]]
        },
        // Space row
        {
            sections: [[
                { hid: 0xE0, label: 'Ctrl', size: '1-25', modifier: true },
                { hid: 0xE3, label: 'Win', size: '1-25', modifier: true },
                { hid: 0xE2, label: 'Alt', size: '1-25', modifier: true },
                { hid: 0x2C, label: 'Space', size: '7-5' },
                { hid: 0xE6, label: 'Alt', size: '1-25', modifier: true },
                { hid: 0x65, label: 'Menu', size: '1-25', modifier: true },
                { hid: 0xE4, label: 'Ctrl', size: '1-25', modifier: true },
            ]]
        },
    ],
    nav: NAV_BLOCK_COMMON,
    numpad: NUMPAD_LAYOUT
};

// European ISO 105-key layout
const LAYOUT_ISO = {
    name: 'European ISO',
    main: [
        // Function row (Same as ANSI)
        LAYOUT_ANSI.main[0],
        // Number row (Same as ANSI)
        LAYOUT_ANSI.main[1],
        // QWERTY row
        {
            sections: [[
                { hid: 0x2B, label: 'Tab', size: '1-5', modifier: true },
                { hid: 0x14, label: 'Q', size: '1' },
                { hid: 0x1A, label: 'W', size: '1' },
                { hid: 0x08, label: 'E', size: '1' },
                { hid: 0x15, label: 'R', size: '1' },
                { hid: 0x17, label: 'T', size: '1' },
                { hid: 0x1C, label: 'Y', size: '1' },
                { hid: 0x18, label: 'U', size: '1' },
                { hid: 0x0C, label: 'I', size: '1' },
                { hid: 0x12, label: 'O', size: '1' },
                { hid: 0x13, label: 'P', size: '1' },
                { hid: 0x2F, label: '[', size: '1' },
                { hid: 0x30, label: ']', size: '1' },
                { hid: 0x28, label: 'Enter', size: '1-25', modifier: true, isoEnter: true },
            ]]
        },
        // Home row
        {
            sections: [[
                { hid: 0x39, label: 'Caps', size: '1-75', modifier: true },
                { hid: 0x04, label: 'A', size: '1' },
                { hid: 0x16, label: 'S', size: '1' },
                { hid: 0x07, label: 'D', size: '1' },
                { hid: 0x09, label: 'F', size: '1' },
                { hid: 0x0A, label: 'G', size: '1' },
                { hid: 0x0B, label: 'H', size: '1' },
                { hid: 0x0D, label: 'J', size: '1' },
                { hid: 0x0E, label: 'K', size: '1' },
                { hid: 0x0F, label: 'L', size: '1' },
                { hid: 0x33, label: ';', size: '1' },
                { hid: 0x34, label: '\'', size: '1' },
                { hid: 0x32, label: '#', size: '1' },
                { spacer: true, size: '1-25' },
            ]]
        },
        // Bottom row
        {
            sections: [[
                { hid: 0xE1, label: 'Shift', size: '1-25', modifier: true },
                { hid: 0x64, label: '\\', size: '1' },
                { hid: 0x1D, label: 'Z', size: '1' },
                { hid: 0x1B, label: 'X', size: '1' },
                { hid: 0x06, label: 'C', size: '1' },
                { hid: 0x19, label: 'V', size: '1' },
                { hid: 0x05, label: 'B', size: '1' },
                { hid: 0x11, label: 'N', size: '1' },
                { hid: 0x10, label: 'M', size: '1' },
                { hid: 0x36, label: ',', size: '1' },
                { hid: 0x37, label: '.', size: '1' },
                { hid: 0x38, label: '/', size: '1' },
                { hid: 0xE5, label: 'Shift', size: '2-75', modifier: true },
            ]]
        },
        // Space row (Same as ANSI)
        LAYOUT_ANSI.main[5],
    ],
    nav: NAV_BLOCK_COMMON,
    numpad: NUMPAD_LAYOUT
};

// Japanese JIS 109-key layout
const LAYOUT_JIS = {
    name: 'Japanese JIS',
    main: [
        // Function row (Same as ANSI)
        LAYOUT_ANSI.main[0],
        // Number row
        {
            sections: [[
                { hid: 0x35, label: '半/全', size: '1' },
                { hid: 0x1E, label: '1', size: '1' },
                { hid: 0x1F, label: '2', size: '1' },
                { hid: 0x20, label: '3', size: '1' },
                { hid: 0x21, label: '4', size: '1' },
                { hid: 0x22, label: '5', size: '1' },
                { hid: 0x23, label: '6', size: '1' },
                { hid: 0x24, label: '7', size: '1' },
                { hid: 0x25, label: '8', size: '1' },
                { hid: 0x26, label: '9', size: '1' },
                { hid: 0x27, label: '0', size: '1' },
                { hid: 0x2D, label: '-', size: '1' },
                { hid: 0x2E, label: '^', size: '1' },
                { hid: 0x89, label: '¥', size: '1' },
                { hid: 0x2A, label: 'BS', size: '1', modifier: true },
            ]]
        },
        // QWERTY row
        {
            sections: [[
                { hid: 0x2B, label: 'Tab', size: '1-5', modifier: true },
                { hid: 0x14, label: 'Q', size: '1' },
                { hid: 0x1A, label: 'W', size: '1' },
                { hid: 0x08, label: 'E', size: '1' },
                { hid: 0x15, label: 'R', size: '1' },
                { hid: 0x17, label: 'T', size: '1' },
                { hid: 0x1C, label: 'Y', size: '1' },
                { hid: 0x18, label: 'U', size: '1' },
                { hid: 0x0C, label: 'I', size: '1' },
                { hid: 0x12, label: 'O', size: '1' },
                { hid: 0x13, label: 'P', size: '1' },
                { hid: 0x2F, label: '@', size: '1' },
                { hid: 0x30, label: '[', size: '1' },
                { hid: 0x28, label: 'Enter', size: '1-25', modifier: true, jisEnter: true },
            ]]
        },
        // Home row
        {
            sections: [[
                { hid: 0x39, label: 'Caps', size: '1-75', modifier: true },
                { hid: 0x04, label: 'A', size: '1' },
                { hid: 0x16, label: 'S', size: '1' },
                { hid: 0x07, label: 'D', size: '1' },
                { hid: 0x09, label: 'F', size: '1' },
                { hid: 0x0A, label: 'G', size: '1' },
                { hid: 0x0B, label: 'H', size: '1' },
                { hid: 0x0D, label: 'J', size: '1' },
                { hid: 0x0E, label: 'K', size: '1' },
                { hid: 0x0F, label: 'L', size: '1' },
                { hid: 0x33, label: ';', size: '1' },
                { hid: 0x34, label: ':', size: '1' },
                { hid: 0x32, label: ']', size: '1' },
                { spacer: true, size: '1-25' },
            ]]
        },
        // Bottom row
        {
            sections: [[
                { hid: 0xE1, label: 'Shift', size: '2-25', modifier: true },
                { hid: 0x1D, label: 'Z', size: '1' },
                { hid: 0x1B, label: 'X', size: '1' },
                { hid: 0x06, label: 'C', size: '1' },
                { hid: 0x19, label: 'V', size: '1' },
                { hid: 0x05, label: 'B', size: '1' },
                { hid: 0x11, label: 'N', size: '1' },
                { hid: 0x10, label: 'M', size: '1' },
                { hid: 0x36, label: ',', size: '1' },
                { hid: 0x37, label: '.', size: '1' },
                { hid: 0x38, label: '/', size: '1' },
                { hid: 0x87, label: '\\_', size: '1' },
                { hid: 0xE5, label: 'Shift', size: '1-75', modifier: true },
            ]]
        },
        // Space row
        {
            sections: [[
                { hid: 0xE0, label: 'Ctrl', size: '1-25', modifier: true },
                { hid: 0xE3, label: 'Win', size: '1', modifier: true },
                { hid: 0xE2, label: 'Alt', size: '1', modifier: true },
                { hid: 0x8B, label: '無変換', size: '1-25', modifier: true },
                { hid: 0x2C, label: 'Space', size: '2-75' },
                { hid: 0x8A, label: '変換', size: '1-25', modifier: true },
                { hid: 0x88, label: 'かな', size: '1', modifier: true },
                { hid: 0xE6, label: 'Alt', size: '1', modifier: true },
                { hid: 0xE7, label: 'Win', size: '1', modifier: true },
                { hid: 0x65, label: 'Menu', size: '1', modifier: true },
                { hid: 0xE4, label: 'Ctrl', size: '1-25', modifier: true },
            ]]
        },
    ],
    nav: NAV_BLOCK_COMMON,
    numpad: NUMPAD_LAYOUT
};

const LAYOUTS = {
    ansi: LAYOUT_ANSI,
    iso: LAYOUT_ISO,
    jis: LAYOUT_JIS
};

// ============================================
// DOM Elements
// ============================================
const keyboard = document.getElementById('keyboard');
const infoPanel = document.getElementById('infoPanel');
const keyNameEl = document.getElementById('keyName');
const hidCodeEl = document.getElementById('hidCode');
const hidDecEl = document.getElementById('hidDec');
const efiKeyEl = document.getElementById('efiKey');
const efiScanEl = document.getElementById('efiScan');
const layoutButtons = document.querySelectorAll('.layout-btn');

let currentLayout = 'ansi';

// ============================================
// Keyboard Rendering
// ============================================

function createKey(keyData) {
    const key = document.createElement('div');
    key.className = 'key';

    // Handle spacer
    if (keyData.spacer) {
        key.classList.add('key-spacer');
        key.style.visibility = 'hidden';
        const sizeClass = `key-${keyData.size.replace('.', '-')}`;
        key.classList.add(sizeClass);
        return key;
    }

    // Set size class
    if (keyData.size) {
        const sizeClass = `key-${keyData.size.replace('.', '-')}`;
        key.classList.add(sizeClass);
    }

    // Set modifier class
    if (keyData.modifier) {
        key.classList.add('key-modifier');
    }

    // Handle numpad specific classes
    if (keyData.tall) {
        key.classList.add('key-numpad-plus'); // Reusing class for both + and Enter
        if (keyData.label === 'Ent') key.classList.add('key-numpad-enter');
    }
    if (keyData.wide) {
        key.classList.add('key-numpad-0');
    }

    // Set data attributes
    key.dataset.hid = keyData.hid;

    // Create label
    const label = document.createElement('span');
    label.className = 'key-label';

    // Handle Windows Logo
    if (keyData.label === 'Win') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 88 88');
        svg.setAttribute('class', 'win-logo-svg');
        svg.innerHTML = '<rect x="0" y="0" width="42" height="42" /><rect x="46" y="0" width="42" height="42" /><rect x="0" y="46" width="42" height="42" /><rect x="46" y="46" width="42" height="42" />';
        label.appendChild(svg);
    } else {
        if (keyData.label.length > 4) {
            label.classList.add('key-label-small');
        }
        label.textContent = keyData.label;
    }
    key.appendChild(label);

    // Event listeners
    key.addEventListener('mouseenter', () => handleKeyHover(keyData.hid, keyData.label));
    key.addEventListener('mouseleave', handleKeyLeave);

    return key;
}

function createRow(rowData) {
    if (rowData.gap) {
        const gap = document.createElement('div');
        gap.className = 'row-gap';
        if (rowData.size) gap.style.height = `calc(var(--key-size) * ${rowData.size})`;
        return gap;
    }

    const row = document.createElement('div');
    row.className = 'keyboard-row';

    rowData.sections.forEach((section, index) => {
        if (index > 0) {
            const sectionGap = document.createElement('div');
            sectionGap.className = 'section-gap';
            row.appendChild(sectionGap);
        }

        const sectionEl = document.createElement('div');
        sectionEl.className = 'keyboard-section';

        section.forEach(keyData => {
            sectionEl.appendChild(createKey(keyData));
        });

        row.appendChild(sectionEl);
    });

    return row;
}

function renderKeyboard(layoutName) {
    keyboard.innerHTML = '';
    const layout = LAYOUTS[layoutName];

    // 1. Main Block
    const mainBlock = document.createElement('div');
    mainBlock.className = 'keyboard-block keyboard-main';
    layout.main.forEach(rowData => {
        mainBlock.appendChild(createRow(rowData));
    });
    keyboard.appendChild(mainBlock);

    // 2. Nav Block
    const navBlock = document.createElement('div');
    navBlock.className = 'keyboard-block keyboard-nav';
    layout.nav.forEach(rowData => {
        navBlock.appendChild(createRow(rowData));
    });
    keyboard.appendChild(navBlock);

    // 3. Numpad Block (Grid)
    const numpadBlock = document.createElement('div');
    numpadBlock.className = 'keyboard-block keyboard-numpad numpad-grid';
    layout.numpad.forEach(keyData => {
        numpadBlock.appendChild(createKey(keyData));
    });
    keyboard.appendChild(numpadBlock);
}

// ============================================
// Info Panel Updates
// ============================================

function handleKeyHover(hid, label) {
    const keyData = KEY_DATA[hid];

    infoPanel.classList.add('active');
    keyNameEl.textContent = keyData ? keyData.name : label;
    hidCodeEl.textContent = `0x${hid.toString(16).toUpperCase().padStart(2, '0')}`;
    hidDecEl.textContent = hid;
    efiKeyEl.textContent = keyData?.efiKey || 'N/A';
    efiScanEl.textContent = keyData?.scanCode || 'N/A';
}

function handleKeyLeave() {
    infoPanel.classList.remove('active');
    keyNameEl.textContent = 'Hover over a key';
    hidCodeEl.textContent = '—';
    hidDecEl.textContent = '—';
    efiKeyEl.textContent = '—';
    efiScanEl.textContent = '—';
}

// ============================================
// Layout Switching
// ============================================

function switchLayout(layoutName) {
    currentLayout = layoutName;

    layoutButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.layout === layoutName);
    });

    renderKeyboard(layoutName);
}

// ============================================
// Event Listeners
// ============================================

layoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchLayout(btn.dataset.layout);
    });
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderKeyboard(currentLayout);
});
