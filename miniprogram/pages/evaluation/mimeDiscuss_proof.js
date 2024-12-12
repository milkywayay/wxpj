const db = wx.cloud.database();
Page({
  data: {
    proofs: []
  },

  onLoad(e) {
    const reprintID_inDiscuss = e.id;
    db.collection('reprint')
      .where({
        reprintID_inDiscuss: reprintID_inDiscuss
      })
      .get()
      .then(res => {
        if (res.data.length > 0) {
          this.setData({
            proofs: res.data[0].proofs,
            show:true
          });
        }else{
          wx.showToast({
            title: '暂无转载',
            icon:'error'
          })
        }
      })
      .catch(err => {
        console.error('Database read error:', err);
      });
  }
});