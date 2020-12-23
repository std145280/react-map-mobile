import React from "react";
 
const SpecialMapPopup = props => {
  return (
    <div className="SpecialMapPopup-box">
      <div className="Special-box">
        {props.content}
      </div>
    </div>
  );
};
 
export default SpecialMapPopup;