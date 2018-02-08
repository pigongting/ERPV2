layui.use(['layer', "woLianw"],function () {
	window.$ = layui.jquery;
	window.woLianw = layui.woLianw;
});





//只放sku数据
function TradInfoEditorTemplate2(data){
	var  len = data.length;
	var str = "";
	if(data.length >0){
		$("#tradInfoIbox div.specifications").hide();
	}
	for(var i=0; i<len; i++){
		str += '<div class="ibox-content">';
			str += '<div class="layui-form-item">';
				str += '<label class="layui-form-label" pid="'+data[i].pid+'">';
					str += '<i class="red">*</i>';
					str += data[i].name;
					str += '</label>';
				str += '<div class="layui-input-inline w80">';

			    for(var a=0; a<data[i].valueList.length; a++){
					var customize = data[i].valueList[a].customize;
		
					if( data[i].name =="颜色" && data[i].valueList[a].name &&  (data[i].valueList[a].name.indexOf("|") != -1) ){
						var $colorArr = data[i].valueList[a].name.split("|");
						var color=$colorArr[0];
						var url=$colorArr[1];
						if(customize){
							// str += `<input lay-skin="primary" checked lay-filter="skuFilter" type="checkbox" name="`+data[i].name+`" title="`+color+`" value="`+color+`" lay-verify="noEmpty" class="layui-input">
							// 	<a href="javascript:;" class="deleCheckbox" onclick="deleCheckbox(this,'`+data[i].name+`', '`+data[i].value+`')">删除</a>
							// 	`;
							str += '<input lay-skin="primary" checked lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+color+'" value="'+color+'" lay-verify="noEmpty" class="layui-input">';
							str += '<a href="javascript:;" class="deleCheckbox" onclick="deleCheckbox(this, \''+data[i].name+'\', \''+data[i].value+'\')"'+'>删除</a>';
								
						}else{
							str += '<input lay-skin="primary" checked lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+color+'" value="'+color+'" lay-verify="noEmpty" class="layui-input">';
						}

						$("#skuPicture").removeClass("layui-hide");
						var picts = '';
						picts += '<div class="listColorPicter">';
							picts += '<div class="listColorPicter-upload" id="'+color+'">';
								picts += '<i class="fa fa-cloud-upload"></i>';
							picts += '</div>';
							picts += '<input class="layui-upload-file" type="file" name="file" multiple="">';
							picts += '<p class="thecolor">'+color+'</p>';
							picts += '<p class="thedele" onclick="deletePic(this,'+color+')">删除</p>';
							picts += '<img class="uploadPreviewImg" src="'+woLianw.getImgUrl(url)+'" width="99px" height="99px">'
						picts += '</div>';
						$("#skuPicture div.layui-upload-row").append(picts);
					}else{
						if(data[i].valueList[a].checked){
							if(customize){
								// str += `<input lay-skin="primary" checked lay-filter="skuFilter" type="checkbox" name="`+data[i].name+`" title="`+data[i].valueList[a].name+`" value="`+data[i].valueList[a].name+`" lay-verify="noEmpty" class="layui-input" />
								// 	<a href="javascript:;" class="deleCheckbox" onclick="deleCheckbox(this,'`+data[i].name+`', '`+data[i].valueList[a].name+`')">删除</a>
								// 	`;
								str += '<input lay-skin="primary" checked lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input">';
								str += '<a href="javascript:;" class="deleCheckbox" onclick="deleCheckbox(this, \''+data[i].name+'\', \''+data[i].valueList[a].name+'\')"'+'>删除</a>';
							}else{
								str += '<input lay-skin="primary" checked lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input" />';
							}
						}else{
							if(customize){
								// str += `<input lay-skin="primary" lay-filter="skuFilter" type="checkbox" name="`+data[i].name+`" title="`+color+`" value="`+color+`" lay-verify="noEmpty" class="layui-input" />
								// 	<a href="javascript:;" class="deleCheckbox" onclick="deleCheckbox(this,'`+data[i].name+`', '`+data[i].valueList[a].name+`')">删除</a>
								// 	`;
								str += '<input lay-skin="primary" checked lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+color+'" value="'+color+'" lay-verify="noEmpty" class="layui-input">';
								str += '<a href="javascript:;" class="deleCheckbox" onclick="deleCheckbox(this, \''+data[i].name+'", \''+data[i].valueList[a].name+'\')"'+'>删除</a>';
									
							}else{
								str += '<input lay-skin="primary" lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input" />';
							}
						}
						
					}
			    }
			    
			    str += '<div class="myselfitem"><input type="text" class="layui-input"><a href="javascript:;" class="layui-btn ml10 addMySelfItem">增加自定义项</a></div>';
	        str += '</div>';
	      str += '</div>';
		str += '</div>';
	}
	
	return str;
}

