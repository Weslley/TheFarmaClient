

socket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    console.log(data);
    if(data.tipo === undefined){
        if (window.location.href.indexOf('sales') != -1){
            append_card_pedido(data, false, true);
            sendOnlineStatus(data);
        }else{

        }
    }else if (data.tipo == 1){
    	// Checkout
		checkout(data.pedido);

	}else if (data.tipo == 0){
		// Cancelamento
        cancel_notify(data.pedido)
		console.log('Proposta ' + data.pedido.id + ' foi cancelado !');
	}

}

// Send to API TheFarma when the client receive a proposal
function sendOnlineStatus(data) {
    console.info(data);
    farmaUrl = "http://api.thefarma.com/pedidos/" + data.id + "/views/";
    console.log(farmaUrl);
    // farmaUrl = 
    $.post(farmaUrl);
}

$(function(){
    init();

    $('.show-password').click(function(event) {
        $(this).parent().find('input').each(function(index, el) {
            if($(this).attr('type')==='password' || $(this).attr('type')==="password"){
                $(this).attr('type', 'text');
            }else if($(this).attr('type')==='text'){
                $(this).attr('type', 'password');
            }
        });
    });

});

function init(){
    $("[data-toggle='tooltip']").tooltip();
    $(".moeda").maskMoney({prefix:'R$ ', thousands:'.', decimal:',', allowZero: true, precision: 2});
    $(".percentual").maskMoney({thousands:'.', decimal:',', allowZero: true});

    $('.data').inputmask({mask: "99/99/9999"});
    $('.datetime').inputmask({mask: "99/99/9999 99:99"});
    $('.horario').inputmask({mask: "99:99"});
    $('.cpf').inputmask({mask: "999.999.999-99"});
    $('.cnpj').inputmask({mask: "99.999.999/9999-99"});
    $('.cep').inputmask({mask: "99999-999"});
    $('.placa').inputmask({mask: "aaa-9999"});
    $('.telefone').inputmask({mask: "(99)9999-9999"});
    $('.celular').inputmask({mask: "(99)9-9999-9999"});
    $('.numero').inputmask("Regex", {regex: "[0-9]+"  });

    function reposition() {
        var modal = $(this),
            dialog = modal.find('.modal-dialog');
        modal.css('display', 'block');
        dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
    }
    $('.modal').on('show.bs.modal', reposition);
    $(window).on('resize', function() {
        $('.modal:visible').each(reposition);
    });
}
