const cloud = require('wx-server-sdk');
const request = require('request');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const { access_token, ...postData } = event;

  const url = `https://api.weixin.qq.com/wxa/sec/order/upload_shipping_info?access_token=${access_token}`;

  return new Promise((resolve, reject) => {
    request.post({
      url: url,
      json: true,
      body: {
        order_key: postData.order_key,
        logistics_type: postData.logistics_type,
        delivery_mode: postData.delivery_mode,
        shipping_list: postData.shipping_list,
        upload_time: postData.upload_time,
        payer: postData.payer
      }
    }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        if (response.statusCode === 200) {
          resolve(body);
        } else {
          reject(`Request failed with status code ${response.statusCode}`);
        }
      }
    });
  });
};