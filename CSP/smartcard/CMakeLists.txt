cmake_minimum_required(VERSION 3.2)

project(SmartCart C)

SET(PROJECT_SOURCE_FILES
		SmartCard.c
		Driver/SmartCards.c
		Driver/MiniDriver.c
		Tracer/trace.c
		Tracer/trace.h
        )

# Cryptographic Provider Development Kit installed path
SET(CPDK_INSTALLED_PATH "C:/Program Files (x86)/Windows Kits/10/Cryptographic Provider Development Kit")
SET(CPDK_INCLUDE_DIR ${CPDK_INSTALLED_PATH}/include)
SET(CPDK_LIB_DIR ${CPDK_INSTALLED_PATH}/lib/x64)

link_directories(BEFORE ${CPDK_LIB_DIR})

# define project's build target with project's source files
add_library(${PROJECT_NAME} SHARED ${PROJECT_SOURCE_FILES})
target_include_directories(${PROJECT_NAME} PRIVATE ${CPDK_INCLUDE_DIR})
target_link_libraries(${PROJECT_NAME} userenv crypt32 bcrypt_provider)