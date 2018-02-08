 layui.use(['element','jquery', "woLianw"], function () {
	window.$ = layui.$;
	window.woLianw = layui.woLianw;

 });
String.format = function() {
    if( arguments.length == 0 )
        return null;

    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}



function getProductAttr(dataString){
	var data = JSON.parse(dataString);
	var str = "";
	for(var item in data){
			if(data[item].length>0&& $.trim(data[item][0]).length>1){
			str += '<li>'+item+":";
			for(var a=0; a< data[item].length; a++){
				str += data[item][a]+" ";
			}
			str += "</li>";
		}
	}
	//console.log(str);
	return str;

}
 var sku1value="";
 var goodsDatadetail="";

function getSkuList(skuList, skuMap, unitName){
	window.unitName = unitName;
	var str = "";
	if(!skuMap) {layer.msg("商品信息错误",{time:2000});return ;}
	var skulength = skuList ? skuList.length : 0 ;
	//var skuMaplength =  skuMap.length ;
	goodsDatadetail = skuMap;

	//
	if(skulength==1){
		str = '<td valign="top"><span class="pr_title">{0}：</span></td><td><table border="0px" cellspacing="0" cellpadding="0">';
		for(var i in skuMap){

			var obj = JSON.parse(skuMap[i].properties);
			var objname ="";
			var objvalue = "";
			for(var item in obj){
				objname = item; objvalue=obj[item];break;
			}
			str  = String.format(str,objname)+'<tr>';
			str  += '<td><span class="pr_title" skuNo="'+skuMap[i].skuNo+'" id="'+skuMap[i].id+'">'+objvalue+'</span></td>';
			str  += '<td><span class="pr_title">￥'+skuMap[i].buyPrice+'</span></td>';
			str  += '<td><span class="pr_title">'+skuMap[i].saleAmount+' '+unitName+'可售</span></td>';
			str  += '<td class="gd-skuNum">';
						str +='<span class="skuNum-span spanMinus"><i class="fa fa-minus"></i></span>';
						str +='<input max="100" class="gd-btn"  skuNo="'+skuMap[i].skuNo+'" id="'+skuMap[i].id+'" type="text" name="'+skuMap[i].id+'" value="0">';
						 str +='<span class="skuNum-span spanPlus"><i class="fa fa-plus"></i></span>';
			str += '</td>';
			str += '</tr>';
		}

		str += "</table></td>";
		document.getElementById("skuMap").innerHTML = str;

	}else if(skulength==0){ //没有sku
		str = '<td valign="top"></td><td><table border="0px" cellspacing="0" cellpadding="0">';
		var price =0;
		var skuid =0;
		var mount =0;

		for(var i in skuMap){
			price = skuMap[i].buyPrice;
			skuid = skuMap[i].id;
			mount = skuMap[i].saleAmount;
			break;
		}

		str  += '<tr>';
		str  += '<td><span class="pr_title"></span></td>';
		str  += '<td><span class="pr_title">￥'+price+'</span></td>';
		str  += '<td><span class="pr_title">'+mount+' '+unitName+'可售<span></td>';
		str  += '<td class="gd-skuNum">';
					str +='<span class="skuNum-span spanMinus"><i class="fa fa-minus"></i></span>';
					str +='<input max="100" class="gd-btn" id="'+skuid+'" type="text" name="'+skuid+'" value="0">';
					str +='<span class="skuNum-span spanPlus"><i class="fa fa-plus"></i></span>';
		str += '</td>';
		str += '</tr>';
		str += "</table></td>";
		document.getElementById("skuMap").innerHTML = str;
	}else if(skulength==2){

	    //为了方便，直接遍历一次，看看是否有颜色的规格，如果有，则检查颜色是不是放在数组的前面，
        var colorIndex = -1;
        var newSkuList=[];
        for(var i = 0; i < skulength; i++){
            if($.trim(skuList[i].property)=="颜色"){
                colorIndex=i;
            }else {
                newSkuList.push(skuList[i]);
            }
        }
        //说明有颜色的规格
        if(colorIndex>=0){
            newSkuList.unshift(skuList[colorIndex]);
        }


		var selectedValue="";
		var firstskuname ="";
		for(var i = 0; i < skulength; i++){
			str += '<td><span class="pr_title">'+newSkuList[i].property+'：</span></td><td><div class="skuListDiv">';
			firstskuname =newSkuList[i].property;
            var selected="checked";
			for(var a=0; lan = newSkuList[i].values.length,  a < lan; a++){

				if($.trim(newSkuList[i].property)=="颜色"){
					var tmparray = newSkuList[i].values[a].split("|");
					if(a==0) {
						selectedValue=tmparray[0];
						sku1value = tmparray[0];
					}
					if(tmparray.length==1){
						str += '<a href="javascript:;" name="'+newSkuList[i].property+'" class="skuListA '+selected+'"  onclick="setSKU1(this)">'+tmparray[0]+'</a>';
					}else{
						str += '<a href="javascript:;" name="'+newSkuList[i].property+'" class="skuListA '+selected+'" img="'+tmparray[1]+'" onclick="setSKU1(this)">'+tmparray[0]+'</a>';
					}
				}else{
					str += '<a href="javascript:;"  name="'+newSkuList[i].property+'" class="skuListA '+selected+'" onclick="setSKU1(this)">'+newSkuList[i].values[a]+'</a>';
				}
				selected="";
		}
		str += '</div></div></td></tr>';
		//只需要遍历一次第一个
		break;

	  }
	  document.getElementById("skuList").innerHTML = str;
	  str = "";
	  str += '<td valign="top"><span class="pr_title">{0}：</span></td><td><table border="0px" cellspacing="0" cellpadding="0">';
		for(var i in skuMap){
            if(skuMap[i].properties.length<3) continue;
			var obj = JSON.parse(skuMap[i].properties);
			var objname ="";
			var objvalue = "";
			var sku2value ="";
			for(var item in obj){
				if(item!=firstskuname){
					objname = item; objvalue=obj[item];break;
				}
				//i++;sku2value=obj[item];
			}
			//if(selectedValue==objvalue){
				str  = String.format(str,objname)+'<tr>';
				str  += '<td><span class="pr_title" skuNo="'+skuMap[i].skuNo+'" id="'+skuMap[i].id+'">'+objvalue+'<span></td>';
				str  += '<td><span class="pr_title">￥'+skuMap[i].buyPrice+'<span></td>';
				str  += '<td><span class="pr_title">'+skuMap[i].saleAmount+' '+unitName+'可售<span></td>';
				str  += '<td class="gd-skuNum">';
							str +='<span class="skuNum-span spanMinus"><i class="fa fa-minus"></i></span>';
							str +='<input max="100" class="gd-btn" skuvalue='+objvalue+'  skuNo="'+skuMap[i].skuNo+'" id="'+objvalue+'" type="text" name="'+objvalue+'" value="0">';
							str +='<span class="skuNum-span spanPlus"><i class="fa fa-plus"></i></span>';
				str += '</td>';
				str += '</tr>';
			//}
		}

		str += "</table></td>";
		document.getElementById("skuMap").innerHTML = str;
			//第一次 模拟点击 第一个选中的
		var skulist = document.getElementById("skuList");
		$(skulist).find("div.skuListDiv .checked").trigger("click");
	}

}

