from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics, status
#converts any response to json
from django.views.decorators.csrf import csrf_exempt
from api.models import CustomUser
from .serializers import CustomUserSerializer

# from .forms import UserRegistrationForm
import json

# Retrieves a list of all CustomUser instances, all users'data
# @api_view(['GET'])
# def getData(request):
# 	items = CustomUser.objects.all()
# 	serializer = CustomUserSerializer(items, many=True)
# 	return Response(serializer.data)

@api_view(['POST'])
def addUser(request):
	data = json.loads(request.body)
	form = UserRegistrationForm(data)
	if form.is_valid():
		user = form.save(commit=False)
		user.set_password(form.cleaned_data['password'])
		user.username = form.cleaned_data.get('username', None)
		user.save()
		return Response({'username': user.username}, status=status.HTTP_201_CREATED)
	return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

# For user registration
@api_view(['POST'])
def addUser(request):
	serializer = CustomUserSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Sends to the frontend the profile of the currently authenticated user
class UserProfileView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user
        # return CustomUser.objects.get(username='cbernaze')

## Ne peut pas etre testé avec une entrée fixe, comme 'cbernaze'. Il faut que l'utilisateur soit authentifié pour que la requête fonctionne.

# class	CustomUserAPIView(APIView):

@api_view(['POST'])
def check_existing_username(request):
	if request.method == 'POST':
		username = request.POST.get('identifier', None)
		if username:
			exists = CustomUser.objects.filter(username=username).exists()
			return Response({'exists': bool(exists)})
		else:
			return Response({'error': username}, status=400)
	else:
		return Response({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
def check_existing_email(request):
	if request.method == 'POST':
		email = request.POST.get('identifier', None)
		if email:
			exists = CustomUser.objects.filter(email=email).exists()
			return Response({'exists': bool(exists)})
		else:
			return Response({'error': 'Email parameter missing'}, status=400)
	else:
		return Response({'error': 'Invalid request method'}, status=405)