//(function(){
	function SVG(tag){
		return document.createElementNS('http://www.w3.org/2000/svg', tag)
	}
	$.fn.addLines=function(){
		this.each(function(){
			if (this.querySelector('g')) return;
			this.innerHTML+='<g><rect/><rect/><rect/><rect/><rect/><rect/><rect/><rect/></g>'
		})
	}

	var templatesContainer = $('.modular-shapes');
	var img = $('.canv_cel image').on('load', function(){

	});
	var svg0 = $('.canv_cel svg');
	var h2w={
		Landscape: .7,
		Portrait: 1.67
	};
	var padding=.01;

	function setTemplates(format){
	templatesContainer.not('[aria-hidden]').hide();
	templatesContainer.html('')
		templates.forEach(function(tpl,i){
			if (tpl.format!=format) return;
			var svg=$('<svg viewBox="0, 0, 100, '+h2w[format]*100+'"/>');
			var bl=tpl.bl[0]?tpl.bl:[tpl.bl];

			if (bl.find(function(data){
				$('<g class="module" style="--x: '+data.x*100+'%; --y: '+ data.y*100+'%;'
					+' --w: '+ data.w*100+'%; --h: '+ data.h*100+'%"/>')
				.appendTo(svg).append('<rect/>');

				return !('s' in data)

			})) return;

			svg[0].innerHTML+=' ';

			$('<button />').append(svg)//.prop({title: JSON.stringify(tpl)})
			.click(function(e){
				e.preventDefault();
				var w0=svg0.width();
				svg0[0].setAttribute('viewBox', '0, 0, '+w0+', '+w0*h2w[format]);
				$('>g', svg0)[0].innerHTML=svg[0].innerHTML;
				$('g.module', svg0).addLines();
			}).appendTo(templatesContainer)
		})
	}

	svg0.on('mouseenter touchstart mousedown', 'g.module', function(e){
		if (e.type!='mousedown' && !$(this).is(':last-child')) {
			$('>g', svg0).append(this);
			return;
		}
		if (e.type=='mouseenter') return;
		 console.log (e)
		var el=this;
		var touch = e.type=='touchstart' ? e.originalEvent.targetTouches[0]:null;
		var x0=(touch||e).pageX;
		var y0=(touch||e).pageY;

		var pos0=this.querySelector('rect').getBBox();

		function move(e){
			var dx=(touch||e).pageX-x0;
			var dy=(touch||e).pageY-y0;
			$(el).css({'--x': pos0.x+dx+'px', '--y': pos0.y+dy+'px'});	
		}

		$(window).on('mousemove touchmove', move)
		 .on('mouseup touchcancel touchend blur', function(){
		 	$(window).off('mousemove touchmove', move)
		})
	})

	$.fn.hideScroll=function() {
		var el=this[0];
		if (!el) return;
		el.style.marginRight='';
		el.style.marginRight=el.clientWidth-el.offsetWidth-.5+'px';		
	}

	$('.filter-picture').on('opened', function(e, cObj){
		cObj.$details.filter('.modular-shapes').hideScroll()
	})

	setTemplates('Landscape');
	$(function(){$('a',templatesContainer.prev()).trigger('open')})
	function applyTemplate(tpl) {}
//})()