// pages/post/post.js
var util = require("../util/util.js");
Page({
  data: {
    url: "",
    postlist: [],
    total: 0,
    imgsrc: [],
    reqUrl: "",
    index: 1,
    pages: 1,
    leftdata: 0,
    animated: false,
    tipsShow: false,
    tipsShowMore: false,
    startX: 0,
    startY: 0,
    which: true
  },
  onLoad: function (options) {
    var url = "";
    var topTitle = "";
    var postId = options.id;
    // 设置主标题
    switch (postId) {
      case "文本笑话":
        url = "http://route.showapi.com/341-1";
        this.setData({
          url: url,
          which: true
        });
        break;
      case "搞笑图片":
        url = "http://route.showapi.com/341-2";
        this.setData({
          url: url,
          which: false
        });
        break;
      case "动态趣图":
        url = "http://route.showapi.com/341-3";
        this.setData({
          url: url,
          which: false
        });
        break;
    }
    // 
    this.setData({
      reqUrl: url
    });
    wx.setNavigationBarTitle({
      title: postId,
    })
    var pages = this.data.pages;
    util.http(url, pages, this.dataThing);
    this.setData({
      total: 15
    });
  },
  // 切换图片动画效果
  animate: function (leftdata, number, that) {
    that.data.animated = true;
    var num = Math.abs(number);
    var time = 300 * num;//位移总时间
    var interval = 30;//位移间隔
    var offset = Math.abs(leftdata - that.data.leftdata);
    var speed = offset / (time / interval);//每次位移量
    var newLeft;
    function go() {
      if (that.data.leftdata != leftdata) {
        newLeft = that.data.leftdata + number * speed;
        that.setData({
          leftdata: newLeft
        })
        setTimeout(go, interval);
      } else {
        that.data.animated = false;
        that.data.leftdata = leftdata;
      }
    }
    go();
  },

  // 切换图片上一个，下一个方法
  prevItem: function (event) {
    var number = parseInt(event.currentTarget.dataset.number);

    this.goImg(number);
  },
  // 
  goImg: function (number) {
    //正在执行动画时时，按钮不能使用
    if (this.data.animated) {
      return;
    }
    //当上翻到最新的一个显示提示框并且不再移动
    if ((this.data.index - number) == 0) {
      this.setData({
        tipsShow: true
      });
      var that = this;
      setTimeout(function () {
        that.setData({
          tipsShow: false
        });
      }, 2000);
      return;
    }
    //当内容不够将要执行的回退个数时时，显示提示框，并只回退到第一张图
    if ((this.data.index - number) < 0) {
      this.setData({
        tipsShowMore: true
      });
      number = (this.data.index - 1);
      var that = this;
      setTimeout(function () {
        that.setData({
          tipsShowMore: false
        });
      }, 2000);
    }
    var oldLeft = this.data.leftdata;
    var leftdata = oldLeft + number * 700;
    var oldIndex = this.data.index;
    var index = oldIndex - number;
    var that = this;
    this.animate(leftdata, number, that);
    this.setData({
      index: index
    });
    var total = this.data.total;
    if (total < index + 11) {
      util.http(this.data.url, this.data.pages, this.dataThing);
      this.setData({
        total: total + 15
      })
    }
  },
  // 请求数据成功的回调方法
  dataThing: function (result) {
    var postlist = this.data.postlist;
    var imgsrc = this.data.imgsrc;
    var content = result.data.showapi_res_body.contentlist;
    // 将所有object的image的src放到一个单独的数组中
    for (var i = 0; i < content.length; i++) {
      var object = content[i];
      var src = content[i].img;
      console.log(content[i].text);
      if (this.data.which) {
        var text = content[i].text;
        var newText = text.replace(/<.*?>/ig, "");
        newText = newText.replace(/&nbsp;/ig, "");
        content[i].text = newText;
        var newText = text.replace(/<.*?>/ig, "");
        newText = newText.replace(/&nbsp;/ig, "");
        content[i].text = newText;
      }
      postlist.push(object);
      imgsrc.push(src);
    }
    this.setData({
      postlist: postlist,
      imgsrc: imgsrc,
      pages: this.data.pages + 1
    });
  },
  // tap查看图片
  viewImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.imgsrc,
    });
  },
  // 绑定touchstart方法
  mytouchstart: function (event) {
    var startX = event.touches[0].clientX;
    var startY = event.touches[0].clientY;
    this.setData({
      startX: startX,
      startY: startY
    });
  },
  // 绑定touchend方法
  mytouchend: function (event) {
    var endX = event.changedTouches[0].clientX;
    var endY = event.changedTouches[0].clientY;
    var startX = this.data.startX;
    var startY = this.data.startY;
    var deltaX = endX - startX;
    var deltaY = endY - startY;
    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
      return;
    }
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.goImg(1);
      } else {
        this.goImg(-1);
      }
    }
  },
})