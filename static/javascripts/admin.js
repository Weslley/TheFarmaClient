function connect(){
  socket = new WebSocket(url_socket);

  socket.onopen = function(event){
    console.log('Conectado :)');
  }

  socket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    console.log("OnMessage: =>", data);
    switch (data.tipo) {
      case 0: // Pedido Cancelado
        cancel_notify(data.pedido)
        console.log('Proposta ' + data.pedido.id + ' foi cancelado !');
        break;
      case 1: // Checkout
        checkout(data.pedido);
        break;  
      case 2: //Remove o pedido da tela pq ja foi respondido;
        console.log(data);
        remove_card(data.pedido.id);
        break;
      default: //Novo Pedido
        if(data.tipo == undefined){
          if (window.location.href.indexOf('sales') != -1) {
            append_card_pedido(data, false, true);
            sendOnlineStatus(data);
            //Notifica
            //TheFarma.playSound();
            TheFarma.notificar();
          } else {
            customAlert(`#${data.id}`);
            //TheFarma.playSound();
            TheFarma.notificar();
          }
        }
        break;
    }
  }

  socket.onerror = function(event){
    console.log(event);
  }

  socket.onclose = function(event) {
    console.log('socket fechado :(');
    console.log('Reiniciando conexao...');
    setTimeout(connect,1000);
  }
}

connect();

function customAlert(title="", body="Novo pedido encontrado."){
  $('.alert .title').html(`${title}`);
  $('.alert .body').html(`${body}`);
  $(".alert").show('slide');
  $(".alert").delay(5000).fadeOut(400, function() {});
}
// Send to API TheFarma when the client receive a proposal
function sendOnlineStatus(data) {
  farmaUrl = "https://api.thefarma.com.br/pedidos/" + data.id + "/views/";
  $.post(farmaUrl);
}

function update_bagde_value(value){
  let bagdePrevEle = $('#filter_proposal').next().find('.selection').children('.select2-selection');
  if (bagdePrevEle.find('.bagde-select').length > 0){
      //se ele ja ta na pagina eh so atualizar o valor
      //recupera o valor atual
      let total = parseInt(bagdePrevEle.find('.bagde-select').text());
      total += value;
      bagdePrevEle.find('.bagde-select').text(total);
  } else {
      //add o elemento
      bagdePrevEle.append(
          $('<span></span>')
              .text(0)
              .addClass('bagde-select')
      );
  }
  
}

$(function () {
  init();

  $('.show-password').click(function (event) {
    $(this).parent().find('input').each(function (index, el) {
      if ($(this).attr('type') === 'password' || $(this).attr('type') === "password") {
        $(this).attr('type', 'text');
      } else if ($(this).attr('type') === 'text') {
        $(this).attr('type', 'password');
      }
    });
  });

  if (window.webkitNotifications) {
    console.log('Seu browser possui suporte ao Notifications');
  } else {
    console.log('Seu browser n??o possui suporte ao Notifications');
  }

});

function init() {
  $("[data-toggle='tooltip']").tooltip();
  $(".moeda").maskMoney({ prefix: 'R$ ', thousands: '.', decimal: ',', allowZero: true, precision: 2 });
  $(".percentual").maskMoney({ thousands: '.', decimal: ',', allowZero: true });

  $('.data').inputmask({ mask: "99/99/9999" });
  $('.datetime').inputmask({ mask: "99/99/9999 99:99" });
  $('.horario').inputmask({ mask: "99:99" });
  $('.cpf').inputmask({ mask: "999.999.999-99" });
  $('.cnpj').inputmask({ mask: "99.999.999/9999-99" });
  $('.cep').inputmask({ mask: "99999-999" });
  $('.placa').inputmask({ mask: "aaa-9999" });
  $('.telefone').inputmask({ mask: "(99)9999-9999" });
  $('.celular').inputmask({ mask: "(99)9-9999-9999" });
  $('.numero').inputmask("Regex", { regex: "[0-9]+" });

  function reposition() {
    var modal = $(this),
      dialog = modal.find('.modal-dialog');
    modal.css('display', 'block');
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
  }
  $('.modal').on('show.bs.modal', reposition);
  $(window).on('resize', function () {
    $('.modal:visible').each(reposition);
  });
}

