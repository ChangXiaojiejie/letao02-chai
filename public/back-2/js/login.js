$(function () {
    // 1. 进行表单校验配置
    //    \ *
    //     校验要求:
    //     *
    //     (1) 用户名不能为空, 长度为2 - 6 位 *
    //     (2) 密码不能为空, 长度为6 - 12 位
    $('#form').bootstrapValidator({

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //配置检验字段
        fields: {
            // 校验用户名 对应input编导的那么属性
            username: {
                //规则
                validators: {
                    //不能为空
                    notEmpty: {
                        //提示文本
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 3,
                        max: 8,
                        message: '用户名长度必须在3-8之间'
                    },
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            password: {
                validators: {

                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '密码长度必须在2-6之间'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        }
    })

    // 2.校验成功会触发一个事件,
    //默认提交表单会跳转,阻止跳转
    // 我们需要注册表单校验成功事件, 在成功事件中, 阻止默认的提交  , 通过 ajax 提交   
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();
        // console.log('阻断成功');

        //ajax 提交
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                if (info.error === 1000) {
                    // alert('用户名不存在')
                    // 更新当前input的校验状态, 更新成失败
                    // updateStatus
                    // 参数1: filed  字段名称
                    // 参数2: status 状态
                    //        NOT_VALIDATED(未校验), VALIDATING(校验中), INVALID(校验失败) or VALID(校验成功)
                    // 参数3: validator 配置校验规则, 用来配置输出的提示信息
                    $("#form").data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback'); //字符串里多出了一个空格
                    // $("#form").data('bootstrapValidator').updateStatus("username", "INVALID", 'callback');
                    return;
                }
                if (info.error === 1001) {
                    // alert('密码错误')
                    // $("#form").data('bootstrapValidator').updateStatus('password', 'INVALID ', 'callback');
                    $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", 'callback');
                    return;
                }
                if (info.success === true) {
                    location.href = 'index.html'
                }
            }
        })
    })

    //3.重置功能
    // 本身reset就有重置功能,这里需要重置其他样式
    $('[type="reset"]').on('click', function () {
        var validator = $("#form").data('bootstrapValidator'); //获取表单校验实例

        //使用表单校验实例可以调用一些常用的方法。
        // 不传参数只重置状态  传参数重置内容和状态 
        validator.resetForm(true);
    })

})