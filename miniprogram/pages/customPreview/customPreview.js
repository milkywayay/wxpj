Page({
  data: {
    mediaList: [],
    currentIndex: 0
  },

  onLoad(options) {
    const mediaList = JSON.parse(decodeURIComponent(options.mediaList));
    const currentIndex = mediaList.findIndex(media => media.fileID === options.current);
    console.log(mediaList)

    this.setData({
      mediaList,
      currentIndex
    });
  },

  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  }
});