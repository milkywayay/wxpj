let watcher = null;
const db = wx.cloud.database()
Page({

  data: {
    phoneNumber: ''
  },

  remind() {
    wx.requestSubscribeMessage({
      tmplIds: ['U3YP6v0JiYxthtLfmxAQyZ5SZIIrQ_Zo7IZkGHrqhFU'],
      success(res) {
        console.log(res)
      }
    })
  },


  go_to_talk(e) {
    if (watcher) {
      watcher.close();
    }
    console.log(e)
    const phoneNumber = (e.currentTarget.dataset.p.phoneNumber_send === wx.getStorageSync('phoneNumber')) ? e.currentTarget.dataset.p.phoneNumber_receive : e.currentTarget.dataset.p.phoneNumber_send
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'),
            phoneNumber_receive: phoneNumber
          },
          {
            phoneNumber_receive: wx.getStorageSync('phoneNumber'),
            phoneNumber_send: phoneNumber
          }
        ])
      )
      .get()
      .then(res => {
        if (res.data.length > 0) {
          const messages = this.data.messages; // 获取页面中的消息数组
          const messageIndex = messages.findIndex(msg =>
            (msg.phoneNumber_send === phoneNumber || msg.phoneNumber_receive === phoneNumber)
          );
          if (messageIndex !== -1) {
            messages[messageIndex].unReads = 0;
          }
          this.setData({
            messages: messages
          })
          console.log(res.data[0].chats.length)
          // db.collection('messages')
          console.log(res.data[0].chats[0].phoneNumber_send == wx.getStorageSync('phoneNumber'))
          if (res.data[0].chats.length < 2 && res.data[0].chats[0].phoneNumber_send == wx.getStorageSync('phoneNumber')) {
            wx.navigateTo({
              url: '/pages/messages/wait?phoneNumber=' + phoneNumber,
            })
          } else {
            wx.navigateTo({
              url: '/pages/messages/messaging?phoneNumber=' + phoneNumber,
            })
          }
        }
      })

  },


  attention() {
    wx.showModal({
      title: '提示',
      content: '搜索对象仅为已注册本小程序用户，对方回复前不可自主聊天',
      showCancel: false,
      complete: (res) => {
        if (res.confirm) {

        }
      }
    })
  },

  search_input(e) {
    console.log(e.detail.value)
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  search() {
    const phoneNumber = this.data.phoneNumber
    if (wx.getStorageSync('phoneNumber')) {
      if (this.data.phoneNumber.length == 11) {
        db.collection('userlist')
          .where({
            phoneNumber: this.data.phoneNumber
          })
          .get()
          .then(res => {
            if (res.data.length > 0) {
              if (this.data.phoneNumber == wx.getStorageSync('phoneNumber')) { //搜索对象为自己
                wx.navigateTo({
                  url: '/pages/messages/messaging?phoneNumber=' + this.data.phoneNumber,
                })
              } else { //搜索对象为他人
                db.collection('sellerlist')
                  .where({
                    phoneNumber: this.data.phoneNumber
                  })
                  .count()
                  .then(Res => {
                    if (Res.total > 0) { //商家用户
                      wx.navigateTo({
                        url: '/pages/messages/messaging?phoneNumber=' + this.data.phoneNumber,
                      })
                    } else { //非商家用户
                      db.collection('messages')
                        .where(
                          db.command.or([{
                              phoneNumber_send: wx.getStorageSync('phoneNumber'),
                              phoneNumber_receive: phoneNumber
                            },
                            {
                              phoneNumber_receive: wx.getStorageSync('phoneNumber'),
                              phoneNumber_send: phoneNumber
                            }
                          ])
                        )
                        .get()
                        .then(re => {
                          console.log(re)
                          // console.log(re.data[0].chats.length)
                          if (re.data.length === 0 || (re.data[0].chats.length < 2 && re.data[0].chats[0].phoneNumber_send === wx.getStorageSync('phoneNumber'))) {
                            wx.navigateTo({
                              url: '/pages/messages/wait?phoneNumber=' + phoneNumber,
                            })
                          } else {
                            wx.navigateTo({
                              url: '/pages/messages/messaging?phoneNumber=' + phoneNumber,
                            })
                          }
                        })
                    }
                  })
              }
            } else {
              wx.showToast({
                title: '查无此人',
                icon: 'error'
              })
            }
          })
      } else {
        wx.showToast({
          title: '请输入11位手机号',
          icon: 'error'
        })
      }
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/settings/settings',
        })
      }, 1000);
    }
  },



  onShow(options) {
    // this.get_all_message()
    this.startWatching()
    this.upDateUnread()
    this.allCount()
  },

  get_all_messages() {
    if (this.data.allCount <= 20) {
      db.collection('messages')
        .where(
          db.command.or([{
              phoneNumber_send: wx.getStorageSync('phoneNumber')
            },
            {
              phoneNumber_receive: wx.getStorageSync('phoneNumber')
            }
          ])
        )
        .orderBy('lastTime', 'desc')
        .get()
        .then(res => {
          console.log(res);

          const messagePromises = res.data.map(item => {
            const chats = item.chats;
            const lastChats = chats[chats.length - 1];
            lastChats.seTime = lastChats.time
            lastChats.time = this.formatTime(lastChats.time); // 格式化时间
            lastChats.unReads = item.unReadPhoneNumber == wx.getStorageSync('phoneNumber') ? item.unReads : 0
            const phoneNumber = (item.phoneNumber_send === wx.getStorageSync('phoneNumber')) ? item.phoneNumber_receive : item.phoneNumber_send
            // 返回一个 Promise，等待获取 avater
            console.log(phoneNumber)
            return db.collection('userlist')
              .where({
                phoneNumber: phoneNumber
              })
              .get()
              .then(Res => {
                console.log(Res)
                lastChats.avater = Res.data[0].avater; // 添加 avater
                lastChats.nickName = Res.data[0].nickName
                // lastChats.phoneNumber_receive = (lastChats.phoneNumber_send === wx.getStorageSync('phoneNumber')) ? item.phoneNumber_receive === wx.getStorageSync('phoneNumber') ? item.phoneNumber_receive : item.phoneNumber_send : wx.getStorageSync('phoneNumber')
                lastChats.phoneNumber_receive = phoneNumber
                return lastChats;
              });
          });


          // 使用 Promise.all 来等待所有的查询结束后再更新数据
          Promise.all(messagePromises).then(messages => {
            messages.sort((a, b) => b.seTime - a.seTime);
            this.setData({
              messages: messages
            });
          });
        });
    } else {
      // 用于存储所有分页查询的 Promise
      const allMessagePromises = [];

      // 循环分页获取数据
      for (let t = 0; t < Math.ceil(this.data.allCount / 20); t++) {
        const promise = db.collection('messages')
          .where(
            db.command.or([{
                phoneNumber_send: wx.getStorageSync('phoneNumber')
              },
              {
                phoneNumber_receive: wx.getStorageSync('phoneNumber')
              }
            ])
          )
          .orderBy('lastTime', 'desc')
          .skip(t * 20) // 跳过前 t * 20 条数据
          .limit(20) // 每次获取 20 条数据
          .get()
          .then(res => {
            // 对当前页的所有消息进行处理
            const messagePromises = res.data.map(item => {
              const chats = item.chats;
              const lastChats = chats[chats.length - 1];
              lastChats.seTime = lastChats.time;
              lastChats.time = this.formatTime(lastChats.time); // 格式化时间
              lastChats.unReads = item.unReadPhoneNumber === wx.getStorageSync('phoneNumber') ? item.unReads : 0;
              const phoneNumber = (item.phoneNumber_send === wx.getStorageSync('phoneNumber')) ?
                item.phoneNumber_receive :
                item.phoneNumber_send;

              // 返回一个 Promise，获取用户数据
              return db.collection('userlist')
                .where({
                  phoneNumber
                })
                .get()
                .then(Res => {
                  lastChats.avater = Res.data[0].avater; // 添加头像
                  lastChats.nickName = Res.data[0].nickName; // 添加昵称
                  lastChats.phoneNumber_receive = phoneNumber; // 保存对方手机号
                  return lastChats;
                });
            });

            // 返回当前页的所有消息 Promise
            return Promise.all(messagePromises);
          });

        // 将当前页的 Promise 添加到数组中
        allMessagePromises.push(promise);
      }

      // 等所有分页查询完成后，再合并所有消息
      Promise.all(allMessagePromises).then(results => {
        // 将所有分页结果合并成一个数组
        const allMessages = results.flat();

        // 对消息进行排序
        allMessages.sort((a, b) => b.seTime - a.seTime);

        // 更新到页面数据
        this.setData({
          messages: allMessages
        });
      });
    }

  },

  allCount() {
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber')
          },
          {
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ])
      )
      .count()
      .then(res => {
        console.log(res.total)
        this.setData({
          allCount: res.total
        })
      })

  },

  upDateUnread() {
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber')
          },
          {
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ])
      )
      .update({
        data: {
          online: db.command.pull(wx.getStorageSync('phoneNumber'))
        }
      })
  },


  startWatching() {
    watcher = db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber')
          },
          {
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ])
      )
      .watch({
        onChange: snapshot => {
          console.log('监听到数据变化', snapshot);
          if (snapshot.docChanges.length > 0) {
            console.log(snapshot.docChanges.length)
            console.log(snapshot.docChanges)
            this.get_all_messages()
          }
        },
        onError: err => {
          console.error('监听出现问题', err);
        }
      });
  },

  onUnload() {
    if (watcher) {
      watcher.close();
    }
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }


})