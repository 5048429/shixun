const db = wx.cloud.database();

Page({
    data: {
        search_input: '',  // 延时响应的值
        _search_input: '',  // 即时响应的值
        searchLog: [],      // 用于储存搜索历史的数组
        searchResults: [],  // 搜索结果数组
        t: null             // 用于防抖的定时器
    },

    // Function to perform database search
    searchItems(searchKey) {
        db.collection('publish').where({
            name: db.RegExp({
                regexp: searchKey,
                options: 'i', // Case-insensitive search
            })
        }).get({
            success: res => {
                this.setData({
                    searchResults: res.data
                });
            },
            fail: err => {
                console.error('Search failed:', err);
            }
        });
    },

    // Function to handle search input changes with debounce
    getSearch(e) {
        this.setData({
            _search_input: e.detail.value
        });

        if (this.data.t) clearTimeout(this.data.t);
        this.data.t = setTimeout(() => {
            this.setData({
                search_input: e.detail.value
            });

            let searchLog = wx.getStorageSync('searchLog') || [];
          if (this.data.search_input.trim()) {
            searchLog.unshift(this.data.search_input);
            searchLog = [...new Set(searchLog)].slice(0, 10);
            wx.setStorageSync('searchLog', searchLog);
            this.setData({
            searchLog
            });
            this.searchItems(this.data.search_input);
            }
            }, 1500);
            },
  
    // Function to clear search input
    deleteSearch() {
        this.setData({
            search_input: '',
            _search_input: ''
        });
    },

    // Function to clear search history
    deleteSearchLog() {
        this.setData({
            searchLog: []
        });
        wx.removeStorageSync('searchLog');
    },
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
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 将搜索历史存入缓存中
        const searchLog = wx.getStorageSync('searchLog')
        this.setData({
            searchLog
        })
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