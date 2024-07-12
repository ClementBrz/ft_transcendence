from django.http import HttpResponse
from django.shortcuts import render
# from dashboard.models import User
from jess.models import User

def dashboard_view(request):
    users = User.objects.all()
    return render(request, 'dashboard.html',
				{ 'users': users })
