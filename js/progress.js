(function(window) {
	function Progress($progressBar, $progressLine, $progressDot) {
		return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
	}
	
	Progress.prototype = {
		constructor: Progress,
		
		init: function($progressBar, $progressLine, $progressDot) {
			this.$progressBar = $progressBar;
			this.$progressLine = $progressLine;
			this.$progressDot = $progressDot;
		},
		
		isMove: false,
		
		progressClick: function(callback) {
			var progreeThis = this;
			
			this.$progressBar.click(function(event) {
				//now the this is the $progressBar
				//get the distance between the window
				var normalLeft = $(this).offset().left;
				
				var mouseLeft = event.pageX;
				
				//change the position of the progressLine and progressDot
				progreeThis.$progressLine.css('width', (mouseLeft - normalLeft));
				
				progreeThis.$progressDot.css('left', (mouseLeft - normalLeft));
				
				//get the ratio
				var ratio = (mouseLeft - normalLeft) / progreeThis.$progressBar.width();
				callback(ratio);
			})
		},
		
		progressMove: function(callback) {
			var progreeThis = this;
			var normalLeft;
			var mouseLeft;
			
			this.$progressBar.mousedown(function(event) {
				event.preventDefault();
				//get the distance between the window
			    normalLeft = $(this).offset().left;
				
				$(document).mousemove(function(event) {
					event.preventDefault();
					
					//stop the song time event (setProgress)
					progreeThis.isMove = true;
					
				    mouseLeft = event.pageX;
					
					if (mouseLeft < normalLeft) {
						mouseLeft = normalLeft;
					}
					//console.log(mouseLeft, progreeThis.$progressBar.width())
					if (mouseLeft > (progreeThis.$progressBar.width() + normalLeft)) {
						mouseLeft = (progreeThis.$progressBar.width() + normalLeft);
					}
					
					//change the position of the progressLine and progressDot
					progreeThis.$progressLine.css('width', (mouseLeft - normalLeft));
					
					progreeThis.$progressDot.css('left', (mouseLeft - normalLeft));
				})
				
				$(document).mouseup(function(event) {
					$(document).off('mousemove');
					$(document).off('mouseup');
					
					progreeThis.isMove = false;
					
					//get the ratio
					var ratio = (mouseLeft - normalLeft) / progreeThis.$progressBar.width();
					callback(ratio);
				})
			})
		},
		
		setProgress: function(value) {
			if (this.isMove) return;//when dragging
			
			if ((value < 0) || (value > 100)) return;
			
			//console.log(value)
			this.$progressLine.css({
				width: value + '%'
			})
			
			this.$progressDot.css({
				left: value + '%'
			})
		}
	}
	
	Progress.prototype.init.prototype = Progress.prototype;
	
	window.Progress = Progress;
})(window)
