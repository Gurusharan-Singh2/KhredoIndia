import Link from "next/link";
import React from "react";

import Top_Header from "./header/Top_Header";
import Bottom_Header from "./header/Bottom_Header";

const Header = () => {
  return (
    <header className="w-full bg-white flex flex-col   top-0 z-50">
     <Top_Header/>
     <div className="w-full flex border-b -mt-10 mb-1  border-slate-300"/>

{/*Bottom Header*/}
<Bottom_Header/>   

    </header>
  );
};

export default Header;
