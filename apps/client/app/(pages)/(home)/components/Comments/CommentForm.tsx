'use client';
import { useState, useTransition } from 'react';
import TextField from '../../../../components/UI/TextField';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import Button from '../../../../components/UI/Button';
import { CommentFormData } from '@repo/shared';
import { addNewComment } from '../../../../actions/commentApi';

import { toast } from 'react-toastify';
import { useAppContext } from '../../../../lib/provider/AppContextProvider';

export default function CommentForm() {
  const [showEmoji, setShowEmoji] = useState(false);
  const [content, setContent] = useState('');
  const { user } = useAppContext();
  const [isPending, startTransition] = useTransition();
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setContent((prevText) => prevText + emojiObject.emoji);
    setShowEmoji(false);
  };
  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      if (!user._id) {
        toast.warning('You need to login to comment');
        return;
      }
      if (content === '') {
        toast.warning('Please enter a comment');
        return;
      }
      const formData: CommentFormData = {
        content,
      };
      const res = await addNewComment(formData);

      if (!res.success) {
        toast.error('Failed to add comment');
        return;
      }
    });
  };

  return (
    <form className="comments__form" onSubmit={handleSubmitComment}>
      <h4 className="comments__heading">Comments and Feedback</h4>

      <div className="writer-info">
        <TextField
          label="Full name"
          disabled
          readOnly
          placeholder="Enter your name"
          value={user?._id ? user.full_name : ''}
        />
        <TextField
          label="Email"
          disabled
          readOnly
          placeholder="Enter your email"
          value={user?._id ? user.email : ''}
        />
      </div>

      {!user?._id && (
        <p className="comments__notice">
          ***Please sign in to leave a comment or feedback on the app
        </p>
      )}
      <fieldset className="text-area-box">
        <textarea
          value={content}
          className="comments__input"
          onChange={(e) => setContent(e.target.value)}
          placeholder="Let us know what you think or what we can improve the app...!"
        />
        <Image
          src="/emoji.png"
          alt="choose emoji"
          className="emoji"
          width={24}
          height={24}
          title="Choose emoji"
          onClick={() => setShowEmoji(!showEmoji)}
        />
        <span
          className={`overlay ${showEmoji ? 'open' : ''}`}
          onClick={() => setShowEmoji(false)}
        ></span>
      </fieldset>
      <EmojiPicker
        width="100%"
        onEmojiClick={handleEmojiClick}
        lazyLoadEmojis
        open={showEmoji}
        searchDisabled
        style={{
          zIndex: 10,
        }}
      />

      <Button
        className="comments__submit"
        size="small"
        variant="green"
        loading={isPending}
      >
        Submit
      </Button>
    </form>
  );
}
