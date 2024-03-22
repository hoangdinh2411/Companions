'use client';
import Image from 'next/image';
import React, { useState, useTransition } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { CommentDocument, ResponseWithPagination } from '@repo/shared';
import EmojiPicker from 'emoji-picker-react';
import { deleteComment, updateComment } from '../../../../actions/commentApi';
import { toast } from 'react-toastify';
import { useAppContext } from '../../../../lib/provider/AppContextProvider';
dayjs.extend(relativeTime);

export default function List({
  data,
}: {
  data: ResponseWithPagination<CommentDocument>;
}) {
  const [editComment, setEditComment] = useState<CommentDocument | null>(null);
  const { user } = useAppContext();
  const [showEmoji, setShowEmoji] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    if (editComment) {
      setEditComment({
        ...editComment,
        content: editComment.content + emojiObject.emoji,
      });
      setShowEmoji(false);
    }
  };

  const handleCancelEdit = () => {
    setEditComment(null);
  };

  const handleEditComment = (comment: CommentDocument) => {
    if (!editComment) {
      setEditComment(comment);
      return;
    }
    if (!user?._id) return;
    if (!editComment) return;
    if (editComment.content === '') {
      toast.error('Cannot update empty comment');
      return;
    }
    if (!comment._id) {
      toast.error('Cannot edit this comment');
      return;
    }
    startTransition(async () => {
      const res = await updateComment(comment._id, {
        content: editComment.content,
      });
      if (res.message) {
        toast.error(res.message);
      }
      handleCancelEdit();
    });
  };

  const handleDeleteComment = (id: string) => {
    if (editComment && editComment._id) {
      handleCancelEdit();
      return;
    }
    if (!user?._id) return;
    if (!id) return;
    if (!id) {
      toast.error('Cannot edit this comment');
      return;
    }
    startTransition(async () => {
      const res = await deleteComment(id);
      if (res.message) {
        toast.error(res.message);
      }
    });
  };

  const renderActions = (comment: CommentDocument) => {
    if (!comment._id) return null;
    if (user?._id !== comment.created_by._id) return null;
    if (isPending && editComment && editComment._id === comment._id) {
      return <p>Updating...</p>;
    }
    return (
      <p className="actions">
        <span onClick={() => handleEditComment(comment)}>
          {editComment && editComment._id === comment._id ? 'Save' : 'Edit'}
        </span>
        <span onClick={() => handleDeleteComment(comment._id)}>
          {editComment && editComment._id === comment._id ? 'Cancel' : 'Delete'}
        </span>
      </p>
    );
  };

  const renderUpdateForm = (comment: CommentDocument) => {
    if (!editComment) return null;
    if (comment._id !== editComment._id) return null;
    return (
      <div className="text-area-box">
        <textarea
          value={editComment.content}
          className="comments__input"
          onChange={(e) =>
            setEditComment({
              ...editComment,
              content: e.target.value,
            })
          }
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
      </div>
    );
  };

  return (
    <article className="comments__list">
      <p className="comments__total">
        {data?.pagination?.total.toLocaleString()} comments{' '}
      </p>
      <br />
      <ul>
        {data?.items.map((comment: CommentDocument) => (
          <li className="comments__item" key={comment._id}>
            <span className="comments__item__avatar">
              {comment.created_by.full_name.charAt(0).toUpperCase()}
            </span>

            <article className="comments__item__content">
              <div className="contents__full-name">
                {comment.created_by.full_name}
                {renderActions(comment)}
              </div>
              {renderUpdateForm(comment)}
              {!editComment && (
                <p className="contents__content">{comment.content}</p>
              )}
              <p className="contents__date">
                {dayjs(comment.created_at).fromNow()}{' '}
                {dayjs(comment.created_at) < dayjs(comment.updated_at) &&
                  ' (edited)'}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </article>
  );
}
