import { Wallet, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RevenueCommission({
  revenue = 6848,
  orders = 2846,
  todayRevenue = 12,
  commission = 1876,
  commissionPercentage = 10,
  todayCommission = 112,
}) {
  return (
    <Card className="border border-gray-200 ">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Revenue & Commission</h2>
          <Select defaultValue="this-week">
            <SelectTrigger className="w-[130px] border-gray-200 bg-white">
              <SelectValue placeholder="This Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Revenue Section */}
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mr-6">
            <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center">
              <Wallet className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Revenue</p>
            <h3 className="text-xl font-bold mb-1">
              ${revenue.toLocaleString()}
            </h3>
            <div className="flex items-center">
              <span className="text-gray-600">
                {orders.toLocaleString()} Orders
              </span>
              <span className="text-emerald-500 ml-3 text-xs">
                +{todayRevenue} Today
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Commission Section */}
        <div className="flex items-center">
          <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mr-6">
            <div className="w-8 h-8 bg-amber-100 rounded-md flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Commission</p>
            <h3 className="text-xl font-bold mb-1">
              ${commission.toLocaleString()}
            </h3>
            <div className="flex items-center">
              <span className="text-gray-600 text-xs">
                {commissionPercentage}% of the total revenue
              </span>
              <span className="text-emerald-500 ml-3 text-xs">
                +${todayCommission} Today
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
