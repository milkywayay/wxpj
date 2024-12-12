const db = wx.cloud.database()
Page({


  data: {

  },

  onLoad(options) {
    this.classification1()
    this.is_seller()
    this.is_manager()
  },

  is_manager(){
    db.collection('managerlist')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .get()
    .then(res=>{
      console.log(res)
      if(res.data.length>0){
        this.setData({
          manager:true
        })
      }else{
        this.setData({
          manager:false
        })
      }
    })
  },

  manager_entrance(){
    wx.navigateTo({
      url: '/pages/manager/manager_center',
    })
  },
  
  be_manager(){
    if(wx.getStorageSync('phoneNumber')){
    wx.navigateTo({
      url: '/pages/manager/be_manager',
    })
  }else{
    wx.showToast({
      title: '清闲登录',
      icon:'error'
    })
  }
  },

  is_seller(){
    db.collection('sellerlist')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .get()
    .then(res=>{
      if(res.data.length>0){
        this.setData({
          seller:true
        })
      }else{
        this.setData({
          seller:false
        })
      }
    })
  },

  be_seller(){
    if(wx.getStorageSync('phoneNumber')){
    wx.navigateTo({
      url: '/pages/seller/be_seller',
    })
  }else{
    wx.showToast({
      title: '请先登录',
      icon:'error'
    })
  }
  },
  classification1() {
    if (wx.getStorageSync('phoneNumber')) {
      this.setData({
        log: true
      })
    } else {
      this.setData({
        log: false
      })
    }
  },

  log_out() {
    wx.clearStorage()
    wx.showToast({
      title: '已退出',
      icon: "success"
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/me/info_all'
      });
    }, 600);

  },



  login(e) {
    wx.cloud.callFunction({
        name: 'phoneNumber',
        data: {
          weRunData: wx.cloud.CloudID(e.detail.cloudID),
        }
      })
      .then(res => {
        wx.setStorageSync('phoneNumber', res.result.moblie)
        this.classification()
      })
  },

  //辨别是否首次登录
  classification() {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(111)
        if (res.data.length > 0) {
          this.multiple_logins()
        } else {
          this.first_login()
        }
      })
  },


  //首次登录，注册
  first_login() {
    const avater = 'cloud://company-6gxdqmbcca524546.636f-company-6gxdqmbcca524546-1326967527/userlist/用户初始头像.png.jpeg'
    const nickName = wx.getStorageSync('phoneNumber').slice(0, 3) + 'xxxx' + wx.getStorageSync('phoneNumber').slice(7)
    console.log('注册')
    wx.setStorageSync('avater', avater)
    wx.setStorageSync('nickName', nickName)
    db.collection('userlist')
      .add({
        data: {
          phoneNumber: wx.getStorageSync('phoneNumber'),
          nickName: nickName,
          avater: avater,
          attention:[],
          attentioned:[]
        }
      })
    wx.showToast({
      title: '已注册',
      icon: 'success',
      duration: 2000
    });
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 500);
  },

  //多次登录，同步
  multiple_logins() {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        wx.setStorageSync('avater', res.data[0].avater)
        wx.setStorageSync('nickName', res.data[0].nickName)
      })
    wx.showToast({
      title: '已登录',
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 500)
  },

  address_manage(){
    if(wx.getStorageSync('phoneNumber')){
    wx.navigateTo({
      url: '/pages/map/address_library',
    })
  }else{
    wx.showToast({
      title: '请先登录',
      icon:'error'
    })
  }
  },

  seller_entrance(){
    wx.navigateTo({
      url: '/pages/seller/seller_center',
    })
  },




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