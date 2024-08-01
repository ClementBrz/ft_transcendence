#converts any response to json

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, status
from base.models import CustomUser
from .serializers import CustomUserSerializer



# TEST KARL
from django.http import JsonResponse

def user_data_view(request):
    # Your logic to fetch or create the data
    data = {"key": "value"}  # Example data
    return JsonResponse(data)  # Automatically sets Content-Type to application/json

# TEST KARL


# Retrieves a list of all CustomUser instances, all users'data
@api_view(['GET'])
def getData(request):
	items = CustomUser.objects.all()
	serializer = CustomUserSerializer(items, many=True)
	return Response(serializer.data)


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