function setSKU1(obj){

	//替换轮播图中的大图
	var $imgUrl = $(obj).attr("img");
	if($imgUrl){
		$("div.bigImgBox img").attr("src", woLianw.getImgUrl($imgUrl));
	}
	sku1value = $(obj).text();
	sku1name = $(obj).attr("name");
	//更新下面的SKU列表
	document.getElementById("skuMap").innerHTML = "";
	//清空下面的sku输入框
	str = '<td valign="top"><span class="pr_title">{0}：</span></td><td><table border="0px" cellspacing="0" cellpadding="0">';
	for(var i in goodsDatadetail){
		var obj = JSON.parse(goodsDatadetail[i].properties);
		var objname ="";
		var objvalue = "";
		var sku2value ="";
		var sku2name = "";
		var  ii = 0;
		for(var item in obj){
			if(item==sku1name){
				objname = item; objvalue=obj[item];
			}else{
				sku2value=obj[item];sku2name=item;
			}
		}
		if(sku1value==objvalue){
			str  = String.format(str,sku2name)+'<tr>';
			str  += '<td><span class="pr_title" skuNo="'+goodsDatadetail[i].skuNo+'" id="'+goodsDatadetail[i].id+'">'+sku2value+'<span></td>';
			str  += '<td><span class="pr_title">￥'+goodsDatadetail[i].buyPrice+'<span></td>';
			str  += '<td><span class="pr_title">'+goodsDatadetail[i].saleAmount+' '+unitName+'可售<span></td>';
			str  += '<td class="gd-skuNum">';
						str +='<span class="skuNum-span spanMinus"><i class="fa fa-minus"></i></span>';
						str +='<input max="100" class="gd-btn" skuvalue='+sku2value+'  skuNo="'+goodsDatadetail[i].skuNo+'" id="'+goodsDatadetail[i].id+'" type="text" name="'+goodsDatadetail[i].id+'" value="0">';
						str +='<span class="skuNum-span spanPlus"><i class="fa fa-plus"></i></span>';
			str += '</td>';
			str += '</tr>';
		}
	}
	str += "</table></td>";
	document.getElementById("skuMap").innerHTML = str;
}

