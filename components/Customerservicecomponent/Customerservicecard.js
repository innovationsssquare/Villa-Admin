import React from "react";
import Image from "next/image";
import completed from "@/public/Asset/completed.png";
import process from "@/public/Asset/process.png";
import pending from "@/public/Asset/pending.png";

const Customerservicecard = () => {
  return (
    <div className="overflow-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            <Image
              src={completed}
              alt="Completed Services"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Completed Services</p>
            <p className="text-2xl font-bold text-[#FF6900]">7,782</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            <Image
              src={pending}
              alt="pending"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
              Pending Services
            </p>
            <p className="text-2xl font-bold text-[#FF6900]">7,867</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            <Image
              src={process}
              alt="Ongoing Services"
              className="object-contain w-10 h-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
              Ongoing Services
            </p>
            <p className="text-2xl font-bold text-[#FF6900]">146</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customerservicecard;
