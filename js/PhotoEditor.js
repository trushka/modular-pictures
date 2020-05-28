var Cell = function(editor)
{
	this.editor = editor;
	
	//p1+++++++++++++++
	//+++++++++++++++++
	//+++++++++++++++++
	//+++++++++++++++++
	//+++++++++++++++++
	//+++++++++++++++++
	//+++++++++++++++p2
	
	this.p1 = {x:0,y:0};
	this.p2 = {x:1,y:1};
	
	this.anim_begintime = new Date().getTime() - Cell.anim_length;
}


Cell.min_size = 0.05;

Cell.anim_length = 300;


Cell.prototype.h = function() //высота
{
	return this.p2.y - this.p1.y;	
}

Cell.prototype.w = function()//ширина
{
	return this.p2.x - this.p1.x;		
}

Cell.prototype.anim = function()//координаты при использовани анимации
{
	if (this.anim_old)
	{
		var single = Math.min(1, (1 / Cell.anim_length) * (new Date().getTime() - this.anim_begintime));

		var obj = {p1:{},p2:{}};
		
		obj.p1.x = this.anim_old.p1.x + (this.p1.x - this.anim_old.p1.x)*single;
		obj.p1.y = this.anim_old.p1.y + (this.p1.y - this.anim_old.p1.y)*single;
		obj.p2.x = this.anim_old.p2.x + (this.p2.x - this.anim_old.p2.x)*single;
		obj.p2.y = this.anim_old.p2.y + (this.p2.y - this.anim_old.p2.y)*single;

		return obj;		
	
	}else
	{	
		return {p1:Object.assign({},this.p1),p2:Object.assign({},this.p2)};	
	}	
	
}



Cell.prototype.BeginAnimation = function()//переместить анимацию в начало
{
	this.anim_old = this.anim();	
	this.anim_begintime = new Date().getTime();	
}



Cell.prototype.cells_top = function()
{
	
	var list = [];	
	
	var mx = 0;	
	
	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];		
	
		if(this.p1.y >= cell2.p2.y && ((this.p1.x > cell2.p1.x && this.p1.x < cell2.p2.x) || (this.p2.x > cell2.p1.x && this.p2.x < cell2.p2.x)))
		{
			mx = Math.max(mx,cell2.p2.y);	
		}
	}	


	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];	

		if (this.p1.x <= cell2.p1.x && this.p2.x >= cell2.p2.x  && this.p1.y >= cell2.p2.y && mx <= cell2.p1.y)
		{
			list.push(cell2);	
		}
	}

	return list;	
}


Cell.prototype.cells_bottom = function()
{
	
	
	
	var list = [];	
	
	var mn = 1;	
	
	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];		
	
		if(this.p2.y <= cell2.p1.y && ((this.p1.x > cell2.p1.x && this.p1.x < cell2.p2.x) || (this.p2.x > cell2.p1.x && this.p2.x < cell2.p2.x))) 
		{
			mn = Math.min(mn,cell2.p1.y);
		}
	}	
	


	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];	

		if (this.p1.x <= cell2.p1.x && this.p2.x >= cell2.p2.x  && this.p2.y <= cell2.p1.y && mn >= cell2.p2.y)
		{
			list.push(cell2);	
		}
	}

	return list;	
}



Cell.prototype.cells_left = function()
{
	
	var list = [];	
	
	var mx = 0;	
	
	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];		
	
		if(this.p1.x >= cell2.p2.x && ((this.p1.y > cell2.p1.y && this.p1.y < cell2.p2.y) || (this.p2.y > cell2.p1.y && this.p2.y < cell2.p2.y))) 
		{
			mx = Math.max(mx,cell2.p2.x);	
		}
	}	


	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];	

		if (this.p1.y <= cell2.p1.y && this.p2.y >= cell2.p2.y  && this.p1.x >= cell2.p2.x && mx <= cell2.p1.x)
		{
			list.push(cell2);	
		}
	}

	return list;		
	
	
	
}



Cell.prototype.cells_right = function()
{
	
	var list = [];	
	
	var mn = 1;	
	
	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];		
	
		if(this.p2.x <= cell2.p1.x && ((this.p1.y > cell2.p1.y && this.p1.y < cell2.p2.y) || (this.p2.y > cell2.p1.y && this.p2.y < cell2.p2.y))) 
		{
			mn = Math.min(mn,cell2.p1.x);
	
		}


	}	


	for (var key in this.editor.grid)	
	{      
		var cell2 = this.editor.grid[key];	

		if (this.p1.y <= cell2.p1.y && this.p2.y >= cell2.p2.y  && this.p2.x <= cell2.p1.x && mn >= cell2.p2.x)
		{
			list.push(cell2);	
		}
	}

	return list;	
}






