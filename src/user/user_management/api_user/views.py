from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from api_user.models import CustomUser
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.forms import SetPasswordForm
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate, login
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings
from .serializers import UsernameSerializer
from django.db.models import Q
from .forms import CustomUserRegistrationForm
import pyotp, os, json, base64, logging


#########################################


# For user registration

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def addUser(request):
	try:
		data = json.loads(request.body)
		print(f"Received data: {data}")
	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)

	form = CustomUserRegistrationForm(data)

	if form.is_valid():
		user = form.save(commit=False)
		user.set_password(form.cleaned_data['password'])
		user.save()
		return JsonResponse(form.cleaned_data, status=status.HTTP_201_CREATED)

	else:
		print(f"addUser errors: {form.errors}")
		return JsonResponse(form.errors, status=status.HTTP_400_BAD_REQUEST)


#########################################


# For user login

# csrf Token exempté car on utilise les JWTokens à la place
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def signInUser(request):
	try:
		data = json.loads(request.body)
		username = data.get('username')
		password = data.get('password')

		user = authenticate(request, username=username, password=password)

		if user is not None:
			if user.is2fa == True:
				totp = send_2fa_totp(user)
				request.session['pre_2fa_user_id'] = user.id

				return JsonResponse({'username': user.username, 'totp': totp, 'is2fa': True}, status=status.HTTP_200_OK)
			else:
				login(request, user)
				refresh = RefreshToken.for_user(user)
				access_token = str(refresh.access_token)
				refresh_token = str(refresh)
				user.is_online = True
				user.save()
			
				return JsonResponse({'access': access_token, 'refresh': refresh_token, 'is2fa': False}, status=status.HTTP_200_OK)

		else:
			return JsonResponse({'error': 'Invalid username or password'}, status=status.HTTP_200_OK)

	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_401_UNAUTHORIZED)
	except Exception as e:
		print(f'signInUser error: {str(e)}')
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateOnlineStatus(request):
	try:
		user = request.user
		user.last_ping = timezone.now()
		if (user.is_online == False):
			user.is_online = True
		user.save()
		return JsonResponse({'status': 'user is online'}, status=status.HTTP_200_OK)
	except Exception as e:
		return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)	


#########################################


# Get authenticated user's data

