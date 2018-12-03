$(function () {

    // 渲染一级分类
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        dataType: 'json',
        success: function (info) {
            // console.log(info);
            $('.lt_category_left ul').html(template('leftTmp', info))

            // 渲染默认页
            renderById(info.rows[0].id)
        }
    })

    // 给a注册点击事件 根据id渲染二级分类
    $('.lt_category_left').on('click', 'a', function () {
        // 高亮效果
        $('.lt_category_left ul a').removeClass('current')
        $(this).addClass('current')

        // 获取id
        var id = $(this).data('id')

        renderById(id)
    })


    function renderById(id) {
        //渲染二级分类
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                $('.lt_category_right ul').html(template('rightTmp', info))

            }
        })
    }

})