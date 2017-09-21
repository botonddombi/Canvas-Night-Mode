function shade( p ){
	if(p){
		$('body').removeClass('lightmode');
		$('.nightmode').addClass('on');
	}
	else{
		$('body').addClass('lightmode');
	}
}

chrome.storage.sync.get(['nightmode', 'notifications', 'sound'], function( obj ){
	shade(obj.nightmode);
	if(obj.notifications){
		$('.notifications').addClass('on');
		$('.sound').show();
	}
	$('.notification-sound option[value="' + obj.sound + '"]').attr('selected', true);
});

$('.switch').click(function(){
	$(this).toggleClass('on');
});

$('.nightmode').click(function(){
	let nightmode = $(this).hasClass('on');
	chrome.storage.sync.set({'nightmode': nightmode});
	shade(nightmode);
});

$('.notifications').click(function(){
	let notif = $(this).hasClass('on');
	chrome.storage.sync.set({'notifications': notif});
	if(notif) $('.sound').show();
	else $('.sound').hide();
});

[
	'Default.mp3',
	'Wubba-lubba-dub-dub.mp3',
	'Omae-wa-mou-shindeiru.mp3',
	'My-name-is-Jeff.mp3',
	'Windows-XP.mp3'
].forEach(function(val){
	$('.notification-sound').append('<option value="' + val + '">' + val.split('.')[0] + '</option>');
});

var audio;
$('.notification-sound').change(function(){
	if(audio)audio.pause();
	audio = new Audio();
	audio.src = '../art/' + $(this).val();
	audio.play();
	chrome.storage.sync.set({'sound': $(this).val()});
});