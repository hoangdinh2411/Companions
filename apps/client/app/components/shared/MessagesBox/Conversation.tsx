'use client';
import React, { useEffect } from 'react';
import { SendIcon } from '../../../lib/config/svg';
import { useSocketContext } from '../../../lib/provider/SocketContextProvider';
import {
  MessageDocument,
  MessageStatusEnum,
  ResponseWithPagination,
} from '@repo/shared';
import { useAppContext } from '../../../lib/provider/AppContextProvider';
import dayjsConfig from '../../../lib/config/dayjsConfig';

type Props = {
  onConversation: boolean;
};

export default function Conversation({ onConversation = false }: Props) {
  const { socketConnection, selectedRoom } = useSocketContext();
  const { user } = useAppContext();
  const [messages, setMessages] = React.useState<MessageDocument[]>([]);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);
  const handleSendMessage = (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (contentRef.current && socketConnection && selectedRoom) {
      if (contentRef.current.value.trim() === '') return;
      const receiver = selectedRoom.users.find((u) => u._id !== user?._id);
      socketConnection?.emit('send-message', {
        content: contentRef.current.value.trim(),
        room: selectedRoom._id,
        sender_id: user?._id,
        receiver_id: receiver?._id,
      });
      contentRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!socketConnection) return;

    socketConnection.on(
      'receive-messages-list',
      (data: ResponseWithPagination<MessageDocument>) => {
        setMessages(data.items);
      }
    );
    socketConnection.on('receive-message', (newMessage: MessageDocument) => {
      //if the receiver is not the sender and is on the conversation, will update the message status to read and add the message to the conversation on the event (status-updated-on-conversation)
      if (newMessage.sender._id !== user?._id) {
        socketConnection.emit('message-read', {
          message: newMessage,
          user_id: user?._id,
        });
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socketConnection.on('status-updated-on-conversation', (updatedMessage) => {
      if (updatedMessage.sender._id === user?._id) {
        setMessages((prev) => {
          return prev.map((m) => {
            if (m._id === updatedMessage._id) {
              return updatedMessage;
            }
            return m;
          });
        });
      } else {
        setMessages((prev) => [...prev, updatedMessage]);
      }
    });

    return () => {
      if (socketConnection) {
        socketConnection.off('status-updated-on-conversation');
        socketConnection.off('receive-messages-list');
      }
    };
  }, [socketConnection]);

  useEffect(() => {
    if (!selectedRoom) return;
    if (socketConnection) {
      socketConnection.emit('get-messages', {
        room_id: selectedRoom?._id,
        user_id: user?._id,
        page: 1,
      });
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (contentWrapperRef.current) {
      contentWrapperRef.current.scrollTop =
        contentWrapperRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedRoom && socketConnection) {
      socketConnection?.emit('join-room', selectedRoom._id);
    }
  }, []);

  return (
    <div className={`conversation ${onConversation ? 'show' : 'hide'}`}>
      <div className="conversation__wrapper" ref={contentWrapperRef}>
        {messages &&
          messages.map((message, index) => (
            <div
              key={message._id}
              className={`conversation__content ${message.sender?._id === user?._id ? 'sender' : ''} `}
            >
              <div className="conversation__content__avatar">
                <span>{message.sender.full_name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="conversation__content__message">
                <span className="message__text">{message.content}</span>
                <span className="message__time ">
                  {dayjsConfig(message.updated_at).fromNow()}
                </span>
              </div>
            </div>
          ))}
      </div>
      <div className="message-input">
        <textarea
          placeholder="Typing..."
          ref={contentRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <span className="enter-icon" onClick={handleSendMessage}>
          <SendIcon />
        </span>
      </div>
    </div>
  );
}
