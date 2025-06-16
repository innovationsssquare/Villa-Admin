"use client";
import { CreditCard, DollarSign, MoreHorizontal, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Revenuecard from "@/components/revenuecomponent/Revenuecard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchAllpaidpayout,
  FetchAllpendingpayout,
} from "@/lib/Redux/Slices/revenueSlice";

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const {
    pendingpayout,
    paidpayout,
    pendingpayoutloading,
    paidpayoutloading,
    pendingpayouterror,
    paidpayouterror
  } = useSelector((state) => state.revenue);


  const [activeTab, setActiveTab] = useState("completed");

  useEffect(() => {
    if (activeTab === "completed") {
      dispatch(FetchAllpaidpayout());
    } else if (activeTab === "pending") {
      dispatch(FetchAllpendingpayout());
    }
  }, [activeTab, dispatch]);

  return (
    <ScrollArea className="w-full bg-gray-50 mx-auto pb-14 h-screen">
      <section className="p-4">
        <Revenuecard />
        <div className="bg-white rounded-lg border p-4 mb-2">
          <div className="flex justify-between items-center mb-6">
            <Tabs
              onValueChange={setActiveTab}
              defaultValue="completed"
              className="w-auto"
            >
              <TabsList className="bg-transparent p-0">
                <TabsTrigger
                  value="completed"
                  className="px-0 py-2 mr-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-0 data-[state=active]:border-[#106C83] data-[state=active]:rounded-none data-[state=active]:shadow-none"
                >
                  Completed Transaction
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-0 data-[state=active]:border-[#106C83] data-[state=active]:rounded-none data-[state=active]:shadow-none"
                >
                  Pending Transaction
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex justify-between gap-4 items-center  mb-4 ">
              <Select defaultValue="this-week">
                <SelectTrigger className="w-[180px] border rounded-md">
                  <SelectValue placeholder="This Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#106C83] hover:bg-[#106C83] text-sm">
                Withdraw
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === "completed" ? (
              // Completed Transactions (Paid Payout)
              <>
                {paidpayoutloading ? (
                  // Loading State
                  <div className="flex justify-center items-center py-10">
                    <span className="loader2"></span>
                  </div>
                ) : paidpayouterror ? (
                  // Error State
                  <div className="flex justify-center items-center py-10">
                    <p>{paidpayouterror}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-gray-100 border border-gray-300">
                      <TableRow className="bg-gray-50">
                        <TableHead>CLIENT NAME</TableHead>
                        <TableHead>ORDER ID</TableHead>
                        <TableHead>DATE</TableHead>
                        <TableHead>PAYMENT METHOD</TableHead>
                        <TableHead>AMOUNT</TableHead>
                        <TableHead>COMMISSION</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paidpayout?.map((transaction, index) => (
                        <TableRow
                          key={index}
                          className="border-t border-gray-200 h-14"
                        >
                          <TableCell>{transaction?.vendorId?.Vendorname}</TableCell>
                          <TableCell>{transaction.orderId}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.paymentMethod}</TableCell>
                          <TableCell>{transaction?.totalAmount}</TableCell>
                          <TableCell>{transaction.commission}</TableCell>
                          <TableCell className="text-green-500">
                            Complete
                          </TableCell>
                          <TableCell>
                            <Link
                              href="#"
                              className="text-[#106C83] hover:underline"
                            >
                              View Invoice
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </>
            ) : (
              // Pending Transactions (Pending Payout)
              <>
                {pendingpayoutloading ? (
                  // Loading State
                  <div className="flex justify-center items-center py-10">
                    <span className="loader2"></span>
                  </div>
                ) : pendingpayouterror ? (
                  // Error State
                  <div className="flex justify-center items-center py-10">
                    <p>{pendingpayouterror}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-gray-100 border border-gray-300">
                      <TableRow className="bg-gray-50">
                        <TableHead>CLIENT NAME</TableHead>
                        <TableHead>ORDER ID</TableHead>
                        <TableHead>DATE</TableHead>
                        <TableHead>PAYMENT METHOD</TableHead>
                        <TableHead>AMOUNT</TableHead>
                        <TableHead>COMMISSION</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingpayout?.map((transaction, index) => (
                        <TableRow
                          key={index}
                          className="border-t border-gray-200 h-14"
                        >
                          <TableCell>{transaction.clientName}</TableCell>
                          <TableCell>{transaction.orderId}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.paymentMethod}</TableCell>
                          <TableCell>{transaction?.totalPayoutAmount}</TableCell>
                          <TableCell>{transaction.commission}</TableCell>
                          <TableCell className="text-yellow-500">
                            Pending
                          </TableCell>
                          <TableCell>
                            <Link
                              href="#"
                              className="text-[#106C83] hover:underline"
                            >
                              View Breakdown
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </ScrollArea>
  );
}
