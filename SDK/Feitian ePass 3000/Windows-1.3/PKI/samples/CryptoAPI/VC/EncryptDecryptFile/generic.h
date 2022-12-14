/*
[]=========================================================================[]

	Copyright(C)  Feitian Technologies Co., Ltd.
	All rights reserved.

FILE:
	generic.h

DESC:

[]=========================================================================[]
*/

#ifndef __GENERIC_H__
#define __GENERIC_H__

#include <windows.h>

#include <string>
using namespace std;

#define TEST_CSP_NAME      "FEITIAN ePassNG RSA Cryptographic Service Provider"

#define TEST_CONTAINER		"CSPKeyTest"

#define KEYLENGTH			0x00800000
#define ENCRYPT_ALGORITHM	CALG_RC4 
#define ENCRYPT_BLOCK_SIZE	8 


void BeginAction(const string& strOperation);
void ActionFailed(DWORD dwLastError);
void ActionSuccess(void);

void ShowSysError(const string& strInfo, DWORD dwLastError);

class HCRYPTPROV_Holder
{
public:
	HCRYPTPROV_Holder(HCRYPTPROV hProv) : m_hProv(hProv)
	{
	}

	~HCRYPTPROV_Holder()
	{
		if(NULL != m_hProv)
		{
			BeginAction("CryptReleaseContext()");
			if(!CryptReleaseContext(m_hProv, 0))
			{
				ActionFailed(GetLastError());
			}
			else
			{
				ActionSuccess();
			}
		}
	}

protected:
	HCRYPTPROV m_hProv;
};

#endif // __GENERIC_H__
