const db = wx.cloud.database()
Page({

  data: {
    activeTab:0
  },

  onTabClick(e) {
    console.log(e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
    console.log(this.data.activeTab)
  },

  onShow() {
    this.getData()
  },

  getData() {
    db.collection('discuss')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(res)
        const visible_data = res.data.map(item => {
          const time = this.convertTimestampToReadableString(item.time)
          return {
            ...item,
            time
          }
        })
        this.setData({
          visible_data: visible_data
        })
      })
    db.collection('audit')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber'),
        type: "帖子"
      })
      .get()
      .then(res => {
        console.log(res)
        const audit_data = res.data.map(item => {
          const time = this.convertTimestampToReadableString(item.time)
          return {
            ...item,
            time
          }
        })
        this.setData({
          audit_data: audit_data
        })
      })

      db.collection('reprint')
      .where({
        reprinted_phoneNumber:wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res=>{
        console.log(res)
        let promise=res.data.map(item=>{
          // reprintID.push(item.reprintID_inDiscuss)
          console.log(item.reprintID_inDiscuss)
          return db.collection('discuss')
          .doc(item.reprintID_inDiscuss)
          .get()
        })

        Promise.all(promise)
        .then(Res=>{
          console.log(Res)



          const reprinted_data = Res.map(result => {
            const data = result.data;
            console.log(data)
            const time = this.convertTimestampToReadableString(data.time)
            return {
              ...data,
              time
            }
          });
          reprinted_data.sort((a, b) => new Date(b.time) - new Date(a.time))
          this.setData({
            reprinted_data: reprinted_data
          })





        })
      })

  },

  discuss_detail(e) {
    console.log(e.currentTarget.dataset.d._id)
    wx.navigateTo({
      url: '/pages/talk/discuss_setail?id=' + e.currentTarget.dataset.d._id,
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