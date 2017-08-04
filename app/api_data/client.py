from python_http_client import Client
from thefarmacustomer.settings import API_URL_BASE as BASE_URL


class BaseClient():

    def __init__(self, token=None, data=None, *args, **kwargs):
        self._token = token
        self.data = data
        self.args = args
        self.kwargs = kwargs
        extra_headers = self._extra_headers(**kwargs)

        if self._token:
            extra_headers['Authorization'] = 'Token {}'.format(self._token)
            kwargs['extra_headers'] = extra_headers

        self.client = self.get_client(**kwargs)

    def _extra_headers(self, **kwargs):
        return kwargs['extra_headers'] if 'extra_headers' in kwargs else {}

    def get_client(self, *args, **kwargs):
        """
        :param: *args: lista opcional
        :param: **kwargs: dicionario opcional
        :return: Client http
        """
        extra_headers = self._extra_headers(**kwargs)

        return Client(
            host=BASE_URL, request_headers=extra_headers, append_slash=True
        )

    @property
    def token(self):
        return self._token

    @token.setter
    def token(self, value):
        self._token = value
        kwargs = {}
        extra_headers = self._extra_headers(**kwargs)

        if self._token:
            extra_headers['Authorization'] = 'Token {}'.format(self._token)
            kwargs['extra_headers'] = extra_headers

        self.client = self.get_client(**kwargs)
