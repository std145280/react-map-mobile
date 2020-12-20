import React from "react";
 
const PopupForCards = props => {
  return (
    <div className="PopupMsg-box">
      <div className="popupForCards-box">
        {props.content}
      </div>
    </div>
  );
};
 
export default PopupForCards;