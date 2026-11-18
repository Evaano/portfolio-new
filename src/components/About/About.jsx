import Title from "../home/Title";
import AboutMe from "./AboutMe";
import MyServices from "./MyServices";

const About = () => {
  return (
    <div className="w-full">
      <Title title="about" subTitle="me" />
      <AboutMe />
      <Title title="my" subTitle="Services" />
      <MyServices />
    </div>
  );
};

export default About;
