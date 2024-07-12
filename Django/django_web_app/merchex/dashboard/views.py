from django.http import HttpResponse
from django.shortcuts import render
from dashboard.models import Stats
from jess.models import User

def dashboard_view(request):
    users = User.objects.all()
    stats = Stats.objects.all().select_related('user') #foreign key : to link user to stats
    return render(request, 'dashboard.html',
				{'users': users, 'stats': stats})
