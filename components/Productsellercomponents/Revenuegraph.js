"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDispatch, useSelector } from "react-redux";
import { fetchrevenueandcommision } from "@/lib/Redux/Slices/sellarSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Revenueskeleton from "@/components/Analyticscomponents/revenue-overview-skeleton";

export default function Revenuegraph({revenueoverview,loadingrevnue,errorrevenue}) {
 
  return (
    <>
      {loadingrevnue ? (
        <Revenueskeleton />
      ) : errorrevenue ? (
        <div className="flex items-center justify-center py-10 text-red-500">
          {errorrevenue}
        </div>
      ) : !revenueoverview ? (
        <div className="text-center py-8 text-gray-500">No data available</div>
      ) : (
        <div className="w-full rounded-lg border bg-white p-6 col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Revenue Overview
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-[#23BB4C]"></div>
                <span className="text-gray-800 text-sm ">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-[#FFB300]"></div>
                <span className="text-gray-800 text-sm">Commission</span>
              </div>
              
            </div>
          </div>

          <div className="relative h-60">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 transform text-sm font-medium text-[#106C83]">
              Sales
            </div>

            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "#23BB4C",
                },
                commission: {
                  label: "Commission",
                  color: "#FFB300",
                },
              }}
              className="h-60 w-full"
            >
              <AreaChart
                data={revenueoverview}
                margin={{ top: 10, right: 10, left: 5, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23BB4C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#23BB4C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorCommission"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FFB300" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FFB300" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                  tickFormatter={(value) => `${value}`}
                  dx={-10}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent formatValue={(value) => `${value}`} />
                  }
                  cursor={false}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#23BB4C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  dot={{
                    r: 3.5,
                    strokeWidth: 2,
                    fill: "white",
                    stroke: "#23BB4C",
                  }}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "white",
                    stroke: "#23BB4C",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="commission"
                  stroke="#FFB300"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCommission)"
                  dot={{
                    r: 3.5,
                    strokeWidth: 2,
                    fill: "white",
                    stroke: "#FFB300",
                  }}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "white",
                    stroke: "#FFB300",
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
          <div className="mt-2 text-center text-gray-600 font-medium">Days</div>
        </div>
      )}
    </>
  );
}
