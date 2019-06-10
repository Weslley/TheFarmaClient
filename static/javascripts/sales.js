var current_page = 1;
var num_pages = 1;

// socket.onopen = function() {
// socket.send("hello world");
// }


// if (socket.readyState == WebSocket.OPEN) socket.onopen();


$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};


$.fn.reverse = [].reverse;


function scroll_prev_next_elem(up_down, selector){
    $cards = up_down ? $(selector) : $(selector).reverse();
    $cards.each(function (i, elem){
        if ($(elem).isInViewport()){
            if(up_down){
                $next = $(elem).nextAll(selector).first();
            }else{
                $next = $(elem).prevAll(selector).first();
            }

            if($next.length){
                $('body').animate({
                    scrollTop: $next.offset().top
                });
            }
            return false;
        }
    });
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

            $card = $(display).closest('.card.p15.mb20');

            $card.attr('style', '');

            $card.animate(
                {right:'-500px', opacity: 0},
                {queue: false, duration: 500,
                    complete: function (){
                        $card.remove();
                    }
                });
        }
    }, 1000);
}

function create_elem(tag, classe){
    var elem = document.createElement(tag);
    elem.setAttribute('class', classe);

    return elem;
}


function money(value){
    return "R$ " + parseFloat(value).toFixed(2).replace('.', ',');
}


