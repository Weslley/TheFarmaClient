from django.conf.urls import url

from app.views import clients

from app.views.admin import admin
from app.views.admin import products
from app.views.admin import sales
from app.views.admin import account

from app.views.admin.reports import reports
from app.views.admin.reports import products as reports_products
from app.views.admin.reports import sales as reports_sales
from app.views.admin.reports import stock as reports_stock


urlpatterns = [
    url(r'^$', clients.login, name='home'),
    url(r'^clients/login$', clients.login, name='login'),
    url(r'^clients/register$', clients.register, name='register'),

    # ADMIN
    url(r'^admin/$', admin.index, name='admin_path'),

    # PRODUCTS
    url(r'^admin/products$', products.index, name='products_path'),
    # url(r'^admin/products/(?P<id>\d+)$',
    #   products.show, name='show_product_path'),

    # SALES
    url(r'^admin/sales$', sales.index, name='sales_path'),
    # url(r'^admin/sales/(?P<id>\d+)$', sales.show, name='show_sales_path'),

    # ACCOUNT
    url(r'^admin/account$', account.index, name='account_path'),

    # REPORTS
    url(r'^admin/reports$',
        reports.index, name='reports_path'),
    url(r'^admin/reports/products$',
        reports_products.index, name='reports_products_path'),
    url(r'^admin/reports/sales$',
        reports_sales.index, name='reports_sales_path'),
    url(r'^admin/reports/stock$',
        reports_stock.index, name='reports_stock_path')
]
