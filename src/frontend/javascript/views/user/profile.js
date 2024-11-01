/***********************************************\
-					IMPORTS						-
\***********************************************/
import { DEBUG, navigateTo, setSignedInState }
from '../../main.js';

import { renderNavbar }
from '../navbar/navbar.js';

import { apiRequest, getAuthHeaders, getCookie }
from './signin.js';

import { getIdentifier, checkIdentifierType, allValuesAreValid, sendErrorToFrontend }
from './signup.js';

/***********************************************\
*				   RENDERING					*
\***********************************************/

export function renderProfile()
{
	// Create a container for the profile information
	const	container = document.createElement('div');
	container.setAttribute('id', 'profile-container');
	container.classList.add('container', 'mt-4');

	// Create title for the profile
	const	profileTitle = document.createElement('h1');
	profileTitle.classList.add('profile-title');
	profileTitle.textContent = 'My Profile';
	container.appendChild(profileTitle);

	// Create an image element for the avatar
	const	avatarElement = document.createElement('img');
	avatarElement.setAttribute('id', 'avatar');
	avatarElement.setAttribute('alt', 'User Avatar');
	avatarElement.classList.add('img-fluid', 'profile-avatar');

	const	rightavatarElement = document.createElement('img');
	rightavatarElement.setAttribute('id', 'avatar');
	rightavatarElement.setAttribute('alt', 'User Avatar');
	rightavatarElement.classList.add('img-fluid', 'profile-avatar', 'right-avatar');

	container.appendChild(avatarElement);
	container.appendChild(rightavatarElement);

	// Form element
	const	avatarForm = document.createElement('form');
	avatarForm.setAttribute('id', 'avatar_form');

	// Error message container
	const	errorMessageContainer = document.createElement('div');
	errorMessageContainer.setAttribute('id', 'error-messages-avatar');
	errorMessageContainer.classList.add('error-messages-avatar');
	avatarForm.appendChild(errorMessageContainer);


	/********** PERSONAL INFORMATION **********/


	// Create section for personal information
	const	personalInfoSection = document.createElement('section');
	personalInfoSection.setAttribute('id', 'personal-info');

	// Create elements for user data
	const	firstNameElement = document.createElement('p');
	firstNameElement.setAttribute('id', 'first_name');
	firstNameElement.classList.add('profile-text');

	const	lastNameElement = document.createElement('p');
	lastNameElement.setAttribute('id', 'last_name');
	lastNameElement.classList.add('profile-text');

	const	usernameElement = document.createElement('p');
	usernameElement.setAttribute('id', 'username');
	usernameElement.classList.add('profile-text');
	
	const	dobElement = document.createElement('p');
	dobElement.setAttribute('id', 'date_of_birth');
	dobElement.classList.add('profile-text');

	const	passwordContainer = document.createElement('div');
	passwordContainer.classList.add('password-container');

	const	passwordElement = document.createElement('p');
	passwordElement.setAttribute('id', 'password');
	passwordElement.classList.add('profile-text');

	const	changePasswordButton = document.createElement('button');
	changePasswordButton.setAttribute('id', 'change-password-button');
	changePasswordButton.classList.add('btn', 'btn-home', 'profile-button');
	changePasswordButton.textContent = 'Change Password';

	const	emailElement = document.createElement('p');
	emailElement.classList.add('profile-text');
	emailElement.setAttribute('id', 'email');
	
	// Append elements to container
	personalInfoSection.appendChild(firstNameElement);
	personalInfoSection.appendChild(lastNameElement);
	personalInfoSection.appendChild(usernameElement);
	personalInfoSection.appendChild(dobElement);
	personalInfoSection.appendChild(emailElement);
	
	// Append password text and button to the password container
	passwordContainer.appendChild(passwordElement);
	passwordContainer.appendChild(changePasswordButton);

	// Append the password container to the personal info section
	personalInfoSection.appendChild(passwordContainer);

	// Create a logout button
	const	logoutButton = document.createElement('button');
	logoutButton.setAttribute('id', 'logout-button');
	logoutButton.classList.add('btn', 'btn-home', 'profile-button');
	logoutButton.textContent = 'Log Out';

	// Container for 2FA + update profile
	const	buttonsContainer1 = document.createElement('div');
	buttonsContainer1.classList.add('container-btn-profile');

	// Create an Update Profile button
	const	updateProfileButton = document.createElement('button');
	updateProfileButton.setAttribute('id', 'update-profile-button');
	updateProfileButton.classList.add('btn', 'btn-home', 'profile-button');
	updateProfileButton.textContent = 'Update profile';

	container.appendChild(personalInfoSection);

	// Fetch user data and display it

	let userData_edit = null;

    fetchUserData()
        .then(userData =>
        {
            if (!userData)
                console.log('No user data found');

			userData_edit = userData;

			firstNameElement.textContent = `First Name: ${userData.first_name}`;
			lastNameElement.textContent = `Last Name: ${userData.last_name}`;
			usernameElement.textContent = `Username: ${userData.username}`;
			dobElement.textContent = `Date of Birth: ${userData.date_of_birth || 'Not provided'}`;
			emailElement.textContent = `Email: ${userData.email}`;

			// Password display in asterisks
			const	passwordLength = 8;
			const	numAsterisks = Math.max(0, passwordLength);
			const	passwordText = `Password: ${'*'.repeat(numAsterisks)}`;
			passwordElement.textContent = passwordText;

			avatarElement.src = `data:image/png;base64,${userData.avatar}`;
			rightavatarElement.src = `data:image/png;base64,${userData.avatar}`;

		})
		.catch(error =>
		{
			console.error('Error fetching user data:', error);
			container.innerHTML = '<p>Failed to load profile data.</p>';
		});


		// Event listener for change password button
		changePasswordButton.addEventListener('click', () =>
		{
			navigateTo('/change-password');
		});

		

		/********** UPDATE PROFILE **********/

		// Event listener for update profile button
		updateProfileButton.addEventListener('click', () =>
		{
			profileEditMode(userData_edit, personalInfoSection);
		});

		// Container for Friends + dashboard
		const	buttonsContainer2 = document.createElement('div');
		buttonsContainer2.classList.add('container-btn-profile');
	
		/***************** FRIENDS *****************/
		
		// bouton pour aller sur la page friends
		const	friendsButton = document.createElement('button');
		friendsButton.setAttribute('id', 'friends-button');
		friendsButton.classList.add('btn', 'btn-home', 'profile-button');
		friendsButton.textContent = 'Friends';

		friendsButton.addEventListener('click', () =>
			{
				navigateTo('/friends');
			});


		/***************** DASHBOARD *****************/
		
		// bouton pour aller sur la page dashboard
		const	dashboardButton = document.createElement('button');
		dashboardButton.setAttribute('id', 'dashboard-button');
		dashboardButton.classList.add('btn', 'btn-home', 'profile-button');
		dashboardButton.textContent = 'Dashboard';

		dashboardButton.addEventListener('click', () =>
			{
				navigateTo('/dashboard');
			});

        /***************** RGPD *****************/
        
        // bouton pour envoyer les donnees perso de l'utilisateur au format json
        const requestInfosButton = document.createElement('button');
        requestInfosButton.setAttribute('id', 'request-infos-button');
		requestInfosButton.classList.add('btn', 'btn-home', 'profile-button');
        requestInfosButton.textContent = 'Request My Infos';
        container.appendChild(requestInfosButton);

        requestInfosButton.addEventListener('click', () => {
            apiRequest('/api/dashboard/getGameHistory/', {
                method: 'GET',
            })
            .then(games => {
                apiRequest('/api/users/send-infos-to-user/', {
                    method: 'POST',
                    body: JSON.stringify(games),
                })
                .catch(error => {
                    console.error('Error sending their personnal informations to the user:', error);
                });
            })
            .catch(error => {
                console.error('Error user game history:', error);
            })
        });


		/***************** 2FA *****************/

		// case pour activer le 2fa
		const	twoFactorAuthContainer = document.createElement('div');
		twoFactorAuthContainer.className = 'form-group';

		const	twoFactorAuthLabel = document.createElement('label');
		twoFactorAuthLabel.setAttribute('for', 'twoFactorAuthCheckbox');
		twoFactorAuthLabel.classList.add('profile-text', 'two-factor-text');
		twoFactorAuthLabel.setAttribute('id', 'two-FA-checkbox');
		twoFactorAuthLabel.textContent = 'Two-Factor Authentication';

		const	twoFactorAuthCheckbox = document.createElement('input');
		twoFactorAuthCheckbox.setAttribute('type', 'checkbox');
		twoFactorAuthCheckbox.setAttribute('id', 'gdpr-acceptance');
		twoFactorAuthCheckbox.classList.add('form-check-input');
		getUser2FAStatus()
			.then (is2fa =>{
				twoFactorAuthCheckbox.checked = is2fa;
			})
			.catch (error => 
			{
				console.error('error:', error);	
			})

		twoFactorAuthContainer.appendChild(twoFactorAuthLabel);
		twoFactorAuthContainer.appendChild(twoFactorAuthCheckbox);

		twoFactorAuthCheckbox.addEventListener('change', async() => {
			const	is2fa = await getUser2FAStatus();
			
			if (is2fa == true)
				await updateUser2FAStatus(false);
			else
				await updateUser2FAStatus(true);
		});

		/************** ANONYMIZE DATA **************/
		
		// Container for data handling
		const	buttonsContainer3 = document.createElement('div');
		buttonsContainer3.classList.add('container-btn-profile');
		
		// bouton pour anonymiser les données
		const	anonymizeButton = document.createElement('button');
		anonymizeButton.setAttribute('id', 'anonymize-button');
		anonymizeButton.classList.add('btn', 'btn-home', 'profile-button');
		anonymizeButton.textContent = 'Anonymize Data';

		const	checkAnonymousStatus = async () =>
		{
			const	status = await getUserAnonymousStatus();
			
			if (DEBUG)
				console.log(status);

			if (status.isAnonymous === false)
			{
				anonymizeButton.style.display = 'block';
			}
			else
			{
				anonymizeButton.style.display = 'none';
			}
		}

		checkAnonymousStatus();

		// Event listener for anonymize button
		anonymizeButton.addEventListener('click', async () =>
		{
			const	userConfirmation = confirm('Are you sure you want to anonymize your data?\nThis action cannot be undone.');
			if (userConfirmation)
			{
				updateUserAnonymousStatus();
				anonymizeUserData();
			}
			else
				console.log('Anonymization cancelled.');
		});

		/***************** LOG OUT *****************/

		// Event listener for logout button
		logoutButton.addEventListener('click', () => {
			set_status_offline();
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			setSignedInState(false);
			renderNavbar();
			if (localStorage.getItem('username'))
				localStorage.removeItem('username');
			setSignedInState(false);
			navigateTo('/sign-in');
		});


		/************** DELETE ACCOUNT **************/

		// bouton pour supprimer le compte
		const	deleteAccountButton = document.createElement('button');
		deleteAccountButton.setAttribute('id', 'delete-account-button');
		deleteAccountButton.classList.add('btn', 'btn-home', 'profile-button');
		deleteAccountButton.textContent = 'Delete Account';

		deleteAccountButton.addEventListener('click', async () =>
		{
			const	confirmation = confirm("Are you sure you want to delete your account? This action is irreversible.");
			if (confirmation)
			{
				await deleteUserAccount();
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				if (localStorage.getItem('username'))
					localStorage.removeItem('username');
				setSignedInState(false);
			}
		});

		// 1
		buttonsContainer1.appendChild(twoFactorAuthContainer);
		buttonsContainer1.appendChild(updateProfileButton);

		// 2
		buttonsContainer2.appendChild(friendsButton);
		buttonsContainer2.appendChild(dashboardButton);
		
		// 3
		buttonsContainer3.appendChild(anonymizeButton);
		buttonsContainer3.appendChild(requestInfosButton);
		buttonsContainer3.appendChild(deleteAccountButton);

		// All
		personalInfoSection.appendChild(buttonsContainer1);
		personalInfoSection.appendChild(buttonsContainer2);
		personalInfoSection.appendChild(buttonsContainer3);
		personalInfoSection.appendChild(logoutButton);

	return container;
}



