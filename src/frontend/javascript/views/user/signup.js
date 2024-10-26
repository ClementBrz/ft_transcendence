/***********************************************\
-					IMPORTS						-
\***********************************************/
import { DEBUG, navigateTo }
from '../../main.js';

import { getCookie }
from './signin.js';

/***********************************************\
*					RENDERING					*
\***********************************************/
export function renderSignUp()
{
	// Main container for the sign-up form
	const	container = document.createElement('div');
	container.classList.add('sign-up-container', 'container');

	// Heading
	const	heading = document.createElement('h1');
	heading.textContent = 'Create your account';
	heading.classList.add('sign-up-title', 'text-center');
	container.appendChild(heading);

	// Form element
	const	form = document.createElement('form');
	form.setAttribute('id', 'sign-up-form');
	form.classList.add('needs-validation', 'row');
	container.appendChild(form);
	
	// Error message container
	const	errorMessageContainer = document.createElement('div');
	errorMessageContainer.setAttribute('id', 'error-messages');
	errorMessageContainer.classList.add('error-messages', 'col-12');
	form.appendChild(errorMessageContainer);

	// Input fields with labels
	const	fields =
	[
		{ label: ' First Name', type: 'text', id: 'first_name', placeholder: 'Enter first name' },
		{ label: ' Last Name', type: 'text', id: 'last_name', placeholder: 'Enter last name' },
		{ label: ' Username', type: 'text', id: 'username', placeholder: 'Enter username', autocomplete: 'username' },
		{ label: ' Date of Birth', type: 'date', id: 'date_of_birth', placeholder: '' },
		{ label: ' Password', type: 'password', id: 'password', placeholder: 'Enter password', autocomplete: 'new-password' },
		{ label: ' Password Confirmation', type: 'password', id: 'password_confirmation', placeholder: 'Enter password confirmation', autocomplete: 'new-password' },
		{ label: ' Email', type: 'text', id: 'email', placeholder: 'Enter email', autocomplete: 'email' }
	];

	fields.forEach(field =>
	{
		const	formGroup = document.createElement('div');
		formGroup.classList.add('form-group', 'col-md-6');

		const	label = document.createElement('label');
		label.setAttribute('for', field.id);
		label.textContent = field.label;
		label.classList.add('form-input', 'sign-up-label', 'form-label');
		formGroup.appendChild(label);

		const	input = document.createElement('input');
		input.setAttribute('type', field.type);
		input.setAttribute('id', field.id);
		input.setAttribute('placeholder', field.placeholder);
		input.classList.add('form-input', 'sign-up-input');

		if (field.autocomplete) input.setAttribute('autocomplete', field.autocomplete);
		if (field.accept) input.setAttribute('accept', field.accept);

		formGroup.appendChild(input);
		form.appendChild(formGroup);
	});

	// Buttons container (submit + back to sign in)
	const	buttonsContainer = document.createElement('div');
	buttonsContainer.classList.add('d-flex', 'justify-content-center', 'col-12', 'mt-3');

	// Submit button
	const	submitButton = document.createElement('button');
	submitButton.setAttribute('type', 'submit');
	submitButton.textContent = 'Submit';
	submitButton.classList.add('btn', 'btn-home', 'sign-up-button');
	submitButton.id = 'submit-button';
	buttonsContainer.appendChild(submitButton);

	// Back to Sign In button
	const	backButton = document.createElement('button');
	backButton.setAttribute('type', 'button');
	backButton.textContent = 'Back to Sign In';
	backButton.classList.add('btn', 'btn-home', 'sign-up-button');
	backButton.id = 'back-button';
	backButton.addEventListener('click', () => navigateTo('/sign-in'));
	buttonsContainer.appendChild(backButton);

	form.appendChild(buttonsContainer);

	return container;
}

export function initializeSignUp()
{
	const	form = document.getElementById('sign-up-form');
	if (form)
	{
		form.addEventListener('submit', function (event)
		{
			event.preventDefault(); // Prevent default form submission

			// First name
			let	first_name = getIdentifier('first_name');
			let	first_name_type = checkIdentifierType(first_name, 'first_name');

			// Last name
			let	last_name = getIdentifier('last_name');
			let	last_name_type = checkIdentifierType(last_name, 'last_name');

			// Username
			let	username = getIdentifier('username');
			let	username_type = checkIdentifierType(username, 'username');

			// Date of birth
			let	date_of_birth = getIdentifier('date_of_birth');
			let	date_of_birth_type = checkIdentifierType(date_of_birth, 'date_of_birth');

			// Password
			let	password = getIdentifier('password');
			let	password_type = checkIdentifierType(password, 'password');

			// Password confirmation
			let	password_confirmation = getIdentifier('password_confirmation');

			// Email
			let	email = getIdentifier('email');
			let	email_type = checkIdentifierType(email, 'email');

			if (!allValuesAreValid(first_name_type, last_name_type, username_type, date_of_birth_type, password_type, email_type) || password !== password_confirmation)
			{
				if (password !== password_confirmation)
				{
					console.log('Error: Password and password confirmation do not match.');
					// TODO KARL voir avec Jess
				}
				sendErrorToFrontend(first_name_type, last_name_type, username_type, date_of_birth_type, password_type, email_type);
				return ;
			}
			else
				addNewUser(username, password, email, date_of_birth, first_name, last_name);
		});
	}
	else
		console.error('Form not found.');
}

