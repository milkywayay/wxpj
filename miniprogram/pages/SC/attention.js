const db = wx.cloud.database()
Page({
  data: {
    activeTab: 0,
    attention: [],
    attentioned: [],
    attentions: [],
    attentioneds: []
  },

  onTabClick(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
    console.log(this.data.activeTab)
  },

  onLoad(options) {
    this.getData()
  },

  getData() {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(res)
        this.setData({
          attention: res.data[0].attention,   // 关注的人
          attentioned: res.data[0].attentioned // 被关注的人
        })
        this.getData2()  // 获取关注和被关注者的头像和昵称
      })
  },

  getData2() {
    const attention = this.data.attention;
    const attentioned = this.data.attentioned;

    // 遍历 attention 数组，获取每个 phoneNumber 的 avatar 和 nickName
    if (attention.length > 0) {
      attention.forEach(phone => {
        db.collection('userlist')
          .where({
            phoneNumber: phone
          })
          .get()
          .then(res => {
            if (res.data.length > 0) {
              const user = res.data[0];
              this.setData({
                attentions: [...this.data.attentions, { avater: user.avater, nickName: user.nickName }]
              });
            }
          });
      });
    }

    // 遍历 attentioned 数组，获取每个 phoneNumber 的 avatar 和 nickName
    if (attentioned.length > 0) {
      attentioned.forEach(phone => {
        db.collection('userlist')
          .where({
            phoneNumber: phone
          })
          .get()
          .then(res => {
            if (res.data.length > 0) {
              const user = res.data[0];
              this.setData({
                attentioneds: [...this.data.attentioneds, { avater: user.avater, nickName: user.nickName }]
              });
            }
          });
      });
    }
  },

  onReady() { },

  onShow() { },

  onHide() { },

  onUnload() { },

  onPullDownRefresh() { },

  onReachBottom() { },

  onShareAppMessage() { }
})