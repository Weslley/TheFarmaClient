from django import template

import locale


register = template.Library()


@register.simple_tag
def credits_billing(gross_value, administrator_fees, thefarma_fees):

    def default_value(value):
        if value:
            return float(value)
        return 0

    gross_value = default_value(gross_value)
    administrator_fees = default_value(administrator_fees)
    thefarma_fees = default_value(thefarma_fees)
    total = gross_value - administrator_fees - thefarma_fees

    return locale.currency(total, grouping=True)
