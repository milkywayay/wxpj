const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  derive(e) {
    console.log(e);
    const whereCondition = {}; // 导出所有数据，不设置特定条件
    wx.cloud.callFunction({
      name: 'export', // 云函数名称
      data: {
        collectionName: 'export', // 数据集合名称
        where: whereCondition, // 查询条件
      },
      success: res => {
        console.log('文件导出成功：', res.result.fileID);
        this.download(res.result.fileID); // 下载生成的文件
      },
      fail: err => {
        console.error('导出失败：', err);
        wx.showToast({ title: '导出失败', icon: 'none' });
      },
    });
  },
  
  download(fileID) {
    wx.cloud.downloadFile({
      fileID: fileID,
      success: res => {
        const filePath = res.tempFilePath;
        console.log('文件下载成功，路径为：', filePath);
        wx.openDocument({
          filePath: filePath,
          fileType: 'xlsx',
          success: () => {
            console.log('文件打开成功');
          },
          fail: err => {
            console.error('文件打开失败', err);
          },
        });
      },
      fail: err => {
        console.error('文件下载失败', err);
      },
    });
  },


  onShow() {
    this.getData()
  },

  getData(){
    db.collection('export')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber'),
      type:'ask'
    })
    .get()
    .then(res=>{
      console.log(res)
      const temData = res.data;
      temData.sort((a, b) => new Date(b.time) - new Date(a.time));
      console.log(temData)
      this.setData({
        lssues: temData
      });
    })
  },



  onHide() {

  },


  onUnload() {

  },


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