
const AboutMe = () => {
  return (
    <div className="flex flex-col md:flex-row pb-6">
      {/* Left Section */}
      <div className="w-full text-zinc-400 px-6 border-r-[1px] border-r-zinc-800 flex items-center">
        <div className="py-6">
          <h2 className="font-semibold mb-1">Hello! I'm <span className="text-designColor">Evan</span></h2>
          <p className="text-base leading-6">
            I'm a Computer Science student specializing in web development, with
            a focus on JavaScript frameworks, particularly React. I enjoy
            solving complex problems and creating efficient, scalable solutions.
            I'm committed to delivering high-quality work tailored to each
            client's unique needs. Always open to new opportunities and
            challenges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
