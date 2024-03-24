import { auth } from "@/lib/firebase";
import {
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import AuthCheck from "@/components/AuthCheck";

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);

  const { slug } = router.query;

  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts",
    slug
  );
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main>
      {post && (
        <div>
          <button onClick={() => router.back()} className="text-white p-6">
            ← Go back
          </button>
          <div className="flex flex-row">
            <section
              className="h-3-5 w-3/5
                      bg-gray-800/30 border border-gray-900   
                      my-6 p-8 rounded-lg border-solid 
                      shadow-md z-1
                      backdrop-blur-[100px]
                      text-white
                      ml-[5%]"
            >
              <h1 className="font-bold text-3xl mb-3 ">{post.title}</h1>
              <p className="text-gray-100 text-lg ">ID: {post.slug}</p>

              <PostForm
                postRef={postRef}
                defaultValues={post}
                preview={preview}
              />
            </section>

            <aside
              className="h-3/5 w-1/5
                    bg-gray-800/30 border border-gray-900   
                    my-6 p-8 rounded-lg border-solid 
                    shadow-md z-1
                    backdrop-blur-[100px]
                    text-white
                    ml-[5%]
                    flex justify-center items-center flex-col"
            >
              <h3>Tools</h3>
              <button
                className="text-white w-30 ml-2 mt-5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  inline-flex items-center"
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Edit" : "Preview"}
              </button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className="text-white w-30 ml-2 mt-5 bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center me-2  inline-flex items-center">
                  Live view
                </button>
              </Link>
              <DeletePostButton postRef={postRef} />
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    formState,
  } = useForm({ defaultValues, mode: "onChange" });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="card">
            <ReactMarkdown>{watch("content")}</ReactMarkdown>
          </div>
        )}

        <div className="">
          {/* {preview ? styles.hidden : styles.controls} */}
          {/* <ImageUploader> </ImageUploader> */}
          <textarea
            {...register("content", {
              maxLength: { value: 20000, message: "Content is Too Long" },
              minLength: { value: 10, message: "Content is Too Short" },
              required: { value: true, message: "Content is Required" },
            })}
          ></textarea>
          {errors.content && (
            <p className="text-red-600">{errors.content.message}</p>
          )}
          <fieldset>
            <input
              className=""
              // {styles.checkbox}
              type="checkbox"
              {...register("published")}
            />
            <label>Published</label>
          </fieldset>
          <button
            type="submit"
            className="text-white w-30 mt-5 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center me-2  inline-flex items-center"
            disabled={!isDirty || !isValid}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("Are you Sure?!");
    if (doIt) {
      await deleteDoc(postRef);
      router.push("/admin");
      toast("Post Deleted ", { icon: "🗑️" });
    }
  };

  return (
    <button
      className="text-white w-30 ml-2 mt-5 bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2  inline-flex items-center"
      onClick={deletePost}
    >
      Delete
    </button>
  );
}
