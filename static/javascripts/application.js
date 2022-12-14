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