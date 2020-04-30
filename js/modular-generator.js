//(function(){
	var templatesContainer = $('.modular-shapes');
	var img = $('.canv_cel image').on('load', function(){

	});
	var svg0 = $('.canv_cel svg');
	var h2w={Landscape: .7};
	var padding=.01;

	function setTemplates(format){
		templatesContainer.html('')
		templates.forEach(function(tpl,i){
			if (tpl.format!=format) return;
			var svg=$('<svg viewBox="0, 0, 100, '+h2w[format]*100+'"/>');
			tpl.bl.forEach(function(data){
				$('<rect/>').appendTo(svg).attr({
					x: data.x*100+'%',
					y: data.y*100+'%',
					width: data.w*100+'%',
					height: data.h*100+'%'
				})
			})
			svg[0].innerHTML+=' ';

			$('<button />').append(svg)
			.click(function(e){
				e.preventDefault();
				var w0=svg0.width();
				svg0[0].setAttribute('viewBox', '0, 0, '+w0+', '+w0*h2w[format]);
				$('g', svg0)[0].innerHTML=svg[0].innerHTML;
			}).appendTo(templatesContainer)
		})
	}
	setTemplates('Landscape');
	function applyTemplate(tpl) {}
//})()