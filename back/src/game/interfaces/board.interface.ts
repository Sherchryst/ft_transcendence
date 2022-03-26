import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export interface Board
{
	ball : Ball;
	player : Player[];
	dead : boolean;
	end : boolean;
  update_needed : boolean;
	bot : boolean;
	bot_speed : number;
	bot_offset : number;
	pass_count : number;
	new_game : boolean;
}
