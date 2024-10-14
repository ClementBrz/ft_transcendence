# from rest_framework import serializers
# from base.models import Stats, GameHistory

# class GameHistorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = GameHistory
#         fields = '__all__'

# class statsSerializer(serializers.ModelSerializer):
#     games_history = GameHistorySerializer(many=True, read_only=True)

#     class Meta:
#         model = Stats
#         fields = '__all__'




from rest_framework import serializers
from base.models import GameHistory
from api_user.models import CustomUser

class GameHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = GameHistory
		fields = '__all__'