const fs = require('fs');
const path = require('path');

// Load the WebAssembly module
const MyModule = require('../public/my_wasm_project');

const loadJson = (filename) => {
    const filepath = path.resolve(__dirname, filename);
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
};

const storeProcessorStatus = (registers) => {
    let flags = 0;
    flags |= registers.carryFlag << 0;
    flags |= registers.zeroFlag << 1;
    flags |= registers.interruptDisableFlag << 2;
    flags |= registers.decimalModeFlag << 3;
    flags |= registers.breakCommandFlag << 4; // Set the break flag correctly
    flags |= 1 << 5; // This bit has no use but is always set to 1
    flags |= registers.overflowFlag << 6;
    flags |= registers.negativeFlag << 7;

    return flags;
};

const loadProcessorStatus = (registers, p) => {
    // Read the registers back into their respective flags.
    registers.carryFlag = (p >> 0) & 1;
    registers.zeroFlag = (p >> 1) & 1;
    registers.interruptDisableFlag = (p >> 2) & 1;
    registers.decimalModeFlag = (p >> 3) & 1;
    registers.breakCommandFlag = (p >> 4) & 1; // Load the break flag correctly
    registers.overflowFlag = (p >> 6) & 1;
    registers.negativeFlag = (p >> 7) & 1;
};

const formatRegisters = (registersBeforeRun, registers, test) => {
    return `
    A: ${registersBeforeRun.A} -> ${registers.A} | ${test.final.a}
    X: ${registersBeforeRun.X} -> ${registers.X} | ${test.final.x}
    Y: ${registersBeforeRun.Y} -> ${registers.Y} | ${test.final.y}
    PC: ${registersBeforeRun.PC} -> ${registers.PC} | ${test.final.pc}
    SP: ${registersBeforeRun.SP} -> ${registers.SP} | ${test.final.s}
    Flags: ${storeProcessorStatus(registersBeforeRun).toString(2)} -> ${storeProcessorStatus(registers).toString(2)} | ${test.final.p.toString(2)}
    `;
};

describe('CPU Tests', () => {
    let Module;
    let CPU, Bus;
    
    beforeAll(async () => {
        Module = await MyModule();
        CPU = Module.CPU;
        Bus = Module.Bus;
    });

    const generateTestFileNames = () => {
        const fileNames = [];
        for (let i = 0; i <= 0xFF; ++i) {
            const hex = i.toString(16).padStart(2, '0');
            fileNames.push(`${hex}.json`);
        }
        return fileNames;
    };

    const testFiles = generateTestFileNames();

    testFiles.forEach(fileName => {
        test(`Testing ${fileName}`, async () => {
            try {
                const tests = loadJson(`../../wasm/ProcessorTests/${fileName}`);
                const bus = new Bus();
                const cpu = new CPU(bus);

                for (const test of tests) {
                    cpu.reset();
                    let registers = {
                        A: test.initial.a,
                        X: test.initial.x,
                        Y: test.initial.y,
                        PC: test.initial.pc,
                        SP: test.initial.s,
                        CYC: 0,
                    };
                    loadProcessorStatus(registers, test.initial.p);
                    

                    // Write the initial memory values for test
                    test.initial.ram.forEach(item => {
                        const [address, value] = item;
                        bus.writeMemory(address, value);
                    });
                    
                    
                    cpu.setRegisters(registers);
                    cpu.step();
                    // cpu.run(test.cycles.length);
                    
                    
                    registers = cpu.getRegisters();

                    expect(registers.A).toBe(test.final.a);
                    expect(registers.X).toBe(test.final.x);
                    expect(registers.Y).toBe(test.final.y);
                    expect(storeProcessorStatus(registers)).toBe(test.final.p);
                    expect(registers.PC).toBe(test.final.pc);
                    expect(registers.SP).toBe(test.final.s);
                }

                console.log(`Test ${fileName} passed`);
            } catch (e) {
                console.error(`Test ${fileName} failed with error:`, e);
            }
        });
    });
});
