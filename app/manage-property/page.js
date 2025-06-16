import Statcard from "@/components/Analyticscomponents/Statcard";
import SellersManagement from "@/components/Productsellercomponents/sellers-management";
import React from "react";

const page = () => {
  return (
    <div className="p-4 bg-gray-50">
      <Statcard/>

      <SellersManagement />
    </div>
  );
};

export default page;
