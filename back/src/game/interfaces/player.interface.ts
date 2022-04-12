export interface Player {
  user_socket: string;
  user_id: number;
  id: number;
  y: number;
  old_y: number;
  score?: number;
  half_height?: number;
}