function getPriceRange(ladderPriceList, unitName){

	var str = "";
	var ladderLength = ladderPriceList.length;
	var jgtd = '<td><span class="pr_title">价格</span></td>';
	var  qjtd  ='<td><span class="pr_title">区间</span></td>';

	for(var i =0 ; i<ladderLength; i++ ){
		//拼接价格
		jgtd += '<td class="orange"><i>￥</i><em>'+ladderPriceList[i].buyPrice+'</em></td>';
		qjtd += '<td>'+ladderPriceList[i].minNum + unitName+'</td>';
	}

	document.getElementById("buyPrice").innerHTML = jgtd;
	document.getElementById("minNum").innerHTML = qjtd;

	$("#skuList").find("td table tr").each(function(){
		$(this).find("td").eq(1).text("");
	});

}

function buyNow(){ //立即购买
	//找到第一个sku属性
	//sku1value

	layui.use(['element', "woLianw", "layer"], function () {
		var results = 0;
		var sumbitskudata=[];
		var $inps = $("#skuMap").find("td table tr input.gd-btn");
		var islist = $("#skuList").children().length > 0;
		var minNum = parseInt($.trim($("#minBuyNumSpan").text()));
		var maxNum = parseInt($.trim($("#maxBuyNumSpan").text()));

		var buyCount = 0;
		$.each($inps, function(i, item){
			var value = $(this).val();
			if(value>0){
				//单个sku属性提交
                buyCount +=   parseInt(value);
				if(!islist){
					var parameter = {
						"skuId": item.id,
						"number": value
					}
					sumbitskudata.push(parameter);
				}else{
					var skuvalue = $(this).attr("skuvalue");
					for(var i in goodsDatadetail){
						var obj = JSON.parse(goodsDatadetail[i].properties);
						var obj1value = "";
						var obj2value ="";
						var  ii = 0;
						for(var item in obj){
							if(ii==0) {
								obj1value=obj[item];
							}else{
								obj2value=obj[item];
							}
							ii++;
						}
						if(sku1value==obj1value && skuvalue==obj2value){ //如果第一个sku的值和第二个sku的值都相等
							parameter = {
								"skuId": goodsDatadetail[i].id,
								"number": value
							}
							sumbitskudata.push(parameter);
						}
						else if(sku1value==obj2value && skuvalue==obj1value){ //如果第一个sku的值和第二个sku的值都相等
							parameter = {
								"skuId": goodsDatadetail[i].id,
								"number": value
							}
							sumbitskudata.push(parameter);
						}
					}
				}

			}
		});
		if(buyCount<minNum){layer.msg("商品数量必须大于0，并且不能小于最小购买量。",{time:1500});return ;}
		if(maxNum && buyCount>maxNum){layer.msg("商品数量必须大于0，并且不能大于最大购买量。",{time:1500});return ;}
		layui.woLianw.buyNow({"skuInfo":JSON.stringify(sumbitskudata)}, function(response){
			results = response.data;
		});
		window.sessionStorage.setItem('buyCartInfo', JSON.stringify(results));
		window.open('../buyCartModule/cart/settlement.html', '_blank');
	});

}
//点击加入购物车
function addToCart(obj){
	//找到第一个sku属性
	//sku1value
	if($(obj).attr("disabled")){
		return;
	}
	var sumbitskudata=[];
	var results = 0;
	var parameter = "";
	layui.use(['element', "woLianw", "layer"], function () {
		var $inps = $("#skuMap").find("td table tr input.gd-btn");
		var islist = $("#skuList").children().length > 0;
        var minNum = parseInt($.trim($("#minBuyNumSpan").text()));
        var maxNum = parseInt($.trim($("#maxBuyNumSpan").text()));
        var buyCount = 0;
		$.each($inps, function(i, item){
			var value = $(this).val();
			if(value>0){
				//单个sku属性提交
                buyCount +=   parseInt(value);
				if(!islist){
					parameter = {
						"skuId": item.id,
						"number": value
					}
					sumbitskudata.push(parameter);
				}else{
					var skuvalue = $(this).attr("skuvalue");
						for(var i in goodsDatadetail){
							var obj = JSON.parse(goodsDatadetail[i].properties);
							var obj1value = "";
							var obj2value ="";
							var  ii = 0;
							for(var item in obj){
								if(ii==0) {
									obj1value=obj[item];
								}else{
									obj2value=obj[item];
								}
								ii++;
							}
							if(sku1value==obj1value && skuvalue==obj2value){ //如果第一个sku的值和第二个sku的值都相等
								parameter = {
									"skuId": goodsDatadetail[i].id,
									"number": value
								}
								sumbitskudata.push(parameter);
							}
							else if(sku1value==obj2value && skuvalue==obj1value){ //如果第一个sku的值和第二个sku的值都相等
								parameter = {
									"skuId": goodsDatadetail[i].id,
									"number": value
								}
								sumbitskudata.push(parameter);
							}
						}
				}
			}
		});
		if(buyCount<minNum){layer.msg("商品数量必须大于0，并且不能小于最小购买量。",{time:1500});return ;}
		if(maxNum && buyCount>maxNum){layer.msg("商品数量必须大于0，并且不能大于最大购买量。",{time:1500});return ;}
		layui.woLianw.addToCarts({"skuInfo":JSON.stringify(sumbitskudata)}, function(response){
			layer.msg("加入进货单成功！", {time: 1500});
			//加入进货单以后 刷新一下进货单的数量显示
			layui.woLianw.buyCartSum(function(response){
				$("div.shopping-cart").find("span.layui-badge").html(response.data);
			});
		});
	});
}



