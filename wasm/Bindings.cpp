#include "Cpu.h"
#include "Bus.h"

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(my_module) {
    class_<Bus>("Bus")
        .constructor<>()
        .function("readMemory", &Bus::readMemory)
        .function("writeMemory", &Bus::writeMemory)
        .function("run", &Bus::run);

    class_<CPU>("CPU")
        .constructor<Bus&>()
        // .function("initialize", &CPU::initialize)
        .function("run", &CPU::run);
}
#endif