/***********************************************\
*				FETCH DATA FUNCTIONS			*
\***********************************************/

// Fetch user data from the API
export async function fetchUserData() {
	return apiRequest('/api/users/currentlyLoggedInUser/', {
		method: 'GET',
	})
	.catch(error => {
		console.error('Error fetching user profile data:', error);
	});
}

async function set_status_offline()
{
	apiRequest('/api/users/loggout-user/', {
		method: 'PUT',
	})
	.catch(error => {
		console.error('Error setting status to offline:', error);
	});
}

/***********************************************\
*		   PROFILE EDIT MODE FUNCTIONS		 *
\***********************************************/

async function profileEditMode(userData_edit, personalInfoSection)
{
	// Profile elements
	const	firstNameElement = document.getElementById('first_name');
	const	lastNameElement = document.getElementById('last_name');
	const	usernameElement = document.getElementById('username');
	const	dobElement = document.getElementById('date_of_birth');
	const	emailElement = document.getElementById('email');

	// Fields displayed in edit-mode
	firstNameElement.innerHTML = `<label for="first_name_input">First Name:</label><input type="text" class="sign-up-input" id="first_name_input" value="${userData_edit.first_name}">`;
	lastNameElement.innerHTML = `<label for="last_name_input">Last Name:</label><input type="text" class="sign-up-input" id="last_name_input" value="${userData_edit.last_name}">`;
	usernameElement.textContent = `Username: ${userData_edit.username}`;
	dobElement.innerHTML = `<label for="dob_input">Date of Birth:</label><input type="date" class="sign-up-input" id="dob_input" value="${userData_edit.date_of_birth}">`;
	emailElement.innerHTML = `<label for="email_input">Email:</label><input type="email" class="sign-up-input" id="email_input" value="${userData_edit.email}">`;

	hideAllButtonsExcept(['save-profile-button', 'choose-file-button']);

	// File input for avatar
	const	avatarWrapper = document.createElement('div');
	avatarWrapper.classList.add('custom-file-wrapper');
	personalInfoSection.appendChild(avatarWrapper);

	// Create the styled label that acts as the button
	const	avatarLabel = document.createElement('span');
	avatarLabel.classList.add('btn', 'btn-home', 'btn-upload', 'profile-text');
	avatarLabel.textContent = 'Upload avatar image';
	avatarWrapper.appendChild(avatarLabel);

	// Create the hidden file input element
	const	avatarInput = document.createElement('input');
	avatarInput.setAttribute('type', 'file');
	avatarInput.setAttribute('id', 'avatar_input');
	avatarInput.classList.add('custom-file-input');
	avatarInput.style.display = 'none';
	avatarWrapper.appendChild(avatarInput);

	// Trigger file input when label is clicked
	avatarLabel.addEventListener('click', (event) =>
	{
		event.stopPropagation();
		avatarInput.click();
	});

	// Save Button
	const	saveButton = document.createElement('button');
	saveButton.setAttribute('id', 'save-profile-button');
	saveButton.classList.add('btn', 'btn-home', 'profile-button');
	saveButton.textContent = 'Save changes';
	personalInfoSection.appendChild(saveButton);

	saveButton.addEventListener('click', async (event) =>
	{
		event.preventDefault();

		// Save new input data in userData_edit
		const	updatedFirstName = document.getElementById('first_name_input').value;
		const	updatedLastName = document.getElementById('last_name_input').value;
		const	updatedDob = document.getElementById('dob_input').value;
		const	updatedEmail = document.getElementById('email_input').value;

		userData_edit.first_name = updatedFirstName;
		userData_edit.last_name = updatedLastName;
		userData_edit.dob = updatedDob;
		userData_edit.email = updatedEmail;

		const	avatarFile = avatarInput.files[0];

		const	isValidData = verifyProfileChanges();
        // JESS HERE
		// const	isValidData = Boolean(verifyProfileChanges());

        if (DEBUG)
            console.log('isValidData = ', isValidData);

		if (isValidData)
		{
            if (DEBUG)
                console.log('Profile changes are valid.');

			if (avatarFile && await verifyAvatarFile(avatarFile, saveButton, avatarLabel, avatarInput))
				await saveNewAvatar(avatarFile);
			await saveProfileChanges(userData_edit);
			navigateTo('/profile');
		}
	});
}

