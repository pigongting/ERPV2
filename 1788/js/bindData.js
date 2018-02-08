(function(){

	window.Product = Product;

	function Product(productName, productAddress, image, price, packageMail, listTitle, moveHome, focus){

		this.productName = productName || "";  	 //产品名称
		this.productAddress = productAddress || "";  				 //生产地
		this.image = image || "";  							 //图片
		this.price = price || "";								 //价格
		//this.packageMail = packageMail || 0;    //是否包邮 默认不包邮    (0:为空，不填，就是不包邮， 1：包邮)
		packageMail ? this.packageMail = "包邮" : this.packageMail = "";
		this.listTitle = listTitle || "";
		this.moveHome = moveHome || 0;    //是否选中搬家   默认不选中    (0:为空，不填，就是不选中， 1：选中)
		this.focus = focus || 0;    //是否选中关注  默认不选中    (0:为空，不填，就是不选中， 1：选中)
	}

	Product.prototype = {
		bindDom: function(){
			var str = '';
			str+= '<li>';
				str+= '<div class="imgBox">';
					str+= '<img src="'+ this.image +'" width="225px" height="224px" />'; //img/list_goods_01.png
					str+= '<label> <span class="left_span">'+ this.productName +'</span> <span class="right_span">'+ this.productAddress +'</span> </label>';
				str+= '</div>';
				str+= '<div class="bottom_content">';
					str+= '<label> <span class="goods_price">￥'+ this.price +'</span> <span class="layui-badge firstToThree">'+ this.packageMail +'</span> </label>';
					str+= '<p>'+ this.listTitle +'</p>';
					str+= '<article>';
						str+= '<label> <i class="fa fa-square-o check_i"></i> <span>搬家</span> </label>';
						str+= '<label> <i class="fa fa-heart-o focus"></i> <span>关注</span> </label>';
						str+= '<label> <i class="fa fa-shopping-cart addToCart"></i> <span>加入购物车</span> </label>';
					str+= '</article>';
				str+= '</div>';
				str+= '<div class="border-left"></div> <div class="border-bottom"></div> <div class="border-top"></div> <div class="border-right"></div>';
			str+= '</li>';

			return str;

		}



	}

})();
