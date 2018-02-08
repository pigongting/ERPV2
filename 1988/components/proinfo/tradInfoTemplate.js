layui.use(['layer', "woLianw", "upload"],function () {
	window.$ = layui.jquery;
	window.woLianw = layui.woLianw;
	window.upload = layui.upload;


	//设置 输入金额的 input 只能保留两位小数
	$(document).on({
		keyup: function(){
			var reg = $(this).val().match(/\d+\.?\d{0,2}/);
			var txt = '';
			if (reg != null) {
				txt = reg[0];
			}
			$(this).val(txt);
		},
		change: function(){
			$(this).keypress();
			var v = $(this).val();
			if (/\.$/.test(v)){
				$(this).val(v.substr(0, v.length - 1));
			}
            setSkuSamePrice($(this));
		}
	}, "input.themoney");

	function setSkuSamePrice(obj){
		if(obj.parent().parent().parent().parent().attr("id") === "skuSetTab") {
			if($("input[name='priceType']:checked").val()=="1") {
                var currentIndex = obj.parent().parent().children().index(obj.parent());
                var $editorTr = $("#skuSetTab").find("tr.editorTr");
                $.each($editorTr, function (i, item) {
                    $(item).find("td input[type=text]").eq(currentIndex).val(obj.val());
                });
            }
        }
	}

	//只能输入数字和小数(如：单位重量) 暂定保留3位小数
	$(document).on({
		keyup: function(){
			var reg = $(this).val().match(/\d+\.?\d{0,3}/);
			var txt = '';
			if (reg != null) {
				txt = reg[0];
			}
			$(this).val(txt);
		},
		change: function(){
			$(this).keypress();
			var v = $(this).val();
			if (/\.$/.test(v)){
				$(this).val(v.substr(0, v.length - 1));
			}
		}
	}, "input.onlyFloatNum");


	//只能输大于0的数字（包括小数）
	$(document).on({
		blur: function(){
			var  t = $(this).val();	//获取输入的值 
			if(!isNaN(t) && t > 0){
			}else{
				layer.msg("不能为0");
				$(this).val("");
				return;
			}
		}
	}, "input.notZeroNum");

	
	//只能输入正整数(不能输入字符串或者小数) 如：最大购买量 最小起订量
	$(document).on({
		keyup: function(){
			var c = $(this);  
			if(/[^\d]/.test(c.val())){ //替换非数字字符  
				var amount = c.val().replace(/[^\d]/g,'');    
				$(this).val(amount);  
			}
		}
	}, "input.onlyNum");


});
function TradInfoTemplate(data, datatype){
	//datatype: 1(spu) 2.(sku)
	var $ = layui.jquery;
	var  len = data.length;
	var str = "";
	if(datatype ==2 && data.length >0){
		$("#tradInfoIbox div.specifications").hide();
	}
	for(var i=0; i<len; i++){
		str += '<div class="ibox-content">';
			if(datatype == 2){
				str += '<div class="layui-form-item">';
			}else{
				str += '<div class="layui-form-item">';
			}
	        str += '<label class="layui-form-label" pid="'+data[i].pid+'">';
	        	//<!--判断是否必填 isNeed[true,false] 加红星-->
	       	if(data[i].isNeed || datatype == 2){ 
	       		str += '<i class="red">*</i>';
	       	}
	        str += data[i].name;
	        str += '</label>';
	        if(data[i].inputType == 2 || data[i].inputType == 3){
	        	str += '<div class="layui-input-inline w80">';
	        }else{ 
	        	str += '<div class="layui-input-inline">';
	        }
	        	//<!--判断  0为输入框-->
	        if(data[i].inputType == 0 && data[i].isNeed){
	        	if(datatype == 2 && data[i].valueList == null){ //如果
	        		str += '<div class="myselfitem"><input type="text" class="layui-input"><a href="javascript:;" class="layui-btn ml10 addMySelfItem">增加自定义项</a></div>';
		        }else{
		        	str += '<input type="text" name="'+data[i].name+'" lay-verify="noEmpty"  class="layui-input">';
		        }
	        }else if(data[i].inputType == 0 && !data[i].isNeed){
	        	if(datatype == 2 && data[i].valueList == null){
					str += '<div class="myselfitem"><input type="text" class="layui-input"><a href="javascript:;" class="layui-btn ml10 addMySelfItem">增加自定义项</a></div>';
		        }else{
		        	str += '<input type="text" name="'+data[i].name+'"  class="layui-input">';
		        }
	        }else if(data[i].inputType == 1 && data[i].isNeed){
	          //<!--判断  1为下拉框 这里要继续循环-->
	          str += '<select name="'+data[i].name+'" lay-filter="spuFilter" lay-verify="noEmpty">';
	          str += '<option value="">请选择</option>';
	          for(var a=0; a<data[i].valueList.length; a++){
          		str += '<option id="'+data[i].valueList[a].vid+'" value="'+data[i].valueList[a].name+'">'+data[i].valueList[a].name+'</option>';
          	  }
			    str += '</select>';
	        }else if(data[i].inputType == 1 && !data[i].isNeed){
		      str += '<select name="'+data[i].name+'" lay-filter="spuFilter">';
	          str += '<option value="">请选择</option>';
	          	for(var a=0; a<data[i].valueList.length; a++){
	          		str += '<option id="'+data[i].valueList[a].vid+'" value="'+data[i].valueList[a].name+'">'+data[i].valueList[a].name+'</option>';
	          	}
			    str += '</select>';
		    }else if(data[i].inputType == 2){
			      //<!--判断  2为多选框-->
			    for(var a=0; a<data[i].valueList.length; a++){
			      	str += '<input lay-skin="primary" lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input">';
			    }
			    if(datatype == 2){
			    	str += '<div class="myselfitem"><input type="text" class="layui-input"><a href="javascript:;" class="layui-btn ml10 addMySelfItem">增加自定义项</a></div>';
			    }
			}else if(data[i].inputType == 3){
				//<!--判断  2为单选框-->
				for(var a=0; a<data[i].valueList.length; a++){
			      	str += '<input lay-filter="spuFilter" type="radio" vid="'+data[i].valueList[a].vid+'" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input">';
			    }
				
			}
			str += '</div>';
			if(datatype ==1 && (data[i].inputType == 0 || data[i].inputType == 1)){
	        	str += '<div class="layui-input-inline">';
	        		str += '<label class="layui-form-label afterUnitName" pid="'+data[i].pid+'">'+data[i].unitName+'';
	        		str += '<input type="hidden" name="'+data[i].name+'" pid="'+data[i].pid+'" value="'+data[i].unitName+'" />';
	        		str += '</label>';
	        	str += '</div>';
			}
	      str += '</div>';
		str += '</div>';
	}
	
	return str;
}



		
function addTh($obj, name, value){
	var $ = layui.jquery;
	$obj.eq(0).before($("<th>"+name+"</th>"));  //生成表头
}

