// pages/welcome/welcome.js
Page({
  data:{},
  onTap:function(event){
    var postId=event.currentTarget.dataset.postid;
    wx.navigateTo({
        url: '../list/list?id='+postId
    });
  }
 
})