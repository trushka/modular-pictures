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
	var mainContainer = $('.modular');
	var img = $('.canv_cel image').on('load', function(){

	});
	var svg0 = $('.canv_cel svg');
	var h2w={
		Panorama: .4,
		Landscape: .75,
		Square: 1,
		Portrait: 1.5,
		actual: 1,

		minLandscape: .5,
		minSquare: .8,
		minPortrait: 1.1
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

				return !('s' in data) || +data.r

			})) return;

			svg[0].innerHTML+=' ';

			$('<button />').append(svg).prop({title: JSON.stringify(tpl)})
			.click(function(e){
				e.preventDefault();
				var w0=svg0.width();
				svg0[0].setAttribute('viewBox', '0, 0, '+w0+', '+w0*h2w.actual);
				$('>g', svg0)[0].innerHTML=svg[0].innerHTML;
				$('g.module', svg0).addLines();
				//h2w.actual=h2w.format;
			}).appendTo(templatesContainer);
		})

		$('button', templatesContainer).eq(selected||0).focus().click();
		$('a',templatesContainer.prev()).trigger('open');
	}

	// load images

	$('input.imageFile').on('change', function(){
		console.log('inp');
		var file=this.files[0];
		if (!file.type.match(/image.*/))  return;

		var img0=new Image();
		img0.onload=function(){
			if (!this.width) return;
			var hw=h2w.actual=this.height/this.width;
			if (hw>h2w.minPortrait) setTemplates('Portrait');
			else if (hw>h2w.minSquare) setTemplates('Square');
			else if (hw>h2w.minLandscape) setTemplates('Landscape');
			else setTemplates('Panorama');
			img.attr('xlink:href', this.src);
			setMinMax();
		}
		img0.src=URL.createObjectURL(file)
	})

	function setMinMax(){
		var hv=h2w.actual;
		sizeInp.prop({min: fullSizeMin, max: fullSizeMax});
		if (hv>1) {
			wInp.prop({max: Math.ceil(fullSizeMax/hv), min: Math.ceil(fullSizeMin/hv)});
		} else {
			hInp.prop({max: Math.ceil(fullSizeMax*hv), min: Math.ceil(fullSizeMin*hv)});
		}
		sizeInp.each(function(){
			$('~.changeSm span', this)
			 .eq(0).html(this.min).end()
			 .eq(1).html(this.max)
		}).trigger('change')
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

	// Rulers

	var hRuler=$('.h-ruler');
	var wRuler=$('.v-ruler');
	for (var i = 0, j, html; i*20 < fullSizeMax; i++) {
		j=i*20;
		html='<div><div><div>'+j+'</div><div>'+(j+5)+'</div></div><div><div>'+(j+10)+'</div><div>'+(j+15)+'</div></div></div>'
		hRuler.append(html);
		wRuler.append(html);
	}

	// Whole resize

	var wInp=$('.modular-size .width input').on('input change', function(e){
		var h=(this.value*h2w.actual).toFixed(1)*1;
		mainContainer.css({'--h': h, '--w': this.value});
		wInp.val(this.value);
		hInp.not(':focus').val(h);
		if (e.originalEvent) hInp.triggerHandler('change');
		var range=this.max-this.min;
		wInp.css('background-size', (this.value-this.min)/range*100+'%');
	});
	var hInp=$('.modular-size .height input').on('input change', function(e){
		var w=(this.value/h2w.actual).toFixed(1)*1;
		mainContainer.css({'--h': this.value, '--w': w});
		hInp.val(this.value);
		wInp.not(':focus').val(w);
		if (e.originalEvent) wInp.triggerHandler('change');
		var range=this.max-this.min;
		hInp.css('background-size', (this.value-this.min)/range*100+'%');
	});
	var sizeInp=wInp.add(hInp).trigger('input');

	$.fn.hideScroll=function(){ 
		var el=this[0];
		if (!el) return;
		el.style.marginRight='';
		el.style.marginRight=el.clientWidth-el.offsetWidth-.5+'px';		
	}

	$('.filter-picture').on('opened', function(e, cObj){
		cObj.$details.filter('.modular-shapes').hideScroll()
	});

	function applyTemplate(tpl) {}
//})()