const db = wx.cloud.database()
Page({

  data: {

  },

  onShow(options) {
    this.getData()

  },

  getData() {
    let collectData = []
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(res.data[0])
        console.log(res.data[0].collect)
        console.log(res.data[0].collect.length)
        let temp = []
        for (let i = 0; i < res.data[0].collect.length; i++) {
          console.log(res.data[0].collect[i])
          const id = res.data[0].collect[i]
          db.collection('discuss')
            .where({
              _id: id
            })
            .get()
            .then(Res => {
              console.log(Res)
              collectData.push(Res.data[0])
              console.log(collectData)
              temp.push(i)
              if (temp.length == res.data[0].collect.length) {
                console.log(temp.length)
                this.getData2(collectData)
              }
            })
        }
      })
  },

  discuss_detail(e) {
    console.log(e.currentTarget.dataset.d._id)
    wx.navigateTo({
      url: '/pages/talk/discuss_setail?id=' + e.currentTarget.dataset.d._id,
    })
  },

  getData2(collectData) {
    const preData = collectData.map(item => {
      console.log(item.time)
      const time = this.convertTimestampToReadableString(item.time)
      return {
        ...item,
        time
      }
    })
    this.setData({
      collectData: preData
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

})