// Function to hide all buttons except specified ones
function hideAllButtonsExcept(allowedButtonIds)
{
	const	buttons = document.querySelectorAll('#profile-container button');

	buttons.forEach(button =>
	{
		if (!allowedButtonIds.includes(button.id))
		{
			button.style.display = 'none';
		}
	});
}

function verifyProfileChanges()
{
    if (DEBUG)
        console.log('Verifying profile changes...');

	// Fetch the values from the input fields
	const	firstName = getIdentifier('first_name_input');
	const	lastName = getIdentifier('last_name_input');
	const	dob = getIdentifier('dob_input');
	const	email = getIdentifier('email_input');

	// Check the types based on validation logic
	const	first_name_type = checkIdentifierType(firstName, 'first_name_input');
	const	last_name_type = checkIdentifierType(lastName, 'last_name_input');
	const	username_type = 'username';
	const	date_of_birth_type = checkIdentifierType(dob, 'date_of_birth_input');
	const	password_type = 'password';
	const	email_type = checkIdentifierType(email, 'email_input');

	const	allValid = allValuesAreValid(first_name_type, last_name_type, username_type, date_of_birth_type, password_type, email_type);

    if (DEBUG)
        console.log('allValuesAreValid = ', allValid);

	if (allValid == false)
	{
		if (DEBUG)
			console.log('Profile changes are invalid.');

		sendErrorToFrontend(first_name_type, last_name_type, username_type, date_of_birth_type, password_type, email_type);
		return false;
	}
	else
	{
		if (DEBUG)
			console.log('Profile changes are valid.');
		return true;
	}
}

