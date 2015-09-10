(function($) { 
	//校验
	$.fn.validate = function(settings) {
		try{
			$.Validator.init(settings,this);
			return $.Validator.validate();
		}catch(e){
			$.Validator.alertError(e.message);
			return false;
		}
	}; 
})(jQuery); 

$.Validator = {
	msgStyleSets:{
		pop:'pop',  //弹出对话框
		append:'append' //追加在表单后面
	},
	alertError:function(msg){
		alert(msg);
	},
	settings:{debug:false,keyupCheck:false,msgStyle:"pop"},
	init:function(settings,formObj){
		this.settings["formId"] = formObj.attr("id");
		this.settings["formObj"] = formObj;
		this.settings = $.extend({}, this.settings, settings);
		var keyupCheck = this.settings.keyupCheck;
		if(keyupCheck){
			this.keyupCheckFun();
		}
	},
	setDefaults:function(settings){
		this.settings = $.extend({}, this.settings, settings);
	},
	check:{
	
		//必填
		required:function(id,obj){
			if(obj){
				return ($("#"+id).val() != '');
			}else{
				return true;
			}
		},
		
		//远程验证
		remote:function(id,obj){
			var url = obj[0];
			var param = obj[1];
			$.post(url,function(data,param,textStatus){
				if(data == "1"){
					return true;
				}else{
					return false;
				}
			},'json');
		},
		
		//整数
		number : function(id){
			var regex = new RegExp("^-?\\d+$");
			var val = $("#"+id).val();
			if(!val){
				return true;
			}else{
				return regex.test(val);
			}
		},

		//小数
		decimal : function(id){
			var regex = new RegExp("^[0-9]+(.[0-9]{2})?$");
			var val = $("#"+id).val();
			if(!val){
				return true;
			}else{
				return regex.test(val);
			}
		},
		
		//数字（包括整数和小数）
		digits : function(id){
			return this.number(id) || this.decimal(id);
		},
		
		//最大长度
		maxLength : function(id,obj){
			return ($("#"+id).val().length <= obj);
		},
		//最小长度
		minLength : function(id,obj){
			return ($("#"+id).val().length >= obj);
		},
		//区间长度
		rangeLength : function(id,obj){
			var min_len = obj[0];
			var max_len = obj[1];
			return this.maxLength(id, max_len) && this.minLength(id, min_len);
		},
		//等于长度
		eqLength : function(id,obj){
			return ($("#"+id).val().length == obj);
		},
		
		//数字最大值【整数】
		max : function(id,obj){
			var val = $("#"+id).val();
			if(!val){
				return true;
			}else{
				return parseInt(val) <= parseInt(obj);
			}
		},
		
		//数字最小值【整数】
		min : function(id,obj){
			var val = $("#"+id).val();
			if(!val){
				return true;
			}else{
				return parseInt(val) >= parseInt(obj);
			}
		},
		
		//数字范围【整数】
		range : function(id){
			var min_val = obj[0];
			var max_val = obj[1];
			return this.min(id, min_val) && this.max(id, max_val);
		},
		
		//正则
		regex:function(id,obj){
			var regex = new RegExp(obj);
			var val = $("#"+id).val();
			if(!val){
				return true;
			}else{
				return regex.test(val);
			}
		}
	},
	
	//单个元素校验
	eleValidate:function(eleId){
		var rules = this.settings['rules'];
		$this = $("#"+eleId);
		var chkOptions = rules[eleId];
		if(!chkOptions){  //不用校验
			return true;
		}
		//针对单个表单校验
		for(var chkId in chkOptions){
			var chkState = this.check[chkId](eleId,chkOptions[chkId]);
			if(!chkState){  //校验失败就返回
				//获得error msg
				var messages = this.settings['messages'];
				var msgOptions = messages[eleId];
				var msgVal = msgOptions[chkId];
				if(this.settings.msgStyle == this.msgStyleSets.pop){
					this.alertError(msgVal,function(){
						$this.focus();
					});
				}else if(this.settings.msgStyle == this.msgStyleSets.append){
					$this.addClass("input_error");
					$this.parent().find(".val_msg").html(msgVal);
					$this.parent().find(".val_msg").show();
				}
				return false;
			}
		}
		//校验成功后，清除错误样式
		if(this.settings.msgStyle == this.msgStyleSets.append){
			$this.removeClass("input_error");
			$this.addClass("input_success");
			$this.parent().find(".val_msg").html("");
			$this.parent().find(".val_msg").hide();
		}
		return true;
	},
	validateBind:function(){
		 self = this;
		 this.settings.formObj.bind("submit",function(){
			 self.validate();
		 });
	},
	
	validate:function(){
		var rules = this.settings['rules'];
		for(var eleId in rules){
			$this = $("#"+eleId);
			if($this.length == 0){  //元素不存就跳过
				continue;
			}
			var chkState = this.eleValidate(eleId);
			if(!chkState){
				return false;
			}
		}
		if(this.settings.debug){
			return false;
		}else{
			return true;   
		}
	 },
	 
	keyupCheckFun:function(){
		//绑定每个元素,每个元素在keyup时，作校验
		var rules = this.settings['rules'];
		var self = this;
		for(var eleId in rules){
			$this = $("#"+eleId);
			if($this.length == 0){  //元素不存就跳过
				continue;
			}
			//绑定每个元素
			$this.keyup(function(id){
				var eleId = $(this).attr("id");
					var chkState = self.eleValidate(eleId);
					if(!chkState){
						return false;
					}
				});
			}
		}
}
