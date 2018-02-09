from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError


class ProductsClient(BaseClient):

    def get_best_sellers(self, **kwargs):
        try:
            response = self.client.produtos.mais_vendidos.get(
                request_body=self.data,
                query_params=kwargs,
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict
