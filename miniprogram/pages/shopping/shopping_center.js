const db=wx.cloud.database()
Page({

  data: {

  },

  onShow(){
    this.getData()
  },

  //cloud://company-6gxdqmbcca524546.636f-company-6gxdqmbcca524546-1326967527/uploads/1729673662880_748.png

  getData(){
    db.collection('commodity')
    .where({
      shelf:true
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        allData:res.data
      })
    })
  },

  view(e){
    console.log(e)
    const id=e.currentTarget.dataset.t._id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shopping/commodity?id='+id,
    })
  },

  search_input(e){
    console.log(e.detail.value)
    this.setData({
      search_word:e.detail.value
    })
  },

  search(){
    if(this.data.search_word){
          wx.navigateTo({
            url: '/pages/shopping/shopping_search?search='+this.data.search_word,
          })
  }
  },




})