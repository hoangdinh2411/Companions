'use client';
import React, { use, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAppContext } from './AppContextProvider';
import io from 'socket.io-client';
import { API_URL } from '../../actions/customFetch';
import { getToken } from '../../actions/tokens';
import { IRoom } from '@repo/shared';
import { signOut } from '../../actions/userApi';
import { toast } from 'react-toastify';

type SocketContextType = {
  socketClient: Socket | null;
  handleSetSocketClient: (socket: Socket) => void;
  selectedRoom: IRoom | null;
  handleSelectRoom: (room: IRoom) => void;
  roomList: IRoom[];
  updateRoomList: (roomList: IRoom[]) => void;
};

const SocketContext = React.createContext<SocketContextType>({
  socketClient: null,
  handleSetSocketClient: () => {},
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
  const { user, handleSetUser } = useAppContext();
  const [selectedRoom, setSelectedRoom] = React.useState<IRoom | null>(
    null as any
  );
  const [socketClient, setSocketConnection] = React.useState<Socket>(
    null as any
  );

  const [roomList, setRoomList] = React.useState<IRoom[]>([]);

  const handleSetSocketClient = (socket: Socket) => {
    setSocketConnection(socket);
  };

  const updateRoomList = (roomList: IRoom[]) => {
    setRoomList(roomList);
  };

  const handleSelectRoom = (room: IRoom) => {
    setSelectedRoom(room);
  };
  useEffect(() => {
    if (!user) return;
    if (socketClient) {
      socketClient.onAny((event, ...args) => {
        console.log(event, args);
      });
      socketClient.emit('get-start');
      socketClient.on('room-list', (data) => {
        if (data.length === 0) return;
        setRoomList(data);
      });
      socketClient.on('error', async (error) => {
        toast.error(error.message);
        if (error.message.includes('authorization')) {
          await signOut();
          handleSetUser(null as any);
        }
      });

      socketClient.on('invitation', (room) => {
        handleSelectRoom(room);
        socketClient.emit('invitation-accepted', room._id);
      });
    }

    return () => {
      if (socketClient) {
        socketClient.off('connect_error');
        socketClient.off('room-list');
        socketClient.off('invitation');
      }
    };
  }, [socketClient]);

  useEffect(() => {
    if (!user?._id) return;

    let socket: Socket;
    async function connectSocket() {
      const token = await getToken();
      const URL =
        process.env.NEXT_PUBLIC_NODE_ENV === 'prod' &&
        process.env.NEXT_PUBLIC_WEB_SOCKET
          ? process.env.NEXT_PUBLIC_WEB_SOCKET
          : 'http://localhost:4000';
      socket = io(URL + '/chat', {
        reconnectionDelayMax: 10000,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        secure: process.env.NEXT_PUBLIC_NODE_ENV === 'prod',

        auth: {
          token: token,
        },
      });

      if (socket.disconnected) {
        socket.on('connect_error', async (error) => {
          toast.error(error.message);
          if (error.message.includes('authorization')) {
            await signOut();
            handleSetUser(null as any);
          }
        });
        socket?.on('connect', () => {
          socket.on('ping', () => {});

          handleSetSocketClient(socket);
        });
      }
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    }

    if (!socketClient || socketClient?.disconnected) {
      connectSocket();
    }

    return () => {
      socket?.off('connect_error');
      socket?.off('connection');
      socket?.off('ping');
      socket?.on('disconnect', () => {
        handleSetSocketClient(null as any);
        console.log('user disconnected');
      });
    };
  }, [user]);

  useEffect(() => {
    if (selectedRoom) return;
    if (socketClient) {
      socketClient.emit('get-start');
    }
  }, [selectedRoom]);
  return (
    <SocketContext.Provider
      value={{
        roomList,
        updateRoomList,
        selectedRoom,
        handleSelectRoom,
        socketClient,
        handleSetSocketClient,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
