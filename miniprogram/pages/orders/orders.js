const db = wx.cloud.database()
Page({
  data: {
    activeTab: 0,
    getData: []
  },

 

  detail(e){
    console.log(e.currentTarget.dataset.id._id)
    const id=e.currentTarget.dataset.id._id
    wx.navigateTo({
      url: '/pages/orders/detail?id='+id,
    })
  },
  
  onTabClick(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
    this.getOrders();
  },
  
  onLoad() {
    this.getOrders();
  },
  
  getOrders() {
    db.collection('orders')
      .where({
        payer_phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .orderBy('order_time', 'desc')
      .get()
      .then(res => {
        const getData = res.data.map(item => {
          const pay_time = item.pay_time ? this.formatTime(item.pay_time * 1000) : null;
          const order_time = item.order_time ? this.formatTime(item.order_time) : null;
          return {
            ...item,
            pay_time,
            order_time
          };
        });

        const filteredData = getData.filter(item => {
          if (this.data.activeTab === 1) return !item.pay;
          if (this.data.activeTab === 2) return item.pay && !item.send;
          if (this.data.activeTab === 3) return item.pay && item.send && !item.received;
          if (this.data.activeTab === 4) return item.pay && item.send && item.received;
          return true;
        });

        filteredData.sort((a, b) => {
          const timeA = a.pay_time ? new Date(a.pay_time).getTime() : new Date(a.order_time).getTime();
          const timeB = b.pay_time ? new Date(b.pay_time).getTime() : new Date(b.order_time).getTime();
          return timeB - timeA;
        });

        this.setData({
          getData: filteredData
        });
      });
  },

  delete(e) {
    const id = e.currentTarget.dataset.id;
    db.collection('orders')
      .doc(id)
      .remove()
      .then(res => {
        if (res.stats.removed === 1) {
          const updatedData = this.data.getData.filter(item => item._id !== id);
          this.setData({
            getData: updatedData
          });
        }
      });
  },


  cancel(e) {
    const id = e.currentTarget.dataset.id._id; // 获取订单ID
    wx.showModal({
      title: '确认取消',
      content: '',
      complete: (res) => {
        if (res.confirm) { // 确认取消
          db.collection('orders')
            .doc(id)
            .remove()
            .then(res => {
              if (res.stats.removed === 1) { // 如果成功移除订单
                const updatedData = this.data.getData.filter(item => item._id !== id);
                this.setData({
                  getData: updatedData
                });
                wx.showToast({
                  title: '取消成功',
                  icon: 'success'
                });
              }
            })
            .catch(err => {
              console.error(err);
              wx.showToast({
                title: '取消失败',
                icon: 'none'
              });
            });
        }
      }
    });
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
        this.paySecond(res.data.data,e.currentTarget.dataset.p._id);
      },
      fail: (error) => {
        console.error(error);
      }
    })
  },

  paySecond(pay,id) {
    wx.requestPayment({
      "timeStamp": pay.timeStamp,
      "nonceStr": pay.nonceStr,
      "package": pay.packageVal,
      "signType": "RSA",
      "paySign": pay.paySign,
      "success": (res) => {
        console.log(res)
        this.pull_up(pay,id)
      },
      "fail": function (res) {
        console.log(res)
      },
      "complete": function (res) {
        console.log(res)
      }
    })
  },

  pull_up(pay,id) {
    db.collection('orders')
    .where({
      _id:id
    })
    .update({
      data:{
        pay:true,
        pay_time:pay.timeStamp,
        send:false
      }
    })
    .then(res=>{
      console.log(res)
      wx.navigateTo({
        url: '/pages/orders/detail?id='+id,
      })
    })
  },

  received(e){
    console.log(e.currentTarget.dataset.id._id)
    const id=e.currentTarget.dataset.id._id
    db.collection('orders')
    .where({
      _id:id
    })
    .update({
      data:{
        received:true,
        received_time:Date.now()
      }
    })
    .then(res=>{
      console.log(res)
      wx.showToast({
        title: '已收货',
        icon:'success'
      })
      this.getOrders()
    })
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
});