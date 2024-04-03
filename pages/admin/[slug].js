import { auth } from "@/lib/firebase";
import {
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import AuthCheck from "@/components/AuthCheck";
import GlowingBlob from "@/components/GlowingBlob";
import ImageUploader from "@/components/ImageUploader";

export default function AdminPostEdit() {
  const houseStyles = [
    "crawfurd-blob",
    "montgomerie-blob",
    "smith-blob",
    "stjohn-blob",
  ];
  const blobStyle = houseStyles[Math.floor(houseStyles.length * Math.random())];

  return (
    <AuthCheck>
      <GlowingBlob houseStyle={blobStyle} />
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

  function changePreview() {
    const id = document.getElementById("controls");
    preview ? (id.style.display = "inline") : (id.style.display = "none");
    setPreview(!preview);
  }

  return (
    <main>
      {post && (
        <div>
          <button
            onClick={() => router.back()}
            className="text-white pt-6 pl-6"
          >
            ← Go back
          </button>
          <div className="flex flex-row">
            <section
              className="w-3/5
                      bg-gray-800/30 border border-gray-900   
                      my-6 py-6 px-8 rounded-lg border-solid 
                      shadow-md z-1
                      backdrop-blur-[100px]
                      text-white
                      ml-[5%]"
            >
              <h1 className="font-bold text-3xl mb-3 ">{post.title}</h1>
              <p className="text-gray-100 text-xl mb-3">ID: {post.slug}</p>

              <PostForm
                postRef={postRef}
                defaultValues={post}
                preview={preview}
              />
            </section>

            <aside
              className="h-3/5 w-1/5
                    bg-gray-800/30 border border-gray-900   
                    my-6 py-6 px-8 rounded-lg border-solid 
                    shadow-md z-1
                    backdrop-blur-[100px]
                    text-white
                    ml-[5%]
                    flex justify-center items-center flex-col"
            >
              <h3 className="text-xl">Tools</h3>
              <button
                className="text-white w-30 ml-2 mt-5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  inline-flex items-center"
                onClick={changePreview}
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

  const updatePost = async ({ content, published, category }) => {
    await updateDoc(postRef, {
      content,
      published,
      category,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="mt-3">
            <ReactMarkdown className="break-words">
              {watch("content")}
            </ReactMarkdown>
          </div>
        )}

        <div id="controls">
          <ImageUploader> </ImageUploader>

          <p className="text-white text-base mt-3 mb-1">
            Choose Category for Post:
          </p>
          <select
            className="bg-gray-800/30 block h-10 w-1/3 rounded-md border-0 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
            name="category"
            {...register("category")}
          >
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="academia">Academia</option>
            <option value="art">Art</option>
            <option value="other">Other</option>
          </select>

          <p className="text-white text-base mt-3 mb-1">Write content here:</p>
          <textarea
            className="bg-gray-800/30 block h-60 w-full mb-3 rounded-md border-0 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
            {...register("content", {
              maxLength: { value: 20000, message: "Content is Too Long" },
              minLength: { value: 10, message: "Content is Too Short" },
              required: { value: true, message: "Content is Required" },
            })}
          ></textarea>
          {errors.content && (
            <p className="text-red-600">{errors.content.message}</p>
          )}
          <fieldset className="text-lg">
            <input type="checkbox" {...register("published")} />
            <label> Published</label>
          </fieldset>
          <button
            type="submit"
            className="text-white w-30 mt-5 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center me-2  inline-flex items-center disabled:cursor-not-allowed disabled:brightness-90"
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
      toast.error("Post Deleted!");
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
