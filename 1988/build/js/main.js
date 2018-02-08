
var myChart = echarts.init(document.getElementById('orderAmount'));
			
			function echartsdata(dataCount){
				var categoryData = [];
				for (var i = 0; i < dataCount; i++) {
				    var val = Math.random() * 10000;
				    val=Math.round(val);
				    categoryData.push('' + val);
				    
				}
				return categoryData;
			}
			
			
	    var options={
	    		tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        }
			    },
	        //定义一个标题
	        title:{
	            text:'订单金额',
	            textStyle:{
	            	color: '#323232',
	            	fontSize: 14,
	            	fontWeight: 'bold'
	            },
	            x: 20,
        			y: 20,
	        },
	        color:['#327FF3'],
	        //图例组件     展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示
	        /*legend:{
	            data: '订单金额' 
	        },*/
	        //是否启用拖拽重计算特性，默认关闭(即值为false)  
	        calculable: true, 
	        //X轴设置
	        xAxis:{
    					data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	        },
	        yAxis:{
	        	
	        },
	        //name=legend.data的时候才能显示图例
	        series:[
	        	{
	            name:'订单数',
	            type:'bar',
	            data:echartsdata(12),
	            markLine : {
                lineStyle: {
                    normal: {
                        type: 'dashed'
                    }
                },
                data : [
                    [{type : 'min'}, {type : 'max'}]
                ]
            	}
	        	}]

	        	};
	        	myChart.setOption(options);
	        	
	        	
						/* 中国地图  */
	        	var myChart2 = echarts.init(document.getElementById('chinaChart'));

	        	function randomData() {
	        		return Math.round(Math.random()*10000);
	        	}

	        	options2 = {
	        		title: {
	        			text: '区域销售统计',
	        			textStyle:{
			            	color: '#323232',
			            	fontSize: 14,
			            	fontWeight: 'bold'
			            },
			            x: 20,
		        			y: 20,
	        		},
	        		tooltip: {
	        			trigger: 'item',
	        			formatter: '{b}<br>{c}件'
	        			
	        		},
	        		//图例组件     展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示
	        		/*legend: {
	        			orient: 'vertical',
	        			left: 'left',
	        			data: ['地区'],
	        		},*/
	        		dataRange: {
					        min: 0,
					        max: 2500,
					        x: 40,
					        y: "bottom",
					        text:['高','低'],           // 文本，默认为数值文本
					        calculable : true
					    },
	        		/*visualMap: {
	        			min: 0,
	        			max: 2500,
	        			left: 'left',
	        			top: 'bottom',
	        			text: ['高', '低'], // 文本，默认为数值文本
	        			color: ['#0773DE', '#3993E6','#77BBEF', '#A2D7F6', '#DAFBFE'],
	        			calculable: true
	        		},*/
	        		toolbox: {
	        			show: true,
	        			orient: 'vertical',
	        			x: 'right',
	        			y: 'center',
	        			feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            restore : {show: true},
			            saveAsImage : {show: true}
					       }
					    },
					    roamController: {
					        show: true,
					        x: 'right',
					        mapTypeControl: {
					            'china': true
					        }
					    },
	        		series: [
	        			{
	        				name: '地区',
	        				type: 'map',
	        				mapType: 'china',
	        				selectedMode : 'multiple',
	        				roam: false,   //是否开启鼠标滚轮 缩放地图
        				 	itemStyle: {
                    normal: {
                      borderWidth: 2,
                      borderColor: '#a6c8dd',
                      color: '#eee',
                      areaStyle:{color:'#eee'},//设置地图颜色
                      label: { show: true }
                    },
                    emphasis: {
                      borderWidth: 2,
                      borderColor: '#fff',
                      color: '#32cd32',
                      label: {
                          show: true,
                          textStyle: {
                              color: '#fff'
                          }
                      }
                    }
                 },
	        				data: [
	        					{ name: '北京', value: randomData() }, { name: '天津', value: randomData() }, { name: '上海', value: randomData() },
	        					{ name: '重庆', value: randomData() }, { name: '河北', value: randomData() }, { name: '河南', value: randomData() },
	        					{ name: '云南', value: randomData() }, { name: '辽宁', value: randomData() }, { name: '黑龙江', value: randomData() },
	        					{ name: '湖南', value: randomData() }, { name: '安徽', value: randomData() }, { name: '山东', value: randomData() },
	        					{ name: '新疆', value: randomData() }, { name: '江苏', value: randomData() }, { name: '浙江', value: randomData() },
	        					{ name: '江西', value: randomData() }, { name: '湖北', value: randomData() }, { name: '广西', value: randomData() },
	        					{ name: '甘肃', value: randomData() }, { name: '山西', value: randomData() }, { name: '内蒙古', value: randomData() },
	        					{ name: '陕西', value: randomData() }, { name: '吉林', value: randomData() }, { name: '福建', value: randomData() },
	        					{ name: '贵州', value: randomData() }, { name: '广东', value: randomData() }, { name: '青海', value: randomData() },
	        					{ name: '西藏', value: randomData() }, { name: '四川', value: randomData() }, { name: '宁夏', value: randomData() },
	        					{ name: '海南', value: randomData() }, { name: '台湾', value: randomData() }, { name: '香港', value: randomData() },
	        					{ name: '澳门', value: randomData() }
	        				]
	        			}
	        		]
	        	};
	        	
	    
	        	
	        	myChart2.setOption(options2);
	        	
	        	
var myChart3 = echarts.init(document.getElementById('ringgoods'));

						var ring_option = {
								title: {
		        			text: '商品一级分类',
		        			textStyle:{
			            	color: '#323232',
			            	fontSize: 14,
			            	fontWeight: 'bold'
			            },
			            x: 20,
		        			y: 20,
		        		},
						    tooltip: {
						        trigger: 'item',
						        formatter: "{a} <br/>{b}: {c} ({d}%)"
						    },
						    //图例组件     展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示
						    /*legend: {
						        orient: 'vertical',
						        x: 'left',
						        data:['男装','饮食生鲜','日用百货','家纺家饰','其他', '女装',]
						    },*/
						    series: [
						        {
						            name:'访问来源',
						            type:'pie',
						            radius: ['50%', '70%'],
						            avoidLabelOverlap: false,
						            label: {
						                normal: {
						                    show: true,
						                    position: 'outside'
						                },
						                emphasis: {
						                    show: true,
						                    textStyle: {
						                        fontSize: '30',
						                        fontWeight: 'bold'
						                    }
						                }
						            },
						            labelLine: {
						                normal: {
						                    show: true
						                }
						            },
						            data:[
						                {value:335, name:'男装'},
						                {value:310, name:'饮食生鲜'},
						                {value:234, name:'日用百货'},
						                {value:135, name:'家纺家饰'},
						                {value:1548, name:'其他'},
						                {value:250, name:'女装'}
						            ]
						        }
						    ]
						};
						
						myChart3.setOption(ring_option);
	        	//用于使chart自适应高度和宽度
						window.onresize = function () {
						    //重置容器高宽
						    myChart.resize();
						    myChart2.resize();
						    myChart3.resize();
						};
	        	