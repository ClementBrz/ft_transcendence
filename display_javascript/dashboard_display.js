document.addEventListener('DOMContentLoaded', function()
{
	loadDashboardData(); //pour fetch statsData
	setupEventListeners(); //pour charts etc qui s'affichent au click
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

function Avatars(userData)
{
	/*TODO: for each user, show userData.avatar the same way they used to be shown
	with random avatars in index.html --> should I uncomment the different 
	avatar-box divisions in index.html? Because I won't know in advance how many
	users there are so I would prefere not to rely on index.html*/

	/*TODO: Afficher que les avatars des users qui ont deja joue avec la personne
	connectee :
	
	while (gameHistoryData)
		while(userData)
			if (gameHistoryData.opponentNickname == userData.nickname)
				show userData.avatar;
			userData->next;
		gameHisotryData->next;*/

	function Avatars(userData) {
		const avatarContainer = document.querySelector('.avatar-container');
		avatarContainer.innerHTML = ''; // Clear existing avatars
	
		userData.forEach(user => {
			const avatarBox = document.createElement('div');
			avatarBox.className = 'avatar-box';
			avatarBox.dataset.toggle = 'tableModal';
	
			const avatarImg = document.createElement('img');
			avatarImg.src = user.avatar; // Assumes 'avatar' is a URL to the user's avatar image
			avatarImg.alt = `Avatar of ${user.nickname}`;
			avatarImg.className = 'avatar-icon';
	
			avatarBox.appendChild(avatarImg);
			avatarContainer.appendChild(avatarBox);
		});
	}
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
				// data: [20, 10], // Random numbers for wins and losses
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

function GameHistoryTable(statsData)
{
		/*TODO: how do I retrieve the data from the GameHistory class
		in models.py? Can I do it throught the getData view (since GameHisotry
		is Linked by foreignKey to the Stats class)? Or should I create another 
		view specifically to fetch the GameHistory info?
		*/

		function GameHistoryTable(statsData) {
			const gameHistoryData = statsData.flatMap(player => player.games_history.map(game => ({
				date: new Date(game.date).toLocaleDateString(),
				opponent: game.opponentNickname,
				myScore: game.myScore,
				opponentScore: game.opponentScore
			})));
		
			const ctx1 = document.getElementById('modalChart1').getContext('2d');
			new Chart(ctx1, {
				type: 'bar',
				data: {
					labels: gameHistoryData.map(item => item.date), // Dates as labels
					datasets: [
						{
							label: 'My Score',
							data: gameHistoryData.map(item => item.myScore), //FIX: map??
							backgroundColor: 'rgba(75, 192, 192, 0.2)',
							borderColor: 'rgba(75, 192, 192, 1)',
							borderWidth: 1
						},
						{
							label: 'Opponent Score',
							data: gameHistoryData.map(item => item.opponentScore),
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							borderColor: 'rgba(255, 99, 132, 1)',
							borderWidth: 1
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						x: {
							beginAtZero: true
						},
						y: {
							beginAtZero: true
						}
					}
				}
			});
		}
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
