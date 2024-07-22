/* document.addEventListener('DOMContentLoaded', function() {
    const titleContainer = document.getElementById('title and nickname');

    // Create the header section
    const headerSection = document.createElement('nav');
    headerSection.className = 'navbar navbar-light bg-light';

    // Create a container div for content alignment
    const containerDiv = document.createElement('div');
    containerDiv.className = 'container-fluid';

    // Title & Nickname
    const title = document.createElement('span');
    title.className = 'navbar-brand mb-0 h1';
    title.textContent = 'Pong Game Dashboard'; // Example title and nickname

	const nickname = document.createElement('span');
    nickname.className = 'navbar-brand mb-0 h1';
	nickname.textContent = 'Octonaute';

    // Date
    const today = new Date();
    const dateSpan = document.createElement('span');
    dateSpan.textContent = today.toLocaleDateString('fr-FR'); // Format the date to French
    dateSpan.style.marginLeft = '20px'; // Add some spacing

    // Append elements
    containerDiv.appendChild(title);
    containerDiv.appendChild(nickname);
    containerDiv.appendChild(dateSpan);
    headerSection.appendChild(containerDiv);
    document.body.insertBefore(headerSection, titleContainer); // Insert before the dashboard container
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

}); */

document.addEventListener('scroll', function() {
    var scrolledHeight = window.scrollY;
    
    var parallaxContainer1 = document.getElementById('parallax-container1');
    var coords1 = (scrolledHeight * 0.5) + 'px'; // Vitesse plus lente pour l'arrière-plan
    parallaxContainer1.style.backgroundPosition = 'center ' + coords1;
    
    var parallaxContainer2 = document.getElementById('parallax-container2');
    var coords2 = (scrolledHeight * 0.7) + 'px'; // Vitesse plus rapide pour le premier plan
    parallaxContainer2.style.backgroundPosition = 'center ' + coords2;
});