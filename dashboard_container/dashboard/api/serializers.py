from rest_framework import serializers
from base.models import Stats

class statsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Stats
		fields = '__all__'