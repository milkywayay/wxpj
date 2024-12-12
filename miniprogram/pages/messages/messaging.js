const db = wx.cloud.database();
let watcher = null;


Page({
  data: {
    phoneNumber_receive: '',
    exchange: false,
    message: '',
    messages: [], // 保存聊天消息的数组
    myPhoneNumber: wx.getStorageSync('phoneNumber'),
    scrollStyle: true,
    avater_send: wx.getStorageSync('avater'),
    unReads: 0,
    beginCount: true,
    inputFocus: false
  },

  preventKeyboardClose(e) {
    const query = wx.createSelectorQuery();
    query.select('#messageInput').boundingClientRect(rect => {
      if (rect) {
        const { top, bottom, left, right } = rect;
        const { clientX, clientY } = e.touches[0];

        // 判断点击位置是否在输入框区域内
        if (
          clientX < left || clientX > right ||
          clientY < top || clientY > bottom
        ) {
          // 如果点击不在输入框内，手动保持焦点
          this.setData({ inputFocus: true });
        }
      }
    }).exec();
  },

  onLoad(options) {
    console.log(options)
    if (options.id) {
      this.getTitleBar(options.id);
    }
    if (options.phoneNumber) {
      this.getTitleBar_phoneNumber(options.phoneNumber)
    }

  },

  onShow() {
    setTimeout(() => {
      this.upDateUnread()
      this.changeReadStatue()
    }, 1000);
  },

  upDateUnread() {
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'), // 我方发送的消息
            phoneNumber_receive: this.data.phoneNumber_receive
          },
          {
            phoneNumber_send: this.data.phoneNumber_receive, // 对方发送的消息
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ]))
      .update({
        data: {
          online: db.command.addToSet(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log(res)
        // this.startWatching2()
      })
  },

  changeReadStatue() {
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'), // 我方发送的消息
            phoneNumber_receive: this.data.phoneNumber_receive
          },
          {
            phoneNumber_send: this.data.phoneNumber_receive, // 对方发送的消息
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ])
      )
      .get()
      .then(res => {
        console.log(res)
        if (res.data[0].online.length == 2) {
          this.gotoZero()
        } else {
          this.beginCount()
        }
      })
  },


  // changeReadStatue() {
  //   db.collection('messages')
  //     .where(
  //       db.command.or([{
  //           phoneNumber_send: wx.getStorageSync('phoneNumber'), // 我方发送的消息
  //           phoneNumber_receive: this.data.phoneNumber_receive
  //         },
  //         {
  //           phoneNumber_send: this.data.phoneNumber_receive, // 对方发送的消息
  //           phoneNumber_receive: wx.getStorageSync('phoneNumber')
  //         }
  //       ]))
  //     .get()
  //     .then(res => {
  //       console.log(res)
  //       if (res.data[0].unReadPhoneNumber == wx.getStorageSync('phoneNumber')) {
  //         db.collection('messages')
  //           .where(
  //             db.command.or([{
  //                 phoneNumber_send: wx.getStorageSync('phoneNumber'), // 我方发送的消息
  //                 phoneNumber_receive: this.data.phoneNumber_receive
  //               },
  //               {
  //                 phoneNumber_send: this.data.phoneNumber_receive, // 对方发送的消息
  //                 phoneNumber_receive: wx.getStorageSync('phoneNumber')
  //               }
  //             ]))
  //           .update({
  //             data: {
  //               unReads: 0
  //             }
  //           })
  //       }
  //     })
  // },

  beginCount() {
    this.setData({
      beginCount: true
    })

    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'), // 我方发送的消息
            phoneNumber_receive: this.data.phoneNumber_receive
          },
          {
            phoneNumber_send: this.data.phoneNumber_receive, // 对方发送的消息
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ]))
      .update({
        data: {
          unReads: this.data.unReads,
          unReadPhoneNumber: this.data.phoneNumber_receive
        }
      })
      .then(res => {
        console.log(res)
      })
  },

  gotoZero() {
    this.setData({
      beginCount: false,
      unReads: 0
    })
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'), // 我方发送的消息
            phoneNumber_receive: this.data.phoneNumber_receive
          },
          {
            phoneNumber_send: this.data.phoneNumber_receive, // 对方发送的消息
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ]))
      .update({
        data: {
          unReadPhoneNumber: '',
          unReads: 0
        }
      })
      .then(res => {
        console.log(res)
      })
  },

  photo() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const type = res.tempFiles[0].fileType
        // 上传图片到云存储
        if (type == "image") {
          wx.cloud.uploadFile({
            cloudPath: `messagePhoto/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}.png`,
            filePath: tempFilePath,
            success: uploadRes => {
              console.log('上传成功', uploadRes.fileID);
              this.sendImageMessage(uploadRes.fileID, type);
            },
            fail: err => {
              console.error('图片上传失败', err);
            }
          });
        } else {
          wx.cloud.uploadFile({
            cloudPath: `messagePhoto/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}.mp4`,
            filePath: tempFilePath,
            success: uploadRes => {
              console.log('上传成功', uploadRes.fileID);
              this.sendImageMessage(uploadRes.fileID, type);
            },
            fail: err => {
              console.error('图片上传失败', err);
            }
          });
        }
      }
    });
  },

  previewImage: function (e) {
    const currentUrl = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentUrl,
      urls: [currentUrl]
    });
  },

  sendImageMessage(fileID, type) {
    if (this.data.beginCount) {
      this.setData({
        unReads: this.data.unReads + 1
      })
      this.beginCount()
      this.remind('[影像]')
    }
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'),
            phoneNumber_receive: this.data.phoneNumber_receive
          },
          {
            phoneNumber_send: this.data.phoneNumber_receive,
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ])
      )
      .update({
        data: {
          chats: db.command.push({
            time: Date.now(),
            phoneNumber_send: wx.getStorageSync('phoneNumber'),
            photo: fileID,
            type: type
          }),
          lastTime:Date.now()
        }
      })
      .then(res => {
        console.log(res)
      })
  },



  getTitleBar_phoneNumber(phoneNumber) {
    db.collection('userlist')
      .where({
        phoneNumber: phoneNumber
      })
      .get()
      .then(Res => {
        console.log(Res);
        this.setData({
          phoneNumber_receive: Res.data[0].phoneNumber,
          avater_receive: Res.data[0].avater,
          openid:Res.data[0]._openid
        });
        wx.setNavigationBarTitle({
          title: Res.data[0].nickName,
        });
        this.getMessages();
        this.startWatching();
      })
  },

  getTitleBar(id) {
    db.collection('discuss')
      .where({
        _id: id
      })
      .get()
      .then(res => {
        const phoneNumber = res.data[0].phoneNumber;
        db.collection('userlist')
          .where({
            phoneNumber: phoneNumber
          })
          .get()
          .then(Res => {
            console.log(Res);
            this.setData({
              phoneNumber_receive: Res.data[0].phoneNumber,
              avater_receive: Res.data[0].avater,
              openid:Res.data[0]._openid,
            });
            wx.setNavigationBarTitle({
              title: Res.data[0].nickName,
            });
            this.getMessages();
            this.startWatching();
          });
      });
  },

  getMessages() {
    this.setData({
      avater_send: wx.getStorageSync('avater'),
      myPhoneNumber: wx.getStorageSync('phoneNumber'),
    })
    db.collection('messages')
      .where(
        db.command.or([{
            phoneNumber_send: wx.getStorageSync('phoneNumber'),
            phoneNumber_receive: this.data.phoneNumber_receive
          },
          {
            phoneNumber_send: this.data.phoneNumber_receive,
            phoneNumber_receive: wx.getStorageSync('phoneNumber')
          }
        ])
      )
      .get()
      .then(res => {
        console.log(res);
        if (res.data.length > 0) {
          const chats = res.data[0].chats.map(item => {
            const time = this.formatTime(item.time)
            return {
              ...item,
              time
            }
          })
          this.setData({
            exchange: true,
            messages: chats,
            toView: 'bottom'
          });
        } else {
          this.setData({
            exchange: false
          });
        }
      });
  },

  message_input(e) {
    this.setData({
      message: e.detail.value,
      messageTemp:e.detail.value
    });
  },

  send() {
    this.setData({ 
      inputFocus: true 
    })
    if (this.data.message) {
      if (this.data.exchange) {
        if (this.data.beginCount) {
          this.setData({
            unReads: this.data.unReads + 1
          })
          this.beginCount()
          this.remind(this.data.messageTemp)
        }
        db.collection('messages')
          .where(
            db.command.or([{
                phoneNumber_send: wx.getStorageSync('phoneNumber'),
                phoneNumber_receive: this.data.phoneNumber_receive
              },
              {
                phoneNumber_send: this.data.phoneNumber_receive,
                phoneNumber_receive: wx.getStorageSync('phoneNumber')
              }
            ])
          )
          .update({
            data: {
              chats: db.command.push({
                message: this.data.message,
                time: Date.now(),
                phoneNumber_send: wx.getStorageSync('phoneNumber'),
              }),
              lastTime:Date.now()
            }
          })
          .then(() => {
            this.clearMessage();
          });
      } else {
        if (this.data.beginCount) {
          this.setData({
            unReads: this.data.unReads + 1
          })
          this.beginCount()
          this.remind()
        }
        db.collection('messages')
          .add({
            data: {
              phoneNumber_send: wx.getStorageSync('phoneNumber'),
              phoneNumber_receive: this.data.phoneNumber_receive,
              chats: [{
                message: this.data.message,
                time: Date.now(),
                phoneNumber_send: wx.getStorageSync('phoneNumber'),
              }],
              online: [],
              lastTime:Date.now()
            }
          })
          .then(() => {
            this.setData({
              exchange: true,
              messages: this.data.messages
            });
            this.clearMessage();
            this.getMessages();
            this.setData({ inputFocus: true }); // 保持焦点
          });
      }
    } else {
      wx.showToast({
        title: '不可发送空内容',
        icon: 'error'
      });
    }
  },

  remind(message) {
    wx.cloud.callFunction({
      name: 'message_remind',
      data: {
        openid: this.data.openid,
        message:message,
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

  clearMessage() {
    this.setData({
      message: ''
    })
  },

  startWatching() {
    watcher = db.collection('messages')
      .where({
        phoneNumber_send: db.command.or(wx.getStorageSync('phoneNumber'), this.data.phoneNumber_receive),
        phoneNumber_receive: db.command.or(wx.getStorageSync('phoneNumber'), this.data.phoneNumber_receive)
      })
      .watch({
        onChange: snapshot => {
          console.log('监听到数据变化', snapshot);
          const change = snapshot.docChanges[0];
          if (change) {
            if (snapshot.docChanges.length > 0) {
              this.getMessages();
            }
            if (change.updatedFields && change.updatedFields.online !== undefined) {
              console.log('online 字段发生了变化', change.updatedFields.online);
              this.changeReadStatue(); // 更新未读消息状态   
            }
          }
        },
        onError: err => {
          console.error('监听出现问题', err);
        }
      });
  },

  // startWatching2() {
  //   watcher2 = db.collection('messages')
  //     .where({
  //       phoneNumber_send: db.command.or(wx.getStorageSync('phoneNumber'), this.data.phoneNumber_receive),
  //       phoneNumber_receive: db.command.or(wx.getStorageSync('phoneNumber'), this.data.phoneNumber_receive)
  //     })
  //     .field({
  //       online: true 
  //     })
  //     .watch({
  //       onChange: snapshot => {
  //         console.log('snapshot:', snapshot);
  //         snapshot.docChanges.forEach(change => {
  //           if (change.updatedFields && change.updatedFields.unRead !== undefined) {
  //             console.log('online 字段发生了变化', change.updatedFields.online);
  //             this.changeReadStatue()
  //           }
  //         });
  //       },
  //       onError: err => {
  //         console.error('监听失败', err);
  //       }
  //     });
  // },

  handleScroll(e) {
    console.log(e)
    this.setData({
      scrollStyle: true
    });
    setTimeout(() => {
      this.setData({
        scrollStyle: false
      });
    }, 2000);
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
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
});