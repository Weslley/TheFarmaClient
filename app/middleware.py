from django.urls import reverse
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.conf import settings


class AuthRequiredMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.session['api_url'] = settings.API_URL_BASE
        url = request.META['PATH_INFO']
        login = 'login' not in url
        if 'auth_data' not in request.session.keys() and login:
            if url is not '/':
                msg = 'Por favor, faça login.'
                messages.add_message(request, messages.ERROR, msg)
            return HttpResponseRedirect(
                reverse('login')
            )
        response = self.get_response(request)
        return response
