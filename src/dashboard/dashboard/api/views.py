from rest_framework.response import Response
#converts any response to json


from rest_framework.decorators import api_view
from base.models import Stats, GameHistory
from .serializers import statsSerializer

# # TEST KARL
# from django.http import JsonResponse

# def user_data_view(request):
#     # Your logic to fetch or create the data
#     data = {"key": "value"}  # Example data
#     return JsonResponse(data)  # Automatically sets Content-Type to application/json

# # TEST KARL


@api_view(['GET'])
def getData(request):
	items = Stats.objects.all()
	serializer = statsSerializer(items, many=True)
	return Response(serializer.data)

# @api_view(['POST'])
# def addStats(request):
# 	serializer = statsSerializer(data=request.data)
# 	if serializer.is_valid():
# 		serializer.save()
# 	return Response(serializer.data)



@api_view(['POST'])
def addStats(request):
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

	# Response can be adjusted based on what you need to return
	return Response({"message": "Stats updated successfully for existing nicknames"})