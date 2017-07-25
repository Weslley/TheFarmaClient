from django.shortcuts import render

def login(request):
	return render(request,'clients/login.html')

def register(request):
	return render(request,'clients/register.html')