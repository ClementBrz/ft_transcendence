from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.http import JsonResponse
from base.models import CustomUser
from .serializers import CustomUserSerializer
import logging
from django.core.exceptions import PermissionDenied

logger = logging.getLogger(__name__)

# TEST KARL
@api_view(['GET'])
def profile_view(request):
	if request.method == 'GET':
		logger.info("profile_view called")
		data = {
			'username': 'JohnDoe',
			'avatar_url': '/avatars/johndoe.png',
			# other data fields
		}
		return JsonResponse(data)
	else:
		logger.warning("Invalid request method for profile_view")
		return JsonResponse({'error': 'Bad Request'}, status=400)
# END TEST KARL

# Retrieves a list of all CustomUser instances, all users' data
@api_view(['GET'])
def getData(request):
	try:
		items = CustomUser.objects.all()
		serializer = CustomUserSerializer(items, many=True)
		return Response(serializer.data)
	except Exception as e:
		logger.error(f"Error in getData: {e}")
		return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# For user registration
@api_view(['POST'])
def addUser(request):
	try:
		serializer = CustomUserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		logger.error(f"Error in addUser: {e}")
		return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Sends to the frontend the profile of the currently authenticated user
class UserProfileView(generics.RetrieveAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = CustomUserSerializer
	authentication_classes = [SessionAuthentication, TokenAuthentication]
	permission_classes = [IsAuthenticated]

	def get_object(self):
		if not self.request.user.is_authenticated:
			raise PermissionDenied("User is not authenticated")
		return self.request.user
