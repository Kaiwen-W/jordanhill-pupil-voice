import toast from "react-hot-toast";

const ForTestingOnly = () => {
  function success() {
    toast.success("+ve!");
  }

  function error() {
    toast.error("-ve!");
  }

  return (
    <div className="text-white mt-40 flex items-center flex-col">
      <h1 className="text-5xl">A Page Dedicated to Testing New Features</h1>
      <span>If you found this by accident: I don't know how you did that.</span>
      <p>
        If you found this through the source code: At least someone read it.
      </p>

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
