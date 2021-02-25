
// var Lyric = new Lyric('./source/red_lyric.txt');
// Lyric.lyricLoad();

//customize the scrollBar
 $(".content_list").mCustomScrollbar();

//get the audio JQ obj
var $audio = $('audio');

//remember the obj name had better not be the same as the class name
//since (window.ClassName = ClassName)
var player = new Player($audio);

var progressVolume;
var progress;

var LyricHandle;
//init lyrics
function initMusicLyric(music) {
	LyricHandle = new Lyric(music.link_lyr);
	var $songLyric = $('.song_lyric');
	
	//every time change a song
	$songLyric.css({
		marginTop: 0
	})
	
	LyricHandle.lyricLoad(function() {
		var items = ``;
		$.each(LyricHandle.lyric, function(index, value) {
			items += `<li>${ value }</li>`;
			// var $item = $(`<li>${ value }</li>`);
			// $songLyric.append($item);
		})
		$songLyric.html(items);
	});
	
}

//handle the progresses
initProgress();
function initProgress() {
	//volume
	var $voiceBar = $('.music_voice_bar');
	var $voiceLine = $('.music_voice_line');
	var $voiceDot = $('.music_voice_dot');
	
    progressVolume = new Progress($voiceBar, $voiceLine, $voiceDot);
	
	progressVolume.progressClick(function(ratio) {
		player.setVolume(ratio);
	});
	progressVolume.progressMove(function(ratio) {
		player.setVolume(ratio);
	});
	
	//progress
	var $progressBar = $('.music_progress_bar');
	var $progressLine = $('.music_progress_line');
	var $progressDot = $('.music_progress_dot');
	
	progress = new Progress($progressBar, $progressLine, $progressDot);
	
	progress.progressClick(function(ratio) {
		player.jumpTo(ratio);
	});
	progress.progressMove(function(ratio) {
		player.jumpTo(ratio);
	});
}


//get the music
getMusicList();
function getMusicList() {
	$.ajax({
		url: './source/musicList.json',
		dataType: 'json',
		success: function(data) {
			//console.log(data);
			
			player.musicList = data;//synchronize the data
			
			//show all the songs 
			var $musicList = $('.content_list ul');
			$.each(data, function(index, value) {
				var $item = createMusicItem(index, value);
				$musicList.append($item);
			})
			
			initMusicInfo(data[0]);//first one default
			//initMusicLyric(data[0]);
			// var Lyric = new Lyric(data[0].link_lyr);
		},
		error: function(err) {
			console.log(err);
		}
	})
}

//handle music info
function initMusicInfo(music) {
	//console.log(music)
	var $musicImg = $('.song_info_pic img');
	var $musicBg = $('.mask_bg');
	
	var $musicName = $('.song_info_name a');
	var $musicSinger = $('.song_info_singer a');
	var $musicAlbum = $('.song_info_album a');
	
	var $musicProgressName = $('.music_progress_name');
	var $musicProgressTime = $('.music_progress_time');
	
	$musicImg.attr('src', music.cover);
	$musicName.text(music.name);
	$musicSinger.text(music.singer);
	$musicAlbum.text(music.album);
	
	$musicProgressName.text(`${ music.name } / ${ music.singer }`);
	$musicProgressTime.text(`00:00 / ${ music.time }`);
	
	$musicBg.css('background', `url(${ music.cover })`);
}

