from django.http import HttpResponse

def jess_view(request):
    return HttpResponse("Hello from Jess!")