const db=wx.cloud.database()
Page({

  data: {
    imgurl: []
  },

  commodity_name(e){
    console.log(e.detail.value)
    this.setData({
      commodity_name:e.detail.value
    })
  },

  commodity_brief(e){
    console.log(e.detail.value)
    this.setData({
      commodity_brief:e.detail.value
    })
  },

  money(e){
    console.log(e.detail.value)
    this.setData({
      money:e.detail.value
    })
  },


  photo(){
      let that = this;
      if (this.data.imgurl.length < 9) {
        wx.chooseMedia({
          count: 9 - this.data.imgurl.length, 
          mediaType: ['image', 'video'],
          sourceType: ['album', 'camera'],
          maxDuration: 30,
          camera: 'back',
          success(res) {
            console.log("选择的图片/视频", res);
            wx.showToast({
              title: '正在加载',
              duration: 3000,
              icon: "loading"
            });
            // 使用 Promise.all 处理所有上传操作
            let uploadPromises = res.tempFiles.map(file => {
              return wx.cloud.uploadFile({
                cloudPath:'me/commodity/' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000) + '.png', // 避免重复文件名
                filePath: file.tempFilePath,
              });
            });
  
            Promise.all(uploadPromises).then(results => {
              let newImgurl = that.data.imgurl.concat(results.map(res => res.fileID)); // Add all new fileIDs to the array
              that.setData({
                imgurl: newImgurl,
                have_imgurl:true
              });
              console.log("添加成功", that.data.imgurl);
            }).catch(error => {
              console.error("上传失败", error);
            });
          }
        })
      }
  },

  viewFull(event) {
    console.log(event)
    const index = event.target.dataset.photo;
    let urls = this.data.imgurl
    console.log(event)
    wx.previewImage({
      current: index,
      urls: urls
    });
  },

  confirm(){
    if(this.data.commodity_name&&this.data.commodity_brief&&this.data.money){
      if(this.data.imgurl.length>0){
        db.collection('audit')
        .add({
          data:{
            commodity_no:wx.getStorageSync('phoneNumber')+Date.now()+'com',
            commodity_name:this.data.commodity_name,
            commodity_brief:this.data.commodity_brief,
            money:this.data.money,
            imgurl:this.data.imgurl,
            payee:this.data.nickName,
            phoneNumber:wx.getStorageSync('phoneNumber'),
            type:'商品',
            audit:false,
          }
        })


        wx.requestSubscribeMessage({
          tmplIds: ['b3FdHt8aLR3BKmOlRLK_drVODEYrGrIVq4N2hYllq24'],
          success(res) {
            console.log(res)
          }
        })

        wx.cloud.callFunction({
          name: 'new_audit',
          data:{
            task_no:Date.now()+wx.getStorageSync('phoneNumber'),
            task_summary:'新商品审核',
            nickName:wx.getStorageSync('nickName')
          },
          success: res => {
            console.log('云函数调用成功', res);
          },
        })

        
        wx.showToast({
          title: '已提交审核',
          icon:'success'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta:1
          })
        }, 800);
      }else{
        wx.showToast({
          title: '至少上传一张图片',
          icon:'none'
        })
      }
    }else{
      wx.showToast({
        title: '请填写完全',
        icon:'error'
      })
    }
  },

  onShow(){
    this.getData()
  },

  getData(){
    db.collection('sellerlist')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        nickName:res.data[0].nickName
      })
    })
  },

  formatTime(timestamp) {
    // JavaScript 时间戳是以毫秒为单位的，需要将秒为单位的时间戳乘以 1000
    const date = new Date(timestamp * 1000);

    // 获取各个时间部分
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    // const seconds = ('0' + date.getSeconds()).slice(-2);

    // 拼接成可读格式
    // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }




})