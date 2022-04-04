import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export interface Board
{
	ball : Ball;
	player : Player[];
	dead : boolean;
	end : boolean;
	pass_count : number;
	ready : boolean;
	pause_counter : number;
}
