import React from "react";

const Title = ({ title, subTitle }) => {
  return (
    <div>
      <h1 className="font-titleFont font-bold text-xl capitalize text-textColor relative z-10 px-8 py-5 group">
        <span className="text-designColor">{title}</span> {subTitle}
      </h1>
    </div>
  );
};

export default Title;
