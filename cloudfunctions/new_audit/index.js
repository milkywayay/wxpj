const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;

    const result = await cloud.openapi.subscribeMessage.send({
      "touser": 'oJF8W7XZKFoxOFFpixfXePuTVF0M',
      "page": '/pages/manager/manager_center',
      "data": {
        "character_string1": {
          "value": event.task_no
        },
        "thing2":{
          "value":event.task_summary
        },
        "time5":{
          "value":formattedDate
        },
        "thing4":{
          "value":event.nickName
        }
      },
      "templateId": '72_kib-rK3jAP6A7YpdKPHRb65q1XK1djNq0N_5yeKQ',
      "miniprogramState": 'developer'
    })
   
  } catch (err) {
    return err
  }
}