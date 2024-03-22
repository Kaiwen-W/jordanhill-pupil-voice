import GlowingBlob from "@/components/GlowingBlob";
import Link from "next/link";

export default function Custom404() {
  const houseStyles = [
    "crawfurd-blob",
    "montgomerie-blob",
    "smith-blob",
    "stjohn-blob",
  ];
  const houseStyle =
    houseStyles[Math.floor(houseStyles.length * Math.random())];

  return (
    <>
      <GlowingBlob style={houseStyle} />
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-white text-4xl p-8">
          UH OH! - That page does not exist...
        </h1>
        <img src="/404.png" className="w-[45%] rounded-2xl" />
        <Link href="/">
          <button className="mt-8 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 inline-flex items-center">
            Go home
          </button>
        </Link>
      </div>
    </>
  );
}
