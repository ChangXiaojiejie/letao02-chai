$(function () {
    var currentPage = 1
    var pageSize = 4

    render()
    //渲染
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                //模板
                $('tbody').html(template('firstTmp', info))


                // 配置分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, // 当前版本号
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    //按钮点击事件
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page
                        render()
                    }
                })

            }
        })
    }

    // 添加分类
    $('.btn-add').on('click', function () {
        //显示模态框
        $('#addModal').modal('show')
    })

    //表单检验
    // $('#form').bootstrapValidator({
    //     //2. 指定校验时的图标显示，默认是bootstrap风格
    //     feedbackIcons: {
    //         valid: 'glyphicon glyphicon-ok',
    //         invalid: 'glyphicon glyphicon-remove',
    //         validating: 'glyphicon glyphicon-refresh'
    //     },
    //     fields: {
    //         categoryName: {
    //             //规则
    //             validators: {
    //                 //不能为空
    //                 notEmpty: {
    //                     //提示文本
    //                     message: '请输入一级分类名称'
    //                 }
    //             }
    //         }
    //     }
    // })
    $('#form').bootstrapValidator({

        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },

        // 校验字段
        fields: { // input框中需要配置 name
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    });

    //添加功能
    $('#form').on('success.form.bv', function (e) {
        //阻断
        e.preventDefault();
        // console.log(22);


        $('#addBtn').on('click', function () {
            $.ajax({
                type: 'post',
                url: '/category/addTopCategory',
                data: $('#form').serialize(),
                dataType: 'json',
                success: function (info) {
                    // console.log(info);
                    if (info.success) {
                        // 关闭模态框
                        $('#addModal').modal('hide')
                        //
                        render()
                    }
                }
            })
        })
    })



})