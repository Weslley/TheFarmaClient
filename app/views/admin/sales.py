from django.views.generic import TemplateView

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
            status_code, data = client.get_sales_list()
        except Exception as err:
            context['errors'] = 'Erro ao obter informações do servidor.'
            return context

        if status_code >= 400:
            context['errors'] = data

        elif status_code == 200:
            context['pedidos'] = data

        return context


# def index(request):
	# return render(request,'admin/sales/index.html',{'range': range(10)})

# def show(request,id):
	# return render(request,'admin/sales/show.html')
