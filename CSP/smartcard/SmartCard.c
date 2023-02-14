/*	Smart Card Mini Driver
    Copyright (C) 2020 Vincent Pham
*/

#include <Windows.h>

BOOL fRunOnVistaAndLater;

BOOL Is_Vista_or_Later () 
{
   OSVERSIONINFOEX osvi;
   DWORDLONG dwlConditionMask = 0;
   int op=VER_GREATER_EQUAL;

   // Initialize the OSVERSIONINFOEX structure.

   ZeroMemory(&osvi, sizeof(OSVERSIONINFOEX));
   osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFOEX);
   osvi.dwMajorVersion = 6;

   // Initialize the condition mask.
   VER_SET_CONDITION( dwlConditionMask, VER_MAJORVERSION, op );

   // Perform the test.
   return VerifyVersionInfo(
      &osvi, 
      VER_MAJORVERSION,
      dwlConditionMask);
}

/** This function provides handling for load/unload and attach/detach notifications
to allow the DLL to manage its state and allocated resources. For more information,
see “DllMain Callback Function” on MSDN®.

return TRUE on DLL_PROCESS_ATTACH if initialization of the DLL was successful;
otherwise, FALSE. Value ignored at other times by caller. */
BOOL WINAPI DllMain(HINSTANCE    hinstDLL,
                    DWORD        dwReason,
                    LPVOID       lpReserved)
{
   // Perform actions based on the reason for calling.
   if (dwReason == DLL_PROCESS_ATTACH)
   {
	   fRunOnVistaAndLater = Is_Vista_or_Later();
	   return TRUE;
   }
   else
   {
	   return FALSE;
   }
}