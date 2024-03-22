import { useSocketContext } from '../lib/provider/SocketContextProvider';
import { useAppContext } from '../lib/provider/AppContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useSocket() {
  const { socketConnection, handleSelectRoom } = useSocketContext();
  const { user } = useAppContext();
  const router = useRouter();
  const createRoom = (invitee_id: string) => {
    if (!user?._id || !invitee_id) return;
    if (socketConnection) {
      socketConnection.emit('create-room', {
        inviter_id: user?._id,
        invitee_id: invitee_id,
      });
    }
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.on('room-created', (data) => {
        handleSelectRoom(data);
      });
    }

    return () => {
      if (socketConnection) {
        socketConnection.off('room-created');
      }
    };
  }, [socketConnection]);

  const joinRoom = (room_id: string) => {
    if (!room_id) return;
    if (socketConnection) {
      socketConnection.emit('join-room', room_id);
    }
  };
  return {
    joinRoom,
    createRoom,
  };
}
