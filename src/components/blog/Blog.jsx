import { workImgOne, workImgThree, workImgSix, workImgTwo } from "../../assets";

import Title from "../home/Title";
import BlogCard from "./BlogCard";

const Blog = () => {
  return (
    <div>
      <Title title="Recent" subTitle="Projects" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lgl:gap-10">
        <div className="px-6">
          <BlogCard
            title="3D Website"
            category="Three JS, React JS"
            image={workImgThree}
            link="https://play.google.com/store/apps/details?id=com.hulhumale.uberlite"
          />
          <BlogCard
            title="Platformer"
            category="Pixi JS"
            image={workImgOne}
            link="https://play.google.com/store/apps/details?id=com.hulhumale.uberlite"
          />
          <BlogCard
            title="Inventory App (Hulhumale Hospital)"
            category="Remix Run, Mantine"
            image={workImgTwo}
            link="https://play.google.com/store/apps/details?id=com.hulhumale.uberlite"
          />
        </div>
        <div className="px-6">
          <BlogCard
            title="Uber lite"
            category="React Native"
            image={workImgSix}
            link="https://play.google.com/store/apps/details?id=com.hulhumale.uberlite"
          />
        </div>
      </div>
    </div>
  );
};

export default Blog;