function addtd(tr, value, name){
	var $ = layui.jquery;
	var $td = '<td><input type="text" readonly="readonly" name="'+name+'" class="myselfInput" value="'+value+'"></td>';
	$(tr).prepend($td)
}

function addTr(layuidata, othercheckbox, isFirst, isNeedAddTd, thnum){
	var value = layuidata.value;
	var name = layuidata.elem.name;
	var $ = layui.jquery;
	var start = "<tr class=\"editorTr\">";
	var end = '<td><input type="text" name="vendorPrice" class="myselfInput themoney" lay-verify="noEmpty"></td>';
		end += '<td><input type="text" name="suggestPrice" class="myselfInput themoney" lay-verify="noEmpty"></td>';
		end += '<td><input type="text" name="marketPrice" class="myselfInput themoney" lay-verify="noEmpty"></td>';
		end += '<td><input type="text" name="saleAmount" lay-verify="noEmpty" class="myselfInput onlyNum"></td>';
		end += '<td><input type="text" name="skuNo" class="myselfInput" value=""></td>';
		end += '</tr>';
		if(isFirst) {  //如果是第一次加
			var tmp = '<tr class=\"editorTr\"><td><input type=\"text\" readonly=\"readonly\" name="'+name+'" class=\"myselfInput\" value="'+value+'"></td>';
			tmp += end;
			$("#skuSetTab").append(tmp);
		} else {
			if(isNeedAddTd) {
				$.each($("#skuSetTab").find("tr.editorTr"), function(i, item) {
					//现获取有几个column
					var $td = '<td><input type="text" readonly="readonly" name="'+name+'" class="myselfInput" value="'+value+'"></td>';
					$(item).prepend($td);
				})
		
			}
		
			var mid = "";
			var tdNum = thnum - 5;
			var newskutd = "";
			
			if(othercheckbox.length >= 1) {
				//获取表头的前面2个字段，还要获取当前被点击的对象的 sku的名称（用来对比 字段和value对应）
				var $firstTh = $("#skuSetTab").find("tr:first th").eq(0).text();
				var $secondTh = $("#skuSetTab").find("tr:first th").eq(1).text();
				var fristvalue = "";
				var secondthvalue = "";
		
				$.each(othercheckbox, function(i, item) {
					//现获取有几个column
					newskutd = "";
					if(tdNum == 1) {
						newskutd += '<td><input type="text" readonly="readonly" name="'+name+'" class="myselfInput" value="' + value + '"></td>';
					} else if(tdNum == 2) {
		
						if($firstTh == name) {
							fristvalue = value;
							secondthvalue = $(item).find("span").text();
						} else if($secondTh == name) {
							secondthvalue = value;
							fristvalue = $(item).find("span").text();
						}
						newskutd += '<td><input readonly="readonly" type="text" name="'+$firstTh+'" class="myselfInput" value="' + fristvalue + '"></td>';
						newskutd += '<td><input readonly="readonly" type="text" name="'+$secondTh+'" class="myselfInput" value="' + secondthvalue + '"></td>';
					}
					$("#skuSetTab").append(start + newskutd + end);
				})
			} else {
		
				if(tdNum == 1) {
					newskutd += '<td><input readonly="readonly" type="text" name="'+name+'" class="myselfInput"  value="' + value + '"></td>';
				} else if(tdNum == 2) {
					newskutd += '<td><input readonly="readonly" type="text" name="'+name+'" class="myselfInput"  value="'+value+'"></td>';
					newskutd += '<td><input readonly="readonly" type="text" name="'+name+'" class="myselfInput" value="'+value+'"></td>';
				}
		
				$("#skuSetTab").append(start + newskutd + end);
			}
			
		}
	
}

