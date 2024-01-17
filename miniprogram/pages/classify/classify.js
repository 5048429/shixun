// pages/classify/classify.js
const db = wx.cloud.database(); // 引入云数据库
Page({

    /**
     * 页面的初始数据
     */
    data: {
        asideBars:['证件类', '电子产品', '生活用品', '课本'],
        select:0
    },

    selectBar(e){
      const { index } = e.currentTarget.dataset
      this.setData({
          select:index
      });
      this.fetchItems(index); // 获取选中分类的物品数据
  },

  // 获取物品数据的函数
  fetchItems(categoryIndex){
      const categoryName = this.data.asideBars[categoryIndex];
      db.collection('publish').where({
          firstClassify: categoryName
      }).get({
          success: res => {
              this.setData({
                  items: res.data
              });
          },
          fail: err => {
              console.error("Failed to fetch items:", err);
          }
      });
  },
  // 点击跳转页面
  toDetail(e) {
    const login = wx.getStorageSync('login');
    const { item } = e.currentTarget.dataset;

    if (login) {
        wx.navigateTo({
            url: `../detailPage/detailPage?info=${JSON.stringify(item)}`,
        });
    } else {
        wx.switchTab({
            url: '../me/me',
            success: () => {
                wx.showToast({
                    icon: 'none',
                    title: '请前往我的页面进行登录',
                })
            }
        });
    }
},

    // 跳转到搜索页面
    toSearch(){
        wx.navigateTo({
          url: '../search/search',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if(typeof this.getTabBar === 'function' && this.getTabBar()){
            this.getTabBar().setData({
                select:1
            })
        }
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