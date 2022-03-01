function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
    document.getElementById("no-weixin").style.display = "block";
} else {
    if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", function() {
            document.getElementById("no-weixin").style.display = "block";
        }, false);
    } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", function() {
            document.getElementById("no-weixin").style.display = "block";
        });
        document.attachEvent("onWeixinJSBridgeReady", function() {
            document.getElementById("no-weixin").style.display = "block";
        });
    }
}