Cell.prototype.add_vertical = function(top,is_animation)
{
	

	
	var list1 = this.cells_top();	
	var list2 = this.cells_bottom();
	
	var magnet = this.editor.Magnet();
	

	var h = this.h();
	
	var n = new Cell(this.editor);
	n.id = this.editor.counter++;
	
	if (top)
	{
		n.p1.x = this.p1.x;//начало для анимации
		n.p1.y = this.p1.y;	
		n.p2.x = this.p2.x;
		n.p2.y = this.p1.y;		
	}else
	{
		n.p1.x = this.p1.x;
		n.p1.y = this.p2.y;	
		n.p2.x = this.p2.x;
		n.p2.y = this.p2.y;
	}
	
	 
	var list3 = list1.concat(list2).concat([n]).concat([this]);
	
	if (is_animation)list3.forEach(function(cell){cell.BeginAnimation();});
	
	
	list2.forEach(function(cell){
			cell.p1.y += h;
			cell.p2.y += h;		
		});
	
	
	if (top)
	{
		this.p1.y += h;
		this.p2.y += h;		
	}
	
	
   

	if (top)
	{
		n.p1.x = this.p1.x;
		n.p1.y = this.p1.y-h;	
		n.p2.x = this.p2.x;
		n.p2.y = this.p1.y;		
	}else
	{
		n.p1.x = this.p1.x;
		n.p1.y = this.p2.y;	
		n.p2.x = this.p2.x;
		n.p2.y = this.p2.y+h;
	}

	this.editor.grid.push(n);
	
	
	


	var mn = 1;
	var mx = 0;
	
	
	
	list3.forEach(function(cell){
			mn = Math.min(mn,Math.min(cell.p1.y,cell.p2.y));
			mx = Math.max(mx,Math.max(cell.p1.y,cell.p2.y));
		});

	var s = mx -  mn; 

	var  m =  m3.multiply(m3.translation(0,mn),
		m3.multiply(m3.scaling(1,(s - h)/s),
			m3.translation(0,-mn)));
          
    
	list3.forEach(function(cell){
			cell.p1 = m3.multiplyPoint(m,cell.p1);
			cell.p2 = m3.multiplyPoint(m,cell.p2);
			
			
			cell.p1.y = magnet.y(cell.p1.y,0.01);
			cell.p2.y = magnet.y(cell.p2.y,0.01); 
				
		});
		
	this.editor.DoChange("cell");	
	return n;
	
}



Cell.prototype.add_horizontal = function(left,is_animation)
{
	
	
	var list1 = this.cells_left();	
	var list2 = this.cells_right();
	
	var magnet = this.editor.Magnet();
	

	var w = this.w();
	
	var n = new Cell(this.editor);
	n.id = this.editor.counter++;
	    
	if (left)
	{
		n.p1.y = this.p1.y;//начало для анимации 
		n.p1.x = this.p1.x;	
		n.p2.y = this.p2.y;
		n.p2.x = this.p1.x;		
	}else
	{
		n.p1.y = this.p1.y;
		n.p1.x = this.p2.x;	
		n.p2.y = this.p2.y;
		n.p2.x = this.p2.x;
	}
	    
	    
	    
	var list3 = list1.concat(list2).concat([n]).concat([this]);
	    
	if (is_animation)list3.forEach(function(cell){cell.BeginAnimation();});
	    
	
	
	list2.forEach(function(cell){
			cell.p1.x += w;
			cell.p2.x += w;		
		});
	
	
	if (left)
	{
		this.p1.x += w;
		this.p2.x += w;		
	}
	
	
	
   
	if (left)
	{
		n.p1.y = this.p1.y;
		n.p1.x = this.p1.x-w;	
		n.p2.y = this.p2.y;
		n.p2.x = this.p1.x;		
	}else
	{
		n.p1.y = this.p1.y;
		n.p1.x = this.p2.x;	
		n.p2.y = this.p2.y;
		n.p2.x = this.p2.x+w;
	}

	this.editor.grid.push(n);
	
	
	


	var mn = 1;
	var mx = 0;
	
	
	list3.forEach(function(cell){
			mn = Math.min(mn,Math.min(cell.p1.x,cell.p2.x));
			mx = Math.max(mx,Math.max(cell.p1.x,cell.p2.x));
		});



	var s = mx -  mn; 

	var  m =  m3.multiply(m3.translation(mn,0),
		m3.multiply(m3.scaling((s - w)/s,1),
			m3.translation(-mn,0)));
          
    
	list3.forEach(function(cell){
		
		
			cell.p1 = m3.multiplyPoint(m,cell.p1);
			cell.p2 = m3.multiplyPoint(m,cell.p2);	
			
			cell.p1.x = magnet.x(cell.p1.x,0.01);
			cell.p2.x = magnet.x(cell.p2.x,0.01);
			
			
		});
		
	this.editor.DoChange("cell");	
	return n;	
	
}

Cell.prototype.delete = function(is_animation)
{
	
	
	var list_left = this.cells_left();	
	var list_right = this.cells_right();
	
	var magnet = this.editor.Magnet();


	if (list_left.length !== 0 || list_right.length !== 0)
	{
	
		var w = this.w();
		
		
		
		var list3 = list_left.concat(list_right);
		if(is_animation)list3.forEach(function(cell){cell.BeginAnimation();});
		

		for (var key in list_right)
		{
			var cell = list_right[key];
			cell.p1.x -= w;
			cell.p2.x -= w;	
		}	
	
	
		var mn = 1;
		var mx = 0;


		


		list3.forEach(function(cell){
				mn = Math.min(mn,Math.min(cell.p1.x,cell.p2.x));
				mx = Math.max(mx,Math.max(cell.p1.x,cell.p2.x));
			});	
		
		
		var s = mx -  mn; 

		var  m =  m3.multiply(m3.translation(mn,0),
			m3.multiply(m3.scaling((s + w)/s,1),
				m3.translation(-mn,0)));
          
    
		list3.forEach(function(cell){
				cell.p1 = m3.multiplyPoint(m,cell.p1);
				cell.p2 = m3.multiplyPoint(m,cell.p2);		
				
				cell.p1.x = magnet.x(cell.p1.x,0.01);
				cell.p2.x = magnet.x(cell.p2.x,0.01);
			});		
	
		
	
		this.editor.grid.splice(this.editor.grid.indexOf(this), 1);	
	
	}else
	{
		var list_top = this.cells_top();	
		var list_bottom = this.cells_bottom();	


		if (list_top.length !== 0 || list_bottom.length !== 0)
		{
	
			var h = this.h();
			
			var list3 = list_top.concat(list_bottom);
			if(is_animation)list3.forEach(function(cell){cell.BeginAnimation();});
			

			for (var key in list_bottom)
			{
				var cell = list_bottom[key];
				cell.p1.y -= h;
				cell.p2.y -= h;	
			}	
	
	
			var mn = 1;
			var mx = 0;


			

			list3.forEach(function(cell){
					mn = Math.min(mn,Math.min(cell.p1.y,cell.p2.y));
					mx = Math.max(mx,Math.max(cell.p1.y,cell.p2.y));
				});	
		
		
			var s = mx -  mn; 

			var  m =  m3.multiply(m3.translation(0,mn),
				m3.multiply(m3.scaling(1,(s + h)/s),
					m3.translation(0,-mn)));
          
    
			list3.forEach(function(cell){
					cell.p1 = m3.multiplyPoint(m,cell.p1);
					cell.p2 = m3.multiplyPoint(m,cell.p2);
					
					
					cell.p1.y = magnet.y(cell.p1.y,0.01);
					cell.p2.y = magnet.y(cell.p2.y,0.01);
			        
			         	
				});		
	
		
			this.editor.grid.splice(this.editor.grid.indexOf(this), 1);	
	
		}
	
	
	
	}
	this.editor.DoChange("cell");
}

Cell.prototype.RectOut = function()//область вывода
{
	var r = {};	
	var anim = this.anim();
	var mn = Math.min(this.editor.canvas.width,this.editor.canvas.height); 
	r.x = anim.p1.x * this.editor.canvas.width +  (this.editor.between * mn);
	r.y = anim.p1.y * this.editor.canvas.height +  (this.editor.between * mn);
	r.w = Cell.prototype.w.call(anim)*this.editor.canvas.width - (this.editor.between*2*mn);
	r.h = Cell.prototype.h.call(anim)*this.editor.canvas.height - (this.editor.between*2*mn);   	
	return r;	
}


 


Cell.prototype.setImg = function(src)
{
	if (!this.resource || this.resource.img.src !== src)
	{
		this.resource = {};
		this.resource.img = new Image();
		this.resource.img.src = src;
		this.resource.zoom = 1;
		this.resource.offset_x = 0;
		this.resource.offset_y = 0;
		this.resource.rotate = 0.0;
		this.resource.invert_x = false;
		this.resource.invert_y = false;
		this.editor.DoChange("cell");
	}
}


Cell.prototype.photo_zoom = function(value)
{
	if (this.resource)
	{
		value = Math.max(1,value);
		value = Math.min(10,value);
		
		var rect = this.RectOut();
		var cx = (rect.w/2);
		var cy = (rect.h/2);
		var s = (1  / this.resource.zoom)*value;
		this.resource.offset_x =((cx + this.resource.offset_x) * s)-cx;
		this.resource.offset_y =((cy + this.resource.offset_y) * s)-cy;		
		this.resource.zoom = value;	
		
		this.editor.DoChange("cell");
		
		return true;	
	}else
	return false;
}



Cell.prototype.photo_rotate = function(value)
{
	if (this.resource)
	{
		this.resource.rotate = value;
		this.editor.DoChange("cell");
		return true;	
	}else
	return false;	
}	


Cell.prototype.photo_invert_x = function(value)
{
	if (this.resource)
	{
		this.resource.invert_x = value;
		this.editor.DoChange("cell");
		return true;	
	}else
	return false;	
}

Cell.prototype.photo_invert_y = function(value)
{
	if (this.resource)
	{
		this.resource.invert_y = value;
		this.editor.DoChange("cell");
		return true;	
	}else
	return false;	
}

var DragAndDrop = function(type,src)
{
	DragAndDrop.type = type;	
	DragAndDrop.src = src;
	
	var img;

	function mousemove(e)
	{
		if (!img)
		{
			img = document.createElement("img");
			img.src = src;
			img.className = "DragAndDrop";
			document.body.appendChild(img);
		}	
		
		img.style.top = e.clientY+"px";
		img.style.left = e.clientX+"px";
		if (DragAndDrop.onmousemove)DragAndDrop.onmousemove(e);
		e.stopImmediatePropagation();
	}   
    
	function mouseup(e)
	{
		document.body.removeChild(img);
		document.removeEventListener("mousemove", mousemove,true);	
		document.removeEventListener("mouseup", mouseup,true);
		if (DragAndDrop.onmouseup)DragAndDrop.onmouseup(e);
		e.stopImmediatePropagation();
	}
 
 
	document.addEventListener("mousemove", mousemove,true);
	document.addEventListener("mouseup", mouseup,true);	
 
}


function DragAndDrop_img(element,type)
{
	
	element.onmousedown = function()
	{
		function mousemove(e)
		{
			var rect = element.getBoundingClientRect();
			
			var single_y = (1 / element.clientHeight) * (e.clientY - rect.top);
			var single_x = (1 / element.clientWidth) * (e.clientX - rect.left);	

			if (single_y < 0 || single_y > 1 || single_x < 0 || single_x > 1)
			{
				remove();
				new DragAndDrop(type,element.src);
			}	
		}

		function remove()
		{
			document.removeEventListener("mousemove", mousemove);	
			document.removeEventListener("mouseup", remove);		
		}

		if (element.src)
		{
			
			var img = new Image();//проверить загрузилась ли картинка
			img.onload = function()
			{
				document.addEventListener("mousemove", mousemove);
				document.addEventListener("mouseup", remove);	
			}
		
			img.src = element.src;
				
			return false;				
		}
		

		
	}
}





var Selection = function(editor,cell)
{
	this.editor = editor;
	this.cell = cell;	
}




Selection.prototype.delete = function()
{
	this.editor.selection = undefined;	
	this.cell.delete(true);	
}


var PhotoEditor = function(canvas)
{
	var self = this;	
	this.between = 0.01;
	this.radius = 5;
	this.counter = 0;
	this.grid = [];	
	this.is_drawing = false;
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');	
	this.history = [];
	this.history_pos = 0;
	this.initAction_scale();//инициализируем растягивания
	this.initAction_cellAdd();//инициализируем добавления
	this.initAction_selection();//инициализируем выделения
	this.initAction_PhotoOperations();//инициализируем,операции с фото, вытащить фото с ячейки,двигать внутри
	this.initAction_OpenBackground();
	this.new();
	this.add_history();
}






PhotoEditor.prototype.Undo = function()
{
	
	this.history_pos--;


	var state = this.history[this.history_pos-1];	

	this.grid = state.grid;
	

}


PhotoEditor.prototype.add_history = function()
{

	var self = this;
	var state = {};

	state.grid = this.grid.map(function(cell)
		{
			var r = new Cell(self);	
			r.p1 = Object.assign({},cell.p1);
			r.p2 = Object.assign({},cell.p2);
			r.id = cell.id;
    
			if (cell.resource)
			r.resource = Object.assign({},cell.resource);
			return r;
	
		});


	this.history = this.history.slice(0,this.history_pos++);
	//this.history_pos++
	this.history.push(state);

}


PhotoEditor.prototype.DoChange2 = function(types)
{
	
//	if (types["cell"])	
	//{
	//	this.add_history();	
	//}	
	

if (this.onchange)this.onchange(types);	
}


PhotoEditor.prototype.DoChange = function(type)
{
	var self = this;
	if (!this.change_stack)
	{
		this.change_stack = {};	
		this.change_stack.types = {};
		setTimeout(function(){
				self.DoChange2(self.change_stack.types);
				self.change_stack = undefined;	
			},100);
	}

	this.change_stack.types[type] = true;	
}

PhotoEditor.prototype.setBackground = function(src)
{
	this.Background = new Image();
	this.Background.src = src;
	this.DoChange('editor');	
}


PhotoEditor.prototype.new = function()
{
	this.grid = [];	
	this.counter = 0;	
	cell = new Cell(this);
	cell.id = this.counter++;
	cell.p1.x = 0;
	cell.p1.y = 0;
	cell.p2.x = 1;
	cell.p2.y = 1;
	this.grid.push(cell);	
	this.parent = cell;
	this.DoChange('cell');
}




PhotoEditor.prototype.clear = function()
{
	this.new();	
	this.selection = undefined;
	this.DoChange('selection');
}



PhotoEditor.prototype.Magnet = function()
{
	var obj = {
		poss:[],
		x:function(inputX,mn)	
		{
			var r = inputX;	
	
			for (var key in this.poss)	
			{      
				var p = this.poss[key];	
				var d = Math.abs(p.x - inputX);

				if (d < mn)
				{
					r = p.x;	
					mn = d;	
				} 
	
	
			}

			return r;	
		},
		y:function(inputY,mn)
		{
			var r = inputY;	
	
			for (var key in this.poss)	
			{      
				var p = this.poss[key];	
				var d = Math.abs(p.y - inputY);

				if (d < mn)
				{
					r = p.y;	
					mn = d;	
				} 
	
	
			}
			
			
			return r;	
		}	
	};

	for (var key in this.grid)	
	{      
		var cell = this.grid[key];	
		obj.poss.push(Object.assign({},cell.p1));
		obj.poss.push(Object.assign({},cell.p2));
	}
	
	
	
	
	return obj;	
	
}


PhotoEditor.prototype.ClientPosToSinglePos = function(inputPos)
{
	var rect = self.canvas.getBoundingClientRect();
		
	var x = inputPos.x - rect.left;
	var y = inputPos.y - rect.top;
		
	var r = {};
	r.y = (1 / self.canvas.clientHeight) * y;
	r.x = (1 / self.canvas.clientWidth) * x;
		
	return r;		
	
} 

PhotoEditor.prototype.getCellByPoint = function(point)
{
	     
	return this.grid.find(function(cell){
			if (cell.p1.x <= point.x && cell.p2.x >= point.x &&
				cell.p1.y <= point.y && cell.p2.y >= point.y)return true;});			     


	
}



PhotoEditor.prototype.getLineByPoint = function(point)
{
	
	var mn = (1 / Math.max(this.canvas.width,this.canvas.height)) * 10;
	
	
	
	if (point.x > mn && point.y > mn && point.x < 1-mn && point.y < 1-mn)//не разрешается брать родителя с краю 
	{
		
		var line,cell;
		
		this.grid.forEach(function(cell2){ //ищим линию у самой длиной ячейки 
			
				if (cell2.p1.x <= point.x && cell2.p2.x >= point.x)//находится ли точка внутри по x
				{
				
				
					if (!line || ((cell2.p2.x - cell2.p1.x) > (line.p2.x - line.p1.x)))//если линии не существует или новая длиннее старой
					{
						if (Math.abs(cell2.p1.y - point.y) < mn)//проверить достаточно ли близко точка к линии 
						{   
							line = {};
							line.p1 = {x:cell2.p1.x,y:cell2.p1.y};	
							line.p2 = {x:cell2.p2.x,y:cell2.p1.y};	
							cell = cell2;
						}else
						if (Math.abs(cell2.p2.y - point.y) < mn)
						{	line = {};
							line.p1 = {x:cell2.p1.x,y:cell2.p2.y};	
							line.p2 = {x:cell2.p2.x,y:cell2.p2.y};	
							cell = cell2;
						}  
					}
				}else
				if (cell2.p1.y <= point.y && cell2.p2.y >= point.y)
				{
					if (!line || ((cell2.p2.y - cell2.p1.y) > (line.p2.y - line.p1.y)))	
					{
						if (Math.abs(cell2.p1.x - point.x) < mn)
						{
							line = {};
							line.p1 = {x:cell2.p1.x,y:cell2.p1.y};	
							line.p2 = {x:cell2.p1.x,y:cell2.p2.y};
							cell = cell2;	
						}else	
						if (Math.abs(cell2.p2.x - point.x) < mn)
						{   
							line = {};
							line.p1 = {x:cell2.p2.x,y:cell2.p1.y};	
							line.p2 = {x:cell2.p2.x,y:cell2.p2.y};
							cell = cell2;	
						}	
					}	
				
				}
			});
		
		
		if (line)
		{
		
		
		
			if (line.p1.y == line.p2.y)
			{
				
				if (this.grid.find(function(cell2){ 
							if (cell !== cell2 && 
								line.p1.x == cell2.p1.x && 
								((line.p1.y == cell2.p1.y) || 
									(line.p1.y == cell2.p2.y)))return true;
						})&&
					this.grid.find(function(cell2){ 
							if (cell !== cell2 && 
								line.p2.x == cell2.p2.x && 
								((line.p1.y == cell2.p1.y) || 
									(line.p1.y == cell2.p2.y)))return true;
						}))return line;
					
				var mx = 0;
				var mn = 1;
			
				for (var key in this.grid)	
				{      
					var cell2 = this.grid[key];	//получаем всю длину линии
					
					
					if (line.p1.y > cell2.p1.y && line.p1.y < cell2.p2.y)
					
					{
						if (line.p2.x <= cell2.p1.x)
						{
							mn = Math.min(mn,cell2.p1.x);
						}	
						
						
						if (line.p1.x >= cell2.p2.x)
						{
							mx = Math.max(mx,cell2.p2.x);	
						}	
					}
				}	
              	
				line.p1.x = mx;
				line.p2.x = mn;
			}else
			if (line.p1.x == line.p2.x)
			{
				if (this.grid.find(function(cell2){ 
							if (cell !== cell2 && 
								line.p1.y == cell2.p1.y && 
								((line.p1.x == cell2.p1.x) || 
									(line.p1.x == cell2.p2.x)))return true;
						})&&
					this.grid.find(function(cell2){ 
							if (cell !== cell2 && 
								line.p2.y == cell2.p2.y && 
								((line.p1.x == cell2.p1.x) || 
									(line.p1.x == cell2.p2.x)))return true;
						}))return line;
					
				
				var mx = 0;
				var mn = 1;
			
				for (var key in this.grid)	
				{      
					var cell2 = this.grid[key];	
					
					
					if (line.p1.x > cell2.p1.x && line.p1.x < cell2.p2.x)
					
					{
						if (line.p2.y <= cell2.p1.y)
						{
							mn = Math.min(mn,cell2.p1.y);
						}	
						
						
						if (line.p1.y >= cell2.p2.y)
						{
							mx = Math.max(mx,cell2.p2.y);	
						}	
					}
				}	
              	
				line.p1.y = mx;
				line.p2.y = mn;
			}	
			
			
			
			return line;	
			
			
		}
		
	}
}


PhotoEditor.prototype.initAction_scale = function()
{
	var self = this;

	var over;
	
	var selected;
	
	
	
	function mousedown(e)
	{
		selected = undefined;
		
		
			
		
		var p = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
			
		var parent = self.grid[0];

		var	line = self.getLineByPoint(p);
	   
		if (line)
		{
	   		
			selected = {};	
	   		
			selected.line =	line;
				
			selected.magnet = self.Magnet();
	   		
			
			selected.points = [];
		
			selected.mx = 1;
			selected.mn = 0;
	   
			if (line.p1.x == line.p2.x)
			{	 
	   
	   
	     	
				self.grid.forEach(function(cell){
						if (line.p1.y <= cell.p1.y && line.p2.y >= cell.p2.y)
						{
							if (cell.p1.x == line.p1.x)
							{
								selected.mx = Math.min(selected.mx,cell.p2.x);	
								selected.points.push(cell.p1);	
							}	
							else
							if (cell.p2.x == line.p1.x)
							{
								selected.mn = Math.max(selected.mn,cell.p1.x);		
								selected.points.push(cell.p2);	
							}
						}
					});
	   		
	   		
			}else
			{
				self.grid.forEach(function(cell){
	   		
						if (line.p1.x <= cell.p1.x && line.p2.x >= cell.p2.x)
						{
							if (cell.p1.y == line.p1.y)
							{
								selected.mx = Math.min(selected.mx,cell.p2.y);		
								selected.points.push(cell.p1);	
							}	
							else
							if (cell.p2.y == line.p1.y)
							{
								selected.mn = Math.max(selected.mn,cell.p1.y);		
								selected.points.push(cell.p2);	
							}
						}
					});
	   	
	   	
	   	
			}
	   
	   
			e.stopImmediatePropagation();
			
		}
	
		
		
		
	}
	

	
	function mousemove(e)
	{
		
		
		var p = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
		
		if (!selected)
		{
			over = self.getLineByPoint(p);
				
			if (over)
			{
				if (over.p1.x == over.p2.x)
				{
					self.canvas.classList.add("PhotoEditor_col-resize");
					self.canvas.classList.remove("PhotoEditor_row-resize");
					
				}else
				{
					self.canvas.classList.add("PhotoEditor_row-resize");
					self.canvas.classList.remove("PhotoEditor_col-resize");
				}	
					
					
					
			}else
			{
				self.canvas.classList.remove("PhotoEditor_row-resize");
				self.canvas.classList.remove("PhotoEditor_col-resize");
			}
				
		}
		else
		{	
			if (selected.line.p1.x == selected.line.p2.x)	
			{
					
				p.x = selected.magnet.x(p.x,0.02);
		
				if (p.x > selected.mx-Cell.min_size) p.x = selected.mx-Cell.min_size;
				if (p.x < selected.mn+Cell.min_size) p.x = selected.mn+Cell.min_size;	
					
					
			
				if (over) over.p1.x = over.p2.x	= p.x;
				selected.points.forEach(function(p2){
						p2.x = p.x;
					});	
			}else
			{
				p.y = selected.magnet.y(p.y,0.02);
					
				if (p.y > selected.mx-Cell.min_size) p.y = selected.mx-Cell.min_size;
				if (p.y < selected.mn+Cell.min_size) p.y = selected.mn+Cell.min_size;	
			
			
				if (over) over.p1.y = over.p2.y	= p.y;
				selected.points.forEach(function(p2){
						p2.y = p.y;
					});		
			}	
			
		}
		
		
	}	
	
	
	function mouseup(e)
	{
		if (selected)
		{   self.DoChange("cell");
			selected = undefined;	
		}
	}
	


	var old_onEndScene = this.onEndScene;

	this.onEndScene = function()
	{
		if (over)
		{
			self.ctx.save();
			self.ctx.lineWidth = 2;
			self.ctx.setLineDash([2, 1]);
			self.ctx.strokeStyle = "#1c02fd";


			self.ctx.beginPath();       
			self.ctx.moveTo(over.p1.x  * self.canvas.width, over.p1.y * self.canvas.height);   
			self.ctx.lineTo(over.p2.x  * self.canvas.width, over.p2.y * self.canvas.height);   
			self.ctx.stroke(); 




			self.ctx.restore();	
		}

	
		if (old_onEndScene)	old_onEndScene();
	}
	
	
	document.addEventListener("mousemove", mousemove);
	document.addEventListener("mouseup", mouseup);
	this.canvas.addEventListener("mousedown", mousedown);
}



