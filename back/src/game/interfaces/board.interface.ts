import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export interface Board
{
	ball : Ball;
	player : Player[];
	dead : boolean;
	end : boolean;
	pass_count : number;
	new_round : boolean;
}
