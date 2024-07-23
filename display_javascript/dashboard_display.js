document.addEventListener('DOMContentLoaded', function()
{
	loadDashboardData(); //pour fetch statsData
	setupEventListeners(); //pour charts etc qui s'affichent au click sauf pour gameHistory qd on clique sur un avatar qui se trouve plus tard
	loadUserManagementData() //pour avatars
});

function setupEventListeners() {
	document.getElementById('chart_icon').addEventListener('click', function() {
		$('#chartModal').modal('show');
	});

	document.getElementById('friends_icon').addEventListener('click', function() {
		$('#avatarModal').modal('show');
	});

	document.getElementById('trophee_icon').addEventListener('click', function() {
		$('#badgeModal').modal('show');
	});
}

function loadDashboardData()
{
	fetch('/api/getData') //TODO: modifier path. getData() est une fonction dans le dossier /api de mon projet django
		.then(response =>
		{
			if (!response.ok)
				throw new Error('Error : network response');
			return response.json();
		})
		//on met dans statsData toutes les données qu'on a fetch de ma base de données Django
		.then(statsData => {
			console.log(statsData);

			//chart_icon
			// ChartBarData(statsData);
			ChartDoughnutData(statsData);

			//friends_icon
			GameHistoryTable(statsData); 

			//trophee_icon
			Badge(statsData);
		})
		.catch(error => console.error('Error : fetch statsData', error));
}

function loadUserManagementData()
{
	fetch('/api/getData') //TODO adapter a path et nom fonction jess
		.then(response =>
		{
			if (!response.ok)
				throw new Error('Error : network response');
			return response.json();
		})
		//on met dans statsData toutes les données qu'on a fetch de ma base de données Django
		.then(userData => {
			console.log(userData);
			Avatars(userData);
		})
		.catch(error => console.error('Error : fetch userData', error));
}

//TODO: remettre cette fonction qd j aurais decide quoi afficher
// function ChartBarData(statsData)
// {
// 	var ctx1 = document.getElementById('modalChart1').getContext('2d');
//     new Chart(ctx1, {
//         type: 'bar',
//         data: {
//             labels: statsData.map(item => item.label), // Assuming each item has a 'label'
//             datasets: [{
//                 label: 'Dataset 1',
// 				//FIX : ca va pas, j ai pas fait une map
//                 data: statsData.map(item => item.value), // Assuming each item has a 'value'
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false
//         }
//     });
// }


function Avatars(statsData, userData)
{
	const opponentsList = []; // Ensure only one avatar per user
	const avatarContainer = document.querySelector('.avatar-container');
	avatarContainer.innerHTML = ''; // Clear existing avatars

	statsData.gameHistory.forEach(game => {
		if (!opponentsList.includes(game.opponentNickname)) //if NOT already in list
			opponentsList.push(game.opponentNickname);
	})

	userData.forEach(user => {
		if (opponentsList.includes(user.nickname)) //if current user is inside opponentsList : display avatar
		{
			const avatarBox = document.createElement('div');
			avatarBox.className = 'avatar-box';
			avatarBox.dataset.toggle = 'tableModal';
			avatarBox.dataset.nickname = user.nickname;

			const avatarImg = document.createElement('img');
			avatarImg.src = user.avatar_url;
			avatarImg.alt = `Avatar of ${user.nickname}`; //TODO: faire en sorte que le nickname apparaisse juste en passant la souris sur l'avatar?
			avatarImg.className = 'avatar-icon';

			avatarBox.appendChild(avatarImg);
			avatarContainer.appendChild(avatarBox);

			avatarBox.addEventListener('click', () => {
				displayGameHistory(userData.nickname, user.nickname, userData); //affiche le tableau d'historique de jeu pour l'avatar clique
			});
		}
	});
}

function displayGameHistory(connectedUser, chosenOpponent, userData)
{
	//creation du tableau et ajout des headers avec les params + date

	const tableHeaderRow = document.getElementById('tableHeaderRow');
	tableHeaderRow.innerHTML = ''; // Clear existing header cells

	const dateHeader = document.createElement('th');
	dateHeader.textContent = 'Date';
	tableHeaderRow.appendChild(dateHeader);

	const nickname1Header = document.createElement('th');
	nickname1Header.textContent = connectedUser; // Current user's nickname
	tableHeaderRow.appendChild(nickname1Header);

	const nickname2Header = document.createElement('th');
	nickname2Header.textContent = chosenOpponent; // Opponent user's nickname
	tableHeaderRow.appendChild(nickname2Header);

	addGameHistory(connectedUser, chosenOpponent, statsData);
}

function addGameHistory(connectedUser, chosenOpponent, userData)
{
	const tableBody = document.getElementById('tableBody');
	tableBody.innerHTML = ''; // Clear existing rows

	statsData.gameHistory.forEach(game => {
		if (game.opponentNickname === chosenOpponent) 
		{
			// Add date row
			const dateRow = document.createElement('tr');
			const dateCell = document.createElement('td');
			dateCell.textContent = new Date(game.date).toLocaleDateString();
			dateCell.colSpan = 3;
			dateRow.appendChild(dateCell);
			tableBody.appendChild(dateRow);

			// Add score row
			const scoreRow = document.createElement('tr');

			const nickname1Cell = document.createElement('td');
			nickname1Cell.textContent = connectedUser;
			scoreRow.appendChild(nickname1Cell);

			const nickname2Cell = document.createElement('td');
			nickname2Cell.textContent = game.opponentNickname;
			scoreRow.appendChild(nickname2Cell);

			const scoresCell = document.createElement('td');
			scoresCell.textContent = `${game.myScore} - ${game.opponentScore}`;
			scoreRow.appendChild(scoresCell);
			tableBody.appendChild(scoreRow);
		}
	});
}

function ChartDoughnutData(statsData)
{
	var ctx2 = document.getElementById('modalChart2').getContext('2d');
	new Chart(ctx2, {
		type: 'doughnut',
		data: {
			labels: ['Wins', 'Losses'],
			datasets: [{
				label: 'Games',
				data: [statsData.nb_of_victories, statsData.nb_of_defeats],
				backgroundColor: ['#36a2eb', '#ff6384'],
				hoverBackgroundColor: ['#36a2eb', '#ff6384']
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					position: 'bottom'
				}
			}
		}
	});
}

function Badge(statsData) {
	document.getElementById('trophee_icon').addEventListener('click', function() {
		let badgeSrc = '';
		let message = '';

		// Determine badge image source
		if (statsData.badge == 1) {
			badgeSrc = 'animated_icons/gold.gif';
			// message = 'You have earned a Gold Badge!';
		} else if (statsData.badge == 2) {
			badgeSrc = 'animated_icons/silver.gif';
			// message = 'You have earned a Silver Badge!';
		} else if (statsData.badge == 3) {
			badgeSrc = 'animated_icons/bronze.gif';
			// message = 'You have earned a Bronze Badge!';
		}

		// Determine ranking position message
		if (statsData.ranking_position <= 10) {
			if (statsData.ranking_position > 5) {
				message += ' You are in the top 10 players!';
			} else if (statsData.ranking_position > 3) {
				message += ' You are in the top 5 players!';
			} else if (statsData.ranking_position > 1) {
				message += ` You are the top ${statsData.ranking_position} player!`;
			} else if (statsData.ranking_position == 1) {
				message += " You're the best player ever!";
			}
		}

		// Set the modal content dynamically
		document.querySelector('#badgeModal .modal-body .badge-icon').src = badgeSrc;
		document.querySelector('#badgeModal .modal-body p').textContent = message;

		// Show the modal
		$('#badgeModal').modal('show');
	});
}
