cmake_minimum_required(VERSION 3.10)
project(Capstone)

# Set C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_BUILD_TYPE Debug)

# Google Test setup for testing
enable_testing()
find_package(GTest REQUIRED)
include_directories(${GTEST_INCLUDE_DIRS})

# Main executable
add_executable(cpu_tests Cpu_test.cpp Bus.cpp Cpu.cpp)
target_link_libraries(cpu_tests ${GTEST_LIBRARIES} gtest_main pthread)

#Register tests
add_test(NAME cpu_tests COMMAND cpu_tests)
