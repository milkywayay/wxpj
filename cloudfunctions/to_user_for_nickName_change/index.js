const cloud = require('wx-server-sdk');

// 初始化云环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  console.log('Received event:', event);

  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;

    // 发送订阅消息
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,  // 接收消息用户的 openid
      page: '/pages/settings/settings',  // 消息跳转的页面路径
      data: {
        thing1: {
          value: event.type
        },
        thing3: {
          value: event.nickName
        },
        phrase4: {
          value: event.audit
        },
        time5: {
          value: formattedDate
        },
        thing6: {
          value: event.remark
        }
      },
      templateId: 'b3FdHt8aLR3BKmOlRLK_dmDKNM-VzKvCFnj9_hBjd6k',  // 模板ID
      miniprogramState: 'developer'  // 根据小程序状态调整 'developer', 'trial', 'formal'
    });

    console.log('订阅消息发送成功:', result);
    return result;
  } catch (err) {
    console.error('订阅消息发送失败:', err);
    return {
      errorCode: err.errCode || 'UNKNOWN_ERROR',
      errorMessage: err.errMsg || '未知错误'
    };
  }
};