import { MessageDocument } from '@repo/shared';
import MessageModel from '../models/Message.model';

const MessageService = {
  addNew: async (content: string, sender_id: string, room_id: string) => {
    try {
      const message = await MessageModel.create({
        content,
        sender: sender_id,
        room: room_id,
      });

      return (await message.populate('sender')) as MessageDocument;
    } catch (error) {
      throw error;
    }
  },
};

export default MessageService;