//binding related events
initEvents();
function initEvents() {
	//handle the menu display
	/**
	 * use the delegation function to bind the event for those elements created dynamically
	 * 1. $(delegated element).delegate(dynamical element, eventName, callback)
	 * 2. $(delegated element).on(eventName, dynamical element, callback)
	 */
	 $('.content_list').on('mouseenter', '.list_music', function() {
		 //show the delete icon
		 //find() can find all the generations of the element
		 $(this).find('.list_time a').stop().fadeIn(100);
		 
		 //hide the time
		 $(this).find('.list_time span').stop().fadeOut(100);
		 
		 //show the menu
		 $(this).find('.list_menu').stop().fadeIn(100);
	 })
	 
	 $('.content_list').on('mouseleave', '.list_music', function() {
		 //hide the above elements
		 $(this).find('.list_time a').stop().fadeOut(100);
		 $(this).find('.list_menu').stop().fadeOut(100);
		 
		 //show the time
		 $(this).find('.list_time span').stop().fadeIn(100);
	 })
	
	//when selecting a song
	$('.content_list').on('click', '.list_check', function() {
		var $i = $(this).find('i');
		
		$i.toggleClass('glyphicon glyphicon-ok');
		//console.log($(this).find('i').css('opacity'))//String
		
		if ($i.css('opacity') === '0.5') {
			$i.css('opacity', 1);
		}
		else {
			$i.css('opacity', 0.5);
		}
	})
	
	//play and pause
	var $footerMusicPlay = $('.music_play').find('i');
	var $footerMusicPre = $('.music_pre').find('i');
	var $footerMusicNext = $('.music_next').find('i');
	
	$('.content_list').on('click', '.list_menu_play', function() {
		//alert('555')
		//console.log($(this).find('i').attr('class'))
		/**
		 * attr('class').indexOf('glyphicon-play') != -1 (have the class)
		 * can also be used to see its status
		 */
		var $i = $(this).find('i');
		var $item = $(this).parents('.list_music');
		
		//test
		// console.log($item.get(0).index)
		// console.log($item.get(0).music)
		
		if ($i.attr('class') === 'glyphicon glyphicon-play') {
			//console.log('if')
			$i.removeClass('glyphicon-play');
			$i.addClass('glyphicon-pause');
			
			//synchronize
			$footerMusicPlay.removeClass('glyphicon-play');
			$footerMusicPlay.addClass('glyphicon-pause');
			
			//handle other songs
			var $otherSongs = $item.siblings().find('.list_menu_play i');
			$otherSongs.removeClass('glyphicon-pause');
			$otherSongs.addClass('glyphicon-play');
			
			//handle the text
			$item.find('div').css('color', '#fff');
			$item.siblings().find('div').css('color', 'rgba(255,255,255,0.5)');
			
			//hadle the music beat icon
			$item.find('.list_number').addClass('list_number2');
			$item.siblings().find('.list_number').removeClass('list_number2');
		}
		else {
			//console.log('else')
			$i.removeClass('glyphicon-pause');
			$i.addClass('glyphicon-play');
			
			//synchronize
			$footerMusicPlay.removeClass('glyphicon-pause');
			$footerMusicPlay.addClass('glyphicon-play');
			
			//handle the text
			$item.find('div').css('color', 'rgba(255,255,255,0.5)');
			
			//hadle the music beat icon
			$item.find('.list_number').removeClass('list_number2');
		}
		
		//play the selected song
		player.playMusic($item.get(0).index, $item.get(0).music);
		
		initMusicInfo($item.get(0).music);
		
		initMusicLyric($item.get(0).music);
		// Lyric = new Lyric($item.get(0).music.link_lyr);
		// var $songLyric = $('.song_lyric');
		
		// Lyric.lyricLoad(function() {
		// 	var items = ``;
		// 	$.each(Lyric.lyric, function(index, value) {
		// 		items += `<li>${ value }</li>`;
		// 		// var $item = $(`<li>${ value }</li>`);
		// 		// $songLyric.append($item);
		// 	})
		// 	$songLyric.html(items);
		// });
	})
	
	//binding the events of the elements in the footer
	$footerMusicPlay.click(function() {
		//when it is the first time to play
		if (player.currentIndex === -1) {
			//trigger the above play event
			//first song defaultly
			$('.list_music').eq(0).find('.list_menu_play').trigger('click');
		}
		else {
			$('.list_music').eq(player.currentIndex - 1).find('.list_menu_play').trigger('click');
		}
	})
	
	$footerMusicPre.click(function() {
		//if it is the first, go to the last one
		if (player.currentIndex === 1) {
			$('.list_music').eq(player.musicList.length - 1).find('.list_menu_play').trigger('click');
		}
		else {
			$('.list_music').eq(player.currentIndex - 2).find('.list_menu_play').trigger('click');
		}
	})
	
	$footerMusicNext.click(function() {
		if (player.currentIndex === player.musicList.length) {
			$('.list_music').eq(0).find('.list_menu_play').trigger('click');
		}
		else {
			$('.list_music').eq(player.currentIndex).find('.list_menu_play').trigger('click');
		}
	})
	
	//delete a song
	$('.content_list').on('click', '.list_menu_del' ,function() {
		var $item = $(this).parents('.list_music');
		
		//if the deleted song is being played
		//change to next one
		if ($item.get(0).index === player.currentIndex) {
			$footerMusicNext.trigger('click');
		}
		
		//synchronize the data
		player.deleteMusic($item.get(0).index);
		
		$item.remove();
		
		//handle the order after deleting
		$('.list_music').each(function(index, music) {
			music.index = index + 1;//music is the or original one
			$(music).find('.list_number').text(`${ index + 1 }`);
		})
	})
	
	//handle the play time
	player.musicTimeUpdate(function(currentTime, duration, timeInfo) {
		//synchronize the time
		$('.music_progress_time').text(timeInfo);
		
		//synchronize the progress bar
		var currentWidth = (currentTime / duration) * 100;// get the %
		progress.setProgress(currentWidth);
		
		//if the song is end
		if (currentTime >= duration) {
			$footerMusicNext.trigger('click');
		}
		
		//synchronize the lyric
		var index = LyricHandle.currentIndex(currentTime);
		//console.log(index);
		var $li = $('.song_lyric li');
		//highlight
		$li.eq(index).addClass('cur');
		$li.eq(index).siblings().removeClass('cur');
		
		if (index <= 2) return;
		$('.song_lyric').css({
			marginTop: (-index + 2) * 30
		})
	});
	
	//handle the volume
	$('.music_voice_icon').click(function() {
		var $i = $(this).find('i');
		
		if ($i.attr('class').indexOf('glyphicon-volume-up') != -1) {
			$i.removeClass('glyphicon-volume-up');
			$i.addClass('glyphicon-volume-off');
			
			player.setVolume(0);
		}
		else {
			$i.removeClass('glyphicon-volume-off');
			$i.addClass('glyphicon-volume-up');
			
			player.setVolume(1);
		}
	})
}

function createMusicItem(index, value) {
	var $item = $(`<li class="list_music">
					<div class="list_check"><i></i></div>
					<div class="list_number">${ index + 1 }</div>
					<div class="list_name">${ value.name }
						<div class="list_menu">
							<a href="javascript:;" title="Play" class="list_menu_play"><i class="glyphicon glyphicon-play"></i></a>
							<a href="javascript:;" title="Add" class="list_menu_add"><i class="glyphicon glyphicon-plus"></i></a>
							<a href="javascript:;" title="Download" class="list_menu_download"><i class="glyphicon glyphicon-download-alt"></i></a>
							<a href="javascript:;" title="Share" class="list_menu_share"><i class="glyphicon glyphicon-share"></i></a>
						</div>
					</div>
					<div class="list_singer">${ value.singer }</div>	
					<div class="list_time">
						<span>${ value.time }</span>
						<a href="javascript:;" title="Delete" class="list_menu_del"><i class="glyphicon glyphicon-trash"></i></a>
					</div>			
				  </li>`);
	//create new attrs
	$item.get(0).index = index + 1;
	$item.get(0).music = value;
	
	return $item;
}
