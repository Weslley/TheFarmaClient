from app.api_data.client import BaseClient
from python_http_client.exceptions import HTTPError


class AuthClient(BaseClient):

    def create_user(self):
        try:
            response = self.client.auth.users.post(
                request_body=self.data,
                query_params={},
                request_headers={}
            )
            self.token = response.to_dict['token']
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
            print(err)
            return err.status_code, err.to_dict

    def logout(self):
        try:
            response = self.client.auth.logout.post(
                request_body={},
                query_params={},
                request_headers={}
            )
            return response.status_code, response
        except HTTPError as err:
            return err.status_code, err.to_dict
