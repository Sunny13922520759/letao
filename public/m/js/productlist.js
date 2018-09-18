// 入口函数
$(function () {
    // 实例化一个对象
    var letao = new Letao();
    //获得url传过来的字符串
    letao.getQueryString('search');
    //调用获得商品列表的方法
    letao.getProductList();
    //调用搜索商品列表的方法
    letao.searchProductlist();
    //调用商品的排序的方法
    letao.productListSort();
    //调用初始化向下刷新和向上加载的方法
    letao.initPullRefresh();
    //调用购买点击的方法
    letao.shoppingBuy();

})
// 创建一个构造函数
var Letao = function () {

};
// 构造函数的原型是一个对象
Letao.prototype = {
    search: '',
    // 定义页容量的大小
    pageSize: 2,
    //定义页数的变量
    page: 1,

    //专门获取地址栏参数的方法
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    //获得商品列表
    getProductList: function () {

        var that = this;
        that.page = 1;
        $.ajax({
            url: '/product/queryProduct',
            data: {
                page: that.page,
                pageSize: that.pageSize,
                proName: that.search
            },
            success: function (obj) {
                // console.log(obj);
                // 调用模板生成html
                var html = template('productlistTmp', {
                    list: obj.data
                });
                // 把生成的html放到页面上
                $('.product-content .mui-row').html(html);
                // 还要重新加载一次,重置的时候会默认自动触发一次上拉加载
                mui('#pullrefresh').pullRefresh().refresh(true);

            }
        })
    },


    // 搜索商品列表
    searchProductlist: function () {
        var that = this;
        $('.btn-search').on('tap', function () {
            that.search = $('.input-search').val();
            $('.input-search').val('');
            if (!that.search.trim()) {
                return;
            }
            that.page = 1;
            $.ajax({
                url: '/product/queryProduct',
                data: {
                    page: that.page,
                    pageSize: that.pageSize,
                    proName: that.search
                },
                success: function (obj) {
                    // console.log(obj);
                    var html = template('productlistTmp', {
                        list: obj.data
                    });
                    // console.log(html);
                    $('.product-content .mui-row').html(html);
                    // 还要重新加载一次,重置的时候会默认自动触发一次上拉加载
                    mui('#pullrefresh').pullRefresh().refresh(true);
                }
            })

        })
    },
    //商品的排序
    productListSort: function () {
        var that = this;
        $('.product-title a').on('tap', function () {
            var sortType = $('.product-title a').data('sort-type');
            var sort = $('.product-title a').data('sort');
            if (sort == 1) {
                sort = 2;
            } else {
                sort = 1
            };
            that.page = 1;
            //  更新当前a排序的顺序
            $(this).data('sort', sort);
            if (sortType == 'price') {
                //发送请求
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        page: that.page,
                        pageSize: that.pageSize,
                        proName: that.search,
                        price: sort
                    },
                    success: function (obj) {
                        // console.log(obj);
                        var html = template('productlistTmp', {
                            list: obj.data
                        });
                        // console.log(html);
                        $('.product-content .mui-row').html(html);
                        // 还要重新加载一次,重置的时候会默认自动触发一次上拉加载
                        mui('#pullrefresh').pullRefresh().refresh(true);
                    }
                })

            } else {
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        page: that.page,
                        pageSize: that.pageSize,
                        proName: that.search,
                        num: sort
                    },
                    success: function (obj) {
                        // console.log(obj);
                        var html = template('productlistTmp', {
                            list: obj.data
                        });
                        // console.log(html);
                        $('.product-content .mui-row').html(html);
                        // 还要重新加载一次,重置的时候会默认自动触发一次上拉加载
                        mui('#pullrefresh').pullRefresh().refresh(true);
                    }
                })
            }
        })
    },
    //初始化向下刷新和向上加载
    initPullRefresh: function () {
        var that = this;
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                //向下刷新
                down: {
                    contentrefresh: '正在刷新...',

                    callback: function () {
                        // console.log(this);
                        setTimeout(function () {
                            that.page = 1;
                            $.ajax({
                                url: '/product/queryProduct',
                                data: {
                                    page: that.page,
                                    pageSize: that.pageSize,
                                    proName: that.search
                                },
                                success: function (obj) {
                                    // console.log(obj);
                                    var html = template('productlistTmp', {
                                        list: obj.data
                                    });
                                    // console.log(html);
                                    $('.product-content .mui-row').html(html);
                                    // $('.mask').show();
                                    //注意，加载完新数据后，必须执行如下代码，注意：若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后
                                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                                    // 还要重新加载一次,重置的时候会默认自动触发一次上拉加载
                                    mui('#pullrefresh').pullRefresh().refresh(true);
                                  



                                }
                            })

                        }, 1000)
                    }
                },
                // 向上加载
                up: {
                    contentrefresh: '正在加载...',
                    callback: function () {
                        that.page++;
                        setTimeout(function () {
                            $.ajax({
                                url: '/product/queryProduct',
                                data: {
                                    page: that.page,
                                    pageSize: that.pageSize
                                },
                                success: function (obj) {
                                    //如果有数据就添加,没有就停止加载
                                    if (obj.data.length > 0) {
                                        // console.log(obj);
                                        var html = template('productlistTmp', {
                                            list: obj.data
                                        });
                                        // console.log(html);
                                        $('.product-content .mui-row').append(html);
                                        //注意，加载完新数据后，必须执行如下代码，注意：若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后
                                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();

                                    } else {
                                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                                    }



                                }
                            })

                        }, 1000)

                    }
                }
            }
        });
    },
    //点击立即购买
    shoppingBuy: function () {
        $('.product-content .mui-row').on('tap', '.btn-buy', function () {
            var id = $('.btn-buy').data('id');
            // console.log(id);
            location.href = './detail.html?id=' + id;

        })
    }

}