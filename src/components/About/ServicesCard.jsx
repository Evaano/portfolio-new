// This component is used to display the services offered by a company.
// It takes in an icon, title, and subtitle to display.
// The icon is a font-awesome icon, while the title and subtitle
// are strings.
const ServicesCard = ({ icons, title, subTitle }) => {
  return (
    <div className="py-8 px-6 flex flex-col items-center gap-2 borderRight borderBottom">
      <span className="text-4xl text-designColor mb-2">{icons}</span>
      <h2 className="font-titleFont text-lg font-semibold">{title}</h2>
      <p className="text-base text-center text-zinc-400 px-6">{subTitle}</p>
    </div>
  );
};

export default ServicesCard;
