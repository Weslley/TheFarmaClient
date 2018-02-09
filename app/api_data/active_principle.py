from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError


class ActivePrincipleClient(BaseClient):

    def get_by_name(self, **kwargs):
        try:
            response = self.client.principios_ativos.get(
                request_body=self.data,
                query_params=kwargs,
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict



    def get_by_id(self, pk, **kwargs):
        try:
            response = self.client.principios_ativos._(pk).get(
                request_body=self.data,
                query_params=kwargs,
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict