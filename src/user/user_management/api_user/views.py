from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from django.contrib.auth.forms import SetPasswordForm
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from api_user.models import CustomUser
from .forms import CustomUserRegistrationForm
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from rest_framework.permissions import AllowAny
from django.shortcuts import render, redirect
# from rest_framework.views import APIView
from rest_framework import generics, status, permissions
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import JsonResponse
from django.shortcuts import redirect
from django.core.mail import send_mail
import pyotp, os, json, base64, logging
from django.conf import settings
from .serializers import UsernameSerializer  #TEST CARO


#########################################


# For user registration

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def addUser(request):
	try:
		data = json.loads(request.body)
		print(f"Received data: {data}") # DEBUG
	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)

	form = CustomUserRegistrationForm(data)

	if form.is_valid():
		user = form.save(commit=False)
		user.set_password(form.cleaned_data['password'])
		user.save()
		return JsonResponse(form.cleaned_data, status=status.HTTP_201_CREATED)

	else:
		print(f"Form errors: {form.errors}") # DEBUG
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

		print(f'SignInUser json data: {data}') # DEBUG

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
					return JsonResponse({'access': access_token, 'refresh': refresh_token, 'is2fa': False}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'error': 'Invalid username or password'}, status=403)

	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON'}, status=401)
	except Exception as e:
		print(f'Unexpected error: {str(e)}') # DEBUG
		return Response({'error': 'Internal Server Error'}, status=500)


#########################################


# Get authenticated user's data

@api_view(['GET'])
@login_required
@permission_classes([IsAuthenticated])
def currentlyLoggedInUser(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=401)

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
			'avatar': avatar
		}

		return JsonResponse(data, status=200)

	except Exception as e:
		return Response({'error': str(e)}, status=500)


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
		return Response({'error': 'User not authenticated'}, status=401)


#########################################


# Get avatars and usernames of all users

# @api_view(['GET'])
# @login_required
# @permission_classes([IsAuthenticated])
# def getAllUsers(request):
# 	try:
# 		user = request.user
# 		if not user.is_authenticated:
# 			return Response({'error': 'User not authenticated'}, status=401)

# 		try:
# 			users = CustomUser.objects.all()
# 			avatars = []
		
# 			for user in users:
# 				avatar_image_path = user.avatar.path
# 				with default_storage.open(avatar_image_path, 'rb') as avatar_image:
# 					avatar = base64.b64encode(avatar_image.read()).decode('utf-8')
# 				avatars.append({'username': user.username, 'avatar': avatar})

# 			return JsonResponse(avatars, safe=False, status=200)

# 		except Exception as e:
# 			return Response({'error': str(e)}, status=500)

# 	except Exception as e:
# 		return Response({'error': str(e)}, status=500)


# Returns all users id and username for dashboard page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllUsers(request):
	try:
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'User not authenticated'}, status=401)

		try:
			print(f'User: {user}')
			users = CustomUser.objects.all()
			print(f'Users: {users}')
			users_info = []

			for user in users:
				users_info.append({'username': user.username, 'id': user.id})

			print(f'Users info: {users_info}')
			return JsonResponse(users_info, safe=False, status=200)

		except Exception as e:
			print(f'Unexpected error: {str(e)}')
			return Response({'error': str(e)}, status=500)

	except Exception as e:
		print(f'Unexpected error: {str(e)}')
		return Response({'error': str(e)}, status=500)
 


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendAvatar(request, user_id):
	try:
		print('user id: ', user_id)
		user = CustomUser.objects.get(id=user_id)
		print('user: ', user)
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
			return Response({'error': 'User not authenticated'}, status=401)

		form = SetPasswordForm(user, request.data)

		if form.is_valid():
			form.save()
			return Response({'success': 'Password changed successfully'}, status=status.HTTP_200_OK)
		else:
			return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
	
	except Exception as e:
		return Response({'error': str(e)}, status=500)



#########################################


#For checking if a user is connected

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkAuthentication(request):
	user = request.user
	if not user.is_authenticated:
			return Response({'authenticated': False}, status=401)
	return Response({'authenticated': True}, status=200)


#########################################


# For checking if old password is correct

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verifyPassword(request):
	user = request.user
	current_password = request.data.get('current_password')

	print(f'User: {user}') # DEBUG
	print(f'Current password: {current_password}') # DEBUG

	if not current_password:
		return Response({'error': 'Current password is required'}, status=status.HTTP_400_BAD_REQUEST)

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
		return Response({'error': 'New password is required'}, status=status.HTTP_400_BAD_REQUEST)

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
			return Response({'error': 'User not authenticated'}, status=401)

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
			return Response({'error': 'User not authenticated'}, status=401)

		print(f'Updating user avatar (updateAvatar)...') # DEBUG

		data = request.data.get('avatar_input')
		if not data:
			return Response({'error': 'No avatar data provided'}, status=400)

		try:
			avatar_data = base64.b64decode(data)
		except Exception as e:
			return Response({'error de decode64': f'Invalid image data: {str(e)}'}, status=405)

		username = user.username
		avatar_dir = os.path.join(settings.MEDIA_ROOT, 'avatars')
		avatar_path = os.path.join(avatar_dir, f'{username}.png')

		print(f'Username: {username}') # DEBUG
		print(f'Avatar path: {avatar_path}') # DEBUG

		try:
			with open(avatar_path, 'wb') as f:
				f.write(avatar_data)
		except Exception as e:
			print(f'Error de open: {str(e)}')
			return Response({'error de open': str(e)}, status=500)

		user.avatar = avatar_path
		print(f'Avatar path: {user.avatar}') # DEBUG

		user.save()
		print(f'Avatar updated (updateAvatar())...') # DEBUG

		return Response({'success': 'Avatar updated successfully'}, status=status.HTTP_200_OK)	

	except Exception as e:
		print(f'Error: {str(e)}') # DEBUG
		return Response({'error': str(e)}, status=500)




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
		str(os.getenv('EMAIL_HOST_USER')),
		['traans.een.daance@gmail.com'],
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
		print('totp: ', totp.now())
		if totp.verify(code):
			login(request, user)
			refresh = RefreshToken.for_user(request.user)
			access_token = str(refresh.access_token)
			refresh_token = str(refresh)

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


