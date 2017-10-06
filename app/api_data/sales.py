from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError


class SalesClient(BaseClient):

    def get_sales_list(self):
        try:
            response = self.client.pedidos.propostas.get(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict

    def submit_proposal(self, sale_id):
        try:
            response = self.client.pedidos._(sale_id).propostas.patch(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict