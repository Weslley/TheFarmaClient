from django import template

from app.utils import api_to_date

register = template.Library()


@register.filter(name='date_api')
def date_api(date_str):
    return api_to_date(date_str).strftime('%d/%m/%Y')
