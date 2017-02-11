// pages/post/post.js
var util = require("../util/util.js");
Page({
  data: {
    index: 1,
    content: []
  },
  onLoad: function (options) {
    util.http("http://route.showapi.com/341-3", this.dataThing);
    console.log(this.data.postlist1);
  },
  dataThing: function (result) {
    var postlist = [];
    postlist = result.data.showapi_res_body.contentlist;
    this.setData({
      content: postlist
    });
  },


  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  viewImg: function (event) {
    wx.previewImage({
       current: 'src', // 当前显示图片的http链接
       urls: [src] // 需要预览的图片http链接列表
    })
  }
})