document.addEventListener('DOMContentLoaded', function()
{
	loadDashboardData();
});

function loadDashboardData()
{
	fetch('/api/dashboard/') //API réglée par Clément
		.then(response => response.json())
		//on met dans data toutes les données qu'on a fetch de ma base de données Django
		.then(data => {
			console.log(data);
			showDashboard(data);
		})
		.catch(error => console.error('Error:', error));
}

/* Fonction qui remplace dashboard.html */
function showDashboard(data)
{
	const dashboardContainer = document.getElementById('dashboard-container');
	
	// Ajouter l'élément avec l'ID 'dashboard-container' dans la signel page
	if (dashboardContainer)
	{
		dashboardContainer.innerHTML = ''; // Clear previous content if any

		//TEST : affichage simple de toutes les données
		data.forEach(item => {
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
	else
	{
		console.error('Dashboard container not found');
	}	
}
 
