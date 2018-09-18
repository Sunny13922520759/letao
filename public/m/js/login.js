// 入口函数
$(function () {
    var letao = new Letao();
    //调用登录的方法
    letao.login();
})

//创建一个构造函数
var Letao = function () {

};

//原型是一个对象
Letao.prototype = {
    //登录
    login: function () {
        var that=this;
        $('.btn-login').on('tap', function () {
            //  console.log('...');
            var username = $('.username').val();
            var password = $('.password').val();
              // 7. mui写的提示判断
              var check = true;
              // 遍历了所有的输入框
              mui(".mui-input-group input").each(function() {
                  //2. 获取当前输入框的值 若当前input为空，则使用MUI消失提示框提醒 
                  if (!this.value || this.value.trim() == "") {
                      // 3. 获取当前输入框左边的label标签
                      var label = this.previousElementSibling;
                      // 4.调用提示框提示
                      mui.toast("请输入" + label.innerText, { duration: 2000, type: 'div' });
                      // 5. 把check变量变成了false
                      check = false;
                      return false;
                  }
              });
              if(check){
                $.ajax({
                    url: '/user/login',
                    type: 'post',
                    data: {
                        username: username,
                        password: password
                    },
                    success: function (obj) {
                        // console.log(obj);
                        if(obj.error){
                            mui.toast(obj.message+'请注册账号',{ duration:'long', type:'div' }) 
                        }else{
                            // 否则就表示登录成功 返回上一页 但是如果上一页是注册返回首页
                            var returnUrl = that.getQueryString('returnUrl');
                            window.location.href = returnUrl;
                        }
    
                    }
                })
              }
         
        })

    },
      //专门获取地址栏参数的方法
      getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

}