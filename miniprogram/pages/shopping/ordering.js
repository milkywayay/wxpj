const db = wx.cloud.database()
Page({

  data: {
    number: 1
  },

  onLoad(options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
  },

  onShow() {
    this.getAddress()
    this.getCommodity()
  },


  confirm() {
    if(this.data.address){
      const out_trade_no = wx.getStorageSync('phoneNumber') + Date.now()
      db.collection('orders')
        .add({
          data: {
            payer_phoneNumber: wx.getStorageSync('phoneNumber'),
            payee: this.data.commodity.payee,
            payee_phoneNumber: this.data.commodity.phoneNumber,
            name: this.data.commodity.commodity_name,
            out_trade_no: out_trade_no,
            order_time: Date.now(),
            payer_openid: wx.getStorageSync('openid'),
            payer_nickName: wx.getStorageSync('nickName'),
            pay: false,
            photo: this.data.commodity.imgurl[0],
            money: this.data.commodity.money*this.data.number,
            number:this.data.number,
            address_formatted:this.data.address.address_formatted,
            building_house:this.data.address.building_house,
            gender:this.data.address.gender,
            address_phoneNumber:this.data.address.address_phoneNumber,
            address_nickName:this.data.address.address_nickName,
          }
        })
      this.pay(out_trade_no)
    }else{
      wx.showToast({
        title: '请填写地址',
        icon:'error'
      })
    }
  },

  pay(out_trade_no) {
    wx.request({
      url: 'https://company-6gxdqmbcca524546.ap-shanghai.tcbautomation.cn/Automation/Webhook/DirectCallback/100037213044/kbzf_dywh_a2ed295/trigger_z7njwdz3g/HVAeL5xCs4yvcY2j',
      method: 'POST',
      data: {
        "description": this.data.commodity.commodity_name,
        "out_trade_no": out_trade_no,
        "time_expire": "2033-12-31T23:59:59+08:00",
        "support_fapiao": "true",
        "amount": {
          "total": parseInt(this.data.commodity.money) *parseInt(this.data.number) *100,
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

  number(e) {
    console.log(e.detail.value)
    this.setData({
      number: e.detail.value
    })
  },

  change() {
    wx.navigateTo({
      url: '/pages/map/address_library?type=' + "shopping",
    })
  },

  subtract() {
    if (this.data.number > 1) {
      this.setData({
        number: this.data.number - 1
      })
    }
  },

  add() {
    this.setData({
      number: this.data.number + 1
    })
  },


  getAddress() {
    if (wx.getStorageSync('temp_address')) {
      this.setData({
        address: wx.getStorageSync('temp_address')
      })
    } else {
      db.collection('location')
        .where({
          phoneNumber: wx.getStorageSync('phoneNumber'),
          default: true
        })
        .get()
        .then(res => {
          console.log(res)
          if (res.data.length > 0) {
            this.setData({
              address: res.data[0]
            })
          } else {
            this.setData({
              address: false
            })
          }
        })
    }
  },

  getCommodity() {
    db.collection('commodity')
      .doc(this.data.id)
      .get()
      .then(res => {
        console.log(res.data)
        this.setData({
          commodity: res.data
        })
      })
  },

  onHide() {

  },

  onUnload() {
    if (wx.getStorageSync('temp_address')) {
      wx.removeStorageSync('temp_address')
    }
  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})