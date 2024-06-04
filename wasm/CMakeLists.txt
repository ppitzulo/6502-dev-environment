cmake_minimum_required(VERSION 3.14)
project(MyWasmProject)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED YES)

# Set the target as WebAssembly
set(CMAKE_CXX_COMPILER "em++")
set(CMAKE_CXX_FLAGS "-O3")
set(CMAKE_EXE_LINKER_FLAGS "-s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME=MyModule -s ALLOW_MEMORY_GROWTH=1 --bind")

# Specify the source files
set(SOURCES
    Cpu.cpp
    Bus.cpp
)

# Add the executable
add_executable(my_wasm_project ${SOURCES})

# Set the output directory for the wasm and JavaScript files
set_target_properties(my_wasm_project PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
    OUTPUT_NAME "my_wasm_project"
    SUFFIX ".js"
)