function from_money(value){
    return parseFloat(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
}


function append_card_pedido(data_content, append_after, active){
    // farm_wsckt
    var selected_pharmacy = data_content.farmacia;
    var order_id = data_content.id;
    var pedido_itens = data_content.itens_proposta;
    var editable = false;
    if(active){
        var _el = $('.active');
        _el.removeClass('active');
        var card = create_elem('div', 'card p15 mb20 active');
    }else{
        var card = create_elem('div', 'card p15 mb20');
    }
    card.setAttribute('order-id', order_id);
    var fluid = create_elem('div', 'container-fluid sale');
    var row_header = create_elem('div', 'row pt15 fz24');
    var col_order_header = create_elem('div', 'col-xs-12 col-sm-6 col-md-6 text-left');
    var order_p = create_elem('div', 'order-id');
    order_p.textContent = "Ordem #" + order_id;
    col_order_header.appendChild(order_p);
    var col_timer_header = create_elem('div', 'col-xs-12 col-sm-6 col-md-6 text-right');
    var timer_p = create_elem('p', 'semibold');
    timer_p.setAttribute('id', 'timer');
    col_timer_header.appendChild(timer_p);
    row_header.appendChild(col_order_header);
    row_header.appendChild(col_timer_header);
    var row_infos = create_elem('div', 'row pb25 fz18');
    if(data_content.troco && data_content.troco != null && data_content.troco != ''){
        var span_troco = create_elem('span', 'troco');
        span_troco.textContent = money(data_content.troco);
        row_infos.appendChild(span_troco);
    }
    if (data_content.status != 0){
        var span_forma_pagamento = create_elem('span', 'forma-pagamento');
        span_forma_pagamento.textContent = 'Cartão';
        if(data_content.forma_pagamento == 0){
            span_forma_pagamento.textContent = 'Cartão';
        }else{
            span_forma_pagamento.textContent = 'Dinheiro';
        }
        row_infos.appendChild(span_forma_pagamento);
    }

    if(data_content.delivery && data_content.delivery != null && data_content.delivery != ''){
        var span_delivery = create_elem('span', 'frete');
        span_delivery.textContent = data_content.delivery ? 'Sim' : 'Não';
        row_infos.appendChild(span_delivery);
    }
    if(data_content.status !== null && data_content.status !== ''){
        var span_status = document.createElement('span');
        span_status.setAttribute('order-status', data_content.status);
        switch(data_content.status){
            case 0:
                if(data_content.status_submissao == 2){
                    span_status.textContent = 'Cancelado pela farmácia';
                    span_status.setAttribute('class', 'status-red order-status');
                } else {
                    span_status.textContent = 'Aberto';
                    span_status.setAttribute('class', 'status-yellow order-status');
                    editable = true;
                }
                break;
            case 1:
                if (selected_pharmacy == farm_wsckt) {
                    span_status.textContent = 'Aceito' ;
                    span_status.setAttribute('class', 'status-green order-status');
                }else{
                    span_status.textContent = 'Negado' ;
                    span_status.setAttribute('class', 'status-red order-status');
                }
                break;
            case 2:
                if (selected_pharmacy == farm_wsckt) {
                    span_status.textContent = 'Aguardando envio da farmácia';
                    span_status.setAttribute('class', 'status-green order-status');
                }else{
                    span_status.textContent = 'Negado' ;
                    span_status.setAttribute('class', 'status-red order-status');
                }
                break;
            case 3:
                if (selected_pharmacy == farm_wsckt) {
                    span_status.textContent = 'Aguardando retirada do cliente';
                    span_status.setAttribute('class', 'status-green order-status');
                }else{
                    span_status.textContent = 'Negado' ;
                    span_status.setAttribute('class', 'status-red order-status');
                }
                break;
            case 4:
                if (selected_pharmacy == farm_wsckt) {
                    span_status.textContent = 'Enviado';
                    span_status.setAttribute('class', 'status-green order-status');
                }else{
                    span_status.textContent = 'Negado' ;
                    span_status.setAttribute('class', 'status-red order-status');
                }
                break;
            case 5:
                if (selected_pharmacy == farm_wsckt) {
                    span_status.textContent = 'Entregue';
                    span_status.setAttribute('class', 'status-green order-status');
                }else{
                    span_status.textContent = 'Negado' ;
                    span_status.setAttribute('class', 'status-red order-status');
                }
                break;
            case 6:
                if (selected_pharmacy == farm_wsckt) {
                    span_status.textContent = 'Cancelado pela farmácia';
                    span_status.setAttribute('class', 'status-red order-status');
                } else if(data_content.status_submissao == 2){
                    span_status.textContent = 'Cancelado pela farmácia';
                    span_status.setAttribute('class', 'status-red order-status');
                }else{
                    span_status.textContent = 'Negado' ;
                    span_status.setAttribute('class', 'status-red order-status');
                }
                break;
            case 7:
                span_status.textContent = 'Cancelado pelo cliente';
                span_status.setAttribute('class', 'status-red order-status');
                break;
            case 8:
                span_status.textContent = 'Sem proposta';
                span_status.setAttribute('class', 'status-yellow order-status');
                break;
            case 9:
                if (data_content.status_submissao == 0) {
                    span_status.textContent = 'Tempo excedido';
                    span_status.setAttribute('class', 'status-red order-status');
                } else if(data_content.status_submissao == 2){
                    span_status.textContent = 'Cancelado pela farmácia';
                    span_status.setAttribute('class', 'status-red order-status');
                } else {
                    span_status.textContent = 'Negado' ;
                    span_status.setAttribute('class', 'status-red order-status');
                }
                break;
        }
        row_infos.appendChild(span_status);
    }
    var header_tabela = create_elem('div', 'row header hidden-sm hidden-xs');
    var col_header_produto_nome = create_elem('div', 'col-xs-6 col-sm-6 col-md-6');
    var produto_nome_text = document.createElement('h5');
    produto_nome_text.textContent = 'Produto';
    col_header_produto_nome.appendChild(produto_nome_text);
    var col_header_produto_detalhes = create_elem('div', 'col-xs-6 col-sm-6 col-md-6');
    var row_col_header_produto_detalhes = create_elem('div', 'row');
    var col_header_produto_qtde = create_elem('div', 'quantidade');
    var produto_qtde_text = document.createElement('h5');
    produto_qtde_text.textContent = 'Qtde';
    col_header_produto_qtde.appendChild(produto_qtde_text);
    var col_header_produto_preco_sugerido = create_elem('div', 'preco-sugerido');
    var produto_preco_sugerido_text = document.createElement('h5');
    produto_preco_sugerido_text.textContent = 'Preço Sugerido';
    col_header_produto_preco_sugerido.appendChild(produto_preco_sugerido_text);
    var col_header_produto_minha_proposta = create_elem('div', 'minha-proposta');
    var produto_minha_proposta_text = document.createElement('h5');
    produto_minha_proposta_text.textContent = 'Minha Proposta';
    col_header_produto_minha_proposta.appendChild(produto_minha_proposta_text);
    row_col_header_produto_detalhes.appendChild(col_header_produto_qtde);
    row_col_header_produto_detalhes.appendChild(col_header_produto_preco_sugerido);
    row_col_header_produto_detalhes.appendChild(col_header_produto_minha_proposta);
    col_header_produto_detalhes.appendChild(row_col_header_produto_detalhes);
    header_tabela.appendChild(col_header_produto_nome);
    header_tabela.appendChild(col_header_produto_detalhes);
    fluid.appendChild(row_header);
    fluid.appendChild(row_infos);
    fluid.appendChild(header_tabela);
    var total = 0;
    for (var i = pedido_itens.length - 1; i >= 0; i--) {
        var row_item = create_elem('div', 'row item');
        var id_item = pedido_itens[i].id;
        var quantidade_max = pedido_itens[i].quantidade;
        row_item.setAttribute('item-id', id_item);
        row_item.setAttribute('item-quantity', quantidade_max);
        var col_item_image_nome = create_elem('div', 'col-xs-12 col-sm-12 col-md-6');
        var row_col_item_image_nome = create_elem('div', 'row');
        var div_image = create_elem('div', 'col-xs-3 col-sm-4 col-md-3');
        var item_image = create_elem('img', 'img-responsive center');
        item_image.setAttribute('src',
            pedido_itens[i].apresentacao.imagem.square_crop && pedido_itens[i].apresentacao.imagem != null ?
                pedido_itens[i].apresentacao.imagem.square_crop : '/static/images/box.png');
        item_image.setAttribute('alt', 'Bottle');
        item_image.setAttribute('alt', 'Box');
        div_image.appendChild(item_image);
        var div_nome_maker = create_elem('div', 'col-xs-9 col-sm-8 col-md-9 pr0');
        var span_item_nome = create_elem('span', 'name');
        span_item_nome.textContent = pedido_itens[i].apresentacao.produto.nome + ' ' + pedido_itens[i].apresentacao.nome;
        var span_item_maker = create_elem('span', 'maker');
        span_item_maker.textContent = pedido_itens[i].apresentacao.produto.fabricante;
        div_nome_maker.appendChild(span_item_nome);
        div_nome_maker.appendChild(span_item_maker);
        row_col_item_image_nome.appendChild(div_image);
        row_col_item_image_nome.appendChild(div_nome_maker);
        col_item_image_nome.appendChild(row_col_item_image_nome);
        var col_item_detalhes = create_elem('div', 'col-xs-12 col-sm-12 col-md-6');
        var row_col_item_detalhe = create_elem('div', 'row vcenter');
        var div_qtde = create_elem('div', 'col-xs-4 col-sm-4 col-md-4 text-center proposal');
        var div_form_quantidade_proposta = create_elem('div', 'proposal-form qty-box');
        var span_quant_dec = create_elem('span', 'dec');
        span_quant_dec.textContent = '-';
        var span_quant_inc = create_elem('span', 'dec');
        span_quant_inc.textContent = '+';
        var input_item_qtde = create_elem('input', 'form-control quantity');
        input_item_qtde.setAttribute('type', 'number');
        input_item_qtde.value = pedido_itens[i].quantidade;
        span_quant_dec.onclick = (function (_item_id) {
            var _order_id = order_id;
            var _editavel = editable;
            return function() {
                quant_dec(_order_id, _item_id, _editavel);
            }
        }(id_item));
        span_quant_inc.onclick = (function (_item_id, _max) {
            var _order_id = order_id;
            var _editavel = editable;
            return function() {
                quant_inc(_order_id, _item_id, _max, _editavel);
            }
        }(id_item, quantidade_max));
        div_form_quantidade_proposta.appendChild(span_quant_dec);
        div_form_quantidade_proposta.appendChild(input_item_qtde);
        div_form_quantidade_proposta.appendChild(span_quant_inc);
        div_qtde.appendChild(div_form_quantidade_proposta);
        var div_preco = create_elem('div', 'price');
        div_preco.textContent = money(pedido_itens[i].apresentacao.pmc.replace(',', '.'));
        var div_proposta = create_elem('div', 'proposal');
        var div_form_proposta = create_elem('div', 'proposal-form');
        var input_proposta = create_elem('input', 'form-control moeda');
        input_proposta.setAttribute('type', 'text');
        if (data_content.status != 0){
            input_proposta.value = money(pedido_itens[i].valor_unitario.replace(',', '.'));
        } else{
            input_proposta.value = money(pedido_itens[i].apresentacao.pmc.replace(',', '.'));
        }
        input_item_qtde.onkeyup = (function() {
            var _order_id = order_id;
            return function() {
                update_proposal_total(_order_id);
            }
        })();
        input_proposta.onkeyup = (function() {
            var _order_id = order_id;
            return function() {
                update_proposal_total(_order_id);
            }
        })();
        if(data_content.status != 0){
            input_proposta.setAttribute('disabled', true);
        }
        input_item_qtde.setAttribute('disabled', true);
        // $(input_proposta).on('keyup', update_total_pedido);w
        var span_focused = create_elem('span', 'pmd-textfield-focused');
        div_form_proposta.appendChild(input_proposta);
        div_form_proposta.appendChild(span_focused);
        div_proposta.appendChild(div_form_proposta);
        row_col_item_detalhe.appendChild(div_qtde);
        row_col_item_detalhe.appendChild(div_preco);
        row_col_item_detalhe.appendChild(div_proposta);
        col_item_detalhes.appendChild(row_col_item_detalhe);
        row_item.appendChild(col_item_image_nome);
        row_item.appendChild(col_item_detalhes);
        fluid.appendChild(row_item);
        if (data_content.status != 0){
            total += pedido_itens[i].quantidade * parseFloat(pedido_itens[i].valor_unitario.replace(',', '.')).toFixed(2);
        }else{
            total += pedido_itens[i].quantidade * parseFloat(pedido_itens[i].apresentacao.pmc.replace(',', '.')).toFixed(2);
        }

    }
    var footer_list = create_elem('div', 'row footer-list');
    var footer_list_pull_right = create_elem('div', 'pull-right');

    if (data_content.delivery == true) {
        // Subtotal
        var footer_subtotal = document.createElement('p');
        footer_subtotal.setAttribute('class', 'text-gray');
        footer_subtotal.textContent = 'Subtotal ';
        var span_subtotal = document.createElement('span');
        span_subtotal.setAttribute('class', 'text-gray card-values');
        span_subtotal.setAttribute('id', 'subtotal_'+order_id);
        span_subtotal.textContent = money(total);
        footer_subtotal.appendChild(span_subtotal);

        // Frete
        var footer_delivery = document.createElement('p');
        footer_delivery.setAttribute('class', 'text-gray');
        footer_delivery.textContent = 'Frete ';
        var span_delivery = document.createElement('span');
        span_delivery.setAttribute('id', 'frete_'+order_id);
        span_delivery.setAttribute('class', 'text-gray card-values');
        span_delivery.textContent = money(farmaciaFrete);
        footer_delivery.appendChild(span_delivery);

        // Total
        var footer_total = document.createElement('p');
        footer_total.textContent = 'Total ';
        var span_total = document.createElement('span');
        span_total.setAttribute('id', 'total_'+order_id);
        span_total.setAttribute('class', 'card-values');
        totalComFrete = parseFloat(total + parseFloat(farmaciaFrete)).toFixed(2)
        span_total.textContent = money(totalComFrete);
        footer_total.appendChild(span_total);

        // Add elemento a pagina em ordem
        footer_list_pull_right.appendChild(footer_subtotal);
        footer_list_pull_right.appendChild(footer_delivery);
        footer_list_pull_right.appendChild(footer_total);
    } else {
        // Total
        var footer_total = document.createElement('p');
        footer_total.textContent = 'Total ';
        var span_total = document.createElement('span');
        span_total.setAttribute('id', 'total_'+order_id);
        span_total.setAttribute('class', 'card-values');
        span_total.textContent = money(total);
        footer_total.appendChild(span_total);

        // Add elemento a pagina
        footer_list_pull_right.appendChild(footer_total);
    }

    footer_list.appendChild(footer_list_pull_right);
    var footer_card = create_elem('div', 'footer-card');
    var col_cliente_footer_card = create_elem('div', 'col-footer-card');
    var nome_cliente = create_elem('p', 'cliente');
    nome_cliente.textContent = data_content.cliente;
    col_cliente_footer_card.appendChild(nome_cliente);
    var col_endereco_footer_card = create_elem('div', 'col-footer-card');
    var endereco_cliente = create_elem('p', 'endereco block');
    // var list_endereco = Object.keys(data_content['endereco']).map(
    // function (key) { return data_content['endereco'][key];
    // });
    var list_endereco = [
        data_content.logradouro,
        data_content.numero,
        data_content.bairro,
        data_content.cidade
    ];
    var str_endereco = list_endereco.join(', ');
    endereco_cliente.textContent = str_endereco;
    col_endereco_footer_card.appendChild(endereco_cliente);
    footer_card.appendChild(col_cliente_footer_card);
    if(data_content.delivery){
        footer_card.appendChild(col_endereco_footer_card);
    }
    var actions = create_elem('div', 'actions');
    var col_actions = create_elem('div', 'col-actions');
    var btn_cancel = create_elem('button', 'btn-cancelar-actions');
    var btn_send = create_elem('button', 'btn-enviar-actions');
    var btn_confirm = create_elem('button', 'btn-confirmar-actions');
    if (data_content.status == 2){
        var btn_imprimir_comanda = create_elem('button', 'btn-imprimir-comanda');
        btn_imprimir_comanda.textContent = 'Imprimir comanda';
        col_actions.appendChild(btn_imprimir_comanda);
        //on click funcao
        btn_confirm.onclick = (function() {
            var _order_id = order_id;
            show_comanda(order_id);
        })();
    }
    btn_confirm.textContent = 'CONFIRMAR ' + ((data_content.delivery && data_content.status == 2) ? 'O ENVIO' : 'A ENTREGA');
    btn_cancel.textContent = 'CANCELAR';
    btn_send.textContent = 'ENVIAR PROPOSTA';
    switch (data_content.status){
        case 0:
            if(data_content.status_submissao == 2){
                btn_send.className += ' hidden';
                btn_cancel.className += ' hidden';
                btn_confirm.className += ' hidden';
            } else {
                btn_confirm.className += ' hidden';
            }
            //Notifica
            TheFarma.playSound();
            TheFarma.notificar();
            break;
        case 1:
        case 2:
        case 3:
        case 4:
            if (selected_pharmacy == farm_wsckt) {
                btn_send.className += ' hidden';
                btn_cancel.className += ' hidden';
            }else{
                btn_send.className += ' hidden';
                btn_cancel.className += ' hidden';
                btn_confirm.className += ' hidden';
            }
            break;
        default:
            btn_send.className += ' hidden';
            btn_cancel.className += ' hidden';
            btn_confirm.className += ' hidden';
            break;
    }
    btn_send.onclick = (function() {
        var _order_id = order_id;
        return function() {
            send_proposal(_order_id);
        }
    })();
    btn_cancel.onclick = (function() {
        var _order_id = order_id;
        return function() {
            cancel_proposal(_order_id);
        }
    })();
    btn_confirm.onclick = (function() {
        var _order_id = order_id;
        var _status = data_content.status;
        var _delivery = data_content.delivery;
        if (_status == 2){
            return function() {
                confirm_order_dispatch(_order_id, _delivery);
            }
        }else{
            return function() {
                confirm_order_delivery(_order_id);
            }
        }
    })();
    col_actions.appendChild(btn_cancel);
    col_actions.appendChild(btn_send);
    col_actions.appendChild(btn_confirm);
    actions.appendChild(col_actions);
    fluid.appendChild(footer_list);
    fluid.appendChild(footer_card);
    fluid.appendChild(actions);
    card.appendChild(fluid);

    card.style.display = 'none';
    if ($('.card.p15.mb20').length){
        if(append_after){
            $('.container #sales .row').append(card);
        }else{
            $('.card.p15.mb20:first').before(card);
        }
    }else{
        $('.container #sales .row').append(card);
    }

    if(data_content.status == 0 && data_content.tempo != 0 && data_content.status_submissao != 2){
        startTimer(data_content.tempo, $(timer_p));
    }else{
        timer_p.remove();
    }

    $(card).show({
        start: function (){
            $(card).animate(
                // {height: 0, opacity: 0},
                {left:'-1500px'},
                {queue: false, duration: 0}
            );
        }
    });
    $(card).animate({ left: "0px" }, 500);
    $(".moeda").maskMoney({prefix:'R$ ', thousands:'.', decimal:',', allowZero: true, precision: 2});
}


function update_total_pedido_before(event){

}


function update_total_pedido_after(event){
    var $input = $(event.target);
    var proposta = from_money($input.val());
    var quantidade = $input.closest('.row.vcenter').find('.quantity').text();
    quantidade = parseInt(quantidade.replace('x', ''));
    var pmc = $input.closest('.row.vcenter').find('.price').text();
    pmc = from_money(pmc);
    var total_span = $input.closest('.card.p15.mb20').find('[id^=total_]');
    total = from_money(total_span.text());

    total -= pmc*quantidade;
    total += proposta*quantidade;
}

function reload_sales(status, order, page) {
    if(status === -1){
        var _url = '/admin/sales?order=' + order + '&page=' + page;
    } else {
        var _url = '/admin/sales?status='+ status +'&order=' + order + '&page=' + page;
    }
    $.ajax({
        url: _url,
        type: "GET",
        success: function(data) {
            num_pages = data.num_pages;
            data = data.results;
            $('.card.p15.mb20').remove();
            for(i = data.length - 1; i >= 0; i--){
                append_card_pedido(data[i], false, (i == 0));
            }
        },
        error: function(data) {
            alert('Erro ao carregar propostas !');
            console.log(data);
        }
    });
}

function append_sales(status, order, page) {
    if(status === -1){
        var _url = '/admin/sales?order=' + order + '&page=' + page;
    } else {
        var _url = '/admin/sales?status='+ status +'&order=' + order + '&page=' + page;
    }
    $.ajax({
        url: _url,
        type: "GET",
        success: function(data) {
            num_pages = data.num_pages;
            data = data.results;
            for(i = 0; i < data.length; i++){
                append_card_pedido(data[i], true, false);
            }
        },
        error: function(data) {
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {


    // var fiveMinutes = 300;
    // startTimer(fiveMinutes, $('#timer'));

    // $('.to-next').click(function(e){
    // e.preventDefault();
    // scroll_prev_next_elem(true, ".card.p15.mb20");
    // });

    // $('.to-prev').click(function(e){
    // e.preventDefault();
    // scroll_prev_next_elem(false, ".card.p15.mb20");
    // });




    $('#filter_proposal').change(function (e) {
        var status = $(this).val();
        var order = $('#order_proposal').val();
        current_page = 1;
        reload_sales(status, order, current_page);
    });

    $('#order_proposal').change(function (e) {
        var status = $('#filter_proposal').val();
        var order = $(this).val();
        current_page = 1;
        reload_sales(status, order, current_page);
    });


    $('.to-next').click(function(){
        var el = $('.card.p15.mb20.active');
        if (el.next().length > 0){
            el.next().addClass('active');
            el.removeClass('active');
            $('html,body').animate({scrollTop:$('.active').offset().top - 50});
        }
    });

    $('.to-prev').click(function(){
        var el = $('.card.p15.mb20.active');
        if (el.prev().length > 0 ){
            el.prev().addClass('active');
            el.removeClass('active');
            $('html,body').animate({scrollTop:$('.active').offset().top - 222});
        }
    });

}, false);

$(document).ready(function() {
    // var win = $(window);

    window.onscroll = function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) return;
        if (current_page < num_pages){
            current_page += 1;
            var status = $('#filter_proposal').val();
            var order = $('#order_proposal').val();
            append_sales(status, order, current_page)
        }
    };
    // win.scroll(function() {
    //     if (current_page == num_pages){
    //         return;
    //     }
    //     if ($(document).height() - win.height() == win.scrollTop()) {
    //         current_page += 1;
    //         var status = $('#filter_proposal').val();
    //         var order = $('#order_proposal').val();
    //         append_sales(status, order, current_page)
    //     }
    // });
});

function getDocumentHeight() {
	const body = document.body;
	const html = document.documentElement;

	return Math.max(
		body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight
	);
};

function getScrollTop() {
	return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}


function get_total_proposal(id_pedido) {
    var total = 0;
    var itens = [];
    $('.card.p15.mb20[order-id=' + id_pedido + ']').find('.row.item').each(function( index, element ) {
        var quantity = parseInt($(element).find('.form-control.quantity').first().val().replace(',', '.'));
        if(quantity == undefined || quantity == NaN){
            quantity = 0;
        }
        var value = parseFloat($(element).find('.form-control.moeda').first().val().replace('R$ ', '').replace(',', '.'));
        total += quantity * value;
        var max_quantity = $(element).attr('item-quantity');
        itens.push(JSON.parse('{"id": ' + $(element).attr('item-id') + ', "quantidade": ' + quantity + ', "max_quantidade": '+ max_quantity + ', "valor": ' + value + '}'))
    });
    var proposal = JSON.parse('{}');
    proposal.total = total;
    proposal.itens = itens;
    return proposal;
}

function update_proposal_total(id_pedido) {
    $('#total_' + id_pedido).text(money(get_total_proposal(id_pedido).total));
}

function send_proposal(id_pedido) {
    var _data = get_total_proposal(id_pedido);
    if (!validate_itens(_data)){
        return 0;
    }
    var data_post = {'id': id_pedido, 'pedido': _data['id'], 'itens': JSON.stringify(_data['itens'])};
    data_post.csrf_token = $('[name=csrfmiddlewaretoken]').val();
    $.ajax({
        url: '/admin/proposal/send',
        type: "POST",
        data: data_post,
        headers: {
            "X-CSRFToken": data_post.csrf_token
        },
        success: function(data) {
            console.log(data);
            $card = $('.card.p15.mb20[order-id=' + id_pedido + ']').first();

            $card.attr('style', '');

            $card.animate(
                {right:'-500px', opacity: 0},
                {
                    queue: false,
                    duration: 500,
                    complete: function (){
                        $card.remove();
                    }
                }
            );
        },
        error: function(data) {
            alert('Erro ao enviar proposta !');
            console.log(data);
        }
    });
}

function confirm_order_dispatch(id_pedido, delivery) {
    $.ajax({
        url: '/admin/proposal/' + id_pedido + '/confirm_dispatch',
        type: "POST",
        data: {
            'csrf_token': $('[name=csrfmiddlewaretoken]').val()
        },
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
        },
        success: function(data) {
            console.log(data);
            var card = $('.card.p15.mb20[order-id=' + id_pedido + ']').first();
            if (data.status == 4){
                var button = $(card).find('button.btn-confirmar-actions').first();
                $(card).find('span.order-status').text('Enviado');
                $(button).text('CONFIRMAR A ENTREGA');
            } else {
                $(card).find('button').remove();
                $(card).find('span.order-status').text('Entregue');
            }
        },
        error: function(data) {
            alert('Erro ao confirmar envio !');
            console.log(data);
        }
    });
}

function confirm_order_delivery(id_pedido) {
    $.ajax({
        url: '/admin/proposal/' + id_pedido + '/confirm_delivery',
        type: "POST",
        data: {
            'csrf_token': $('[name=csrfmiddlewaretoken]').val()
        },
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
        },
        success: function(data) {
            console.log(data);
            var card = $('.card.p15.mb20[order-id=' + id_pedido + ']').first();
            $(card).find('button').remove();
            $(card).find('span.order-status').text('Entregue');
        },
        error: function(data) {
            alert('Erro ao confirmar entrega !');
            console.log(data);
        }
    });
}

