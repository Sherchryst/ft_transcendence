import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

export interface Board
{
  ball : Ball;
  player : Player[];
  dead : boolean;
  end : boolean;
  ready : boolean;
  pause_counter : number;
  level : number;
  isReady?: Promise<boolean>
  setReady?: Function,
}
