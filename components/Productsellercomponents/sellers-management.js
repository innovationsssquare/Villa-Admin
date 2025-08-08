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
import DocumentApprovalPage from "./document-approval";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Mail, Phone, Store, ChevronRight } from "lucide-react";
import dashiconsstore from "@/public/Asset/dashiconsstore.png";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPropertiesowner } from "@/lib/Redux/Slices/ownerSlice";
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
import Profilecard from "./Profilecard";
import { Badge } from "@/components/ui/badge";
import { fetchAllCategories } from "@/lib/Redux/Slices/masterSlice";

export default function SellersManagement() {
  const [selectedValue, setSelectedValue] = useState("");
  const [sortValue, setSortValue] = useState("sort-by");
  const [isVerified, setisVerified] = useState();
  const [Tab, setTab] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const { data, loading, error, datapagination } = useSelector(
    (state) => state.owner
  );
  const [filteredData, setFilteredData] = useState([]);
  const { categories } = useSelector((state) => state.master);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchAllPropertiesowner({
        isVerified,
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, isVerified, itemsPerPage, currentPage]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handletabchange = (value) => {
    setTab(value);
    setisVerified(value);
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
    return datapagination;
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
  }, [isVerified]);

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
            value={false}
            onClick={() => setisVerified(false)}
            className="rounded-md px-6 py-2 cursor-pointer text-base font-medium data-[state=active]:bg-[#106C83] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
          >
            Unverified Owners
          </TabsTrigger>
          <TabsTrigger
            value={true}
            onClick={() => setisVerified(true)}
            className="rounded-md px-6 py-2 text-base cursor-pointer font-medium data-[state=active]:bg-[#106C83] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-gray-300 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
          >
            Verified Owners
          </TabsTrigger>
        </TabsList>

        <TabsContent value={false}>
          {/* Profile Tabs and Filters */}

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
                No Owners available
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 border border-gray-300 rounded-md">
                  <TableRow className="">
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Owner Name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Phone No
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Total Properties
                    </TableHead>

                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Action
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
                        {application?.name}
                      </TableCell>
                      <TableCell>{application?.email}</TableCell>
                      <TableCell>{application?.phone}</TableCell>
                      <TableCell>{application?.properties?.length}</TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium ${
                            application.isVerified === false
                              ? "text-red-500 border-red-200 bg-red-50"
                              : application.isVerified ===true
                              ? "text-green-500 border-green-200 bg-green-50"
                              : application.isVerified === "rejected"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application.isVerified?"Verified":"Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                  
                          <span
                            onClick={() =>
                              router.push(
                                `/property-owner/Viewdetails/${application?._id}`
                              )
                            }
                            className="text-[#106C83] cursor-pointer hover:underline font-medium"
                          >
                            View Profile
                          </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value={true}>
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
                No Owners available
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 border border-gray-300 rounded-md">
                  <TableRow className="">
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Owner Name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Phone No
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Total Properties
                    </TableHead>

                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Action
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
                        {application?.name}
                      </TableCell>
                      <TableCell>{application?.email}</TableCell>
                      <TableCell>{application?.phone}</TableCell>
                      <TableCell>{application?.properties?.length}</TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium ${
                            application.isVerified === false
                              ? "text-red-500 border-red-200 bg-red-50"
                              : application.isVerified ===true
                              ? "text-green-500 border-green-200 bg-green-50"
                              : application.isVerified === "rejected"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application.isVerified?"Verified":"Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                      
                          <span
                            onClick={() =>
                              router.push(
                                `/property-owner/Viewdetails/${application?._id}`
                              )
                            }
                            className="text-[#106C83] cursor-pointer hover:underline font-medium"
                          >
                            View Profile
                          </span>
                     
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
