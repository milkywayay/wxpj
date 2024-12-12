const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;

    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.openid,
      "page": '/pages/messages/all_messages',
      "data": {
        "thing1": {
          "value": event.message
        },
        "time2":{
          "value":formattedDate
        },
        "thing3":{
          "value":event.nickName
        }
      },
      "templateId": 'U3YP6v0JiYxthtLfmxAQyZ5SZIIrQ_Zo7IZkGHrqhFU',
      "miniprogramState": 'developer'
    })
   
  } catch (err) {
    return err
  }
}