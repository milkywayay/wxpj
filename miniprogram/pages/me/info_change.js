const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgURL: '' ,// 用于保存上传图片的URL
    auditing2:false,
    auditing:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    console.log(options.type)
    this.setData({
      type:options.type
    })
    this.if_auditing()
    this.if_auditing2()
  },

  if_auditing2(){
    db.collection('audit')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber'),
      type:'头像',
      audit:false
    })
    .get()
    .then(res=>{
      console.log(res)
      if(res.data.length>0){
        this.setData({
          auditing2:true,
          old_avater:wx.getStorageSync('avater'),
          new_avater:res.data[0].new_avater
        })
      }
    })
  },


  if_auditing(){
    db.collection('audit')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber'),
      type:'昵称',
      audit:false
    })
    .get()
    .then(res=>{
      console.log(res)
      if(res.data.length>0){
        this.setData({
          auditing:true,
          old_nickName:wx.getStorageSync('nickName'),
          new_nickName:res.data[0].new_nickName
        })
      }
    })
  },

  input(e){
    console.log(e.detail.value)
    this.setData({
      nickName:e.detail.value
    })
  },

  uploadImage() {
    let that = this;
    wx.chooseMedia({
      count: 1, // 只能选择一张图片
      mediaType: ['image'], // 只允许选择图片
      sourceType: ['album', 'camera'], // 可以从相册或拍照选择
      success(res) {
        const filePath = res.tempFiles[0].tempFilePath;

        wx.cloud.uploadFile({
          cloudPath: 'uploads/' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000) + '.png', // 避免重复文件名
          filePath: filePath,
          success(uploadRes) {
            that.setData({
              imgURL: uploadRes.fileID
            });
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            });
          },
          fail(err) {
            console.error("上传失败", err);
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          }
        });
      },
      fail(err) {
        console.error("选择图片失败", err);
      }
    });
  },

  confirm_input(){
    db.collection('audit')
    .add({
      data:{
        phoneNumber:wx.getStorageSync('phoneNumber'),
        old_nickName:wx.getStorageSync('nickName'),
        new_nickName:this.data.nickName,
        audit:false,
        type:'昵称'
      }
    })
    wx.cloud.callFunction({
      name:'new_audit',
      data:{
        task_no:Date.now()+wx.getStorageSync('phoneNumber'),
        task_summary:'新昵称审核',
        nickName:wx.getStorageSync('nickName')
      }
    })

    this.setData({
      auditing:true,
      old_nickName:wx.getStorageSync('nickName')
    })



    wx.requestSubscribeMessage({
      tmplIds: ['b3FdHt8aLR3BKmOlRLK_dmDKNM-VzKvCFnj9_hBjd6k'],
      success(res) {
        console.log(res)
      }
    })

  },

  confirm_imgURL(){
    db.collection('audit')
    .add({
      data:{
        phoneNumber:wx.getStorageSync('phoneNumber'),
        old_avater:wx.getStorageSync('avater'),
        new_avater:this.data.imgURL,
        audit:false,
        type:'头像'
      }
    })

    wx.cloud.callFunction({
      name:'new_audit',
      data:{
        task_no:Date.now()+wx.getStorageSync('phoneNumber'),
        task_summary:'新头像审核',
        nickName:wx.getStorageSync('nickName')
      }
    })

    wx.requestSubscribeMessage({
      tmplIds: ['b3FdHt8aLR3BKmOlRLK_dmDKNM-VzKvCFnj9_hBjd6k'],
      success(res) {
        console.log(res)
      }
    })

    this.setData({
      auditing2:true,
      old_avater:wx.getStorageSync('nickName')
    })
    // db.collection('userlist')
    // .where({
    //   phoneNumber:wx.getStorageSync('phoneNumber')
    // })
    // .update({
    //   data:{
    //     avater:this.data.imgURL
    //   }
    // })
    // .then(res=>{
    //   console.log(res)
    //   wx.setStorageSync('avater', this.data.imgURL)
    //   wx.showToast({
    //     title: '更改成功',
    //     icon:'success'
    //   })
    //   setTimeout(() => {
    //     wx.navigateBack({
    //       delta:1
    //     })
    //   }, 600);
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})