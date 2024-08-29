/***			Importing Scripts			***/

//	Page Not Found	\\
import renderError404 from "./views/error_404/error_404.js";

//		Nav Bar		\\
import renderHome from "./views/home/home.js";
import renderTemplate from "./views/template/template.js";
import { renderDashboard, initializeDashboard } from "./views/dashboard/dashboard.js";
import renderCheckUser, { checkUserPage } from "./views/user/check_user.js";

//	Home buttons	\\
import { renderTheTeam } from "./views/the_team/the_team.js";
import renderPong, { gameLoop, initializePong } from "./components/pong/pong.js";
import renderProfile, { startProfile } from "./views/user/profile.js";

//		Footer		\\
import renderPrivacyPolicy from "./views/privacy_policy/privacy_policy.js";
import renderTermsOfService from "./views/terms_of_service/terms_of_service.js";



/***			Define Routes				***/
const routes =
{
	'':
	{
		title: "Home",
		render: renderHome
	},
	'/home':
	{
		title: "Home",
		render: renderHome
	},
	'/template':
	{
		title: "How to Add My JS Files",
		render: renderTemplate
	},
	'/privacy-policy':
	{
		title: "Privacy Policy",
		render: renderPrivacyPolicy
	},
	'/terms-of-service':
	{
		title: "Terms of Service",
		render: renderTermsOfService
	},
	'/dashboard':
	{
		title: "Dashboard",
		render: renderDashboard,
		init: initializeDashboard
	},
	'/team':
	{
		title: "The Team",
		render: renderTheTeam
	},
	'/pong':
	{
		title: "Pong Game",
		render: renderPong,
		init: initializePong
	},
	'/login':
	{
		title: "Login Page",
		render: () => {
			document.getElementById('app').innerHTML = renderCheckUser();
			checkUserPage();
		}
	},
	'/profile':
	{
		title: "My Profile",
		render: renderProfile
	},
	'/404':
	{
		title: "Page Not Found",
		render: renderError404
	}
};

/***			Router Function				***/
function router() {
	let path = window.location.pathname || '/home';

	// Normalize path to avoid trailing slashes causing issues
	if (path.endsWith('/'))
		path = path.slice(0, -1);

	const route = routes[path] || routes['/404'];

	console.log('Current path:', path);
	console.log('Route:', route);

	if (route) {
		document.title = route.title;
		const renderedContent = route.render();

		if (typeof renderedContent === 'string') {
			document.getElementById('app').innerHTML = renderedContent;
		}
		else if (renderedContent instanceof HTMLElement) {
			document.getElementById('app').innerHTML = '';
			document.getElementById('app').appendChild(renderedContent);
		}
		if (route.init) {
			console.log('Initializing route:', path);
			route.init();
		}
	}
	else {
		document.title = "Page not Found";
		document.getElementById('app').innerHTML = renderError404();
	}
}

/***		Navigation Function				***/
function navigateTo(path) {
	history.pushState(null, "", path);
	router();
}

window.navigateTo = navigateTo;

/***		Enabling Client-side Routing	***/
document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", (e) => {
		// Ensure the link is of type <a>
		if (e.target.matches("a[data-link]")) {
			e.preventDefault();
			const href = e.target.getAttribute('href');
			navigateTo(href);
		}
	});

	window.addEventListener("popstate", router);

	router();
});
