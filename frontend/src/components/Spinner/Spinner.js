import "../../assets/scss/Spinner.scss";

const Spinner = () => {
  return (
    <div className="text-center">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
