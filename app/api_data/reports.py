from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError

class ReportClient(BaseClient):

    def get_more_sales_data(self, params={}):
        try:
            response = self.client.financeiro.mais_vendido.get(
                request_body=self.data,
                query_params=params,
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict

    def get_more_sales_detail_data(self, pk, params={}):
        try:
            response = self.client.financeiro.mais_vendido._(pk).get(
                request_body=self.data,
                query_params=params,
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict

    def get_more_search_data(self, params={}):
        try:
            response = self.client.financeiro.mais_pesquisado_raio.get(
                request_body=self.data,
                query_params=params,
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict
