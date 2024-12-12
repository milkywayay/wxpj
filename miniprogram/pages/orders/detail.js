const db = wx.cloud.database()
Page({

  data: {

  },


  onLoad(options) {
    console.log(options)
    if (options.id) {
      this.getData(options.id)
      console.log("走的id")
    }
    if (options.out_trade_no) {
      this.getData2(options.out_trade_no)
      console.log("走的out_trade_no")
    }
  },

  getData(id) {
    db.collection('orders')
      .where({
        _id:id
      })
      .get()
      .then(res => {
        console.log(res)
        console.log(res.data)
        const getData = res.data.map(item => {
          const pay_time = item.pay_time ? this.formatTime(item.pay_time * 1000) : null;
          const order_time = item.order_time ? this.formatTime(item.order_time) : null;
          return {
            ...item,
            order_time,
            pay_time
          }
        });

        this.setData({
          order: getData[0]
        })
      })
  },

  
  getData2(out_trade_no) {
    db.collection('orders')
      .where({
        out_trade_no: out_trade_no
      })
      .get()
      .then(res => {
        console.log(res)

        const getData = res.data.map(item => {
          const pay_time = item.pay_time ? this.formatTime(item.pay_time * 1000) : null;
          const order_time = item.order_time ? this.formatTime(item.order_time) : null;
          return {
            ...item,
            order_time,
            pay_time
          }
        });

        this.setData({
          order: getData[0]
        })
      })
  },

  pay(e) {
    console.log(e)
    wx.showToast({
      icon: 'loading'
    })
    wx.request({
      url: 'https://company-6gxdqmbcca524546.ap-shanghai.tcbautomation.cn/Automation/Webhook/DirectCallback/100037213044/kbzf_dywh_a2ed295/trigger_z7njwdz3g/HVAeL5xCs4yvcY2j',
      method: 'POST',
      data: {
        "description": e.currentTarget.dataset.p.name,
        "out_trade_no": e.currentTarget.dataset.p.out_trade_no,
        "time_expire": "2033-12-31T23:59:59+08:00",
        "amount": {
          "total": e.currentTarget.dataset.p.money * 100,
          "currency": "CNY"
        },
        "payer": {
          "openid": wx.getStorageSync('openid')
        },
      },
      success: (res) => {
        console.log(res)
        this.paySecond(res.data.data, e.currentTarget.dataset.p._id);
      },
      fail: (error) => {
        console.error(error);
      }
    })
  },

  paySecond(pay, id) {
    wx.requestPayment({
      "timeStamp": pay.timeStamp,
      "nonceStr": pay.nonceStr,
      "package": pay.packageVal,
      "signType": "RSA",
      "paySign": pay.paySign,
      "success": (res) => {
        console.log(res)
        this.pull_up(pay, id)
      },
      "fail": function (res) {
        console.log(res)
      },
      "complete": function (res) {
        console.log(res)
      }
    })
  },

  pull_up(pay, id) {
    db.collection('orders')
      .where({
        _id: id
      })
      .update({
        data: {
          pay: true,
          pay_time: pay.timeStamp,
          send: false
        }
      })
      .then(res => {
        console.log(res)
        this.getData()
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

  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
})