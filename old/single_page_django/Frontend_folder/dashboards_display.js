document.addEventListener('DOMContentLoaded', function()
{
	loadDashboardData();
});

function loadDashboardData()
{
	fetch('/api/dashboard/') //API réglée par Clément
		.then(response => response.json())
		//on met dans statsData toutes les données qu'on a fetch de ma base de données Django
		.then(statsData => {
			console.log(statsData);
			showDashboard(statsData);
		})
		.catch(error => console.error('Error:', error));
}

function simple_test(statsData) //TEST : affichage simple de toutes les données
{
	statsData.forEach(item => 
	{
		const userStatElement = document.createElement('div');
		userStatElement.className = 'user-stat';
		userStatElement.innerHTML = `
			<p>Username: ${item.user__username}</p>
			<p>Number of Victories: ${item.nb_of_victories}</p>
			<p>Number of Defeats: ${item.nb_of_defeats}</p>
			<p>Badge: ${item.badge}</p>
			<p>Ranking Position: ${item.ranking_position}</p>
			<p>Number of Games Played: ${item.nb_of_games_played}</p>
		`;
		dashboardContainer.appendChild(userStatElement);
	});
}

function doughnut_chart(statsData)
{
	const data = {
		labels: ['Games Won', 'Games Lost'],
		datasets: [{
			label: 'Game Results',
			data: [totalVictories, totalDefeats],
			backgroundColor: [
				'rgba(75, 192, 192, 0.2)', // Green for victories
				'rgba(255, 99, 132, 0.2)' // Red for defeats
			],
			borderColor: [
				'rgba(75, 192, 192, 1)',
				'rgba(255, 99, 132, 1)'
			],
			borderWidth: 1
		}]
	};

	const config = {
		type: 'doughnut',
		data: data,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'Game Statistics'
				}
			}
		},
	};

/*
	TODO: add the following line in index.html :
	<canvas id="doughnut_chart"></canvas>
*/
	const ctx = document.getElementById('doughnut_chart').getContext('2d');
	new Chart(ctx, config); // Create the chart with my data and configuration
}

/* Fonction qui remplace dashboard.html */
function showDashboard(statsData)
{
/*
	TODO: add the following line in index.html :
	<canvas id="dashboard-container"></canvas>
*/
	const dashboardContainer = document.getElementById('dashboard-container');
	
	if (dashboardContainer)
	{
		dashboardContainer.innerHTML = ''; // Clear previous content if any

		simple_test(statsData);
		doughnut_chart(statsData)
	}
	else
	{
		console.error('Dashboard container not found');
	}
}


/*
Framework bootstrap : 
Regarder en x1,75 tuto envoyer par Marine sur discord.
--> ca va remplacer styles.css
--> ca permet de faire la DA de nos js
*/