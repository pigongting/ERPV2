layui.use(['jquery', 'woLianw'], function () {
  var $ = layui.jquery;
  var woLianw = layui.woLianw;

  $(document).on("mouseover", ".FareGetOrderTraces", function (event) {
    // 获取
    var that = $(this);
    var state = that.data('state');
    var ename = that.data('ename');
    var code = that.data('code');
    var no = that.data('no');
    var hasPOP = that.find('.FareGetOrderTracesPOP').length;
    
    if (hasPOP) { return; }

    var params = {
      shipperId: (code) ? code : '',
      logisticCode: (no) ? no : '',
    };
    
    woLianw.ajaxFareGetOrderTraces(
      params,
      function (data) {
        generateFareTraces(that, JSON.parse(data), ename);
      },
      function (err) {
        console.log(err);
      });
  });

  function generateFareTraces(ele, data, ename) {
    console.log(data);
    data.Traces.reverse();
    var thisHeight = ele.height();
    var html = '';
        html += '<div class="FareGetOrderTracesPOP" style="top:'+ (thisHeight - 2) +'px;">'
        html += '<ul class="lead">'
        html +=   '<li>快递公司：'+ ename +'</li>'
        html +=   '<li>物流单号：'+ data.LogisticCode +'</li>'
        html += '</ul>'
        for (var i = 0; i < data.Traces.length; i++) {
          html += '<dl class="list">'
          html +=   '<dt class="">'+ data.Traces[i].AcceptStation +'</dt>'
          html +=   '<dd class="">'+ data.Traces[i].AcceptTime +'</dd>'
          html += '</dl>';
        }
        html += '</div>';
    ele.append(html);
  }
});
