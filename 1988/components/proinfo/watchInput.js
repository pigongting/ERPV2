layui.use(['element','jquery'],function () {
	 var element=layui.element;
     var jQuery = layui.jquery;

	(function($) {
	    $.fn.watch = function(callback, currentObj) {
	        return this.each(function() {
	            //缓存以前的值
	            $.data(this, 'originVal', $(this).val());
	
	            //event
	            $(this).on('keyup paste', function() {
	                var originVal = $(this, 'originVal');
	                var currentVal = $(this).val();
	                var currentObj = this;
	
	                if (originVal !== currentVal) {
	                    $.data(this, 'originVal', $(this).val());
	                    callback(currentVal, currentObj);
	                }
	            });
	        });
	    }
	})(jQuery);

});