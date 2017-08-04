var dados_pessoais_url = '/representante_legal/';

function show_btn_forms(form_selector, btn_selector, event){
    $(form_selector).on(event, function () {
        $(btn_selector).fadeIn();
    });
}

function save_dados_pessoais(){
    var data_post = {};

    data_post.email = $('#email').val();
    data_post.password = $('#password').val();
    data_post.telefone = $('#telefone').val().replace(/[^a-z0-9]/gi,'');
    data_post.celular = $('#celular').val().replace(/[^a-z0-9]/gi,'');
    
    data_post.csrf_token = $('[name=csrfmiddlewaretoken]').val();
    data_post.form = 'dados_pessoais'

    clean_errors('dados_pessoais_form');

    ajax_request(data_post, null, 'POST',
        function(data, textStatus) {
            alert('Dados pessoais atualizados.');
            $('#dados_pessoais_save').fadeOut();
        },
        set_errors
    );
}

function save_dados_empresa(){
    var data_post = {};

    data_post.razao_social = $('#razao_social').val();
    data_post.nome_fantasia = $('#nome_fantasia').val();
    data_post.cnpj = $('#cnpj').val().replace(/[^a-z0-9]/gi,'');
    
    data_post.csrf_token = $('[name=csrfmiddlewaretoken]').val();
    data_post.form = 'dados_empresa'

    clean_errors('dados_empresa_form');

    ajax_request(data_post, null, 'POST',
        function(data, textStatus) {
            alert('Dados da empresa atualizados.');
            $('#empresa_form_btn').fadeOut();
        },
        set_errors
    );
}

function save_dados_conta_bancaria(){
    var data_post = {};

    data_post.banco = $('#banco').val();
    data_post.numero_agencia = $('#numero_agencia').val().replace(/[^a-z0-9]/gi,'');
    data_post.digito_agencia = $('#digito_agencia').val().replace(/[^a-z0-9]/gi,'');
    data_post.numero_conta = $('#numero_conta').val().replace(/[^a-z0-9]/gi,'');
    data_post.digito_conta = $('#digito_conta').val().replace(/[^a-z0-9]/gi,'');

    data_post.csrf_token = $('[name=csrfmiddlewaretoken]').val();
    data_post.form = 'conta_bancaria'

    clean_errors('conta_bancaria_form')

    ajax_request(data_post, null, 'POST',
        function(data, textStatus) {
            alert('Dados de conta bancária atualizados.');
            $('#conta_bancaria_btn').fadeOut();
        },
        set_errors
    );
}

document.addEventListener('DOMContentLoaded', function() {
    show_btn_forms('#dados_pessoais_form input', '#dados_pessoais_save', 'keydown');
    show_btn_forms('#dados_empresa_form input', '#empresa_form_btn', 'keydown');
    show_btn_forms('#conta_bancaria_form input', '#conta_bancaria_btn', 'keydown');
    show_btn_forms('#conta_bancaria_form select', '#conta_bancaria_btn', 'change');

    $('#dados_pessoais_save_btn').click(save_dados_pessoais);
    $('#empresa_form_save_btn').click(save_dados_empresa);
    $('#conta_bancaria_save_btn').click(save_dados_conta_bancaria);

}, false);