function cancel_proposal(id_pedido) {
    $.ajax({
        url: '/admin/proposal/' + id_pedido + '/cancel',
        type: "POST",
        data: {
            'csrf_token': $('[name=csrfmiddlewaretoken]').val()
        },
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
        },
        success: function(data) {
            console.log(data);
            $card = $('.card.p15.mb20[order-id=' + id_pedido + ']').first();

            $card.attr('style', '');

            $card.animate(
                {right:'-500px', opacity: 0},
                {
                    queue: false,
                    duration: 500,
                    complete: function (){
                        $card.remove();
                    }
                }
            );
        },
        error: function(data) {
            alert('Erro ao cancelar proposta !');
            console.log(data);
        }
    });
}

function checkout(data) {
    if (window.location.href.indexOf('sales') != -1){
        append_card_pedido(data, false, true);
    }else{

    }
}

function cancel_notify(data){
    var order_id = data.id;
    var card = $('.card.p15.mb20[order-id=' + order_id + ']');
    $(card).find('span.order-status').text('Cancelado pelo cliente');
    if($(card).find('span.order-status').hasClass('status-green')){
        $(card).find('span.order-status').removeClass('status-green');
        $(card).find('span.order-status').addClass('status-red');
    }else if($(card).find('span.order-status').hasClass('status-yellow')){
        $(card).find('span.order-status').removeClass('status-yellow');
        $(card).find('span.order-status').addClass('status-red');
    }
    $(card).find('input').attr('disabled', true);
    $(card).find('button').addClass('hidden');
    $(card).find('#timer').remove();
}

