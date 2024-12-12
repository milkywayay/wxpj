const db = wx.cloud.database()
let watcher = null;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    attention: false,
    attentioned: false,
    avater_receive: '',
    avater_send: '',
    attention_qs:false
  },

  onLoad(options) {
    console.log(options.phoneNumber)
    this.getData(options.phoneNumber)
    this.setData({
      phoneNumber_receive:options.phoneNumber
    })
  },

  onShow(){
    this.startWatching()
  },

  attentioned() {
    db.collection('messages')
      .add({
        data: {
          phoneNumber_send: wx.getStorageSync('phoneNumber'),
          phoneNumber_receive: this.data.phoneNumber_receive,
          chats: [{
            "message": "聊天请求",
            "phoneNumber_send": wx.getStorageSync('phoneNumber'),
            "time": Date.now()
          }],
          unReads:1,
          unReadPhoneNumber:this.data.phoneNumber_receive,
          online:[],
          lastTime:Date.now()
        },
      })
      .then(res=>{
        console.log(res)
        this.setData({
          attention_qs:true
        })
        wx.showToast({
          title: '已发送请求',
          icon:'success'
        })
        this.remind()
        setTimeout(() => {
          wx.navigateBack({
            delta:1
          })
        }, 1500);
      })
  },

  attention() {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          attention: db.command.push(this.data.phoneNumber_receive)
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      })

    db.collection('userlist')
      .where({
        phoneNumber: this.data.phoneNumber_receive
      })
      .update({
        data: {
          attentioned: db.command.push(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log('Update success', res);
        this.setData({
          attention: true
        })
      })
      .catch(err => {
        console.error('Update failed', err);
      });
  },

  cancel_attention() {

    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          attention: db.command.pull(this.data.phoneNumber_receive)
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      });






    db.collection('userlist')
      .where({
        phoneNumber: this.data.phoneNumber_receive
      })
      .update({
        data: {
          attentioned: db.command.pull(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log('Update success', res);
        this.setData({
          attention: false
        })
      })
      .catch(err => {
        console.error('Update failed', err);
      });



  },

  getData(phoneNumber) {
    db.collection('userlist')
    .where({
      phoneNumber:phoneNumber
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        openid:res.data[0]._openid
      })
    })

    db.collection('messages')
    .where({
      phoneNumber_send:wx.getStorageSync('phoneNumber'),
      phoneNumber_receive:phoneNumber
    })
    .get()
    .then(res=>{
      if(res.data[0].chats.length==1){
        this.setData({
          attention_qs:true
        })
      }
    })



    db.collection('userlist')
      .where({
        phoneNumber: phoneNumber
      })
      .get()
      .then(res => {
        console.log(res)
        if (res.data && res.data.length > 0) {
          const userData = res.data[0];

          if (Array.isArray(userData.attentioned) && userData.attentioned.includes(wx.getStorageSync('phoneNumber'))) {
            this.setData({
              attention: true
            })
          }

          if (Array.isArray(userData.attention) && userData.attention.includes(wx.getStorageSync('phoneNumber'))) {
            this.setData({
              attentioned: true
            })
          }

          // 设置头像数据
          this.setData({
            avater_receive: userData.avater,
            avater_send: wx.getStorageSync('avater'),
            phoneNumber_receive: phoneNumber
          })
        } else {
          console.error("未找到用户数据")
        }
      })
      .catch(err => {
        console.error("数据库查询错误: ", err)
      })
  },

  go_to_talk() {

    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'),
            phoneNumber_receive: this.data.phoneNumber_receive
          },
          {
            phoneNumber_receive: wx.getStorageSync('phoneNumber'),
            phoneNumber_send: this.data.phoneNumber_receive
          }
        ])
      )
      .get()
      .then(res => {
        if (res.data.length > 0) {
          console.log(res.data[0].chats.length)
          db.collection('messages')
          if (res.data[0].chats.length < 2 && res.data[0].chats[0].phoneNumber_send == wx.getStorageSync('phoneNumber')) {
            console.log('啦啦啦')
          } else {
            wx.reLaunch({
              url: '/pages/messages/messaging?phoneNumber=' + this.data.phoneNumber_receive,
            })
            if (watcher) {
              watcher.close();
            }
          }
        }
      })

  },


  startWatching() {
    watcher = 
    db.collection('messages')
    .where(
      db.command.or([{
          phoneNumber_send: wx.getStorageSync('phoneNumber'),
          phoneNumber_receive: this.data.phoneNumber_receive
        },
        {
          phoneNumber_receive: wx.getStorageSync('phoneNumber'),
          phoneNumber_send: this.data.phoneNumber_receive
        }
      ])
    )
      .watch({
        onChange: snapshot => {
          console.log('监听到数据变化', snapshot);
          const change = snapshot.docChanges[0];
          if (change) {
            if (snapshot.docChanges.length > 0) {
              this.go_to_talk();
            }
          }
        },
        onError: err => {
          console.error('监听出现问题', err);
        }
      });
  },

  remind() {
    wx.cloud.callFunction({
      name: 'message_remind',
      data: {
        openid: this.data.openid,
        message:'向您发来聊天申请',
        nickName: wx.getStorageSync('nickName')
      },
      success: res => {
        console.log('云函数调用成功', res);
      },
      fail: err => {
        console.error('云函数调用失败', err);
      },
      complete: () => {
        console.log('云函数调用已完成');  // 不管成功还是失败都会执行
      }
    });
  },

  


  onUnload() {
    if (watcher) {
      watcher.close();
    }
  }



})