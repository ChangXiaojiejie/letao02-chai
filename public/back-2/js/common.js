// 进度条
$(document).ajaxStart(function () {
    NProgress.start();
})
$(document).ajaxStop(function () {
    setTimeout(function () {
        NProgress.done();
    }, 1000);
})


/**
 * 1.二级分类显示隐藏 
 * 2.实现侧边栏隐藏显示功能
 */

$(function () {
    //1.
    $('.category').on('click', function () {
        $(this).next().stop().slideToggle();
    })


    //2.
    $('.icon_left').on('click', function () {
        // console.log(11);

        $('.lt_aside').toggleClass("hidemenu");
        $('.lt_main').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
    })
})


// 退出功能

$(function () {
    $('.icon_right').on('click', function () {
        // console.log(22);
        $('#logouModal').modal('show');

        $('#logouBtn').on('click', function () {
            // console.log(22);
            $.ajax({
                type: 'get',
                url: '/employee/employeeLogout',
                dataType: 'json',
                success: function (info) {
                    // console.log(info);
                    if (info.success) {
                        location.href = 'login.html';
                    }
                }
            })

        })
    })
})