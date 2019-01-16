from django.shortcuts import render
from io import BytesIO
from easy_report.builder import Builder
from easy_report.utils import types
from app.api_data.products import ProductsClient
from app.api_data.fabricators import FabricatorClient
from app.api_data.region import RegionClient
from app.api_data.active_principle import ActivePrincipleClient
from datetime import datetime


def index(request):
	return render(request,'admin/reports/index.html')


def indicador_venda(request):
	if request.method == 'GET':
		return render(request,'admin/reports/indicador_venda.html')
	else:
		from django.http import HttpResponse
		# Create the HttpResponse object with the appropriate PDF headers.
		response = HttpResponse(content_type='application/pdf')
		response['Content-Disposition'] = 'attachment; filename="indicador_venda.pdf"'
		
		kwargs = {
			'auth_data': request.session['auth_data'],
			'data': {}
		}
		for prop in ['data_inicial', 'data_final', 'regiao', 'laboratorio', 'principio_ativo']:
			value = request.POST.get(prop, None)
			if value:
				kwargs['data'][prop] = value

		pdf = relatorio_indicador_venda(**kwargs)
		response.write(pdf)

		return response


def show(request,id):
	return render(request,'admin/reports/show.html')


def relatorio_indicador_venda(**kwargs):
    try:
        kwargs['laboratorio'] = ''
        kwargs['regiao'] = ''
        kwargs['principio_ativo'] = ''

        if 'laboratorio' in kwargs['data']:
            fabricante_client = FabricatorClient(**kwargs['auth_data'])
            status_code, laboratorio = fabricante_client.get_by_id(kwargs['data']['laboratorio'])
            if status_code == 200:
            	kwargs['laboratorio'] = laboratorio['nome']

        if 'regiao' in kwargs['data']:
            regiao_client = RegionClient(**kwargs['auth_data'])
            status_code, regiao = regiao_client.get_by_id(kwargs['data']['regiao'])
            if status_code == 200:
                kwargs['regiao'] = regiao['nome']

        if 'principio_ativo' in kwargs['data']:
            principio_ativo_client = ActivePrincipleClient(**kwargs['auth_data'])
            status_code, principio_ativo = principio_ativo_client.get_by_id(kwargs['data']['principio_ativo'])
            if status_code == 200:
                kwargs['principio_ativo'] = principio_ativo['nome']

        header = [
            'Periodo: {:%d/%m/%Y} á {:%d/%m/%Y}'.format(
				datetime.strptime(kwargs['data']['data_inicial'], '%Y-%m-%d').date(),
				datetime.strptime(kwargs['data']['data_final'], '%Y-%m-%d').date()
			),
            'Região: {}'.format(kwargs['regiao'] if 'regiao' in kwargs['data'] else ''),
            'Laboratório: {}'.format(kwargs['laboratorio'] if 'laboratorio' in kwargs['data'] else ''),
			'Principio ativo: {}'.format(kwargs['principio_ativo']  if 'principio_ativo' in kwargs['data'] else '')
        ]

        client = ProductsClient(**kwargs['auth_data'])
        status_code, results = client.get_best_sellers(**kwargs['data'])
		
        data = []
		
        if status_code == 200:
            for obj in results:
                data.append([
					obj['nome'],
					obj['vendas'],
					obj['principio_ativo'],
					obj['laboratorio'],
				])
			

        columns_width = [
			(47.5, 'LEFT'),
			(7.5, 'CENTER'),
			(22.5, 'LEFT'),
			(22.5, 'LEFT'),
		]

        table_header = [
			'Nome',
			'Vendas',
			'Principio Ativo',
			'Laboratório',
		]

        table_footer = [
			'{} produtos'.format(len(data)),
			'',
			'',
			'',
		]

        buffer = BytesIO()

        report = Builder(
            empresa='The Farma',
            filename_logo='https://api.thefarma.com.br/static/img/thefarma.png',
            title='RELATÓRIO DE INDICADOR DE VENDAS',
            header=header,
            columns_width=columns_width,
            table_header=table_header,
            table_data=data,
            table_footer=table_footer,
            buffer=buffer,
            report_type=types.TABLE,
            repeat_header=1
        )

        pdf = report.build()

        return pdf

    except Exception as err:
        print(err)
        return None
