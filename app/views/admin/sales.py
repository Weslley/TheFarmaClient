from django.shortcuts import render

def index(request):
	return render(request,'admin/sales/index.html',{'range': range(10)})

def show(request,id):
	return render(request,'admin/sales/show.html')