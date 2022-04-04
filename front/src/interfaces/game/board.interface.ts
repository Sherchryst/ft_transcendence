import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export interface Board
{
	ball : Ball;
	player : Player[];
	dead : boolean;
	end : boolean;
	bot : boolean;
	bot_speed : number;
	bot_offset : number;
	bot_id : number;
	pass_count : number;
	new_round : boolean;
}
