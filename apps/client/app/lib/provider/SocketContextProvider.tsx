'use client';
import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAppContext } from './AppContextProvider';
import socketClient from 'socket.io-client';
import { API_URL } from '../../actions/customFetch';
import { getToken } from '../../actions/tokens';
import { IRoom } from '@repo/shared';
import { signOut } from '../../actions/userApi';
import { toast } from 'react-toastify';

type SocketContextType = {
  socketConnection: Socket | null;
  handleSetSocketConnection: (socket: Socket) => void;
  selectedRoom: IRoom | null;
  handleSelectRoom: (room: IRoom) => void;
  roomList: IRoom[];
  updateRoomList: (roomList: IRoom[]) => void;
};

const SocketContext = React.createContext<SocketContextType>({
  socketConnection: null,
  handleSetSocketConnection: () => {},
  selectedRoom: null,
  handleSelectRoom: () => {},
  roomList: [],
  updateRoomList: () => {},
});

export const useSocketContext = () => React.useContext(SocketContext);
export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppContext();
  const [selectedRoom, setSelectedRoom] = React.useState<IRoom | null>(
    null as any
  );
  const [socketConnection, setSocketConnection] = React.useState<Socket>(
    null as any
  );

  const [roomList, setRoomList] = React.useState<IRoom[]>([]);

  const handleSetSocketConnection = (socket: Socket) => {
    setSocketConnection(socket);
  };

  const updateRoomList = (roomList: IRoom[]) => {
    setRoomList(roomList);
  };

  const handleSelectRoom = (room: IRoom) => {
    setSelectedRoom(room);
  };
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('get-start', {
        user_id: user._id,
        session_id: socketConnection.id,
      });
      socketConnection.on('room-list', (data) => {
        if (data.length === 0) return;
        setRoomList(data);
      });
      socketConnection.on('connect_error', (error) => {
        console.log(error);

        toast.error('Connection error');
      });
      socketConnection.on('invitation', (room) => {
        handleSelectRoom(room);
        socketConnection.emit('invitation-accepted', room._id);
      });
    }

    return () => {
      if (socketConnection) {
        socketConnection.off('connect_error');
        socketConnection.off('room-list');
        socketConnection.off('invitation');
      }
    };
  }, [socketConnection]);

  useEffect(() => {
    if (!user?._id) return;
    let socket: Socket;
    async function connectSocket() {
      const token = await getToken();
      socket = socketClient(API_URL, {
        extraHeaders: {
          token: 'aaa',
        },
      });

      socket?.on('connect', () => {
        console.log('connected');

        handleSetSocketConnection(socket);
      });
    }

    if (!socketConnection || socketConnection?.disconnected) {
      connectSocket();
    }

    return () => {
      socket?.on('disconnect', () => {
        handleSetSocketConnection(null as any);
        console.log('user disconnected');
      });
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        roomList,
        updateRoomList,
        selectedRoom,
        handleSelectRoom,
        socketConnection,
        handleSetSocketConnection,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
