import GlowingBlob from "@/components/GlowingBlob";
import SideBar from "@/components/SideBar";
import PostFeed from "@/components/PostFeed"

export default function Home() {
  return(
    <div className="flex">
      <GlowingBlob style={"stjohn-blob"}/>
      <SideBar house={"st-sidebar sidebar-icon group"}/>
      <PostFeed />
    </div>
  )
}