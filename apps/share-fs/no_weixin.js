function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == "micromessenger" ? true : false;
}

if(is_weixin()){
    document.getElementById("no-weixin").style.display = "block";
}
