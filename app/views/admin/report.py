from django.contrib import messages
from django.shortcuts import redirect
from django.views.generic import TemplateView

from app.api_data.reports import ReportClient

from thefarmacustomer.settings import API_URL_BASE as BASE_URL

class MoreSalesView(TemplateView):
    """
    Class View para listagem de vendas setor fianceiro.
    """
    template_name = 'admin/financial/sales.html'

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(MoreSalesView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(MoreSalesView, self).get_context_data(**kwargs)
        context['header_name'] = self.auth_data['nome']

        if 'errors' in kwargs:
            return context

        client = ReportClient(**self.auth_data)

        try:
            params = self.request.GET
            status_code, data = client.get_more_sales_data(params=params)
        except Exception as err:
            context['errors'] = 'Erro ao obter informações do servidor.'
            return context

        if status_code >= 400:
            context['errors'] = data

        elif status_code == 200:
            context['sales'] = data

        return context


class MoreSearchView(TemplateView):
    """
    Class View de detalhe dos faturamentos
    """
    template_name = 'admin/financial/billing.html'

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(MoreSearchView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(MoreSearchView, self).get_context_data(**kwargs)
        context['header_name'] = self.auth_data['nome']

        if 'errors' in kwargs:
            return context

        client = ReportClient(**self.auth_data)

        try:
            params = self.request.GET
            status_code, data = client.get_more_search_data(params=params)
        except Exception as err:
            context['errors'] = 'Erro ao obter informações do servidor.'
            return context
        
        if status_code >= 400:
            context['errors'] = data

        elif status_code == 200:
            context['faturamento'] = data
            context['api_url'] = BASE_URL

        return context