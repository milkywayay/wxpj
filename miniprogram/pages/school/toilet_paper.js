const db = wx.cloud.database()
Page({


  data: {
    gender: 'male' // 默认选中男
  },



  onLoad(options) {
    this.address_formatted()
  },

  address_detail(e){
    console.log(e.detail.value)
    this.setData({
      address_detail:e.detail.value
    })
  },

  onGenderChange: function(e) {
    this.setData({
      gender: e.detail.value
    });
  },

  address_formatted() {
    this.setData({
      address_formatted: wx.getStorageSync('address_formatted')
    })
  },

  order(){
    if(this.data.address_detail){
    const out_trade_no=Date.now()+wx.getStorageSync('phoneNumber')
    db.collection('orders')
    .add({
      data:{
        name:'paper',
        money:3,
        payer_phoneNumber:wx.getStorageSync('phoneNumber'),
        payer_openid:wx.getStorageSync('openid'),
        payer_nickName:wx.getStorageSync('nickName'),
        payee:'上海多寰文化科技有限公司',
        payee_phoneNumber:'18330529472',
        out_trade_no:out_trade_no,
        address_detail:this.data.address_detail,
        gender:this.data.gender,
        pay:false,
        order_time:Date.now(),
        photo:'cloud://company-6gxdqmbcca524546.636f-company-6gxdqmbcca524546-1326967527/school_server/卫生纸.png'
      }
    })
    this.pay(out_trade_no)
  }else{
    wx.showToast({
      title: '请填写精确地址',
      icon:'error'
    })
  }
  },



  pay(out_trade_no) {
    wx.showToast({
      icon:'loading'
    })
      wx.request({
        url: 'https://company-6gxdqmbcca524546.ap-shanghai.tcbautomation.cn/Automation/Webhook/DirectCallback/100037213044/kbzf_dywh_a2ed295/trigger_z7njwdz3g/HVAeL5xCs4yvcY2j',
        method: 'POST',
        data: {
          "description": "飞翔的厕纸",
          "out_trade_no": out_trade_no,
          "time_expire": "2033-12-31T23:59:59+08:00",
          "support_fapiao": "true",
          "amount": {
            "total":300,
            "currency": "CNY"
          },
          "payer": {
            "openid": wx.getStorageSync('openid') 
          },
        },
        success: (res) => {
          console.log(res)
          this.paySecond(res.data.data,out_trade_no);
        },
        fail: (error) => {
          console.error(error);
          wx.navigateTo({
            url: '/pages/orders/orders',
          })
        }
      })
  },



  paySecond(pay,out_trade_no) {
          wx.requestPayment({
            "timeStamp": pay.timeStamp,
            "nonceStr": pay.nonceStr,
            "package": pay.packageVal,
            "signType": "RSA",
            "paySign": pay.paySign,
            "success": (res) => {
              console.log(res)
              this.pull_up(pay,out_trade_no)
            },
            "fail": function (res) {
              console.log(res)
              wx.navigateTo({
                url: '/pages/orders/orders',
              })
            },
            "complete": function (res) {
              console.log(res)
            }
          })
  },

  pull_up(pay,out_trade_no){
    db.collection('orders')
    .where({
      out_trade_no:out_trade_no
    })
    .update({
      data:{
        send:false,
        pay:true,
        pay_time:pay.timeStamp
      }
    })
    .then(res=>{
      wx.navigateTo({
        url: '/pages/orders/orders',
      })
    })

  },


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