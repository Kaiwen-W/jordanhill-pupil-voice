import ReactMarkdown from "react-markdown";

export default function CommentList({ comments }) {
  //   return comments
  //     ? comments.map((comment) => (
  //         <PostItem comment={comment} />
  //       ))
  //     : null;

  return (
    <>
      <div
        className="w-7/9 
                  border border-gray-900   
                  p-4 rounded-lg border-solid 
                  shadow-md z-1
                  text-white
                  ml-[5%] mr-[5%]"
      >
        <Comment />
        <Comment />
      </div>
    </>
  );
}

function Comment({ comment }) {
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
      {/* <Link legacyBehavior href={`/${post.username}`}>
        <a className="text-xl">
          <strong className="text-gray-400"> @{post.username} </strong>
        </a>
      </Link> */}

      <strong className="text-gray-400 text-sm block opacity-100">
        {" "}
        @Joshua{" "}
      </strong>

      {/* change this to react markdown later */}
      <span className="text-xs">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut
        efficitur quam. Aliquam quis posuere turpis. Class aptent taciti
        sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
      </span>
    </div>
  );
}
