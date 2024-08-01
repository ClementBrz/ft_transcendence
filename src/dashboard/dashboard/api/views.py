from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from base.models import Stats, GameHistory
from .serializers import statsSerializer
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) #TODO: to uncomment eventually (Karl -> I'll check later)
def getData(request):
	try:
		items = Stats.objects.all()
		serializer = statsSerializer(items, many=True)
		return Response(serializer.data)
	except Exception as e:
		logger.error(f"Error in getData: {e}")
		return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def addStats(request):
	try:
		leftNick = request.data.get('leftNick')
		rightNick = request.data.get('rightNick')
		leftScore = request.data.get('leftScore')
		rightScore = request.data.get('rightScore')

		# Check if Stats instance exists for leftNick
		leftStats = Stats.objects.filter(nickname=leftNick).first()
		if leftStats:
			# Update game history for leftNick
			GameHistory.objects.create(
				stats=leftStats,
				opponentNickname=rightNick,
				opponentScore=rightScore,
				myScore=leftScore
			)
			leftStats.nb_of_games_played += 1
			if leftScore > rightScore:
				leftStats.nb_of_victories += 1
			else:
				leftStats.nb_of_defeats += 1
			leftStats.save()

		# Check if Stats instance exists for rightNick
		rightStats = Stats.objects.filter(nickname=rightNick).first()
		if rightStats:
			# Update game history for rightNick
			GameHistory.objects.create(
				stats=rightStats,
				opponentNickname=leftNick,
				opponentScore=leftScore,
				myScore=rightScore
			)
			rightStats.nb_of_games_played += 1
			if rightScore > leftScore:
				rightStats.nb_of_victories += 1
			else:
				rightStats.nb_of_defeats += 1
			rightStats.save()

		return Response({"message": "Stats updated successfully for existing nicknames"})
	except Exception as e:
		logger.error(f"Error in addStats: {e}")
		return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	


def dashboardData(request):
	# Your logic to fetch and return dashboard data goes here
	data = {
		# Example data structure
		"stats": {},
	}
	return JsonResponse(data)
