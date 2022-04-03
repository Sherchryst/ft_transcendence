import { User } from 'src/users/entities/user.entity';
import { getRepository } from 'typeorm';
import { Match, MatchType } from './entities/match.entity';
import { Map } from './entities/map.entity';
import { Injectable } from '@nestjs/common';
import { MatchInvitation } from './entities/match-invitation.entity';

@Injectable()
export class MatchService
{
  async createMatch(map: Map, player1: number, player2: number, mode: MatchType): Promise<Match> {
    const match = getRepository(Match).create({
      map: map,
      player1: { id: player1 },
      player2: { id: player2 },
      mode: mode,
      beginAt: new Date(),
      winner: null
    });
    await getRepository(Match).save(match);
    return match;
  }

  async createMatchInvitation(from: number, to: number, map: Map): Promise<MatchInvitation> {
    const matchInvitation = getRepository(MatchInvitation).create({
      from: { id: from },
      to: { id: to },
      map: map,
      sentAt: new Date()
    });
    await getRepository(MatchInvitation).save(matchInvitation);
    return matchInvitation;
  }

  async deleteMatch(matchId: number) {
    await getRepository(Match).delete({ id: matchId });
  }

  async deleteMatchInvitation(fromId: number, toId: number) {
    await getRepository(MatchInvitation).delete({
      from: { id: fromId },
      to: { id: toId }
    });
  }

  async findMatch(matchId: number): Promise<Match> {
    return getRepository(Match).findOne({
      relations: ['player1', 'player2'],
      where: {
        id: matchId
      }
    })
  }

  async findMatchInvitations(userId: number, fromId: number): Promise<MatchInvitation> {
    return getRepository(MatchInvitation).findOne({
      relations: ['to', 'map'],
      where: {
        from: { id: fromId },
        to: { id: userId }
      }
    });
  }

  async setWinner(matchId: number, winnerId: number) {
    await getRepository(Match).update(matchId, {
      endAt: new Date(),
      winner: winnerId >= 0 ? { id: winnerId } : null
    });
  }

  async updateMatch(match: Match): Promise<Match> {
    return getRepository(Match).save(match);
  }

  async updateScore(matchId : number, score1: number, score2: number) {
    await getRepository(Match).update(matchId, {
      score1: score1,
      score2: score2
    });
  }

  async findMap(mapId: number): Promise<Map> {
    return await getRepository(Map).findOne(mapId);
  }
}
