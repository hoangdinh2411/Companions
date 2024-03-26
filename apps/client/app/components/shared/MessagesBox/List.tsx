import Image from 'next/image';
import { useSocketContext } from '../../../lib/provider/SocketContextProvider';
import { IRoom, MessageDocument, MessageStatusEnum } from '@repo/shared';
import { useAppContext } from '../../../lib/provider/AppContextProvider';
import dayjsConfig from '../../../lib/config/dayjsConfig';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

type Props = {
  show: boolean;
};

export default function List({ show }: Props) {
  const {
    socketClient,
    handleSelectRoom,
    roomList,
    selectedRoom,
    updateRoomList,
  } = useSocketContext();
  const { user } = useAppContext();

  const handleJoinRoom = (room: IRoom) => {
    if (socketClient) {
      handleSelectRoom(room);
      socketClient.emit('join-room', room._id);
    }
  };

  const showWhoseMessage = (room: IRoom) => {
    if (!user || !room) return '';
    const sender = room?.users?.find((u) => u._id !== user?._id);
    if (!sender) return '';
    const sender_name =
      sender._id === user._id ? 'You: ' : `${sender.full_name}: `;
    return sender_name + room?.messages[0].content;
  };

  const statusMessage = (room: IRoom) => {
    if (user?._id === room?.messages?.[0]?.sender?._id) return '';
    if (room.messages[0]?.seen_by) return '';
    switch (room?.messages[0]?.status) {
      case MessageStatusEnum.SENDING:
        return 'sending';
      case MessageStatusEnum.RECEIVED:
        return 'unread';
      default:
        return '';
    }
  };

  function changeLastMessageForRoom(newMessage: MessageDocument) {
    const newRoomList = roomList.map((room: IRoom) => {
      if (room._id === newMessage.room._id) {
        return { ...room, messages: [newMessage] };
      }
      return room;
    });

    updateRoomList(newRoomList);
  }

  useEffect(() => {
    if (!user) return;

    if (socketClient) {
      socketClient.on('update-room-on-list', (newMessage: MessageDocument) => {
        if (user._id !== newMessage.sender._id) {
          toast.info(`${newMessage.sender.full_name} sent a message`, {
            position: 'top-right',
            autoClose: 3000,
          });
          socketClient.emit('message-received', newMessage);
        } else {
          changeLastMessageForRoom(newMessage);
        }
      });
      socketClient.on(
        'update-message-to-received',
        (newMessage: MessageDocument) => {
          changeLastMessageForRoom(newMessage);
        }
      );
      socketClient.on(
        'update-message-to-seen',
        (newMessage: MessageDocument) => {
          if (user._id === newMessage.sender._id) {
            const newRoomList = roomList.map((room: IRoom) => {
              if (room._id === newMessage.room._id) {
                return { ...room, messages: [newMessage] };
              }
              return room;
            });

            updateRoomList(newRoomList);
          }
        }
      );
    }

    return () => {
      if (socketClient) {
        socketClient.off('room-list');
        socketClient.off('update-room-on-list');
        socketClient.off('update-message-to-received');
      }
    };
  }, [socketClient]);

  return (
    <div className={`chat-list ${show ? 'show' : 'hide'} `}>
      <ul className="chat-list__container">
        {Array.isArray(roomList) &&
          roomList?.map((room, index) => (
            <li
              className={`chat-list__item ${statusMessage(room)}`}
              key={index}
              onClick={() => handleJoinRoom(room)}
            >
              <div className="chat-list__item__avatar">
                <Image
                  src="/anonymous.jpg"
                  alt="avatar"
                  width={28}
                  height={28}
                />
              </div>
              <div className="chat-list__item__content">
                <div className="chat-list__item__content__name">
                  {room?.users?.find((u) => u._id !== user?._id)?.full_name}
                </div>
                <div className="chat-list__item__content__message">
                  {room?.messages?.length > 0 && (
                    <>
                      <span
                        className="message__text"
                        title={showWhoseMessage(room)}
                      >
                        {showWhoseMessage(room)}
                      </span>
                      <span className="message__time">
                        {dayjsConfig(room?.messages[0].updated_at).fromNow()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
