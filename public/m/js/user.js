$(function () {
    var letao = new Letao();
    //调用个人信息的方法
    letao.queryUserMessage();
    letao.exitLogin();
})

var Letao = function () {

};

Letao.prototype = {
    //个人信息
    queryUserMessage: function () {
        // console.log('...');
        $.ajax({
            url: '/user/queryUserMessage',
            success: function (obj) {
                if(obj.error){

                }else{
                    $('.mui-media-body .userName').html(obj.username);
                    $('.mui-media-body .mobile').html(obj.mobile);
                }
                
            }
        })

    },
    exitLogin: function () {
        $('.btn-exit').on('tap', function () {
            // console.log('...');
            $.ajax({
                url: '/user/logout',
                success: function (obj) {
                    // console.log(obj);
                    if (obj.success) {
                        location.href = 'login.html';
                    }

                }
            })

        })
    }
}