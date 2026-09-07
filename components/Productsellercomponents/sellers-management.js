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
  const [Tab, setTab] = useState("all");
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
    setisVerified(value === "verified" ? true : undefined);
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
    <div className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 h-full bg-white dark:bg-[#121215] p-4 shadow-sm transition-colors">
      {/* Main Tabs */}
      <Tabs value={Tab} onValueChange={handletabchange} className="">
        <TabsList className="p-0 bg-transparent space-x-2 h-auto mb-4">
          <TabsTrigger
            value="all"
            onClick={() => {
              setTab("all");
              setisVerified(undefined);
            }}
            className={`rounded-xl px-5 py-2 cursor-pointer text-sm font-semibold transition-all shadow-sm ${
              Tab === "all"
                ? "!bg-[#FF6900] !text-white"
                : "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
            }`}
          >
           All Owners
          </TabsTrigger>
          <TabsTrigger
            value="verified"
            onClick={() => {
              setTab("verified");
              setisVerified(true);
            }}
            className={`rounded-xl px-5 py-2 text-sm cursor-pointer font-semibold transition-all shadow-sm ${
              Tab === "verified"
                ? "!bg-[#FF6900] !text-white"
                : "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
            }`}
          >
            Verified Owners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {/* Table */}
          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500 dark:text-neutral-400">
                <span className="loader2 " />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-10 text-red-500">
                {error}
              </div>
            ) : data?.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
                No Owners available
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
                  <TableRow className="border-b border-gray-200 dark:border-neutral-800">
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Owner Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Phone No
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Total Properties
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                  {data?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 dark:border-neutral-800/60 hover:bg-gray-50/60 dark:hover:bg-neutral-800/30 h-12 transition-colors"
                    >
                      <TableCell className="font-semibold text-neutral-900 dark:text-white">
                        {application?.name}
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.email}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.bankDetails?.phone || "N/A"}</TableCell>
                      <TableCell className="font-medium text-neutral-800 dark:text-neutral-200">{application?.properties?.length || 0}</TableCell>
                      <TableCell>
                        <Badge
                          className={`font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                            application.isVerified === false
                              ? "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40"
                              : application.isVerified === true
                              ? "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40"
                              : "text-neutral-500 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                          }`}
                        >
                          {application.isVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                          <span
                            onClick={() =>
                              router.push(
                                `/property-owner/Viewdetails/${application?._id}`
                              )
                            }
                            className="text-[#FF6900] hover:text-[#E05D00] cursor-pointer hover:underline font-bold text-xs"
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

        <TabsContent value="verified">
           <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500 dark:text-neutral-400">
                <span className="loader2 " />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-10 text-red-500">
                {error}
              </div>
            ) : data?.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
                No Owners available
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
                  <TableRow className="border-b border-gray-200 dark:border-neutral-800">
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Owner Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Phone No
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Total Properties
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                  {data?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 dark:border-neutral-800/60 hover:bg-gray-50/60 dark:hover:bg-neutral-800/30 h-12 transition-colors"
                    >
                      <TableCell className="font-semibold text-neutral-900 dark:text-white">
                        {application?.name}
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.email}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.bankDetails?.phone || "N/A"}</TableCell>
                      <TableCell className="font-medium text-neutral-800 dark:text-neutral-200">{application?.properties?.length || 0}</TableCell>
                      <TableCell>
                        <Badge
                          className={`font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                            application.isVerified === false
                              ? "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40"
                              : application.isVerified === true
                              ? "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40"
                              : "text-neutral-500 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                          }`}
                        >
                          {application.isVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                          <span
                            onClick={() =>
                              router.push(
                                `/property-owner/Viewdetails/${application?._id}`
                              )
                            }
                            className="text-[#FF6900] hover:text-[#E05D00] cursor-pointer hover:underline font-bold text-xs"
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
