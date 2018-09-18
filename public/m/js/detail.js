// 入口函数
$(function () {
    // 实例化一个对象
    var letao = new Letao();
    //调用区域滚动的方法
    letao.initScroll();
    //调用获取传过来的参数的方法
    letao.id = letao.getQueryString('id');
    //调用商品性情数据的方法
    letao.getProductDetail();
    //调用尺码点击事件
    letao.productSize();

})
// 创建一个构造函数
var Letao = function () {


};
// 构造函数的原型是一个对象
Letao.prototype = {
    //轮播图初始化
    initSlide: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },

    //获得商品详情数据
    getProductDetail: function () {
        var that = this;
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: that.id
            },
            success: function (obj) {
                // console.log(obj);
                var slideHtml = template('slideTmp', obj)
                // console.log(slideHtml);
                $('#slide').html(slideHtml);
                // 调用轮播图的初始化
                that.initSlide();
                //获取最大尺码
                var minSize = obj.size.split('-')[0];
                //   console.log(minSize);
                //获取最小尺码
                var maxSize = obj.size.split('-')[1];
                //   console.log(maxSize);
                var size = [];
                for (var i = minSize; i < maxSize; i++) {
                    size.push(parseInt(i));
                }
                // console.log(size);
                obj.size = size;
                // console.log(obj.size);
                var dataHtml = template('detailTmp', obj);
                // console.log(dataHtml);
                $('.product').html(dataHtml);
                mui('.mui-numbox').numbox();
                //调用加入购物车
                that.addCart();

            }
        })
    },
    // 加入购物车
    addCart: function () {
        var that = this;
        $('.shopping-car').on('tap', function () {
            // console.log('...');
            var size = $('.size-num.active').data('size');
            // console.log(size);
            if (!size) {
                mui.toast('请选择尺码', {
                    duration: 'long',
                    type: 'div'
                })
                return;
            }
            var num = mui('.mui-numbox').numbox().getValue();
            // console.log(num);
            if (!num) {
                mui.toast('请选择数量', {
                    duration: 'long',
                    type: 'div'
                })
                return false;
            }
            $.ajax({
                url: '/cart/addCart',
                type: 'post',
                data: {
                    productId: that.id,
                    num: num,
                    size: size
                },
                success: function (obj) {
                    if (obj.error) {
                        //详情页面跳转到登录 让登录完成后回到我的当前的详情页
                        window.location.href = 'login.html?returnUrl=detail.html?id=' + that.id;
                    } else {
                        //加入购物车成功
                        //提示是否加入购物车
                        mui.confirm('添加购物车成功是否要去购物车查看？', '温馨提示', ['yes', 'no'], function (e) {
                            // console.log(e);
                            if(e.index==0){
                                location.href = 'cart.html';
                            }else if(e.index==1){
                                // 点击了no
                                mui.toast('请充值您的余额已不足？ 充值后继续购买',{ duration:'long', type:'div' });
                            }

                        })

                    }


                }
            })






        })
    },
    //尺码点击事件
    productSize: function () {
        $('.product').on('tap', '.size-num', function () {
            // console.log('...');
            $(this).addClass('active').siblings().removeClass('active');

        })
    },
    //初始化下拉刷新
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },

    //专门获取地址栏参数的方法
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

}