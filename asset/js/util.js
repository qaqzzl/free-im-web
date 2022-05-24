String.prototype.startWith=function(str){  
		        if(str==null||str==""||this.length==0||str.length>this.length)  
		          return false;  
		        if(this.substr(0,str.length)==str)  
		          return true;  
		        else  
		          return false;  
		        return true;  
		    }  
String.prototype.endWith=function(str){  
		        if(str==null||str==""||this.length==0||str.length>this.length)  
		          return false;  
		        if(this.substring(this.length-str.length)==str)  
		          return true;  
		        else  
		          return false;  
		        return true;  
}


//日期格式化
Date.prototype.format = function(format){ 
	if(!format){
		format = 'yyyy-MM-dd';// 默认1997-01-01这样的格式
	}
	var o = { 
		"M+" : this.getMonth()+1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth()+3)/3), // quarter
		"S" : this.getMilliseconds() // millisecond
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
}




var config={
	serverUrl:"//"+api_host
}

function Core(){
	
}
Core.prototype.numformat=function(){
	  var num = (num || 0).toString(), result = '';
    var suffix="";
    if(num.indexOf(".")>-1){
    	var t = num.split(".");
    	num=t[0];
    	suffix = "." + t[1];
    	
    }
   
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num +""+ result; }
  
    return result+suffix;
}

Core.prototype.getStrByte=function(s)
{
	var intCount = 0;
	for(var i = 0;i < s.length;i ++)
	{
		// Ascii码大于255是双字节的字符
		var ascii = s.charCodeAt(i).toString(16);
		var byteNum = ascii.length / 2.0;


		intCount += (byteNum + (ascii.length % 2) / 2);
	}
	return intCount;
}

Core.prototype.stringToByte = function(str) {
	var bytes = new Array();
	var len, c;
	len = str.length;
	str = str.toString()
	for (var i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if (c >= 0x010000 && c <= 0x10FFFF) {
			bytes.push(((c >> 18) & 0x07) | 0xF0);
			bytes.push(((c >> 12) & 0x3F) | 0x80);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000800 && c <= 0x00FFFF) {
			bytes.push(((c >> 12) & 0x0F) | 0xE0);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000080 && c <= 0x0007FF) {
			bytes.push(((c >> 6) & 0x1F) | 0xC0);
			bytes.push((c & 0x3F) | 0x80);
		} else {
			bytes.push(c & 0xFF);
		}
	}
	return bytes;
}
Core.prototype.byteToString = function(arr) {
	if(typeof arr === 'string') {
		return arr;
	}
	var str = '',
		_arr = arr;
	for(var i = 0; i < _arr.length; i++) {
		var one = _arr[i].toString(2),
			v = one.match(/^1+?(?=0)/);
		if(v && one.length == 8) {
			var bytesLength = v[0].length;
			var store = _arr[i].toString(2).slice(7 - bytesLength);
			for(var st = 1; st < bytesLength; st++) {
				store += _arr[st + i].toString(2).slice(2);
			}
			str += String.fromCharCode(parseInt(store, 2));
			i += bytesLength - 1;
		} else {
			str += String.fromCharCode(_arr[i]);
		}
	}
	return str;
}

function uuid(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	} else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random()*16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
}

Core.prototype.getDeviceID=function(){
	var device_id = localStorage.getItem("DeviceID")
	if (!device_id) {
		device_id = uuid(16, 62)
		this.data("DeviceID", device_id);
	}
	console.log("device_id:"+device_id)
	return device_id
}
Core.prototype.getDeviceType=function(){
	return "mobile"		// mobile
}
Core.prototype.getClientType=function(){
	return "web"
}

Core.prototype.setUserId=function(id){
	return this.data("userid",id);
}

Core.prototype.getUserId=function(){
	return localStorage.getItem("userid")
}

Core.prototype.userInfo=function(d){
	d.createAt = new Date();
	return this.data("userinfo",d);
}


Core.prototype.setToken=function(d){
		d.createAt = new Date();
		return this.data("token",d);
}
Core.prototype.getToken=function(){
	return localStorage.getItem("token")
}

