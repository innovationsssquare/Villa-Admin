import React from "react";
import Image from "next/image"
import Dash1 from "@/public/Asset/Dash1.png"
import Dash2 from "@/public/Asset/Dash2.png"
import Dash3 from "@/public/Asset/Dash3.png"
import Dash4 from "@/public/Asset/Dash4.png"
const Statcard = () => {
  return (
    <div className=" overflow-auto ">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center ">
            <Image
              src={Dash1}
              alt="Product Sellers"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Product Sellers</p>
            <p className="text-2xl font-bold text-[#106C83]">2,452</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center ">
            <Image
              src={Dash2}
              alt="Product Sellers"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Service Providers
            </p>
            <p className="text-2xl font-bold text-[#106C83]">7,867</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center ">
            <Image
              src={Dash3}
              alt="Product Sellers"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Pending Approvals
            </p>
            <p className="text-2xl font-bold text-[#106C83]">146</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center ">
            <Image
              src={Dash4}
              alt="Product Sellers"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Rejected Profiles
            </p>
            <p className="text-2xl font-bold text-[#106C83]">55</p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Statcard;
