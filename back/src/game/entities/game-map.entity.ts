import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ballColor: number;

  @Column()
  backgroundColor: number;

  @Column()
  starsColor: number;

  @Column()
  racketColor: number;
}
