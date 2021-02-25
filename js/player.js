(function(window) {
	function Player($audio) {
		//when create a Player obj, it equals to create a init obj
		return new Player.prototype.init($audio);
	}
	
	Player.prototype = {
		constructor: Player,
		
		musicList: [],
		
		init: function() {
			this.$audio = $audio;//JQ obj
			this.audio = $audio.get(0);//original element
		},
		
		currentIndex: -1,
		
		playMusic: function(index, music) {
			//the this is the Player it self
			//when is the same song
			if (this.currentIndex === index) {
				//when it is paused
				if (this.audio.paused) {
					this.audio.play();
				}
				else {
					this.audio.pause();
				}
			}
			//when it is another song
			else {
				//use the JQ obj to change the song
				this.$audio.attr('src', music.link_url);
				//console.log(music.link_url)
				//use the original one to play
				this.audio.play();
				
				//record the current index
				this.currentIndex = index;
			}
		},
		
		deleteMusic: function(index) {
			this.musicList.splice(index - 1, 1);
			
			//if delete the preious one
			if (index <= this.currentIndex) {
				this.currentIndex = this.currentIndex - 1;
			}
		},
		
		musicTimeUpdate: function(callback) {
			var playerThis = this;
			
			this.$audio.on('timeupdate', function() {
				//console.log(Player.getMusicDuration(), Player.getMusicCurrentTime());
				var duration = playerThis.audio.duration;
				var currentTime = playerThis.audio.currentTime;
				
				var timeInfo = playerThis.formatTime(currentTime, duration);
				// since the params can not be return 
				callback(currentTime, duration, timeInfo);
			})
		},
		
		formatTime: function(current, duration) {
			var sec = parseInt(current % 60);
			var min = parseInt(current / 60);
			var durSec = parseInt(duration % 60);
			var durMin = parseInt(duration / 60);
			
			if (sec < 10) {
				sec = '0' + sec;
			}
			if (min < 10) {
				min = '0' + min;
			}
			if (durSec < 10) {
				durSec = '0' + durSec;
			}
			if (durMin < 10) {
				durMin = '0' + durMin;
			}
			
			return (`${ min }:${ sec } / ${ durMin }:${ durSec }`);
		},
	
		jumpTo: function(ratio) {
			if (isNaN(ratio)) return;
			this.audio.currentTime = this.audio.duration * ratio;
		},
		
		setVolume: function(ratio) {
			if (isNaN(ratio)) return;
			if (ratio < 0 || ratio > 1) return;
			//0-1
			this.audio.volume = ratio;
		}
	}
	
	//make sure the functions in init can be used by using Player without initailizing the init
	Player.prototype.init.prototype = Player.prototype;
	
	window.Player = Player;
})(window)
