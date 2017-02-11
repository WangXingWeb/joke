function http(url,pages,callBack){
    function formatterDateTime() {
    var date=new Date()
    var month=date.getMonth() + 1
    var datetime = date.getFullYear()
        + ""// "年"
        + (month >= 10 ? month : "0"+ month)
        + ""// "月"
        + (date.getDate() < 10 ? "0" + date.getDate() : date
            .getDate())
        + ""
        + (date.getHours() < 10 ? "0" + date.getHours() : date
            .getHours())
        + ""
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes())
        + ""
        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
            .getSeconds());
    return datetime;
}
     wx.request({
      type: 'post',
        url: url,
        dataType: 'json',
        data: {
            "showapi_timestamp": formatterDateTime(), //注意要使用当前时间。服务器只处理时间误差10分钟以内的请求
            "showapi_appid": '29541', //这里需要改成自己的appid
            "showapi_sign": '3fd121b3d11845d3bddd36c8e2a6bd6a',  //这里需要改成自己的密钥
            "page":pages,
            "maxResult":15,
        },
        jsonp: 'jsonpcallback',
        error: function(XmlHttpRequest, textStatus, errorThrown) {
            alert("操作失败!");
        },
        success: function(result) {
            callBack(result);
            }
        })
  }
  module.exports={
    http:http
}
