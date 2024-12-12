const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;

    const result = await cloud.openapi.subscribeMessage.send({
      "touser": event.openid,
      "page": '/pages/seller/commodity',
      "data": {
        "thing2": {
          "value": event.payee
        },
        "thing3":{
          "value":event.auditor
        },
        "phrase4":{
          "value":event.audit
        },
        "time5":{
          "value":formattedDate
        },
        "thing1":{
          "value":event.audit_type
        }
      },
      "templateId": 'b3FdHt8aLR3BKmOlRLK_drVODEYrGrIVq4N2hYllq24',
      "miniprogramState": 'developer'
    })
   
  } catch (err) {
    return err
  }
}