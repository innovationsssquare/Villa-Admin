"use client";
import { useEffect, useState } from "react";
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
import { Button } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Mail, Phone, Store, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProperties } from "@/lib/Redux/Slices/sellarSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { fetchAllCategories } from "@/lib/Redux/Slices/masterSlice";

export default function SellersManagement() {
  const [selectedValue, setSelectedValue] = useState("");
  const [sortValue, setSortValue] = useState("sort-by");
  const [isapproved, setisapproved] = useState("");
  const [Tab, setTab] = useState("applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const { data, loading, error ,datapagination} = useSelector((state) => state.sellar);
  const [filteredData, setFilteredData] = useState([]);
  const { analytics, loadinganalytics, analyticserror } = useSelector(
    (state) => state.sellar
  );
  const { categories } = useSelector((state) => state.master);

  
  const dispatch = useDispatch();
  useEffect(() => {
  if (selectedValue) {
      dispatch(
        fetchAllProperties({
          id: selectedValue,
          isapproved,
          page: currentPage,
          limit: itemsPerPage,
        })
      );
    }
  }, [dispatch, selectedValue, isapproved,itemsPerPage,currentPage]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

useEffect(() => {
  if (categories?.length > 0) {
    setSelectedValue(categories[0]?._id); 
  }
}, [categories]);

  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };



  const handletabchange = (value) => {
    setTab(value);
  };



 const handlePageChange = (newPage) => {
    const pagination = getCurrentPagination();
    if (
      pagination &&
      newPage >= 1 &&
      newPage <= pagination.totalPages &&
      newPage !== currentPage
    ) {
      setCurrentPage(newPage);
    }
  };

  // Get current pagination data based on active tab
  const getCurrentPagination = () => {
    return datapagination
  };

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pagination = getCurrentPagination();
    if (!pagination) return [];

    const { page: currentPageFromAPI, totalPages } = pagination;
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Add pages around current page
    for (
      let i = Math.max(2, currentPageFromAPI - delta);
      i <= Math.min(totalPages - 1, currentPageFromAPI + delta);
      i++
    ) {
      range.push(i);
    }

    // Always show last page if there are multiple pages
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add ellipsis where needed
    let prev = 0;
    for (const page of uniqueRange) {
      if (page - prev > 1) {
        rangeWithDots.push("ellipsis");
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [isapproved]);


  const renderPaginationAlways = () => {
    const pagination = getCurrentPagination();

    if (!pagination) {
      return null;
    }

    const { page: currentPageFromAPI, totalPages, total } = pagination;
    const visiblePages = getVisiblePages();

    return (
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPageFromAPI - 1);
                }}
                className={
                  currentPageFromAPI === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page Numbers - Always show at least page 1 */}
            {totalPages === 1 ? (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={true}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
            ) : (
              visiblePages.map((pageItem, index) => (
                <PaginationItem key={index}>
                  {pageItem === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageItem);
                      }}
                      isActive={pageItem === currentPageFromAPI}
                      className="cursor-pointer"
                    >
                      {pageItem}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPageFromAPI + 1);
                }}
                className={
                  currentPageFromAPI === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Pagination Info */}
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing page {currentPageFromAPI} of {totalPages} ({total} total
          items)
        </div>
      </div>
    );
  };


  return (
    <div className="w-full rounded-lg border h-full bg-white p-4">
      {/* Main Tabs */}
      <Tabs value={Tab} onValueChange={handletabchange} className="">
        <TabsList className="p-0 bg-transparent space-x-2 h-auto">
          <TabsTrigger
            value="applications"
            onClick={() => setisapproved("")}
            className="rounded-md px-6 py-2 cursor-pointer text-base font-medium data-[state=active]:bg-[#106C83] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
          >
            Owner's Properties
          </TabsTrigger>
          <TabsTrigger
            value="active"
            onClick={() => setisapproved("approved")}
            className="rounded-md px-6 py-2 text-base cursor-pointer font-medium data-[state=active]:bg-[#106C83] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-gray-300 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
          >
            Approved Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          {/* Profile Tabs and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="border-b border-gray-200 w-full">
              <div className="flex -mb-px">
                <button
                  onClick={() => setisapproved("")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    isapproved === ""
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Properties
                </button>
                <button
                  onClick={() => setisapproved("pending")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    isapproved === "pending"
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pending for Approval
                </button>
                <button
                  onClick={() => setisapproved("rejected")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    isapproved === "rejected"
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Rejected Properties
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Select value={selectedValue} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-full w-44 border rounded-l-md  focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.length > 0 ? (
                    categories.map((Category) => (
                      <SelectItem key={Category._id} value={Category._id}>
                        {Category?.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-1 text-center text-sm">
                      No Category available
                    </div>
                  )}
                </SelectContent>
              </Select>
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
                     <TableHead className="text-xs font-medium text-gray-500 uppercase">Property Owner</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Property Name</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Category</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Location</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Phone No</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Status</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 h-12"
                    >
                      <TableCell className="font-medium">
                        {application?.owner?.name}
                      </TableCell>
                      <TableCell>
                        {application?.name}
                      </TableCell>
                      <TableCell>{application?.category?.name}</TableCell>
                      <TableCell>{application.location?.area}</TableCell>
                      <TableCell>{application?.Number}</TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium ${
                            application.isapproved === "pending"
                              ? "text-amber-500 border-amber-200 bg-amber-50"
                              : application.isapproved === "approved"
                              ? "text-green-500 border-green-200 bg-green-50"
                              : application.isapproved === "rejected"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application.isapproved}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.isapproved === "Approved" ? (
                          <span
                            onClick={() =>
                              router.push(
                                `/product-seller/profile/${application?._id}`
                              )
                            }
                            className="text-[#106C83] cursor-pointer hover:underline font-medium"
                          >
                            View Profile
                          </span>
                        ) : (
                          <span
                            onClick={() =>
                              router.push(
                                `/product-seller/profiledoc/${application?._id}`
                              )
                            }
                            className="text-[#106C83] cursor-pointer hover:underline font-medium"
                          >
                            View Details
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="flex justify-between items-center mb-4">
            <div className="border-b border-gray-200 w-full">
              <div className="flex -mb-px">
                <button
                  onClick={() => setisapproved("approved")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    isapproved === "approved"
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Approved Properties
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Select value={selectedValue} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-full w-44 border rounded-l-md  focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.length > 0 ? (
                    categories.map((location) => (
                      <SelectItem key={location._id} value={location._id}>
                        {location?.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-1 text-center text-sm">
                      No Category available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

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
                     <TableHead className="text-xs font-medium text-gray-500 uppercase">Property Owner</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Property Name</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Category</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Location</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Phone No</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Status</TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 h-12"
                    >
                      <TableCell className="font-medium">
                        {application?.owner?.name}
                      </TableCell>
                      <TableCell>
                        {application?.name}
                      </TableCell>
                      <TableCell>{application?.category?.name}</TableCell>
                      <TableCell>{application.location?.area}</TableCell>
                      <TableCell>{application?.Number}</TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium ${
                            application.isapproved === "pending"
                              ? "text-amber-500 border-amber-200 bg-amber-50"
                              : application.isapproved === "approved"
                              ? "text-green-500 border-green-200 bg-green-50"
                              : application.isapproved === "rejected"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application.isapproved}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.isapproved === "Approved" ? (
                          <span
                            onClick={() =>
                              router.push(
                                `/product-seller/profile/${application?._id}`
                              )
                            }
                            className="text-[#106C83] cursor-pointer hover:underline font-medium"
                          >
                            View Profile
                          </span>
                        ) : (
                          <span
                            onClick={() =>
                              router.push(
                                `/product-seller/profiledoc/${application?._id}`
                              )
                            }
                            className="text-[#106C83] cursor-pointer hover:underline font-medium"
                          >
                            View Details
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {renderPaginationAlways()}
      </Tabs>
    </div>
  );
}
