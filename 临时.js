// ==UserScript==
// @name     baidu disk use analyse
// @version  1
// @grant    none
//引入jquery
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://code.jquery.com/jquery-latest.js
// ==/UserScript==
//这里用这个是匿名函数
(function () {
    'use strict';
    //https://blog.csdn.net/weixin_33863087/article/details/93177956
    function download(filename, result) {
        var text = "";
        result.forEach(function (value, index) {
            text += (value + "\n")
        })
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    //遍历获取文件列表
    function collectFiles(path, name, result) {
        //目录的名字，默
        console.log("扫描:" + path)

        //同步请求,一次请求100个文件，就不用处理翻页，除非有某个文件夹文件数量大于1000的
        let res = $.ajax({
            url: "https://pan.baidu.com/api/list?num=100&order=time&desc=1&clienttype=0&showempty=0&web=1&page=1&channel=chunlei&web=1&app_id=250528",
            data: {
                dir: path
            },
            type: "get",
            async: false
        })


        let files = res.responseJSON.list
        //目录总大小
        let dir_size = 0;
        let children = [];
        files.forEach(function (value, index) {

            if (value.isdir == 0)
            //添加到二级目录
            {
                children.push(
                    {
                        name: value.server_filename,
                        path: value.path,
                        value: value.size
                    }
          dir_size += value.size;
        )
    }
    //文件夹的话，递归
    if (value.isdir == 1) {
        //添加到总的文件夹大小
        dir_size += collectFiles(value.path, value.server_filename, children)
    }

})
result.push({
    name: name,
    path: path,
    children: children,
    value: dir_size
})

return dir_size;
    //遍历文件

    /*$.get("https://pan.baidu.com/api/list?dir=/&num=100&order=time&desc=1&clienttype=0&showempty=0&web=1&page=1&channel=chunlei&web=1&app_id=250528",
         function(res){
      console.log("获取文件列表:")
      console.log(res)
      
    })*/
  }


//插入图表，显示图表
function showChart() {
    console.log("显示图表...")

    $("#layoutMain").prepend("<div style='width:400px;height:400px;'>测试<div>")

}

//1. 在新建文件夹后面添加个按钮
var xinjian = $("a:contains('新建文件夹')")
alert(xinjian.attr('title'))

console.log(xinjian)
//xinjian.remove()


var analysis = $("<button id='analysis'>分析</button>")
analysis.text("使用分析")
console.log(analysis)
//添加到新建文件夹后面
xinjian.after(analysis)

//设置点击事件
$("#analysis").click(function () {
    console.log("fff")
    let result = []
    //测试时用某个目录下的
    collectFiles("/windows镜像", "根目录", result)
    console.log("获取到的文件列表..")
    console.log(result)
    download("files.txt", result);
    showChart()
})
  
}) ()