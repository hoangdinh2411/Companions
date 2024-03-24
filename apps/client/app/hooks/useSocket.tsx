import { useSocketContext } from '../lib/provider/SocketContextProvider';
import { useAppContext } from '../lib/provider/AppContextProvider';
import { useEffect } from 'react';

export default function useSocket() {
  const { socketClient, handleSelectRoom } = useSocketContext();
  const { user } = useAppContext();
  const createRoom = (invitee_id: string) => {
    if (!user?._id || !invitee_id) return;
    if (socketClient) {
      socketClient.emit('create-room', {
        inviter_id: user?._id,
        invitee_id: invitee_id,
      });
    }
  };

  useEffect(() => {
    if (socketClient) {
      socketClient.on('room-created', (data) => {
        handleSelectRoom(data);
      });
    }

    return () => {
      if (socketClient) {
        socketClient.off('room-created');
      }
    };
  }, [socketClient]);

  const joinRoom = (room_id: string) => {
    if (!room_id) return;
    if (socketClient) {
      socketClient.emit('join-room', room_id);
    }
  };
  return {
    joinRoom,
    createRoom,
  };
}
