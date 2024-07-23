from rest_framework.response import Response
#converts any response to json

from rest_framework.decorators import api_view
from base.models import Stats
from .serializers import statsSerializer

@api_view(['GET'])
def getData(request):
	items = Stats.objects.all()
	serializer = statsSerializer(items, many=True)
	return Response(serializer.data)

@api_view(['POST'])
def addStats(request):
	serializer = statsSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)