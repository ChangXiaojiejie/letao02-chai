$(function () {
    var currentPage = 1
    var pageSize = 4

    render()

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                $('tbody').html(template('secondTmp', info))

                // 配置分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),

                    onPageClicked: function (a, b, c, page) {
                        currentPage = page
                        render()
                    }
                })
            }
        })
    }

    //添加功能 

    // 1.显示,模态框
    $('.btn-add').on('click', function () {
        $('#addModal').modal('show')
    })

    // 2.渲染下拉菜单
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategoryPaging',
        data: {
            page: 1,
            pageSize: 100
        },
        dataType: 'json',
        success: function (info) {
            // console.log(info);

            $('.dropdown-menu').html(template('dropdownTmp', info))

        }
    })



    // 3.
    $('.dropdown-menu').on('click', 'a', function () {

        var txt = $(this).text()

        $('.dropdownText').text(txt)

        id = $(this).data('id')
        // 设置隐藏域id
        $('[name="categoryId"]').val(id)

        // 
        $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID')

    })

    //  4. 配置文件上传插件, 让插件发送异步文件上传请求
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            console.log(data);
            console.log(data.result);

            var picUrl = data.result.picAddr
            $('#imgBox img').attr('src', picUrl)


            // 设置隐藏域地址
            $('[name="brandLogo"]').val(picUrl)

            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')

        }
    })



    // 5. 添加表单校验功能
    $('#form').bootstrapValidator({
        // 重置排除项
        excluded: [],
        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },

        // 校验字段
        fields: { // input框中需要配置 name
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类名称"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图片"
                    }
                }
            }
        }
    });

    // 6.
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {

                // 关闭
                $('#addModal').modal('hide')

                render()
            }
        })
    })





})