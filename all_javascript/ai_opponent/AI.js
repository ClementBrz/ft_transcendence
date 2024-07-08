const DOWN = 0
const UP = 1
const DO_NOT_MOVE = 2

export class GameData
{
	constructor()
	{
		this.ball_x = undefined;
		this.ball_y = undefined;
		// this.ball_z = undefined;
		this.ball_speed_x = undefined;
		this.ball_speed_y = undefined;
		// this.ball_speed_z = undefined;
		this.paddle_x = undefined;
		this.paddle_y = undefined;
		// this.paddle_z = undefined;
		this.field_x = undefined;
		this.field_y = undefined;
		// this.field_z = undefined;
	}
}

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
	// console.log("----paddle_y---- = ", paddle_y); //effacer
	// console.log("----predicted_intersection---- = ", predicted_intersection); //effacer

	if (paddle_y < predicted_intersection)
	{
		// console.log("Ball_Y > Paddle_Y"); //effacer
		return UP;
	}
	else if (paddle_y > predicted_intersection)
	{
		// console.log("Ball_Y < Paddle_Y"); //effacer
		return DOWN;
	}
	else
	{
		// console.log("Ball_Y == Paddle_Y"); //effacer
		return DO_NOT_MOVE;
	}
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
	// console.log("PADDLE ACTION = ", paddle_action); //EFFACER
	return paddle_action;
}