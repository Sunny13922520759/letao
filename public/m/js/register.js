//入口函数
$(function () {
    //实例化一个对象
    var letao = new Letao();
    //调用注册的方法
    letao.register();
    //获取验证码
    letao.vscode();
})
//创建一个构造函数
var Letao = function () {

}
//原型shi一个对象
Letao.prototype = {
    vscode: null,
    //注册
    register: function () {
        var that = this;
        $('.btn-register').on('tap', function () {
            var mobile = $('.mobile').val();
            var username = $('.username').val();
            var password = $('.password').val();
            var confirmNum = $('.confirmNum').val();
            var security_code = $('.security-code').val();
            //开关思想
            var check = true;
            mui(".mui-input-group input").each(function () {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.alert('请输入' + label.innerText + "不允许为空");
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 

            if (check) {
                if (password != confirmNum) {
                    mui.toast('两次输入的密码不一致', {
                        duration: 'long',
                        type: 'div'
                    })
                    return false;
                }
                if (that.vscode != security_code) {
                    mui.toast('验证码输入错误', {
                        duration: 'long',
                        type: 'div'
                    })
                    return false;
                }
                //发送请求
                $.ajax({
                    url: '/user/register',
                    type: 'post',
                    data: {
                        username: username,
                        password: password,
                        vCode: security_code,
                        mobile: mobile
                    },
                    success: function (obj) {
                        if(obj.error){
                            mui.toast('注册失败',{ duration:'long', type:'div' }) 
                            return false;
                        }else{
                            location.href='login.html';
                        }

                    }
                })
            }


        })
    },
    //获取验证码
    vscode: function () {
        var that = this;
        $('.btn-scode').on('tap', function () {
            // console.log('...');
            $.ajax({
                url: '/user/vCode',
                success: function (obj) {
                    console.log( obj.vCode);
                    
                    that.vscode = obj.vCode;


                }
            })

        })
    }
}