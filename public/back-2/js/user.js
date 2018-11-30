$(function () {

    var currentPage = 1; //当前页
    var pageSize = 4; //每页条数

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);

                $('tbody').html(template('userTmp', info));

                // 分页配置
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: 1, //当前页
                    totalPages: 10, //总页数
                    size: "small", //设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                    }
                })
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: '3',
                    currentPage: info.page, // 当前页
                    totalPages: Math.ceil(info.total / info.size),

                    //为按钮绑定点击事件
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        //重新渲染页面
                        render();
                    }
                })

            }
        })
    }

    //禁用启用功能

    $('tbody').on('click', '.btn', function () {
        // 1.显示模态框
        $('#userModal').modal('show');

        //记录id和状态
        id = $(this).parent().data('id');
        // 根据类名进行判断
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    })
    // 2.
    $('#userBtn').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/user/updateUser',
            data: {
                id: id,
                isDelete: isDelete
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    //关闭模态框
                    $('#userModal').modal('hide');
                    //重新渲染
                    render();
                }

            }
        })
    })



})