async function verifyAvatarFile(avatarFile, saveButton, avatarLabel, avatarInput) {
	if (DEBUG) console.log('Verifying avatar file...');

	let result = true;

	if (!saveButton)
    {
		console.error('Save button not found.');
		return false;
	}

	if (!avatarInput)
    {
		console.error('Avatar input not found.');
		return false;
	}

	const	avatarForm = avatarInput.parentElement;

	// Remove existing error messages
	const	existingError = avatarForm.querySelector('.error-messages-avatar');
	if (existingError) existingError.remove();

	// Check if the file is not empty
	if (!avatarFile || !avatarFile.size || avatarFile.name === '')
    {
		const	errorMessage = document.createElement('p');
		errorMessage.className = 'error-messages-avatar';
		errorMessage.textContent = 'Select a file';
		avatarLabel.appendChild(errorMessage); // Use append instead of insertBefore
		result = false;
	}

	// Check if the file type is jpeg, jpg, or png
	const	validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
	if (!validTypes.includes(avatarFile.type))
    {
		const	errorMessage = document.createElement('p');
		errorMessage.className = 'error-messages-avatar';
		errorMessage.textContent = 'File type not supported (only jpeg, jpg, png)';
		avatarLabel.appendChild(errorMessage); // Use append instead of insertBefore
		result = false;
	}

	// Check if the file size is no more than 1 MB
	if (avatarFile.size > 1000000)
    {
		const	errorMessage = document.createElement('p');
		errorMessage.className = 'error-messages-avatar';
		errorMessage.textContent = 'File too large (max 1 MB)';
		avatarLabel.appendChild(errorMessage); // Use append instead of insertBefore
		result = false;
	}

	if (DEBUG) console.log('Avatar file verification result:', result);

	return result;
}


