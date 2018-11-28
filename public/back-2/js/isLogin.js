//判断是否登录过页面

$(function () {
    $.ajax({
        type: 'get',
        url: '/employee/checkRootLogin',
        dataType: 'json',
        success: function (info) {
            // console.log(info);
            if (info.success) {
                console.log('用户已经登录过 ');

            }
            if (info.error) {
                location.href = 'login.html';
            }

        }
    })
})