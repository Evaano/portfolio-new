import { FaCloud, FaLaptopCode, FaMobileAlt, FaPaintBrush } from "react-icons/fa";
import ServicesCard from "./ServicesCard";

const MyServices = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <ServicesCard
        icons={<FaLaptopCode />}
        title="Web Development"
        subTitle="Crafting powerful online solutions that make your brand shine."
      />
      <ServicesCard
        icons={<FaPaintBrush />}
        title="Web Design"
        subTitle="Designing captivating web experiences to leave a lasting impression."
      />
      <ServicesCard
        icons={<FaMobileAlt />}
        title="Mobile Application"
        subTitle="Turning your ideas into dynamic mobile apps for real-world impact."
      />
      <ServicesCard
        icons={<FaCloud />}
        title="API Development"
        subTitle="Building robust and scalable APIs for seamless data exchange."
      />
    </div>
  );
};

export default MyServices;