
import { BsFacebook } from "react-icons/bs";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FiInstagram } from "react-icons/fi";
import { bannerImg } from "../../assets/index";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const socialMedia = [
  { Icon: FaGithub, href: "https://github.com/evaano" },
  {
    Icon: FaLinkedin,
    href: "https://www.linkedin.com/in/evan-rashyd-603a20292/",
  },
  { Icon: AiFillTwitterCircle, href: "https://twitter.com/EvanRashyd" },
  { Icon: FiInstagram, href: "https://www.instagram.com/evanwhenmewhen" },
  { Icon: BsFacebook, href: "https://facebook.com/evan.rasheed" },
];

// Hook for Typewriter Effect
const Left = () => {
  const [text] = useTypewriter({
    words: ["Front End Developer", "Backend Developer", "Full Stack Developer"],
    loop: true,
    typeSpeed: 30,
    deleteSpeed: 20,
    delaySpeed: 2000,
  });

  return (
    <div
      className="md:mt-0 mt-5 w-5/12 h-full bg-bodyColor rounded-3xl"
      style={{ opacity: 0.9 }}
    >
      {/* Banner Image */}
      <div className="w-full h-1/3 md:h-3/5 md:m-0 mt-12">
        <img
          className="w-full h-2/3 md:h-full object-cover rounded-2xl"
          src={bannerImg}
          loading="priority"
          alt="Banner"
        />
      </div>

      {/* Personal Information */}
      <div className="w-full h-2/5">
        <div className="flex flex-col items-center gap-4 md:gap-2 py-5 md:py-10">
          <h1 className="text-textColor pl-3 text-xl font-semibold">
            Evan Rasheed
          </h1>
          <span className="pl-3 text-base text-designColor tracking-wide">
            {text}{" "}
            <Cursor cursorBlinking={true} cursorStyle="|" cursorColor="white" />
          </span>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-1 mt-2 pl-3">
            {socialMedia.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="hover:text-designColor duration-300 cursor-pointer text-sm"
              >
                <item.Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Download CV Button */}
        <div className="flex h-14 justify-center">
          <a
            href={
              "https://drive.google.com/file/d/1wXbxwt6TyojadYmgPvXmz0mFU3-QWYTH/view?usp=drive_link"
            }
            target="_blank"
            download
            rel="noreferrer"
          >
            <button className="p-3 text-xs flex justify-center items-center w-full border-b-[1px] borderRight border-t-white md:text-sm tracking-wide uppercase hover:text-designColor duration-300">
              Download CV
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Left;
