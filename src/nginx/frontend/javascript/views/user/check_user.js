export default function renderCheckUser() {
	return `
	<div class="container">
		<form id="loginForm">
			<div class="form-group">
				<label for="identifier">Username/E-mail:</label>
				<input type="text" class="form-control" id="identifier" placeholder="Enter username or email"
					name="identifier">
			</div>
			<button type="button" class="btn btn-primary">Submit</button>
			<div id="loginError" class="text-danger"></div>
		</form>
	</div>
	`;
}

export function checkUserPage() {
	console.log('Hellooooo');
	document.querySelector('button[type="button"]').addEventListener('click', function () {
		let identifier = getIdentifier();
		console.log('Identifier:', identifier.length);
		let id_type = checkIdentifierType(identifier);
		console.log('Type:', id_type);
		if (id_type == 'error') {
			//afficher message d'erreur approprie sur page html
		}
		else {
			lookForExisitingUser(identifier, id_type);
		}
		// createNewUser();
	});
};

function getIdentifier() {
	return document.getElementById('identifier').value;
}

function checkIdentifierType(identifier) {
	if (isValidUsername(identifier) == true) {
		return 'username';
	}
	else if (isValidEmail(identifier) == true) {
		return 'email';
	}
	return 'error';
}

function isValidUsername(identifier) {
	const usernamePattern = /^[a-zA-Z0-9_-]+$/;

	if (identifier.length > 12) {
		return false;
	}
	else if (usernamePattern.test(identifier) == false) {
		return false;
	}
	return true;
}

function isValidEmail(identifier) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	//add length checking
	if (emailPattern.test(identifier) == false) {
		return false;
	}
	return true;
}

function lookForExisitingUser(identifier, id_type) {
	if (id_type == 'email') {
		lookForExisitingEmail(identifier);
	}
	else {
		lookForExisitingUsername(identifier);
	}
}

function lookForExisitingEmail(identifier) {
	fetch('/api/users/check-email/', {
		redirect: 'follow',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(identifier),
	})
		.then(response => response.json())
		.then(data => {
			if (data.exists) {
				console.log('Email exists.', data);
			}
			else {
				console.log('Email doesn\'t exist.', data);
			}
		})
		.catch(error => console.error('Error fetching /api/users', error));
}

function lookForExisitingUsername(identifier) {
	fetch('/api/users/check-username/', {
		redirect: 'follow',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(identifier),
	})
		.then(response => response.json())
		.then(data => {
			if (data.exists) {
				console.log('Username exists.', data);
			}
			else {
				console.log('Username doesn\'t exist.', data);
			}
		})
		.catch(error => console.error('Error fetching /api/users', error));
}
