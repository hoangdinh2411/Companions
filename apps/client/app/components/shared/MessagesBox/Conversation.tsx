'use client';
import React, { useEffect } from 'react';
import { SendIcon } from '../../../lib/config/svg';
import { useSocketContext } from '../../../lib/provider/SocketContextProvider';
import { MessageDocument, ResponseWithPagination } from '@repo/shared';
import { useAppContext } from '../../../lib/provider/AppContextProvider';
import dayjsConfig from '../../../lib/config/dayjsConfig';

type Props = {
  onConversation: boolean;
};

export default function Conversation({ onConversation = false }: Props) {
  const { socketClient, selectedRoom } = useSocketContext();
  const { user } = useAppContext();
  const [messages, setMessages] = React.useState<MessageDocument[]>([]);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);
  const [typing, setTyping] = React.useState<boolean>(false);
  const handleSendMessage = (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (contentRef.current && socketClient && selectedRoom) {
      if (contentRef.current.value.trim() === '') return;
      const receiver = selectedRoom.users.find((u) => u._id !== user?._id);
      socketClient?.emit('send-message', {
        content: contentRef.current.value.trim(),
        room: selectedRoom._id,
        receiver_id: receiver?._id,
      });
      contentRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!socketClient) return;
    if (!user) return;
    socketClient.on(
      'receive-messages-list',
      (data: ResponseWithPagination<MessageDocument>) => {
        setMessages(data.items);
      }
    );

    socketClient.on('receive-message', (newMessage: MessageDocument) => {
      // //if the receiver is not the sender and is on the conversation, will update the message status to read and add the message to the conversation on the event (status-updated-on-conversation)
      if (newMessage.sender._id.toString() !== user?._id.toString()) {
        console.log('receive-message', newMessage);

        socketClient.emit('message-read', {
          message: newMessage,
        });
        setMessages((prev) => [...prev, newMessage]);
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socketClient.on('update-message-to-received', (updatedMessage) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message
        )
      );
    });
    socketClient.on('update-message-to-seen', (updatedMessage) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message
        )
      );
    });

    socketClient.on('sender-typing', (data) => {
      if (user._id !== data) {
        setTyping(true);
      }
    });
    socketClient.on('sender-stop-typing', (data) => {
      if (user._id !== data) {
        setTyping(false);
      }
    });

    return () => {
      if (socketClient) {
        socketClient.off('receive-message');
        socketClient.off('receive-messages-list');
        socketClient.off('update-message-to-received');
        socketClient.off('update-message-to-seen');
        socketClient.off('sender-typing');
        socketClient.off('sender-stop-typing');
      }
    };
  }, [socketClient]);

  const handleTypingInTextField = () => {
    if (socketClient && selectedRoom) {
      socketClient.emit('typing', {
        room_id: selectedRoom._id,
      });
    }
  };
  const handleStopTypingInTextField = () => {
    if (socketClient && selectedRoom) {
      if (contentRef.current && contentRef.current.value.trim() === '') {
        socketClient.emit('stop-typing', {
          room_id: selectedRoom._id,
        });
        return;
      }
      socketClient.emit('stop-typing', {
        room_id: selectedRoom._id,
      });
    }
  };
  useEffect(() => {
    if (!selectedRoom) return;
    if (socketClient) {
      socketClient.emit('get-messages', {
        room_id: selectedRoom?._id,
        page: 1,
      });
      socketClient.emit('join-room', selectedRoom._id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (contentWrapperRef.current) {
      contentWrapperRef.current.scrollTop =
        contentWrapperRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedRoom && socketClient) {
      socketClient?.emit('join-room', selectedRoom._id);
    }
  }, []);

  return (
    <div className={`conversation ${onConversation ? 'show' : 'hide'}`}>
      <div className="conversation__wrapper" ref={contentWrapperRef}>
        {messages &&
          messages.map((message) => (
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
          placeholder="Write a message..."
          ref={contentRef}
          onFocus={handleTypingInTextField}
          onBlur={handleStopTypingInTextField}
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
        {typing && <span className="typing">...Typing</span>}
      </div>
    </div>
  );
}
