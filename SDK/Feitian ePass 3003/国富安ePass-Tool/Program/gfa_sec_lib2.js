//gfa sec lib code
var CERT_TYPE_HARD = 1;
var CERT_TYPE_SOFT = 2;
var CERT_TYPE_ALL  = 3;
var CERT_TYPE_RSA  = 4;
var CERT_TYPE_GM  = 5;

var g_GfaSecAppObj = null;
var g_SoftCertSelectID = null;
var g_HardCertSelectID = null;
var g_AllCertSelectID = null;
var g_RSACertSelectID = null;
var g_GMCertSelectID = null;

var g_DefaultAppName = "GM3000RSA";



function popDropListBoxAll(strListID)
{
	var objListID = eval(strListID);
	if (objListID == undefined) {
		return;
	}
	var i, n = objListID.length;
	for(i = 0; i < n; i++) {
		objListID.remove(0);
	}

	objListID = null;
}

function pushOneDropListBox(userListArray, strListID)
{
	var objListID = eval(strListID);
	if (objListID == undefined) {
		return;
	}

	var i;
	for (i = 0; i < userListArray.length; i++) {
		var certObj = userListArray[i];
		var objItem = new Option(certObj.certName, certObj.certID);
		objListID.options.add(objItem);
	}

	objListID = null;

	return;
}

function pushAllDropListBox(strUserList, strSelectID)
{
	//alert(strUserList);
	//alert(strSelectID);
	popDropListBoxAll(strSelectID);
	var allListArray = [];
	while (true) {
		var i = strUserList.indexOf("&&&");
		if (i <= 0 ) {
			break;
		}
		var strOneUser = strUserList.substring(0, i);
		var strName = strOneUser.substring(0, strOneUser.indexOf("||"));
		var strCertID = strOneUser.substring(strOneUser.indexOf("||") + 2, strOneUser.length);
		allListArray.push({certName:strName, certID:strCertID});

		var len = strUserList.length;
		strUserList = strUserList.substring(i + 3,len);
	}

	pushOneDropListBox(allListArray, strSelectID);
}

//判断浏览器是否支持websocket  支持返回true
function check_support_websocket()
{
	return typeof WebSocket != 'undefined';
}

function getRandomCode(length) {
	if (length > 0) {
		var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
		var nums = "";
		for (var i = 0; i < length; i++) {
			var r = parseInt(Math.random() * 61);
			nums += data[r];
		}
		return nums;
	} else {
		return false;
	}
}

