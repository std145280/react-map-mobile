import React from "react";
 
const PopupMap = props => {
  return (
    <div className="PopupMsg-box">
      <div className="mapBox">
        {props.content}
      </div>
    </div>
  );
};
 
export default PopupMap;