from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import CustomUser
from .models import Friend_Request

class FriendRequestView(APIView):
	def send_friend_request(request, userID):
		from_user = request.user
		to_user = CustomUser.objects.get(id=userID)
		friend_request, created = Friend_Request.objects.get_or_create(
			from_user=from_user, to_user=to_user)
		if created:
			return Response('Friend request sent')
		else:
			return Response('Friend request already sent')