function setSame(index){
	var $editorTr =   $("#skuSetTab").find("tr.editorTr");
	var thNum = $("#skuSetTab").find("tr:first th").length;    //表头的字段数量
	var realIndex = thNum-5+index;
	var value=0;
	
	$.each($editorTr, function(i, item){
		if(i==0){
			value = $(item).find("td input[type=text]").eq(realIndex).val();	
		}else{
			$(item).find("td input[type=text]").eq(realIndex).val(value);
		}
		
	});

	if(index == 3){ //可售数量
		$("div.specifications").find("input[name=saleAmount]").val(parseFloat(value)*$editorTr.length);
	}	
}

function deleCheckbox(obj,name,value){
	$(obj).prev().removeClass("layui-form-checked");
	removeAll(obj,name,value);
	$(obj).prev().remove();
	$(obj).prev().remove();
	$(obj).remove();
}

function removeAll(obj,name,value){
		
	//取消勾选		
				var $th = $("#skuSetTab").find("tr:first th");
						var $editorTr2 = $("#skuSetTab").find("tr.editorTr");  //当前存在的 有数据的tr
						var $divBox = $(obj).parents("div.layui-input-inline");
						var checkedarray = $divBox.find("div.layui-form-checked");
						var $otherCheckBoxDiv = $divBox.parents("div.ibox-content").siblings().find("div.layui-input-inline");  //另外所有属性下的所有checkbox 盒子
						var othercheckedarray = $otherCheckBoxDiv.find("div.layui-form-checked");
						var thIndex =0;
						if(checkedarray.length < 1){ //点击的checkbox集合没有一个被选中
							if(othercheckedarray.length < 1){
								$.each($editorTr2, function(i, e){
									$(e).remove();
								})
							}
							$.each($th, function(i,item) {
								if($(this).text() == name){
									$(this).remove(); 
									thIndex=i;
									return false;
								}
							});
							$.each($editorTr2, function() {
								$(this).find("td").eq(thIndex).remove();
								//把对应的其他输入框的内容清空
								
							})
						}else{
							$.each($editorTr2, function(i, e){
								if($(e).find("input[type=text]").eq(0).val() == value || $(e).find("input[type=text]").eq(1).val() == value){
									$(e).remove();
								}
							})
						}
					var _elem = document.getElementById(value);
					$(_elem).parent().remove();
	
}

