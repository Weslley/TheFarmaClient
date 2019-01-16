from django.contrib import messages
from django.shortcuts import redirect
from django.views.generic import TemplateView

from app.api_data.financial import FinancialClient


class FinancialView(TemplateView):
    """
    Class View para setor fianceiro.
    """
    template_name = 'admin/index.html'

    def get_last_date(self):
        client = FinancialClient(**self.auth_data)
        try:
            status_code, data = client.get_financial_sales_data()
            periodos = data.get('periodos')
            if periodos:
                return periodos[0]

        except Exception as err:
            pass

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(FinancialView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(FinancialView, self).get_context_data(**kwargs)
        context['header_name'] = self.auth_data['nome']

        if 'errors' in kwargs:
            return context

        client = FinancialClient(**self.auth_data)

        try:
            status_code, data = client.get_financial_data()
        except Exception as err:
            context['errors'] = 'Erro ao obter informações do servidor.'
            return context

        if status_code >= 400:
            context['errors'] = data
        elif status_code == 200:
            context['ultima_data'] = self.get_last_date()
            context['financeiro'] = data

        return context
