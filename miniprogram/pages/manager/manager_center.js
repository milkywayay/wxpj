const db = wx.cloud.database()
Page({


  data: {

  },

  agree_revice() {
    wx.requestSubscribeMessage({
      tmplIds: ['72_kib-rK3jAP6A7YpdKPHRb65q1XK1djNq0N_5yeKQ'],
      success(res) {
        console.log(res)
      }
    })
  },

  onShow() {
    this.getData()
  },
  getData() {
    console.log('已运行getData')
    let office_data = []
    let manager_data = []
    let seller_data = []
    let post_data = []
    let commodity_data = []
    let nickName_data = []
    let avater_data=[]
    let teacher_data=[]
    db.collection('audit')
      .where({
        audit: false
      })
      .get()
      .then(res => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            office_data: [],
            manager_data: [],
            seller_data: [],
            post_data: [],
            commodity_data: [],
            nickName_data: [],
            avater_data:[],
            teacher_data:[]
          })
          wx.showToast({
            title: '暂无审核',
            icon: 'error'
          })
        }
        res.data.forEach(item => {
          console.log(res.data.length)
          if (item.type == "办公室审核") {
            office_data.push(item)
          }
          if (item.type == "管理员") {
            manager_data.push(item)
          }
          if (item.type == "商家审核") {
            seller_data.push(item)
          }
          if (item.type == "帖子") {
            post_data.push(item)
          }
          if (item.type == "商品") {
            commodity_data.push(item)
          }
          if (item.type == "昵称") {
            nickName_data.push(item)
          }
          if(item.type=="头像"){
            avater_data.push(item)
          }
          if(item.type=="teacher"){
            teacher_data.push(item)
          }
          console.log(office_data.length + manager_data.length + seller_data.length + post_data.length + commodity_data.length + nickName_data.length+avater_data.length+teacher_data.length)
          if (office_data.length + manager_data.length + seller_data.length + post_data.length + commodity_data.length + nickName_data.length+avater_data.length+teacher_data.length == res.data.length) {
            console.log('正在运行')
            this.getData2(office_data, manager_data, seller_data, post_data, commodity_data, nickName_data,avater_data,teacher_data)
          }
        })
      })
  },

  getData2(od, md, sd, pd, cd, nd,ad,td) {
    console.log('已运行getData2')
    this.setData({
      office_data: od,
      manager_data: md,
      seller_data: sd,
      post_data: pd,
      commodity_data: cd,
      nickName_data: nd,
      avater_data:ad,
      teacher_data:td
    })
  },

  pass(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.t)
    const detail = e.currentTarget.dataset.t
    console.log(detail.type)
    if (detail.type == "办公室审核") {
      this.office(detail)
    }
    if (detail.type == "管理员") {
      this.manager(detail)
    }
    if (detail.type == "商家审核") {
      this.seller(detail)
    }
    if (detail.type == "帖子") {
      this.post(detail)
    }
    if (detail.type == "商品") {
      this.commodity(detail)
    }
    if (detail.type == "昵称") {
      this.nickName(detail)
    }
    if(detail.type=="头像"){
      this.avater(detail)
    }
    if(detail.type=="teacher"){
      this.teacher(detail)
    }
  },

  no_pass(e) {
    const detail = e.currentTarget.dataset.t
    if (detail.type == "帖子") {
      this.no_post(detail)
    }
    if (detail.type == "昵称") {
      this.no_nickName(detail)
    }
    if (detail.type == "商家审核") {
      this.no_seller(detail)
    }
    if(detail.type=="头像"){
      this.no_avater(detail)
    }
    if(detail.type=="teacher"){
      this.no_teacher(detail)
    }

  },

  teacher(detail){
    db.collection('userlist')
    .where({
      phoneNumber: detail.phoneNumber
    })
    .update({
      data: {
        type:'teacher'
      }
    })
  db.collection('audit')
    .where({
      _id: detail._id
    })
    .update({
      data: {
        audit: true,
        pass:true
      }
    })
    .then(res => {
      console.log(res)
      wx.cloud.callFunction({
        name: 'to_user_for_nickName_change',
        data: {
          type: '教师审核',
          nickName: detail.nickName,
          audit: '通过',
          remark: '来发布你的第一个收集吧～',
          openid: detail._openid
        },
        success: res => {
          console.log('云函数调用成功', res);
        }
      })
      wx.showToast({
        title: '已通过',
        icon: 'success'
      })
      setTimeout(() => {
        this.getData()
      }, 100);
    })
  },

  no_teacher(detail){
    db.collection('audit')
      .where({
        _id: detail._id
      })
      .update({
        data: {
          audit: true,
          pass:false
        }
      })
      .then(res => {
        console.log(res)
        wx.cloud.callFunction({
          name: 'to_user_for_nickName_change',
          data: {
            type: '教师',
            nickName: detail.nickName,
            audit: '未通过',
            remark: '请填写正确信息',
            openid: detail._openid
          },
          success: res => {
            console.log('云函数调用成功', res);
          }
        })
        wx.showToast({
          title: '已选择',
          icon: 'success'
        })
        setTimeout(() => {
          this.getData()
        }, 100);
      })
  },

  office(detail) {
    db.collection('office')
      .add({
        data: {
          office_charge_name: detail.office_charge_name,
          office_name: detail.office_name,
          phoneNumber: detail.phoneNumber
        }
      })
    wx.showToast({
      title: '已通过',
      icon: 'success'
    })
    db.collection('audit')
      .where({
        _id: detail._id
      })
      .remove()
      .then(Res => {
        console.log(Res)
        this.getData()
      })
  },


  manager(detail) {
    console.log(detail)
    db.collection('managerlist')
      .add({
        data: {
          phoneNumber: detail.phoneNumber
        }
      })

    db.collection('audit')
      .where({
        _id: detail._id
      })
      .update({
        data: {
          audit: true
        }
      })
      .then(Res => {
        console.log(Res)
        this.getData()
        wx.showToast({
          title: '已通过',
        })
      })
  },



  post(detail) {
    console.log(detail)
    db.collection('discuss')
      .add({
        data: {
          avater: detail.avater,
          body: detail.body,
          discuss_photo: detail.discuss_photo,
          heading: detail.heading,
          nickName: detail.nickName,
          phoneNumber: detail.phoneNumber,
          time: detail.time,
          type: detail.type,
        }
      })
    db.collection('audit')
      .where({
        _id: detail._id
      })
      .update({
        data: {
          audit: true
        }
      })
      .then(res => {

        wx.cloud.callFunction({
          name: 'to_seller_for_new_commodityAudit',
          data: {
            payee: detail.nickName,
            auditor: detail.phoneNumber,
            audit: '已通过',
            audit_type: '广告',
            openid: detail._openid
          },
          success: res => {
            console.log('云函数调用成功', res);
          },
        })
        console.log(res)
        this.getData()
      })
  },

  no_post(detail) {
    db.collection('audit')
    .doc(detail._id)
      .update({
        data:{
          audit:true,
          pass:false
        }
      })
      .then(res => {
        console.log(res)
        wx.cloud.callFunction({
          name: 'to_seller_for_new_commodityAudit',
          data: {
            payee: detail.nickName,
            auditor: detail.phoneNumber,
            audit: '未通过',
            audit_type: '广告',
            openid: detail._openid
          },
          success: res => {
            console.log('云函数调用成功', res);
            this.getData()
          },
        })
      })
  },

  commodity(detail) {
    console.log(detail)
    db.collection('commodity')
      .add({
        data: {
          commodity_name: detail.commodity_name,
          commodity_brief: detail.commodity_brief,
          imgurl: detail.imgurl,
          money: detail.money,
          payee: detail.payee,
          phoneNumber: detail.phoneNumber,
          shelf:true
        }
      })
    db.collection('audit')
      .where({
        _id: detail._id
      })
      .update({
        data: {
          audit: true
        }
      })
      .then(res => {
        console.log(res)

        wx.cloud.callFunction({
          name: 'to_seller_for_new_commodityAudit',
          data: {
            payee: detail.payee,
            auditor: detail.phoneNumber,
            audit: '已通过',
            audit_type: '商品',
            openid: detail._openid
          },
          success: res => {
            console.log('云函数调用成功', res);
          },
        })

        wx.showToast({
          title: '已通过',
          icon: 'success'
        })
        setTimeout(() => {
          this.getData()
        }, 500);
      })


  },

  nickName(detail) {
    db.collection('userlist')
      .where({
        phoneNumber: detail.phoneNumber
      })
      .update({
        data: {
          nickName: detail.new_nickName
        }
      })
    db.collection('audit')
      .where({
        _id: detail._id
      })
      .update({
        data: {
          audit: true
        }
      })
      .then(res => {
        console.log(res)
        wx.cloud.callFunction({
          name: 'to_user_for_nickName_change',
          data: {
            type: '昵称更改',
            nickName: detail.new_nickName,
            audit: '通过',
            remark: '重新登录后生效',
            openid: detail._openid
          },
          success: res => {
            console.log('云函数调用成功', res);
          }
        })
        wx.showToast({
          title: '已通过',
          icon: 'success'
        })
        setTimeout(() => {
          this.getData()
        }, 100);
      })
  },

  no_nickName(detail) {
    console.log('Detail:', detail);
    db.collection('audit')
      .where({
        phoneNumber: detail.phoneNumber,
        type: '昵称',
        audit: false
      })
      .update({
        data: {
          audit: true,
          pass:false
        },
        success: res => {
          console.log('数据库更新成功', res);
        },
        fail: err => {
          console.error('数据库更新失败', err);
        }
        
      });
  
    // 调用云函数发送通知
    wx.cloud.callFunction({
      name: 'to_user_for_nickName_change',
      data: {
        type: '昵称更改',
        nickName: '违规不可显示',
        audit: '未通过',
        remark: '请输入合法昵称',
        openid: detail._openid
      },
      success: res => {
        console.log('云函数调用成功', res);
      },
      fail: err => {
        console.error('云函数调用失败', err);
      }
    });
    setTimeout(() => {
      this.getData()
    }, 100);
  },

  avater(detail){
    db.collection('userlist')
    .where({
      phoneNumber: detail.phoneNumber
    })
    .update({
      data: {
        avater: detail.new_avater,
      }
    })
    db.collection('audit')
    .where({
      _id: detail._id
    })
    .update({
      data: {
        audit: true,
        pass:true
      }
    })
    .then(res => {
      console.log(res)
      wx.cloud.callFunction({
        name: 'to_user_for_nickName_change',
        data: {
          type: '头像更改',
          nickName: detail.new_nickName,
          audit: '通过',
          remark: '如未更新请重新登录',
          openid: detail._openid
        },
        success: res => {
          console.log('云函数调用成功', res);
        }
      })
      wx.showToast({
        title: '已通过',
        icon: 'success'
      })
      setTimeout(() => {
        this.getData()
      }, 500);
    })
  },

  no_avater(detail){
    db.collection('audit')
    .where({
      phoneNumber: detail.phoneNumber,
      type: '头像',
      audit: false
    })
    .update({
      data: {
        audit: true,
        pass:false
      },
      success: res => {
        console.log('数据库更新成功', res);
      }
    })

    wx.cloud.callFunction({
      name: 'to_user_for_nickName_change',
      data: {
        type: '头像更改',
        nickName: detail.nickName,
        audit: '未通过',
        remark: '头像违规',
        openid: detail._openid
      },
      success: res => {
        console.log('云函数调用成功', res);
      },
    })
    setTimeout(() => {
      this.getData()
    }, 100);
  },

  seller(detail) {
    console.log(detail)
    db.collection('sellerlist')
      .add({
        data: {
          nickName: detail.nickName,
          phoneNumber: detail.phoneNumber,
          time: detail.time,
          type: detail.type,
        }
      })
    db.collection('audit')
      .where({
        _id: detail._id
      })
      .update({
        data: {
          audit: true
        }
      })
      .then(res => {

        wx.cloud.callFunction({
          name: 'to_seller_for_new_commodityAudit',
          data: {
            payee: detail.nickName,
            auditor: detail.phoneNumber,
            audit: '已通过',
            audit_type: '商家审核',
            openid: detail._openid
          },
          success: res => {
            console.log('云函数调用成功', res);
          },
        })
        console.log(res)
        this.getData()
      })


  },

  no_seller(detail) {
    db.collection('audit')
      .doc(detail._id)
      .remove()
      .then(res => {
        console.log(res)
        wx.cloud.callFunction({
          name: 'to_seller_for_new_commodityAudit',
          data: {
            payee: detail.nickName,
            auditor: detail.phoneNumber,
            audit: '未通过',
            audit_type: '商家审核',
            openid: detail._openid
          },
          success: res => {
            console.log('云函数调用成功', res);
          },
        })
      })
  }


})