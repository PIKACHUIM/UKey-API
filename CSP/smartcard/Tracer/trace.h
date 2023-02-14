#pragma once

#include <windows.h>
#include <tchar.h>

#define WINEVENT_LEVEL_CRITICAL 1
#define WINEVENT_LEVEL_ERROR    2
#define WINEVENT_LEVEL_WARNING  3
#define WINEVENT_LEVEL_INFO     4
#define WINEVENT_LEVEL_VERBOSE  5

#define Trace(dwLevel, ...) \
	TraceEx(__FILE__,__LINE__,__FUNCTION__, dwLevel, __VA_ARGS__);

void TraceEx(LPCTSTR szFunction, UCHAR dwLevel, LPCTSTR szFormat, ...);