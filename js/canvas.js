var Canvas = (function(){
	var nightMode;

	var get = {
		nightmode : function(){
			chrome.storage.sync.get(['nightmode'], function( obj ){
				var link1 = document.createElement("link");
				link1.href = chrome.extension.getURL('css/always.css');
				link1.rel = "stylesheet";
				link1.type = "text/css";
				document.getElementsByTagName('head')[0].appendChild(link1);

				nightMode = obj.nightmode;

				if(nightMode){
					var link2 = document.createElement("link");
					link2.href = chrome.extension.getURL('css/canvas.css');
					link2.rel = "stylesheet";
					link2.type = "text/css";
					document.getElementsByTagName('head')[0].appendChild(link2);
				}
			});
		}	
	};

	var changeIn = {
		nightmode : function(changes){
			var storageChange = changes[key];
			var changeAlert = $('#changealert');
			
			if(storageChange.newValue != nightMode){

				if(changeAlert.length){
					changeAlert.remove();
				}

				$('body').append('<div id="changealert"><div id="changealert-close-wrapper"><div id="changealert-close"></div></div>The night mode option has been changed.<br>Please refresh the page so changes can be made.</div>');
				
				changeAlert = $('#changealert');

				changeAlert.hide().fadeIn(300);
				$('#changealert-close').click(function(){
					changeAlert.fadeOut(300, function(){
						$(this).remove();
					});
				});
			}
			else{
				changeAlert.fadeOut(300, function(){
					$(this).remove();
				});
			}
		}
	};

	var bindStorageChange = function(){
		chrome.storage.onChanged.addListener(function(changes, namespace){
			for (key in changes) {
				changeIn[key](changes);
			}
		});
	}

	var onPageStart = function(){
		get.nightmode();
		bindStorageChange();
	}

	var onPageLoaded = function(){
		$(function(){
			if(nightMode){
				var href = location.href.replace("https://canvas.cs.ubbcluj.ro/", "");
				if(!href || href == "#"){
					//Assignment nice slide
				}

				if(href == "grades"){
					//Grades additions
				}

				if($('.stream_header').length){
					$('.stream_header').click(function(){
						var container = $(this).next();
						if($(this).attr('aria-expanded') == "true"){
							container[0].style.setProperty('height', '0px', 'important');
						}
						else{
							var newHeight = container.children().height();
							container[0].style.setProperty('height', newHeight + 'px', 'important');
						}
					});

					var keyTime = 0;
					$('.stream_header').on('mousedown', function(){
						keyTime = setTimeout(function(){
							$('.stream_header:active + .details_container .close').click();
						}, 900);
					});
					$('.stream_header').on('mouseup', function(){
						clearTimeout(keyTime);
					});
				}

				//Menu additions
				$('#courses_menu_item, #courses_menu_item .menu-item-drop').on('mouseenter', function(){
					var itemDrop = $('#courses_menu_item').find('.menu-item-drop');
					var newHeight = itemDrop.find('table').height();
					itemDrop[0].style.setProperty('height', newHeight + 'px', 'important');
				});
				$('#courses_menu_item, #courses_menu_item .menu-item-drop').on('mouseout', function(){
					if(!$('#courses_menu_item:hover, #courses_menu_item .menu-item-drop:hover').length){
						var itemDrop = $('#courses_menu_item').find('.menu-item-drop');
						itemDrop[0].style.setProperty('height', '0px', 'important');
					}
				});

				var video = document.createElement('video');
				video.src = chrome.extension.getURL('art/lg.mp4');
				video.load();

				video.addEventListener('loadeddata', function() {
					$('#header-logo-secondary').fadeOut(300, function(){
						$('#header-logo-secondary').replaceWith('<div id="newlogo"><video id="vid" src="' + chrome.extension.getURL('art/lg.mp4') + '" muted autoplay loop></video><div>');
						$('#newlogo').hide().fadeIn();
					})
				});

			}

		});
	}

	return {
		init: onPageStart,
		loaded: onPageLoaded
	}
})();

Canvas.init();
Canvas.loaded();