/***********************************************\
*			VALUE CHECKING FUNCTIONS		   *
\***********************************************/
export function getIdentifier(str)
{
	return document.getElementById(str).value;
}

export function checkIdentifierType(identifier, str)
{
	if ((str == 'first_name' || str == 'first_name_input') && isValidFirstName(identifier) == true)
		return 'first_name';
	if ((str == 'last_name' || str == 'last_name_input') && isValidLastName(identifier) == true)
		return 'last_name';
	if ((str == 'date_of_birth' || str == 'date_of_birth_input') && isValidDateOfBirth(identifier) == true)
		return 'date_of_birth';
	if ((str == 'username' || str == 'username_input') && isValidUsername(identifier) == true)
		return 'username';
	if (str == 'password' && isValidPassword(identifier) == true)
		return 'password';
	if ((str == 'email' || str == 'email_input') && isValidEmail(identifier) == true)
		return 'email';
	if (str == 'password_confirmation' && identifier != '')
		return 'password';
	return 'error';
}

function isValidFirstName(first_name)
{
	const	acceptedCharacters = /^[\p{L}\p{Nl}]+$/u;

	if (first_name.length > 30)
		return false;
	else if (acceptedCharacters.test(first_name) == false)
		return false;
	return true;
}

function isValidLastName(last_name)
{
	const	acceptedCharacters = /^[\p{L}\p{Nl}\s\-]+$/u;

	if (last_name.length > 30)
		return false;
	else if (acceptedCharacters.test(last_name) == false)
		return false;
	return true;
}

function isValidDateOfBirth(date_of_birth)
{
	const	acceptedCharacters = /^\d{4}-\d{2}-\d{2}$/;

	if (acceptedCharacters.test(date_of_birth) == false)
		return false;
	return true;
}

function isValidUsername(username)
{
	const	acceptedCharacters = /^[a-zA-Z0-9_-]+$/;

	if (username.length >= 12)
		return false;
	else if (acceptedCharacters.test(username) == false)
		return false;
	return true;
}

function isValidPassword(password)
{
	const	minLength = 6;

	if (password.length < minLength)
		return false;
	return true;
}

function isValidEmail(email)
{
	const	acceptedCharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const	[localPart, domainPart] = email.split('@');

	if (acceptedCharacters.test(email) == false)
		return false;
	if (localPart.length > 64)
		return false;
	if (domainPart.length > 255)
		return false;
	return true;
}

export function allValuesAreValid(first_name_type, last_name_type, username_type, date_of_birth_type, password_type, email_type)
{
	if (first_name_type == 'error' || last_name_type == 'error' || username_type == 'error' || date_of_birth_type == 'error' || password_type == 'error' || email_type == 'error')
		return false;
	return true;
}

export function sendErrorToFrontend(first_name_type, last_name_type, username_type, date_of_birth_type, password_type, email_type)
{
	const	errorMessages =
	{
		first_name: 'Please enter a first name with fewer than 30 characters, using only letters.',
		last_name: 'Please enter a last name with fewer than 30 characters, using letters, spaces, and hyphens only.',
		date_of_birth: 'Please enter a valid date of birth.',
		username: 'Username must be fewer than 13 characters and can include letters, numbers, underscores, and hyphens.',
		password: 'Password must be at least 6 characters long.',
		email: 'Please enter a valid email address.'
	};

	const	fields =
	[
		{ type: first_name_type, id: 'first_name', message: errorMessages.first_name },
		{ type: last_name_type, id: 'last_name', message: errorMessages.last_name },
		{ type: date_of_birth_type, id: 'date_of_birth', message: errorMessages.date_of_birth },
		{ type: username_type, id: 'username', message: errorMessages.username },
		{ type: password_type, id: 'password', message: errorMessages.password },
		{ type: email_type, id: 'email', message: errorMessages.email }
	];

	fields.forEach(field =>
	{
		const	formGroup = document.getElementById(field.id).parentElement;
		const	existingError = formGroup.querySelector('.error-message');
		if (existingError)
			existingError.remove();

		if (field.type === 'error')
		{
			const	error = document.createElement('p');
			error.textContent = field.message;
			error.classList.add('error-message');
			formGroup.appendChild(error);
		}
	});
}

/***********************************************\
*				 MAIN FUNCTION				 *
\***********************************************/
function addNewUser(username, password, email, date_of_birth, first_name, last_name)
{
	fetch('/api/users/addUser/',
	{
		method: 'POST',
		headers:
		{
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken'),
		},
		body: JSON.stringify({
			username,
			password,
			email,
			date_of_birth,
			first_name,
			last_name }),
	})
	.then(response =>
	{
		if (!response.ok)
		{
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data =>
	{
		const	maskedPassword = '*'.repeat(password.length);
		const	safeData = { ...data, password: maskedPassword };
		console.log('Success:', safeData);
		navigateTo('/sign-in');
	})
	.catch((error) =>
	{
		console.error('Error:', error);
	});

}