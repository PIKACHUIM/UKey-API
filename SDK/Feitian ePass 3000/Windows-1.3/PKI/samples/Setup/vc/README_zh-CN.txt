һ����װ������ɣ�

��װ������NGSetup.DLL��NGSetup.DAT�����ļ���NGSetup.DLLΪ��װ�м��ִ�ж�̬�⣬NGSetup.DATΪ�м����װж��ʱ�������Դ�ļ���

������̬��ĵ���������

���ڵ���һ���ӿڼ�����ɰ�װ��������غ���һ����4�������ǵĽӿ���������ò����������£�
1��DWORD WINAPI instMW_Install(const char* szParam);
2��DWORD WINAPI instMW_Uninstall(const char* szParam);
3��DWORD WINAPI instMW_IsHaveInstalled(const char* szParam);
4��DWORD WINAPI instMW_IsNeedReboot(void);

���������ӿڲ���˵����
1��instMW_Install
    ����Ϊ�ַ���������ʹ�����������ϣ������";"�ָ���
    ����1����װж������Ҫ��dat�ļ����� ����Ĳ���ȫдΪ"path=****.DAT"(���е�"****.DAT"��ʵ�ʵ��ļ������滻)��
            Ϊ�˱��ֶԾɰ汾�ļ��ݣ��ò������ñȽ��������ò��������ã�Ĭ��Ϊ"path=NGSetup.DAT"��Ҳ����ֻ���� ��****.DAT����ϵͳ�Զ��жϲ��䡰path=����
    ����2��������豸Ϊ���ܿ��豸������ѡ���Ƿ�֧�����ܿ���VPN��¼�����ܡ�
            �����֧�֣������øò��������֧�֣����ò���"regatr=true"��
    ���磺���DAT�ļ�����ΪNGSetup.DAT��֧�����ܿ���VPN��¼������Ĳ���������"path=NGSetup.DAT;regatr=true"�� ����ʡ��Ϊ ��NGSetup.DAT;regatr=true������ΪNGSetup.DAT�ļ�������Ĭ���ļ�����������ʡ��Ϊ��regatr=true����
2��instMW_Uninstall ����DAT�ļ�·�������Ϊ�գ�Ĭ��Ϊ��NGSetup.DAT����ע�⣺ֻ��һ��������û�С�path=�����֣���
3��instMW_IsHaveInstalled ͬ2���ԡ�
4��instMW_IsNeedReboot �޲�����

�ġ���������ֵ˵����
1������instMW_Install��instMW_Uninstall�ķ���ֵ���£�
#define ESA_SUCCESS			0x0000 //�ɹ�
#define ESA_ERR_FILE_NOT_FOUND		0x0001 //�ļ�û�ҵ�
#define ESA_ERR_COPY_FILES		0x0002 //�����ļ�ʧ��
#define ESA_ERR_REG			0x0003 //ע���ļ��������ļ�ʧ��
#define ESA_ERR_REG_CSP			0x0004 //ע��CSPʧ��
#define ESA_ERR_UNREG			0x0005 //ж��CSPʧ��
#define ESA_ERR_DEL_FILES		0x0006 //ɾ���ļ�ʧ��
#define ESA_ERR_DEL_DIR			0x0007 //ɾ��Ŀ¼ʧ��
#define ESA_ERR_EXCTOR_FILES		0x0008 //����Դ�ļ��⵽��ʱ�ļ�����ʧ��
#define ESA_ERR_HOST_MEMORY		0x0009 //�ڴ����
#define ESA_ERR_REG_CARD_REG		0x000A //��װ����ʧ��
#define ESA_ERR_PRODUCT_ALD_INST	0x000B //����Ʒ�Ѿ���װ���ˣ�ж�غ���ܰ�װ
#define ESA_ERR_NEEDREBOOT		0x000C //����ĳ���ļ���־���´������󿽱�����ɾ��������ֻ�������Ժ����������װ����ж��
2������instMW_IsHaveInstalled �ķ���ֵ���£�
#define ESA_NEVER_INSTALL		0 //����Ʒû��װ��
#define ESA_DEST_DVERSION_OLD		1 //����Ʒ��װ�����ұȰ�װ�ļ��汾��
#define ESA_DEST_DVERSION_EQUAL		2 //����Ʒ��װ�����ҺͰ�װ�ļ��汾��ͬ
#define ESA_DEST_DVERSION_NEW		3 //����Ʒ��װ�����ұȰ�װ�ļ��汾��
3������instMW_IsNeedReboot �ķ���ֵ����:
�������1������Ҫ����������0������Ҫ������ 

�塢ע�⣺
1������Ҫ����Lib\lib_x86\setup\Ŀ¼�µ�NGSetup.dat��NGSetup.dll��NGSetup.lib���ļ�
2����ȷ��ϵͳĿ¼����msvcp60.dll�����û���뽫LibĿ¼�µ�msvcp60.dll������ϵͳĿ¼�¡�
3�������ʾ��������а�װж����Ҫ�ڹ���Ա�û��½��С�

