const db=wx.cloud.database()
Page({

  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
this.getScore()
  },

  getScore(){
    db.collection('judge')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .count()
    .then(re=>{
      console.log(re.total)
      for (let i = 0; i < re.total / 20; i++) {
        db.collection('judge')
        .where({
          phoneNumber:wx.getStorageSync('phoneNumber')
        })
        .skip(i * 20)
        .get()
        .then(res=>{
          console.log(res)
          const scores=res.data.map(item=>{
            const judge_time=this.formatTime(item.judge_time)
            return{
              ...item,
              judge_time
            }
          })
          scores.sort((a, b) => new Date(b.judge_time) - new Date(a.judge_time))
          this.setData({
            scores:scores
          })
        })

      }
    })
   
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}/${month}/${day} ${hour}:${minute}`;
  }
})