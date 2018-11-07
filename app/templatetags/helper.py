from django import template
from django.core.serializers import serialize
from django.db.models.query import QuerySet
from django.utils.safestring import mark_safe

from app.utils import api_to_date

import json
import locale


register = template.Library()
locale.setlocale(locale.LC_MONETARY, 'pt_BR.UTF-8')


@register.filter(name='date_api')
def date_api(date_str):
    return api_to_date(date_str).strftime('%d/%m/%Y')

@register.filter(name='fmt_date')
def fmt_date(date_str):
    return api_to_date(date_str).strftime('%d %b %Y %H:%M')

@register.filter(name='fmt_money')
def fmt_money(money_str):
    return locale.currency(float(money_str), grouping=True)

@register.filter(name='jsonify')
def jsonify(object):
    if isinstance(object, QuerySet):
        return mark_safe(serialize('json', object))
    return mark_safe(json.dumps(object))