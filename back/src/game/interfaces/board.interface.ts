import { Ball } from "./ball.interface";
import { Player } from "./player.interface";

type voidFunc = () => void;

export interface Board {
  ball: Ball;
  player: Player[];
  dead: boolean;
  end: boolean;
  ready: boolean;
  pause_counter: number;
  level: number;
  isReady?: Promise<boolean>;
  setReady?: voidFunc;
}