@api_view(['GET'])
@login_required
@permission_classes([IsAuthenticated])
def currentlyLoggedInUser(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		avatar_image_path = user.avatar.path
		with default_storage.open(avatar_image_path, 'rb') as avatar_image:
			avatar = base64.b64encode(avatar_image.read()).decode('utf-8')

		data = {
			'first_name': user.first_name,
			'last_name': user.last_name,
			'username': user.username,
			'password': user.password,
			'date_of_birth': user.date_of_birth,
			'email': user.email,
			'avatar': avatar,
			'online_status': user.is_online,
		}

		return JsonResponse(data, status=status.HTTP_200_OK)

	except Exception as e:
		print(f'currentlyLoggedInUser error: {str(e)}')
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################


@api_view(['GET'])
def doesUserExist(request, username):
	try:
		user = CustomUser.objects.get(username=username)

		return JsonResponse({'user_exists': True}, status=status.HTTP_200_OK)
	except Exception as e:
		return JsonResponse({'user_exists': False}, status=status.HTTP_200_OK)


#########################################


@api_view(['GET'])
def doesEmailExist(request, email):
	try:
		user = CustomUser.objects.get(email=email)

		return JsonResponse({'email_exists': True}, status=status.HTTP_200_OK)
	except Exception as e:
		return JsonResponse({'email_exists': False}, status=status.HTTP_200_OK)


#########################################


# Get the username of authenticated user

@api_view(['GET'])
@login_required
@permission_classes([IsAuthenticated])
def getUsername(request):
	if request.user.is_authenticated:
		serializer = UsernameSerializer(request.user)
		return Response(serializer.data)
	else:
		return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


#########################################


# Returns all users id and username for dashboard page

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllUsers(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		try:
			users = CustomUser.objects.all()
			users_info = []

			for user in users:
				users_info.append({'username': user.username, 'id': user.id})

			return JsonResponse(users_info, safe=False, status=200)

		except Exception as e:
			print(f'getAllUsers error: {str(e)}')
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	except Exception as e:
		print(f'getAllUsers error: {str(e)}')
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendAvatar(request, user_id):
	try:
		user = CustomUser.objects.get(id=user_id)
		avatar_image_path = user.avatar.path
		with default_storage.open(avatar_image_path, 'rb') as avatar_image:
			avatar = base64.b64encode(avatar_image.read()).decode('utf-8')
		data = {
			'avatar': avatar
		}
		return JsonResponse(data, status=status.HTTP_200_OK)
	except Exception as e:
		return JsonResponse({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


##################################################
##             CHANGE PASSWORD VIEWS            ##
##################################################


# For changing password, using Django's built-in password change form (SetPasswordForm)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@csrf_protect
def changePassword(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		form = SetPasswordForm(user, request.data)

		if form.is_valid():
			form.save()
			return Response({'success': 'Password changed successfully'}, status=status.HTTP_200_OK)
		else:
			return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
	
	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#########################################


#For checking if a user is connected

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkAuthentication(request):
	user = request.user
	if not user.is_authenticated:
			return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
	return Response({'authenticated': True}, status=200)


#########################################


# For checking if old password is correct

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verifyPassword(request):
	user = request.user
	current_password = request.data.get('current_password')

	if not current_password:
		return Response({'error': 'Current password is required'}, status=status.HTTP_200_OK)

	if user.check_password(current_password):
		return Response({'valid': True, 'current_password': user.password}, status=status.HTTP_200_OK)
	else:
		return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)


#########################################



# For changing the old password with the new hashed password

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@csrf_protect
def hashAndChangePassword(request):
	user = request.user
	new_password = request.data.get('newPassword')

	if not new_password:
		return Response({'error': 'New password is required'}, status=status.HTTP_200_OK)

	try:
		hashed_password = make_password(new_password)
		user.password = hashed_password
		user.save()
		return Response({'success': 'Password changed successfully'}, status=status.HTTP_200_OK)
	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	


##################################################
##           CHANGE PROFILE INFO VIEWS          ##
##################################################


@api_view(['PUT'])
@login_required
@permission_classes([IsAuthenticated])
@csrf_protect
def updateProfile(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		user.email = request.data.get('email')
		user.date_of_birth = request.data.get('date_of_birth')
		user.first_name = request.data.get('first_name')
		user.last_name = request.data.get('last_name')

		user.save()

		return Response({'success': 'Profile updated successfully'}, status=status.HTTP_200_OK)	

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################


@api_view(['PUT'])
@login_required
@permission_classes([IsAuthenticated])
@csrf_protect
def updateAvatar(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		data = request.data.get('avatar_input')
		if not data:
			return Response({'error': 'No avatar data provided'}, status=status.HTTP_200_OK)

		try:
			avatar_data = base64.b64decode(data)
		except Exception as e:
			return Response({'error': f'Invalid image data: {str(e)}'}, status=405)

		username = user.username
		avatar_dir = os.path.join(settings.MEDIA_ROOT, 'avatars')
		avatar_path = os.path.join(avatar_dir, f'{username}.png')

		try:
			with open(avatar_path, 'wb') as f:
				f.write(avatar_data)
		except Exception as e:
			print(f'Error de open: {str(e)}')
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		user.avatar = avatar_path
		user.save()

		return Response({'success': 'Avatar updated successfully'}, status=status.HTTP_200_OK)	

	except Exception as e:
		print(f'updateAvatar Error: {str(e)}')
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


##################################################
##            REQUEST PERSONNAL INFOS   		##
##################################################


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_user_information(request):
	try:
		user = request.user
		games = request.data

		user_data = {
			'first_name': user.first_name,
			'last_name': user.last_name,
			'username': user.username,
			'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
			'email': user.email,
			'online_status': 'online' if user.is_online else 'offline',
			'friends': [
				{
					'username': friend.username
				}
				for friend in user.friends.all()
			],
			'games': [
				{
					'you': game.get('myUsername'),
					'opponent': game.get('opponentUsername'),
					'you score': game.get('myScore'),
					'opponent score': game.get('opponentScore'),
					'game\'s date': game.get('date'),
				}
				for game in games
			]
		}
		json_data = json.dumps(user_data, indent=4)

		send_mail(
			f'Personnal Informations Requested from transcendance.fr for {user.username}',
			f"""Dear {user.first_name} {user.last_name},
Thank you for your request regarding your personal data.
As per your request and in compliance with the General Data Protection Regulation (GDPR),
we are providing you with an export of your personal data.

{json_data}""",		
			'noreply@orange.fr',
			[user.email],
			fail_silently=False,
		)

		return JsonResponse({'success': 'user informations send to user email'}, status=status.HTTP_200_OK)
	except Exception as e:
		print(f"Error: {e}")
		return JsonResponse({'error': 'An error occurred while sending user information'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


##################################################
##          		 2FA VIEWS   		        ##
##################################################


def send_2fa_totp(user):
	if not user.totp_secret:
		user.totp_secret = pyotp.random_base32()
		user.save()
	totp = pyotp.TOTP(user.totp_secret)
	code = totp.now()

	send_mail(
		f'Verification code for {user.username} on transcendance.fr',
		f'Please enter this one-time code to log into your account: {code}',
		'noreply@orange.fr',
		[user.email],
		fail_silently=False,
	)

	return code


#########################################


# @never_cache
@api_view(['POST'])
def verify_2fa_code(request):
	code = request.data.get('code')
	user_id = request.session.get('pre_2fa_user_id')
	
	if user_id:
		user = CustomUser.objects.get(id=user_id)
		totp = pyotp.TOTP(user.totp_secret)
		if totp.verify(code):
			login(request, user)
			refresh = RefreshToken.for_user(request.user)
			access_token = str(refresh.access_token)
			refresh_token = str(refresh)
			user.is_online = True
			user.save()

			return JsonResponse({'access': access_token, 'refresh': refresh_token, '2fa': False}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'error': 'Invalid 2fa code'}, status=status.HTTP_400_BAD_REQUEST)
	else:
			return JsonResponse({'error': 'User ID doesn\'t exist'}, status=status.HTTP_404_NOT_FOUND)


#########################################


@api_view(['POST'])
def resend_2fa_code(request):
	user_id = request.session.get('pre_2fa_user_id')
	if user_id:
		user = CustomUser.objects.get(id=user_id)
		send_2fa_totp(user)
		return JsonResponse({'message': 'New 2FA code sent'}, status=status.HTTP_200_OK)
	else:
		return JsonResponse({'error': 'User ID doesn\'t exist'}, status=status.HTTP_404_NOT_FOUND)



#########################################


@api_view(['GET'])
@login_required
@permission_classes([IsAuthenticated])
def get2FAStatus(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		return JsonResponse({'is2fa': user.is2fa}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################


@api_view(['PUT'])
@login_required
@permission_classes([IsAuthenticated])
@csrf_protect
def update2FAStatus(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		is2fa = request.data.get('is2fa')

		if is2fa is not None:
			user.is2fa = is2fa
			user.save()

		return Response({'message': '2FA status updated successfully', 'is2fa': user.is2fa}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



##################################################
##          	 DASHBOARD VIEWS   		        ##
##################################################


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def loggout_user(request):
	try:
		user = request.user
		user.is_online = False
		user.save()

		return JsonResponse({'success': 'Log out successful'}, status=status.HTTP_200_OK)
	except Exception as e:
		return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


#########################################


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def	otherUsersList(request):
	try:
		users = CustomUser.objects.exclude(id=request.user.id)
		users_data = [
			{
				"id": user.id,
				"username": user.username,
				"online_status": user.is_online,
				"friendship_status": get_friendship_status(request.user, user),
			}
			for user in users
		]
		return JsonResponse(users_data, safe=False, status=status.HTTP_200_OK)
	except:
		return JsonResponse({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)


#########################################


def get_friendship_status(user1, user2):
	for friend in user1.friends.all():
		if friend.username == user2.username:
			return 'already_friends'
	return 'not_friends'



##################################################
##           		GDPR VIEWS      		    ##
##################################################

@api_view(['PUT'])
@login_required
@permission_classes([IsAuthenticated])
@csrf_protect
def anonymizeUserData(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		userOldUsername = user.username
			
		usernameSuffix = get_random_string(6)
		user.username = f'user_{usernameSuffix}'
		user.email = f'anonymized_{usernameSuffix}@example.com'
		user.first_name = 'Anonymous'
		user.last_name = 'User'
		user.date_of_birth = None
		user.avatar = 'avatars/default.png'

		user.save()

		return JsonResponse({'old_username': userOldUsername, 'new_username': user.username}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################

@api_view(['PUT'])
@login_required
@permission_classes([IsAuthenticated])
@csrf_protect
def updateAnonymousStatus(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		user.isAnonymous = True
		user.save()

		return JsonResponse({'isAnonymous': user.isAnonymous}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################


@api_view(['GET'])
@login_required
@permission_classes([IsAuthenticated])
def getAnonymousStatus(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		return JsonResponse({'isAnonymous': user.isAnonymous}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



##################################################
##           	DELETE ACCOUNT VIEWS      	    ##
##################################################


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@csrf_protect
def deleteUserFriendships(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		try:
			friendships = CustomUser.objects.filter(friends=user)
			print('friendships to delete:', friendships)

			for friendship in friendships:
				friendship.friends.remove(user)
			
			return JsonResponse({'success': 'User friendships deleted successfully'}, status=status.HTTP_200_OK)

		except Exception as e:
			print(f'Error: {str(e)}')
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	except CustomUser.DoesNotExist:
		return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
	except Exception as e:
		print(f'Error: {str(e)}')
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@csrf_protect
def deleteUser(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

		user.delete()
		return Response({'success': 'User account deleted successfully'}, status=status.HTTP_200_OK)

	except Exception as e:
		print(f'Error: {str(e)}')
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


##################################################
##          DELETE INACTIVE USERS VIEWS   	    ##
##################################################


@api_view(['GET'])
@csrf_protect
def getInactiveUsersID(request):
	try:
		users = CustomUser.objects.all()
		inactive_users_id = []

		time = timezone.now()

		for user in users:
			if user.last_login is not None:
				# cutoffTime = user.last_login + timezone.timedelta(minutes=2)
				cutoffTime = user.last_login + timezone.timedelta(days=3*365)
				if time > cutoffTime and user.is_online == False:
					inactive_users_id.append(user.id)

		return JsonResponse(inactive_users_id, safe=False, status=status.HTTP_200_OK)

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################################


@api_view(['POST'])
def deleteInactiveUsersFriends(request):
	try:
		usersToDeleteID = request.data.get('inactiveUsersID', [])
		if isinstance(usersToDeleteID, str):
			try:
				usersToDeleteID = [int(id) for id in usersToDeleteID.split(",")]
			except ValueError:
				return Response({'error': 'Invalid user ID format'}, status=status.HTTP_400_BAD_REQUEST)

		if not usersToDeleteID:
				return Response({'error': 'No matching users found'}, status=status.HTTP_200_OK)

		friendships = CustomUser.objects.filter(Q(friends__id__in=usersToDeleteID))
		friendships.delete()

		return JsonResponse({'success': 'Inactive users\' friendships deleted successfully'}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



##################################################
##           CHECK PASSWORD VIEWS	            ##
##################################################


@csrf_exempt
def checkUserPassword(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			username = data.get('username')
			password = data.get('password')

			# Check if the user exists
			try:
				user = CustomUser.objects.get(username=username)
				# Check if the password is correct
				if check_password(password, user.password):
					return JsonResponse({'valid': True}, status=status.HTTP_200_OK)
				else:
					return JsonResponse({'valid': False}, status=status.HTTP_200_OK)
			except CustomUser.DoesNotExist:
				return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

		except json.JSONDecodeError:
			return JsonResponse({'error': 'Invalid JSON format'}, status=400)
	
	return JsonResponse({'error': 'Invalid request method'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)