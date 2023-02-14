#include "trace.h"

#include <string.h>

void TraceEx(LPCTSTR szFunction, UCHAR dwLevel, LPCTSTR szFormat, ...)
{
	TCHAR Buffer[256];
	TCHAR Buffer2[356];
	int ret;
	va_list ap;
	
	va_start(ap, szFormat);
	ret = _stprintf_s(Buffer, ARRAYSIZE(Buffer), szFormat, ap);
	va_end(ap);

	if (ret <= 0) return;

	Buffer[255] = L'\0';
	ret = _stprintf_s(Buffer2, ARRAYSIZE(Buffer), L"%S - %s\r\n", szFunction, Buffer);

	if (ret <= 0) return;
	OutputDebugString(Buffer2);
}