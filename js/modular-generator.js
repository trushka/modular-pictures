//(function(){
	var minSize=20;
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
		if (e.type!='mousedown' && !$(this).is('.blocked g, :last-child')) {
			$('>g', svg0).append(this);
			return;
		}
		if (e.type=='mouseenter') return;
		//console.log (e)
		var el=this;
		var touch = e.type=='touchstart' && e.originalEvent.changedTouches[0];

		if (touch && !$(el).is(':hover')) return;
		e.preventDefault();
	    svg0.addClass('blocked');
		var x0=(touch||e).pageX;
		var y0=(touch||e).pageY;
		var id=touch && touch.identifier;

		var pos0=this.querySelector('rect').getBBox();
		var bBox=svg0[0].getBoundingClientRect();
		/*

		[5]---1---[6]
		 |         |
		 4    0    2 
		 |         |
		[8]---3---[7]

		*/
		for (var i = 0; i < $('rect', this).length; i++) {
			if (e.target==$('rect', this)[i]) var which=i;
		}

		function move(e){
			//
			var touch=e;
			if (e.type=='touchmove') {
				let touches=e.originalEvent.changedTouches;
				for (var i = 0; i < touches.length; i++) {
					if (touches[i].identifier===id) touch=touches[i]
				}
				if (touch==e) return;
			} else {
				e.preventDefault();
			}
			var dx=touch.pageX-x0;
			var dy=touch.pageY-y0;
			var x,y,w,h,max;
			var css={};

			if (which==0 || which==4 || which==5 || which==8) {
				x=Math.max(pos0.x+dx, 0);
				max=which? pos0.x+pos0.width-minSize : bBox.width-pos0.width;
				css['--x']=Math.min(max, x)+'px';
			}
			if (which<2 || which==5 || which==6) {
				y=Math.max(pos0.y+dy, 0);
				max=which? pos0.y+pos0.height-minSize : bBox.height-pos0.height;
				css['--y']=Math.min(max, y)+'px';
			}
			if (which==2 || which==6 || which==7) {
				w=Math.max(pos0.width+dx, minSize);
				css['--w']=Math.min(bBox.width-pos0.x, w)+'px';
			}
			if (which==3 || which==8 || which==7) {
				h=Math.max(pos0.height+dy, minSize);
				css['--h']=Math.min(bBox.height-pos0.y, h)+'px';
			}

			$(el).css(css);
			//return false
		}

		$(window).on(touch?'touchmove':'mousemove', move)
		 .on('mouseup touchcancel touchend blur', function(){
		 	$(window).off('mousemove touchmove', move)
			svg0.removeClass('blocked');
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