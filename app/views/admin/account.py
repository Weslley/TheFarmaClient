from django.contrib import messages
from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.http import JsonResponse

from app.api_data.account import AccountClient
from app.api_data.utils import UtilsClient
from app.utils import *
import re


class AccountView(TemplateView):

    template_name = 'admin/account/index.html'

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(AccountView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(AccountView, self).get_context_data(**kwargs)

        if 'errors' in kwargs:
            return context

        client = AccountClient(**self.auth_data)
        client_bacos = UtilsClient(**self.auth_data)

        status_code, data = client.get_account_data()
        status_code_b, data_b = client_bacos.get_bancos_list()

        if status_code_b == 200:
            context['bancos_list'] = data_b['results']
        else:
            context['bancos_list'] = {}

        if status_code >= 400:
            return self.render_to_response(self.get_context_data(errors=data))

        elif status_code == 200:
            email = data['usuario']['email']
            self.request.session['auth_data']['email'] = email
            context['account'] = data

        context['header_name'] = self.auth_data['nome']
        return context

    def post(self, request, *args, **kwargs):
        data = {}

        if request.POST.get('form') == 'dados_pessoais':
            data['usuario'] = {}

            _set_field('email', request.POST, data['usuario'])
            _set_field('password', request.POST, data['usuario'])
            _set_field('telefone', request.POST, data, int)
            _set_field('celular', request.POST, data)

        if request.POST.get('form') == 'dados_empresa':
            data['farmacia'] = {}

            _set_field('cnpj', request.POST, data['farmacia'], int)
            _set_field('nome_fantasia', request.POST, data['farmacia'])
            _set_field('razao_social', request.POST, data['farmacia'])

        if request.POST.get('form') == 'conta_bancaria':
            data['farmacia'] = {}
            data['farmacia']['conta_bancaria'] = {}

            _set_field('banco', request.POST,
                       data['farmacia']['conta_bancaria'])

            _set_field('numero_agencia', request.POST,
                       data['farmacia']['conta_bancaria'])

            _set_field('digito_agencia', request.POST,
                       data['farmacia']['conta_bancaria'])

            _set_field('numero_conta', request.POST,
                       data['farmacia']['conta_bancaria'])

            _set_field('digito_conta', request.POST,
                       data['farmacia']['conta_bancaria'])

        client = AccountClient(**self.auth_data, data=data)

        status_code, data = client.update_account_data()

        return JsonResponse(
            data, status=status_code)


def _set_field(key, post, dic, tipo=None):
    if key in post and post[key]:
        value = post[key]
        if tipo == int:
            value = re.sub("[^0-9]", "", value)
        dic.update({key: value})
