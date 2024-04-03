import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function CommentList({ comments }) {
  return comments
    ? comments.map((comment) => <Comment comment={comment} />)
    : null;
}

function Comment({ comment }) {
  const createdAt =
    typeof comment?.createdAt === "number"
      ? new Date(comment.createdAt)
      : comment.createdAt.toDate();

  const createdAtString = createdAt.toISOString();
  const date = createdAtString.substring(0, 10);
  const time = createdAtString.substring(11, 16);

  return (
    <div
      className="w-8/9
      bg-gray-800/30 border border-gray-900   
      p-4 rounded-lg border-solid 
      shadow-md z-1
      backdrop-blur-[100px]
      text-white
      mx-[2%]"
    >
      <Link legacyBehavior href={`/${comment.username}`}>
        <a>
          <strong className="text-gray-400 text-base block">
            {" "}
            @{comment.username}{" "}
          </strong>
        </a>
      </Link>

      <span className="text-xs italic">
        {date} {""} {time}
      </span>

      {/* change this to react markdown later */}
      <ReactMarkdown className="text-sm break-words">
        {comment?.content}
      </ReactMarkdown>
    </div>
  );
}
