const DOWN = 0
const UP = 1
const DO_NOT_MOVE = 2

export class GameData
{
	constructor()
	{
		// this.ball_x = undefined;
		// this.ball_y = undefined;

		//velocity
		this.ball_horizontal = undefined; // positive = movement to the right, negative = movement to the left
		this.ball_vertical = undefined; // positive = movement up, negative = movement down

		// this.paddle_x = undefined;
		// this.paddle_y = undefined;

		// this.field_width = undefined;
		// this.field_height = undefined;
	}
}

function	predict_ball_paddle_intersection(data)
{
	//mettre les variables suivantes dans data
	let fieldY_upper = 7.5;
	let fieldY_lower = -7.5;
	let fieldX_right = 10;
	let ball_radius = 0.3; //BALL_RATIO dans code marine
	let paddle_width = 1; //PADDLE_X dans code marine

	let intersectionX = fieldX_right - paddle_width;
	let intersectionY; //value we are looking for

	let velocityVector = {
		x: data.ball_horizontal,
		y: data.ball_vertical
	};

	let time = 0;

	let displacement = {
		x: 0,
		y: 0
	};

	while (displacement.x < intersectionX)
	{
		time += 1;
		displacement.x = velocityVector.x * time;
		displacement.y = velocityVector.y * time;

		if (time > 10000) //ça a tout réglé mais je vois pas pourquoi displacement.x n'atteindrait jamais intersectionX --> c'est quand la balle a un angle quasi vertical?
		{  
			console.error("Infinite loop detected");
			break;
		}
	}

	intersectionY = displacement.y;
	if (intersectionY > fieldY_upper || intersectionY < fieldY_lower) //out of bounds
	{
		console.log("BOUNCE");
		while (intersectionY > fieldY_upper || intersectionY < fieldY_lower) //out of bounds)
		{
			if (intersectionY > fieldY_upper)
			{
				intersectionY = intersectionY - fieldY_upper;
				intersectionY = fieldY_upper - intersectionY;
			}
			else if (intersectionY < fieldY_lower)
			{
				intersectionY = intersectionY - fieldY_lower;
				intersectionY = fieldY_lower - intersectionY;
			}
		}
	}
	else
		console.log("NO BOUNCE");

	console.log("intersectionY = ", intersectionY);

	if (intersectionY > 0) //car sinon le paddle loupe souvent la balle de peu
		intersectionY = intersectionY + ball_radius;
	else if (intersectionY < 0)
		intersectionY = intersectionY - ball_radius;

	console.log("END");

	return intersectionY;
}

function	decide_paddle_movement(paddle_y, predicted_intersection)
{
	if (paddle_y < predicted_intersection)
		return UP;
	else if (paddle_y > predicted_intersection)
		return DOWN;
	else
		return DO_NOT_MOVE;
}

function	ai_action(data)
{
	let predicted_intersection = predict_ball_paddle_intersection(data);
	let paddle_movement = decide_paddle_movement(data.paddle_y, predicted_intersection);

	return paddle_movement;
}

import { update_game_data } from '../pong_game/main.js';

export function getPaddleAction()
{
	let data = new GameData();
	data = update_game_data();

/* 	protection : loop qui lit toute les variables dans data :
	s'il y a des variables non initialisees : error (voir avec marine
	quoi faire en cas d'erreur). */
	if (data.ball_y == undefined)
	{
		console.log("ERROR");
		return 3;
	}

	let paddle_action = ai_action(data);
	return paddle_action;
}