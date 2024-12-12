const db = wx.cloud.database()
Page({

  data: {

  },


  onLoad(options) {
    this.getData()
  },

  getData() {
    db.collection('reprint')
      .where({
        reprint_phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        let reprintID_list = []
        console.log(res)
        res.data.forEach(item => {
          console.log(item.reprintID_inDiscuss)
          reprintID_list.push(item.reprintID_inDiscuss)
        })
  
        // 去重ID列表
        reprintID_list = [...new Set(reprintID_list)];
  
        let promise = reprintID_list.map(id => {
          return db.collection('discuss')
            .doc(id)
            .get()
        })
        Promise.all(promise)
          .then(Res => {
            console.log(Res)
            const allData = Res.map(result => {
              const data = result.data;
              console.log(data)
              const time = this.convertTimestampToReadableString(data.time)
              return {
                ...data,
                time
              }
            });
            allData.sort((a, b) => new Date(b.time) - new Date(a.time))
            this.setData({
              allData: allData
            })
          })
      })
  },

  detail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/talk/discuss/evaluation/detail?id=' + e.currentTarget.dataset.d._id,
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
  },





})