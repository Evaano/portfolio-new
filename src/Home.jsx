import { useState } from "react";
import Left from "./components/home/Left";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import { SiGooglechat } from "react-icons/si";
import { motion } from "framer-motion";
import About from "./components/About/About";
import Resume from "./components/resume/Resume";
import Contact from "./components/contact/Contact";
import Blog from "./components/blog/Blog";

const Home = () => {
  // State to track the active section
  const [activeSection, setActiveSection] = useState("about");

  // Function to handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Function to render a section with animation
  const renderSection = (sectionComponent) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {sectionComponent}
    </motion.div>
  );

  return (
    <div className="max-w-[90%] min-w-[80%] h-[80%] bg-transparent text-white z-50 flex flex-col md:flex-row items-start">
      {/* Navigation Sidebar */}
      <div className="bg-transparent w-full md:w-20 h-20 md:h-96 flex flex-row md:flex-col gap-4 p-7 overflow-hidden m-auto">
        {/* Navigation Icons */}
        {[
          { icon: <FaUser />, label: "About", section: "about" },
          { icon: <IoIosPaper />, label: "Resume", section: "resume" },
          { icon: <SiGooglechat />, label: "Project", section: "blog" },
          { icon: <FaEnvelope />, label: "Contact", section: "contact" },
        ].map(({ icon, label, section }) => (
          <span
            key={section}
            onClick={() => handleSectionChange(section)}
            className={`${
              activeSection === section
                ? "text-designColor"
                : "w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
            } w-full h-6 text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group`}
          >
            {icon}
            {/* Label for the navigation icon */}
            <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 -translate-x-7 group-hover:-translate-x-15 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
              {label}
            </span>
          </span>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-transparent w-[90%] h-full flex items-center justify-center m-auto md:w-full">
        <Left />
        <div
          className="w-[80%] md:w-8/12 h-[95%] bg-bodyColor"
          style={{ opacity: 0.9 }}
        >
          {/* Scrollable Content Area */}
          <div className="w-full h-full bg-bodyColor overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-[#27272a]">
            {/* Render the selected section */}
            {activeSection === "about" && renderSection(<About />)}
            {activeSection === "resume" && renderSection(<Resume />)}
            {activeSection === "blog" && renderSection(<Blog />)}
            {activeSection === "contact" && renderSection(<Contact />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
