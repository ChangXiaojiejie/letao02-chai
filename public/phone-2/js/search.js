$(function() {
  //页面初始渲染搜索历史
  render()

  // 1.返回记录 以数组输出
  function getArr() {
    var str = localStorage.getItem('search_list') || '[]'
    //转成数组
    var arr = JSON.parse(str)

    return arr
  }

  // 2.渲染搜索历史
  function render() {
    var arr = getArr()
    $('.lt_history').html(
      template('historyTmp', {
        list: arr
      })
    )
  }

  // 3.删除单个
  $('.lt_history').on('click', '.btn_del', function() {
    var arr = getArr()

    var index = $(this).data('index')

    // 根据下标删除
    arr.splice(index, 1)

    localStorage.setItem('search_list', JSON.stringify(arr))

    //渲染
    render()
  })

  // 4.删除全部
  $('.lt_history').on('click', '.btn_dels', function() {
    // 弹出模态框
    mui.confirm('你确定要清除吗?', '温馨提示', ['取消', '确定'], function(e) {
      if (e.index == 1) {
        var arr = getArr()
        // // 清空数组
        // arr = []
        // // 存到本地local
        // localStorage.setItem('search_list', JSON.stringify(arr))

        localStorage.removeItem('search_list')
        // 重新渲染
        render()
      }
    })
  })

  // 5.添加单个的搜索
  $('.btn_search').on('click', function() {
    var key = $('.search_input')
      .val()
      .trim()
    if (key === '') {
      mui.toast('请输入搜索内容', {
        duration: 'long',
        type: 'div'
      })
    }

    var arr = getArr()

    // 删除重复项
    var index = arr.indexOf(key)
    if (index !== -1) {
      arr.splice(index, 1)
    }
    // 限制长度
    if (arr.length >= 8) {
      // 删除最后一项
      arr.pop()
    }

    // 往最前面添加
    arr.unshift(key)

    localStorage.setItem('search_list', JSON.stringify(arr))

    render()

    // 重置搜索框
    $('.search_input').val('')

    //跳转
    location.href = 'searchList.html?key=' + key
  })
})
