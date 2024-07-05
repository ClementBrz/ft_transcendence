const DOWN = 0
const UP = 1

let paddle_action;

export function getPaddleAction()
{
	console.log("AI.JS PADDLE ACTION = ", paddle_action); //EFFACER
	return paddle_action;
}

class GameData
{
	constructor()
	{
		this.ball_x = 0;
		this.ball_y = 0;
		this.ball_speed_x = 0; // Assign default values or parameters
		this.ball_speed_y = 0;
		this.paddle_x = 0;
		this.paddle_y = 0;
		this.field_x = 0;
		this.field_y = 0;
	}
}

import { ball, leftPaddle, ballSpeedX, ballSpeedY, FIELD_X, FIELD_Y } from '../pong_game/main.js';

function	get_game_data(data)
{	
	data.ball_x = ball.position.x; //not sure I need it
	data.ball_y = ball.position.y;
	data.ball_speed_x = ballSpeedX;
	data.ball_speed_y = ballSpeedY;
	data.paddle_x = leftPaddle.position.x;
	data.paddle_y = leftPaddle.position.y;
	data.field_x = FIELD_X;
	data.field_y = FIELD_Y;
}

/* Prend en parametres l'action (le movement du paddle apres calculs de l'IA)
et donc renvoie la nouvelle position du paddle IA au jeu pour etre affiche */
// function	send_ai_action(action)
// {
// 	export { action };
// }

function	predict_ball_paddle_intersection(data)
{
	let intersectionX = data.field_x / 2 - data.paddle_x / 2;
	let intersectionY; //value we are looking for

	let distanceToIntersection = intersectionX - data.ball_x;
	let timeToIntersection = distanceToIntersection / data.ball_speed_x;
	
	let intersectionWithoutRebounds = data.ball_y + (data.ball_speed_y * timeToIntersection);

	//if no rebounds
	if (intersectionWithoutRebounds > data.field_y / 2 || intersectionWithoutRebounds < - data.field_y / 2) //if current pos + vertical displacement < field height == no rebounds
			intersectionY = intersectionWithoutRebounds;
	else //if rebounds
	{
			//intersectionY = intersectionWithoutRebounds % (2 * FIELD_HEIGHT); //if only one rebound?
			intersectionY = intersectionWithoutRebounds;
			if (intersectionY > data.field_y / 2) //means the ball is going back down after bounce
				intersectionY = - (intersectionY - data.field_y / 2); //we substract the excess
			else
				intersectionY = (intersectionY + data.field_y / 2); //we substract the excess
	}

	// if (intersectionY > FIELD_WIDTH / 2) //car sinon le paddle loupe souvent la balle de peu
	// 	intersectionY = intersectionY + (BALL_RADIUS * 2);
	// else
	// 	intersectionY = intersectionY - (BALL_RADIUS * 2);

	return intersectionY;
}

function	decide_paddle_movement(paddle_y, predicted_intersection)
{
	if (paddle_y < predicted_intersection)
		return UP;
	else if (paddle_y > predicted_intersection)
		return DOWN;
	//else : on bouge pas
}

function	ai_action(data)
{
	// reprendre logique IA du jeu 3d et non 2d car differents noms de variables
	let predicted_intersection = predict_ball_paddle_intersection(data);
	let paddle_movement = decide_paddle_movement(data.paddle_y, predicted_intersection); //UP ou DOWN (voir define)
	console.log("AI.JS IN AI_ACTION FUNCTION PADDLE ACTION = ", paddle_movement); //EFFACER
	
	//update paddle position waiting for data to be updated every second
	console.log("PADDLE_Y = ", data.paddle_y); //EFFACER
	console.log("BALL POSITION Y = ", data.ball_y); //EFFACER
	if (paddle_movement = DOWN);
		data.paddle_y--;
	if (paddle_movement = UP);
		data.paddle_y++;
	return paddle_movement;
}

// /* Requests the game info needed (the ball's position) once per second
// and send backs continuously the position of the AI palet to be displayed. */
// function main()
// {
// 	let data = new GameData();
// 	let last_time = Date.now();

// 	while(1) // This created a pb!!!
// 	{
// 		const current_time = Date.now();
// 		if ((current_time - last_time) >= 1000) // Once per second
// 		{
// 			// data = get_game_data();
// 			get_game_data(data);
// 			last_time = current_time;
// 		}

// 		paddle_action = ai_action(data);
// 		console.log("AI.JS IN MAIN FUNCTION PADDLE ACTION = ", paddle_action); //EFFACER

// 		// send_ai_action(paddle_movement);
// 		/*send un int (position) et en fonction de 
// 		la position voulue on simule les clicks dans le jeu*/
// 		// usleep(1000);
// 	}
// 	return 0;
// }


function get_game_data_periodically(data) {
	setInterval(() => {
		// Assuming get_game_data updates the data object directly
		get_game_data(data);
	}, 1000); // Fetch game data once per second
}

function main()
{
	let data = new GameData();
	get_game_data_periodically(data);
	paddle_action = ai_action(data);
	console.log("AI.JS IN MAIN FUNCTION PADDLE ACTION = ", paddle_action); //EFFACER
}

main();

/*FIX:
I took away the while loop in my main but then it seems like I only enter my 
main once. I need my AI file to run for as long as the main.js file runs. 
Maybe I should take away the main and call the different functions only from main.js?
*/