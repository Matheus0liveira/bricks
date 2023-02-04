import { create } from 'zustand';
import { TOTAL_COLS as COLUMNS } from '@/utils';
import { GameService } from '@/services/game.service';
import { Session } from 'next-auth';
import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@/types/socketEvents';

type Player = {
  position: number;
  id: string;
};

export type UseGameStore = {
  status: 'paused' | 'running';
  /**
   * @deprecated
   */
  currentSelect: number;
  /**
   * @deprecated
   */
  currentPointPosition: number | null;

  /**
   * @deprecated
   */
  handleChangeSelect: (
    session: Session,
    socket: Socket,
    keyRoom: string
  ) => (type: 'up' | 'down' | 'left' | 'right') => void;
  /**
   * @deprecated
   */
  handleChangePointPosition: (position: number | null) => void;
  toggleStatus: () => void;
  players: Player[];
  changePlayerPosition: (p: Player) => void;
};

export const useGameStore = create<UseGameStore>((set) => {
  const service = new GameService();

  return {
    status: 'paused',
    currentSelect: 0,
    currentPointPosition: null,
    players: [],
    changePlayerPosition({ id, position }) {
      set((s) => ({
        ...s,
        players: s.players.map((p) => (p.id === id ? { ...p, position } : p)),
      }));
    },
    handleChangePointPosition(position) {
      return set((s) => ({ ...s, currentPointPosition: position }));
    },
    handleChangeSelect(session, socket, keyRoom) {
      console.log({ socket });
      const emitChangePosition = (position: number) => {
        socket.emit(SOCKET_EVENTS.CHANGE_POSITION_BY_ROOM, {
          keyRoom,
          position,
          playerId: session.user.id,
        });
      };

      return (type) => {
        if (type === 'up') {
          return set((s) => {
            const newPosition = s.currentSelect - COLUMNS;
            service.sendPosition(newPosition);
            emitChangePosition(newPosition);
            return { ...s, currentSelect: newPosition };
          });
        }
        if (type === 'down') {
          return set((s) => {
            const newPosition = s.currentSelect + COLUMNS;
            emitChangePosition(newPosition);

            service.sendPosition(newPosition);

            return { ...s, currentSelect: newPosition };
          });
        }
        if (type === 'left') {
          return set((s) => {
            const newPosition = s.currentSelect - 1;
            service.sendPosition(newPosition);
            emitChangePosition(newPosition);

            return { ...s, currentSelect: newPosition };
          });
        }
        if (type === 'right') {
          return set((s) => {
            const newPosition = s.currentSelect + 1;
            emitChangePosition(newPosition);

            service.sendPosition(newPosition);

            return { ...s, currentSelect: newPosition };
          });
        }
      };
    },
    toggleStatus() {
      return set((s) => ({
        ...s,
        status: s.status === 'paused' ? 'running' : 'paused',
      }));
    },
  };
});
