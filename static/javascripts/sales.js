

$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};


function go_to_card(up_down){
    var cards = $(".card.p15.mb20");
        
    for (var i = 0; i < cards.length; i++) {
        
        if ($(cards[i]).isInViewport()){
            if(up_down){
                next = $(cards[i]).nextAll('.card.p15.mb20').first();
                if (cards.length == i+1) {
                    next = cards[0];
                }
            }else{
                next = $(cards[i]).prevAll('.card.p15.mb20').first();
                if (i==0) {
                    next = cards[cards.length-1];
                }
            }

            // var next = $(next).first();
            var top = $(next).offset().top;

            $('body').animate({
                scrollTop: top
            }, function() {
                // $next.addClass('current');
            });
            return;
        }
    }
}


function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var interval = setInterval(function () {
        
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (minutes == "00"){
            display[0].style.color = '#FF1967';
        }

        if (--timer < 0) {
            clearInterval(interval);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {

    
    var fiveMinutes = 65;
    startTimer(fiveMinutes, $('#timer'));

    $('.to-next').click(function(e){
        e.preventDefault();
        go_to_card(true);
    });

    $('.to-prev').click(function(e){
        e.preventDefault();
        go_to_card(false);
    });

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 38:
                go_to_card(false);
                break;
            case 40:
                go_to_card(true);
                break;
        }
    };

}, false);