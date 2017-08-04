from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError


class AccountClient(BaseClient):

    def update_account_data(self):
        try:
            response = self.client.representante_legal.patch(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict

    def get_account_data(self):
        try:
            response = self.client.representante_legal.get(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict

    def login(self):
        try:
            response = self.client.auth.farmacia.login.post(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            self.token = response.to_dict['token']
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict

    def logout(self):
        try:
            response = self.client.logout.post(
                request_body={},
                query_params={},
                request_headers={}
            )
            return response.status_code, response.to_dict
        except HTTPError as err:
            return err.status_code, err.to_dict
