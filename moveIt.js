/// how this works : this moves 


	var mousePos = {x: 0, y:0};
	transform = {x: -00, y: 0, scale: 1};
		$('#dMovable').css('transform', 'scale(' + transform.scale + ') translate(' + transform.x + 'px,' + transform.y + 'px)');

	/// view control facilities----------------------------------------------------
	function enableAreaMoving(){
		$("#dCentral").on("wheel", onWheel);
		$('#dCentral').on("mousedown", onMouseDown);
		$('body').on("mouseup", onMouseUp);
	}
	
	function disableAreaMoving(){
		$("#dCentral").off("wheel", onWheel);
		$('#dCentral').off("mousedown", onMouseDown);
		$('body').off("mouseup", onMouseUp);
	}
	
	function onWheel(e){
		var curX = e.originalEvent.pageX - $('#dCentral').offset().left;
		var curY = e.originalEvent.pageY - $('#dCentral').offset().top;
		
		
		var origin = {x: (curX  / transform.scale- transform.x), y: (curY  / transform.scale- transform.y)}
		
		if(e.originalEvent.deltaY > 0){
			transform.scale *= 0.8;
		}
		else{
			transform.scale /= 0.8;
		}
		
		transform.x = curX / transform.scale - origin.x;
		transform.y = curY / transform.scale - origin.y;
			
		
		$('#dMovable').css('transform', 'scale(' + transform.scale + ') translate(' + transform.x + 'px,' + transform.y + 'px)');
	}

	function onMouseDown(e){
		mousePos.x = e.screenX;
		mousePos.y = e.screenY;
		
		$('body').mousemove(function(e){
			transform.x += (e.screenX - mousePos.x) / transform.scale;
			transform.y += (e.screenY - mousePos.y) / transform.scale;

			mousePos.x = e.screenX;
			mousePos.y = e.screenY;
			
			$('#dMovable').css('transform', 'scale(' + transform.scale + ') translate(' + transform.x + 'px,' + transform.y + 'px)');
		});
	}
	function onMouseUp(e){
		$('body').off('mousemove');
	}