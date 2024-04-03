import toast from "react-hot-toast";

const ForTestingOnly = () => {
  function success() {
    toast.success("Well Done!");
  }

  function error() {
    toast.error("Boo!");
  }

  return (
    <div className="text-white mt-40">
      <h1 className="text-5xl">A Page Dedicated to Testing New Features</h1>
      <span>
        If you found this by accident: I don't know how you did that. <br />
        If you found this through the source code: At least someone read it.
      </span>

      <button className="text-3xl block" onClick={success}>
        Success Toast
      </button>
      <button className="text-3xl block" onClick={error}>
        Error Toast
      </button>
    </div>
  );
};

export default ForTestingOnly;
