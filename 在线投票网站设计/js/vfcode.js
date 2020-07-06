//生成验证码的方法
function createCode(length) {
    var code = "";
    var codeLength = parseInt(length); //验证码的长度
    var checkCode = document.getElementById("checkCode");
    ////所有候选组成验证码的字符，当然也可以用中文的
    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); 
    //循环组成验证码的字符串
    for (var i = 0; i < codeLength; i++)
    {
        //获取随机验证码下标
        var charNum = Math.floor(Math.random() * 62);
        //组合成指定字符验证码
        code += codeChars[charNum];
    }
    if (checkCode)
    {
        //为验证码区域添加样式名
        checkCode.className = "code";
        //将生成验证码赋值到显示区
        checkCode.innerHTML = code;
    }
}
$(function(){
    //需求:实现验证码功能
     //页面加载时，生成随机验证码
     createCode(4);
   $("#xiehuan").click(function(){
       createCode(4);
   }); 
   //需求:IndexedDB数据库创建
   window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if(!window.indexedDB)
    {
        console.log("你的浏览器不支持IndexedDB");
    }
    var request = window.indexedDB.open("userInfo", 1);
    var  db; 
    request.onupgradeneeded   = function(event){
        console.log("Upgrading");
        //db = event.target.result;
        db = request.result;
        console.log(db);
        var store = db.createObjectStore("users", { keyPath : "name" });
        store.createIndex("by_name","name",{unipue:true});
        store.createIndex("by_pwd","pwd");
        //填入初始值，默认有用户123，密码123信息
        store.put({name:"123",pwd:"123"});
    };
    request.onsuccess=function(event){
        db = event.target.result;
    }
    //需求:实现用户密码验证码验证登录功能
    $("#signin").click(function(){
        var user = $("#userName").val();
        var password = $("#pwdText").val();
        var vfcode = $("#verText").val();
        var objectStore = db.transaction('users').objectStore('users');
        requestData = objectStore.get(user);
        //validateCode();
        requestData.onsuccess=function(e){
            var userinfo = e.target.result;
            if(userinfo==undefined)
            {
                alert("用户名错误!");
            }else if(!(password==userinfo.pwd))
            {
                alert("密码错误！");
            }
            else if(vfcode.length <= 0)
            {
                alert("请输入验证码！");   
            }else if(!(vfcode==$('#checkCode').html())){
                alert("验证码输入有误！");
                createCode(4);
            }
            else{
                window.location.href="main.html";
                window.event.returnValue=false;
            }
        }
     });
   //需求:实现调整注册页面
  $("#login #signup").click(function(){
    window.location.href="signup.html";
    window.event.returnValue=false;      
  });
  $("#mysignin #signup").click(function(){
    var user = $("#userName").val();
    var password = $("#pwdText").val();
    var vfcode = $("#verText").val();
    var mytransaction = db.transaction("users","readwrite");
    var objectStore = mytransaction.objectStore("users");
    requestData = objectStore.get(user);
    requestData.onsuccess = function(e){
        var userinfo = e.target.result;
       if(user.length<=0)alert("用户名为空,请输入用户名");
       else if(userinfo!=undefined)alert("该用户已存在");
       else if(password.length<=0)alert("密码为空,请输入密码");
       else if(vfcode!=$('#checkCode').html())alert("验证码有误");
       else{
           var shuju = [{name:''+user+'',pwd:''+password+''}];
           objectStore.add(shuju[0]);
           alert("注册成功,请登录！");
           window.location.href="index.html";
           window.event.returnValue=false;
       }
    };
  });
});
