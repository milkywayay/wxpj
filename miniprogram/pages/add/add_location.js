const db = wx.cloud.database();
Page({
  data: {
    address_formatted: '',
    building_house: '',
    address_nickName: '',
    gender: '',
    address_phoneNumber: '',
    defaultAddress: false,
    change: false,
    id: null
  },

  onGenderChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      gender: e.detail.value
    });
  },

  onLoad(options) {
    console.log(options)
    if (options.id) {
      this.setData({
        change: true,
        id: options.id
      });
      this.getData(options.id);
    }else{
    this.checkLocationPermission()
    }
  
  },


  getLocatio(){
    if (wx.getStorageSync('new_location')) {
      wx.setStorageSync('address_formatted', wx.getStorageSync('new_location'));
      this.setData({
        address_formatted: wx.getStorageSync('address_formatted')
      });
    } else {
      this.getAndConvertLocation();
    }
  },

  onUnload(){
    if(wx.getStorageSync('new_location')){
      wx.removeStorageSync('new_location')
    }
  },


  checkLocationPermission() {
    const that = this;
    wx.getSetting({
      success(res) {
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
                  }
                }
              });
            }
          });
        } else {
          that.getLocatio();
        }
      }
    });
  },

  async getAndConvertLocation() {
    try {
      const location = await this.getLocation();
      console.log('Current Location:', location);
      const { latitude, longitude } = location;
      console.log(latitude, longitude);

      const res = await wx.cloud.callFunction({
        name: 'lbs_server',
        data: {
          type: 'location',
          data: {
            location: [latitude, longitude]
          }
        }
      });

      console.log('Cloud Function Result:', res);
      this.setData({
        address_formatted: res.result.formatted
      });
      wx.setStorageSync('address_formatted', res.result.formatted);
    } catch (error) {
      console.error('Error in getting location or calling cloud function:', error);
    }
  },

  location() {
    wx.navigateTo({
      url: '/pages/map/map'
    });
  },

  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: resolve,
        fail: reject
      });
    });
  },

  onShow() {
    if(!this.data.change)
    this.getLocatio()
  },

  building_house(e) {
    console.log(e.detail.value);
    this.setData({
      building_house: e.detail.value
    });
  },

  address_nickName(e) {
    console.log(e.detail.value);
    this.setData({
      address_nickName: e.detail.value
    });
  },


  address_phoneNumber(e) {
    console.log(e.detail.value);
    this.setData({
      address_phoneNumber: e.detail.value
    });
  },

  onDefaultAddressChange(e) {
    console.log(e.detail.value);
    this.setData({
      defaultAddress: e.detail.value
    });
  },

  confirm() {
    if (this.data.address_formatted && this.data.address_nickName && this.data.address_phoneNumber && this.data.gender && this.data.building_house) {
      const regex = /(学校|学院|大学|校区)/;
      const containsKeyword = regex.test(this.data.address_formatted);
      if (containsKeyword) {
        if (this.data.address_phoneNumber.length == '11') {
          const updateData = {
            phoneNumber: wx.getStorageSync('phoneNumber'),
            address_formatted: this.data.address_formatted,
            building_house: this.data.building_house,
            address_nickName: this.data.address_nickName,
            address_phoneNumber: this.data.address_phoneNumber,
            gender: this.data.gender,
            default: this.data.defaultAddress
          };
  
          // 首先将其他 default 为 true 的地址改为 false
          db.collection('location')
            .where({
              phoneNumber: wx.getStorageSync('phoneNumber'),
              default: true
            })
            .update({
              data: {
                default: false
              }
            })
            .then(() => {
              // 检查是更新还是新增
              if (this.data.change) {
                db.collection('location')
                  .doc(this.data.id)
                  .update({
                    data: updateData
                  })
                  .then(res => {
                    wx.showToast({
                      title: '更新成功',
                      icon: 'success'
                    });
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
                      });
                    }, 800);
                  })
                  .catch(err => {
                    wx.showToast({
                      title: '更新地址失败，请重试',
                      icon: 'none',
                      duration: 2000
                    });
                  });
              } else {
                // 新增地址
                db.collection('location')
                  .add({
                    data: updateData
                  })
                  .then(res => {
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success'
                    });
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
                      });
                    }, 800);
                  })
                  .catch(err => {
                    wx.showToast({
                      title: '保存地址失败，请重试',
                      icon: 'none',
                      duration: 2000
                    });
                  });
              }
            })
            .catch(err => {
              wx.showToast({
                title: '更新默认地址失败，请重试',
                icon: 'none',
                duration: 2000
              });
            });
        } else {
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        wx.showToast({
          title: '非学校请移步校外地址',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      wx.showToast({
        title: '请填写完全',
        icon: 'error'
      });
    }
  },

  getData(id) {
    console.log(id);
    db.collection('location')
    .doc(id)
      .get()
      .then(res => {
        console.log(res);
        const data = res.data;
        this.setData({
          address_formatted: data.address_formatted,
          building_house: data.building_house,
          address_nickName: data.address_nickName,
          address_phoneNumber: data.address_phoneNumber,
          gender: data.gender,
          defaultAddress: data.default
        });
      });
  }
});