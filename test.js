document.addEventListener('DOMContentLoaded', function() {
	const dashboardContainer = document.getElementById('dashboard-container');

	// Générer des données aléatoires pour les statistiques
	const stats = 
	{
		'Visiteurs': Math.floor(Math.random() * 1000),
		'Ventes': Math.floor(Math.random() * 100),
		'Inscriptions': Math.floor(Math.random() * 50),
		'Commentaires': Math.floor(Math.random() * 500)
	};

	// Créer et ajouter les éléments de statistiques à dashboard-container
	Object.keys(stats).forEach(key =>
	{
		const statCard = document.createElement('div');
		statCard.className = 'card text-white bg-primary mb-3';
		statCard.style.maxWidth = '18rem';
		const cardHeader = document.createElement('div');
		cardHeader.className = 'card-header';
		cardHeader.textContent = key;
		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';
		const cardTitle = document.createElement('h5');
		cardTitle.className = 'card-title';
		cardTitle.textContent = stats[key];
		cardBody.appendChild(cardTitle);
		statCard.appendChild(cardHeader);
		statCard.appendChild(cardBody);
		dashboardContainer.appendChild(statCard);
	});
});

document.addEventListener('DOMContentLoaded', function() {
	var ctx = document.getElementById('myDoughnutChart').getContext('2d');

	// Générer des données aléatoires
	const stats = 
	{
		'Username': 'octonaute',
		'nb_victories': 60,
		'nb_losses': 40,
		'nb_games': 100
	};

	// Création du graphique en doughnut
	var myDoughnutChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['Victoires', 'Défaites'],
			datasets: [{
				data: [stats.nb_victories, stats.nb_losses],
				backgroundColor: [
					'rgba(75, 192, 192, 0.2)',
					'rgba(255, 99, 132, 0.2)'
				],
				borderColor: [
					'rgba(75, 192, 192, 1)',
					'rgba(255, 99, 132, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Statistiques de Jeu'
			},
			animation: {
				animateScale: true,
				animateRotate: true
			}
		}
	});

});