PhotoEditor.prototype.getCellAddToPoint = function(p)
{
	var cell = this.getCellByPoint(p);

	var offset = 0.2;

	if (cell)
	{
		if (cell.p1.x < p.x && cell.p2.x > p.x &&
			cell.p1.y < p.y && cell.p1.y + cell.h() * offset  > p.y)
		{
			return {side:'top',cell:cell,rect:{p1:{x:cell.p1.x,y:cell.p1.y},p2:{x:cell.p2.x,y:cell.p1.y + cell.h() * offset}}};
		}else
		if (cell.p1.x < p.x && cell.p2.x > p.x &&
			cell.p2.y - cell.h() * offset  < p.y && cell.p2.y > p.y)
		{
			return {side:'bottom',cell:cell,rect:{p1:{x:cell.p1.x,y:cell.p2.y -cell.h() * offset},p2:{x:cell.p2.x,y:cell.p2.y}}};
		}else
		if (cell.p1.y < p.y && cell.p2.y > p.y &&
			cell.p1.x < p.x && cell.p1.x + cell.w() * offset  > p.x)
		{
			return {side:'left',cell:cell,rect:{p1:{y:cell.p1.y,x:cell.p1.x},p2:{y:cell.p2.y,x:cell.p1.x + cell.w() * offset}}};

		}else
		if (cell.p1.y < p.y && cell.p2.y > p.y &&
			cell.p2.x - cell.w() * offset  < p.x && cell.p2.x > p.x)
		{
			return {side:'right',cell:cell,rect:{p1:{y:cell.p1.y,x:cell.p2.x -cell.w() * offset},p2:{y:cell.p2.y,x:cell.p2.x}}};
		}else return {side:'center',cell:cell};	
	}	
}


PhotoEditor.prototype.initAction_cellAdd = function()
{
	var self = this;	
	
	var cell_to_add;	
	
	
	var old_onmousemove = DragAndDrop.onmousemove;
	DragAndDrop.onmousemove = function(e)
	{
		if(DragAndDrop.type =="img")
		{
			var p = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
			cell_to_add = self.getCellAddToPoint(p);
		}
		if (old_onmousemove)old_onmousemove(e);	
	}	
	
	var old_onmouseup = DragAndDrop.onmouseup; 
	DragAndDrop.onmouseup = function(e)	 
	{
		if (DragAndDrop.type =="img" && cell_to_add)
		{
			var target = cell_to_add.cell;
			
			switch (cell_to_add.side) 
			{
				case 'top':
				target = cell_to_add.cell.add_vertical(true,true);
				break;
				case 'bottom':
				target = cell_to_add.cell.add_vertical(false,true);
				break;
				case 'left':
				target = cell_to_add.cell.add_horizontal(true,true);
				break;
				case 'right':
				target = cell_to_add.cell.add_horizontal(false,true);
				break;
    
			}
				
			target.setImg(DragAndDrop.src);	
			
			self.selection = new Selection(self,target);
			self.DoChange("selection");	
		
			cell_to_add = undefined;
			
			
		}
			
		if (old_onmouseup)old_onmouseup(e);
	}
	
	
	
	var old_onEndScene = this.onEndScene;
	
	this.onEndScene = function()
	{
		if (cell_to_add && cell_to_add.side !== "center")
		{
			self.ctx.save();	
			self.ctx.lineWidth = 2;
			self.ctx.setLineDash([2, 1]);
			self.ctx.strokeStyle = "#1c02fd";	
			self.ctx.strokeRect(cell_to_add.rect.p1.x * self.canvas.width, cell_to_add.rect.p1.y*self.canvas.height, (cell_to_add.rect.p2.x-cell_to_add.rect.p1.x)*self.canvas.width, (cell_to_add.rect.p2.y-cell_to_add.rect.p1.y)*self.canvas.height);
			self.ctx.restore();	
		}
		
		if (old_onEndScene)	old_onEndScene();
	}
}


