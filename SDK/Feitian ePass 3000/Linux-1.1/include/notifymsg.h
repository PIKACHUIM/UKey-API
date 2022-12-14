

#ifndef __NOTIFYMSG_H__
#define __NOTIFYMSG_H__

#ifdef __cplusplus
extern "C" {
#endif

// business process
#define NOTIFY_INIT_TOKEN						0x00000000
#define NOTIFY_UPDATE_SO_PIN					0x00000001
#define NOTIFY_UPDATE_USER_PIN					0x00000002
#define NOTIFY_RELOAD_USER_PIN					0x00000003
#define NOTIFY_TOKEN_INSERT						0x00000004
#define NOTIFY_TOKEN_REMOVED					0x00000005
#define NOTIFY_CREATE_OBJECT					0x00000006
#define NOTIFY_DELETE_OBJECT					0x00000007
#define NOTIFY_UPDATE_OBJECT					0x00000008
#define NOTIFY_NEW_CERCIFICATE					0x00000009
#define NOTIFY_DEL_CERCIFICATE					0x0000000A
#define NOTIFY_CHANGE_TOKEN_NAME				0x0000000B

// tray message
#define NOTIFY_GENERATING_RSA_KEY_PAIR			0x00001000
#define NOTIFY_FINISH_GEN_RSA_KEY_PAIR			0x00001001
#define NOTIFY_GENERATE_RSA_KEY_PAIR_ERR		0x00001002
#define NOTIFY_GENERATING_DSA_KEY_PAIR			0x00001003
#define NOTIFY_FINISH_GEN_DSA_KEY_PAIR			0x00001004
#define NOTIFY_GENERATE_DSA_KEY_PAIR_ERR		0x00001005
#define NOTIFY_READING_DATA						0x00001006
#define NOTIFY_READ_DATA_ERR					0x00001007
#define NOTIFY_WRITING_DATA						0x00001008
#define NOTIFY_WRITE_DATA_ERR					0x00001009
#define NOTIFY_MODIFY_FILE_SIZE_ERR				0x0000100A
#define NOTIFY_INITING_TOKEN					0x0000100B
#define NOTIFY_INIT_TOKEN_OK					0x0000100C
#define NOTIFY_INIT_TOKEN_ERR					0x0000100D
#define NOTIFY_PRV_INITING_TOKEN				0x0000100E
#define NOTIFY_PRV_INIT_TOKEN_OK				0x0000100F
#define NOTIFY_PRV_INIT_TOKEN_ERR				0x00001010
#define NOTIFY_CREATING_X509_CERT				0x00001011
#define NOTIFY_CREATE_X509_CERT_OK				0x00001012
#define NOTIFY_CREATE_X509_CERT_ERR				0x00001013
#define NOTIFY_CREATING_PUBKEY_OBJ				0x00001014
#define NOTIFY_CREATE_PUBKEY_OBJ_OK				0x00001015
#define NOTIFY_CREATE_PUBKEY_OBJ_ERR			0x00001016
#define NOTIFY_CREATING_PRVKEY_OBJ				0x00001017
#define NOTIFY_CREATE_PRVKEY_OBJ_OK				0x00001018
#define NOTIFY_CREATE_PRVKEY_OBJ_ERR			0x00001019
#define NOTIFY_CREATING_DATA_OBJ				0x0000101A
#define NOTIFY_CREATE_DATA_OBJ_OK				0x0000101B
#define NOTIFY_CREATE_DATA_OBJ_ERR				0x0000101C


#define NOTIFY_BLANK_MSG						0x80000000


CK_DECLARE_FUNCTION(CK_RV, E_NotifyCallBack)
(
	CK_SLOT_ID			slotID,			// (IN) ID of the token's slot
	CK_VOID_PTR			pMsgData		// (IN) message to notify
);

typedef
CK_DECLARE_FUNCTION_POINTER(CK_RV, EP_NotifyCallBack)
(
	CK_SLOT_ID			slotID,			// (IN) ID of the token's slot
	CK_VOID_PTR			pMsgData		// (IN) message to notify);
);


#ifdef __cplusplus
}
#endif

#endif //__NOTIFYMSG_H__


