

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
			str+= '<form class="layui-form" action="" id="addRoleForm">';
				str+= '<div class="layui-form-item">';
					str+= '<label class="layui-form-label"><i class="red">*</i>岗位名称：</label>'; 
					str+= '<div class="layui-input-block">';
						str+= '<input type="hidden" name="roleId" value="'+this.roleId+'">';
						str+= '<input type="text" lay-verify="required" name="roleName" value="'+ this.roleName +'" placeholder="请输入岗位名称" autocomplete="off" class="layui-input">';
					str+= '</div>';
				str+= '</div>';
				str+= '<div class="layui-form-item">';
					str+= '<label class="layui-form-label">岗位描述：</label>';
					str+= ' <div class="layui-input-block">';
						str+= ' <input type="text" name="roleRemark" value="'+ this.roleRemark +'"  placeholder="请输入岗位描述50个字符" autocomplete="off" class="layui-input">';
					str+= '</div>';
				str+= '</div>';
				str+= '<div class="layui-form-item">';
					str+= '<label class="layui-form-label"><i class="red">*</i>排序：</label>';
					str+= '<div class="layui-input-block">';
						str+= '<input type="text" lay-verify="required|number" name="roleSort" value="'+ this.roleSort +'"  value="0" autocomplete="off" class="layui-input">';
					str+= '</div>';
				str+= '</div>';
				str+= '<div class="layui-form-item">';
					str+= '<label class="layui-form-label"><i class="red">*</i>激活状态：</label>';
					str+= '<div class="layui-input-block">';
					if(this.roleEnabled){
						str+= '<input type="checkbox" checked lay-filter="roleEnabled" name="roleEnabled" lay-skin="primary" title="激活">'
					}else{
						str+= '<input type="checkbox" lay-filter="roleEnabled" name="roleEnabled" lay-skin="primary" title="激活">';
					}
						
					str+= '</div>';
				str+= '</div>';
			str+= '</form>';

			return str;

		}
	
	


	}