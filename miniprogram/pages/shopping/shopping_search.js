const db = wx.cloud.database()
Page({

  data: {

  },

  
  search_input(e) {
    console.log(e.detail.value)
    this.setData({
      search_word: e.detail.value
    })
  },

  getData(s){
    db.collection('commodity')
    .where({
      commodity_name: db.RegExp({
        regexp: s,
        options: 'i' // 不区分大小写
      })
    })
    .get()
    .then(res => {
      console.log(res.data);
      this.setData({
        allData: res.data
      })
    })
  },


  onLoad: function (options) {
    console.log(options.search)
    this.setData({
      search_word: options.search
    })
    this.getData(options.search)
   
  },

  view(e) {
    console.log(e)
    const id = e.currentTarget.dataset.t._id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shopping/commodity?id=' + id,
    })
  },


  search() {
    if (this.data.search_word) {
      this.getData(this.data.search_word)
    }
  },





})