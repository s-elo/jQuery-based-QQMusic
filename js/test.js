// (function(window) {
// 	function Lyric(path) {
// 		return new Lyric.prototype.init(path);
// 	}
	
// 	Lyric.prototype = {
// 		constructor: Lyric,		
// 		init: function(path) {
// 			this.path = path;
// 		}
// 	}
	
// 	Lyric.prototype.init.prototype = Lyric.prototype;
	
// 	window.Lyric = Lyric;
// })(window)

function Lyric(path) {
	this.path = path;
}