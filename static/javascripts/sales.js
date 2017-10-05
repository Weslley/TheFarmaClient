

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


function append_card_pedido(data_content){
    var order_id = data_content['id'];
    var pedido_itens = data_content['itens_proposta'];

    var card = create_elem('div', 'card p15 mb20');
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
                if(data_content['troco'] && data_content['troco'] != null && data_content['troco'] != ''){
                    var span_troco = create_elem('span', 'troco');
                        span_troco.textContent = money(data_content['troco']);
                        row_infos.appendChild(span_troco);
                }
                if(data_content['forma_pagamento'] && data_content['forma_pagamento'] != null && data_content['forma_pagamento'] != ''){
                    var span_forma_pagamento = create_elem('span', 'forma-pagamento');
                        span_forma_pagamento.textContent = data_content['forma_pagamento'];
                        row_infos.appendChild(span_forma_pagamento);
                }
                if(data_content['delivery'] && data_content['delivery'] != null && data_content['delivery'] != ''){
                    var span_delivery = create_elem('span', 'frete');
                        span_delivery.textContent = data_content['delivery'] ? 'Sim' : 'Não';
                        row_infos.appendChild(span_delivery);
                }
                if(data_content['status'] !== null && data_content['status'] !== ''){
                    var span_status = document.createElement('span');
                    switch(data_content['status']){
                        case 0:
                            span_status.textContent = 'Aberto';
                            span_status.setAttribute('class', 'status-yellow');
                            break;
                        case 1:
                            span_status.textContent = 'Aceito';
                            span_status.setAttribute('class', 'status-green');
                            break;
                        case 2:
                            span_status.textContent = 'Aguardando envio da farmácia';
                            span_status.setAttribute('class', 'status-green');
                            break;
                        case 3:
                            span_status.textContent = 'Aguardando retirada do cliente';
                            span_status.setAttribute('class', 'status-green');
                            break;
                        case 4:
                            span_status.textContent = 'Enviado';
                            span_status.setAttribute('class', 'status-green');
                            break;
                        case 5:
                            span_status.textContent = 'Entregue';
                            span_status.setAttribute('class', 'status-green');
                            break;
                        case 6:
                            span_status.textContent = 'Cancelado pela farmácia';
                            span_status.setAttribute('class', 'status-red');
                            break;
                        case 7:
                            span_status.textContent = 'Cancelado pelo cliente';
                            span_status.setAttribute('class', 'status-red');
                            break;
                        case 8:
                            span_status.textContent = 'Sem proposta';
                            span_status.setAttribute('class', 'status-yellow');
                            break;
                        case 9:
                            span_status.textContent = 'Tempo excedido';
                            span_status.setAttribute('class', 'status-red');
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
                    var col_item_image_nome = create_elem('div', 'col-xs-12 col-sm-12 col-md-6');
                        var row_col_item_image_nome = create_elem('div', 'row');
                            var div_image = create_elem('div', 'col-xs-3 col-sm-4 col-md-3');
                                var item_image = create_elem('img', 'img-responsive center');
                                    item_image.setAttribute('src',
                                        pedido_itens[i]['imagem'] && pedido_itens[i]['apresentacao']['imagem'] != null ?
                                        pedido_itens[i]['imagem'] : '/static/images/box.png');
                                    item_image.setAttribute('alt', 'Bottle');
                                    item_image.setAttribute('alt', 'Box');
                                div_image.appendChild(item_image);
                            var div_nome_maker = create_elem('div', 'col-xs-9 col-sm-8 col-md-9 pr0');
                                var span_item_nome = create_elem('span', 'name');
                                    span_item_nome.textContent = pedido_itens[i]['apresentacao']['produto']['nome'] + ' ' + pedido_itens[i]['apresentacao']['nome'];
                                var span_item_maker = create_elem('span', 'maker');
                                    span_item_maker.textContent = pedido_itens[i]['apresentacao']['fabricante'];
                                div_nome_maker.appendChild(span_item_nome);
                                div_nome_maker.appendChild(span_item_maker);
                            row_col_item_image_nome.appendChild(div_image);
                            row_col_item_image_nome.appendChild(div_nome_maker);
                        col_item_image_nome.appendChild(row_col_item_image_nome);
                    var col_item_detalhes = create_elem('div', 'col-xs-12 col-sm-12 col-md-6');
                        var row_col_item_detalhe = create_elem('div', 'row vcenter');
                            var div_qtde = create_elem('div', 'col-xs-4 col-sm-4 col-md-4 text-center');
                                var item_qtde = create_elem('span', 'quantity');
                                    item_qtde.textContent = 'x'+pedido_itens[i]['quantidade'];
                                div_qtde.appendChild(item_qtde);
                            var div_preco = create_elem('div', 'price');
                                div_preco.textContent = money(pedido_itens[i].apresentacao.pmc.replace(',', '.'));
                            var div_proposta = create_elem('div', 'proposal');
                                var div_form_proposta = create_elem('div', 'proposal-form');
                                    var input_proposta = create_elem('input', 'form-control moeda');
                                        input_proposta.setAttribute('type', 'text');
                                        // $(input_proposta).on('keyup', update_total_pedido);
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
                console.log(pedido_itens[i]['quantidade']);
                console.log(pedido_itens[i].apresentacao.pmc);
                total += pedido_itens[i]['quantidade'] * parseFloat(pedido_itens[i].apresentacao.pmc.replace(',', '.')).toFixed(2);
            }
            console.log(total);
            var footer_list = create_elem('div', 'row footer-list');
                var footer_list_pull_right = create_elem('div', 'pull-right');
                    var footer_total = document.createElement('p');
                        footer_total.textContent = 'Total ';
                        var span_total = document.createElement('span');
                            span_total.setAttribute('id', 'total_'+order_id);
                            span_total.textContent = money(total);
                        footer_total.appendChild(span_total);
                    footer_list_pull_right.appendChild(footer_total);
                footer_list.appendChild(footer_list_pull_right);
            var footer_card = create_elem('div', 'footer-card');
                var col_cliente_footer_card = create_elem('div', 'col-footer-card');
                    var nome_cliente = create_elem('p', 'cliente');
                        nome_cliente.textContent = data_content['cliente'];
                    col_cliente_footer_card.appendChild(nome_cliente);
                var col_endereco_footer_card = create_elem('div', 'col-footer-card');
                    var endereco_cliente = create_elem('p', 'endereco block');
                        // var list_endereco = Object.keys(data_content['endereco']).map(
                            // function (key) { return data_content['endereco'][key];
                        // });
                        var list_endereco = [
                            data_content['logradouro'],
                            data_content['numero'],
                            data_content['bairro'],
                            data_content['cidade']
                        ];
                        var str_endereco = list_endereco.join(', ');
                        endereco_cliente.textContent = str_endereco;
                    col_endereco_footer_card.appendChild(endereco_cliente);
                footer_card.appendChild(col_cliente_footer_card);
                footer_card.appendChild(col_endereco_footer_card);
            var actions = create_elem('div', 'actions');
                var col_actions = create_elem('div', 'col-actions');
                    var btn_cancel = create_elem('button', 'btn-cancelar-actions');
                        btn_cancel.textContent = 'CANCELAR';
                    var btn_enviar = create_elem('button', 'btn-enviar-actions');
                        btn_enviar.textContent = 'ENVIAR PROPOSTA';
                    col_actions.appendChild(btn_cancel);
                    col_actions.appendChild(btn_enviar);
                actions.appendChild(col_actions);
            fluid.appendChild(footer_list);
            fluid.appendChild(footer_card);
            fluid.appendChild(actions);
        card.appendChild(fluid);

    card.style.display = 'none';
    if ($('.card.p15.mb20').length){
        $('.card.p15.mb20:first').before(card);
    }else{
        $('.container #sales').append(card);
    }

    startTimer(data_content['tempo'], $(timer_p));
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


document.addEventListener('DOMContentLoaded', function() {


    var fiveMinutes = 300;
    startTimer(fiveMinutes, $('#timer'));

    // $('.to-next').click(function(e){
        // e.preventDefault();
        // scroll_prev_next_elem(true, ".card.p15.mb20");
    // });

    // $('.to-prev').click(function(e){
        // e.preventDefault();
        // scroll_prev_next_elem(false, ".card.p15.mb20");
    // });

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 38:
                scroll_prev_next_elem(false, ".card.p15.mb20");
                break;
            case 40:
                scroll_prev_next_elem(true, ".card.p15.mb20");
                break;
        }
    };

}, false);
