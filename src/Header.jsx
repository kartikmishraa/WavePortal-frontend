import React from "react";
import "./Header.css";

const Header = () => {
  return(
    <div className="header">
      <div className="title">
        👋 Hey there!
      </div>

      <div className="bio">
        Kartik here, I have created this frontend to connect to my Smart Contract            deployed on the Rinkeby Testnet (Ethereum). 
        <br /> <strong>Go ahead and say hi! </strong>
      </div>
    </div>
  );
};

export default Header;
