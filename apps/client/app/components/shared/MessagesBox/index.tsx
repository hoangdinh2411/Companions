'use client';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeftIcon, MessageBoxIcon } from '../../../lib/config/svg';
import './MessagesBox.scss';
import Conversation from './Conversation';
import List from './List';
import { useAppContext } from '../../../lib/provider/AppContextProvider';
import { useSocketContext } from '../../../lib/provider/SocketContextProvider';

export default function MessagesBox() {
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const { user } = useAppContext();
  const { socketClient, selectedRoom, handleSelectRoom } = useSocketContext();
  // Room list will include 1-2 last messages from each room

  const handleLeaveRoom = () => {
    if (selectedRoom?._id) {
      handleSelectRoom(null as any);
      if (socketClient) {
        socketClient.emit('leave-room', selectedRoom._id);
      }
    }
  };

  const handleCloseChatList = () => {
    setIsChatListOpen(false);
    handleSelectRoom(null as any);
  };

  useEffect(() => {
    if (selectedRoom && !isChatListOpen) {
      setIsChatListOpen(true);
    }
  }, [selectedRoom]);

  const getRoomTitle = useCallback(() => {
    if (selectedRoom && user?._id) {
      const receiver = selectedRoom?.users.find((u) => u._id !== user?._id);
      return receiver?.full_name || 'Message';
    }

    return 'Chat list';
  }, [selectedRoom]);

  if (!user?._id) return null;

  return (
    <div className={`messages-box ${isChatListOpen ? ' open' : 'hide'}`}>
      <div
        className="messages-box__icon"
        onClick={() => setIsChatListOpen(!isChatListOpen)}
      >
        <MessageBoxIcon />
      </div>
      <div className="messages-box__content">
        <div className="messages-box__header">
          {Boolean(selectedRoom?._id) && isChatListOpen && (
            <span onClick={handleLeaveRoom}>
              <ArrowLeftIcon />
            </span>
          )}
          <p>{getRoomTitle()}</p>
          <span onClick={handleCloseChatList}>X</span>
        </div>
        {!selectedRoom ? (
          <List show={selectedRoom === null} />
        ) : (
          <Conversation onConversation={selectedRoom !== null} />
        )}
      </div>
    </div>
  );
}
