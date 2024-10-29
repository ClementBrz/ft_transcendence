/* TO DO KARL

    Cher Karl,

    Bienvenu sur la merveilleuse page de Profil.
    Tu seras heureux de retrouver mes commentaires ci-dessous pour te guider dans ce voyage vers le Frontend.

    Il y a bcp de boutons sur cette page :

    1. Change Password
    Le bouton s'appelle "changePasswordButton" et a pour id "change-password-button".
    Il redirige vers la page "/change-password" lorsqu'on clique dessus.
    Il faut le mettre proche/en dessous/a coté du password.

    2. Friends
    Le bouton s'appelle "friendsButton" et a pour id "friends-button".
    Il redirige vers la page "/friends" lorsqu'on clique dessus.
    Tu peux le mettre où tu veux.

    3. Update Profile
    Le bouton s'appelle "updateProfileButton" et a pour id "update-profile-button".
    Le bouton doit disparaitre si l'utilisateur est en mode édition de son profil (si il est dans profileEditMode()).
    En gros, il doit disparaitre si l'utilisateur clique dessus, et réapparaitre une fois qu'il a fini de modifier son profil (après avoir cliqué sur "Save changes" et que la sauvegarde a été réussie).
    
    4. Logout
    Le bouton s'appelle "logoutButton" et a pour id "logout-button".
    Il redirige vers la page "/sign-in" lorsqu'on clique dessus.
    Il faut le mettre en bas de la page, à droite ou ailleurs, juste il faut le mettre un peu a part quoi.

    5. Delete account
    Le bouton s'appelle "deleteAccountButton" et a pour id "delete-account-button".
    Il affiche une boite de dialogue pour demander à l'utilisateur s'il est sûr de vouloir supprimer son compte.
    Je pense tu peux le placer proche de Logout button.
    
    6. Anonymize data
    Le bouton s'appelle "anonymizeButton" et a pour id "anonymize-button".
    Il affiche une boite de dialogue pour demander à l'utilisateur s'il est sûr de vouloir anonymiser ses données.
    Je pense tu peux le placer proche de Delete account et Logout button ? Maybe ?
    Il faut que le bouton disparaisse si l'utilisateur est déjà anonyme (on peut vérifier ça avec getUserAnonymousStatus()).
    Quand un user anonymise son compte, je l'enregistre comme is_anonymous = true dans la base de données.


    Autre point :
    Le Two-Factor Authentication field est dégueulasse actuellement. Normalement c'est une case à cocher mais pour l'instant la case est méconnaissable.

*/


/***********************************************\
-					IMPORTS						-
\***********************************************/
import { DEBUG, setSignedInState }
from '../../main.js';

import { apiRequest, getCookie }
from './signin.js';

import { getIdentifier, checkIdentifierType, allValuesAreValid, sendErrorToFrontend }
from './signup.js';

/***********************************************\
*                   RENDERING                   *
\***********************************************/

