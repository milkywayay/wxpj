const db = wx.cloud.database()
Page({


  data: {
    score_question1: '0',
    score_question2: '0',
    score_question3: '0',
    score_question4: '0',
    score_question5: '0',
    score_question6: '0',
    score_question7: '0',
    score_question8: '0',
    score_question9: '0',
    sex: ['男', '女'],
    age: ['<20', '20-30', '30-40', '40-50', '50-60', '>60'],
    question1: [{
        name: 0,
        value: '非常不喜欢'
      },
      {
        name: 1,
        value: '不喜欢'
      },
      {
        name: 2,
        value: '一般'
      },
      {
        name: 3,
        value: ' 喜欢 '
      }, {
        name: 4,
        value: '非常喜欢'
      }
    ],
    question2: [{
        name: 0,
        value: '从不'
      },
      {
        name: 1,
        value: '很少'
      },
      {
        name: 2,
        value: '有时'
      }, {
        name: 3,
        value: '经常',
      }, {
        name: 4,
        value: '总是'
      }
    ],
    question3: [{
        name: 0,
        value: '从不'
      },
      {
        name: 1,
        value: '很少'
      },
      {
        name: 2,
        value: '有时'
      }, {
        name: 3,
        value: '经常',
      }, {
        name: 4,
        value: '总是'
      }
    ],
    question4: [{
        name: 0,
        value: '非常善于'
      },
      {
        name: 1,
        value: '不善'
      },
      {
        name: 2,
        value: '一般'
      },
      {
        name: 3,
        value: '善于'
      }, {
        name: 4,
        value: '非常善于'
      }
    ],
    question5: [{
        name: 0,
        value: '非常不喜欢'
      },
      {
        name: 1,
        value: '不喜欢'
      },
      {
        name: 2,
        value: '一般'
      },
      {
        name: 3,
        value: ' 喜欢 '
      }, {
        name: 4,
        value: '非常喜欢'
      }
    ],
    question6: [{
        name: 0,
        value: '非常悲观'
      },
      {
        name: 1,
        value: '悲观'
      },
      {
        name: 2,
        value: '一般'
      },
      {
        name: 3,
        value: '乐观'
      },
      {
        name: 4,
        value: '非常乐观'
      }
    ],
    question7: [{
        name: 0,
        value: '非常不喜欢'
      },
      {
        name: 1,
        value: '不喜欢'
      },
      {
        name: 2,
        value: '一般'
      },
      {
        name: 3,
        value: ' 喜欢 '
      }, {
        name: 4,
        value: '非常喜欢'
      }
    ],
    question8: [{
        name: 0,
        value: '从不'
      },
      {
        name: 1,
        value: '很少'
      },
      {
        name: 2,
        value: '有时'
      }, {
        name: 3,
        value: '经常',
      }, {
        name: 4,
        value: '总是'
      }
    ],
    question9: [{
        name: 0,
        value: '非常不喜欢'
      },
      {
        name: 1,
        value: '不喜欢'
      },
      {
        name: 2,
        value: '一般'
      },
      {
        name: 3,
        value: ' 喜欢 '
      }, {
        name: 4,
        value: '非常喜欢'
      }
    ],
  },
  question1: function (e) {
    let score_question1 = 0
    if (e.detail.value.includes('0')) {
      score_question1 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question1 += 2.125
    }
    if (e.detail.value.includes('2')) {
      score_question1 += 1.875
    }
    if (e.detail.value.includes('3')) {
      score_question1 += 1.5
    }
    this.setData({
      score_question1: score_question1
    })

    console.log(this.data.score_question1)
  },


  question2: function (e) {
    let score_question2 = 0
    if (e.detail.value.includes('0')) {
      score_question2 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question2 += 1.5
    }
    if (e.detail.value.includes('2')) {
      score_question2 += 1
    }
    this.setData({
      score_question2: score_question2
    })
    console.log(this.data.score_question2)
  },

  question3: function (e) {
    let score_question3 = 0
    if (e.detail.value.includes('0')) {
      score_question3 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question3 += 0.5
    }
    this.setData({
      score_question3: score_question3
    })
    console.log(this.data.score_question3)
  },

  question4: function (e) {
    let score_question4 = 0
    if (e.detail.value.includes('0')) {
      score_question4 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question4 += 1.5
    }
    if (e.detail.value.includes('2')) {
      score_question4 += 1
    }
    this.setData({
      score_question4: score_question4
    })
    console.log(this.data.score_question4)
  },


  question5: function (e) {
    let score_question5 = 0
    if (e.detail.value.includes('0')) {
      score_question5 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question5 += 1.5
    }
    if (e.detail.value.includes('2')) {
      score_question5 += 1
    }
    if (e.detail.value.includes('3')) {
      score_question5 += 1
    }
    this.setData({
      score_question5: score_question5
    })
    console.log(this.data.score_question5)
  },

  question6: function (e) {
    let score_question6 = 0
    if (e.detail.value.includes('0')) {
      score_question6 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question6 += 1.5
    }
    if (e.detail.value.includes('2')) {
      score_question6 += 1
    }
    if (e.detail.value.includes('3')) {
      score_question6 += 0.75
    }
    this.setData({
      score_question6: score_question6
    })
    console.log(this.data.score_question6)
  },

  question7: function (e) {
    let score_question7 = 0
    if (e.detail.value.includes('0')) {
      score_question7 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question7 += 1.5
    }
    if (e.detail.value.includes('2')) {
      score_question7 += 1
    }
    this.setData({
      score_question7: score_question7
    })
    console.log(this.data.score_question7)
  },

  question8: function (e) {
    let score_question8 = 0
    if (e.detail.value.includes('0')) {
      score_question8 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question8 += 1.5
    }
    if (e.detail.value.includes('2')) {
      score_question8 += 1
    }
    if (e.detail.value.includes('3')) {
      score_question8 += 0.75
    }
    if (e.detail.value.includes('4')) {
      score_question8 += 0.5
    }
    this.setData({
      score_question8: score_question8
    })
    console.log(this.data.score_question8)
  },

  question9: function (e) {
    let score_question9 = 0
    if (e.detail.value.includes('0')) {
      score_question9 += 2.5
    }
    if (e.detail.value.includes('1')) {
      score_question9 += 1.5
    }
    if (e.detail.value.includes('2')) {
      score_question9 += 1
    }
    this.setData({
      score_question9: score_question9
    })
    console.log(this.data.score_question9)
  },


  sex: function (e) {
    let preindex1
    if (e.detail.value == 0 || e.detail.value == 1) {
      preindex1 = 1.4
    } else {
      preindex1 = 2
    }
    this.setData({
      index_sex: e.detail.value,
      score_sex: preindex1
    });
    console.log(this.data.index_sex);
    console.log('当前选择:', this.data.sex[this.data.index_sex]);
  },

  age: function (e) { //年龄
    let preindex2
    preindex2 = (parseInt(e.detail.value) + 1) * 0.25
    this.setData({
      index_age: e.detail.value,
      score_age: preindex2
    });
    console.log(this.data.index_age);
    console.log('当前选择:', this.data.age[this.data.index_age]);
  },

  confirm() {
    if (this.data.index_age && this.data.index_sex) {
      console.log('Score Question 1:', this.data.score_question1);
      console.log('Score Question 2:', this.data.score_question2);
      console.log('Score Question 3:', this.data.score_question3);
      console.log('Score Question 4:', this.data.score_question4);
      console.log('Score Question 5:', this.data.score_question5);
      console.log('Score Question 6:', this.data.score_question6);
      console.log('Score Question 7:', this.data.score_question7);
      console.log('Score Question 8:', this.data.score_question8);
      console.log('Score Question 9:', this.data.score_question9);


      const score =
        parseFloat(this.data.score_question1) +
        parseFloat(this.data.score_question2) +
        parseFloat(this.data.score_question3) +
        parseFloat(this.data.score_question4) +
        parseFloat(this.data.score_question5) +
        parseFloat(this.data.score_question6) +
        parseFloat(this.data.score_question7) +
        parseFloat(this.data.score_question8) +
        parseFloat(this.data.score_question9)
        console.log('总分数' + score)
      if (score <= 10) {
        this.setData({
          person_type: 'A型人格',
          describe: '有企业家精神特征的冒险家'
        })
      }
      if (score >= 10 && score < 15) {
        this.setData({
          person_type: 'B型人格',
          describe: '非常宽容，很灵活，能适应各种环境'
        })
      }
      if (score >= 15 && score < 20) {
        this.setData({
          person_type: 'C型人格',
          describe: '不会只看事物的表面价值，而是对找出事情运作过程感兴趣'
        })
      }
      if (score >= 20) {
        this.setData({
          person_type: 'D型人格',
          describe: '在需要承担责任和风险时，他们尽最大努力缩起脖子'
        })
      }
      db.collection('judge')
        .add({
          data: {
            phoneNumber: wx.getStorageSync('phoneNumber'),
            score: score,
            person_type: this.data.person_type,
            judge_time: Date.now(),
            describe: this.data.describe
          }
        })
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 800,
        success: function () {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/judge/history_judge',
            })
          }, 800)
        }
      })
    } else {
      wx.showToast({
        title: '请将性别和姓名填写完全',
        icon: 'none',
        duration: 2000
      })
    }
  },





  onLoad(options) {

  },


  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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