function deletePic(obj, value){
	var $ = layui.jquery;
	var $targetParent = $(obj).parent("div.listColorPicter");
	$targetParent.find("img.uploadPreviewImg").remove();
  	var $editorTr = $("#skuSetTab").find("tr.editorTr");
	$.each($editorTr, function(i, e){
		if($(this).find("input[type=hidden]").eq(0).attr("name") == value){
			//创建一个type ==hidden的
			$(this).find("input[type=hidden]").eq(0).remove();
			
		}else if($(this).find("input[type=hidden]").eq(1).attr("name") == value){
			$(this).find("input[type=hidden]").eq(1).remove();
		}
	});

	var $elem = $(obj).siblings("div");
	var colorId = $elem.attr("id");
	var uploadPicter3 = upload.render({
	    elem: $elem //绑定元素
	    ,url: woLianw.url+'/sell/product/uploadfile' //上传接口
	    ,method: "post"
	    ,accept: "images"  //指定允许上传的文件类型，可选值有：images（图片）、file（所有文件）、video（视频）、audio（音频）
	    ,exts: "jpg|png|gif|bmp|jpeg"	 //允许上传的文件后缀  如果 accept 未设定，那么限制的就是图片的文件格式
	    ,size: 10240 //最大允许上传的文件大小
	    ,auto: true   //是否选完文件后自动上传
	    ,field: "file" 	//设定文件域的字段名
	    ,multiple: true  //是否允许多文件上传。设置 true即可开启。不支持ie8/9
	    ,number: 5   //设置同时可上传的文件数量，一般配合 multiple 参数出现   0（即不限制）
	    ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
		    //layer.msg("正在上传！", {time: 1000}); //上传loading
		  }
	    ,done: function(res, index, upload){
	      //code=1代表上传成功
	      
		    if(res.code == 1){
		    	 var str = "<input type='hidden' name='颜色' value='"+res.data+"' />";
		    	var $editorTr = $("#skuSetTab").find("tr.editorTr");
		    	$.each($editorTr, function(i, e){
		    		if($(this).find("input[type=text]").eq(0).val() == colorId){
						//创建一个type ==hidden的
						$(this).find("input[type=hidden]").remove();
		    			$(this).find("input[type=text]").eq(0).after(str);
		    			
		    		}else if($(this).find("input[type=text]").eq(1).val() == colorId){
						$(this).find("input[type=hidden]").remove();
		    			$(this).find("input[type=text]").eq(1).after(str);
		    		}
		    	});
				var $elemParent = $elem.parent(); //点击上传目标元素的 父元素
				var $img = '<img class="uploadPreviewImg" src="'+ woLianw.getImgUrl(res.data)+'" width="99px" height="99px" />';
				$elemParent.append($img);
				$elemParent.find("p.thedele").removeClass("layui-hide");
	     		
	     		
	    	}
		  }
	    ,error: function(results){
	      //请求异常回调
	      console.log(results);
	    }
	  });
	$(obj).hide();
		    	
	
}

