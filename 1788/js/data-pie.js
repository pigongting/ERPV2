var myChart = echarts.init(document.getElementById('eChartPie'));

option = {
    title : {
        text: '商品一级分类',
        textStyle:{
            fontSize:'14',
            fontWeight:'bold'
        },
        left:'15',
        top:'10'
    },
    backgroundColor:'#fff',
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series : [
        {
            name: '当前数值',
            type: 'pie',
            radius : ['60%','80%'],
            center: ['50%', '50%'],
            data:[
                {value:335, name:'鞋包'},
                {value:310, name:'女装'},
                {value:234, name:'美食'},
                {value:135, name:'母婴用品'},
                {value:1548, name:'饮料'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};



myChart.setOption(option);
