const DOWN = 0
const UP = 1
const DO_NOT_MOVE = 2

export class GameData
{
	constructor()
	{
		this.ball_x = undefined;
		this.ball_y = undefined;

		//velocity
		this.ball_horizontal = undefined; // positive = movement to the right, negative = movement to the left
		this.ball_vertical = undefined; // positive = movement up, negative = movement down

		this.paddle_x = undefined;
		this.paddle_y = undefined;

		this.field_width = undefined;
		this.field_height = undefined;
	}
}

function	predict_ball_paddle_intersection(data)
{
	let intersectionX = data.field_width / 2 - data.paddle_x / 2;
	let intersectionY; //value we are looking for

	let distanceToIntersection = intersectionX - data.ball_x;
	let timeToIntersection = distanceToIntersection / data.ball_horizontal;
	
	// let intersectionWithoutRebounds = data.ball_y + (data.ball_vertical * timeToIntersection);
	let intersectionWithoutRebounds = /* data.ball_y + */ (data.ball_vertical * timeToIntersection) % data.field_height;

	let numberOfBounces = Math.floor(Math.abs(data.ball_vertical * timeToIntersection) / data.field_height);

	//if no rebounds
	// if (intersectionWithoutRebounds > data.field_height / 2 || intersectionWithoutRebounds < - data.field_height / 2) //if current pos + vertical displacement < field height == no rebounds
	if (numberOfBounces % 2 == 0)
		intersectionY = intersectionWithoutRebounds;
	else //if rebounds
	{
			// intersectionY = intersectionWithoutRebounds % (2 * data.field_height); //if only one rebound?
			/* intersectionY = intersectionWithoutRebounds;
			if (intersectionY > data.field_height / 2) //means the ball is going back down after bounce
			{
				intersectionY = - (intersectionY - data.field_height / 2); //we substract the excess
				console.log("BOUNCE + DOWN");
				//FIX: ne rentre jamais ici!!
			}
			else
			{
				intersectionY = (intersectionY + data.field_height / 2); //we substract the excess
				console.log("BOUNCE + UP");
			} */
			intersectionY = data.field_height - intersectionWithoutRebounds;
	}

	// if (intersectionY > FIELD_WIDTH / 2) //car sinon le paddle loupe souvent la balle de peu
	// 	intersectionY = intersectionY + (BALL_RADIUS * 2);
	// else
	// 	intersectionY = intersectionY - (BALL_RADIUS * 2);

	// if (intersectionY == intersectionWithoutRebounds) //EFFACER
	// 	console.log("NO BOUNCE");


	if (numberOfBounces % 2 == 0)
	{
		if (data.ball_vertical < 0)
			console.log("BOUNCE + DOWN");
		else
			console.log("BOUNCE + UP");
	}
	else
		console.log("NO BOUNCE");

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