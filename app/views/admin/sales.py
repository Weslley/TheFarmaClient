from django.http.response import JsonResponse
from django.views.generic import TemplateView, View
import json
from app.api_data.sales import SalesClient


class SalesView(TemplateView):

    template_name = 'admin/sales/index.html'

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(SalesView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(SalesView, self).get_context_data(**kwargs)

        context['header_name'] = self.auth_data['nome']

        if 'errors' in kwargs:
            return context

        client = SalesClient(**self.auth_data)

        try:
            data = {'order': '-log__data_criacao'}
            order = self.request.GET.get('order', '-log__data_criacao')
            status = self.request.GET.get('status', 0)
            page = self.request.GET.get('page', 1)
            data['order'] = order
            data['page'] = page
            if status != -1 and status != '-1':
                data['status'] = status

            status_code, data = client.get_sales_list(**data)
        except Exception as err:
            context['errors'] = 'Erro ao obter informações do servidor.'
            return context

        if status_code >= 400:
            context['errors'] = data

        elif status_code == 200:
            context['pedidos'] = data['results']

        return context

    def get(self, request, *args, **kwargs):
        if not request.is_ajax():
            return super(SalesView, self).get(request, *args, **kwargs)
        context = self.get_context_data(**kwargs)
        data = {}
        data['results'] = context['pedidos'] if 'pedidos' in context else []
        status = 200 if 'pedidos' in context else 400
        return JsonResponse(data, status=status)


class SubmitProposal(View):

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(SubmitProposal, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        sale_id = request.POST.get('id')
        itens = request.POST.get('itens')
        itens = json.loads(itens)
        data = {
            "itens_proposta": [
                {'id': _['id'], 'valor_unitario': _['valor'], 'possui': True, 'quantidade': _['quantidade']}
                for _ in itens
            ]
        }
        data_returned = {}
        status_code = 200
        client = SalesClient(data=data, **self.auth_data)

        try:
            status_code, data_returned = client.submit_proposal(sale_id)
        except Exception:
            data_returned['errors'] = 'Erro ao obter informações do servidor.'

        return JsonResponse(data_returned, status=status_code)


class CancelProposal(View):

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(CancelProposal, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        sale_id = kwargs['id']
        status_code = 400
        client = SalesClient(**self.auth_data)
        data_returned = {}

        try:
            status_code, data_returned = client.cancel_proposal(sale_id)
        except Exception as err:
            print(err)
            data_returned['errors'] = 'Erro ao obter informações do servidor.'

        return JsonResponse(data_returned, status=status_code)

# def index(request):
    # return render(request,'admin/sales/index.html',{'range': range(10)})

# def show(request,id):
    # return render(request,'admin/sales/show.html')


class DispatchProposal(View):

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(DispatchProposal, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        sale_id = kwargs['id']
        status_code = 400
        client = SalesClient(**self.auth_data)
        data_returned = {}

        try:
            status_code, data_returned = client.confirm_dispatch(sale_id)
        except Exception as err:
            print(err)
            data_returned['errors'] = 'Erro ao obter informações do servidor.'

        return JsonResponse(data_returned, status=status_code)


class DeliveryProposal(View):

    def dispatch(self, request, *args, **kwargs):
        self.auth_data = self.request.session['auth_data']
        return super(DeliveryProposal, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        sale_id = kwargs['id']
        status_code = 400
        client = SalesClient(**self.auth_data)
        data_returned = {}

        try:
            status_code, data_returned = client.confirm_delivery(sale_id)
        except Exception as err:
            print(err)
            data_returned['errors'] = 'Erro ao obter informações do servidor.'

        return JsonResponse(data_returned, status=status_code)

# def index(request):
    # return render(request,'admin/sales/index.html',{'range': range(10)})

# def show(request,id):
    # return render(request,'admin/sales/show.html')
