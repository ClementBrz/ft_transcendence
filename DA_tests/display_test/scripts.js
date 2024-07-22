//WITH BAR CHART

/* document.addEventListener('DOMContentLoaded', function() {
    const animations = [
        '../animated_icons/line-chart.gif',
        '../animated_icons/social-media.gif',
        '../animated_icons/award.gif',
        'https://assets2.lottiefiles.com/packages/lf20_XG8yYN.json',
        'https://assets2.lottiefiles.com/packages/lf20_Jc1wm.json'
    ];

    // Initialize Lottie animations
    lottie.loadAnimation({
        container: document.getElementById('lottie1'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_XG8yYN.json'
    });

    lottie.loadAnimation({
        container: document.getElementById('lottie2'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_Jc1wm.json'
    });

    // Show the modal and render the chart when the first box is clicked
    document.getElementById('icon1').addEventListener('click', function() {
        $('#chartModal').modal('show');

        // Add a delay to ensure the modal is fully displayed before rendering the chart
        setTimeout(function() {
            var ctx = document.getElementById('modalChart').getContext('2d');
            new Chart(ctx, {
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
        }, 500); // Adjust the delay as necessary
    });

    // Show the avatar modal when the second box is clicked
    document.getElementById('icon2').addEventListener('click', function() {
        $('#avatarModal').modal('show');
    });

    // Show the table modal when an avatar is clicked
    document.querySelectorAll('.avatar-box').forEach(function(avatarBox) {
        avatarBox.addEventListener('click', function() {
            $('#tableModal').modal('show');
        });
    });

    // Show the badge modal when the third box is clicked
    document.getElementById('icon3').addEventListener('click', function() {
        $('#badgeModal').modal('show');
    });
});
 */


//WITH DOUGHNUT CHART

document.addEventListener('DOMContentLoaded', function() {
    const animations = [
        '../animated_icons/line-chart.gif',
        '../animated_icons/social-media.gif',
        '../animated_icons/award.gif',
        'https://assets2.lottiefiles.com/packages/lf20_XG8yYN.json',
        'https://assets2.lottiefiles.com/packages/lf20_Jc1wm.json'
    ];

    // Initialize Lottie animations
    lottie.loadAnimation({
        container: document.getElementById('lottie1'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_XG8yYN.json'
    });

    lottie.loadAnimation({
        container: document.getElementById('lottie2'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_Jc1wm.json'
    });

    // Show the modal and render the chart when the first box is clicked
    document.getElementById('icon1').addEventListener('click', function() {
        $('#chartModal').modal('show');

        // Add a delay to ensure the modal is fully displayed before rendering the chart
        setTimeout(function() {
            var ctx = document.getElementById('modalChart').getContext('2d');
            new Chart(ctx, {
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
    document.getElementById('icon2').addEventListener('click', function() {
        $('#avatarModal').modal('show');
    });

    // Show the table modal when an avatar is clicked
    document.querySelectorAll('.avatar-box').forEach(function(avatarBox) {
        avatarBox.addEventListener('click', function() {
            $('#tableModal').modal('show');
        });
    });

    // Show the badge modal when the third box is clicked
    document.getElementById('icon3').addEventListener('click', function() {
        $('#badgeModal').modal('show');
    });
});
