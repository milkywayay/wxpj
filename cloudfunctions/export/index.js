const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');

cloud.init();

exports.main = async (event, context) => {
  const { collectionName, where } = event;

  try {
    const db = cloud.database();
    const collection = db.collection(collectionName);

    // 查询数据库数据
    const queryRes = await collection.where(where || {}).get();
    const data = queryRes.data;

    if (data.length === 0) {
      return { code: -1, message: '查询结果为空' };
    }

    // 提取表头和数据内容
    const headers = Object.keys(data[0]); // 取第一条数据的字段作为表头
    const content = data.map(item => headers.map(header => item[header] || '')); // 按字段提取每条数据

    // 创建 Excel 数据，添加表头
    const excelData = [headers, ...content];

    // 生成 Excel 文件
    const buffer = xlsx.build([{ name: '导出数据', data: excelData }]);

    // 上传 Excel 文件到云存储
    const file = await cloud.uploadFile({
      cloudPath: `export/${Date.now()}.xlsx`,
      fileContent: buffer,
    });

    return { code: 0, message: '文件导出成功', fileID: file.fileID };
  } catch (error) {
    console.error('导出文件失败：', error);
    return { code: -1, message: '导出失败', error };
  }
};