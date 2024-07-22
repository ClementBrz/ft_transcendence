document.addEventListener('DOMContentLoaded', function()
{
	loadDashboardData();
	setupEventListeners();
});

function setupEventListeners() {
    // Set up event listeners for the icons
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
	fetch('/api/getData') //getData() est une fonction dans le dossier /api de mon projet django
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
			// AvatarsWindow(statsData); //TODO: voir comment chopper les avatar de la base de donnees de jess
			//GameHistoryTable(statsData); 
			/*FIX: statsData ou gameHistoryData 
			d'une autre fonction getHistoryData que je devrais creer? J ene sais pas
			encore comment chopper les donnes de la classe GameHistory*/

			//trophee_icon
			Badge(statsData);
		})
		.catch(error => console.error('Error : fetch statsData', error));
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

// function GameHistoryTable(statsData)
// {

// }

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

/* // Show the modal and render the charts when the first box is clicked
document.getElementById('chart_icon').addEventListener('click', function() {
	$('#chartModal').modal('show');

	// Add a delay to ensure the modal is fully displayed before rendering the charts
	setTimeout(function() {
		var ctx1 = document.getElementById('modalChart1').getContext('2d');
		new Chart(ctx1, {
			type: 'bar',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June'],
				datasets: [{
					label: 'Dataset 1',
					data: [12, 19, 3, 5, 2, 3], //changer par statsData
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});

		var ctx2 = document.getElementById('modalChart2').getContext('2d');
		new Chart(ctx2, {
			type: 'doughnut',
			data: {
				labels: ['Wins', 'Losses'],
				datasets: [{
					label: 'Games',
					data: [20, 10], // Random numbers for wins and losses
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
	}, 500); // Adjust the delay as necessary
});

// Show the avatar modal when the second box is clicked
document.getElementById('friends_icon').addEventListener('click', function() {
	$('#avatarModal').modal('show');
});

// Show the table modal when an avatar is clicked
document.querySelectorAll('.avatar-box').forEach(function(avatarBox) {
	avatarBox.addEventListener('click', function() {
		$('#tableModal').modal('show');
	});
});

// Show the badge modal when the third box is clicked
document.getElementById('trophee_icon').addEventListener('click', function() {
	$('#badgeModal').modal('show');
}); */