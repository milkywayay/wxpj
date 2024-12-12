const db = wx.cloud.database()
Page({


  data: {
    showModal: false,
    inputValue: ''
  },

  message() {
    if (wx.getStorageSync('phoneNumber')) {
      wx.navigateTo({
        url: '/pages/messages/messaging?id=' + this.data.id,
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
      }, 1000);
    }
  },


  question() {
    wx.showModal({
      title: '如何获取佣金',
      content: '转载后，在“我——我的转载”上传凭证并获取佣金\n点击下方转载图标，以查看详情',
      showCancel: false,
      complete: (res) => {
        if (res.confirm) {
          //对一级广告发起通知

        }
      }
    })
  },

  reprint() {
    wx.showModal({
      title: '确认信息',
      content: '将本页的文本图片保存/截屏后自行发布至各平台,点击<确定>录入转载记录',
      complete: (res) => {
        if (res.confirm) {
          if (wx.getStorageSync('phoneNumber') == this.data.info.phoneNumber) {
            wx.showToast({
              title: '不可本人转载',
              icon: 'error'
            })
          } else {
            db.collection('reprint')
              .where({
                reprintID_inDiscuss: this.data.info._id,
                reprint_phoneNumber: wx.getStorageSync('phoneNumber')
              })
              .get()
              .then(res => {
                if (res.data.length > 0) {
                  wx.showToast({
                    title: '您已转载',
                    icon: 'error'
                  })
                } else {
                  db.collection('reprint')
                    .add({
                      data: {
                        reprintID_inDiscuss: this.data.info._id,
                        reprint_phoneNumber: wx.getStorageSync('phoneNumber'),
                        reprinted_phoneNumber: this.data.info.phoneNumber
                      }
                    })
                    .then(res => {
                      console.log(res)
                      wx.navigateTo({
                        url: '/pages/talk/discuss/evaluation/detail?id=' + this.data.info._id,
                      })
                    })
                }
              })
          }
        }
      }
    })
  },



  // 进行“关注”操作
  attention1() {
    db.collection('discuss')
      .where({
        _id: this.data.id
      })
      .update({
        data: {
          attention: this.data.info.attention_number + 1
        }
      })
    this.setData({
      attention: true,
      'info.attention': this.data.info.attention_number + 1
    })



    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          attention: db.command.push(this.data.info.phoneNumber)
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
        phoneNumber: this.data.info.phoneNumber
      })
      .update({
        data: {
          attentioned: db.command.push(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      });
  },

  // 进行“取消关注”操作
  attention2() {
    db.collection('discuss')
      .where({
        _id: this.data.id
      })
      .update({
        data: {
          attention: this.data.info.attention_number - 1
        }
      })
    this.setData({
      attention: false,
      'info.attention': this.data.info.attention_number - 1
    })




    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          attention: db.command.pull(this.data.info.phoneNumber)
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
        phoneNumber: this.data.info.phoneNumber
      })
      .update({
        data: {
          attentioned: db.command.pull(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      });



  },



  //进行“喜欢”操作
  like1() {
    this.setData({
      like: true
    })

    //对自己的数据库进行操作
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          like: db.command.push(this.data.info._id)
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      });




    //对对方对数据库进行操作

    db.collection('discuss')
      .where({
        _id: this.data.info._id
      })
      .update({
        data: {
          liked: db.command.push(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      });
  },


  //进行“取消喜欢”操作
  like2() {
    this.setData({
      like: false
    })


    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          like: db.command.pull(this.data.info._id)
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      })



    db.collection('discuss')
      .where({
        _id: this.data.info._id
      })
      .update({
        data: {
          liked: db.command.pull(this.data.info.phoneNumber)
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      })


  },

  //进行“收藏”操作
  collect1() {
    this.setData({
      collect: true
    })


    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          collect: db.command.push(this.data.info._id)
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      })


    db.collection('discuss')
      .where({
        _id: this.data.info._id
      })
      .update({
        data: {
          collected: db.command.push(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      })




  },


  //进行“取消收藏”操作
  collect2() {
    this.setData({
      collect: false
    })

    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .update({
        data: {
          collect: db.command.pull(this.data.info._id)
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      })



    db.collection('discuss')
      .where({
        _id: this.data.info._id
      })
      .update({
        data: {
          collected: db.command.pull(wx.getStorageSync('phoneNumber'))
        }
      })
      .then(res => {
        console.log('Update success', res);
      })
      .catch(err => {
        console.error('Update failed', err);
      })

  },


  onLoad(options) {
    console.log(options)
    this.getData(options.id)
    this.setData({
      id: options.id
    })
    this.if_mine(options.id)
  },

  if_mine(id) {
    db.collection('discuss')
      .where({
        _id: id
      })
      .get()
      .then(res => {
        console.log(res)
        if (res.data[0].phoneNumber == wx.getStorageSync('phoneNumber'))
          this.setData({
            mine: true
          })
      })
  },

  mine() {
    wx.navigateTo({
      url: '/pages/evaluation/mimeDiscuss_proof?id=' + this.data.id,
    })
  },


  viewFull(event) {
    const index = event.currentTarget.dataset.photo;
    // let urls = this.data.allData.map(item => item.discuss_photo).flat();
    let urls = this.data.info.discuss_photo
    console.log(event)
    wx.previewImage({
      current: index,
      urls: urls
    });
  },






  get_if_attention(phoneNumber) {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        if (res.data[0].attention.includes(phoneNumber)) {
          this.setData({
            attention: true
          })
        } else {
          this.setData({
            attention: false
          })
        }
      })
  },

  get_if_like_collect(id) {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        if (res.data[0].like.includes(id)) {
          this.setData({
            like: true
          })
        } else {
          this.setData({
            like: false
          })
        }
        if (res.data[0].collect.includes(id)) {
          this.setData({
            collect: true
          })
        } else {
          this.setData({
            collect: false
          })
        }

      })
  },




  convertTimestampToReadableString: function (timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },



  showModal() {
    this.setData({
      showModal: true
    });
  },

  hideModal() {
    this.setData({
      showModal: false
    });
  },

  preventHide() {
    // 阻止事件冒泡，不需要任何操作，只需要这个方法存在
  },

  handleInput(e) {
    this.setData({
      comment: e.detail.value
    });
  },


  getData(id) {
    db.collection('discuss')
      .where({
        _id: id
      })
      .get()
      .then(res => {
        console.log(res)
        this.get_if_attention(res.data[0].phoneNumber)
        this.get_if_like_collect(res.data[0]._id)
        const time = this.convertTimestampToReadableString(res.data[0].time)
        db.collection('userlist')
          .where({
            phoneNumber: res.data[0].phoneNumber
          })
          .get()
          .then(Res => {
            console.log(Res)
            const nickName = Res.data[0].nickName
            const avater=Res.data[0].avater
            const info = {
              ...res.data[0],
              nickName,
              time,
              avater
            }
            this.setData({
              info: info
            })
            console.log(info)
          })

      })
  },

  confirm1() {
    console.log('输入的内容:', this.data.comment);
    this.hideModal();
    db.collection('discuss')
      .where({
        _id: this.data.id
      })
      .update({
        data: {
          coment: {
            comment_phoneNumber: wx.getStorageSync('phoeNumber'),
            comment_nickName: wx.getStorageSync('nickName'),
            comment_avater: wx.getStorageSync('avater'),
            comment_word: this.data.comment,
            type: '1'
          }
        }
      })
  },





})