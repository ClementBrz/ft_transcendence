export function renderProfile()
{
	return `
    <div class="container">
        <div class="profile-header text-center">
            <h1>My Profile</h1>
        </div>

        <div class="section">
            <h2>User Information</h2>
            <div class="row">
                <div class="col-md-3 text-center">
                    <img src="avatar/default.png" alt="User Avatar" class="avatar img-fluid">
                    <p><strong>Status:</strong> <span class="status-online">Online</span></p>
                </div>
                <div class="col-md-9">
                </div>
            </div>
        </div>

        <div class="friends-list">
            <h2>Friends List</h2>
            <div class="row">
                <div class="col-md-6">
                    <ul class="list-group" id="friends-list-container">
                    </ul>
                </div>
            </div>
        </div>

        <!-- Stats Display Section -->
        <div class="stats-display-section">
            <h2>Stats Display</h2>
            <div class="stats-container"></div> <!-- Container for displayGeneralStats -->
        </div>

        <!-- Match History Section -->
        <div class="match-history-section">
            <h2>Match History</h2>
            <div class="match-history-container"></div> <!-- Container for displayMatchHistory -->
        </div>
    </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

export function initializeProfile() {
	
    console.log("Calling loadUserData");
    loadUserData();
    loadFriendsList();
    loadGameHistory();
}




function loadUserData() {
    console.log("API call to fetch user data");
    fetch('/api/profile/')
        .then(response => {
            console.log("Check si la reponse is okay");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("NTM");
            return response.json();
        })
        .then(userData => {
            displayUserData(userData);
        })
        .catch(error => console.error('Error fetching user data:', error));
}


function displayUserData(userData) {
    if (!userData) {
        document.querySelector('.profile-header h1').textContent = `Welcome, Player`;
        document.querySelector('.avatar').src = 'user_management/static/avatar/default.png'; // Specify a default avatar path
        document.querySelector('.status-online').textContent = 'Offline';
        document.querySelector('.col-md-9').innerHTML = `
            <p><strong>Username:</strong> </p>
            <p><strong>Tournament Display Name:</strong> </p>
            <p><strong>Email Address:</strong> </p>
        `;
        return;
    }

    document.querySelector('.profile-header h1').textContent = `Welcome, ${userData.username}`;
    document.querySelector('.avatar').src = userData.avatar_url;
    document.querySelector('.status-online').textContent = userData.is_online ? 'Online' : 'Offline';
    document.querySelector('.status-online').classList.toggle('status-offline', !userData.is_online);
    document.querySelector('.col-md-9').innerHTML = `
        <p><strong>Username:</strong> ${userData.username}</p>
        <p><strong>Tournament Display Name:</strong> ${userData.display_name}</p>
        <p><strong>Email Address:</strong> ${userData.email}</p>
        `;
    }







function loadFriendsList() {
    fetch('/api/friends/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(friendsData => {
            displayFriendsList(friendsData);
        })
        .catch(error => console.error('Error fetching friends list:', error));
}


function displayFriendsList(friendsData) {
    const friendsListContainer = document.getElementById('friends-list-container');
    friendsListContainer.innerHTML = ''; // Clear existing friends list

    if (!friendsData || friendsData.friends.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'list-group-item';
        emptyItem.textContent = 'No friends to display';
        friendsListContainer.appendChild(emptyItem);
        return;
    }

    friendsData.friends.forEach(friend => {
        const friendItem = document.createElement('li');
        friendItem.className = 'list-group-item';
        friendItem.textContent = friend.username;
        friendsListContainer.appendChild(friendItem);
    });
}








function loadGameHistory() {
    fetch('/dashboard/api/getData') //TODO adapter a path et nom fonction Caro
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(gameHistoryData => {
            displayGeneralStats(gameHistoryData.generalStats);
            displayMatchHistory(gameHistoryData.matchHistory);
        })
        .catch(error => console.error('Error fetching game history:', error));
}


function displayGeneralStats(statsData) {
    const statsContainer = document.querySelector('.stats-container');
    statsContainer.innerHTML = ''; // Clear existing content

    // Always create table and headers
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    ['Games Played', 'Wins', 'Losses'].forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    if (!statsData) {
        const emptyElement = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.textContent = 'No stats to display';
        emptyCell.colSpan = 3; // Span across all columns
        emptyElement.appendChild(emptyCell);
        table.appendChild(emptyElement);
    } else {
        // Populate table row with stats data
        const row = document.createElement('tr');

        const gamesPlayedCell = document.createElement('td');
        gamesPlayedCell.textContent = statsData.nb_of_games_played;
        row.appendChild(gamesPlayedCell);

        const winsCell = document.createElement('td');
        winsCell.textContent = statsData.nb_of_victories;
        row.appendChild(winsCell);

        const lossesCell = document.createElement('td');
        lossesCell.textContent = statsData.nb_of_defeats;
        row.appendChild(lossesCell);

        table.appendChild(row);
    }

    statsContainer.appendChild(table);
}

// function displayGeneralStats(statsData) {
//     const statsContainer = document.querySelector('.stats-container'); // Ensure you have a container with this class in your HTML
//     statsContainer.innerHTML = ''; // Clear existing content

//     if (!statsData) {
//         const emptyElement = document.createElement('p');
//         emptyElement.textContent = 'No stats to display';
//         statsContainer.appendChild(emptyElement);
//         return;
//     }

//     const totalElement = document.createElement('p');
//     totalElement.textContent = `Total played: ${statsData.nb_of_games_played}`;
//     statsContainer.appendChild(totalElement);

//     const winsElement = document.createElement('p');
//     winsElement.textContent = `Wins: ${statsData.nb_of_victories}`;
//     statsContainer.appendChild(winsElement);

//     const lossesElement = document.createElement('p');
//     lossesElement.textContent = `Losses: ${statsData.nb_of_defeats}`;
//     statsContainer.appendChild(lossesElement);
// }


function displayMatchHistory(matchHistoryData) {
    const matchHistoryContainer = document.querySelector('.match-history-container');
    matchHistoryContainer.innerHTML = ''; // Clear existing content

    // Always create table and headers
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    ['Date', 'Opponent', 'Winner', 'Score'].forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    if (!matchHistoryData || matchHistoryData.length === 0) {
        const emptyElement = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.textContent = 'No match history to display';
        emptyCell.colSpan = 4; // Span across all columns
        emptyElement.appendChild(emptyCell);
        table.appendChild(emptyElement);
    } else {
        // Populate table rows with match data
        matchHistoryData.forEach(match => {
            const row = document.createElement('tr');
            // Add cells for date, opponent, winner, and score
            // Similar to the existing logic
            table.appendChild(row);
        });
    }

    matchHistoryContainer.appendChild(table);
}

// function displayMatchHistory(matchHistoryData) {
//     const matchHistoryContainer = document.querySelector('.match-history-container'); // Ensure you have a container with this class in your HTML
//     matchHistoryContainer.innerHTML = ''; // Clear existing content

//     if (!matchHistoryData || matchHistoryData.length === 0) {
//         const emptyElement = document.createElement('p');
//         emptyElement.textContent = 'No match history to display';
//         matchHistoryContainer.appendChild(emptyElement);
//         return;
//     }

//     // Create table and headers
//     const table = document.createElement('table');
//     const headerRow = document.createElement('tr');
//     ['Date', 'Opponent', 'Winner', 'Score'].forEach(headerText => {
//         const header = document.createElement('th');
//         header.textContent = headerText;
//         headerRow.appendChild(header);
//     });
//     table.appendChild(headerRow);

//     // Populate table rows with match data
//     matchHistoryData.forEach(match => {
//         const row = document.createElement('tr');
//         const dateCell = document.createElement('td');
//         dateCell.textContent = new Date(match.date).toLocaleDateString();
//         row.appendChild(dateCell);

//         const opponentCell = document.createElement('td');
//         opponentCell.textContent = match.opponentNickname;
//         row.appendChild(opponentCell);

//         const winnerCell = document.createElement('td');
//         winnerCell.textContent = match.winner; // Assuming 'winner' field exists
//         row.appendChild(winnerCell);

//         const scoreCell = document.createElement('td');
//         scoreCell.textContent = `${match.myScore} - ${match.opponentScore}`;
//         row.appendChild(scoreCell);

//         table.appendChild(row);
//     });

//     matchHistoryContainer.appendChild(table);
// }

// function displayGameHistory(gameHistoryData) {
//     const gameHistoryContainer = document.querySelector('.game-history-container'); // Make sure to have a container with this class in your HTML
//     gameHistoryContainer.innerHTML = ''; // Clear existing content

//     gameHistoryData.forEach(game => {
//         const gameElement = document.createElement('div');
//         gameElement.className = 'game-history-entry';
//         gameElement.innerHTML = `
//             <p>Game: ${game.name}</p>
//             <p>Date: ${game.date}</p>
//             <p>Score: ${game.score}</p>
//         `; // Adjust according to your data structure
//         gameHistoryContainer.appendChild(gameElement);
//     });
// }