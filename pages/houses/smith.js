import GlowingBlob from "@/components/GlowingBlob";
import SideBar from "@/components/SideBar";
import PostFeed from "@/components/PostFeed"

export default function Home() {
  return(
    <div className="flex">
      <GlowingBlob style={"smith-blob"}/>
      <SideBar house={"sm-sidebar sidebar-icon group"}/>
      <PostFeed />
    </div>
  )
}