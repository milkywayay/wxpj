const db = wx.cloud.database()
Page({

  data: {

  },

  onShow(options) {
    this.getData()

  },

  getData() {
    let likeData = []
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(res.data[0])
        console.log(res.data[0].like)
        console.log(res.data[0].like.length)
        let temp = []
        for (let i = 0; i < res.data[0].like.length; i++) {
          console.log(res.data[0].like[i])
          const id = res.data[0].like[i]
          db.collection('discuss')
            .where({
              _id: id
            })
            .get()
            .then(Res => {
              console.log(Res)
              likeData.push(Res.data[0])
              console.log(likeData)
              temp.push(i)
              if (temp.length == res.data[0].like.length) {
                console.log(temp.length)
                this.getData2(likeData)
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

  getData2(likeData) {
    const preData = likeData.map(item => {
      console.log(item.time)
      const time = this.convertTimestampToReadableString(item.time)
      return {
        ...item,
        time
      }
    })
    this.setData({
      likeData: preData
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