function clean_itens(data) {
    for (i = 0; i < data.itens.length; i++){
        var item_id = data.itens[i]['id'];
        $('.row.item[item-id=' + item_id + '] .proposal-form').removeClass('has-error');
        $('.row.item[item-id=' + item_id + '] .proposal-form span.help-block').remove();
    }
}

function validate_itens(data) {
    clean_itens(data);
    for (i = 0; i < data.itens.length; i++){
        var valor = data.itens[i]['valor'];
        var item_id = data.itens[i]['id'];
        var quantidade = data.itens[i]['quantidade'];
        var max_quantidade = data.itens[i]['max_quantidade'];

        if(quantidade < 0){
            var parent = $('.row.item[item-id=' + item_id + '] .proposal-form .quantity').parent();
            $(parent).addClass('has-error');
            $(parent).append('<span class="help-block">Não pode menor que 0.</span>');
            return false;
        }

        if(quantidade > max_quantidade){
            var parent = $('.row.item[item-id=' + item_id + '] .proposal-form .quantity').parent();
            $(parent).addClass('has-error');
            $(parent).append('<span class="help-block">Não pode ser maior que '+ max_quantidade +'.</span>');
            return false;
        }

        if(valor <= 0){
            var parent = $('.row.item[item-id=' + item_id + '] .proposal-form .moeda').parent();
            $(parent).addClass('has-error');
            $(parent).append('<span class="help-block">Não pode ser 0.</span>');
            return false;
        }
    }
    return true;
}

