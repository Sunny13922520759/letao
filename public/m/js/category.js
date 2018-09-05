// 入口函数
$(function () {
    // 实例化一个对象
    var category = new Letao();
    // 调用滚动的初始化
    category.scrollDown();
    //调用获得左边分类
    category.getCategory();
    //调用左边分类的点击事件
    category.categoryClick();
    // 调用右边获得品牌
    category.getBrand(1);

})

// 创建一个构造函数
var Letao = function () {

}
//原型是一个对象
Letao.prototype = {
    //右边品牌向下滑动初始化
    scrollDown: function () {
        mui('.mui-scroll-wrapper').scroll({
            // deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006

            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: true, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹

        });
    },
    //获得分类
    getCategory: function () {
        // 发送异步请求
        $.ajax({
            url: '/category/queryTopCategory',
            success: function (obj) {
                // console.log(obj);
                var html = template('categoryTmp', {
                    list: obj.rows
                });
                // console.log(html);
                $('.category-left ul').html(html);
            }
        })
    },
    // 分类的点击事件
    categoryClick: function (id) {
        //给ul点击事件,事件委托
        var that = this;
        // console.log(this);

        $('.category-left ul').on('tap', 'li a', function () {
            // console.log(this);
            var id = $(this).data('id');
            that.getBrand(id);
            $(this).parent().addClass('active').siblings().removeClass('active');


        })

    },
    //获得品牌的事件
    getBrand: function (id) {
        $.ajax({
            url: '/category/querySecondCategory',
            data: {
                'id': id
            },
            success: function (obj) {
                // console.log(obj);
                var html=template('brandTmp',{list:obj.rows});
                // console.log(html);
                $('.category-right .mui-row').html(html);
            }
        })
    }

}