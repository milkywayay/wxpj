const db = wx.cloud.database()
Page({

  data: {

  },

  onLoad(options) {
    console.log(options.id)
    this.getData(options.id)
    this.setData({
      reprintID_inDiscuss: options.id
    })
  },

  getData(id) {
    db.collection('discuss')
      .where({
        _id: id
      })
      .get()
      .then(res => {
        console.log(res)
        const time = this.convertTimestampToReadableString(res.data[0].time)
        const info = {
          ...res.data[0],
          time: time
        }
        this.setData({
          info: info
        })
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

  submit() {
    wx.navigateTo({
      url: '/pages/talk/discuss/evaluation/proof?reprintID_inDiscuss=' + this.data.reprintID_inDiscuss,
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

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
})