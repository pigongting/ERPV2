			//JavaScript代码区域
layui.use(['element', 'jquery', 'woLianw', 'laytpl'], function(){
  var form = layui.form,
  	  $ = layui.jquery,	
  	  woLianw = layui.woLianw,
  	  laytpl = layui.laytpl,
  	  layer = layui.layer;
  		
 
  	  //省份选择
  	  $("#province").on("change", "input" ,function(){
  	  	var $name = $(this).attr("name");
  	  	if(this.checked){
  	  		$("#city").attr("parentId", this.id);
  	  		$("#cityLab").attr("cityLabId", this.id);
			$(this).siblings("label").attr("ischecked", true);
			$(this).siblings("label").trigger("click");
  	  		//$("#cityAll")[0].checked=fasle;
  	  		addDivBox(this.id, $name, this.value, $(this).attr("parentId"));  //每个城市选中时 添加对应的标签
  	  		//下面几行 是判断是否全选  如果发现所有的选项都勾上了 就是全部选中， 全选按钮也自动勾上
  	  		var isAll=true;
  	  		$("#province input").each(function(){
  	  			if(this.checked == false){
  	  				isAll = false;
  	  			}
  	  		});
  	  		if(isAll){ 
  	  			$("#provinceAll")[0].checked=true ;
  	  		};
  	  		$("#cityLab").html(this.value);
  	  		
  	  	}else{
  	  		$("#provinceAll")[0].checked = false;
  	  		addDivBox(this.id,0,0,0,true); //每个城市去掉选中时 关掉对应的标签
  	  		//if($(this).attr("showed")!="false"){ //判断： 如果当时不是正在显示的 该省下面的城市，就不让它关掉 当前显示的城市名字
  	  			$("#city, #cityLab").html("");
  	  			$("#area, #areaLab").html("");
  	  		//};
  	  		$(this).siblings("label").attr("ischecked", false);
  	  		$("#cityAll")[0].checked=false;
  	  		$("#areaAll")[0].checked=false;
  	  		/*
  	  		$cityInputs.each(function(){
  	  			this.checked=false;
  	  			addDivBox(this.id,0,0,0,true); //每个城市去掉选中时 关掉对应的标签
  	  			var $areaInputs=$("#area input[parentId="+this.id+"]");
  	  			$areaInputs.parent("div").addClass("layui-hide");
  	  			$areaInputs.each(function(){
  	  				this.checked=false;
  	  			})
  	  		});*/
  	  	}
  	  });
  	  
  	  
  	  //城市选择
  	  $("#city").on("change", "input", function(){
  	  	var pid = $("#cityLab").attr("cityLabId");
  	  	$("#areaLab").attr("areaLabId", this.id);
  	  	var $areaInputs = $("#area input[name=area]");
  	  	if(this.checked){
  	  		$("#area").attr("parentId", this.id);
  	  		$("#"+pid)[0].checked = true;
  	  		addDivBox(pid, 0, 0, 0,true);  //去掉省会标签
  	  		addDivBox(this.id, $(this).attr("name"), this.value, pid);  //添加当前城市标签
			$(this).siblings("label").attr("ischecked", true);
			$(this).siblings("label").trigger("click");
  	  		$("#areaAll")[0].checked = false;
  	  		
  	  		//下面几行 是判断是否全选  如果发现所有的选项都勾上了 就是全部选中， 全选按钮也自动勾上
  	  		var isAll = true;
  	  		$("#city input").each(function(){
  	  			if(this.checked == false){
  	  				isAll = false;
  	  				addDivBox(this.id, 0, 0, 0, true);  //去掉当前省下面的所有城市标签
  	  			}
  	  		});
  	  		if(isAll){ 			//city全选状态
  	  			$("#cityAll")[0].checked = true;
  	  			$("#city input").each(function(){
  	  				addDivBox(this.id, 0, 0, 0, true);  //去掉当前省下面的所有城市标签
  	  			});
  	  			addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val());  //添加当前省份标签
  	  			$("#provinceAll")[0].checked = true;
  	  		};
  	  		$("#areaLab").html(this.value);
  	  	}else{
  	  		$("#provinceAll")[0].checked = false;
  	  		$("#cityAll")[0].checked = false;
  	  		$("#city input:checked").each(function(){
  	  			addDivBox(this.id, $(this).attr("name"), this.value, pid);  //添加当前城市标签
  	  		});
  	  		addDivBox(this.id,0,0,0,true);  //去掉当前city标签
  	  		$(this).siblings().attr("ischecked", false);
  	  		addDivBox(pid, 0,0,0,true);  //去掉当前省份标签
  	  		$("#"+pid)[0].checked = false;
  	  		
  	  		$(this).siblings("label").attr("ischecked", false);
  	  		$("#areaAll")[0].checked = false;
  	  		$areaInputs.each(function(){
  	  			this.checked = false;
  	  		});
  	  		//下面几行 是判断是否全不选  如果发现所有的选项都取消选中了 就是全部不选， 自动选择它的上一级 即：xx省
  	  		var isAll=false;
  	  		$("#city input").each(function(){
  	  			if(this.checked==true){
  	  				isAll=true;
  	  			}
  	  		});
  	  		if(!isAll){// 全不选的时候  要清掉所有
  	  			$("#"+pid)[0].checked = false;
  	  			addDivBox(pid, 0,0,0,true);  //添加当前省份标签
  	  		};
  	  	}
  	  	$("#areaLab").html(this.value);
  	  });
  	  
  	  //区域选择
  	  $("#area").on("change", "input", function(){
  	  	var cid = $("#areaLab").attr("arealabid"); //获取当前所属的城市的id
  	  	var pid = $("#cityLab").attr("citylabid"); //获取当前所属省的id
  	  	if(this.checked){
  	  		//下面几行 是判断是否全选  如果发现所有的选项都选中了 就是全选， 自动选择它的上一级 
  	  		var isAll=true;
  	  		$("#area input").each(function(){
  	  			if(this.checked == false){
  	  				isAll = false;
  	  			}
  	  		});
  	  		if(isAll){ //全选的时候
  	  			$("#areaAll")[0].checked = true;
  	  			$("#"+cid).siblings("label").attr("ischecked", true); //城市
  	  			$("#"+cid)[0].checked=true;//当前区域 所属的城市 选择框 选中
  	  			addDivBox(cid, $("#"+cid).attr("name"), $("#"+cid).val());  //添加当前城市标签
  				$("#area input").each(function(){
	  	  			addDivBox(this.id, 0,0,0,true);  //去掉当前area标签
	  	  		});
  				
  				if($("#city input:checked").size()==$("#city input").size()){//所有城市==选中城市  （即：城市全选）全选中了
	  	  			$("#cityAll")[0].checked = true; //城市全选
	  	  			$("#city input").each(function(){
		  	  			this.checked = true;
		  	  			addDivBox(this.id, 0,0,0,true);  //去掉city标签
		  	  		});
		  	  		$("#"+pid)[0].checked = true;
		  	  		addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val());  //添加当前省份标签
	  	  			if($("#province input:checked").size()==$("#province input").length){//省份全选了
	  	  				$("#provinceAll")[0].checked = true;
	  	  			}
	  	  		}
  	  		}else{
  	  			addDivBox(pid,0,0,0, true);
  	  			addDivBox(cid, 0, 0, 0,true);  //去掉城市标签
  	  			$("#areaAll")[0].checked = false;
  	  			addDivBox(this.id, $(this).attr("name"), this.value);
  	  		}
  	  	}else{
  	  		$("#provinceAll, #cityAll, #areaAll").each(function(){
  	  			this.checked = false;
  	  		})
  	  		addDivBox(pid,0,0,0,true);
  	  		addDivBox(cid,0,0,0,true);
  	  		$("#"+pid)[0].checked=false;
  	  		$("#"+cid)[0].checked=false;
  	  		$("#city input:checked").each(function(){
  	  			addDivBox(this.id, $(this).attr("name"), this.value);  //添加当前选中的city标签
  	  		});
  	  		$("#area input:checked").each(function(){
  	  			addDivBox(this.id, $(this).attr("name"), this.value, pid);  //添加当前area标签
  	  		});
  	  		addDivBox(this.id,0,0,0,true);
  	  		//下面几行 是判断是否全不选  如果发现所有的选项都取消选中了 就是全部不选， 自动选择它的上一级 
  	  		var isAll = false;
  	  		$("#area input").each(function(){
  	  			if(this.checked == true){
  	  				isAll = true;
  	  			}
  	  		});
  	  		if(!isAll){
  	  			//$("#"+pid)[0].checked=false;
  	  			//addDivBox(pid,0,0,0,true);  //添加当前城市标签
  	  		}
  	  	}
  	  });
  	  
  	  //每个选中的省 点击标题名字以后。。。
  		$("#province").on("click", "label", function(){
  			if($(this).attr("ischecked")=='true'){
  				var pid = $(this).attr("labid");
  				$("#cityLab").html($(this).html()).attr("cityLabId", pid); //设置下级city 全选部位label的标题文字和 父级id
  				woLianw.getLinkage(pid, function(data){woLianw.renderDataHtml(data.didList,"cityTemplate", "city");});
  				$("#cityAll")[0].checked = true;
  				$("#city input").each(function(){
  					this.checked = true;
  					$(this).siblings("label").attr("ischecked", true);
  				});
  				$("#province input").attr("showed", false);  //其他的input showed设置为false
  				$(this).siblings("input").attr("showed", true);  //自身增加: showed == true;
  			}
  	 		
  		});
  		//每个选中的市 点击标题名字以后。。。
  		$("#city").on("click", "label", function(){
  			if($(this).attr("ischecked")=='true'){
  				var cid = $(this).attr("labid");
  				$("#areaLab").html($(this).html()).attr("areaLabId", cid);
  				woLianw.getLinkage(cid, function(data){woLianw.renderDataHtml(data.didList,"areaTemplate", "area");});
  				$("#areaAll")[0].checked = true;
  				$("#area input").each(function(){
  					this.checked=true;
  				});
  				$("#city input").attr("showed", false);
  				$(this).siblings("input").attr("showed", true);
  			}
  		});
  	  
  	   //一级全选(province)
  	  $("#provinceAll").change(function(){
  	  	$("ul.tab-title").empty();                     //清空所有标签
  	  	clear_city_area();														 //清除城市和区域全选和标题
  	  	if(this.checked){
  	  		$("#cityLab, areaLab").html("");
  	  		$("#province input").each(function(){
  	  			this.checked=true;
  	  			addDivBox(this.id, $(this).attr("name"), this.value, 0);
  	  			
  	  			$(this).siblings("label").attr("ischecked", true);
  	  		});
  	  		$("#city input, #area input").each(function(){
  	  			this.checked=false;
  	  			$(this).parent("div").addClass("layui-hide");
  	  		});
  	  	}else{
  	  		$("#province input").each(function(){
  	  			this.checked=false;
  	  			$(this).siblings("label").attr("ischecked", false);
  	  		});
  	  		$("#city input, #area input").each(function(){
  	  			this.checked=false;
  	  			$(this).parent("div").addClass("layui-hide");
  	  			$(this).siblings("label").attr("ischecked", false);
  	  		});
  	  		
  	  	}
  	  });
  	  //二级全选 (city)
  	  $("#cityAll").change(function(){
  	  	$("#areaAll")[0].checked = false;
  	  	$("#areaLab").html("");
  	  	var pid = $("#cityLab").attr("citylabid");
  	  	if(this.checked){
  	  		addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val(), 0);  //添加当前省份标签
  	  		$("#"+pid)[0].checked=true;
  	  		$("#city input").each(function(){
  	  			this.checked = true;
  	  			addDivBox(this.id,0,0,0,true);  
  	  			$(this).siblings("label").attr("ischecked", true);
  	  			var city_id = this.id;
  	  			$(".liBox i[level=area]").each(function(){
	  	  			if($(this).attr("pid")==city_id){
	  	  				$(this).parent().remove();
	  	  			}
	  	  		});
  	  		});
  	  		$("#area input").each(function(){
  	  			addDivBox(this.id,0,0,0,true); 
  	  		});
  	  		
  	  		if($("#province input:checked").size()==$("#province input").size()){//34个省全选中了
  	  			$("#provinceAll")[0].checked = true;
  	  			$("#"+pid).siblings("label").attr("ischecked", true);
  	  		}
  	  		
  	  	}else{
  	  		$("#provinceAll")[0].checked = false;
  	  		$("#city input").each(function(){
  	  			this.checked = false;
  	  			addDivBox(this.id,0,0,0,true);  //去掉城市标签
  	  			$(this).siblings("label").attr("ischecked", false);
  	  		});
  	  		$("#area input").each(function(){
  	  			this.checked = false;
  	  		});
  	  		//城市全部取消  就把上一级 省级框 也去选中
  	  		$("#"+pid)[0].checked = false;
  	  		addDivBox(pid,0,0,0,true);  //添加当前省份标签
  	  	}
  	  });
  	   //三级全选(area)
  	  $("#areaAll").change(function(){
  		var cid = $("#areaLab").attr("arealabid"); //获取当前所属的城市的id
  	  	var pid = $("#cityLab").attr("citylabid"); //获取当前所属省的id
  	  	if(this.checked){
  	  		$("#area input").each(function(){
  	  			this.checked = true;
  	  			addDivBox(this.id, 0,0,0,true);  //去掉区域标签
  	  		});
  	  		$("#"+cid)[0].checked = true;
  	  		addDivBox(cid, $("#"+cid).attr("name"), $("#"+cid).val());  //添加当前城市标签
  	  		if($("#city input:checked").size()==$("#city input").size()){//所有城市==选中城市  （即：城市全选）全选中了
  	  			$("#cityAll")[0].checked=true;
  	  			$("#city input").each(function(){
	  	  			this.checked=true;
	  	  			addDivBox(this.id, 0,0,0,true);  //去掉city标签
	  	  		});
	  	  		$("#"+pid)[0].checked = true;
	  	  		addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val(), 0);  //添加当前省份标签
  	  			if($("#province input:checked").size()==$("#province input").size()){//省份全选了
  	  				$("#provinceAll")[0].checked = true;
  	  			}
  	  		}
  	  	}else{
  	  		$("#area input").each(function(){
  	  			this.checked = false;
  	  			addDivBox(this.id, 0, 0, 0,true);  //去掉区域标签
  	  		});
  	  		//区域全部取消  就把上一级 市级框 去掉选中 并去掉标签
  	  		$("#"+cid)[0].checked = false;
  	  		$("#"+pid)[0].checked = false;
  	  		addDivBox(cid, 0,0,0,true);  //去掉当前城市标签
  	  		addDivBox(pid, 0,0,0,true);  //去掉当前省份标签
  	  		$("#provinceAll, #cityAll").each(function(){
  	  			this.checked = false;
  	  		});
  	  		$("#city input:checked").each(function(){
  	  			this.checked = true;
  	  			addDivBox(this.id, $(this).attr("name"), this.value);
  	  		});
  	  		
  	  	}
  	  });
  	  
  	
  	  
  	  //清除城市和区域全选和标题
  	  function clear_city_area(){
  	  	$("#cityAll, #areaAll").each(function(){ 			 //城市和区域的全选 都去掉选定
  	  		this.checked=false;
  	  	})
  	  	$("#cityLab, #areaLab").each(function(){ 			 //城市和区域的标题 都清空
  	  		$(this).html("");
  	  	})
  	  }
  	  
  	  //添加标签 或者去掉标签
  	  window.addDivBox = function addDivBox(id, name, value, pid,closeAll){
  	  	if(pid==null ||pid=="" || pid==undefined || pid==0){
  	  		pid=0;
  	  	}
  	  	
  	  	if($("i[xid="+id+"]").length<=0){
	  	  	var divstr='<li class="liBox"><a href="javascript:;" class="layui-btn layui-btn-small layui-btn-normal">'+value+'</a><i class="fa fa-times-circle close" pid="'+pid+'" xid="'+id+'" level="'+name+'"></i></li>'
	  	  	$("ul.tab-title").append(divstr);
	  	  	$(".liBox > i.close").click(function(){
	  	  			var pid=$(this).attr("xid");
		  	  		$(this).parent("li").remove();
		  	  	getXiala();
		  	  		$("#"+pid)[0].checked=false;
		  	  		$("label[labid="+pid+"]").attr("ischecked", false);
		  	  		$("#provinceAll")[0].checked=false;
		  	  		if($(this).attr("level")=="province"){
		  	  			$("#city>div, #area>div").addClass("layui-hide");
		  	  			$("#cityAll, #areaAll").each(function(){
		  	  				this.checked=false;
		  	  			});
		  	  			$("#cityLab, #areaLab").each(function(){
		  	  				$(this).html("");
		  	  			});
		  	  		}
		  	  		if($(this).attr("level")=="city"){
		  	  			$("#area>div").addClass("layui-hide");
		  	  			$("#cityAll, #areaAll").each(function(){
		  	  				this.checked=false;
		  	  			});
		  	  			$("#areaLab").html("");
		  	  			
		  	  		}
		  	  });
  	  	}
  	  	if($("i[xid="+id+"]").length>0 && ( closeAll==true)){
  	  		$("i.close[xid="+id+"]").parent("li").remove();
  	  	}
  	  	getXiala();
  	  };
  	  
  	  $("#submit_btn").click(function(){
  	  	var arr=[];
  	  	$("li.liBox i").each(function(){
  	  		var obj={};
  	  		obj.id=$(this).attr("xid");
  	  		obj.name=$(this).siblings("button").text();
  	  		arr.push(obj);
  	  	})
  	  	console.log(arr);
  	  });
  	  
  	  
  	  
  	  $("#xiala").click(function(){
  		var $parent = $(this).parent();
  		var $ul = $(this).siblings("ul");
  		if($parent.hasClass("tab-more")){
  			$parent.removeClass("tab-more");
  		}else{
  			$parent.addClass("tab-more");
  		}
  	  });
  	  
  	  function getXiala(){
    	var $liWidth = 0;
    	var arr = [];
		var $ulWidth = $("#tab-title").width();
		$("#tab-title li").each(function(e){
			$liWidth += parseInt($(this).width())+20;
		});
		if($liWidth >= $ulWidth){
			$("#xiala").show();
		}else{
			$("#xiala").hide();
		}
  	  }
			
});
			
		
