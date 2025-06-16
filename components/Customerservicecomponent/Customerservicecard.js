import React from "react";
import Image from "next/image"
import completed from "@/public/Asset/completed.png"
import process from "@/public/Asset/process.png"
import pending from "@/public/Asset/pending.png"
const Customerservicecard = () => {
  return (
    <div className=" overflow-auto ">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center ">
            <Image
              src={completed}
              alt="Completed Services"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Completed Services</p>
            <p className="text-2xl font-bold text-[#106C83]">7,782</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center ">
            <Image
              src={pending}
              alt="pending"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
            Pending Services
            </p>
            <p className="text-2xl font-bold text-[#106C83]">7,867</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center ">
            <Image
              src={process}
              alt="Pending Payout"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
            Ongoing Services
            </p>
            <p className="text-2xl font-bold text-[#106C83]">146</p>
          </div>
        </div>

      
      </div>

      
    </div>
  );
};

export default Customerservicecard;
