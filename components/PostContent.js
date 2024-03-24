import Link from "next/link";
import ReactMarkdown from "react-markdown";

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  const createdAtString = createdAt.toISOString();
  const date = createdAtString.substring(0, 10);
  const time = createdAtString.substring(11, 16);

  return (
    <div
      className="h-3-5 w-3/5
			bg-gray-800/30 border border-gray-900   
			my-6 p-8 rounded-lg border-solid 
			shadow-md z-1
			backdrop-blur-[100px]
			text-white
			ml-[5%]"
    >
      <h1 className="font-bold text-3xl mb-3">{post?.title}</h1>
      <span className="text-gray-100 text-lg">
        Written by {""}
        <Link legacyBehavior href={`/${post.username}/`}>
          <a className="text-gray-400">@{post.username}</a>
        </Link>{" "}
        {""}
        on {date} {""} at {time}.
      </span>
      <ReactMarkdown className="mt-3 break-words">
        {post?.content}
      </ReactMarkdown>
    </div>
  );
}