PhotoEditor.prototype.initAction_OpenBackground = function()
{
	var self = this;	
	var old_onmouseup = DragAndDrop.onmouseup; 
	DragAndDrop.onmouseup = function(e)	 
	{
		if (DragAndDrop.type =="background")	
		{
			var p = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
		
			if (p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1)
			{
			
				self.setBackground(DragAndDrop.src);		
			    
			}
		}	
		if (old_onmouseup)old_onmouseup(e);	
	}	
}


PhotoEditor.prototype.initAction_PhotoOperations = function()
{
	var self = this;	
	
	function mousedown(e)
	{
		var p1 = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
		var cell1 = self.getCellByPoint(p1);	
		if (cell1.resource)
		{
			var old_offset_x = cell1.resource.offset_x;
			var old_offset_y = cell1.resource.offset_y;
			
			self.canvas.classList.add("PhotoEditor_move");
		}
	

		function mousemove(e)
		{
			var p2 = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
			var cell2 = self.getCellByPoint(p2);	
			
			if (cell1 !== cell2)
			{
				remove();
				new DragAndDrop("img",cell1.resource.img.src);	
			}else
			if (cell1.resource)
			{
				var rect = cell1.RectOut(); 
				
				
				
				var sina = Math.sin(cell1.resource.rotate), cosa = Math.cos(cell1.resource.rotate);
				var imgW = Math.abs(cell1.resource.img.width*cosa) + Math.abs(cell1.resource.img.height*sina);
				var imgH = Math.abs(cell1.resource.img.width*sina) + Math.abs(cell1.resource.img.height*cosa);
			    
			    
				var s = Math.max((rect.w / imgW),(rect.h / imgH)) * cell1.resource.zoom;
		     	
				cell1.resource.offset_x = old_offset_x + self.canvas.width *  (p1.x - p2.x);
				cell1.resource.offset_y = old_offset_y + self.canvas.height *  (p1.y - p2.y);
		     	
				cell1.resource.offset_x = Math.max(Math.min((imgW*s) - rect.w,cell1.resource.offset_x),0);
				cell1.resource.offset_y = Math.max(Math.min((imgH*s) - rect.h,cell1.resource.offset_y),0);
				
			}
			e.stopImmediatePropagation();
		}

		function remove()
		{if (cell1.resource)
			{
				self.canvas.classList.remove("PhotoEditor_move");
				self.DoChange("cell");
			}	
			document.removeEventListener("mouseup", remove,true);
			document.removeEventListener("mousemove", mousemove,true);	
		}

		if (cell1.resource)
		{
			document.addEventListener("mousemove", mousemove,true);
			document.addEventListener("mouseup", remove,true);		
		}
      	
	
	
	}	
	
	
	function wheel(e)
	{
		var p = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
		var cell = self.getCellByPoint(p);	
		if (cell && cell.resource)
		{
			var delta = e.deltaY || e.detail || e.wheelDelta;	
			cell.photo_zoom(cell.resource.zoom * (delta > 0?0.8:1.2));
			e.preventDefault();
			self.DoChange("cell");
		}	
	}
	
	
	
	this.canvas.addEventListener("wheel", wheel);
	

	this.canvas.addEventListener("mousedown", mousedown);	
}



PhotoEditor.prototype.initAction_selection = function()
{
	var self = this;
	function mousedown(e) 	
	{  
		var cell = 	self.getCellByPoint(self.ClientPosToSinglePos({x:e.clientX,y:e.clientY}));
		if (cell)
		{
			if (!self.selection || self.selection.cell !== cell)	
			{
				self.selection = new Selection(self,cell);		
				self.DoChange("selection");	
			}
			
		}else 
		self.selection = undefined;	
	}
	function mouseup(e)
	{
		var p = self.ClientPosToSinglePos({x:e.clientX,y:e.clientY});
		if (self.selection && self.getCellByPoint(p) !== self.selection.cell)
		{
			self.selection = undefined;	
			self.DoChange("selection");
		}	
		
	}	


	var old_onEndScene = this.onEndScene;
	
	this.onEndScene = function()
	{
		if (self.selection)
		{
			self.ctx.save();	
	
			self.ctx.lineWidth = 1;
			//self.ctx.setLineDash([1, 1]);
			self.ctx.strokeStyle = "#23cadc";
			var anim = self.selection.cell.anim();
			self.ctx.strokeRect(anim.p1.x * self.canvas.width, anim.p1.y*self.canvas.height, Cell.prototype.w.call(anim)*self.canvas.width, Cell.prototype.h.call(anim)*self.canvas.height);
			
	
			self.ctx.restore();	
		}
		if (old_onEndScene)	old_onEndScene();
	}


	
	self.canvas.addEventListener("mousedown", mousedown);
	self.canvas.addEventListener("mouseup", mouseup);
}	


PhotoEditor.prototype.drawBackground = function()
{
	this.ctx.save();	
	if (this.Background)
	{
		var s = Math.max(this.canvas.width / this.Background.width,this.canvas.height / this.Background.height);
		this.ctx.scale(s,s);
		this.ctx.drawImage(this.Background, 0, 0);
	}else
	{
		this.ctx.fillStyle = "#ffffff";	
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);	
	}
	

	this.ctx.restore();	
}





PhotoEditor.prototype.roundRect = function(x, y, width, height, radius)
{
	if (typeof radius === 'undefined') {
		radius = 0;
	}
	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
 
	this.ctx.moveTo(x + radius.tl, y);
	this.ctx.lineTo(x + width - radius.tr, y);
	this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	this.ctx.lineTo(x + width, y + height - radius.br);
	this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	this.ctx.lineTo(x + radius.bl, y + height);
	this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	this.ctx.lineTo(x, y + radius.tl);
	this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
}






