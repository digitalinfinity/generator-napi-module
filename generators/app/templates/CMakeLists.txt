cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)
set (CMAKE_CXX_STANDARD 17)

project(<%= moduleFileName %>)

# Find your dependency packages here
# find_package(... REQUIRED)

include_directories(${CMAKE_JS_INC})


add_library(${PROJECT_NAME} SHARED src/<%= moduleSourceFileName %> ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

# Note: you can as many library as you like the same way, or put it all in the same lib

# Include Node-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

# Warning: it is important to run the target_include_directory **AFTER**
#          running the regex
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})


# define NAPI_VERSION
add_definitions(-DNAPI_VERSION=3)
