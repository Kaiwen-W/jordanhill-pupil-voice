import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin }) {
  // Calculates word count and approximate read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div
      className="h-2/5 w-10/12
      bg-gray-800/30 border border-gray-900   
      my-6 p-8 rounded-lg border-solid 
      shadow-md z-10
      backdrop-blur-[100px]
      text-white"
    >
      <Link legacyBehavior href={`/${post.username}`}>
        <a className="text-xl">
          <strong> By </strong>
          <strong className="text-gray-400"> @{post.username} </strong>
        </a>
      </Link>

      <Link legacyBehavior href={`/${post.username}/${post.slug}`}>
        <h2 className="text-lg">
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer className="mt-2">
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="float-right">💗 {post.heartCount || 0} Hearts</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link legacyBehavior href={`/admin/${post.slug}`}>
            <h3 className="mt-3">
              <button className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  inline-flex items-center">
                Edit
              </button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-green-600 text-lg">Live</p>
          ) : (
            <p className="text-red-600 text-lg">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
}