async function saveProfileChanges(userData_edit)
{
	if (DEBUG)
	{
		console.log('Saving profile changes...');
		console.log('Userdata =', userData_edit);
	}

	try
	{

		await apiRequest('/api/users/updateProfile/',
		{
			method: 'PUT',
			headers: {  
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'X-CSRFToken': getCookie('csrftoken'),
			},
			body: JSON.stringify({
				email: userData_edit.email,
				date_of_birth: userData_edit.dob,
				first_name: userData_edit.first_name,
				last_name: userData_edit.last_name,
			}),
		});

		console.log('Profile updated successfully.');

	}
	catch (error)
	{
		console.error('Error updating profile:', error.message);
		alert('An error occurred while updating the profile. Please check your new information and try again.');
	}
}

async function saveNewAvatar(avatarFile)
{
	if (DEBUG)
		console.log('Saving new avatar...');

	if (avatarFile)
	{
		try
		{
			const	reader = new FileReader();
			reader.onloadend = async () => {
				const	base64data = reader.result.split(',')[1]; // Get base64 data without the prefix
				const	response = await apiRequest('/api/users/updateAvatar/',
				{
					method: 'PUT',
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'X-CSRFToken': getCookie('csrftoken'),
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ avatar_input: base64data }),
				});

			if (DEBUG)
			{
				console.log('Response:', response); // Log the entire response object
				console.log('Response status:', response.status);
				console.log('Response status text:', response.statusText);
			}
		
			console.log('Avatar updated successfully.');
			};
			reader.readAsDataURL(avatarFile); // Read the file as a data URL
		}
		catch (error)
		{
			console.error('Error updating avatar:', error);
			alert('An error occurred while updating the avatar.');
		}
	}
}

