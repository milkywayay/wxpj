const db = wx.cloud.database()
Page({

  data: {

  },

  office_name_input(e) {
    console.log(e.detail.value)
    this.setData({
      office_name: e.detail.value
    })
  },


  office_charge_name_input(e) {
    console.log(e.detail.value)
    this.setData({
      office_charge_name: e.detail.value
    })
  },





  confirm() {
    if (this.data.office_name && this.data.office_charge_name) {
      db.collection('audit')
        .where({
          phoneNumber: wx.getStorageSync('phoneNumber'),
          office_name: this.data.office_name
        })
        .get()
        .then(res => {
          console.log(res)
          if (res.data.length > 0) {
            wx.showToast({
              title: '您已提交申请',
              icon: 'none'
            })
          } else {
            db.collection('office')
              .where({
                office_name: this.data.office_name
              })
              .get()
              .then(Res => {
                if (Res.data.length > 0) {
                  wx.showToast({
                    title: '该办公室已存在',
                    icon: 'none'
                  })
                } else {
                  this.pay()
                }
              })
          }
        })

    } else {
      wx.showToast({
        title: '请输入完全',
        icon: 'error'
      })
    }

    
  },

  order(){
    const out_trade_no = wx.getStorageSync('phoneNumber') + Date.now()
    db.collection('orders')
    .add({
      data: {
        out_trade_no: out_trade_no,
        order_time: Date.now(),
        money: 3,
        name: '办公室预约',
        payee: '上海多寰文化科技有限公司',
        payee_phoneNumber: '18330529472',
        payer_nickName: wx.getStorageSync('nickName'),
        payer_openid: wx.getStorageSync('openid'),
        payer_phoneNumber: wx.getStorageSync('phoneNumber'),
        pay:false,
        photo:'cloud://company-6gxdqmbcca524546.636f-company-6gxdqmbcca524546-1326967527/me/办公室预约.png'
      }
    })
    this.pay(out_trade_no)
  },


  pay(out_trade_no) {
    wx.showToast({
      icon: 'loading'
    })
    wx.request({
      url: 'https://company-6gxdqmbcca524546.ap-shanghai.tcbautomation.cn/Automation/Webhook/DirectCallback/100037213044/kbzf_dywh_a2ed295/trigger_z7njwdz3g/HVAeL5xCs4yvcY2j',
      method: 'POST',
      data: {
        "description": "办公室月费",
        "out_trade_no": out_trade_no,
        "time_expire": "2033-12-31T23:59:59+08:00",
        "support_fapiao": "true",
        "amount": {
          "total": 300,
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

  pull_up(pay,out_trade_no) {
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
    db.collection('audit')
      .add({
        data: {
          phoneNumber: wx.getStorageSync('phoneNumber'),
          office_name: this.data.office_name,
          office_charge_name: this.data.office_charge_name,
          type: "办公室审核",
          date: Date.now(),
          audit:false
        }
      })
    wx.showToast({
      title: '已提交',
      icon: 'success'
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/orders/orders',
      })
    }, 500);
  },







})