function check(){
	var $minBuyNum = parseFloat($("#minBuyNumSpan").html());
	var $maxBuyNum = parseFloat($("#minBuyNumSpan").html());

}





//店内搜索
function storeSearch(data){
	var str = "";
	if(data){
		keyArr= data.split(",");
		for(var i=0; i<keyArr.length; i++){
			str += '<li><i class="search-plus-i"></i><span><a target=_blank href="/products/index.html?key='+keyArr[i]+'">'+keyArr[i]+'</a></span></li>';
		}
	}

	return str;
}




//获取店铺热销
function hotSell(parameter){
	woLianw.getHotSell(parameter, function(data){

		var str = '';
		var datas = data.resultList;
		var pstr = "";
		if(datas.length < 1 ){
			str += '<li>暂无数据</li>';
		}else{
			for(var i =0; len = datas.length, i < len; i++){  //// firstThree
				str += '<li>';
					str += '<a class="jumpgd" pid="'+datas[i].productId+'" href="goodsdetail.html?productId='+datas[i].productId+'" target="_blank">';
					str += '<img src="'+woLianw.getImgUrl(datas[i].pictureUrl)+'"/>';
					if(i<=2){ //前三要重点显示，标红
						str += '<i class="hostSell-index firstThree">'+(i+1)+'</i>';
					}else{
						str += '<i class="hostSell-index">'+(i+1)+'</i>';
					}
					str += '<label>';
					(datas[i].name.length<=12) ? pstr = (datas[i].name) : pstr = (datas[i].name.substr(0, 12)+"...");
					str += '<span title="'+datas[i].name+'">'+pstr+'</span>';
					str += '<p>￥'+datas[i].venMinPrice+'</p>';
					str += '</label>';
					str += '</a>';
				str += '</li>';
			}
		}
		$("#hotSellBox").append(str);
	});
}

// function judgeIE(productId){
// 	if (window.ActiveXObject || "ActiveXObject" in window){
// 		window.open("goodsdetail.html?productId="+productId+"", "_blank");
// 		return false;
// 	}else{}
// }

layui.$("#hotSellBox").on("click", "a.jumpgd", function(e){
	if (window.ActiveXObject || "ActiveXObject" in window){
		e.preventDefault(); 
		var productId = $(this).attr("pid");
		window.open("goodsdetail.html?productId="+productId+"", "_blank");
	}
});

//配送区域 (配合运费模板 使用)
function freightArea(data, provinceId){
	var _legnth = data.length;
	var str = '<option value="">请选择</option>';
	var selected = "selected";
	for(var i = 0; i < _legnth; i++){
		if(provinceId && data[i].did == provinceId){
			str += '<option selected value="'+data[i].name+'" id="'+data[i].did+'">'+data[i].name+'</option>'
		}else{
			str += '<option value="'+data[i].name+'" id="'+data[i].did+'">'+data[i].name+'</option>'
		}
	}
	$("#province").append(str);

}

function priceChange(price){
	var str = "";
	price = price+"";
	if(price && price.indexOf(".") != -1){  //如果是加了.的价格
		var arr = price.split(".");
		str += arr[0];
		if(arr[1].length ==1){
			str += "."+arr[1]+"0";
		}else if(arr[1].length >=2){
			str += "."+arr[1].substring(0, 2);
		}
	}else{  //如果是不加. 的价格
		str += price+".00";
	}

	return str;
}

//左侧小图片
function leftSmallImg(data, id){
	var _legnth = data.length;
	var str = '';
	for(var i = 0; i < _legnth; i++){
		if(i == 0){
			str += '<li class="checkLi"><img src="'+woLianw.getImgUrl(data[i])+'"></li>';
		}else{
			str += '<li><img src="'+woLianw.getImgUrl(data[i])+'"></li>';
		}
	}

	$("#"+id).append(str);

}



