
layui.use(['element','jquery'],function () {
    var element=layui.element;
    var $=layui.jquery;

    //li 边框线运动特效
    /*
	$('ul.list_goods_ul').on("mouseenter mouseleave", "li", function(e){
		var li_width= $(this).width();
		var li_height = $(this).height();
		var $bLeft_bRight = $(this).find('div.border-left, div.border-right');
		var $bTop_bBottom = $(this).find('div.border-top, div.border-bottom');
		if(e.type == "mouseenter"){
			$bLeft_bRight.stop(true).animate({height: li_height+'px'}, 400);
			$bTop_bBottom.stop(true).animate({width: li_width+'px'}, 400);
		}else if(e.type == "mouseleave"){
			$bLeft_bRight.stop(true).animate({height: "0"}, 400);
			$bTop_bBottom.stop(true).animate({width: "0"}, 400);
		}


	});
	*/

	// i 多选框特效（搬家，查看店内所有商品）
    $("ul.list_goods_ul").on("click", "article label i" , function(){
    	var classLists = $(this).attr("class");
    	if(classLists.indexOf("-square") >= 0){  //搬家
    		$(this).toggleClass("fa-square-o").toggleClass("fa-check-square");
    		$(this).parent().toggleClass("i_checked");
    	}else if(classLists.indexOf("-heart") >= 0){ //关注
    		$(this).toggleClass("fa-heart-o").toggleClass("fa-heart");
    		$(this).parent().toggleClass("i_checked");
    	}else{																			//加入购物车
    		$(this).parent().toggleClass("i_checked");
    	}

    });







})
