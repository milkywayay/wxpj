const db = wx.cloud.database()
Page({

  data: {
    write: false
  },

  onLoad(options) {
    console.log(options.id)
    this.getlssue(options.id)

  },

  if_write() {
    db.collection('userlist')
      .doc(wx.getStorageSync('id'))
      .get()
      .then(res => {
        console.log(res.data)
        if (res.data.lssueID && res.data.lssueID.includes(this.data.lssue._id)) {
          this.setData({
            write: true,
          })
          this.getwrited()
        }
      })
  },

  getwrited() {
    db.collection('export')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber'),
        type: 'answer'
      })
      .get()
      .then(res => {
        console.log(res)
        console.log(res.data[0])

        // 假设我们使用查询结果的第一个对象
        const resultData = res.data[0];

        // 遍历 lssue.field 并动态填充对应的值
        this.data.lssue.field.forEach((item, index) => {
          const fieldName = item.platform; // 假设 item.platform 存储了字段名
          if (resultData[fieldName]) {
            item.value = resultData[fieldName];
          } else {
            item.value = ''; // 若查询结果中没有此字段，则设置为空
          }
        });

        this.setData({
          writed: res.data,
          'lssue.field': this.data.lssue.field // 同步更新到页面
        });
      })
  },


  uploadFile(e) {
    const index = e.currentTarget.dataset.index;
    const field = this.data.lssue.field;
  
    // 打开文件选择器，用户选择文件
    wx.chooseMessageFile({
      count: 1, // 仅允许上传一个文件
      type: 'file', // 文件类型
      success: res => {
        const filePath = res.tempFiles[0].path; // 获取临时文件路径
        const cloudPath = `school_sever/collects/${Date.now()}-${res.tempFiles[0].name}`; // 云存储路径
  
        // 上传文件到云存储
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success: uploadRes => {
            console.log('上传成功：', uploadRes.fileID);
  
            // 更新字段的 filePath
            field[index].filePath = uploadRes.fileID;
  
            this.setData({
              'lssue.field': field
            });
  
            wx.showToast({
              title: '文件上传成功',
              icon: 'success'
            });
          },
          fail: err => {
            console.error('文件上传失败：', err);
            wx.showToast({
              title: '文件上传失败',
              icon: 'none'
            });
          }
        });
      },
      fail: err => {
        console.error('文件选择失败：', err);
      }
    });
  },

  getlssue(id) {
    db.collection('export')
      .doc(id)
      .get()
      .then(res => {
        console.log(res)
        this.if_write()
        this.setData({
          lssue: res.data
        })
      })
  },

  input(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;


    const field = this.data.lssue.field;
    field[index].value = value;

    this.setData({
      'lssue.field': field
    });
  },

  checkFieldsFilled() {
    const fields = this.data.lssue.field;
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].value) {
        wx.showToast({
          title: `请填写${fields[i].platform}的内容`,
          icon: "none"
        });
        return false;
      }
    }
    return true;
  },


  confirm() {
    if (this.checkFieldsFilled()) {
      wx.showToast({
        title: '提交成功！',
        icon: 'success'
      });
    }
  
    // 遍历字段并统一结构
    const field = this.data.lssue.field.map(item => ({
      platform: item.platform,
      value: item.value || '',
      filePath: item.filePath || '',
    }));
  
    if (!this.data.write) {
      db.collection('export')
        .add({
          data: {
            phoneNumber: wx.getStorageSync('phoneNumber'),
            connectID: this.data.lssue._id,
            field: field, // 保证字段结构一致
            type: 'answer'
          }
        })
        .then(res => {
          console.log(res);
          wx.navigateBack({
            delta: 1
          });
        })
        .catch(err => {
          console.error('提交失败：', err);
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          });
        });
    } else {
      db.collection('export')
        .where({
          phoneNumber: wx.getStorageSync('phoneNumber'),
          type: 'answer'
        })
        .update({
          data: {
            phoneNumber: wx.getStorageSync('phoneNumber'),
            connectID: this.data.lssue._id,
            field: field, // 确保更新的字段结构一致
            type: 'answer'
          }
        })
        .then(res => {
          console.log(res);
          wx.navigateBack({
            delta: 1
          });
        })
        .catch(err => {
          console.error('更新失败：', err);
          wx.showToast({
            title: '更新失败',
            icon: 'none'
          });
        });
    }
  }





})