function quant_dec(id_pedido, id_item, editavel) {
    if(editavel){
        $('.card.p15.mb20[order-id=' + id_pedido + ']').find('.row.item').each(function( index, element ) {
            if($(element).attr('item-id') == id_item){
                var quantity = parseInt($(element).find('.form-control.quantity').first().val().replace(',', '.'));
                if(quantity == undefined || quantity == NaN){
                    quantity = 0;
                }
                if (quantity <= 0){
                    quantity = 0
                } else{
                    quantity -= 1;
                }
                $(element).find('.form-control.quantity').first().val(quantity)
            }
        });
    }
    update_proposal_total(id_pedido);
}

function quant_inc(id_pedido, id_item, valor_max, editavel) {
    if(editavel) {
        $('.card.p15.mb20[order-id=' + id_pedido + ']').find('.row.item').each(function( index, element ) {
            if($(element).attr('item-id') == id_item){
                var quantity = parseInt($(element).find('.form-control.quantity').first().val().replace(',', '.'));
                if(quantity == undefined || quantity == NaN){
                    quantity = 0;
                }
                if (quantity >= valor_max){
                    quantity = valor_max
                } else{
                    quantity += 1;
                }
                $(element).find('.form-control.quantity').first().val(quantity)
            }
        });
    }
    update_proposal_total(id_pedido);
}

function show_comanda(id){
    console.log(id);
}