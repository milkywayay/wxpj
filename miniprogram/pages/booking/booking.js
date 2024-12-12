const db = wx.cloud.database()
Page({

  data: {
    index: 0,
    choose: 1,
    show: Array.from({
      length: 7
    }, () => false),
    tempShow:Array.from({
      length: 7
    }, () => false),
    myShow:Array.from({
      length: 7
    }, () => false)
  },

  confirm() {
    if (this.data.date&&this.data.office_name) {
      db.collection('booking')
        .where({
          date: this.data.date,
          choose: parseInt(this.data.choose),
          office_name:this.data.office_name[this.data.index]
        })
        .get()
        .then(res => {
          console.log(res)
          if (res.data.length > 0) {
            wx.showToast({
              title: '该时间已被预约',
              icon: 'error'
            })
            setTimeout(() => {
              this.showData()
            }, 1500)
          } else {
            db.collection('booking')
              .where({
                date: this.data.date,
                phoneNumber: wx.getStorageSync('phoneNumber'),
              })
              .get()
              .then(res => {
                if (res.data.length > 0) {
                  wx.showToast({
                    title: '您该日已预约',
                    icon: 'error'
                  })
                } else {
                  db.collection('booking')
                    .add({
                      data: {
                        date: this.data.date,
                        choose: parseInt(this.data.choose),
                        nickName: wx.getStorageSync('nickName'),
                        phoneNumber: wx.getStorageSync('phoneNumber'),
                        type: '办公预约',
                        office_name:this.data.office_name[this.data.index]
                      }
                    })
                  wx.showToast({
                    title: '预约成功',
                    icon: 'success',
                    duration: 800
                  });
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 800);
                }
              })
          }
        })
    } else {
      wx.showToast({
        title: '请选择办公室和日期',
        icon: 'none'
      })
    }
  },


  choose(e) {
    console.log(e.currentTarget.dataset.s);
    const choose = e.currentTarget.dataset.s;
    let tempShow= Array.from({ length: 7 }, () => false)
    tempShow[choose]=true
    this.setData({
      choose: choose,
      tempShow:tempShow
    });
  },

  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    });
    this.showData(e.detail.value)
  },


  showData(d) {
    let show = []
    let myShow=[]
    db.collection('booking')
      .where({
        date: d,
        office_name:this.data.office_name[this.data.index]
      })
      .get()
      .then(res => {
        console.log(res)
        res.data.forEach(item => {
          show[item.choose] = true
          if(item.phoneNumber==wx.getStorageSync('phoneNumber')){
            myShow[item.choose]=true
          }
        })
        this.setData({
          show: show,
          myShow:myShow
        })
      })
  },



  bindOfficeChange(e) {

    console.log(this.data.office_name[e.detail.value])
    this.setData({
      index: e.detail.value
    })

    this.showData()
  },

  onLoad(options) {

  },



  onReady() {

  },


  onShow() {
    this.getOfficeData()
  },

  getOfficeData() {
    let office_name=[]
    db.collection('office')
    .get()
    .then(res=>{
      console.log(res)
      res.data.forEach(item=>{
        office_name.push(item.office_name)
      })
      this.setData({
        office_name:office_name
      })
    })
  },

  add_office() {
    wx.navigateTo({
      url: '/pages/booking/add_office',
    })
  },
})