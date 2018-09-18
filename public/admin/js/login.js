$(function () {
    var letao = new Letao();
    //点击登录
    letao.employeeLogin();

})

var Letao = function () {

};

Letao.prototype = {
    // 点击登录
    employeeLogin: function () {
        $('.btn-block').click(function () {
            // console.log('...');()
            var username = $('.username').val();
            var password = $('.password').val();
            // console.log(username);
            // console.log(password);
            if(!username){
              $('.alert').show().html('用户名为空,请输入用户名');

            }
            if(!password){
                $('.alert').show().html('密码为空,请输入密码');
            }

            $.ajax({
                type: 'post',
                url: '/employee/employeeLogin',
                data: {
                    username: username,
                    password: password
                },
                success: function (obj) {
                    // console.log(obj);
                    if(obj.error){
                        $('.alert').show().html('用户名或密码错误,请重新输入用户名和密码');
                    }else{
                        location.href='index.html';
                    }

                }
            })


        })
    }
}