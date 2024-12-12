const db=wx.cloud.database()
Page({


  data: {
    imgurl: []
  },

  heading(e){
    console.log(e.detail.value)
    this.setData({
      heading:e.detail.value
    })
  },

  body(e){
    console.log(e.detail.value)
    this.setData({
      body:e.detail.value
    })
  },


  upload_photo(){
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
                cloudPath:'talk/discuss/' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000) + '.png', // 避免重复文件名
                filePath: file.tempFilePath,
              });
            });
  
            Promise.all(uploadPromises).then(results => {
              let newImgurl = that.data.imgurl.concat(results.map(res => res.fileID)); // Add all new fileIDs to the array
              that.setData({
                imgurl: newImgurl,
              });
              console.log("添加成功", that.data.imgurl);
            }).catch(error => {
              console.error("上传失败", error);
            });
          }
        })
      }
  },

  confirm() {
    const that = this;
  
    // 请求用户订阅消息
    wx.requestSubscribeMessage({
      tmplIds: ['b3FdHt8aLR3BKmOlRLK_drVODEYrGrIVq4N2hYllq24'],
      success(res) {
        console.log('订阅消息成功:', res);
  
        // 成功请求订阅消息后，进行数据库操作
        db.collection('audit')
          .add({
            data: {
              discuss_photo: that.data.imgurl,
              phoneNumber: wx.getStorageSync('phoneNumber'),
              nickName: wx.getStorageSync('nickName'),
              heading: that.data.heading,
              body: that.data.body,
              time: Date.now(),
              avater: wx.getStorageSync('avater'),
              type: '帖子',
              audit: false
            }
          })
          .then(() => {
            wx.cloud.callFunction({
              name: 'new_audit',
              data: {
                task_no: Date.now() + wx.getStorageSync('phoneNumber'),
                task_summary: '新广告审核',
                nickName: wx.getStorageSync('nickName')
              },
              success: res => {
                console.log('云函数调用成功', res);
                wx.showToast({
                  title: '已提交审核',
                  icon: 'success'
                });
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 800);
              },
              fail: err => {
                console.error('云函数调用失败:', err);
              }
            });
          })
          .catch(err => {
            console.error('数据库操作失败:', err);
            wx.showToast({
              title: '提交失败，请重试',
              icon: 'none'
            });
          });
      },
      fail(err) {
        console.error('订阅消息请求失败:', err);
        wx.showToast({
          title: '请允许订阅消息',
          icon: 'none'
        });
      }
    });
  }





})