function getBigImg(data){
	var str = "";
	var $ulpreview = $('#picterViewList');
	var $ulpreviewBox = $ulpreview.parent();
		$ulpreviewBox.removeClass("layui-hide");
		var $li = "";
		for(var i = 0; i < data.length; i++){
			$li += '<li class="isUpload" id="listImg'+i+'">';
			$li += '<img src="'+woLianw.getImgUrl(data[i])+'" />';
			$li += '<span class="fa fa-check">';
			$li += '</li>';
			picUrls.push(data[i]);
		}
		
	$ulpreview.append($li);

}



function deleBigPic(){
	var $ulpreview = $('#picterViewList');
	//删除
	$ulpreview.find('span.fa-times-circle').on('click', function(){
		//delete files[index]; //删除对应的文件
		var $li = $(this).parents("li");
		var $url = $(this).siblings("img").attr("src");
		$li.remove();
		//uploadPicter.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
		if($ulpreview.find("li").length == 0){
			$ulpreview.parent().addClass("layui-hide");
		}
		var index = picUrls.indexOf($url);
		if (index > -1) {
			picUrls.splice(index, 1);
		}
	});
	
	$("#startUpload").removeAttr("disabled");
}

//只放spu数据
function TradInfoEditorTemplate(data){
	//datatype: 1(spu)
	var  len = data.length;
	var str = "";//用来装spu
	var str2 = "";//用来装自定义属性
	for(var i=0; i<len; i++){
		if( data[i].inputType != null && data[i].customize == false){  
			str += '<div class="ibox-content">';
			str += '<div class="layui-form-item">';
				str += '<label class="layui-form-label" pid="'+data[i].pid+'">';
					//<!--判断是否必填 isNeed[true,false] 加红星-->
				if(data[i].isNeed){ 
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
					
						var inputText = data[i].inputValue ? data[i].inputValue : "";
						str += '<input type="text" name="'+data[i].name+'" lay-verify="noEmpty" value="'+inputText+'"  class="layui-input">';
				
				}else if(data[i].inputType == 0 && !data[i].isNeed){
					
						var inputText = data[i].inputValue ? data[i].inputValue : "";
						str += '<input type="text" name="'+data[i].name+'" value="'+inputText+'" class="layui-input">';
					
				}else if(data[i].inputType == 1 && data[i].isNeed){
				//<!--判断  1为下拉框 这里要继续循环-->
				str += '<select name="'+data[i].name+'" lay-filter="spuFilter" lay-verify="noEmpty">';
				str += '<option value="">请选择</option>';
					for(var a=0; a<data[i].valueList.length; a++){
						//如果是选定状态 下拉要加上 selected = selected
						if(!data[i].valueList[a].customize){ //不是自定义属性
							if(data[i].valueList[a].checked){
								str += '<option id="'+data[i].valueList[a].vid+'" selected="selected" value="'+data[i].valueList[a].name+'">'+data[i].valueList[a].name+'</option>'; 
							}else{
								str += '<option id="'+data[i].valueList[a].vid+'" value="'+data[i].valueList[a].name+'">'+data[i].valueList[a].name+'</option>';
							}
						}else if(data[i].valueList[a].customize){
							//显示自定义属性
						}
						
					}
				str += '</select>';
				}else if(data[i].inputType == 1 && !data[i].isNeed){
				str += '<select name="'+data[i].name+'" lay-filter="spuFilter">';
					str += '<option value="">请选择</option>';
					for(var a=0; a<data[i].valueList.length; a++){
						//如果是选定状态 下拉要加上 selected = selected
						if(!data[i].valueList[a].customize){ //不是自定义属性
							if(data[i].valueList[a].checked){
								str += '<option id="'+data[i].valueList[a].vid+'" selected="selected" value="'+data[i].valueList[a].name+'">'+data[i].valueList[a].name+'</option>'; 
							}else{
								str += '<option id="'+data[i].valueList[a].vid+'" value="'+data[i].valueList[a].name+'">'+data[i].valueList[a].name+'</option>';
							}
						}else if(data[i].valueList[a].customize){
							//显示自定义属性
						}
						
					}
					str += '</select>';
				}else if(data[i].inputType == 2){
					//<!--判断  2为多选框-->
					for(var a=0; a<data[i].valueList.length; a++){
						if(data[i].valueList[a].checked){
							str += '<input lay-skin="primary" lay-filter="skuFilter" checked type="checkbox" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input">';
						}else{
							str += '<input lay-skin="primary" lay-filter="skuFilter" type="checkbox" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input">';
						}
					}
					
				}else if(data[i].inputType == 3){
					//<!--判断  2为单选框-->
					for(var a=0; a<data[i].valueList.length; a++){
						if(data[i].valueList[a].checked){
							str += '<input lay-filter="spuFilter" checked type="radio" vid="'+data[i].valueList[a].vid+'" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input">';
						}else{
							str += '<input lay-filter="spuFilter" type="radio" vid="'+data[i].valueList[a].vid+'" name="'+data[i].name+'" title="'+data[i].valueList[a].name+'" value="'+data[i].valueList[a].name+'" lay-verify="noEmpty" class="layui-input">';
						}
						
					}
					
				}
				str += '</div>';
				if(data[i].inputType == 0 || data[i].inputType == 1){
					str += '<div class="layui-input-inline">';
						str += '<label class="layui-form-label afterUnitName" pid="'+data[i].pid+'">'+data[i].unitName+'';
						str += '<input type="hidden" name="'+data[i].name+'" pid="'+data[i].pid+'" value="'+data[i].unitName+'" />';
						str += '</label>';
					str += '</div>';
				}
			str += '</div>';
			str += '</div>';
		}else if(data[i].inputType == null && data[i].customize == true){  //自定义属性   //spuInfoAddKey

				str2 += '<div class="layui-input-block afterAddAttrBox">';
					str2 += '<input type="text" value="'+data[i].name+'" maxlength="100" name="spuInfoAddKey" class="layui-input afterAddAttr"> : '; 
					str2 += '<input type="text" value="'+data[i].inputValue+'" maxlength="100" name="spuInfoAddValue" class="layui-input afterAddAttr">';
					str2 += '<a href="javascript:;" class="layui-btn deleteAttrBtn"><i class="fa fa-trash">&nbsp;&nbsp;删除</i></a>';
				str2 += '</div>';
		}
	}
	$("#afterAddAttrWrap").append(str2);
	return str;
}


	//使用运费模板
	function useFreightTemplate(data, fid){
		//data: 传入的模板数据   fid：接收的后台所传入的模板id 
		var str = '<option value="" freightType="0">请选择</option>';
		for(var i = 0; len = data.length, i < len; i++){
			if(data[i].id == fid){
				str += '<option value="'+data[i].id+'" selected freightType="'+data[i].chargeType+'">'+data[i].name+'</option>';
			}else{
				str += '<option value="'+data[i].id+'" freightType="'+data[i].chargeType+'">'+data[i].name+'</option>';
			}
		}
		$("#useFreight").html(str);
	}
	
		
