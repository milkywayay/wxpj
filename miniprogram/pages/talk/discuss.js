const db = wx.cloud.database()
Page({
  data: {
    allData: [] // 初始化为空数组
  },

  discuss_detail(e) {
    console.log(e.currentTarget.dataset.d._id)
    wx.navigateTo({
      url: '/pages/talk/discuss_setail?id=' + e.currentTarget.dataset.d._id,
    })
  },

  
  viewFull(event) {
    const index = event.currentTarget.dataset.photo1;
    let urls = this.data.allData.map(item => item.discuss_photo).flat();
    console.log(event)
    wx.previewImage({
      current: index,
      urls: urls
    });
  },

  add() {
    if (wx.getStorageSync('phoneNumber')) {
      wx.navigateTo({
        url: '/pages/talk/add_discuss',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/settings/settings',
        })
      }, 800);
    }
  },

  onShow() {
    this.getData()
  },

  async getData() {
    try {
      // 先获取所有用户数据
      const userRes = await db.collection('userlist').get();
      const userMap = userRes.data.reduce((map, user) => {
        map[user.phoneNumber] = user.nickName;
        return map;
      }, {});

      // 获取讨论数据
      const discussRes = await db.collection('discuss').orderBy('time', 'desc').get();
      const allData = discussRes.data.map(item => {
        const time = this.convertTimestampToReadableString(item.time);
        const nickName = userMap[item.phoneNumber] || 'Unknown';
        return {
          ...item,
          nickName,
          time
        };
      });

      this.setData({
        allData: allData
      });

    } catch (err) {
      console.error('获取数据失败', err);
    }
  },

  convertTimestampToReadableString(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  },
})