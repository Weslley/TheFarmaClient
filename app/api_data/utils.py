from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError


class UtilsClient(BaseClient):

    def get_bancos_list(self):
        try:
            response = self.client.bancos.get(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict
