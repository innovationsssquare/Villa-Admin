"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Mail, Phone, Store, ChevronRight, Search, X } from "lucide-react";
import dashiconsstore from "@/public/Asset/dashiconsstore.png";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSellars } from "@/lib/Redux/Slices/sellarSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchAllorders } from "@/lib/Redux/Slices/orderSlice";
import { useRouter } from "next/navigation";

export default function Ordersmanagement() {
  const [profileTab, setProfileTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const { data, loading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchAllorders({
        page: 1,
        limit: 100,
        status: profileTab === "all" ? "" : profileTab,
      })
    );
  }, [dispatch, profileTab]);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!searchQuery || searchQuery.trim() === "") return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter((order) => {
      const orderId = (order?.orderId || order?._id || "").toLowerCase();
      const customerName = (
        order?.userId?.name ||
        order?.customerName ||
        order?.billingAddress?.name ||
        ""
      ).toLowerCase();
      const email = (
        order?.userId?.email ||
        order?.email ||
        order?.billingAddress?.email ||
        ""
      ).toLowerCase();
      const phone = (
        order?.userId?.phone ||
        order?.phone ||
        order?.billingAddress?.phone ||
        ""
      ).toLowerCase();

      return (
        orderId.includes(q) ||
        customerName.includes(q) ||
        email.includes(q) ||
        phone.includes(q)
      );
    });
  }, [data, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 h-full bg-white dark:bg-[#121215] text-neutral-900 dark:text-neutral-100 p-4 shadow-sm transition-colors">
      {/* Main Tabs */}
      <Tabs defaultValue="all" className="">
        <TabsList className="p-0 bg-transparent space-x-2 h-auto">
          <TabsTrigger
            value="all"
            className="rounded-md px-6 py-2 text-base font-medium cursor-pointer data-[state=active]:bg-[#FF6900] data-[state=active]:text-white data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-neutral-900 data-[state=inactive]:border data-[state=inactive]:border-gray-200 dark:data-[state=inactive]:border-neutral-800 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-neutral-300 data-[state=inactive]:hover:bg-gray-50 dark:data-[state=inactive]:hover:bg-neutral-800"
          >
            All Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {/* Profile Tabs and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="border-b border-gray-200 dark:border-neutral-800 w-full">
              <div className="flex -mb-px flex-wrap">
                <button
                  onClick={() => {
                    setProfileTab("all");
                    setCurrentPage(1);
                  }}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer transition-colors ${
                    profileTab === "all"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => {
                    setProfileTab("Delivered");
                    setCurrentPage(1);
                  }}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer transition-colors ${
                    profileTab === "Delivered"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                 Delivered
                </button>
                <button
                  onClick={() => {
                    setProfileTab("Pending");
                    setCurrentPage(1);
                  }}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer transition-colors ${
                    profileTab === "Pending"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  Pending Orders
                </button>
                <button
                  onClick={() => {
                    setProfileTab("Processing");
                    setCurrentPage(1);
                  }}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer transition-colors ${
                    profileTab === "Processing"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  Processing Orders
                </button>
                <button
                  onClick={() => {
                    setProfileTab("Cancelled");
                    setCurrentPage(1);
                  }}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer transition-colors ${
                    profileTab === "Cancelled"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  Canceled Orders
                </button>
              </div>
            </div>

            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by order ID, customer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-8 h-9 text-xs bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className=" rounded-md">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <span className="loader2 " />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-10 text-red-500">
                {error}
              </div>
            ) : currentItems?.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-neutral-400">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p>No orders matching &quot;{searchQuery}&quot;</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#FF6900] hover:underline font-medium cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  "No orders available"
                )}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-neutral-900/60 border border-gray-300 dark:border-neutral-800 rounded-md">
                  <TableRow className="">
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      Order id.
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      customer name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      EMAIL ID
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      location
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      Items
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      payment type
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      amount
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      status
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 dark:border-neutral-800/60 hover:bg-gray-50 dark:hover:bg-neutral-800/40 h-12"
                    >
                      <TableCell className="font-medium">
                        ID: {application?.orderId.slice(-8)}
                      </TableCell>
                      <TableCell>
                        {application?.userDetails?.Username}
                      </TableCell>
                      <TableCell>{application?.userDetails?.Email}</TableCell>
                      <TableCell>
                        {application?.shippingDetails?.City}
                      </TableCell>
                      <TableCell>{application?.products?.length}</TableCell>
                      <TableCell>{application?.payment?.paymentMode}</TableCell>
                      <TableCell>{application?.payment?.amount}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            application?.subOrderStatus === "Pending"
                              ? "text-amber-500"
                              : application?.subOrderStatus === "Delivered"
                              ? "text-green-500"
                              : application?.subOrderStatus === "Processing"
                              ? "text-yellow-500"
                              : application?.subOrderStatus === "Cancelled"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application?.subOrderStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                         onClick={()=>router.push(`/orders/Vieworder/${application?.orderId}`)}
                          className="text-[#FF6900] hover:underline font-medium cursor-pointer"
                        >
                          View Details
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && !error && currentItems?.length > 0 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
        <TabsContent value="active">
          {/* Profile Tabs and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="border-b border-gray-200 w-full">
              <div className="flex -mb-px">
                <button
                  onClick={() => setProfileTab("all")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "all"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Product Orders
                </button>
                <button
                  onClick={() => setProfileTab("pending")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "pending"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pending Orders
                </button>
                <button
                  onClick={() => setProfileTab("rejected")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "rejected"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Completed Orders
                </button>
                <button
                  onClick={() => setProfileTab("blacklisted")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "blacklisted"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Canceled Orders
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Select defaultValue="this-week">
                <SelectTrigger className="w-[130px] border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="This Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="border-gray-200">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className=" rounded-md">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <span className="loader2 " />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-10 text-red-500">
                {error}
              </div>
            ) : data?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No seller applications available
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 border border-gray-300 rounded-md">
                  <TableRow className="">
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Order id.
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      date
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      customer name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      EMAIL ID
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      location
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Items
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      amount
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      status
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 h-12"
                    >
                      <TableCell className="font-medium">
                        {application?.BussinessName}
                      </TableCell>
                      <TableCell>
                        {application?.CompanyId?.Address?.City}
                      </TableCell>
                      <TableCell>{application?.Vendorname}</TableCell>
                      <TableCell>{application.Email}</TableCell>
                      <TableCell>{application?.Number}</TableCell>
                      <TableCell>{application.registrationDate}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            application.isCompanyVerified === "Pending"
                              ? "text-amber-500"
                              : application.isCompanyVerified === "Approved"
                              ? "text-green-500"
                              : application.isCompanyVerified === "Rejected"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application.isCompanyVerified}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          href="#"
                          className="text-[#FF6900] hover:underline font-medium"
                        >
                          View Details
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          href="#"
                          className="text-[#FF6900] hover:underline font-medium"
                        >
                          View Details
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && !error && data?.length > 0 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
        <TabsContent value="Services">
          {/* Profile Tabs and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="border-b border-gray-200 w-full">
              <div className="flex -mb-px">
                <button
                  onClick={() => setProfileTab("all")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "all"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Product Orders
                </button>
                <button
                  onClick={() => setProfileTab("pending")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "pending"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pending Orders
                </button>
                <button
                  onClick={() => setProfileTab("rejected")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "rejected"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Completed Orders
                </button>
                <button
                  onClick={() => setProfileTab("blacklisted")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "blacklisted"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Canceled Orders
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Select defaultValue="this-week">
                <SelectTrigger className="w-[130px] border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="This Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="border-gray-200">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className=" rounded-md">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <span className="loader2 " />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-10 text-red-500">
                {error}
              </div>
            ) : data?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No seller applications available
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 border border-gray-300 rounded-md">
                  <TableRow className="">
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Order id.
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      date
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      customer name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      EMAIL ID
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      location
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Items
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      amount
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      status
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 h-12"
                    >
                      <TableCell className="font-medium">
                        {application?.BussinessName}
                      </TableCell>
                      <TableCell>
                        {application?.CompanyId?.Address?.City}
                      </TableCell>
                      <TableCell>{application?.Vendorname}</TableCell>
                      <TableCell>{application.Email}</TableCell>
                      <TableCell>{application?.Number}</TableCell>
                      <TableCell>{application.registrationDate}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            application.isCompanyVerified === "Pending"
                              ? "text-amber-500"
                              : application.isCompanyVerified === "Approved"
                              ? "text-green-500"
                              : application.isCompanyVerified === "Rejected"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application.isCompanyVerified}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          href="#"
                          className="text-[#FF6900] hover:underline font-medium"
                        >
                          View Details
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          href="#"
                          className="text-[#FF6900] hover:underline font-medium"
                        >
                          View Details
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && !error && data?.length > 0 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
