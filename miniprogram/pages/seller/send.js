const db=wx.cloud.database()
Page({


  data: {

  },

  onLoad(options) {
    this.getInfo()
  },

  getInfo() {
    db.collection('orders')
      .where({
        payee_phoneNumber: wx.getStorageSync('phoneNumber'),
        send: false
      })
      .get()
      .then(res => {
        console.log(res)
        if(res.data.length>0){
          const allData=res.data.map(item=>{
            const pay_time=this.formatTime(item.pay_time*1000)
            return{
              ...item,
              pay_time
            }
          })
          allData.sort((a, b) => new Date(b.time) - new Date(a.time))
        this.setData({
          allData: allData
        })
      }else{
        wx.showToast({
          title: '没有发货请求',
          icon:'error'
        })
      }
      })
  },

  send(e) {
    console.log(e.currentTarget.dataset.s)
    const out_trade_no = e.currentTarget.dataset.s.out_trade_no
    const item_desc = e.currentTarget.dataset.s.name
    this.send2(out_trade_no, item_desc)
  },
  send2(out_trade_no, item_desc) {
    wx.cloud.callFunction({
      name: 'get_token',
    }).then(res => {
      console.log(res);
      console.log(res.result);
      const access_token = res.result.access_token
      this.setData({
        access_token: access_token
      });
      this.send3(access_token, out_trade_no, item_desc)
    }).catch(err => {
      console.error('调用云函数失败', err);
    });

  },
  send3(access_token, out_trade_no, item_desc) {
    wx.cloud.callFunction({
      name: 'order',
      data: {
        access_token: access_token,
        order_key: {
          order_number_type: 1,
          mchid: 1678760307,
          out_trade_no: out_trade_no
        },
        logistics_type: 4,
        delivery_mode: 1,
        shipping_list: [{
          item_desc: item_desc
        }],
        upload_time: this.getFormattedDate(new Date()),
        payer: {
          openid: wx.getStorageSync('openid')
        }
      }
    }).then(res => {
      console.log(res)
      db.collection('orders')
        .where({
          out_trade_no: out_trade_no
        })
        .update({
          data: {
            send: true
          }
        })
        .then(res => {
          console.log(res)
          this.getInfo()
          wx.showToast({
            title: '发货成功',
            icon: 'success'
          })
        })
    }).catch(err => {
      console.error(err);
    });
  },
  getFormattedDate(date) {
    const timezoneOffset = -date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const isoString = date.toISOString();
    const dateWithoutZ = isoString.slice(0, -1);
    const timezoneString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
    const formattedDate = `${dateWithoutZ}${timezoneString}`;
    return formattedDate;
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