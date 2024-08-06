// dashboard.js

export function renderDashboard() {
	return `
		<div id="dashboard">
			<h1>Welcome to the Dashboard</h1>
			<div id="chart_icon">Chart Icon</div>
			<div id="friends_icon">Friends Icon</div>
			<div id="trophee_icon">Trophee Icon</div>

			<div id="chartModal" class="modal">
				<canvas id="chartModal" width="400" height="400"></canvas>
			</div>

			<div id="avatarModal" class="modal"></div>
			<div id="badgeModal" class="modal">
				<div class="modal-body">
					<img class="badge-icon" src="" alt="Badge">
					<p></p>
				</div>
			</div>
			<div class="avatar-container"></div>
			<table>
				<thead id="tableHeaderRow"></thead>
				<tbody id="tableBody"></tbody>
			</table>

			<div id="tableModal" class="modal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">Game History</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<table class="table table-striped">
								<thead>
									<tr>
										<th>Date</th>
										<th>Player 1</th>
										<th>Player 2</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody id="tableBody">
									<!-- Rows will be populated dynamically -->
								</tbody>
							</table>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>

		</div>
	`;
}

export function initializeDashboard() {
	console.log("Initializing dashboard");
	loadDashboardData(); //pour fetch statsData
	console.log("After loadDashboardData");
	// setupEventListeners(); //pour charts etc qui s'affichent au click sauf pour gameHistory qd on clique sur un avatar qui se trouve plus tard
	// console.log("After setupEventListeners");
	loadUserManagementData(); //pour avatars
	console.log("After loadUserManagementData");

	//TEST
	document.addEventListener('DOMContentLoaded', (event) => {
		setupEventListeners();
	});
	console.log("After setupEventListeners");
	//TEST FIN
}

function setupEventListeners()
{
	const chartIcon = document.getElementById('chart_icon');
	const friendsIcon = document.getElementById('friends_icon');
	const tropheeIcon = document.getElementById('trophee_icon');

	if (chartIcon)
	{
		chartIcon.addEventListener('click', function() {
			$('#chartModal').modal('show');
		});
	}
	else
		console.error('Canvas element with id "chartModal" not found or context is null.');
	
	if (friendsIcon)
	{
		friendsIcon.addEventListener('click', function() {
			$('#avatarModal').modal('show');
		});
	}
	else
		console.error('Canvas element with id "avatarModal" not found or context is null.');

	if (tropheeIcon)
	{
		tropheeIcon.addEventListener('click', function() {
			$('#badgeModal').modal('show');
		});
	}
	else
		console.error('Canvas element with id "badgeModal" not found or context is null.');

}

function loadDashboardData()
{
	fetch('/api/dashboard')
		.then(response => {
			if (!response.ok)
				throw new Error('Error : network response');
			return response.json();
		})
		.then(statsData => {
			console.log("Received dashboard data : ", statsData);
			//chart_icon
			// ChartBarData(statsData);
			// ChartDoughnutData(statsData); //FIX
			//friends_icon
			// GameHistoryTable(statsData);
			//trophee_icon
			Badge(statsData);
		})
		.catch(error => {
			console.error('Error: fetch statsData', error);
		});
}

function loadUserManagementData()
{
	fetch('/api/userData') //TODO adapter a path et nom fonction jess
		.then(response => {
			if (!response.ok)
				throw new Error('Error : network response');
			return response.json();
		})
		//on met dans statsData toutes les données qu'on a fetch de ma base de données Django
		.then(userData => {
			console.log('Received user management data:', userData);
			Avatars(statsData, userData);
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
	var ctx2 = document.getElementById('chartModal').getContext('2d');
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

		// Determine badge image
		if (statsData.badge == 1) {
			badgeSrc = 'animated_icons/gold.gif';
		} else if (statsData.badge == 2) {
			badgeSrc = 'animated_icons/silver.gif';
		} else if (statsData.badge == 3) {
			badgeSrc = 'animated_icons/bronze.gif';
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

renderDashboard();
initializeDashboard();