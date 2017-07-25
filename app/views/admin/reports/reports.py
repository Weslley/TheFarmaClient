from django.shortcuts import render

def index(request):
	return render(request,'admin/reports/index.html')

def show(request,id):
	return render(request,'admin/reports/show.html')