# 6502 Development Environment Frontend

This project is a web-based frontend for a 6502 assembly development environment, providing a rich, interactive interface for writing, debugging, and running 6502 assembly code.

![image](https://github.com/user-attachments/assets/64812904-a28c-4f13-8388-9b58662bbf62)


## Features

- **Interactive 6502 Emulator**: Run, step through, and reset 6502 assembly code in real-time.
- **Advanced Code Editor**: Powered by CodeMirror, featuring:
  - Custom syntax highlighting for 6502 assembly
  - Multiple themes
  - Optional Vim keybindings
- **Debug Tools**:
  - Trace log for detailed execution tracking
  - Real-time view and modification of CPU registers and flags
  - Stack viewer
  - Memory inspector
- **Assembly Integration**: Assemble your code directly in the browser

## Components

1. **Code Editor**: Write and edit your 6502 assembly code with syntax highlighting.
2. **Emulator Controls**: Buttons for Run, Step, Reset, and Assemble operations.
3. **Register Display**: Shows current values of A, X, Y, SP, and PC registers.
4. **Flag Indicators**: Display of N, O, B, D, I, Z, and C flags.
5. **Memory Viewer**: Inspect and modify memory contents in real-time.
6. **Stack Viewer**: Visualize the current state of the stack.
7. **Trace Log**: Detailed log of executed instructions and their effects.

## Getting Started

(Include instructions for setting up and running the project locally)

```bash
git clone https://github.com/ppitzulo/6502-dev-environment
cd 6502-dev-environment
npm install
npm start
```

## Usage

1. Write your 6502 assembly code in the editor.
2. Click "Assemble" to compile your code.
3. Use the "Run", "Step", and "Reset" buttons to control execution.
4. Monitor the registers, flags, memory, and stack as your code executes.
5. Use the trace log for detailed debugging information.

## Technologies Used

- React
- TypeScript
- CodeMirror (for the text editor)

## Acknowledgments

- CodeMirror: For the powerful text editing capabilities
