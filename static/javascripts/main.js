
function ajax_request(data_req, url, type, success_func, error_func){

    for (var key in data_req){
        if (!(data_req[key] && data_req[key] != null && data_req[key] != '')){
            delete data_req[key];
        }
    }

    var ajax_data = {
        type : "POST",
        data : data_req,
        success: success_func,
        error: error_func
    }

    if (url && url != null && url != ''){
        ajax_data.url = url;
    }

    if (data_req.csrf_token){
        ajax_data.headers = {
            "X-CSRFToken": data_req.csrf_token
        }
    }

    $.ajax(ajax_data);
}

function set_errors(data){
    if ('responseJSON' in data){
        data = data['responseJSON']
    }

    for (var key in data){

        if(typeof data[key] == "object" && !Array.isArray(data[key])){
            set_errors(data[key]);
            continue;
        }

        var input = $('#'+key)[0];
        
        var input_parent = input.parentElement;
        var span_error = document.createElement('span')
            span_error.setAttribute('class', 'help-block');
            span_error.textContent = data[key][0];

        $(input_parent).addClass('has-error');
        input_parent.appendChild(span_error);
    }
}

function clean_errors(elem_id){
    $('#'+elem_id+' .help-block').remove();
    $('#'+elem_id+' .form-group').removeClass('has-error');
}