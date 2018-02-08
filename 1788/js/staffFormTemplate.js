

	function RoleForm(roleId, roleName, roleSort, roleEnabled, roleRemark){
		this.roleId = roleId || "";
		this.roleName = roleName || "";
		this.roleRemark = roleRemark || "";
		roleSort == "无" ? this.roleSort = 0 : this.roleSort = roleSort || 0;
		roleEnabled == "true" ? this.roleEnabled = true : this.roleEnabled = false;
	}

	RoleForm.prototype = {
		bindDom: function(){
			var str = '';
			str+= '<div class="layui-tab layui-tab-card" lay-filter="baseInformation">';
              str+= '<ul class="layui-tab-title">';
	            str+= '<li class="layui-this">基本信息</li>';
	            str+= '<li lay-id="fenpei">分配角色</li>';
              str+= '</ul>';
              str+= '<div class="layui-tab-content">';
                str+= '<div class="layui-tab-item layui-show">';
                  str+= '<form class="layui-form" id="baseInformation">';
                    str+= '<div class="layui-form-item">';
                      str+= '<label class="layui-form-label"><i class="red">*</i>登录名：</label>';
                      str+= '<div class="layui-input-block">';
                        str+= '<input type="text" name="staffLoginName" id="addStationName" required placeholder="请输入登录名" class="layui-input">';
                      str+= '</div>';
                    str+= '</div>';
                    str+= '<div class="layui-form-item">';
                      str+= '<label class="layui-form-label"><i class="red">*</i>密码：</label>';
                      str+= '<div class="layui-input-block">';
                    	str+= '<input type="password" name="staffLoginPwd" required placeholder="请输入密码" class="layui-input">';
                      str+= '</div>';
                    str+= '</div>';
                    str+= '<div class="layui-form-item">';
                      str+= '<label class="layui-form-label"><i class="red">*</i>确认密码：</label>';
                      str+= '<div class="layui-input-block">';
                    	str+= '<input type="password" name="staffAgainPwd" required placeholder="请再次输入密码" class="layui-input">';
                      str+= '</div>';
                    str+= '</div>';
                    str+= '<div class="layui-form-item">';
                      str+= '<label class="layui-form-label">姓名：</label>';
                      str+= '<div class="layui-input-block">';
                    	str+= '<input type="text" name="staffName" placeholder="请输入姓名" class="layui-input">';
                      str+= '</div>';
                    str+= '</div>';
                    str+= '<div class="layui-form-item">';
                      str+= '<label class="layui-form-label">身份证号：</label>';
                      str+= '<div class="layui-input-block">';
                        str+= '<input type="text" name="staffIDCard" placeholder="请输入身份证号" class="layui-input">';
                      str+= '</div>';
                    str+= '</div>';
					str+= '<div class="layui-form-item">';
					  str+= '<label class="layui-form-label">邮箱：</label>';
					  str+= '<div class="layui-input-block">';
					  	str+= '<input type="text" name="staffEmail" placeholder="请输入邮箱号" class="layui-input">';
					  str+= '</div>';
					str+= '</div>';
					str+= '<div class="layui-form-item">';
					  str+= '<label class="layui-form-label">手机号：</label>';
					  str+= '<div class="layui-input-block">';
						str+= '<input type="text" name="staffPhone" placeholder="请输入手机号" class="layui-input">';
					  str+= '</div>';
					str+= '</div>';
					str+= '<div class="layui-form-item">';
					  str+= '<label class="layui-form-label">详细地址：</label>';
					  str+= '<div class="layui-input-block">';
					    str+= '<input type="text" name="staffAdress" placeholder="请输入详细地址" class="layui-input">';
					  str+= '</div>';
					str+= '</div>';
					str+= '<div class="layui-form-item">';
					  str+= '<label class="layui-form-label">激活状态：</label>';
					  str+= '<div class="layui-input-block">';
						str+= '<input type="checkbox" name="staffBaseEnabled" lay-skin="primary" title="激活">';
					  str+= '</div>';
					str+= '</div>';
				  str+= '</form>';
				str+= '</div>';
				str+= '<div class="layui-tab-item">';
				str+= '<form class="layui-form">';
				  str+= '<div class="layui-form-item">';
				    str+= '<div class="layui-input-inline">';
				      str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="采购员">';
				    str+= '</div>';
				    str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="测试员">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="售货员">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="分销商">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="测试经理">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="开发员">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="小开发">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="大开发">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="技术经理">';
					str+= '</div>';
					str+= '<div class="layui-input-inline">';
					  str+= '<input type="checkbox" name="staffEnabled" lay-skin="primary" title="技术总监">';
					str+= '</div>';
				  str+= '</div>';
				str+= '</form>';
			  str+= '</div>';
		    str+= '</div>';
	       str+= '</div>';

		   return str;

		}




	}
