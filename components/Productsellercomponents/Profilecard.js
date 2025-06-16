"use client";
import { fetchSellaranalytics } from "@/lib/Redux/Slices/sellarSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "../ui/skeleton";

const Profilecard = ({ id }) => {
  const { analytics, loadinganalytics, analyticserror } = useSelector(
    (state) => state.sellar
  );
  const data = analytics?.[id];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSellaranalytics(id));
  }, [dispatch, id]);

  return (
    <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 mb-0">
      <div className="text-center flex flex-col justify-center items-center gap-2">
        <p className="text-gray-500 text-xs">Total Products</p>
        {loadinganalytics ? (
          <>
            <Skeleton className="w-12 h-4 bg-gray-200 rounded-md" />
          </>
        ) : (
          <>
            <p className="font-semibold text-sm">
              {" "}
              {data?.summary?.totalProducts}
            </p>
          </>
        )}
      </div>

      <div className="text-center flex flex-col justify-center items-center gap-2">
        <p className="text-gray-500 text-xs">Revenue</p>
        {loadinganalytics ? (
          <>
            <Skeleton className="w-12 h-4 bg-gray-200 rounded-md" />
          </>
        ) : (
          <>
            <p className="font-semibold text-sm">
              {" "}
              ₹ {data?.summary?.totalRevenue?.toFixed(2)}
            </p>
          </>
        )}
      </div>

      <div className="text-center flex flex-col justify-center items-center gap-2">
        <p className="text-gray-500 text-xs">Commission</p>
        {loadinganalytics ? (
          <>
            <Skeleton className="w-12 h-4 bg-gray-200 rounded-md" />
          </>
        ) : (
          <>
            <p className="font-semibold text-sm">
              {" "}
              ₹ {data?.summary?.totalCommission?.toFixed(2)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profilecard;
