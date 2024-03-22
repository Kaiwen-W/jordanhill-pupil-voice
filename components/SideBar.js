"use client";

import { MdSportsRugby } from "react-icons/md";
import { CiMusicNote1 } from "react-icons/ci";
import { IoMdSchool } from "react-icons/io";
import { IoIosCreate } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaPaintBrush } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { PiSignInFill } from "react-icons/pi";

import { useContext } from "react";
import { UserContext } from "@/lib/context";

const SideBar = ({ house }) => {
  const { user, username } = useContext(UserContext);

  return (
    <>
      {!username ? (
        <div
          className="fixed top-0 left-0 h-screen w-16 m-0 
          flex flex-col bg-gray-900 text-white shadow z-0 items-center"
        >
          <SideBarIcon
            icon={<FaHome size="28" />}
            text="Home"
            link="../"
            house={house}
          />

          <LineBreak />

          <SideBarIcon
            icon={<MdSportsRugby size="28" />}
            text="Sports"
            house={house}
          />
          <SideBarIcon
            icon={<CiMusicNote1 size="28" />}
            text="Music"
            house={house}
          />
          <SideBarIcon
            icon={<IoMdSchool size="28" />}
            text="Academia"
            house={house}
          />
          <SideBarIcon
            icon={<FaPaintBrush size="28" />}
            text="Art"
            house={house}
          />

          <LineBreak />

          <SideBarIcon
            icon={<PiSignInFill size="28" />}
            text="Sign In"
            house={house}
            link="/enter"
          />
        </div>
      ) : (
        <div
          className="fixed top-0 left-0 h-screen w-16 m-0 
            flex flex-col bg-gray-900 text-white shadow z-0 items-center"
        >
          <SideBarIcon
            icon={<FaHome size="28" />}
            text="Home"
            link="../"
            house={house}
          />

          <LineBreak />

          <SideBarIcon
            icon={<MdSportsRugby size="28" />}
            text="Sports"
            house={house}
          />
          <SideBarIcon
            icon={<CiMusicNote1 size="28" />}
            text="Music"
            house={house}
          />
          <SideBarIcon
            icon={<IoMdSchool size="28" />}
            text="Academia"
            house={house}
          />
          <SideBarIcon
            icon={<FaPaintBrush size="28" />}
            text="Art"
            house={house}
          />

          <LineBreak />

          <SideBarIcon
            icon={<IoIosCreate size="28" />}
            text="Create"
            house={house}
          />

          <SideBarIcon
            icon={<MdAccountCircle size="28" />}
            text="Account"
            house={house}
            link={`/${username}`}
          />
        </div>
      )}
      ;
    </>
  );
};

const SideBarIcon = ({ icon, text, link, house }) => (
  <a href={link}>
    <div className={house}>
      {icon}

      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  </a>
);

const LineBreak = () => {
  return (
    <div className="bg-stone-300 h-[0.1px] w-12 opacity-30 mt-3 mb-3"></div>
  );
};

export default SideBar;
