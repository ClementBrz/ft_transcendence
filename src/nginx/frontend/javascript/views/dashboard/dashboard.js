// dashboard.js

export function renderDashboard() {
    return `
        <div id="dashboard">
            <h1>Welcome to the Dashboard</h1>
            <div id="chart_icon">Chart Icon</div>
            <div id="friends_icon">Friends Icon</div>
            <div id="trophee_icon">Trophee Icon</div>

            <div id="chartModal" class="modal"></div>
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
        </div>
    `;
}

export function initializeDashboard()
{
	loadDashboardData();
	setupEventListeners();
	loadUserManagementData();
}

function setupEventListeners()
{
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

function loadDashboardData() {
    fetch('/api/dashboard')
        .then(response => {
            console.log("Received response:", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Check if the response is JSON before attempting to parse
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }

            return response.json();
        })
        .then(statsData => {
            console.log("Dashboard data loaded:", statsData);
            ChartDoughnutData(statsData);
            GameHistoryTable(statsData);
            Badge(statsData);
        })
        .catch(error => console.error('Error fetching statsData:', error));
}

function loadUserManagementData() {
    fetch('/api/userData') // Assuming the correct endpoint is /api/userData
        .then(response => {
            if (!response.ok)
                throw new Error('Error : network response');
            // Check if the response is JSON before attempting to parse
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }

            return response.json();
        })
        .then(userData => {
            console.log(userData);
            Avatars(userData);
        })
        .catch(error => console.error('Error : fetch userData', error));
}

function GameHistoryTable(statsData) {
    // Example implementation
    console.log("Displaying game history table with data:", statsData);
    // Code to dynamically create and populate a table with statsData
}

function Avatars(userData)
{
	// Code for rendering avatars
}

function displayGameHistory(chosenOpponent)
{
	// Code for displaying game history
}

function addGameHistory(chosenOpponent)
{
	// Code for adding game history
}

function ChartDoughnutData(statsData)
{
	// Code for rendering doughnut chart
}

function Badge(statsData)
{
	// Code for handling badge display
}