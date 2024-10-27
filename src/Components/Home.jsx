import React from "react";
import HomeNav from "./Nav/homeNav";
import HomeSidebar from "./Sidebar/homeSidebar";
import HomeProducts from "./Product/homeProducts";

function Home() {
  return (
    <>
      <HomeNav />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2">
            <HomeSidebar />
          </div>

          {/* Products Section */}
          <div className="col-md-9 col-lg-10">
            <div className="row">
              <HomeProducts />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
