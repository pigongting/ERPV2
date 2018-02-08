var myChart = echarts.init(document.getElementById('eChartBar'));
option = {
    color: ['#3398DB'],
    title:{
        text:'订单金额',
        textStyle:{
            fontSize:'14',
            fontWeight:'bold'
        },
        left:'15',
        top:'10'
    },
    backgroundColor:'#fff'
    ,
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['已逾期','qqq','2222','3333'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'当前数值:',
            type:'bar',
            barWidth: '60%',
            data:[0,200,100],
            itemStyle:{
                normal:{
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2BB3A7'},
                            {offset: 0.5, color: '#83DEBB'},
                            {offset: 1, color: '#B8F6CD'}
                        ]
                    )
                }
            }
        }
    ]
};
myChart.setOption(option);
