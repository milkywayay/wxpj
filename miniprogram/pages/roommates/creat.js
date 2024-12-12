const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  title(e){
    console.log(e.detail.value)
    this.setData({
      group_name:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.if_audit()
    this.getAddress_formatted()
  },

  if_audit(){
    db.collection('audit')
    .where({
      type:'opinion_group',
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .count()
    .then(res=>{
      if(res.total>0){
        this.setData({
          audit:true
        })
      }else{
        this.setData({
          audit:false
        })
      }
    })
  },

  getAddress_formatted(){
    this.setData({
      address_formatted:wx.getStorageSync('address_formatted')
    })
  },

  onInputChange(e) {
    const index = e.currentTarget.dataset.index; // 获取输入框索引
    const value = e.detail.value; // 获取输入内容

    // 更新 requirements 数据
    this.setData({
      [`requirements[${index}]`]: value
    });
  },

  submitRequirements() {
    const { requirements } = this.data;
    const filledRequirements = Object.values(requirements).filter(item => item.trim() !== '');
    
    console.log('用户输入的要求：', filledRequirements);
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    });
  },

  confirm() {
    if(this.data.group_name){

    const { requirements } = this.data;
  
    // 确保 requirements 是一个对象
    if (!requirements || typeof requirements !== 'object') {
      wx.showToast({
        title: '请至少输入一个需求',
        icon: 'none',
        duration: 2000
      });
      return;
    }
  
    // 检查是否所有需求都是空
    const hasRequirements = Object.values(requirements).some(item => item.trim() !== '');
  
    if (!hasRequirements) {
      wx.showToast({
        title: '请至少输入一个需求',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.showLoading({
        title: '疯狂检索中',
      })
      db.collection('opinion_group')
      .where({
        group_name:this.data.address_formatted+this.data.group_name
      })
      .count()
      .then(res=>{
        if(res.total!=0){
          wx.showToast({
            title: '名称重复',
            icon:'error'
          })
        }else{
          db.collection('opinion_group')
          .add({
            data:{
              phoneNumber:wx.getStorageSync('phoneNumber'),
              nickName:db.command.push(wx.getStorageSync('nickName')),
              owner:wx.getStorageSync('nickName'),
              group_name:this.address_formatted+this.data.group_name,
              id:db.serverDate()+wx.getStorageSync('phoneNumber'),
              ask:this.data.requirements,
              audit:false
            }
          })
          db.collection('audit')
          .add({
            data:{
              phoneNumber:wx.getStorageSync('phoneNumber'),
              nickName:db.command.push(wx.getStorageSync('nickName')),
              owner:wx.getStorageSync('nickName'),
              group_name:this.address_formatted+this.data.group_name,
              id:db.serverDate()+wx.getStorageSync('phoneNumber'),
              ask:this.data.requirements,
              audit:false,
              type:'opinion_group'
            }
          })
          .then(res=>{
            console.log(res)
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
            setTimeout(() => {
              this.if_audit()
            }, 1000);
          })
        }
      })

     

  
  
      console.log('提交的需求：', requirements);
  
      // 在这里执行其他操作，例如发送数据
    }


  }else{
    wx.showToast({
      title: '请输入群组名称',
      icon:'none'
    })
  }
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