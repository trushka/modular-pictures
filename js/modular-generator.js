//(function(){
	var minSize=20;
	var fullSizeMin=90;
	var fullSizeMax=360;
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

	function setTemplates(format, selected){
		templatesContainer.not('[aria-hidden]').hide();
		templatesContainer.html('');
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
			}).appendTo(templatesContainer);
		})

		if (selected) $('button',templatesContainer).eq(selected).focus().click();
	}

	// move and resize

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
		var move={};
		this.querySelectorAll('rect').forEach(function(el,i){
			if (e.target!=el) return;
			move.l = /0|8|4|5/.test(i);
			move.t = /0|5|1|6/.test(i);
			move.r = /6|2|7/.test(i);
			move.b = /8|3|7/.test(i);
			move.w=i && -move.l || +move.r;
			move.h=i && -move.t || +move.b;
		});
		//console.log(move);
		function change(e){
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
			var x=pos0.x,
				y=pos0.y,
				w=pos0.width,
				h=pos0.height;
			var css={};

			dx=Math.max(dx, move.l?-x:-w+minSize);
			dy=Math.max(dy, move.t?-y:-h+minSize);

			dx=Math.min(dx, move.w<0?w-minSize:bBox.width-x-w);
			dy=Math.min(dy, move.h<0?h-minSize:bBox.height-y-h);

			if (move.l) css['--x']=x+dx+'px';
			if (move.t) css['--y']=y+dy+'px';
			css['--w']=w+dx*move.w+'px';
			css['--h']=h+dy*move.h+'px';

			$(el).css(css);
			//return false
		}

		$(window).on(touch?'touchmove':'mousemove', change)
		 .on('mouseup touchcancel touchend blur', function(){
		 	$(window).off('mousemove touchmove', change);
			svg0.removeClass('blocked');
		})
	})

	// load images

	$('input.imageFile').on('change', function(){
		console.log('inp');
		var file=this.files[0];
		if (!file.type.match(/image.*/))  return;
		img.attr('xlink:href', URL.createObjectURL(file))
	})

	// Rulers

	var hRuler=$('.h-ruler');
	for (var i = 0, j; i*20 < fullSizeMax; i++) {
		j=i*20;
		hRuler.append('<div><div><div>'+j+'</div><div>'+(j+5)+'</div></div><div><div>'+(j+10)+'</div><div>'+(j+15)+'</div></div></div>');
	}

	// Whole resize

	var vInp=$('.modular-size .width input').on('input', function(){
		hRuler.css('--w', this.value);
		vInp.not(':focus').val(this.value);
	});//.trigger('input');

	$.fn.hideScroll=function(){ 
		var el=this[0];
		if (!el) return;
		el.style.marginRight='';
		el.style.marginRight=el.clientWidth-el.offsetWidth-.5+'px';		
	}

	$('.filter-picture').on('opened', function(e, cObj){
		cObj.$details.filter('.modular-shapes').hideScroll()
	});

	$(function(){
		setTemplates('Landscape', 49);
		$('a',templatesContainer.prev()).trigger('open')
	});
	function applyTemplate(tpl) {}
//})()