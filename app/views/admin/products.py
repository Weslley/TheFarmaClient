from django.shortcuts import render

def index(request):
	return render(request,'admin/products/index.html', {'range': range(10)})

def show(request,id):
	return render(request,'admin/products/show.html')