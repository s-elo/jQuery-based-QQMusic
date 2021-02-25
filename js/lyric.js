
(function(window) {
	function Lyric(path) {
		return new Lyric.prototype.init(path);
	}
	
	Lyric.prototype = {
		constructor: Lyric,		
		time: [],
		lyric: [],
		index: -1,
		
		init: function(path) {
			this.path = path;
		},
		
		lyricLoad: function(callback) {
			var lyricThis = this;
			
			$.ajax({
				url: lyricThis.path,
				dataType: 'text',
				success: function(data) {
					//console.log(data);
					lyricThis.parseLyric(data);
					//after parsing the lyrics and time
					callback();
				},
				error: function(err) {
					console.log(err);
				}
			})
		},
		
		parseLyric: function(data) {
			var lyricThis = this;
			
			this.time = [];
			this.lyric = [];
			
			var array = data.split('\n');
			//console.log(array)
			
			//get the time: [00:00.000]
			var timeReg = /\[(\d*:\d*\.\d*)\]/;
			
			$.each(array, function(index, value) {
				//get the time string
				var ret = timeReg.exec(value);
				if (ret === null) return true;//continue
				
				if (ret[1].length === 1) return true;//when it is blank
				
				var timeStr = ret[1];
				//console.log(timeStr);
				
				//convert to sec
				var min = parseInt(timeStr.split(':')[0] * 60);
				var sec = parseFloat(timeStr.split(':')[1]);
				
				var time = parseFloat(Number(min + sec).toFixed(2));
				//console.log(time)
				lyricThis.time.push(time);
				
				//get the lyrics
				lyricThis.lyric.push(value.split('\]')[1]); 
			})
			 // console.log(lyricThis.time);
			 // console.log(lyricThis.lyric);
		},
		
		currentIndex: function(currentTime) {
			//var lyricThis = this;
			//console.log(currentTime)
			// if (currentTime >= this.time[0]) {
			// 	this.index ++;
				
			// 	//delete the first value everytime
			// 	//that is why we use time[0] every time
			// 	this.time.shift();
			// }
			for (let i = 0; i < this.time.length; i++) {
				if (currentTime >= this.time[i]) {
					if (i === (this.time.length - 1)) {
						this.index = i;
						break;
					}
					if (currentTime < this.time[i + 1]) {
						this.index = i;
						break;
					}
				}
			}
			//console.log(this.index)
			return this.index;
		}
	}
	
	Lyric.prototype.init.prototype = Lyric.prototype;
	
	window.Lyric = Lyric;
})(window)

