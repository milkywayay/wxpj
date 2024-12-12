const db = wx.cloud.database();
Page({
  data: {
    proofs: [{ id: 1, imgurl: [], platform: '' }], // 初始凭证数量，至少包含一个凭证，并初始化 platform 字段
  },

  onLoad(e) {
    console.log(e.reprintID_inDiscuss);
    this.setData({
      reprintID_inDiscuss: e.reprintID_inDiscuss
    });
  },

  add: function () {
    const newProofs = this.data.proofs.concat([{
      id: this.data.proofs.length + 1,
      imgurl: []
    }]);
    this.setData({
      proofs: newProofs
    });
  },

  delete: function(event) {
    const id = event.currentTarget.dataset.id;
    if (this.data.proofs.length <= 1) {
      wx.showToast({
        title: '至少保留一个凭证',
        icon: 'none'
      });
      return;
    }
    const newProofs = this.data.proofs.filter(proof => proof.id !== id);
  
    // 重新编号并保留 platform 字段
    const renumberedProofs = newProofs.map((proof, index) => ({
      id: index + 1,
      imgurl: proof.imgurl,
      platform: proof.platform || ''  // 保留 platform 字段
    }));
  
    this.setData({
      proofs: renumberedProofs
    });
  },

  upload_photo(e) {
    let that = this;
    const proofId = e.currentTarget.dataset.id;
    const proofIndex = that.data.proofs.findIndex(proof => proof.id === proofId);

    if (proofIndex === -1) {
      return;
    }

    if (that.data.proofs[proofIndex].imgurl.length < 9) {
      wx.chooseMedia({
        count: 9 - that.data.proofs[proofIndex].imgurl.length,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          console.log("选择的图片/视频", res);
          wx.showToast({
            title: '正在加载',
            duration: 3000,
            icon: "loading"
          });
          // 使用 Promise.all 处理所有上传操作
          let uploadPromises = res.tempFiles.map(file => {
            console.log(file);
            if (file.fileType == "image") {
              return wx.cloud.uploadFile({
                cloudPath: 'talk/discuss/' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000) + '.png', // 避免重复文件名
                filePath: file.tempFilePath,
              }).then(result => ({
                fileID: result.fileID,
                fileType: 'image'
              }));
            } else {
              return wx.cloud.uploadFile({
                cloudPath: 'talk/discuss/' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000) + '.mp4', // 避免重复文件名
                filePath: file.tempFilePath,
              }).then(result => ({
                fileID: result.fileID,
                fileType: 'video'
              }));
            }
          });

          Promise.all(uploadPromises).then(results => {
            let newImgurl = that.data.proofs[proofIndex].imgurl.concat(results);
            let newProofs = [...that.data.proofs];
            newProofs[proofIndex].imgurl = newImgurl;
            that.setData({
              proofs: newProofs,
            });
            console.log("添加成功", that.data.proofs);
          }).catch(error => {
            console.error("上传失败", error);
          });
        }
      })
    }
  },

  confirm() {
    const all_imgurl = this.data.proofs.map(proof => ({
      id: proof.id,
      platform: proof.platform, // 添加平台信息
      imgurl: proof.imgurl
    }));
    db.collection('reprint')
      .where({
        reprintID_inDiscuss: this.data.reprintID_inDiscuss
      })
      .update({
        data: {
          proofs: all_imgurl
        }
      })
      .then(res => {
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
        console.log('Database update response:', res);
      })
      .catch(err => {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        console.error('Database update error:', err);
      });
  },

  viewFull(event) {
    console.log(event)
    const current = event.currentTarget.dataset.photo;
    const index = event.currentTarget.dataset.proofId;
    const proof = this.data.proofs.find(item => item.id === index)
    const Urls = proof.imgurl
    let urls = []
    Urls.map(item => {
      if (item.fileType == "image") {
        urls.push(item.fileID)
      }
    })
    console.log(urls)

    // const mediaList = proof.imgurl.map(media => ({
    //   fileID: media.fileID,
    //   fileType: media.fileType
    // }));
    // console.log(mediaList)
    // wx.navigateTo({
    //   url: `/pages/customPreview/customPreview?current=${current}&mediaList=${encodeURIComponent(JSON.stringify(mediaList))}`
    // })

    wx.previewImage({
      current: current,
      urls: urls
    });
  },
  input(e) {
    const proofId = e.currentTarget.dataset.id;
    const platform = e.detail.value;
    const proofIndex = this.data.proofs.findIndex(proof => proof.id === proofId);
  
    if (proofIndex !== -1) {
      const newProofs = [...this.data.proofs];
      newProofs[proofIndex].platform = platform;
      this.setData({
        proofs: newProofs
      });
    }
  }

  

});