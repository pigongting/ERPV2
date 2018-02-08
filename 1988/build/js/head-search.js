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
        $("#choosecateBtn").click(function () {
            $("#category2, #category3").empty();
            $("#category-body").removeClass("layui-hide");
            woLianw.getCategoryList2(function (data) {
                category(data, "category1");
            });
        });
        //一级分类目录 悬停
        $("#category1").on("mouseover", "li", function () {
            $(this).addClass("categoryActive").siblings().removeClass("categoryActive"); //当前点击的目标加选定状态，兄弟级都去掉选定状态
            // 获取2级分类数据并渲染页面
            $("#category2").empty(); //先清空再获取
            $("#category3").empty();
            $(".category3").addClass("layui-hide");
            woLianw.getCategoryList2(function (data) {
                category(data, "category2");
            }, { "cid": this.id });
            $("div.category2").removeClass("layui-hide");
        });
        //二级分类目录 悬停
        $("#category2").on("mouseover", "li", function () {
            $(this).addClass("categoryActive").siblings().removeClass("categoryActive"); //当前点击的目标加选定状态，兄弟级都去掉选定状态
            // 获取2级分类数据并渲染页面
            $("#category3").empty(); //先清空再获取
            woLianw.getCategoryList2(function (data) {
                category(data, "category3");
            }, { "cid": this.id });
            $(".category3").removeClass("layui-hide");
        });
        //二级类目 点击目标
        $("#category2").on("click", "li", function () {
            var that = this;
            woLianw.getProductInfoList(function (code) {
                if (code == 0) {
                    $("#category-body .category3").removeClass("layui-hide");
                } else {
                    $("#choosecateBtnSpan").html("商品分类："+$(that).attr("title"));  //获取当前选择的类目
                    $("#category-body .category3").addClass("layui-hide");
                    $("#category-body").addClass("layui-hide");
                }
            }, { "cid": this.id });

        });

        //三级类目 点击目标
        $("#category3").on("click", "li", function () {
            var that = this;
            $("#choosecateBtnSpan").html("商品分类："+$(this).attr("title"));  //获取当前选择的类目
            $("#category-body").addClass("layui-hide");
        });
    });

    function category(data, id){
        var str = "";
        for(var i = 0; len = data.length, i < len; i++){
            str += '<li title="'+data[i].name+'" id="'+data[i].id+'" path="'+data[i].path+'" class="list-group-item">'+data[i].name+'</li>';
        }
    
        $("#"+id).append(str);
    }


})