PhotoEditor.prototype.drawGrid = function()
{
	for (var key in this.grid)	
	{
		var cell = this.grid[key];
		
		var anim = cell.anim();
		
		this.ctx.save();
		
		this.ctx.beginPath();
		
		var rect = cell.RectOut();
		
		
		this.roundRect(rect.x, rect.y, rect.w, rect.h,this.radius);
		
		this.ctx.clip();
		
		this.ctx.fillStyle = '#ffedde';
		this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		
		
		
		if (cell.resource)
		{
			var sina = Math.sin(cell.resource.rotate), cosa = Math.cos(cell.resource.rotate)
			var imgW = Math.abs(cell.resource.img.width*cosa) + Math.abs(cell.resource.img.height*sina);
			var imgH = Math.abs(cell.resource.img.width*sina) + Math.abs(cell.resource.img.height*cosa);
			
			
			this.ctx.translate(rect.x, rect.y);
			
			var s = Math.max((rect.w / imgW),(rect.h / imgH)) * cell.resource.zoom;
			
			var offset_x = Math.max(0,Math.min((imgW*s) - rect.w,cell.resource.offset_x));
			
			var offset_y = Math.max(0,Math.min((imgH*s) - rect.h,cell.resource.offset_y));
			
			this.ctx.translate(-offset_x, -offset_y);
			
			this.ctx.scale(s,s);
			
			this.ctx.translate(imgW/2,imgH/2);//поворот
			this.ctx.rotate(cell.resource.rotate);
			this.ctx.translate(-cell.resource.img.width/2,-cell.resource.img.height/2);	
			
			
			if (cell.resource.invert_x)
			{
				this.ctx.translate(imgW,0);
				this.ctx.scale(-1,1);
			}
			if (cell.resource.invert_y)
			{
				this.ctx.translate(0,imgH);
				this.ctx.scale(1,-1);
			}
			
			this.ctx.drawImage(cell.resource.img, 0, 0);
		}
		
		
		
		
		this.ctx.restore();
	}	
}





PhotoEditor.prototype.render = function()
{
	
	if (this.ctx !== undefined)	
	{
		this.drawBackground();
		
		if (this.onBeginScene)this.onBeginScene();
		
		this.drawGrid();
		
		if (this.onEndScene)this.onEndScene();
	}
	
	
	
	
}



PhotoEditor.prototype.enable_drawing = function()
{
	if (!this.is_drawing)
	{
		var self = this;	
		this.is_drawing = true;	
		function UpDate()
		{
			if (self.is_drawing)
			{
				self.render();	
				window.requestAnimationFrame(UpDate);	
			}	
		}	
		
		UpDate();
	
	}	
}


PhotoEditor.prototype.disable_drawing = function()
{
	this.is_drawing = false;	
}


PhotoEditor.prototype.save_template = function()
{
	
	return btoa(JSON.stringify(this.grid.map(function(cell)
				{
					return {p1:cell.p1,p2:cell.p2};
				})));	
}

PhotoEditor.prototype.open_template = function(template)
{
	var self = this;	
	this.grid = [];	
	this.counter = 0;	
	template = atob(template);
	template = JSON.parse(template);		
	template.forEach(function(item)
		{
			var n = new Cell(self);
			n.id = self.counter++;
			n.p1 = item.p1;
			n.p2 = item.p2;
			self.grid.push(n);		
		});	
	
	this.selection = undefined;	
	this.DoChange("selection");	
	this.DoChange("cell");	
}



PhotoEditor.prototype.loadPhotos = function(list,ran,ratio,rotate)
{
	var self = this;	
	
	var imgs = [];
	var loads = [];
	var i = 0;
	
	
	
	
	if (ran)list = list.sort(function(){return Math.random() - 0.5;});
		
	
	

	function end()
	{
		var cells = self.grid.sort(function(a,b){
				if (a.p1.y == b.p1.y)
				{
					return a.p1.x - b.p1.x;	
				}else
				{
					return a.p1.y - b.p1.y;		
				}
			});	
			
			
			


		for (var cell of cells) 
		{
			let img;	
			
			if (ratio)
			{
				img = loads.find(function(img,i){
						if ((img.height >= img.width) == (cell.h()>=cell.w()))
						{
							loads.splice(i, 1);
							return true; 	
						}	
					});
			}
            
            
            

			if (!img) img = loads.shift();	
	
			if (img)
			{
				cell.setImg(img.src);
				if (rotate && ((img.height >= img.width) !== (cell.h()>=cell.w())))
				{
				cell.photo_rotate(Math.PI/2);	
				}
					
			}else
			break;
		}

	
	
	}

	list.forEach(function(src){
			let img = new Image();
			img.src = src;
			img.onload = function(){
				loads.push(img);	
				if (list.length-1 == i++) end();
			}	
			img.onerror = function()
			{
				if (list.length-1 == i++) end();	
			}
		});
}






PhotoEditor.prototype.out = function(width,height)
{
	var old_canvas = this.canvas;
	var old_ctx = this.ctx;

	if (!width)width = old_canvas.width;
	if (!height)height = old_canvas.height;

	this.canvas = document.createElement('canvas');
	this.canvas.width = width;
	this.canvas.height = height;
	this.ctx = this.canvas.getContext('2d');
	this.drawBackground();
	this.drawGrid();
	var r = this.canvas.toDataURL('image/jpeg', 1.0);
	this.canvas = old_canvas;
	this.ctx = old_ctx;	
	return r;
}



