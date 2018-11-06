from django.contrib import messages
from django.shortcuts import redirect
from django.views.generic import TemplateView

from app.api_data.financial import FinancialClient


class FinancialSalesView(TemplateView):
    """
    Class View para listagem de vendas setor fianceiro.
    """
    template_name = 'admin/financial/sales.html'

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(FinancialSalesView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(FinancialSalesView, self).get_context_data(**kwargs)
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
            context['financeiro'] = data

        return context