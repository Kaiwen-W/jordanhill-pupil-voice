import { MdSportsRugby } from "react-icons/md"; 
import { CiMusicNote1 } from "react-icons/ci";
import { IoMdSchool } from "react-icons/io";
import { IoIosCreate } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";

const SideBar = () => {
  return (
    <div className='fixed top-0 left-0 h-screen w-16 m-0 
    flex flex-col bg-gray-900 text-white shadow z-0'>
        <SideBarIcon icon={ <MdSportsRugby size="28" /> } text="Sports" />
        <SideBarIcon icon={ <CiMusicNote1 size="28"/> } text="Music" /> 
        <SideBarIcon icon={ <IoMdSchool size="28"/> } text="Academia" /> 
        <SideBarIcon icon={ <IoIosCreate size="28"/> } text="Create" /> 
        <SideBarIcon icon={ <MdAccountCircle size="28"/> } text="Account" /> 
    </div>
  )
}

const SideBarIcon = ({ icon, text }) => (
    <div className="sidebar-icon group"> 
      {icon}

      <span className="sidebar-tooltip group-hover:scale-100"> 
        {text}
      </span>
    </div>
);

export default SideBar