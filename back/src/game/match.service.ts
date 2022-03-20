import { User } from 'src/users/entities/user.entity';
import { getRepository } from 'typeorm';
import { Match, MatchType } from './entities/match.entity';
import { Map } from './entities/map.entity';
import { Injectable } from '@nestjs/common';
import { MatchInvitation } from './entities/match-invitation.entity';


@Injectable()
export class MatchService
{
  async createMatch(map: Map, player1: User, player2: User, mode: MatchType): Promise<Match> {
    const match = getRepository(Match).create({
      map: map,
      player1: player1,
      player2: player2,
      mode: mode,
      begin_at: new Date(),
      winner: null
    });
    await getRepository(Match).save(match);
    return match;
  }

  async createMatchInvitation(from: User, to: User, map: Map): Promise<MatchInvitation> {
    const matchInvitation = getRepository(MatchInvitation).create({
      from: from,
      to: to,
      map: map,
      sentAt: new Date()
    });
    await getRepository(MatchInvitation).save(matchInvitation);
    return matchInvitation;
  }

  async deleteMatch(matchId: number) {
    await getRepository(Match).delete({ id: matchId });
  }

  async findMatchInvitations(userId: number): Promise<MatchInvitation[]> {
    return await getRepository(MatchInvitation).find({
      relations: ['to', 'map'],
      where: {
        to: { id: userId }
      }
    });
  }

  async setWinner(matchId: number, winner: User) {
    await getRepository(Match).save({
      id: matchId,
      winner: winner
    });
  }

  async updateMatch(match: Match): Promise<Match> {
    return getRepository(Match).save(match);
  }

  async updateScore(matchId : number, score1: number, score2: number) {
    await getRepository(Match).save({
      id: matchId,
      score1: score1,
      score2: score2
    });
  }

  async findMap(mapId: number): Promise<Map> {
    return await getRepository(Map).findOne(mapId);
  }
}
