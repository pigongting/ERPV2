layui.use(['element','form','laydate','laytpl', 'layer','woLianw','laypage'],function () {
    var element=layui.element;
    var form = layui.form;
    var laydate = layui.laydate;
    var laytpl = layui.laytpl;
    var $ = layui.$;
    var layer = layui.layer;
    var woLianw = layui.woLianw;
    var laypage = layui.laypage;

    $(function () {
        //点击商品分类 查询第一级分类数据
        $("body").on('click','#choosecateBtn',function () {
            $("#category2, #category3").empty();
            $("#category-body").removeClass("layui-hide");
            woLianw.getCategoryList(function (data) {
                category(data, "category1");

            });
        });
        //一级分类目录 悬停  category1
        $("body").on("mouseover", "#category1 li", function () {
            $(this).addClass("categoryActive").siblings().removeClass("categoryActive"); //当前点击的目标加选定状态，兄弟级都去掉选定状态
            // 获取2级分类数据并渲染页面
            $("#category2").empty(); //先清空再获取
            $("#category3").empty();
            $(".category3").addClass("layui-hide");
            if(!this.id){
                return false
            }
            woLianw.getCategoryList(function (data) {
                category(data, "category2");
            }, { "cid": this.id });
            $("div.category2").removeClass("layui-hide");
        });
        //二级分类目录 悬停
        $("body").on("mouseover", "#category2 li", function () {
            $(this).addClass("categoryActive").siblings().removeClass("categoryActive"); //当前点击的目标加选定状态，兄弟级都去掉选定状态
            // 获取2级分类数据并渲染页面
            $("#category3").empty(); //先清空再获取
            woLianw.getCategoryList(function (data) {
                category(data, "category3");
            }, { "cid": this.id });
            $(".category3").removeClass("layui-hide");
        });
        //一级类目 点击目标
        $("body").on("click", "#category1 li", function () {
            if(!$(this).attr("title")){
                $("#choosecateBtnSpan").html("全部分类").attr("cid", '');
            }else{
                $("#choosecateBtnSpan").html("商品分类："+$(this).attr("title")).attr("cid", $(this).attr('data-categoryId'));
            }
              //获取当前选择的类目
            $("#category-body").addClass("layui-hide");
            window.categoryIds = this.id;
            localStorage.setItem("searchHtml", "商品分类："+$(this).attr("title"));
        });
        //二级类目 点击目标
        $("body").on("click", "#category2 li", function () {
            var that = this;
            woLianw.getProductInfoList(function (code) {
                $("#choosecateBtnSpan").html("商品分类："+$(that).attr("title")).attr("cid", $(that).attr('data-categoryId'));  //获取当前选择的类目
                $("#category-body").addClass("layui-hide");
                localStorage.setItem("searchHtml", "商品分类："+$(that).attr("title"));
                window.categoryIds = that.id;
                if (code == 0) {
                    $("#category-body .category3").removeClass("layui-hide");
                } else {
                    $("#category-body").addClass("layui-hide");
                }
            }, { "cid": this.id });

        });
        $('body').on('mouseleave','#category-body',function () {
            $('#category-body').addClass('layui-hide');
        })

        //三级类目 点击目标
        $("body").on("click", "#category3 li", function () {
            $("#choosecateBtnSpan").html("商品分类："+$(this).attr("title")).attr("cid", $(this).attr('data-categoryId'));  //获取当前选择的类目
            localStorage.setItem("searchHtml", "商品分类："+$(this).attr("title"));
            window.categoryIds = this.id;
            $("#category-body").addClass("layui-hide");
        });
    });

    function category(data, id){
        if(id == 'category1'){
            var str = '<li title="" id="" path="" class="list-group-item" data-categoryId="">全部分类</li>';
        }else{
            var str = "";
        }
        for(var i = 0; len = data.length, i < len; i++){
            str += '<li title="'+data[i].name+'" id="'+data[i].id+'" path="'+data[i].path+'" class="list-group-item" data-categoryId="'+data[i].categoryId+'">'+data[i].name+'</li>';
        }

        $("#"+id).append(str);
    }

    //右下方最近的搜索记录
 /*   window.getSParameter = function (){
        var key = document.getElementById('searchkey').value;
        var cidObj = document.getElementById('choosecateBtnSpan');
        var cid = $(cidObj).attr("cid");
        if(cid){
            var cidsArr = [];
            cidsArr.push(cid);
            var cids = cidsArr.join(",");
        }

        var oldkey = window.localStorage.getItem("searchkey");
        var keyArr =[];
        if(oldkey) {
            keyArr= oldkey.split(",");
        }
        if(keyArr.length>0){
            if(keyArr.length>=5){//数组中最多保存5个key
                var times=  keyArr.length-4;
                while(times>=0){
                    keyArr.shift();
                    times--;
                }
                keyArr.push(key);
                window.localStorage.setItem("searchkey", keyArr);
            }else{
                keyArr.push(key);
                window.localStorage.setItem("searchkey", keyArr);
            }
        }else{
            keyArr = [];
            keyArr.push(key);
            window.localStorage.setItem("searchkey", keyArr);
        }
        //"?id="+id;
        window.categoryIds=cids;


    }*/



   /* function getRootPath() {
        var pathName = window.location.pathname.substring(1);
        var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
        if (webName == "") {
            return window.location.protocol + '//' + window.location.host;
        }
        else {
            return window.location.protocol + '//' + window.location.host + '/' + webName;
        }
    }*/



})
