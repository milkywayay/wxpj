const db=wx.cloud.database()
Page({
  data: {

  },
  onLoad: function () {
    this.checkLocationPermission()
  },

  opinion(){
    wx.navigateTo({
      url: '/pages/roommates/opinion',
    })
  },

  getLocatio(){
    console.log('运行getLocation')
    if (wx.getStorageSync('new_location')) {
      wx.setStorageSync('address_formatted', wx.getStorageSync('new_location'))
      this.setData({
        address_formatted:wx.getStorageSync('address_formatted')
      })
    } else {
      this.getAndConvertLocation()
    }
  },

  checkLocationPermission() {
    const that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.getLocatio();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '请授权获取地理位置',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(settingdata) {
                        if (settingdata.authSetting['scope.userLocation']) {
                          that.getLocatio();
                        }
                      }
                    });
                  }else{
                    wx.navigateBack({
                      delta:1
                    })
                  }
                }
              });
            }
          });
        } else {
          that.getLocatio();
          console.log(2)
        }
      }
    });
  },

  DuoHuanShangPu(){
    wx.navigateToMiniProgram({
      appId:'wxd0ef84f519b9990b',
      path:'pages/talk/talk',
      envVersion: 'release'
    })
  },


  location() {
    wx.navigateTo({
      url: '/pages/map/map',
    })
  },

  getData(){
    wx.navigateTo({
      url: '/pages/school/data_collection',
    })
  },

  teacher(){
    if(wx.getStorageSync('phoneNumber')){
    db.collection('userlist')
    .doc(wx.getStorageSync('id'))
    .get()
    .then(res=>{
      console.log(res.data)
      if(res.data.type){
        if(res.data.type=='teacher'){
          wx.navigateTo({
            url: '/pages/school/teacher_center',
          })
        }
      }else{
        wx.navigateTo({
          url: '/pages/school/be_teacher',
        })
      }
    })
  }else{
    wx.showToast({
      title: '请先登录',
      icon:'error'
    })
    setTimeout(() => {
      wx.navigateTo({
        url: 'pages/settings/settings',
      })
    }, 300);
  }
  },



  async getAndConvertLocation() {
    try {
      // 获取当前位置
      const location = await this.getLocation();
      console.log('Current Location:', location);
      const {
        latitude,
        longitude
      } = location;
      console.log(latitude, longitude)

      // 调用云函数进行经纬度到文字地址的转换
      const res = await wx.cloud.callFunction({
        name: 'lbs_server', // 云函数名称
        data: {
          type: 'location', // 指定操作类型为经纬度转地址
          data: {
            location: [latitude, longitude]
          }
        }
      });

      console.log('Cloud Function Result:', res);
      this.setData({
        address_formatted: res.result.formatted
      })

      wx.setStorageSync('address_formatted', res.result.formatted)
    } catch (error) {
      console.error('Error in getting location or calling cloud function:', error);
    }
  },

  // 获取当前位置
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: resolve,
        fail: reject
      })
    })
  },
  // 初始版本1.0.0。内容如下：
  // 1.商品购买
  // 2.工位预约
  // 3.广告发布
  // 等其余次要小功能
  getParcel() {
    const regex = /(学校|学院|大学|校区)/;
    const containsKeyword = regex.test(wx.getStorageSync('address_formatted'));
    if (containsKeyword || wx.getStorageSync('phoneNumber') == '18330529472') {
      wx.navigateTo({
        url: '/pages/school/getParcel',
      })
    } else {
      wx.showToast({
        title: '您当前的位置不在学校，请手动选择学校',
        icon: 'none',
        duration: 2000
      })
    }
  },



  toilet_paper() {
    const regex = /(学校|学院|大学|校区)/;
    const containsKeyword = regex.test(wx.getStorageSync('address_formatted'));
    if (containsKeyword || wx.getStorageSync('phoneNumber') == '18330529472') {
      wx.navigateTo({
        url: '/pages/school/toilet_paper',
      })
    } else {
      wx.showToast({
        title: '您当前的位置不在学校，请手动选择学校',
        icon: 'none',
        duration: 2000
      })
    }
  }
});