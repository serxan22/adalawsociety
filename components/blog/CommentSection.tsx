"use client";

import { Heart, MessageSquare, Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Comment = {
  id: number;
  author: string;
  text: string;
  likes: number;
  liked: boolean;
  replies: Comment[];
};

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Student Contributor",
    text: "The summary-first workflow makes the argument much easier to evaluate before the article grows too long.",
    likes: 4,
    liked: false,
    replies: [],
  },
];

export function CommentSection() {
  const { t } = useI18n();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [displayName, setDisplayName] = useState("");
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const totalComments = useMemo(
    () => comments.reduce((total, comment) => total + 1 + comment.replies.length, 0),
    [comments],
  );
  const commentAuthors = useMemo(() => {
    const names = new Set<string>();
    comments.forEach((comment) => {
      names.add(comment.author);
      comment.replies.forEach((reply) => names.add(reply.author));
    });
    return Array.from(names);
  }, [comments]);
  const currentAuthor = displayName.trim() || "Guest Reader";

  const addComment = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    setComments((current) => [
      {
        id: Date.now(),
        author: currentAuthor,
        text: text.trim(),
        likes: 0,
        liked: false,
        replies: [],
      },
      ...current,
    ]);
    setText("");
  };

  const addReply = (commentId: number) => {
    if (!replyText.trim()) return;
    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  author: currentAuthor,
                  text: replyText.trim(),
                  likes: 0,
                  liked: false,
                  replies: [],
                },
              ],
            }
          : comment,
      ),
    );
    setReplyText("");
    setReplyingTo(null);
  };

  const toggleLike = (commentId: number, replyId?: number) => {
    setComments((current) =>
      current.map((comment) => {
        if (replyId && comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === replyId
                ? { ...reply, liked: !reply.liked, likes: reply.likes + (reply.liked ? -1 : 1) }
                : reply,
            ),
          };
        }

        if (comment.id !== commentId) return comment;
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.likes + (comment.liked ? -1 : 1),
        };
      }),
    );
  };

  return (
    <section className="rounded-lg border border-als-line bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-als-red">{t.blog.comments}</p>
          <h2 className="mt-2 text-2xl font-bold text-als-blue">
            {totalComments} {totalComments === 1 ? "comment" : "comments"}
          </h2>
        </div>
        <MessageSquare className="h-8 w-8 text-als-red" aria-hidden="true" />
      </div>

      <form onSubmit={addComment} className="mt-6 space-y-3">
        <Input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder={t.blog.commentNamePlaceholder}
          aria-label={t.blog.commentName}
        />
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t.blog.addComment}
          aria-label={t.blog.addComment}
        />
        <MentionSuggestions
          value={text}
          names={commentAuthors}
          onSelect={(name) => setText((current) => insertMention(current, name))}
        />
        <Button type="submit" className="gap-2">
          <Send className="h-4 w-4" />
          {t.common.submit}
        </Button>
      </form>

      <div className="mt-8 space-y-5">
        {comments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-als-line p-6 text-center text-sm text-als-muted">
            {t.blog.emptyComments}
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border border-als-line p-4">
              <CommentBody
                comment={comment}
                onLike={() => toggleLike(comment.id)}
                onReply={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              />
              {replyingTo === comment.id ? (
                <div className="mt-4 space-y-3 border-l-2 border-als-red/30 pl-4">
                  <Textarea
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    placeholder={t.blog.reply}
                    aria-label={t.blog.reply}
                    className="min-h-20"
                  />
                  <MentionSuggestions
                    value={replyText}
                    names={commentAuthors}
                    onSelect={(name) => setReplyText((current) => insertMention(current, name))}
                  />
                  <Button type="button" size="sm" onClick={() => addReply(comment.id)}>
                    {t.blog.reply}
                  </Button>
                </div>
              ) : null}
              {comment.replies.length > 0 ? (
                <div className="mt-4 space-y-3 border-l-2 border-als-line pl-4">
                  {comment.replies.map((reply) => (
                    <CommentBody
                      key={reply.id}
                      comment={reply}
                      isReply
                      onLike={() => toggleLike(comment.id, reply.id)}
                      onReply={() => setReplyingTo(comment.id)}
                    />
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function CommentBody({
  comment,
  isReply = false,
  onLike,
  onReply,
}: {
  comment: Comment;
  isReply?: boolean;
  onLike: () => void;
  onReply: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className={cn("space-y-3", isReply && "rounded-lg bg-als-blue/[0.04] p-3")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-als-blue">{comment.author}</h3>
          <p className="mt-1 text-sm leading-6 text-als-muted">
            <MentionedText text={comment.text} />
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onLike}
          className={cn(
            "inline-flex h-8 items-center gap-1 rounded-full border border-als-line px-3 text-xs font-semibold transition",
            comment.liked ? "border-als-red text-als-red" : "text-als-muted hover:text-als-red",
          )}
        >
          <Heart className="h-3.5 w-3.5" fill={comment.liked ? "currentColor" : "none"} />
          {comment.likes}
        </button>
        {!isReply ? (
          <button
            type="button"
            onClick={onReply}
            className="inline-flex h-8 items-center rounded-full border border-als-line px-3 text-xs font-semibold text-als-muted transition hover:text-als-red"
          >
            {t.blog.reply}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function getMentionQuery(value: string) {
  const match = value.match(/(^|\s)@([\p{L}\p{N}._-]*)$/u);
  return match ? match[2].toLowerCase() : null;
}

function insertMention(value: string, name: string) {
  return value.replace(/(^|\s)@([\p{L}\p{N}._-]*)$/u, `$1@${name} `);
}

function MentionSuggestions({
  value,
  names,
  onSelect,
}: {
  value: string;
  names: string[];
  onSelect: (name: string) => void;
}) {
  const query = getMentionQuery(value);
  const suggestions =
    query === null
      ? []
      : names
          .filter((name) => name.toLowerCase().includes(query))
          .filter((name, index, list) => list.indexOf(name) === index)
          .slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-als-line bg-[#fbfcfe] p-2">
      {suggestions.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className="rounded-full border border-als-line bg-white px-3 py-1 text-xs font-bold text-als-blue transition hover:border-als-red/35 hover:bg-als-red/5 hover:text-als-red"
        >
          @{name}
        </button>
      ))}
    </div>
  );
}

function MentionedText({ text }: { text: string }) {
  return text
    .split(/(@[\p{L}\p{N}._-]+(?:\s+[\p{L}\p{N}._-]+)?)/gu)
    .filter(Boolean)
    .map((part, index) =>
      part.startsWith("@") ? (
        <span
          key={`${part}-${index}`}
          className="rounded-full bg-als-red/10 px-1.5 py-0.5 font-bold text-als-red"
        >
          {part}
        </span>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      ),
    );
}
