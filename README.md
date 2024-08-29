# **Will change as project advances**

## Traditional Website

<img src="readme_utils/traditional.gif" alt="Traditional" width="800">


## Single Page Application

<img src="readme_utils/SPA.gif" alt="Single Page Application" width="800">


## The basic idea
Single Page Applications (SPAs) are web applications or websites <strong style="color : green;">that dynamically update the current page with new data from the server</strong> instead of loading entirely new pages, offering a fluid and dynamic user experience. Popular examples include Gmail, Google Maps, and Netflix. SPAs reduce server requests, improve application performance, and decrease development time and infrastructure costs. They work by sending minimal initial data and updating the page dynamically as the user interacts with the application, similar to how a desktop application operates.


Advantages of SPA:
- Single-time file load each for HTML, CSS, JS
- No extra queries to server
- Fast and responsive front-end building
- Enhanced user experiences


## Code explanation
So far, we have three files (might change as we code along):
- ```index.html```:
	Sets up the basic structure, including **linking to the CSS and JavaScript files.**
- ```style.css```:
	Adds **styling** to the application.

- ```app.js```:
	Contains the logic for **handling client-side routing.** It defines a ```route``` object where:
	- keys are route paths.
	- values are functions that update the content of the ```#app``` div based on the current route.

	The most important part is the event listener ```window.onpopstate```, it listens **for changes in the browser's history state and updates the content accordingly.**
