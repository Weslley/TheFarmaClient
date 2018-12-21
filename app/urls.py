from django.conf.urls import url

from app.views import clients

from app.views.admin import FinancialView
from app.views.admin import products
from app.views.admin import SalesView
from app.views.admin import AccountView

from app.views.admin.financial import FinancialSalesView, BillingView

from app.views.admin.reports import reports
from app.views.admin.reports import products as reports_products
from app.views.admin.reports import sales as reports_sales
from app.views.admin.reports import stock as reports_stock
from app.views.admin.sales import SubmitProposal, CancelProposal, DispatchProposal, DeliveryProposal

from app.views.clients import LoginView
from app.views.clients import logout


urlpatterns = [
    url(r'^$', LoginView.as_view(), name='home'),
    url(r'^clients/login$', LoginView.as_view(), name='login'),
    url(r'^clients/logout$', logout, name='logout'),
    url(r'^clients/register$', clients.register, name='register'),

    # ADMIN
    url(r'^admin/financial$', FinancialView.as_view(), name='financial_path'),
    url(r'^admin/financial/sales/$', FinancialSalesView.as_view(), name='financial_sales'),
    url(r'^admin/financial/billing/$', BillingView.as_view(), name='financial_billing'),

    # PRODUCTS
    url(r'^admin/products$', products.index, name='products_path'),
    #url(r'^admin/products/(?P<id>\d+)$', products.show, name='show_product_path'),

    # SALES
    url(r'^admin/sales$', SalesView.as_view(), name='sales_path'),
    url(r'^admin/proposal/send$', SubmitProposal.as_view(), name='send_proposal'),
    url(r'^admin/proposal/(?P<id>[0-9]+)/cancel$', CancelProposal.as_view(), name='cancel_proposal'),
    url(r'^admin/proposal/(?P<id>[0-9]+)/confirm_dispatch$', DispatchProposal.as_view(), name='confirm_dispatch'),
    url(r'^admin/proposal/(?P<id>[0-9]+)/confirm_delivery$', DeliveryProposal.as_view(), name='confirm_delivery'),
    # url(r'^admin/sales/(?P<id>\d+)$', sales.show, name='show_sales_path'),

    # ACCOUNT
    url(r'^admin/account$', AccountView.as_view(), name='account_path'),

    # REPORTS
    url(r'^admin/reports/$', reports.index, name='reports'),
    url(r'^admin/reports/indicador_venda/$', reports.indicador_venda, name='report-indicador-venda'),
    url(r'^admin/reports/sales/$', reports_sales.index, name='reports_sales_path'),
    url(r'^admin/reports/stock/$', reports_stock.index, name='reports_stock_path')
]
