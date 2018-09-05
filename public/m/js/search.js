// 入口函数
$(function () {
    // 实例化一个对象
    var history = new Search();
    // 调用添加历史记录的方法
    history.addHistory();
    // 查询历史记录的方法
    history.queryHistory();
    //删除历史记录的方法
    history.removeHistory();
    //调用清空记录的方法
    history.clearHistory();

})
//创建一个构造函数
var Search = function () {

}

//原型是一个对象
Search.prototype = {
    addHistory: function () {
        var that = this;
        //给按钮添加事件
        $('.btn-search').on('tap', function () {
            //    console.log(this);
            var search = $('.search-form .input-search').val();
            //把输入框清空
            $('.search-form .input-search').val(" ");
            // console.log(search);
            //如果输入的内容为空,就什么都不做,直接返回 
            if (!search.trim()) {
                alert('请输入相关商品名称');
                return;
            }

            // 把搜索的内容添加到本地存储li
            //定义一个对象存储数据
            var searchObj = {
                id: 1,
                search: search
            }
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            //如果本地存储有记录,并且记录大于0,就让其id在原有的id上+1
            if (historyList.length > 0) {
                searchObj.id = historyList[historyList.length - 1].id + 1;
            }
            // 把对象放进数组中
            historyList.push(searchObj);
            //添加到本地存储里
            localStorage.setItem('historyList', JSON.stringify(historyList));

            that.queryHistory();

        })

    },
    queryHistory: function () {
        //获得本地存储的数据
        var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
        // 把最新的数据放在最前面
        historyList = historyList.reverse();
        //调用模板
        var html = template('searchTmp', {
            list: historyList
        });
        // 渲染到页面上
        $('.search-history .content ul').html(html);
    },
    //删除历史记录
    removeHistory: function () {
        var that = this;
        //事件委托
        $('.search-history .content ul').on('tap', '.btn-delete', function () {
            // console.log(this);
            var id = $(this).data('id');
            // console.log(id);
            //获得本地存储的数据
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            for (var i = 0; i < historyList.length; i++) {
                if (historyList[i].id == id) {
                    //删除historyList记录
                    historyList.splice(i, 1);
                }
            }
            localStorage.setItem('historyList', JSON.stringify(historyList));
            //获得的本地存储渲染到页面上
            that.queryHistory();


        })
    },
    // 清空历史记录
    clearHistory: function () {

        var that = this;
        $('.btn-clear').on('tap', function () {
            //获得本地存储数据
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            // 移除本地存储数据
            localStorage.removeItem('historyList');

            that.queryHistory();
        })



    }


}