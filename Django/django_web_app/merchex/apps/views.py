from django.http import HttpResponse
from django.shortcuts import render
from apps.models import User

def dashboard(request):
    users = User.objects.all()
    return render(request, 'dashboard.html',
				{ 'users': users })
    
def users(request):
    return HttpResponse('<h1>Login Page</h1>')