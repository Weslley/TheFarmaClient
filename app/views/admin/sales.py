from django.shortcuts import render

def index(request):
	return render(request,'admin/products/index.html')

def show(request,id):
	return render(request,'admin/products/show.html')