from django.contrib import messages
from django.shortcuts import redirect
from django.views.generic import TemplateView

from app.api_data.auth import AuthClient

from django.conf import settings


class LoginView(TemplateView):
    """Class View para autenticação."""

    template_name = 'clients/login.html'

    def dispatch(self, request, *args, **kwargs):
        if 'auth_data' in self.request.session:
            return redirect('sales_path')
        return super(LoginView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        """Método POST da view de login para autenticação."""
        login = request.POST.get('email', None)
        password = request.POST.get('password', None)

        if not (login or password):
            msg = 'Preencha todos os campos.'
            messages.add_message(request, messages.ERROR, msg)
            return redirect('login')

        client = AuthClient(
            data={'email': login, 'password': password}
        )

        # try:
        status_code, data = client.login()
        # except Exception as err:
            # print(err)
            # return redirect('login')

        if status_code >= 400:
            return self.render_to_response(self.get_context_data(errors=data))

        elif status_code == 200:
            auth_data = {
                'email': data['email'],
                'id': data['id'],
                'token': data['token'],
                'nome': data['nome'],
                'farmacia': data['farmacia_id']
            }
            self.request.session['auth_data'] = auth_data
            self.request.session[
                'websocket_url'
            ] = settings.WEBSOCKET_URL.format(
                id_farmacia=auth_data['farmacia'],
                token_representante=auth_data['token'],
            )
            return redirect('sales_path')
        return redirect('login')


def register(request):
    return render(request, 'clients/register.html')


def logout(request):
    """View Function para realizar loggout."""
    auth_data = request.session.pop('auth_data')
    client = AuthClient(**auth_data)
    client.logout()
    return redirect('login')
