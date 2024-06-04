#ifndef BUS_H
#define BUS_H

#include <cstdint>
#include "Cpu.h"

class Bus
{
public:
    Bus();
    ~Bus();

    uint8_t readMemory(uint16_t address);
    void writeMemory(uint16_t address, uint8_t data);
    void run();

private:
    uint8_t* ram;
    CPU cpu;
};


#endif