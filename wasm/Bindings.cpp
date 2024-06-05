#include "Cpu.h"
#include "Bus.h"

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;

EMSCRIPTEN_BINDINGS(my_module) {
    // Bind CPURegisters struct
    value_object<CPURegisters>("CPURegisters")
        .field("A", &CPURegisters::A)
        .field("X", &CPURegisters::X)
        .field("Y", &CPURegisters::Y)
        .field("carryFlag", &CPURegisters::carryFlag)
        .field("zeroFlag", &CPURegisters::zeroFlag)
        .field("interruptDisableFlag", &CPURegisters::interruptDisableFlag)
        .field("decimalModeFlag", &CPURegisters::decimalModeFlag)
        .field("breakCommandFlag", &CPURegisters::breakCommandFlag)
        .field("overflowFlag", &CPURegisters::overflowFlag)
        .field("negativeFlag", &CPURegisters::negativeFlag)
        .field("PC", &CPURegisters::PC)
        .field("SP", &CPURegisters::SP);

    // Bind CPU class
    class_<CPU>("CPU")
        .constructor<Bus&>()
        .function("run", &CPU::run)
        .function("reset", &CPU::reset)
        .function("setRegisters", &CPU::setRegisters)
        .function("getRegisters", &CPU::getRegisters);
    
    // Bind Bus class if needed
    class_<Bus>("Bus")
        .constructor<>()
        .function("readMemory", &Bus::readMemory)
        .function("writeMemory", &Bus::writeMemory)
        .function("run", &Bus::run);
}
#endif
