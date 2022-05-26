const Loader = () => {
  let circleCommonClasses = "h-2.5 w-2.5 bg-white rounded-full";

  return (
    <div className="flex justify-around">
      <div className={`${circleCommonClasses} mr-1 mt-20 animate-bounce`}></div>
      <div
        className={`${circleCommonClasses} mr-1 mt-20 animate-bounce200`}
      ></div>
      <div className={`${circleCommonClasses} mt-20 animate-bounce400`}></div>
    </div>
  );
};

export default Loader;
