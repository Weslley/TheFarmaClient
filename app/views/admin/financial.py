from django.contrib import messages
from django.shortcuts import redirect
from django.views.generic import TemplateView

from app.api_data.financial import FinancialClient
from app.api_data.billing import BillingClient

from thefarmacustomer.settings import API_URL_BASE as BASE_URL


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
            params = self.request.GET
            status_code, data = client.get_financial_sales_data(params=params)
        except Exception as err:
            context['errors'] = 'Erro ao obter informações do servidor.'
            return context

        if status_code >= 400:
            context['errors'] = data

        elif status_code == 200:
            context['sales'] = data

        return context


class BillingView(TemplateView):
    """
    Class View de detalhe dos faturamentos
    """
    template_name = 'admin/financial/billing.html'

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(BillingView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(BillingView, self).get_context_data(**kwargs)
        context['header_name'] = self.auth_data['nome']

        if 'errors' in kwargs:
            return context

        client = BillingClient(**self.auth_data)

        try:
            params = self.request.GET
            id_detail = params.get('id')
            status_code, data = client.get_billing_data(url_param=id_detail)
        except Exception as err:
            context['errors'] = 'Erro ao obter informações do servidor.'
            return context
        
        if status_code >= 400:
            context['errors'] = data

        elif status_code == 200:
            context['faturamento'] = data
            context['api_url'] = BASE_URL

        return context