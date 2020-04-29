//(function(){
	var templatesContainer = $('modular-shapes');
	var formats:{Landscape: .7};
	var padding=.01;

	function setTemplates(format){
		templatesContainer.html('')
		templates.forEach(function(tpl,i){
			if (tpl.format!=format) return;
			var vBox=[-padding, -padding, 1+padding*2, formats.format+padding*2].join(',');
			var svg=$('<svg viewBox="'+vBox+'"/>');
			tpl.b1.forEach(function(data){
				$('<rect/>').attr({
					x: data.x,
					y: data.y,
					width: data.w,
					height: data.h
				}).appendTo(svg)
			})

			$('<button>').appendTo(templatesContainer).append(svg)
			.click(function(){
				
			})
		})
	}
	function applyTemplate(tpl) {}
//})()