/***********************************************\
*				 GDPR FUNCTIONS				*
\***********************************************/

async function updateUserAnonymousStatus()
{
	try
	{
		await apiRequest('/api/users/updateAnonymousStatus/',
		{
			method: 'PUT',
			headers:
			{
				'Bearer': localStorage.getItem('token'),
				'X-CSRFToken': getCookie('csrftoken'),
				'Content-Type': 'application/json',
			},
		});

		console.log('Anonymous status updated successfully.');

	}
	catch (error)
	{
		console.error('Error updating anonymous status:', error);
		alert('Failed to update anonymous status: ' + error.message);
	}
}

async function anonymizeUserData()
{
    try
    {
        await apiRequest('/api/users/anonymizeUserData/',
        {
            method: 'PUT',
            headers:
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        })
        .then(user=>{
            console.log('old_username = ', user.old_username, 'new_username = ', user.new_username);
            apiRequest('/api/dashboard/anonymiseGameHistory/', {
                method: 'PUT',
                headers:
                {
                    ...getAuthHeaders(),
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            })
            console.log("Finished anonymising GameHistory")
        });

		alert('Your data has been anonymized successfully.\nPlease use your new username for future logins.');
		navigateTo('/profile');

	}
	catch (error)
	{
		console.error('Anonymization error:', error);
		alert('Failed to anonymize data: ' + error.message);
	}
}

async function getUserAnonymousStatus()
{
	try
	{
		const	response = await apiRequest('/api/users/getAnonymousStatus/', {
			method: 'GET',
		});

		return response;
	}
	catch (error)
	{
		console.error('Error fetching anonymous status:', error);
		return null;
	}
}

/***********************************************\
*				 2FA FUNCTIONS				 *
\***********************************************/

async function getUser2FAStatus()
{
	try
	{
		const	response = await apiRequest('api/users/get2FAStatus/', {
			method: 'GET'   
		});
		return response.is2fa;
	}
	catch (error)
	{
		console.error('Error fetching 2FA status:', error);
		return null;
	}

}

async function updateUser2FAStatus(is2fa)
{
	try
	{
		await apiRequest('/api/users/update2FAStatus/',
		{
			method: 'PUT',
			headers:
			{
				// 'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'X-CSRFToken': getCookie('csrftoken'),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ is2fa }),
		});
		console.log('2fa envoye a update = ', is2fa); 
		console.log('2FA status updated successfully.');

	}
	catch (error)
	{
		console.error('Error updating 2FA status:', error);
		alert('Failed to update 2FA status: ' + error.message);
	}
}

/***********************************************\
*			DELETE ACCOUNT FUNCTIONS		   *
\***********************************************/

async function deleteUserAccount()
{
    console.log('Deleting account...');
    try
    {
        // delete user's game history and account
        await apiRequest('/api/dashboard/deleteGameHistory/', {
            method: 'DELETE',
            headers:
            {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        })
        console.log("Finished deleting user's GameHistory");


        // delete friend requests
        await apiRequest('api/users/friends/DeleteUserFriendRequests/', {
            method: 'DELETE',
            headers:
            {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        });
        console.log("Finished deleting user's Friend Requests");


        // delete friendships
        await apiRequest('/api/users/deleteUserFriendships/', {
            method: 'DELETE',
            headers:
            {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        });
        console.log("Finished deleting user's Friendships");


        // delete account
        await apiRequest('/api/users/deleteUser/', {
            method: 'DELETE',
            headers:
            {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        });
        console.log("Finished deleting user's Account");


        console.log('Account deleted successfully.');
        alert('Your account has been deleted successfully.');

        navigateTo('/sign-in');

    }
    catch (error)
    {
        console.error('Error during account deletion:', error);
        alert('An error occurred while trying to delete your account.');
    }
}