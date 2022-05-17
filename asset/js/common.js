var api_host = "free-im.qaqzz.com:8066"
// var api_host = "127.0.0.1:8080"
var websocket_host = "free-im.qaqzz.com:1209"
// var websocket_host = "127.0.0.1:2001"

window.addEventListener('popstate', this.popstateFun,false);
function popstateFun() {
	//监听浏览器回退的回调
	window.history.pushState(null, null, document.URL); //想浏览器跳转记录中添加一条空记录
}
// window.removeEventListener('popstate', this.popstateFun);

// function userId(id){
    //     if(typeof  id =="undefined"){
    //         var r = sessionStorage.getItem("userid");
    //         if(!r){
    //             return 0;
    //         }else{
    //             return parseInt(r)
    //         }
    //     }else{
    //         sessionStorage.setItem("userid",id);
    //     }
    // }
    // function userInfo(o){
    //     if(typeof  o =="undefined"){
    //         var r = sessionStorage.getItem("userinfo");
    //         if(!!r){
    //             return JSON.parse(r);
    //         }else{
    //             return null
    //         }
    //     }else{
    //         sessionStorage.setItem("userinfo",JSON.stringify(o));
    //     }
    // }
    var url = location.href;
    var isOpen = url.indexOf("/login")>-1 || url.indexOf("/register")>-1
    if (!localStorage.getItem('token') && !isOpen){
      	location.href = "/view/user/login.html";
    }
	if (localStorage.getItem('token') && isOpen){
	  	location.href = "/view/chat/index.html";
	}
   
   function location_get(uri,data,fn){
		var xhr = new XMLHttpRequest();
		xhr.open("GET","//"+location.host+"/"+uri, true);
		// 添加http头，发送信息至服务器时内容编码类型
		// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
				fn.call(this, JSON.parse(xhr.responseText));
			}
		};
	   xhr.send(JSON.stringify(data));
   }
	function uploadfile(uri,dom,fn){
		var xhr = new XMLHttpRequest();
		xhr.open("POST","//"+api_host+"/"+uri, true);
		// 添加http头，发送信息至服务器时内容编码类型
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
				fn.call(this, JSON.parse(xhr.responseText));
			}
		};
		var _data=[];
		var formdata = new FormData();
		if(!! userId()){
			formdata.append("userid",userId());
		}
		formdata.append("file",dom.files[0])
		xhr.send(formdata);
	}
	function uploadblob(uri,blob,filetype,fn){
		var xhr = new XMLHttpRequest();
		xhr.open("POST","//"+api_host+"/"+uri, true);
		// 添加http头，发送信息至服务器时内容编码类型
		xhr.onreadystatechange = function() {
		   if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
			   fn.call(this, JSON.parse(xhr.responseText));
		   }
		};
		var _data=[];
		var formdata = new FormData();
		formdata.append("filetype",filetype);
		if(!! userId()){
		   formdata.append("userid",userId());
		}
		formdata.append("file",blob)
		xhr.send(formdata);
	}
	function uploadaudio(uri,blob,fn){
		uploadblob(uri,blob,".mp3",fn)
	}
	function uploadvideo(uri,blob,fn){
		uploadblob(uri,blob,".mp4",fn)
	}