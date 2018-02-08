			//JavaScript代码区域
layui.use(['element', 'jquery'], function(){
  var form = layui.form,
  	  $ = layui.jquery,	
  	  layer = layui.layer;
  
	  $.ajax({
	    type: "get",	//请求方式
	    url: "datas/province_city.json",	//地址，就是json文件的请求路径
	    dataType: "json",					//数据类型可以为 text xml json  script  jsonp
	　　success: function(result){			//返回的参数就是 action里面所有的有get和set方法的参数
	        addProvince_city(result);
	  	}
	  });
	  $.ajax({
	    type: "get",//请求方式
	    url: "datas/area.json",//地址，就是json文件的请求路径
	    dataType: "json",//数据类型可以为 text xml json  script  jsonp
	　　success: function(result){//返回的参数就是 action里面所有的有get和set方法的参数
	        addArea(result);
	  	}
	  });
	
  	  
  	  
  	  
  	  
  	  
  	  //省份选择
  	  $("#province").on("change", "input" ,function(){
  	  	var $cityInputs=$("#city input[parentId="+this.id+"]");
  	  	$name=$(this).attr("name");
  	  	if(this.checked){
  	  		$("#cityLab").attr("cityLabId", this.id);
  	  		$(this).siblings("label").attr("ischecked", true);
  	  		$("#cityAll")[0].checked=true;
  	  		$cityInputs.each(function(){
  	  			this.checked=true;
  	  		});
  	  		addDivBox(this.id, $name, this.value, $(this).attr("parentId"));  //每个城市选中时 添加对应的标签
  	  		//下面几行 是判断是否全选  如果发现所有的选项都勾上了 就是全部选中， 全选按钮也自动勾上
  	  		var isAll=true;
  	  		$("#province input[name="+$name+"]").each(function(){
  	  			if(this.checked==false){
  	  				isAll=false;
  	  			}
  	  		});
  	  		if(isAll){ 
  	  			$("#provinceAll")[0].checked=true ;
  	  		};
  	  		$("#cityLab").html(this.value);
  	  		$("#city input").parent().addClass("layui-hide");
  	  		$cityInputs.parent("div").removeClass("layui-hide");
  	  		
  	  		$("#city input[parentId="+this.id+"]:checked").each(function(){
  					$(this).siblings("label").attr("ischecked", true);
  				});
  	  	}else{
  	  		$("#provinceAll")[0].checked=false;
  	  		addDivBox(this.id,0,0,0,true); //每个城市去掉选中时 关掉对应的标签
  	  		$cityInputs.parent("div").addClass("layui-hide");
  	  		if($(this).attr("showed")!="false"){ //判断： 如果当时不是正在显示的 该省下面的城市，就不让它关掉 当前显示的城市名字
  	  			$("#cityLab").html("");
  	  			$("#areaLab").html("");
  	  		};
  	  		$(this).siblings("label").attr("ischecked", false);
  	  		$("#cityAll")[0].checked=false;
  	  		$("#areaAll")[0].checked=false;
  	  		$cityInputs.each(function(){
  	  			this.checked=false;
  	  			addDivBox(this.id,0,0,0,true); //每个城市去掉选中时 关掉对应的标签
  	  			var $areaInputs=$("#area input[parentId="+this.id+"]");
  	  			$areaInputs.parent("div").addClass("layui-hide");
  	  			$areaInputs.each(function(){
  	  				this.checked=false;
  	  			})
  	  		});
  	  	}
  	  });
  	  
  	  
  	  //城市选择
  	  $("#city").on("change", "input", function(){
  	  	var $areaInputs=$("#area input[parentId="+this.id+"]");
  	  	var pid=$("#cityLab").attr("citylabid");
  	  	$("#areaLab").attr("areaLabId", this.id);
  	  	if(this.checked){
  	  		$("#"+pid)[0].checked=true;
  	  		addDivBox(pid, 0, 0, 0,true);  //去掉省会标签
  	  		addDivBox(this.id, $(this).attr("name"), this.value, pid);  //添加当前城市标签
  	  		$(this).siblings("label").attr("ischecked", true);
  	  		$("#areaAll")[0].checked=true;
  	  		$areaInputs.each(function(){
  	  			this.checked=true;
  	  			addDivBox(this.id, 0, 0, 0,true);  //去掉当前省下面的所有城市标签
  	  		});
  	  		
  	  		//下面几行 是判断是否全选  如果发现所有的选项都勾上了 就是全部选中， 全选按钮也自动勾上
  	  		var isAll=true;
  	  		$("#city input[parentid="+pid+"]").each(function(){
  	  			if(this.checked==false){
  	  				isAll=false;
  	  				addDivBox(this.id, 0, 0, 0,true);  //去掉当前省下面的所有城市标签
  	  			}
  	  		});
  	  		if(isAll){ 			//city全选状态
  	  			$("#cityAll")[0].checked=sessionStorage.cityAll_checked=true;
  	  			$("#city input[parentid="+pid+"]").each(function(){
  	  				addDivBox(this.id, 0, 0, 0,true);  //去掉当前省下面的所有城市标签
  	  			});
  	  			addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val());  //添加当前省份标签
  	  			$("#provinceAll")[0].checked=true;
  	  		};
  	  		$("#areaLab").html(this.value);
  	  		$("#area input").parent().addClass("layui-hide");
  	  		$areaInputs.parent("div").removeClass("layui-hide");
  	  		
  	  	}else{
  	  		$("#provinceAll")[0].checked=false;
  	  		$("#cityAll")[0].checked=sessionStorage.cityAll_checked=false;
  	  		$("#city input[parentid="+pid+"]:checked").each(function(){
  	  			addDivBox(this.id, $(this).attr("name"), this.value, pid);  //添加当前城市标签
  	  		});
  	  		addDivBox(this.id,0,0,0,true);  //去掉当前city标签
  	  		$(this).siblings().attr("ischecked", false);
  	  		addDivBox(pid, 0,0,0,true);  //去掉当前省份标签
  	  		$("#"+pid)[0].checked=false;
  	  		
  	  		$(this).siblings("label").attr("ischecked", false);
  	  		$("#areaAll")[0].checked=false;
  	  		$areaInputs.each(function(){
  	  			this.checked=false;
  	  		});
  	  		//下面几行 是判断是否全不选  如果发现所有的选项都取消选中了 就是全部不选， 自动选择它的上一级 即：xx省
  	  		var isAll=false;
  	  		$("#city input[parentid="+pid+"]").each(function(){
  	  			if(this.checked==true){
  	  				isAll=true;
  	  			}
  	  		});
  	  		if(!isAll){// 全不选的时候  要清掉所有
  	  			$("#"+pid)[0].checked=false;
  	  			addDivBox(pid, 0,0,0,true);  //添加当前省份标签
  	  		};
  	  	}
  	  	
  	  	$("#areaLab").html(this.value);
  		$("#area input").parent().addClass("layui-hide");
  		$areaInputs.parent("div").removeClass("layui-hide");
  	  });
  	  
  	  //区域选择
  	  $("#area").on("change", "input", function(){
  	  	var pid=$("#areaLab").attr("arealabid");
  	  	var parentid=$("#"+pid).attr("parentid");
  	  	if(this.checked){
  	  		//下面几行 是判断是否全选  如果发现所有的选项都选中了 就是全选， 自动选择它的上一级 
  	  		var isAll=true;
  	  		$("#area input[parentid="+pid+"]").each(function(){
  	  			if(this.checked==false){
  	  				isAll=false;
  	  			}
  	  		});
  	  		if(isAll){ //全选的时候
  	  			$("#areaAll")[0].checked=true;
  	  			$("#"+pid).siblings("label").attr("ischecked", true);
  	  			addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val(), parentid);  //添加当前城市标签
  				$("#area input[parentid="+pid+"]").each(function(){
	  	  			addDivBox(this.id, 0,0,0,true);  //添加当前area标签
	  	  		});
  				$("#"+pid)[0].checked=true;
  				if($("#city input[parentid="+parentid+"]:checked").size()==$("#city input[parentid="+parentid+"]").size()){//所有城市==选中城市  （即：城市全选）全选中了
	  	  			$("#cityAll")[0].checked=true;
	  	  			$("#city input[parentid="+parentid+"]").each(function(){
		  	  			this.checked=true;
		  	  			addDivBox(this.id, 0,0,0,true);  //去掉city标签
		  	  		});
		  	  		$("#"+parentid)[0].checked=true;
		  	  		addDivBox(parentid, $("#"+parentid).attr("name"), $("#"+parentid).val());  //添加当前省份标签
	  	  			if($("#province input:checked").size()==34){//省份全选了
	  	  				$("#provinceAll")[0].checked=true;
	  	  			}
	  	  		}
  	  		}else{
  	  			addDivBox(parentid,0,0,0,true);
  	  			addDivBox(pid, 0, 0, 0,true);  //去掉城市标签
  	  			addDivBox(this.id, $(this).attr("name"), this.value, pid);
  	  		}
  	  	}else{
  	  		$("#"+pid).siblings("label").attr("ischecked", false);
  	  		$("#provinceAll, #cityAll, #areaAll").each(function(){
  	  			this.checked=false;
  	  		})
  	  		addDivBox(parentid,0,0,0,true);
  	  		$("#"+parentid)[0].checked=false;
  	  		$("#"+pid)[0].checked=false;
  	  		addDivBox(pid,0,0,0,true);
  	  		$("#city input[parentid="+parentid+"]:checked").each(function(){
  	  			addDivBox(this.id, $(this).attr("name"), this.value);  //添加当前选中的city标签
  	  		});
  	  		$("#area input[parentid="+pid+"]:checked").each(function(){
  	  			addDivBox(this.id, $(this).attr("name"), this.value, pid);  //添加当前area标签
  	  			$("#"+pid).attr("childid", this.id);
  	  		});
  	  		addDivBox(this.id,0,0,0,true);
  	  		//下面几行 是判断是否全不选  如果发现所有的选项都取消选中了 就是全部不选， 自动选择它的上一级 
  	  		var isAll=false;
  	  		$("#area input[parentid="+pid+"]").each(function(){
  	  			if(this.checked==true){
  	  				isAll=true;
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
  				var pid=$(this).attr("labid");
  				$("#cityLab").html($(this).html()).attr("cityLabId", pid); //设置下级city 全选部位label的标题文字和 父级id
  				var $cityInputs=$("#city input[parentId="+pid+"]");//获取 当前省份下的 所有city》input
  				$("#city input").parent().addClass("layui-hide");
  				$cityInputs.parent("div").removeClass("layui-hide");
  				//$("#cityAll")[0].checked=eval(sessionStorage.cityAll_checked);
  				$("#cityAll")[0].checked=true;
  				$("#city input[parentId="+pid+"]").each(function(){
  					this.checked=true;
  					$(this).siblings("label").attr("ischecked", true);
  				});
  				$("#province input").attr("showed", false);
  				$(this).siblings("input").attr("showed", true);
  				var area_id=$("#areaLab").attr("arealabid");
  				$("#areaLab").html("");
  				$("#area input[parentId="+area_id+"]").parent().addClass("layui-hide");
  			}
  	 		
  		});
  		//每个选中的市 点击标题名字以后。。。
  		$("#city").on("click", "label", function(){
  			if($(this).attr("ischecked")=='true'){
  				var cid=$(this).attr("labid");
  				$("#areaLab").html($(this).html()).attr("areaLabId", cid);
  				var $cityInputs=$("#area input[parentId="+cid+"]");
  				$("#area input").parent().addClass("layui-hide");
  				$cityInputs.parent("div").removeClass("layui-hide");
  				$("#areaAll")[0].checked=eval(sessionStorage.areaAll_checked);
  				if($("#areaAll")[0].checked){
	  				$("#area input[parentId="+cid+"]").each(function(){
	  					this.checked=true;
	  				});
  				}else{
  					$("#area input[parentId="+cid+"]:checked").each(function(){
	  					this.checked=true;
	  				});
  				}
  				$("#city input").attr("showed", false);
  				$(this).siblings("input").attr("showed", true);
  			}
  	 		
  		});
  	  
  	   //一级全选(province)
  	  $("#provinceAll").change(function(){
  	  	$("ul.tab-title").empty();                     //清空所有标签
  	  	clear_city_area();														 //清除城市和区域全选和标题
  	  	if(this.checked){
  	  		$("#cityAll, #areaAll").each(function(){
  	  			sessionStorage.setItem(this.id+'_checked', true);
  	  		});
  	  		
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
  	  	$("#areaAll")[0].checked=false;
  	  	$("#areaLab").html("");
  	  	var pid=$("#cityLab").attr("citylabid");
  	  	if(this.checked){
  	  		addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val(), 0);  //添加当前省份标签
  	  		$("#"+pid)[0].checked=true;
  	  		$("#city input[parentid="+pid+"]").each(function(){
  	  			this.checked=true;
  	  			addDivBox(this.id,0,0,0,true);  
  	  			$(this).siblings("label").attr("ischecked", true);
  	  			var city_id=this.id;
  	  			console.log("city_id: "+city_id);
  	  			$(".liBox i[level=area]").each(function(){
	  	  			if($(this).attr("pid")==city_id){
	  	  				console.log("area_id: "+$(this).attr("pid"));
	  	  				$(this).parent().remove();
	  	  			}
	  	  		});
  	  		});
  	  		var area_pid=$("#areaLab").attr("arealabid");
  	  		$("#area input[parentid="+area_pid+"]").each(function(){
  	  			$(this).parent("div").addClass("layui-hide");
  	  			addDivBox(this.id,0,0,0,true); 
  	  		});
  	  		
  	  		
  	  		
  	  		if($("#province input:checked").size()==34){//34个省全选中了
  	  			$("#provinceAll")[0].checked=true;
  	  			$("#"+pid).siblings("label").attr("ischecked", true);
  	  		}
  	  		
  	  	}else{
  	  		$("#provinceAll")[0].checked=false;
  	  		$("#city input[parentid="+pid+"]").each(function(){
  	  			this.checked=false;
  	  			addDivBox(this.id,0,0,0,true);  //去掉城市标签
  	  			$(this).siblings("label").attr("ischecked", false);
  	  		});
  	  		$("#area input").each(function(){
  	  			this.checked=false;
  	  			$(this).parent("div").addClass("layui-hide");
  	  			$(this).siblings("label").attr("ischecked", false);
  	  		});
  	  		//城市全部取消  就把上一级 省级框 也去选中
  	  		$("#"+pid)[0].checked=false;
  	  		addDivBox(pid,0,0,0,true);  //添加当前省份标签
  	  	}
  	  });
  	   //三级全选(area)
  	  $("#areaAll").change(function(){
  	  	var pid=$("#areaLab").attr("arealabid");
  	  	var parentid=$("#"+pid).attr("parentid");
  	  	if(this.checked){
  	  		$("#area input[parentid="+pid+"]").each(function(){
  	  			this.checked=true;
  	  			addDivBox(this.id, 0,0,0,true);  //去掉区域标签
  	  		});
  	  		$("#"+pid)[0].checked=true;
  	  		addDivBox(pid, $("#"+pid).attr("name"), $("#"+pid).val());  //添加当前城市标签
  	  		if($("#city input[parentid="+parentid+"]:checked").size()==$("#city input[parentid="+parentid+"]").size()){//所有城市==选中城市  （即：城市全选）全选中了
  	  			$("#cityAll")[0].checked=true;
  	  			$("#city input[parentid="+parentid+"]").each(function(){
	  	  			this.checked=true;
	  	  			addDivBox(this.id, 0,0,0,true);  //去掉city标签
	  	  		});
	  	  		$("#"+parentid)[0].checked=true;
	  	  		addDivBox(parentid, $("#"+parentid).attr("name"), $("#"+parentid).val(), 0);  //添加当前省份标签
  	  			if($("#province input:checked").size()==34){//省份全选了
  	  				$("#provinceAll")[0].checked=true;
  	  			}
  	  		}
  	  	}else{
  	  		$("#area input[parentid="+pid+"]").each(function(){
  	  			this.checked=false;
  	  			addDivBox(this.id, 0, 0, 0,true);  //去掉区域标签
  	  		});
  	  		//区域全部取消  就把上一级 市级框 去掉选中 并去掉标签
  	  		$("#"+pid)[0].checked=false;
  	  		$("#"+parentid)[0].checked=false;
  	  		addDivBox(pid, 0,0,0,true);  //去掉当前城市标签
  	  		addDivBox(parentid, 0,0,0,true);  //去掉当前省份标签
  	  		$("#provinceAll, #cityAll").each(function(){
  	  			this.checked=false;
  	  		});
  	  		$("#city input[parentid="+parentid+"]:checked").each(function(){
  	  			this.checked=true;
  	  			addDivBox(this.id, $(this).attr("name"), this.value, parentid);
  	  		});
  	  		
  	  	}
  	  });
  	  
  	function addProvince_city(result){
		var a=result;
		var provinces="";
		var citys="";
		for(var i=0; i<a.length; i++) {
	  	  if(a[i].Parent_Did==0 || a[i].Parent_Did=="0"){
	  	  	provinces+='<div class="line-list"><input type="checkbox" name="province" id="'+a[i].Did+'" value="'+a[i].Name+'"/><label ischecked labId="'+a[i].Did+'">'+a[i].Name+'</label></div>';
	  	  }else if(a[i].Parent_Did!=0 && a[i].Parent_Did!="0"){
	  	  	citys+='<div class="line-list layui-hide"><input type="checkbox" name="city" parentId="'+a[i].Parent_Did+'" id="'+a[i].Did+'" value="'+a[i].Name+'"/><label ischecked labId="'+a[i].Did+'">'+a[i].Name+'</label></div>';
	  	  }
	  	}
		$("#province").append(provinces);
		$("#city").append(citys);
	};
	
	function addArea(result){
		var b=result;
		var area="";
		for(var n=0;n<b.length;n++){
	  	  area+='<div class="line-list layui-hide"><input type="checkbox" name="area" parentId="'+b[n].Parent_Did+'" id="'+b[n].Did+'" value="'+b[n].Name+'"/><label ischecked labId="'+b[n].Did+'">'+b[n].Name+'</label></div>';
	  	}
		$("#area").append(area);
	};
  	  
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
  	  function addDivBox(id, name, value, pid,closeAll){
  	  	if(pid==null ||pid=="" || pid==undefined || pid==0){
  	  		pid=0;
  	  	}
  	  	if($("i[xid="+id+"]").length<=0){
	  	  	var divstr='<li class="liBox"><button class="layui-btn layui-btn-small layui-btn-normal">'+value+'</button><i class="fa fa-times-circle close" pid="'+pid+'" xid="'+id+'" level="'+name+'"></i></li>'
	  	  	$("ul.tab-title").append(divstr);
	  	  	
	  	  	$(".liBox > i.close").click(function(){
	  	  			var pid=$(this).attr("xid");
		  	  		$(this).parent("li").remove();
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
  	  };
  	  
  	  $("#submit_btn").click(function(){
  	  	var arr=[];
  	  	$("li.liBox i").each(function(){
  	  		var obj={};
  	  		obj.id=$(this).attr("xid");
  	  		obj.level=$(this).attr("level");
  	  		obj.parentid=$(this).attr("pid");
  	  		obj.name=$(this).siblings("button").text();
  	  		arr.push(obj);
  	  	})
  	  	console.log(arr);
  	  });
  	  
  	  $("#cancel_btn").click(function(){
  	  	$("ul.tab-title").empty();                     //清空所有标签
  	  	$("#provinceAll, #cityAll, #areaAll").each(function(){ 			 //城市和区域的全选 都去掉选定
  	  		this.checked=false;
  	  	});
  	  	
  	  	$("#provinceLab, #cityLab, #areaLab").each(function(){ 			 //城市和区域的标题 都清空
  	  		$(this).html("");
  	  	});
  	  	
  	  	$("#province input").each(function(){
  	  		this.checked=false;
  	  	});
  	  	var cigy_pid=$("#cityLab").attr("citylabid");
  	  	var area_pid=$("#areaLab").attr("arealabid");
  	  	$("#city input[parentid="+cigy_pid+"], #area input[parentid="+area_pid+"]").each(function(){
  	  		$(this).parent().addClass("layui-hide");
  	  	});
  	  	
  	  });
			
});
			
		
