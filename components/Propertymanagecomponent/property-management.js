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
import { Button } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Mail, Phone, Store, ChevronRight, Search, X, Sparkles, Flame, Check } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProperties } from "@/lib/Redux/Slices/sellarSlice";
import { UpdatePropertyPromotion } from "@/lib/API/Seller/Sellar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
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

  // Promotion Management State
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [selectedPropertyForPromotion, setSelectedPropertyForPromotion] = useState(null);
  const [promoForm, setPromoForm] = useState({
    isPromoted: false,
    promotionPriority: 100,
    customBadge: "Spotlight",
    promotedUntil: "",
  });
  const [promoSaving, setPromoSaving] = useState(false);

  const handleOpenPromote = (property) => {
    setSelectedPropertyForPromotion(property);
    const dateVal = property?.promotedUntil
      ? new Date(property.promotedUntil).toISOString().split("T")[0]
      : "";
    setPromoForm({
      isPromoted: Boolean(property?.isPromoted),
      promotionPriority: property?.promotionPriority != null ? property.promotionPriority : 100,
      customBadge: property?.customBadge || "Spotlight",
      promotedUntil: dateVal,
    });
    setPromoteModalOpen(true);
  };

  const handleSavePromotion = async () => {
    if (!selectedPropertyForPromotion) return;
    setPromoSaving(true);
    try {
      const categoryName =
        selectedPropertyForPromotion?.category?.name ||
        categories.find((c) => c._id === selectedValue)?.name ||
        "Villa";

      const res = await UpdatePropertyPromotion({
        category: categoryName,
        id: selectedPropertyForPromotion._id,
        data: {
          isPromoted: promoForm.isPromoted,
          promotionPriority: Number(promoForm.promotionPriority) || 0,
          customBadge: promoForm.customBadge,
          promotedUntil: promoForm.promotedUntil ? new Date(promoForm.promotedUntil).toISOString() : null,
        },
      });

      if (res?.success) {
        setPromoteModalOpen(false);
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
      } else {
        alert(res?.message || "Failed to update property promotion");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving promotion: " + (err.message || err));
    } finally {
      setPromoSaving(false);
    }
  };
  const { data, loading, error, datapagination } = useSelector(
    (state) => state.sellar
  );
  const { analytics, loadinganalytics, analyticserror } = useSelector(
    (state) => state.sellar
  );
  const { categories } = useSelector((state) => state.master);

  const filteredProperties = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!searchQuery || searchQuery.trim() === "") return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      const name = (item?.name || item?.title || "").toLowerCase();
      const ownerName = (item?.owner?.name || "").toLowerCase();
      const categoryName = (item?.category?.name || "").toLowerCase();
      const locationArea = (item?.location?.area || item?.location?.city || "").toLowerCase();
      const phone = (item?.Number || item?.owner?.phoneNumber || "").toLowerCase();
      const propId = (item?._id || "").toLowerCase();

      return (
        name.includes(q) ||
        ownerName.includes(q) ||
        categoryName.includes(q) ||
        locationArea.includes(q) ||
        phone.includes(q) ||
        propId.includes(q)
      );
    });
  }, [data, searchQuery]);

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
  }, [dispatch, selectedValue, isapproved, itemsPerPage, currentPage]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length > 0 && !selectedValue) {
      setSelectedValue(categories[0]?._id);
    }
  }, [categories, selectedValue]);

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
    <div className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 h-full bg-white dark:bg-[#121215] p-4 shadow-sm transition-colors">
      {/* Main Tabs */}
      <Tabs value={Tab} onValueChange={handletabchange} className="">
        <TabsList className="p-0 bg-transparent space-x-2 h-auto mb-4">
          <TabsTrigger
            value="applications"
            onClick={() => {
              setTab("applications");
              setisapproved("");
            }}
            className={`rounded-xl px-5 py-2 cursor-pointer text-sm font-semibold transition-all shadow-sm ${
              Tab === "applications"
                ? "!bg-[#FF6900] !text-white"
                : "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
            }`}
          >
            {` Owner's Properties`}
          </TabsTrigger>
          <TabsTrigger
            value="active"
            onClick={() => {
              setTab("active");
              setisapproved("approved");
            }}
            className={`rounded-xl px-5 py-2 text-sm cursor-pointer font-semibold transition-all shadow-sm ${
              Tab === "active"
                ? "!bg-[#FF6900] !text-white"
                : "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
            }`}
          >
            Approved Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          {/* Profile Tabs and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="border-b border-gray-200 dark:border-neutral-800 w-full">
              <div className="flex -mb-px">
                <button
                  onClick={() => setisapproved("")}
                  className={`mr-8 py-3 text-xs font-semibold cursor-pointer transition-colors ${
                    isapproved === ""
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  All Properties
                </button>
                <button
                  onClick={() => setisapproved("pending")}
                  className={`mr-8 py-3 text-xs font-semibold cursor-pointer transition-colors ${
                    isapproved === "pending"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  Pending for Approval
                </button>
                <button
                  onClick={() => setisapproved("rejected")}
                  className={`mr-8 py-3 text-xs font-semibold cursor-pointer transition-colors ${
                    isapproved === "rejected"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  Rejected Properties
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2.5 ml-4 shrink-0">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search properties, owner..."
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
              <Select value={selectedValue} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-9 w-44 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl text-xs font-medium focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                  {categories?.length > 0 ? (
                    categories.map((Category) => (
                      <SelectItem key={Category._id} value={Category._id} className="text-xs">
                        {Category?.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-1 text-center text-xs text-neutral-400">
                      No Category available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

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
            ) : filteredProperties?.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-neutral-400">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p>No properties matching &quot;{searchQuery}&quot;</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#FF6900] hover:underline font-medium cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  "No data available"
                )}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
                  <TableRow className="border-b border-gray-200 dark:border-neutral-800">
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Property Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Property Owner
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Location
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Phone No
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Promotion
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
                  {filteredProperties?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 dark:border-neutral-800/60 hover:bg-gray-50/60 dark:hover:bg-neutral-800/30 h-12 transition-colors"
                    >
                      <TableCell className="font-semibold text-neutral-900 dark:text-white">
                        <div className="flex flex-col">
                          <span>{application?.name}</span>
                          {application?.isPromoted && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              <Sparkles className="w-2.5 h-2.5" />
                              {application?.customBadge || "Promoted"} (P{application?.promotionPriority || 0})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.owner?.name}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.category?.name}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application.location?.area}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.Number}</TableCell>
                      <TableCell>
                        {application?.isPromoted ? (
                          <div className="flex flex-col gap-0.5">
                            <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-[10px] font-bold px-2 py-0.5 gap-1 w-fit shadow-2xs">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              {application?.customBadge || "Spotlight"}
                            </Badge>
                            <span className="text-[10px] text-neutral-500 font-medium">
                              Priority {application?.promotionPriority || 0}
                              {application?.promotedUntil && ` · Ends ${new Date(application.promotedUntil).toLocaleDateString("en-IN")}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-normal">Standard</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-semibold text-xs px-2.5 py-0.5 rounded-full capitalize ${
                            application.isapproved === "pending"
                              ? "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40"
                              : application.isapproved === "approved"
                              ? "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40"
                              : application.isapproved === "rejected"
                              ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60"
                              : "text-neutral-500 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                          }`}
                        >
                          {application?.isapproved}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenPromote(application)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-[#FF6900] border border-orange-200/80 dark:bg-orange-950/30 dark:border-orange-900/50 dark:hover:bg-orange-950/50 transition-all cursor-pointer shadow-2xs"
                          >
                            <Sparkles className="w-3 h-3 text-[#FF6900]" />
                            <span>{application?.isPromoted ? "Edit Promo" : "Promote"}</span>
                          </button>
                          <span
                            onClick={() => {
                              const selectedCategory = categories.find(
                                (category) => category._id === selectedValue
                              );
                              if (selectedCategory) {
                                router.push(
                                  `/manage-property/View${selectedCategory?.name}details/${application._id}`
                                );
                              }
                            }}
                            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer hover:underline font-medium text-xs whitespace-nowrap"
                          >
                            View Details
                          </span>
                        </div>
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
            <div className="border-b border-gray-200 dark:border-neutral-800 w-full">
              <div className="flex -mb-px">
                <button
                  onClick={() => setisapproved("approved")}
                  className={`mr-8 py-3 text-xs font-semibold cursor-pointer transition-colors ${
                    isapproved === "approved"
                      ? "border-b-2 border-[#FF6900] text-[#FF6900]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                >
                  All Approved Properties
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2.5 ml-4 shrink-0">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search properties, owner..."
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
              <Select value={selectedValue} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-9 w-44 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl text-xs font-medium focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                  {categories?.length > 0 ? (
                    categories.map((location) => (
                      <SelectItem key={location._id} value={location._id} className="text-xs">
                        {location?.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-1 text-center text-xs text-neutral-400">
                      No Category available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500 dark:text-neutral-400">
                <span className="loader2 " />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-10 text-red-500">
                {error}
              </div>
            ) : filteredProperties?.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-neutral-400">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p>No properties matching &quot;{searchQuery}&quot;</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#FF6900] hover:underline font-medium cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  "No data available"
                )}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
                  <TableRow className="border-b border-gray-200 dark:border-neutral-800">
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Property Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Property Owner
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Location
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Phone No
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                      Promotion
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
                  {filteredProperties?.map((application, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 dark:border-neutral-800/60 hover:bg-gray-50/60 dark:hover:bg-neutral-800/30 h-12 transition-colors"
                    >
                      <TableCell className="font-semibold text-neutral-900 dark:text-white">
                        <div className="flex flex-col">
                          <span>{application?.name}</span>
                          {application?.isPromoted && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              <Sparkles className="w-2.5 h-2.5" />
                              {application?.customBadge || "Promoted"} (P{application?.promotionPriority || 0})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.owner?.name}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.category?.name}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application.location?.area}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-300">{application?.Number}</TableCell>
                      <TableCell>
                        {application?.isPromoted ? (
                          <div className="flex flex-col gap-0.5">
                            <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-[10px] font-bold px-2 py-0.5 gap-1 w-fit shadow-2xs">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              {application?.customBadge || "Spotlight"}
                            </Badge>
                            <span className="text-[10px] text-neutral-500 font-medium">
                              Priority {application?.promotionPriority || 0}
                              {application?.promotedUntil && ` · Ends ${new Date(application.promotedUntil).toLocaleDateString("en-IN")}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-normal">Standard</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-semibold text-xs px-2.5 py-0.5 rounded-full capitalize ${
                            application.isapproved === "pending"
                              ? "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40"
                              : application.isapproved === "approved"
                              ? "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40"
                              : application.isapproved === "rejected"
                              ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60"
                              : "text-neutral-500 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                          }`}
                        >
                          {application?.isapproved}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenPromote(application)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-[#FF6900] border border-orange-200/80 dark:bg-orange-950/30 dark:border-orange-900/50 dark:hover:bg-orange-950/50 transition-all cursor-pointer shadow-2xs"
                          >
                            <Sparkles className="w-3 h-3 text-[#FF6900]" />
                            <span>{application?.isPromoted ? "Edit Promo" : "Promote"}</span>
                          </button>
                          <span
                            onClick={() => {
                              const selectedCategory = categories.find(
                                (category) => category._id === selectedValue
                              );
                              if (selectedCategory) {
                                router.push(
                                  `/manage-property/View${selectedCategory?.name}details/${application._id}`
                                );
                              }
                            }}
                            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer hover:underline font-medium text-xs whitespace-nowrap"
                          >
                            View Details
                          </span>
                        </div>
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

      {/* Promotion Management Modal Dialog */}
      <Dialog open={promoteModalOpen} onOpenChange={setPromoteModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-[#FF6900] border border-orange-200 dark:border-orange-800/50">
                <Sparkles className="w-4 h-4" />
              </div>
              <DialogTitle className="text-base font-bold text-neutral-900 dark:text-white">
                Promote Property
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
              Boost &quot;{selectedPropertyForPromotion?.name}&quot; to top positions on the homepage, weekend escapes carousel, and search listings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* 1. Promotion Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40">
              <div>
                <label className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Spotlight Promotion Active
                </label>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Pin stay at Tier 1 above organic listings
                </p>
              </div>
              <Switch
                checked={promoForm.isPromoted}
                onCheckedChange={(val) => setPromoForm((prev) => ({ ...prev, isPromoted: val }))}
              />
            </div>

            {promoForm.isPromoted && (
              <>
                {/* 2. Promotion Priority */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Priority Tier
                  </label>
                  <Select
                    value={String(promoForm.promotionPriority)}
                    onValueChange={(val) => setPromoForm((prev) => ({ ...prev, promotionPriority: Number(val) }))}
                  >
                    <SelectTrigger className="h-9 text-xs rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                      <SelectItem value="100" className="text-xs font-semibold">
                        🔥 Top Spotlight (Priority 100 - Highest)
                      </SelectItem>
                      <SelectItem value="50" className="text-xs font-semibold">
                        ⭐ Featured Stay (Priority 50 - High)
                      </SelectItem>
                      <SelectItem value="25" className="text-xs font-semibold">
                        ⚡ Boosted Stay (Priority 25 - Moderate)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Badge Label */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Promo Badge Label
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {["Spotlight", "Featured", "Limited Deal", "Admin Pick", "Trending Now"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setPromoForm((prev) => ({ ...prev, customBadge: tag }))}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                          promoForm.customBadge === tag
                            ? "bg-[#FF6900] text-white border-[#FF6900]"
                            : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-orange-300"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="text"
                    placeholder="Or enter custom badge text..."
                    value={promoForm.customBadge}
                    onChange={(e) => setPromoForm((prev) => ({ ...prev, customBadge: e.target.value }))}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                {/* 4. Expiration Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Active Duration / Expiry Date (Optional)
                  </label>
                  <div className="flex gap-1.5 mb-1.5">
                    {[
                      { label: "7 Days", days: 7 },
                      { label: "14 Days", days: 14 },
                      { label: "30 Days", days: 30 },
                    ].map(({ label, days }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + days);
                          setPromoForm((prev) => ({
                            ...prev,
                            promotedUntil: d.toISOString().split("T")[0],
                          }));
                        }}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-orange-50 hover:text-[#FF6900] transition-colors"
                      >
                        +{label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPromoForm((prev) => ({ ...prev, promotedUntil: "" }))}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-red-500 transition-colors"
                    >
                      No Expiry
                    </button>
                  </div>
                  <Input
                    type="date"
                    value={promoForm.promotedUntil}
                    onChange={(e) => setPromoForm((prev) => ({ ...prev, promotedUntil: e.target.value }))}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="bordered"
              size="sm"
              onPress={() => setPromoteModalOpen(false)}
              className="text-xs font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              isLoading={promoSaving}
              onPress={handleSavePromotion}
              className="text-xs font-bold rounded-xl bg-[#FF6900] text-white shadow-xs"
            >
              Save Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
