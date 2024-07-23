const DOWN = 0
const UP = 1
const DO_NOT_MOVE = 2

export class GameData
{
	constructor()
	{
		// ball velocity
		this.ball_horizontal = undefined; // positive = movement to the right, negative = movement to the left
		this.ball_vertical = undefined; // positive = movement up, negative = movement down

		// field's top/bottom right Y coordinate
		this.fieldY_top = undefined;
		this.fieldY_bottom = undefined;

		// field's right bound X coordinate
		this.fieldX_right = undefined;

		this.ball_radius = undefined;

		this.paddle_width = undefined;

		// paddle Y coordinate
		this.paddle_y = undefined;
	}
}

function	predict_ball_paddle_intersection(data)
{
	let intersectionX = data.fieldX_right - data.paddle_width;
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
	if (intersectionY > data.fieldY_top || intersectionY < data.fieldY_bottom) //out of bounds
	{
		console.log("BOUNCE");
		while (intersectionY > data.fieldY_top || intersectionY < data.fieldY_bottom) //out of bounds)
		{
			if (intersectionY > data.fieldY_top)
			{
				intersectionY = intersectionY - data.fieldY_top;
				intersectionY = data.fieldY_top - intersectionY;
			}
			else if (intersectionY < data.fieldY_bottom)
			{
				intersectionY = intersectionY - data.fieldY_bottom;
				intersectionY = data.fieldY_bottom - intersectionY;
			}
		}
	}
	else
		console.log("NO BOUNCE");

	console.log("intersectionY = ", intersectionY);

	if (intersectionY > 0) //car sinon le paddle loupe souvent la balle de peu
		intersectionY = intersectionY + data.ball_radius;
	else if (intersectionY < 0)
		intersectionY = intersectionY - data.ball_radius;

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

function checkGameData(data) {
	for (const [key, value] of Object.entries(data))
	{
		if (value === undefined) {
			console.log(`ERROR: ${key} is undefined`);
			return false;
		}
	}
	return true;
}

export function getPaddleAction()
{
	let data = new GameData();
	data = update_game_data();

/* 	protection : loop qui lit toute les variables dans data :
	s'il y a des variables non initialisees : error (voir avec marine
	quoi faire en cas d'erreur). */
	if (!checkGameData(data))
		return 42;

	let paddle_action = ai_action(data);
	return paddle_action;
}