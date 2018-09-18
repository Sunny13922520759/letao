// 入口函数
$(function () {
    var letao = new Letao();
    //调用获得商品数据的方法
    letao.initPullRefresh();
    //编辑购物车方法
    letao.editCart();
    //删除购物车方法
    letao.deleteCart();
    //调用总额的方法
    letao.totalPrice();


})

//创建一个构造函数
var Letao = function () {

}
//原型是一个对象
Letao.prototype = {
    page: 1,
    pageSize: 2,

    //向下刷新和向上加载的方法
    initPullRefresh: function () {
        var that = this;
        mui.init({
            pullRefresh: {
                container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                //向下刷新
                down: {
                    auto: true,
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    callback: function () {
                        auto: true, //可选,默认false.首次加载自动下拉刷新一次
                        //延时
                        setTimeout(function () {
                            that.page = 1;
                            $.ajax({
                                url: '/cart/queryCartPaging',
                                data: {
                                    page: that.page,
                                    pageSize: that.pageSize
                                },
                                success: function (obj) {
                                    // console.log(obj);
                                    if (obj.error) {
                                        location.href = 'login.html?returnUrl=cart.html';
                                    } else {
                                        var html = template('cartTmp', obj);
                                        $('.cartList>.mui-table-view').html(html);
                                        //停止向下刷新
                                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                        mui('#refreshContainer').pullRefresh().refresh(true);
                                    }
                                }

                            })

                        }, 500)
                    }
                },
                up: {
                    callback: function () {
                        setTimeout(function () {
                            that.page++;
                            $.ajax({
                                url: '/cart/queryCartPaging',
                                data: {
                                    page: that.page,
                                    pageSize: that.pageSize
                                },
                                success: function (obj) {
                                    // console.log(obj);
                                    if (obj.data instanceof Array && obj.data.length > 0) {
                                        var html = template('cartTmp', obj);
                                        $('.cartList>.mui-table-view').append(html);
                                        //停止向上加载
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();

                                    } else {
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }


                                }
                            })

                        }, 500)

                    }
                }
            }
        });
    },

    editCart: function () {
        $('.cartList').on('tap', '.btn-edit', function () {
            // console.log('...');
            // 获取当前点击的编辑按钮的父元素的父元素 li
            var li = this.parentNode.parentNode;
            var product = {
                productSize: $(this).parent().data('product-size'),
                size: $(this).parent().data('size'),
                productNum: $(this).parent().data('product-number'),
                num: $(this).parent().data('num'),
                id: $(this).parent().data('id')
            };
            // console.log(product);
            var minSize = product.productSize.split('-')[0];
            var maxSize = product.productSize.split('-')[1];
            // console.log(minSize);
            // console.log(maxSize);
            var sizeArr = [];
            for (var i = minSize; i <= maxSize; i++) {
                sizeArr.push(parseInt(i));
            }
            // console.log(sizeArr);
            product.productSize = sizeArr;
            // console.log(product);
            var html = template('editTmp', product);
            html = html.replace(/[\r\n]/g, "");

            //弹出确认框

            mui.confirm(html, '编辑商品标题', ['确定', '取消'], function (e) {
                // console.log(e);
                if (e.index == 0) {
                    // 编辑成功
                    //获得尺码和数量
                    var size = $('.size-num.active').data('size');
                    //获得数量
                    var num = mui('.mui-numbox').numbox().getValue();
                    $.ajax({
                        url: "/cart/updateCart",
                        type: 'post',
                        data: {
                            id: product.id,
                            size: size,
                            num: num
                        },
                        success: function (obj) {
                            // console.log(obj);
                            if (obj.success) {
                                // 修改购物车成功
                                mui.toast('编辑成功');
                                // 收回滑动列表
                                mui.swipeoutClose(li);
                                $(li).find('.product-size>span').html(size);
                                $(li).find('.product-num>span').html(num);
                                //更改自定义属性值
                                $(li).find('.mui-slider-right').data('size', size);
                                $(li).find('.mui-slider-right').data('num', num);

                            } else {
                                // 编辑失败
                                location.href = 'login.html?=returnUrl=cart.html';
                            }

                        }
                    })


                } else if (e.index == 1) {
                    mui.swipeoutClose(li);
                }
            });
            //初始化输入框可以选择数量
            mui('.mui-numbox').numbox().getValue();
            $('.size-num').on('tap', function () {
                $(this).addClass('active').siblings().removeClass('active');
            })

        })
    },
    deleteCart: function () {
        $('.cartList').on('tap', '.btn-delete', function () {
            // console.log('...');
            var li = this.parentNode.parentNode;
            var id = $(this).parent().data('id');
            // console.log(id);
            mui.confirm('您确定要删除吗?', '温馨提示', ['确认', '取消'], function (e) {
                // console.log(e);
                if (e.index == 0) {
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: id
                        },
                        success: function (obj) {
                            // console.log(obj);
                            if (obj.success) {
                                // 删除成功
                                li.parentNode.removeChild(li);

                            } else {
                                // 删除失败
                                //可能未登录
                                location.href = 'login.html?=returnrUL=cart.html';
                            }

                        }
                    })
                }
            })

        })
    },
    // 订单总额
    totalPrice: function () {
        $('.cartList').on('change', 'input[type="checkbox"]', function () {
            // console.log('...');
            // console.log(e);
            var sum = 0;
            var checkboxs = $('input[type="checkbox"]:checked');
            checkboxs.each(function (index, ele) {
                // console.log(index);
                // console.log(ele);
                var price = $(ele).data('price');
                var num = $(ele).data('num');
                // console.log(price);
                // console.log(num);
                var total = price * num;
                sum += total;
            })
            sum = sum.toFixed(2);
            $('.cart_order>span').html('¥' + sum);
        })
    }

};