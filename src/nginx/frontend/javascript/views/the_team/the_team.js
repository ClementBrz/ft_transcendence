export function renderTheTeam()
{
	return `
		<div id="team-page">
			<h1>Meet the Team</h1>
			<div class="team-container">
				${renderTeamMembers()}
			</div>
		</div>
	`;
}

function renderTeamMembers()
{
	const members =
	[
		{ name: "Caro", imageUrl: "https://i.giphy.com/GRM7Z2s6AougoR3rvv.webp" },
		{ name: "Jess", imageUrl: "https://i.giphy.com/ffbi8GwJqS7I1lt27A.webp" },
		{ name: "Clement", imageUrl: "https://i.giphy.com/10mHLqxvhfdZuw.webp" },
		{ name: "Karl", imageUrl: "https://i.gifer.com/Leq.gif" }
	];

	return members.map(member => `
		<div class="team-member">
			<img src="${member.imageUrl}" alt="${member.name}" class="team-photo">
			<h2 class="team-title">${member.name}</h2>
		</div>
	`).join('');
}

export function initializeTheTeam()
{
	// Init just in case we have variables to insert on this page (to check)
}
