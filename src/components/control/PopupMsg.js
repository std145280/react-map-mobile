import React from "react";
 
const PopupMsg = props => {
  return (
    <div className="PopupMsg-box">
      <div className="box">
        {props.content}
      </div>
    </div>
  );
};
 
export default PopupMsg;