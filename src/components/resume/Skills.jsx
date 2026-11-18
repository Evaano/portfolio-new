
import ResumeTitle from "./ResumeTitle";
import { SiArtstation } from "react-icons/si";
import { FaFlag } from "react-icons/fa";
import { BiCodeAlt } from "react-icons/bi";
import { IoIosPaper } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";

const SkillCategory = ({ items }) => {
  return (
    <div className="py-4 w-[60%] md:w-full">
      {items.map((item, index) => (
        <div key={index} className="py-3 border-b-[1px] border-zinc-800">
          <p className="text-base text-textColor -mb-1.5">{item.title}</p>
          <span className="w-full bg-zinc-600 h-1 inline-flex relative">
            <span
              style={{ width: `${item.progress}%` }}
              className="h-full absolute top-0 left-0 bg-designColor"
            ></span>
          </span>
        </div>
      ))}
    </div>
  );
};

const Skills = () => {
  const designSkills = [
    { title: "Web Development", progress: 95 },
    { title: "Web Design", progress: 80 },
    { title: "Mobile Application", progress: 85 },
    { title: "Full Stack Development", progress: 80 },
  ];

  const codingSkills = [
    { title: "Typescript", progress: 75 },
    { title: "Python", progress: 100 },
    { title: "React", progress: 80 },
    { title: "Remix", progress: 80 },
    { title: "C", progress: 80 },
  ];

  const knowledgeSkills = [
    "Website design",
    "Web app development",
    "Video and audio editing",
    "iOS and Android app development",
    "Logo design creation",
    "Mobile-ready design concepts",
    "3D modeling and rendering",
  ];

  return (
    <div className="w-[90%] grid grid-cols-9 gap-10 lg:gap-0 px-6">
      {/* Design Skills */}
      <div className="col-span-9 md:col-span-4">
        <ResumeTitle title="Design" icon={<SiArtstation />} />
        <SkillCategory title="Web Development" items={designSkills} />
      </div>

      {/* Divider Line */}
      <div className="w-3 h-full hidden lg:flex justify-center items-center">
        <span className="w-[1px] h-full bg-zinc-800 inline-flex"></span>
      </div>

      {/* Coding Skills */}
      <div className="col-span-9 md:col-span-4">
        <ResumeTitle title="Coding" icon={<BiCodeAlt />} />
        <SkillCategory title="Coding" items={codingSkills} />
      </div>

      {/* Divider Line */}
      <div className="w-full h-full hidden lg:flex justify-center items-center">
        <span className="w-[1px] h-full bg-zinc-800 inline-flex"></span>
      </div>

      {/* Knowledge Skills */}
      <div className="col-span-9 md:col-span-4">
        <ResumeTitle title="Knowledge" icon={<IoIosPaper />} />
        <ul className="py-4 flex flex-col gap-2 border-b-[1px] border-b-zinc-800 w-[70%]">
          {knowledgeSkills.map((item, index) => (
            <li key={index} className="flex items-center gap-4 text-textColor">
              <span className="text-designColor text-lg">
                <GiCheckMark />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Skills;