from django.db import models

class Stats(models.Model):
	nickname = models.CharField(max_length=200)
	#TODO: avatar = img (aller la chercher dans base de donnees jess)
	nb_of_victories = models.fields.IntegerField()
	nb_of_defeats = models.fields.IntegerField()
	badge = models.fields.IntegerField() #only 4 possibilities
	#badge = affichage d une image
	#0=none, 1=gold, 2=silver, 3=bronze
	ranking_position = models.fields.IntegerField()
	#if else dans le tuto :
	#if ranking_position <= 10
	#   if 10 <= ranking_position < 5
	#       you are in the top 10 players!
	#   if 5 <= ranking_position <= 1
	#       you are in the top 5 players!
	#   if 3 <= ranking_position <= 1
	#      "You are the top {ranking position} player!"
	#   else if ranking position == 1
	#       You're the best player ever!
	nb_of_games_played = models.fields.IntegerField()
	#Afficher : you won X% of your games! (X = nb_of_victories/nb_of_games * 100)
	#Afficher le ranking general avec tous les nicknames
	#equivalent de std::map en c++ pq le sujet specifie que
	#je dois avoir un historique des parties jouees donc je
	#dois avoir un containeur avec les logins des joueurs et
	#les points de chacun

class GameHistory(models.Model):
	#ForeignKey to link GameHistory to Stats
	stats = models.ForeignKey(Stats, related_name='games_history', on_delete=models.CASCADE)
	opponentNickname = models.CharField(max_length=200)
	opponentScore = models.IntegerField()
	myScore = models.IntegerField()
	date = models.DateTimeField(null=True, blank=True)