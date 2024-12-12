const db = wx.cloud.database()
Page({


  data: {

  },

  confirm() {
    db.collection('audit')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(res)
        console.log(res.data.length)
        if (res.data.length == 0) {
          db.collection('audit')
            .add({
              data: {
                phoneNumber: wx.getStorageSync('phoneNumber'),
                type: "管理员",
                audit:false
              }
            })
            wx.showToast({
              title: '已提交',
              icon:'success'
            })
        }else{
          wx.showToast({
            title: '您已提交申请',
            icon:'error'
          })
        }
      })

  },












})