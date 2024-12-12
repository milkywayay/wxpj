const app = getApp()
const db = wx.cloud.database()
Page({
  tomap() {
    wx.navigateTo({
      url: '../map/map'
    })
  },

  onShareAppMessage() {
    return {
      title: '多寰科技',
      imageUrl: 'cloud://company-6gxdqmbcca524546.636f-company-6gxdqmbcca524546-1326967527/LOGO.jpg'
    }
  },

  onShareTimeline(){
    return{
      title: '多寰科技',
      imageUrl: 'cloud://company-6gxdqmbcca524546.636f-company-6gxdqmbcca524546-1326967527/LOGO.jpg'
    }
  },

  school_sever() {
    wx.navigateTo({
      url: '/pages/school/school_sever',
    })
  },

  onLoad(e) {
    this.getOpenid()
    console.log(e)
    if (e.price) {
      const a = e.price
      console.log(a)
      if (a.includes("西域佰草")) {
        console.log("发现西域佰草，执行支付操作");
        this.pay(a)
      } else {
        console.log("未发现西域佰草");
      }
    }
  },

  onShow() {
    this.getOpenid()
  },

  booking() {
    if (wx.getStorageSync('phoneNumber')) {
      wx.navigateTo({
        url: '/pages/booking/booking',
      })
    } else {
      wx.navigateTo({
        url: '/pages/settings/settings',
      })
    }
  },

  judge() {
    wx.navigateTo({
      url: '/pages/judge/judge',
    })
  },

  getOpenid() {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(res)
        console.log(wx.getStorageSync('phoneNumber'))
        console.log('运行openid')
        wx.setStorageSync('openid', res.data[0]._openid)
        wx.setStorageSync('id', res.data[0]._id)
      })
  },

  tea() {
    wx.navigateToMiniProgram({
      appId: 'wx7406615f500240a4',
      path: 'pages/index/index?id=' + 123,
      envVersion: 'develop'
    })
  },

  pay(price) {
    const numbers = price.match(/\d+/g);
    const pay_money = parseInt(numbers.join(''), 10);
    this.setData({
      pay_money: pay_money * 100
    })
    console.log(pay_money)
    const out_trade_no = wx.getStorageSync('phoneNumber') + Date.now()
    wx.showToast({
      icon: 'loading'
    })
    wx.request({
      url: 'https://company-6gxdqmbcca524546.ap-shanghai.tcbautomation.cn/Automation/Webhook/DirectCallback/100037213044/kbzf_dywh_a2ed295/trigger_z7njwdz3g/HVAeL5xCs4yvcY2j',
      method: 'POST',
      data: {
        "description": "藿香玫瑰茶",
        "out_trade_no": out_trade_no,
        "time_expire": "2033-12-31T23:59:59+08:00",
        "support_fapiao": "true",
        "amount": {
          "total": pay_money * 100,
          "currency": "CNY"
        },
        "payer": {
          "openid": wx.getStorageSync('openid')
        },
      },
      success: (res) => {
        this.setData({
          out_trade_no: out_trade_no
        })
        console.log(res)
        this.paySecond(res.data.data);
      },
      fail: (error) => {
        console.error(error);
      }
    })

  },

  paySecond(pay) {
    wx.requestPayment({
      "timeStamp": pay.timeStamp,
      "nonceStr": pay.nonceStr,
      "package": pay.packageVal,
      "signType": "RSA",
      "paySign": pay.paySign,
      "success": (res) => {
        console.log(res)
        this.pull_up(pay)
      },
      "fail": function (res) {
        console.log(res)
      },
      "complete": function (res) {
        console.log(res)
      }
    })
  },

  pull_up(pay) {
    db.collection('orders')
      .add({
        data: {
          pay_time: pay.timeStamp,
          name: '藿香玫瑰茶',
          money: this.data.pay_money,
          payer_phoneNumber: wx.getStorageSync('phoneNumber'),
          payer_openid: wx.getStorageSync('openid'),
          payer_nickName: wx.getStorageSync('nickName'),
          payee: '昆明茶在疆途商贸有限公司',
          payee_phoneNumber:'15936829256',
          out_trade_no: this.data.out_trade_no,
          send:false
        }
      })
    //跳转至订单页面
  },

  shopping(){
    // if(wx.getStorageSync('phoneNumber')){
    wx.navigateTo({
      url: '/pages/shopping/shopping_center',
    })
  // }else{
  //   wx.navigateTo({
  //     url: '/pages/settings/settings',
  //   })
  // }
  },

  call(){
    wx.navigateTo({
      url: '/pages/developer/call',
    })
  },






  // test() {
  //   wx.cloud.callFunction({
  //     name: 'get_token',
  //   }).then(res => {
  //     console.log(res);
  //     console.log(res.result);
  //     const access_token = res.result.access_token
  //     this.setData({
  //       access_token: access_token
  //     });
  //     this.test1(access_token)
  //   }).catch(err => {
  //     console.error('调用云函数失败', err);
  //   });

  // },

  // getFormattedDate(date) {
  //   const timezoneOffset = -date.getTimezoneOffset(); 
  //   const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
  //   const offsetMinutes = Math.abs(timezoneOffset) % 60;
  //   const offsetSign = timezoneOffset >= 0 ? '+' : '-';
  //   const isoString = date.toISOString();
  //   const dateWithoutZ = isoString.slice(0, -1);
  //   const timezoneString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
  //   const formattedDate = `${dateWithoutZ}${timezoneString}`;
  //   return formattedDate;
  // },

  // test1(access_token) {
  //   wx.cloud.callFunction({
  //     name: 'order',
  //     data: {
  //       access_token: access_token,
  //       order_key: {
  //         order_number_type: 1,
  //         mchid: 1678760307,
  //         out_trade_no:'183305294721718184549428'//变量
  //       },
  //       logistics_type: 4,
  //       delivery_mode: 1,
  //       shipping_list: [{
  //         item_desc: '商品信息'
  //       }],
  //       upload_time: this.getFormattedDate(new Date()),
  //       payer: {
  //         openid: wx.getStorageSync('openid')
  //       }
  //     }
  //   }).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.error(err);
  //   });
  // }


})