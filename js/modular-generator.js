// settings
var modular={
	Panorama: .4,
	Landscape: .75,
	Square: 1,
	Portrait: 1.5,
	minLandscape: .5,
	minSquare: .8,
	minPortrait: 1.1,

	min: 90,
	max: 360,
	minSize: 20,
	dpi: 30, //100,
	deltaH: 40, // (viewport height) - (max canvas height)

	tooSmall: 'Выбирите картинку не меньше $*$!'
}

//(function(){
	//var minSize=20;
	var dpcm = modular.dpcm || modular.dpi/2.54;
	var minImgSize = Math.round(modular.min*dpcm);
	var tooSmall = modular.tooSmall.replace(/\$/g, minImgSize);

	function SVG(tag){
		return document.createElementNS('http://www.w3.org/2000/svg', tag)
	}

	// plugins

	$.fn.addLines=function(){
		return this.each(function(){
			if (this.querySelector('g')) return;
			this.innerHTML+='<g><rect/><rect/><rect/><rect/><rect/><rect/><rect/><rect/></g>'
		})
	}
	$.fn.setMinMax=function(min, max){
		if (min==='' || isNaN(min)) min=this.prop('min');
		if (max==='' || isNaN(max)) max=this.prop('max');		
		$('~.changeSm span', this)
		 .eq(0).html(min).end()
		 .eq(1).html(max)
		return this.prop({min: min, max: max});
	}
	$.fn.setBg = function(){
		return this.each(function(){
			if (this.type!='range') return;
			var range=this.max-this.min;
			this.style['background-size']=(this.value-this.min)/range*100+'%'
		})
	}

	var templatesContainer = $('.modular-shapes');
	var mainContainer = $('.modular');
	var img = $('.canv_cel image').on('load', function(){

	});
	var svg0 = $('.canv_cel svg');
	var h2w={
		actual: 1
	};
	var padding=.01;

	function resizeCanvas(){
		svg0[0].setAttribute('viewBox', '0, 0, '+h2w.w+', '+h2w.h);
		$('>g', svg0)[0].innerHTML+=''; // huck for svg redraw
		var w=$('>rect', svg0)[0].getBoundingClientRect().width;
		hRuler.width(w);
		h2w.dpcm=w/h2w.w;
		svg0.css({fontSize: 1/h2w.dpcm});
		resized=false;
	}

	function setTemplates(format, selected){
		templatesContainer.not('[aria-hidden]').hide();
		templatesContainer.html('');
		templates.forEach(function(tpl,i){
			if (tpl.format!=format) return;
			var svg=$('<svg viewBox="0, 0, 100, '+modular[format]*100+'"/>');
			var bl=tpl.bl[0]?tpl.bl:[tpl.bl];

			if (bl.find(function(data){
				$('<g class="module" style="--x: '+data.x*100+'%; --y: '+ data.y*100+'%;'
					+' --w: '+ data.w*100+'%; --h: '+ data.h*100+'%"/>')
				.appendTo(svg).append('<rect/>');

				return !('s' in data) || +data.r

			})) return;

			svg[0].innerHTML+='';

			$('<button />').append(svg).prop({title: JSON.stringify(tpl)})
			.click(function(e){
				e.preventDefault();
				$('>g', svg0)[0].innerHTML=svg[0].innerHTML;
				$('g.module', svg0).addLines();
				resizeCanvas();
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
			var w=this.width,
				h=this.height;
			if (w<minImgSize || h<minImgSize) {
				alert(tooSmall);
				return;
			}
			var hw=h2w.actual=this.height/this.width;
			img.attr('xlink:href', this.src);
			h2w.maxW=this.width/dpcm;
			h2w.maxH=this.height/dpcm;
			setMinMax();
			if (hw>modular.minPortrait) setTemplates('Portrait');
			else if (hw>modular.minSquare) setTemplates('Square');
			else if (hw>modular.minLandscape) setTemplates('Landscape');
			else setTemplates('Panorama');
		}
		img0.src=URL.createObjectURL(file)
	})

	function setMinMax(){
		var hw=h2w.actual,
			minW=hw<1?Math.floor(modular.min/hw):modular.min,
			minH=hw>1?Math.floor(modular.min*hw):modular.min,
			maxW=Math.min(modular.max, Math.round(h2w.maxW)),
			maxH=Math.min(modular.max, Math.round(h2w.maxH));
		wInp.setMinMax(minW, maxW);
		hInp.setMinMax(minH, maxH);
		sizeInp.trigger('change');
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

		var pos0=this.querySelector('rect').getBoundingClientRect();
		var bBox=$('>rect', svg0)[0].getBoundingClientRect(),
			minSize=modular.minSize*h2w.dpcm;
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
			var x=pos0.x - bBox.x,
				y=pos0.y - bBox.y,
				w=pos0.width,
				h=pos0.height;
			var css={};

			dx=Math.max(dx, move.l?-x:-w+minSize);
			dy=Math.max(dy, move.t?-y:-h+minSize);

			dx=Math.min(dx, move.w<0?w-minSize:bBox.width-x-w);
			dy=Math.min(dy, move.h<0?h-minSize:bBox.height-y-h);

			if (move.l) css['--x']=(x+dx)/bBox.width*100+'%';
			if (move.t) css['--y']=(y+dy)/bBox.height*100+'%';
			css['--w']=(w+dx*move.w)/bBox.width*100+'%';
			css['--h']=(h+dy*move.h)/bBox.height*100+'%';

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
	for (var i = 0, j, html; i*20 < modular.max; i++) {
		j=i*20;
		html='<div><div><div>'+j+'</div><div>'+(j+5)+'</div></div><div><div>'+(j+10)+'</div><div>'+(j+15)+'</div></div></div>'
		hRuler.append(html);
		wRuler.append(html);
	}

	// Whole resize

	var resized;

	var wInp=$('.modular-size .width input').on('input change', function(e){
		h2w.h=(this.value*h2w.actual).toFixed(1)*1;
		mainContainer.css({'--h': h2w.h, '--w': this.value});
		wInp.val(this.value).setBg();
		hInp.not(':focus').val(h2w.h);
		if (e.originalEvent) hInp.triggerHandler('change');

		resized=true;
	});
	var hInp=$('.modular-size .height input').on('input change', function(e){
		h2w.w=(this.value/h2w.actual).toFixed(1)*1;
		mainContainer.css({'--h': this.value, '--w': h2w.w});
		hInp.val(this.value).setBg();
		wInp.not(':focus').val(h2w.w);
		if (e.originalEvent) wInp.triggerHandler('change');
	});
	var sizeInp=wInp.add(hInp).trigger('input');
	resized=false;

	$(window).on('touchend touchcancel mouseup blur', function(){
		if (resized) resizeCanvas();
	});


	$.fn.hideScroll=function(){ 
		var el=this[0];
		if (!el) return;
		el.style.marginRight='';
		el.style.marginRight=el.clientWidth-el.offsetWidth-.5+'px';	
	}

	$('.filter-picture').on('opened', function(e, cObj){
		cObj.$details.filter('.modular-shapes').hideScroll()
	});

	// show preview

	var wallSvg;
	
	var wallTab=$('.interior.tabs-item').on('show', function(){
		wallSvg=svg0.clone();
		$('.module g', wallSvg).remove();
		$('pattern', wallSvg)[0].id='image1';
		$('svg', this).replaceWith(wallSvg);
		wallSizeInp.setMinMax(Math.max(wallSizeInp[0].min, Math.ceil(h2w.w))).trigger('input');

		$('.module', wallSvg).on('mousedown touchstart', function(e){
			var touch = e.type=='touchstart' && e.originalEvent.changedTouches[0];
			if (touch && !$(el).is(':hover')) return;
			e.preventDefault();
			wallTab.addClass('grabbing');
			var x0=(touch||e).pageX;
			var y0=(touch||e).pageY;
			var id=touch && touch.identifier;

			var pos0=$('>g', wallSvg)[0].getBoundingClientRect();
			var bBox=wallSvg[0].parentNode.getBoundingClientRect();
			var left=parseInt(wallSvg.css('left'));
			var top=parseInt(wallSvg.css('top'));
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

				dx=Math.max(dx, bBox.left-pos0.left);
				dy=Math.max(dy, bBox.top-pos0.top);

				dx=Math.min(dx, bBox.right-pos0.right);
				dy=Math.min(dy, bBox.bottom-pos0.bottom);

				wallSvg.css({left: left+dx, top: top+dy});
			}

			$(window).on(touch?'touchmove':'mousemove', change)
			 .on('mouseup touchcancel touchend blur', function(){
			 	$(window).off('mousemove touchmove', change);
				wallTab.removeClass('grabbing');
			})
		})
	});

	$('.interior-item').click(function(){
		$('img', wallTab).prop('src', this.dataset.interior)
	}).filter('.active').click();

	var wallSizeInp=$('.interior-sizes input').on('input', function(e){
		wallSizeInp.val(this.value).setBg();
		wallSvg.width(h2w.w/this.value*100+'%')
	});

	$(window).on('resize', resizeCanvas)
//})()