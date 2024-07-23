from rest_framework.response import Response
#converts any response to json

from rest_framework.decorators import api_view
from base.models import CustomUser
from .serializers import CustomUserSerializer

@api_view(['GET'])
def getData(request):
	items = CustomUser.objects.all()
	serializer = CustomUserSerializer(items, many=True)
	return Response(serializer.data)

@api_view(['POST'])
def addUser(request):
	serializer = CustomUserSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)