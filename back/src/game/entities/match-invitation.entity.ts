import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { GameMap } from "./game-map.entity";

@Entity()
export class MatchInvitation {
  @ManyToOne(() => User, (u) => u.id, { primary: true })
  from: User;

  @ManyToOne(() => User, (u) => u.id, { primary: true })
  to: User;

  @ManyToOne(() => GameMap, (m) => m.id, { nullable: false })
  map: GameMap;

  @Column()
  sentAt: Date;

  @Column({ nullable: false })
  level: number;
}
