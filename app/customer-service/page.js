import Customerservicecard from "@/components/Customerservicecomponent/Customerservicecard";
import ProjectTable from "@/components/Customerservicecomponent/project-table";
import React from "react";

const page = () => {
  return (
    <div className="p-4 bg-gray-50">
     <Customerservicecard/>
     <ProjectTable/>
    </div>
  );
};

export default page;
