const db = wx.cloud.database()
Page({


  data: {

  },


  onLoad(options) {
    this.showData(options.id)
    wx.showShareMenu({
      withShareTicket: true
    });
  },


  showData(id) {
    console.log(id)
    db.collection('commodity')
    .doc(id)
      .get()
      .then(res => {
        console.log(res)
        this.setData({
          showData: res.data
        })
        console.log(this.data.showData)
      })
  },

  order() {
    if (wx.getStorageSync('phoneNumber')) {
      wx.navigateTo({
        url: '/pages/shopping/ordering?id=' + this.data.showData._id,
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/settings/settings',
        })
      }, 100);
    }
  },

  // order() {

  //   if(wx.getStorageSync('phoneNumber')){

  //   const out_trade_no = wx.getStorageSync('phoneNumber') + Date.now()
  //   db.collection('orders')
  //     .add({
  //       data: {
  //         payer_phoneNumber: wx.getStorageSync('phoneNumber'),
  //         payee: this.data.showData.payee,
  //         payee_phoneNumber: this.data.showData.phoneNumber,
  //         name: this.data.showData.commodity_name,
  //         out_trade_no: out_trade_no,
  //         order_time: Date.now(),
  //         payer_openid: wx.getStorageSync('openid'),
  //         payer_nickName: wx.getStorageSync('nickName'),
  //         pay: false,
  //         photo:this.data.showData.imgurl[0],
  //         money:this.data.showData.money
  //       }
  //     })
  //   this.pay(out_trade_no)
  //   }else{
  //     wx.navigateTo({
  //           url: '/pages/settings/settings',
  //         })
  //   }
  // },


  pay(out_trade_no) {
    wx.request({
      url: 'https://company-6gxdqmbcca524546.ap-shanghai.tcbautomation.cn/Automation/Webhook/DirectCallback/100037213044/kbzf_dywh_a2ed295/trigger_z7njwdz3g/HVAeL5xCs4yvcY2j',
      method: 'POST',
      data: {
        "description": this.data.showData.commodity_name,
        "out_trade_no": out_trade_no,
        "time_expire": "2033-12-31T23:59:59+08:00",
        "support_fapiao": "true",
        "amount": {
          "total": parseInt(this.data.showData.money) * 100,
          "currency": "CNY"
        },
        "payer": {
          "openid": "oJF8W7XZKFoxOFFpixfXePuTVF0M"
        },
      },
      success: (res) => {
        console.log(res)
        this.paySecond(res.data.data, out_trade_no);
      },
      fail: (error) => {
        console.error(error);
        wx.navigateTo({
          url: '/pages/orders/orders',
        })
      }
    })
  },

  paySecond(pay, out_trade_no) {
    wx.requestPayment({
      "timeStamp": pay.timeStamp,
      "nonceStr": pay.nonceStr,
      "package": pay.packageVal,
      "signType": "RSA",
      "paySign": pay.paySign,
      "success": (res) => {
        console.log(res)
        this.pull_up(pay, out_trade_no)
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

  pull_up(pay, out_trade_no) {
    db.collection('orders')
      .where({
        out_trade_no: out_trade_no
      })
      .update({
        data: {
          pay_time: pay.timeStamp,
          send: false,
          pay: true
        }
      })
      .then(res => {
        console.log(res)
        wx.navigateTo({
          url: '/pages/orders/detail?out_trade_no=' + out_trade_no,
        })
      })
  },

  share() {
    wx.showModal({
      title: '提示',
      content: '请点击右上角的分享按钮进行分享',
      showCancel: false
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.commodity_name,
      path: '/pages/shopping/commodity?id=' + this.data._id,
      imageUrl: this.data.imageUrl[0]
    };
  },





})