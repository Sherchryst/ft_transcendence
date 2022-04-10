import { getRepository, IsNull, Not } from 'typeorm';
import { Match, MatchType } from './entities/match.entity';
import { GameMap } from './entities/game-map.entity';
import { Injectable } from '@nestjs/common';
import { MatchInvitation } from './entities/match-invitation.entity';

@Injectable()
export class MatchService
{
  async createMatch(map: GameMap, player1: number, player2: number, mode: MatchType): Promise<Match> {
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

  async createMatchInvitation(from: number, to: number, map: GameMap): Promise<MatchInvitation> {
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
      relations: ['player1', 'player2', 'map'],
      where: {
        id: matchId
      }
    })
  }

  async findMatchInvitation(userId: number, fromId: number): Promise<MatchInvitation> {
    return getRepository(MatchInvitation).findOne({
      relations: ['to', 'from', 'map'],
      where: {
        from: { id: fromId },
        to: { id: userId }
      }
    });
  }

  async getHistory(userId: number, limit: number): Promise<Match[]> {
    return await getRepository(Match).find({
      relations: ['player1', 'player2', 'winner'],
      where: [
        { player1: { id: userId } },
        { player2: { id: userId } }
      ],
      order: { beginAt: 'DESC' },
      take: limit
    });
  }

  async getWinrate(userId: number): Promise<number> {
    const winsCount = await getRepository(Match).count({
      relations: ['winner'],
      where: { winner: { id: userId } }
    });
    const matchsCount = await this.matchCount(userId);
    return matchsCount > 0 ? 100 * winsCount / matchsCount : 0;
  }

  async matchCount(userId: number): Promise<number> {
    return await getRepository(Match).count({
      relations: ['player1', 'player2', 'winner'],
      where: [
        { player1: { id: userId }, winner: Not(IsNull()) },
        { player2: { id: userId }, winner: Not(IsNull()) }
      ]
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

  async findGameMap(mapId: number): Promise<GameMap> {
    return await getRepository(GameMap).findOne(mapId);
  }
}
