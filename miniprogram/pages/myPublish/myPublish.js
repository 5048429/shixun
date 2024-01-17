// pages/myPublish/myPublish.js

import { formatTime } from '../../utils/index'; //导入时间格式化函数

const db = wx.cloud.database();

Page({
    data: {
        tabList: ['寻主', '寻物'],
        list: [],
        select: 0
    },

    getTab(e) {
        const select = e.detail;
        this.setData({
            select
        });
        this.fetchData();
    },

    toDetail(e) {
        let { item } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../detailPage/detailPage?info=${JSON.stringify(item)}`
        });
    },

    deleteItem(e) {
      const { id } = e.currentTarget.dataset;
      wx.showModal({
          title: '确认',
          content: '确定要删除这个物品吗？',
          success: res => {
              if (res.confirm) {
                  // 首先从 publish 数据库中获取记录
                  db.collection('publish').doc(id).get({
                      success: res => {
                          const itemData = res.data;
  
                          // 删除云存储中的图片
                          if (itemData.imgList && itemData.imgList.length) {
                              wx.cloud.deleteFile({
                                  fileList: itemData.imgList,
                                  success: delRes => {
                                      console.log('云文件删除成功', delRes);
                                  },
                                  fail: console.error
                              });
                          }
  
                          // 删除 publish 数据库中的记录
                          db.collection('publish').doc(id).remove({
                              success: () => {
                                  wx.showToast({
                                      title: '删除成功',
                                  });
                                  this.fetchData(); // 重新加载数据
  
                                  // 删除 collection 数据库中的相关记录
                                  db.collection('collection').where({
                                      id: id
                                  }).remove();
                              },
                              fail: console.error
                          });
                      },
                      fail: console.error
                  });
              }
          }
      });
  },
  
  fetchData() {
      const { select } = this.data;
      const openid = wx.getStorageSync('openid');
      db.collection('publish').where({
          type: String(select),
          _openid: openid
      }).get({
          success: res => {
              this.setData({
                  list: res.data.map(item => ({
                      ...item,
                      time: formatTime(item.time)
                  }))
              });
          },
          fail: console.error
      });
  },

    onLoad() {
        this.fetchData();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.fetchData();
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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