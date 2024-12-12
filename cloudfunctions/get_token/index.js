const cloud = require('wx-server-sdk');
const request = require('request');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = (event, context) => {
  return new Promise((resolve, reject) => {
    const appid = 'wx79c001465538716e'; 
    const secret = '8af91aaab25590f3f093e9f9ccfe312e'; 
    const token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;

    // https://api.weixin.qq.com/wxa/sec/order/upload_shipping_info?access_token=ACCESS_TOKEN

    


    request.get(token_url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};