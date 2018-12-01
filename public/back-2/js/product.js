$(function () {
    var currentPage = 1
    var pageSize = 4

    //专门接收图片的数组
    var picArr = []

    render()
    //页面渲染
    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                //
                // console.log(info)

                $('tbody').html(template('productTmp', info))

                // 进行分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, // 版本号
                    currentPage: info.page, // 当前页
                    totalPages: Math.ceil(info.total / info.size), // 总页数
                    // 页码点击事件
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    }

    //显示添加模态框
    $('.btn-add').on('click', function () {
        $('#addModal').modal('show')

        //获取二级菜单
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
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
    })

    // 3. 给下拉列表的 a 添加点击事件 (事件委托注册)
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取文本, 赋值给按钮
        var txt = $(this).text()
        $('#dropdownText').text(txt)
        // 获取id, 赋值给隐藏域
        var id = $(this).data('id')
        $('[name="brandId"]').val(id)
        // 将隐藏域的校验状态, 更新成 VALID
        $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID')
    })

    // 4. 配置文件上传插件
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data);
            // console.log(data.result);
            var picObj = data.result
            picArr.unshift(picObj)
            // 将上传的图片对象(图片地址和名称) 添加到数组最前面
            var picUrl = picObj.picAddr
            // console.log(picUrl);

            $('#imgBox').prepend('<img src="' + picUrl + '" style="width: 100px;">')

            if (picArr.length > 3) {
                // 删除数组最后一项
                picArr.pop()
                // 图片同步删除
                $('#imgBox img:last-of-type').remove()
            }
            // 如果文件上传满了 3张, 当前picStatus的校验状态, 更新成 VALID
            if (picArr.length == 3) {
                $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID')
            }
            if (picArr.length < 3) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "INVALID");
            }
        }
    });

    // 5.表单校验
    $('#form').bootstrapValidator({
        // 重置排除项, 都校验, 不排除
        excluded: [],

        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },

        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 xx-xx格式, xx为两位数字, 例如 36-44'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d*$/,
                        message: '商品价格, 必须数字'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d*$/,
                        message: '商品价格, 必须是数字'
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请上传3张图片'
                    }
                }
            },

        }
    })

    // 6.表单校验成功,
    $('#form').on('success.form.bv', function (e) {
        //阻断
        e.preventDefault()

        var form = $('#form').serialize()
        // 还需要拼接上图片数据
        // 多个参数之间, 通过 & 分隔, 每个键值对, 通过 = 分开
        // paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        form += '&picName1=' + picArr[0].picName + '&picAddr1=' + picArr[0].picAddr;
        form += '&picName2=' + picArr[1].picName + '&picAddr2=' + picArr[1].picAddr;
        form += '&picName3=' + picArr[2].picName + '&picAddr3=' + picArr[2].picAddr;

        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: form,
            dataType: 'json',
            success: function (info) {
                console.log(info);
                // 关闭模态框
                $('#addModal').modal('hide')
                currentPage = 1
                render()

                //重置
                $('#form').data("bootstrapValidator").resetForm(true)
                $('#dropdownText').text('请输入二级分类')
                picArr = []
                $('#imgBox img').remove()
            }
        })
    })



})