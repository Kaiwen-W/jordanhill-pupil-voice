import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem() {
  // Calculates word count and approximate read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div
      className="h-2/5 w-10/12
    bg-gray-800/30 border border-gray-900   
    mx-0 my-6 p-8 rounded-lg border-solid 
    shadow-md z-1
    backdrop-blur-[100px]"
    >
      <Link>
        <a href={`/${post.username}`}>
          <strong> By @{post.username}</strong>
        </a>
      </Link>

      <Link>
        <h2>
          <a href={`/${post.username}/${post.slug}`}>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="">💗 {post.heartCount || 0} Hearts</span>{" "}
        {/* push-left */}
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link legacyBehavior href={`/admin/${post.slug}`}>
            <h3>
              <button className="bg-gray-500 text-white">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-green-600">Live</p>
          ) : (
            <p className="text-red-600">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
}
