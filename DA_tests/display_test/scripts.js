document.addEventListener('DOMContentLoaded', function() {
	
	// Show the modal and render the charts when the first box is clicked
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
						data: [12, 19, 3, 5, 2, 3],
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
	});
});