export function renderProfile()
{
    // Create a container for the profile information
    const container = document.createElement('div');
    container.setAttribute('id', 'profile-container');

    // Create title for the profile
    const profileTitle = document.createElement('h1');
    profileTitle.textContent = 'My Profile';

//TO-DO Karl t'es beau, corrige moi ca et je leche l'oreille:
// quand je suis log avec un utilisateur et que 
// je suis sur son profile puis que je me delog, 
// lorsque je clique sur le bouton page precedente
// je reviens sur la page profile et je peux voir
// les infos de l'utilisateur tout juste deconnecte,
// pour ne plus le voir il faut que je fasse un refresh

    // Create an image element for the avatar
    const avatarElement = document.createElement('img');
    avatarElement.setAttribute('id', 'avatar');
    avatarElement.setAttribute('alt', 'User Avatar');
    avatarElement.style.width = '150px';
    avatarElement.style.height = '150px';

    container.appendChild(avatarElement);

    // Form element
    const avatarForm = document.createElement('form');
    avatarForm.setAttribute('id', 'avatar_form');

    // Error message container
    const errorMessageContainer = document.createElement('div');
    errorMessageContainer.setAttribute('id', 'error-messages-avatar');
    errorMessageContainer.classList.add('error-messages-avatar');
    avatarForm.appendChild(errorMessageContainer);


    /********** PERSONAL INFORMATION **********/


    // Create section for personal information
    const personalInfoSection = document.createElement('section');
    personalInfoSection.setAttribute('id', 'personal-info');

    const personalInfoTitle = document.createElement('h2');
    personalInfoTitle.textContent = 'Personal Information';

    // Create elements for user data
    const firstNameElement = document.createElement('p');
    firstNameElement.setAttribute('id', 'first_name');

    const lastNameElement = document.createElement('p');
    lastNameElement.setAttribute('id', 'last_name');

    const usernameElement = document.createElement('p');
    usernameElement.setAttribute('id', 'username');
    
    const dobElement = document.createElement('p');
    dobElement.setAttribute('id', 'date_of_birth');

    const passwordElement = document.createElement('p');
    passwordElement.setAttribute('id', 'password');

    const changePasswordButton = document.createElement('button');
    changePasswordButton.setAttribute('id', 'change-password-button');
    changePasswordButton.textContent = 'Change Password';

    const emailElement = document.createElement('p');
    emailElement.setAttribute('id', 'email');

    // Append elements to container
    personalInfoSection.appendChild(personalInfoTitle);
    personalInfoSection.appendChild(firstNameElement);
    personalInfoSection.appendChild(lastNameElement);
    personalInfoSection.appendChild(usernameElement);
    personalInfoSection.appendChild(dobElement);
    personalInfoSection.appendChild(passwordElement);
    personalInfoSection.appendChild(changePasswordButton);
    personalInfoSection.appendChild(emailElement);

    // Create a logout button
    const logoutButton = document.createElement('button');
    logoutButton.setAttribute('id', 'logout-button');
    logoutButton.textContent = 'Log Out';

    // Create an Update Profile button
    const updateProfileButton = document.createElement('button');
    updateProfileButton.setAttribute('id', 'update-profile-button');
    updateProfileButton.textContent = 'Update profile';

    // Append all elements to container
    container.appendChild(profileTitle);
    container.appendChild(personalInfoSection);
    container.appendChild(logoutButton);
    container.appendChild(updateProfileButton);

    // Fetch user data and display it

    let userData_edit = null;

    fetchUserData()
        .then(userData =>
        {
            if (userData || DEBUG)
                console.log(userData);
            else
                console.log('No user data found');

            userData_edit = userData;

            firstNameElement.textContent = `First Name: ${userData.first_name}`;
            lastNameElement.textContent = `Last Name: ${userData.last_name}`;
            usernameElement.textContent = `Username: ${userData.username}`;
            dobElement.textContent = `Date of Birth: ${userData.date_of_birth || 'Not provided'}`;
            emailElement.textContent = `Email: ${userData.email}`;

            // Password display in asterisks
            const passwordLength = 8;
            const numAsterisks = Math.max(0, passwordLength);
            const passwordText = `Password: ${'*'.repeat(numAsterisks)}`;
            passwordElement.textContent = passwordText;

            avatarElement.src = `data:image/png;base64,${userData.avatar}`;

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


        /***************** FRIENDS *****************/
        
        // bouton pour aller sur la page friends
        const friendsButton = document.createElement('button');
        friendsButton.setAttribute('id', 'friends-button');
        friendsButton.textContent = 'Friends';
        container.appendChild(friendsButton);


        /***************** 2FA *****************/

        // case pour activer le 2fa
        const twoFactorAuthContainer = document.createElement('div');
        twoFactorAuthContainer.className = 'form-group';

        const twoFactorAuthLabel = document.createElement('label');
        twoFactorAuthLabel.setAttribute('for', 'twoFactorAuthCheckbox');
        twoFactorAuthLabel.textContent = 'Two-Factor Authentication';

        const twoFactorAuthCheckbox = document.createElement('input');
        twoFactorAuthCheckbox.type = 'checkbox';
        twoFactorAuthCheckbox.id = 'twoFactorAuthCheckbox';
        twoFactorAuthCheckbox.className = 'form-control';

        twoFactorAuthContainer.appendChild(twoFactorAuthLabel);
        twoFactorAuthContainer.appendChild(twoFactorAuthCheckbox);
        container.appendChild(twoFactorAuthContainer);

        document.addEventListener('DOMContentLoaded', async () => {
            const is2fa = await getUser2FAStatus();
            if (is2fa !== null) {
                twoFactorAuthCheckbox.checked = is2fa;
            }
        });

        twoFactorAuthCheckbox.addEventListener('change', () => {
            const is2fa = twoFactorAuthCheckbox.checked;
            updateUser2FAStatus(is2fa);
        });



        /************** ANONYMIZE DATA **************/
        
        
        // bouton pour anonymiser les données
        const anonymizeButton = document.createElement('button');
        anonymizeButton.setAttribute('id', 'anonymize-button');
        anonymizeButton.textContent = 'Anonymize Data';
        
        container.appendChild(anonymizeButton);

        // Cacher le bouton si le user est déjà anonyme
        const isAnonymous = getUserAnonymousStatus();

        if (isAnonymous === false)
        {
            const anonymizeButton = document.getElementById('anonymize-button');

            if (anonymizeButton)
                anonymizeButton.style.display = 'block';
        }
        else
        {
            const anonymizeButton = document.getElementById('anonymize-button');
    
            if (anonymizeButton)
                anonymizeButton.style.display = 'none';
        }


        // Event listener for anonymize button
        anonymizeButton.addEventListener('click', async () =>
        {
            const userConfirmation = confirm('Are you sure you want to anonymize your data?\nThis action cannot be undone.');
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
            if (localStorage.getItem('username'))
                localStorage.removeItem('username');
            setSignedInState(false);
            navigateTo('/sign-in');
        });


        /************** DELETE ACCOUNT **************/

        // bouton pour supprimer le compte
        const deleteAccountButton = document.createElement('button');
        deleteAccountButton.setAttribute('id', 'delete-account-button');
        deleteAccountButton.textContent = 'Delete Account';
        container.appendChild(deleteAccountButton);

        deleteAccountButton.addEventListener('click', async () =>
        {
            const confirmation = confirm("Are you sure you want to delete your account? This action is irreversible.");
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


    return container;
}



/***********************************************\
*              FETCH DATA FUNCTIONS             *
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

// Fetch game history data from the API
// async function fetchGameHistoryData() {
//     try {
//         const userData = await apiRequest('/api/dashboard/getGameHistory/', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         if (DEBUG) {
//             console.log("userData = ", userData);
//         }
//         return userData;
//     } catch (error) {
//         console.error('Error: fetch userData', error);
//         throw error; // Re-throw the error
//     }
// }


/***********************************************\
*           PROFILE EDIT MODE FUNCTIONS         *
\***********************************************/

async function profileEditMode(userData_edit, personalInfoSection)
{
    // Profile elements
    const firstNameElement = document.getElementById('first_name');
    const lastNameElement = document.getElementById('last_name');
    const usernameElement = document.getElementById('username');
    const dobElement = document.getElementById('date_of_birth');
    const emailElement = document.getElementById('email');

    // Fields displayed un edit-mode
    firstNameElement.innerHTML = `<label for="first_name_input">First Name:</label><input type="text" id="first_name_input" value="${userData_edit.first_name}">`;
    lastNameElement.innerHTML = `<label for="last_name_input">Last Name:</label><input type="text" id="last_name_input" value="${userData_edit.last_name}">`;
    usernameElement.textContent = `Username: ${userData_edit.username}`;
    dobElement.innerHTML = `<label for="dob_input">Date of Birth:</label><input type="date" id="dob_input" value="${userData_edit.date_of_birth}">`;
    emailElement.innerHTML = `<label for="email_input">Email:</label><input type="email" id="email_input" value="${userData_edit.email}">`;


    // File input for avatar
    const avatarLabel = document.createElement('label');
    avatarLabel.setAttribute('for', 'avatar_input');
    avatarLabel.textContent = 'Upload avatar image (jpeg, jpg or png):';
    personalInfoSection.appendChild(avatarLabel);

    const avatarInput = document.createElement('input');
    avatarInput.setAttribute('type', 'file');
    avatarInput.setAttribute('id', 'avatar_input');
    avatarLabel.appendChild(avatarInput);


    // Save Button
    const saveButton = document.createElement('button');
    saveButton.setAttribute('id', 'save-profile-button');
    saveButton.textContent = 'Save changes';
    personalInfoSection.appendChild(saveButton);
    avatarLabel.appendChild(saveButton);

    saveButton.addEventListener('click', async (event) =>
    {
        event.preventDefault();

        // Save new input data in userData_edit
        const updatedFirstName = document.getElementById('first_name_input').value;
        const updatedLastName = document.getElementById('last_name_input').value;
        const updatedDob = document.getElementById('dob_input').value;
        const updatedEmail = document.getElementById('email_input').value;

        userData_edit.first_name = updatedFirstName;
        userData_edit.last_name = updatedLastName;
        userData_edit.dob = updatedDob;
        userData_edit.email = updatedEmail;

        const avatarFile = document.getElementById('avatar_input').files[0];

        const isValidData = Boolean(verifyProfileChanges());

        if (DEBUG)
            console.log('Updated values are valid:', isValidData);

        if (isValidData === true)
        {
            if (DEBUG)
                console.log('Entering if to save new data.');

            if (avatarFile && await verifyAvatarFile(avatarFile, saveButton, avatarLabel, avatarInput))
                await saveNewAvatar(avatarFile);
            await saveProfileChanges(userData_edit);
            window.location.reload();
        }
    });
}



async function verifyProfileChanges()
{
    // Fetch the values from the input fields
    const firstName = getIdentifier('first_name_input');
    const lastName = getIdentifier('last_name_input');
    const dob = getIdentifier('dob_input');
    const email = getIdentifier('email_input');

    // Check the types based on validation logic
    const first_name_type = checkIdentifierType(firstName, 'first_name_input');
    const last_name_type = checkIdentifierType(lastName, 'last_name_input');
    const username_type = 'username';
    const date_of_birth_type = checkIdentifierType(dob, 'date_of_birth_input');
    const password_type = 'password';
    const email_type = checkIdentifierType(email, 'email_input');

    if (DEBUG)
        console.log('First name type:', first_name_type, '\nLast name type:', last_name_type, '\nUsername type:', username_type, '\nDate of birth type:', date_of_birth_type, '\nPassword type:', password_type, '\nEmail type:', email_type);

    const allValid = Boolean(allValuesAreValid(first_name_type, last_name_type, username_type, date_of_birth_type, password_type, email_type));

    if (allValid === false)
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

async function verifyAvatarFile(avatarFile, saveButton, avatarLabel, avatarInput)
{
    if (DEBUG)
        console.log('Verifying avatar file...');

    let result = true;

    if (!saveButton || !avatarLabel)
    {
        console.error('Save button or avatar label not found.');
        return false;
    }

    if (!avatarLabel.contains(saveButton))
    {
        console.error('Save button is not a child of avatar label.');
        return false;
    }

    if (!avatarInput)
    {
        console.error('Avatar input not found.');
        return false;
    }

    const avatarForm = avatarInput.parentElement;

    // Remove existing error messages
    const existingError = avatarForm.querySelector('.error-messages-avatar');
    if (existingError)
        existingError.remove();

    // Check if the file is not empty
    if (!avatarFile || !avatarFile.size || avatarFile.name === '')
    {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-messages-avatar';
        errorMessage.textContent = 'Select a file';
        avatarLabel.insertBefore(errorMessage, saveButton);
        result = false;
    }

    // Check if the file type is jpeg, jpg, or png
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(avatarFile.type))
    {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-messages-avatar';
        errorMessage.textContent = 'File type not supported (only jpeg, jpg, png)';
        avatarLabel.insertBefore(errorMessage, saveButton);
        result = false;
    }

    // Check if the file size is no more than 1 MB
    if (avatarFile.size > 1000000)
    {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-messages-avatar';
        errorMessage.textContent = 'File too large (max 1 MB)';
        avatarLabel.insertBefore(errorMessage, saveButton);
        result = false;
    }

    if (DEBUG)
        console.log('Avatar file verification result:', result);

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

        const response = await apiRequest('/api/users/updateProfile/',
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
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1]; // Get base64 data without the prefix
                const response = await apiRequest('/api/users/updateAvatar/',
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
*                 GDPR FUNCTIONS                *
\***********************************************/


async function updateUserAnonymousStatus()
{
    try
    {
        const response = await apiRequest('/api/users/updateAnonymousStatus/',
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
        const response = await apiRequest('/api/users/anonymizeUserData/',
        {
            method: 'PUT',
            headers:
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        });

        alert('Your data has been anonymized successfully.\nPlease use your new username for future logins.');
        window.location.href = '/profile';

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
        const response = await apiRequest('/api/users/getAnonymousStatus/', {
            method: 'GET',
        });

        // const data = await response.json();
        return response;
    }
    catch (error)
    {
        console.error('Error fetching anonymous status:', error);
        return null;
    }
}



/***********************************************\
*                 2FA FUNCTIONS                 *
\***********************************************/

async function getUser2FAStatus()
{
    try
    {
        const response = await apiRequest('api/users/get2FAStatus/', {
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
        const response = await apiRequest('/api/users/update2FAStatus/',
        {
            method: 'PUT',
            headers:
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is2fa }),
        });

        console.log('2FA status updated successfully.');

    }
    catch (error)
    {
        console.error('Error updating 2FA status:', error);
        alert('Failed to update 2FA status: ' + error.message);
    }
}


/***********************************************\
*            DELETE ACCOUNT FUNCTIONS           *
\***********************************************/


async function deleteUserAccount()
{
    console.log('Deleting account...');
    try
    {
        const response = await apiRequest('/api/users/deleteAccount/', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });

        console.log('Account deleted successfully.');
        alert('Your account has been deleted successfully.');

        window.location.href = '/sign-in';

    }
    catch (error)
    {
        console.error('Error during account deletion:', error);
        alert('An error occurred while trying to delete your account.');
    }
}
