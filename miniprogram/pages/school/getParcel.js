wx.cloud.init()
const db = wx.cloud.database()

Page({

  data: {
    currentTab: 1,
    allDataf: [],
    allDatas: [],
    type: 1
  },
  addParcel() {
    wx.navigateTo({
      url: '/pages/add/addParcel',
    })
  },


  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    })
    if (this.data.currentTab == 1) {
      this.setData({
        type: 1
      })
      this.setData({
        allDataf: []
      })
      this.allNumber(() => {
        this.getinfof()
      })
    }
    if(this.data.currentTab==2){
      this.setData({
        type:2,
        allDataf:[]
      })
      this.allNumber(() => {
        this.getinfof()
      })
    }
    if (this.data.currentTab == 3) {
      this.setData({
        type: 3
      })
      this.setData({
        allDataf: []
      })
      this.allNumber(() => {
        this.getinfof()
      })
    }
  },



  allNumber(callback) {
    db.collection('getParcel')
      .where({
        type: this.data.type
      })
      .count()
      .then(res => {
        console.log(res.total);
        this.setData({
          allNumber: res.total
        });
        // 如果传入了回调函数，则执行回调
        if (callback && typeof callback === 'function') {
          callback();
        }
      })
      .catch(err => {
        console.error(err);
      });
  },

  cencel(e) { //再添加一个确定？按钮
    console.log(e)
    wx.showModal({
      title: '取消后联系开发者退款，确认取消？',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          db.collection('getParcel')
            .where({
              _id: e.currentTarget.dataset.cencel._id
            })
            .update({
              data: {
                type: 4
              }
            })
          this.getinfof()
          wx.showToast({
            title: '已取消该订单',
          })
        }
      }
    })

  },
  //tab1
  getinfof() {
    this.setData({
      allDataf: []
    })
    for (let i = 0; i < this.data.allNumber / 20; i++) {
      db.collection('getParcel')
        .where({
          phoneNumber: wx.getStorageSync('phoneNumber'),
          type: this.data.type
        })
        .skip(i * 20)
        .get()
        .then(res => {
          console.log(res)
          const tempData = res.data.map(item => {
            const time = this.formatTime(item.time)
            return {
              ...item,
              time: time
            }
          })
          const allDataf = this.data.allDataf.concat(tempData)
          allDataf.sort((a, b) => new Date(b.time) - new Date(a.time))
          this.setData({
            allDataf: allDataf
          });
        })
        .catch(err => {
          console.error("Error getting documents", err);
        });
    }

  },

  //tab2
  // getinfos() {


  //   db.collection('getParcel')
  //     .get()
  //     .then(res => {
  //       const allDatas = []
  //       for (let i = 0; i < res.data.length; i++) {
  //         const preAllData = {
  //           time: this.formatTime(res.data[i].time),
  //           phoneNumber: res.data[i].phoneNumber,
  //           parcelValue: res.data[i].parcelValue,
  //           price: 0.5 * (res.data[i].price + 1)
  //         }
  //         allDatas.push(preAllData)
  //       }
  //       this.setData({
  //         allDatas
  //       });
  //       console.log(this.data.allDatas)
  //     });
  // },





  formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    // Use the "yyyy/MM/dd HH:mm:ss" format
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  },


  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.allNumber(() => {
      this.getinfof()
      //this.getinfos()
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})