function createUploadPIc(colorValue){
	layui.use(['element','form', 'layer', 'upload', "woLianw"],function () {
		var upload = layui.upload;
		var $ = layui.$;
		var woLianw = layui.woLianw;
		var str = '<div class="listColorPicter">';
				str += '<div class="listColorPicter-upload" id="'+colorValue+'">';
				str += '	<i class="fa fa-cloud-upload"></i>';
				str += '</div>';
				str += '<p class="thecolor">'+colorValue+'</p>';
				str += '<p class="thedele layui-hide" onclick="deletePic(this,\''+colorValue+'\')"'+'>删除</p>';
			str += '</div>';
		$("#skuPicture").find("div.layui-upload-row").append(str);
		var $elem = document.getElementById(colorValue);
		var uploadPicter2 = upload.render({
	    elem: $elem //绑定元素
	    ,url: woLianw.url+'/sell/product/uploadfile' //上传接口
	    ,method: "post"
	    ,accept: "images"  //指定允许上传的文件类型，可选值有：images（图片）、file（所有文件）、video（视频）、audio（音频）
	    ,exts: "jpg|png|gif|bmp|jpeg"	 //允许上传的文件后缀  如果 accept 未设定，那么限制的就是图片的文件格式
	    ,size: 10240 //最大允许上传的文件大小
	    ,auto: true   //是否选完文件后自动上传
	    ,field: "file" 	//设定文件域的字段名
	    ,multiple: false  //是否允许多文件上传。设置 true即可开启。不支持ie8/9
	    ,number: 5   //设置同时可上传的文件数量，一般配合 multiple 参数出现   0（即不限制）
	    ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
		    layer.msg("正在上传！", {time: 1000}); //上传loading
		  }
	    ,done: function(res, index, upload){
	      //code=1代表上传成功
	      
		    if(res.code == 1){
		    	var str = "<input type='hidden' name='颜色' value='"+res.data+"' />";
		    	var $editorTr = $("#skuSetTab").find("tr.editorTr");
		    	$.each($editorTr, function(i, e){
		    		if($(this).find("input[type=text]").eq(0).val() == colorValue){
		    			//创建一个type ==hidden的
		    			$(this).find("input[type=text]").eq(0).after(str);
		    			
		    		}else if($(this).find("input[type=text]").eq(1).val() == colorValue){
		    			$(this).find("input[type=text]").eq(1).after(str);
		    		}
		    	});
				var $targetParent = $("#"+colorValue).parent(); //点击上传目标元素的 父元素
				
				var $img = '<img class="uploadPreviewImg" src="'+woLianw.getImgUrl(res.data)+'" width="99px" height="99px" />';
	     		$targetParent.append($img);
	     		$targetParent.find("p.thecolor").text(colorValue);
	     		$targetParent.find("p.thedele").removeClass("layui-hide");
	     		
	     		
	    	}
		  }
	    ,error: function(results){
	      //请求异常回调
	      console.log(results);
	    }
	  });
 })
}


function FillList(data, first){
	var ischeckUser = localStorage.getItem("ischeckUser") == "true";
	//非免审核用户
	if(ischeckUser){
		layui.use(['element', 'layer', "woLianw"],function () {
			var $ = layui.jquery;
			$("#goodsCategory").removeClass("layui-hide");
			
			if(data.length > 0 && !first){
				$("#ulAppCategoryResults").removeClass("layui-hide");
				layui.woLianw.renderDataHtml(data, "ulAppCategoryResultsItemTemplate", "ulAppCategoryResults");
			}else if(data.length > 0 && first){
				$("#inputAppCategory").attr("lay-verify","noEmpty");
			}
		})
	}
	//免审核用户
	else{
		$("#goodsCategory").addClass("layui-hide");
	}
	
}