Core.prototype.error=function(d){
    alert(d)
}
Core.prototype.alert=function(d){
    alert(d)
}
	//用于存储信息
Core.prototype.data=function(k,d){
		//console.log("data",k,d)
		if(typeof d=="undefined"){
			var o = localStorage.getItem(k);
			if(o==null){
				return null;
			}else{
				o = JSON.parse(o)
				return o[k]
			}
		}else if(null==d){
			return localStorage.removeItem(k)
		}else if ((typeof d == 'string') && d.constructor==String){
			return localStorage.setItem(k,d)
		}else if ((typeof d=='object')&&d.constructor==Array){
			return localStorage.setItem(k,JSON.stringify(d))
		}else {
			var o = {}
			o[k] = d;
			return localStorage.setItem(k,JSON.stringify(d))
		}
	}
//用于存储信息
Core.prototype.api=function(uri){
    if(uri.startWith("/")){
        return config.serverUrl+uri
    }else{
        return config.serverUrl+"/"+uri
    }
}
Core.prototype.post=function(uri,data,fn){
	var url = this.api(uri)
	var _this = this
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST",url, true);
        // 添加http头，发送信息至服务器时内容编码类型
        xhr.setRequestHeader(
        	"Content-Type",
			"application/json;charset=UTF-8"
		);

		xhr.setRequestHeader(
			"device_id",
			_this.getDeviceID()
		);
		xhr.setRequestHeader(
			"client_type",
			_this.getClientType()
		);

		if(Core.prototype.getToken()){
			xhr.setRequestHeader(
				"Authorization",
				"Bearer "+Core.prototype.getToken()
			);
		}

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        xhr.onerror = function(){
        	reject({"code":-1,"msg":"服务器繁忙"})
		}

        // var _data=[];
        // for(var i in data){
        //     _data.push( i +"=" + encodeURI(data[i]));
        // }
    	// xhr.send(_data.join("&"));
		xhr.send(JSON.stringify(data));
    })
}

Core.prototype.get=function(uri,data,fn){
	var url = this.api(uri)
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET",url, true);
		// 添加http头，发送信息至服务器时内容编码类型
		xhr.setRequestHeader(
			"Content-Type",
			"application/json;charset=UTF-8"
		);

		if(Core.prototype.getToken()){
			xhr.setRequestHeader(
				"Authorization",
				"Bearer "+Core.prototype.getToken()
			);
		}

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
				resolve(JSON.parse(xhr.responseText));
			}
		};
		xhr.onerror = function(){
			reject({"code":-1,"msg":"服务器繁忙"})
		}

		xhr.send(JSON.stringify(data));
	})
}

Core.prototype.uploadfile=function(uri,dom){
    var url = this.api(uri)
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST",url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        xhr.onerror = function(){
            reject({"code":-1,"msg":"服务器繁忙"})
        }

        var formdata = new FormData();
        formdata.append("file",dom.files[0])
        xhr.send(formdata);
    })


}

Core.prototype.uploadmp3=function(uri,blob){

    var url = this.api(uri)
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST",url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        xhr.onerror = function(){
            reject({"code":-1,"msg":"服务器繁忙"})
        }

        var formdata = new FormData();
        formdata.append("filetype",".mp3");
        formdata.append("file",blob)
        xhr.send(formdata);
    })

}

Core.prototype.parseUri = function(url){
		if(typeof url=="undefined"){
			url= location.href;
		}
		var query = url.substr(url.indexOf("?"));
		query=query.substr(1);
	    var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
	    var obj = {};
	    while(reg.exec(query)){
	        obj[RegExp.$1] = decodeURI(RegExp.$2);
	    }
	    return obj;
	}
	Core.prototype.parseQuery = function(name){
			
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return decodeURI(unescape(r[2])); 
            return null; //返回参数值
	}

Core.prototype.isemail = function(email){
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9_-]+$/.test(email)
}
Core.prototype.ismobile = function(mobile){
    return /^[1][34578][0-9]{9}$/.test(mobile)
}

Core.prototype.test = function(reg,data){
    var reg = new RegExp(reg); //构造一个含有目标参数的正则表达式对象
    return reg.test(data)
}
window.util = new Core();


	