function createXMLHttpRequest(){
	var xmlHttp = null;
	if(window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		try{
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
}

function CreateGfaSecAppObj() {
	var obj = new Object();

	//cert app part
	obj.userlist = null;
	obj.certs = null;

	//cert make part
	obj.devlist = null;
	obj.devices = null;
	obj.applist = null;
	obj.apps = null;
	obj.contlist = null;
	obj.conts = null;

	//websocket part
	obj.ws_url = null;
	obj.ws = null;
	obj.cb = null;

	//http part
	obj.http_url = null;
	obj.http_obj = null;

	//初始化对象
	obj.Init = function(callback) {
		//obj.ws_url = "wss://websocketpp.org:9003";
		//obj.ws_url = "ws://211.88.25.250:9002";
		obj.ws_url = "ws://127.0.0.1:9002";

		if(check_support_websocket())
		{
			//alert("您的浏览器支持Websocket通信协议。");
			try {
				obj.ws = new WebSocket(obj.ws_url);
			}
			catch (e) {
				alert(e);
				return;
			}
		}
		else
		{
			alert("您的浏览器不支持Websocket通信协议！");
			return;
		}

		obj.ws.onopen = function(evt) {
			alert("Connection open ...");
			//ws.send("Hello WebSockets!");
		};

		obj.ws.onmessage = function(evt) {
			//alert( "Received Message:" + evt.data);
			obj.cb(evt.data);
			//ws.close();
		};

		obj.ws.onerror = function(evt) {
			alert("Connection error.");
			obj.ws.close();
		};

		obj.ws.onclose = function(evt) {
			alert("Connection closed.");
			obj.ws.close();
		};

		obj.cb = callback;

	}

	//初始化HTTP对象
	obj.Init2 = function(callback) {
		//obj.http_url = "http://127.0.0.1:9002/jsonp.php?jsoncallback=callbackFunction&req_body=";
		obj.http_url = "http://127.0.0.1:9002";
		//obj.http_url = "https://websocketpp.org:9003";
		obj.http_obj = createXMLHttpRequest();
	}


	obj.getHttpResult = function(){
		if (obj.http_obj.readyState == 4 && obj.http_obj.status == 200) {
			//alert(obj.http_obj.responseText);
			return obj.http_obj.responseText;
		} else {
			return "";
		}
	}

	/**
	 *
	 * @param requestBody 请求参数
	 * @param type 非必传参数 默认post
	 * @param url 非必传参数 默认 obj.http_url
	 * @param async 非必传参数 默认false(同步)
	 * @return msg 请求返回值 报错的话 返回报错信息
	 */
	obj.handleSend = function (requestBody, type, url, async) {
		requestBody = requestBody ? requestBody : ""
		type = type ? type : "POST"
		url = url ? url : obj.http_url
		async = async == null ? false : async
		// 这种写法是异步的回调。 需要全部重写使用方法。
		// obj.http_obj.onreadystatechange = function() {
		// 	if (obj.http_obj.readyState === 4  && obj.http_obj.status === 200){
		// 		msg = obj.getHttpResult();
		// 	}else {
		// 		msg = ""
		// 	}
		// }

		// 这种写法没办法处理一些async = true 的同步报错。 但是目前没有问题。
		try {
			obj.http_obj.open(type, url, async);
			obj.http_obj.send(requestBody);
		} catch(e) {
			return JSON.stringify({"msg_body":{"errcode" : -3, "result" : "not installed gfa_sec_plugin."}});
		}
		return obj.getHttpResult();
	}

	obj.SYN_CallMethod2 = function (method, params) {
		var randNum = getRandomCode(32);
		try
		{
			var params_obj = JSON.parse(params);
		}
		catch(e)
		{
			return JSON.stringify({"error":{"code" : -1, "message" : "invalid params format."}});
		}
		if(typeof(params_obj) != "object")
		{
			return JSON.stringify({"error":{"code" : -2, "message" : "invalid params, is not json object."}});
		}
		var msg  =  {
			"msg_type" : "msg_type_sym_call_method_req",
			"msg_body" :
				{
					"method" : method,
					"params" : params_obj,
					"id" : randNum
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(str_msg);
		try
		{
			//obj.http_obj.open("GET", obj.http_url + str_msg, false);
			obj.http_obj.open("POST", obj.http_url, false);
			obj.http_obj.send(str_msg);
		} catch (e)
		{
			alert('您尚未安装国富安安全插件！')
			return JSON.stringify({"error":{"code" : -3, "message" : "not installed gfa_sec_plugin."}});
		}

		msg = obj.handleSend(str_msg);
		//msg = msg.replace(/callbackFunction\(/, "");
		//msg = msg.replace(/\)/, "");
		//alert(msg);
		var msgobj = eval('(' + msg + ')');
		var ret;
		if(msgobj.msg_type == "msg_type_sym_call_method_resp")
		{
			if(typeof(msgobj.msg_body) == "object")
			{
				if(msgobj.msg_body["id"] == randNum)
				{
					ret = JSON.stringify(msgobj.msg_body);
				}
				else
				{
					ret = JSON.stringify({"error":{"code" : -4, "message" : "unexpected nonce random number."}});
				}
			}
			else
			{
				ret = JSON.stringify({"error":{"code" : -5, "message" : "invalid msg_body, is not json object."}});
			}
		}
		else
		{
			ret = JSON.stringify({"error":{"code" : -6, "message" : "invalid msg_type, is not msg_type_sym_call_method_resp."}});
		}

		return ret;
	};

	//p11 part
	obj.GenSecretKey = function (secretKeyLen) {
		var msg  =  {
			"msg_type" : "msg_type_gen_secret_key_req",
			"msg_body" :
				{
					"secret_key_len" : secretKeyLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.SymEncryptMsg = function (secretKey, secretKeyLen, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_sym_encrypt_msg_req",
			"msg_body" :
				{
					"secret_key" : secretKey,
					"secret_key_len" : secretKeyLen,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.SymDecryptMsg = function (secretKey, secretKeyLen, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_sym_decrypt_msg_req",
			"msg_body" :
				{
					"secret_key" : secretKey,
					"secret_key_len" : secretKeyLen,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.SymEncryptFile = function (secretKey, secretKeyLen, inFileName, outFileName) {
		var msg  =  {
			"msg_type" : "msg_type_sym_encrypt_file_req",
			"msg_body" :
				{
					"secret_key" : secretKey,
					"secret_key_len" : secretKeyLen,
					"in_file_name" : inFileName,
					"out_file_name" : outFileName
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.SymDecryptFile = function (secretKey, secretKeyLen, inFileName, outFileName) {
		var msg  =  {
			"msg_type" : "msg_type_sym_decrypt_file_req",
			"msg_body" :
				{
					"secret_key" : secretKey,
					"secret_key_len" : secretKeyLen,
					"in_file_name" : inFileName,
					"out_file_name" : outFileName
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.P7EncryptMsg = function (encCert, encCertLen, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_p7_encrypt_msg_req",
			"msg_body" :
				{
					"enc_cert" : encCert,
					"enc_cert_len" : encCertLen,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	//cert app part
	obj.EchoFun = function (indata) {
		var msg  =  {
			"msg_type" : "msg_type_echo_req",
			"msg_body" : indata
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.EnumCerts = function (certType) {
		var msg  =  {
			"msg_type" : "msg_type_enum_certs_req",
			"msg_body" :
				{
					"cert_type" : certType
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.Sign = function (devName, appName, kc, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_sign_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.Verify = function (devName, appName, kc, indata, indataLen, signValue, signValueLen) {
		var msg  =  {
			"msg_type" : "msg_type_verify_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen,
					"sign_value" : signValue,
					"sign_value_len" : signValueLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.SignFile = function (devName, appName, kc, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_sign_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.VerifyFile = function (devName, appName, kc, indata, indataLen, signValue, signValueLen) {
		var msg  =  {
			"msg_type" : "msg_type_verify_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen,
					"sign_value" : signValue,
					"sign_value_len" : signValueLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.Encrypt = function (devName, appName, kc, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_encrypt_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.Decrypt = function (devName, appName, kc, cipherValue, cipherValueLen, cipherKey, cipherKeyLen) {
		var msg  =  {
			"msg_type" : "msg_type_decrypt_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"cipher_value" : cipherValue,
					"cipher_value_len" : cipherValueLen,
					"cipher_key" : cipherKey,
					"cipher_key_len" : cipherKeyLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.EncryptFile = function (devName, appName, kc, inFileName, outFileName) {
		var msg  =  {
			"msg_type" : "msg_type_encrypt_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"in_file_name" : inFileName,
					"out_file_name" : outFileName
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.DecryptFile = function (devName, appName, kc, inFileName, outFileName, cipherKey, cipherKeyLen) {
		var msg  =  {
			"msg_type" : "msg_type_decrypt_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"in_file_name" : inFileName,
					"out_file_name" : outFileName,
					"cipher_key" : cipherKey,
					"cipher_key_len" : cipherKeyLen
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.ExitBrowser = function (browserType) {
		var msg  =  {
			"msg_type" : "msg_type_exit_browser_req",
			"msg_body" :
				{
					"browser_type" : browserType
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	//cert app part2
	obj.SYN_EchoFun = function (indata) {
		var msg  =  {
			"msg_type" : "msg_type_echo_req",
			"msg_body" : indata
		};
		var str_msg = JSON.stringify(msg);
		msg = obj.handleSend(str_msg);
		//alert(msg);
		return msg;
	};

	obj.SYN_EnumCerts = function (certType) {
		var msg  =  {
			"msg_type" : "msg_type_enum_certs_req",
			"msg_body" :
				{
					"cert_type" : certType
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_Sign = function (devName, appName, kc, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_sign_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_Verify = function (devName, appName, kc, indata, indataLen, signValue, signValueLen) {
		var msg  =  {
			"msg_type" : "msg_type_verify_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen,
					"sign_value" : signValue,
					"sign_value_len" : signValueLen
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);;
	};

	obj.SYN_SignFile = function (devName, appName, kc, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_sign_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);

		return obj.handleSend(str_msg);
	};

	obj.SYN_VerifyFile = function (devName, appName, kc, indata, indataLen, signValue, signValueLen) {
		var msg  =  {
			"msg_type" : "msg_type_verify_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen,
					"sign_value" : signValue,
					"sign_value_len" : signValueLen
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);;
	};

	obj.SYN_Encrypt = function (devName, appName, kc, indata, indataLen) {
		var msg  =  {
			"msg_type" : "msg_type_encrypt_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"indata" : indata,
					"indata_len" : indataLen
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_Decrypt = function (devName, appName, kc, cipherValue, cipherValueLen, cipherKey, cipherKeyLen) {
		var msg  =  {
			"msg_type" : "msg_type_decrypt_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"cipher_value" : cipherValue,
					"cipher_value_len" : cipherValueLen,
					"cipher_key" : cipherKey,
					"cipher_key_len" : cipherKeyLen
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_EncryptFile = function (devName, appName, kc, inFileName, outFileName) {
		var msg  =  {
			"msg_type" : "msg_type_encrypt_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"in_file_name" : inFileName,
					"out_file_name" : outFileName
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_DecryptFile = function (devName, appName, kc, inFileName, outFileName, cipherKey, cipherKeyLen) {
		var msg  =  {
			"msg_type" : "msg_type_decrypt_file_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"kc" : kc,
					"in_file_name" : inFileName,
					"out_file_name" : outFileName,
					"cipher_key" : cipherKey,
					"cipher_key_len" : cipherKeyLen
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_ExitBrowser = function (browserType) {
		var msg  =  {
			"msg_type" : "msg_type_exit_browser_req",
			"msg_body" :
				{
					"browser_type" : browserType
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	//cert make part
	obj.EnumDevices = function (devType) {
		var msg  =  {
			"msg_type" : "msg_type_enum_devices_req",
			"msg_body" :
				{
					"dev_Type" : devType
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.EnumApps = function (devName) {
		var msg  =  {
			"msg_type" : "msg_type_enum_apps_req",
			"msg_body" :
				{
					"dev_name" : devName
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.LoginApp = function (devName, appName, appPass) {
		var msg  =  {
			"msg_type" : "msg_type_login_app_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.ChangeAppPin = function (devName, appName, appOldPass, appNewPass) {
		var msg  =  {
			"msg_type" : "msg_type_change_app_pin_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_old_pass" : appOldPass,
					"app_new_pass" : appNewPass
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.CreateEccKeyPair = function (devName, appName, appPass) {
		var msg  =  {
			"msg_type" : "msg_type_create_ecc_key_pair_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.CreateRsaKeyPair = function (devName, appName, appPass) {
		var msg  =  {
			"msg_type" : "msg_type_create_rsa_key_pair_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.EnumConts = function (devName, appName) {
		var msg  =  {
			"msg_type" : "msg_type_enum_conts_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.CreateSubjectDN = function (email, cn, ou, o, l, st, c) {
		var msg  =  {
			"msg_type" : "msg_type_create_subject_dn_req",
			"msg_body" :
				{
					"email" : email,
					"cn" : cn,
					"ou" : ou,
					"o" : o,
					"l" : l,
					"st" : st,
					"c" : c
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.CreateEccCsr = function (devName, appName, appPass, eccCont, subjectDN) {
		var msg  =  {
			"msg_type" : "msg_type_create_ecc_csr_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont,
					"subject_dn" : subjectDN
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.CreateRsaCsr = function (devName, appName, appPass, rsaCont, subjectDN) {
		var msg  =  {
			"msg_type" : "msg_type_create_rsa_csr_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"rsa_cont" : rsaCont,
					"subject_dn" : subjectDN
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.ParseP7bCertChain = function (p7bCertChain, subjectDN) {
		var msg  =  {
			"msg_type" : "msg_type_parse_p7b_cert_chain_req",
			"msg_body" :
				{
					"p7b_cert_chain" : p7bCertChain,
					"subject_dn" : subjectDN
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.InstallEccSignCert = function (devName, appName, appPass, eccCont, eccSignCert) {
		var msg  =  {
			"msg_type" : "msg_type_install_ecc_sign_cert_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont,
					"ecc_sign_cert" : eccSignCert
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.DelEccCont = function (devName, appName, appPass, eccCont) {
		var msg  =  {
			"msg_type" : "msg_type_del_ecc_cont_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	obj.InstallEccEncCert = function (devName, appName, appPass, eccCont, eccEncCert, privateKeyCiper) {
		var msg  =  {
			"msg_type" : "msg_type_install_ecc_enc_cert_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont,
					"ecc_enc_cert" : eccEncCert,
					"private_key_ciper" : privateKeyCiper
				}
		};
		var str_msg = JSON.stringify(msg);
		obj.ws.send(str_msg);
	};

	//cert make part2
	obj.SYN_EnumDevices = function (devType) {
		var msg  =  {
			"msg_type" : "msg_type_enum_devices_req",
			"msg_body" :
				{
					"dev_Type" : devType
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_EnumApps = function (devName) {
		var msg  =  {
			"msg_type" : "msg_type_enum_apps_req",
			"msg_body" :
				{
					"dev_name" : devName
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_LoginApp = function (devName, appName, appPass) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_login_app_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_ChangeAppPin = function (devName, appName, appOldPass, appNewPass) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_change_app_pin_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_old_pass" : appOldPass,
					"app_new_pass" : appNewPass
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_CreateEccKeyPair = function (devName, appName, appPass) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_create_ecc_key_pair_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_CreateRsaKeyPair = function (devName, appName, appPass) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_create_rsa_key_pair_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_EnumConts = function (devName, appName) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_enum_conts_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_CreateSubjectDN = function (email, cn, ou, o, l, st, c) {
		var msg  =  {
			"msg_type" : "msg_type_create_subject_dn_req",
			"msg_body" :
				{
					"email" : email,
					"cn" : cn,
					"ou" : ou,
					"o" : o,
					"l" : l,
					"st" : st,
					"c" : c
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_CreateEccCsr = function (devName, appName, appPass, eccCont, subjectDN) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_create_ecc_csr_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont,
					"subject_dn" : subjectDN
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_CreateRsaCsr = function (devName, appName, appPass, rsaCont, subjectDN) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_create_rsa_csr_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"rsa_cont" : rsaCont,
					"subject_dn" : subjectDN
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_ParseP7bCertChain = function (p7bCertChain, subjectDN) {
		var msg  =  {
			"msg_type" : "msg_type_parse_p7b_cert_chain_req",
			"msg_body" :
				{
					"p7b_cert_chain" : p7bCertChain,
					"subject_dn" : subjectDN
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_InstallEccSignCert = function (devName, appName, appPass, eccCont, eccSignCert) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_install_ecc_sign_cert_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont,
					"ecc_sign_cert" : eccSignCert
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_DelEccCont = function (devName, appName, appPass, eccCont) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_del_ecc_cont_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont
				}
		};
		var str_msg = JSON.stringify(msg);
		return obj.handleSend(str_msg);
	};

	obj.SYN_InstallEccEncCert = function (devName, appName, appPass, eccCont, eccEncCert, privateKeyCiper) {
		if (appName == null)
		{
			appName = g_DefaultAppName;
		}
		//alert(appName);
		var msg  =  {
			"msg_type" : "msg_type_install_ecc_enc_cert_req",
			"msg_body" :
				{
					"dev_name" : devName,
					"app_name" : appName,
					"app_pass" : appPass,
					"ecc_cont" : eccCont,
					"ecc_enc_cert" : eccEncCert,
					"private_key_ciper" : privateKeyCiper
				}
		};
		var str_msg = JSON.stringify(msg);
		//alert(msg);
		return obj.handleSend(str_msg);
	};

	return obj;
}

(function() {
	g_GfaSecAppObj  = CreateGfaSecAppObj();
	if (g_GfaSecAppObj != null) {
		alert("create g_GfaSecAppObj succ.");
	}	else {
		alert("create g_GfaSecAppObj fail.");
	}
})();



	