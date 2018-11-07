from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError


class FinancialClient(BaseClient):

    def get_financial_data(self):
        try:
            response = self.client.financeiro.get(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict

    def get_financial_sales_data(self):
        try:
            response = self.client.financeiro.vendas.get(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict
