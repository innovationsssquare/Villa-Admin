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
import { fetchAllSellars } from "@/lib/Redux/Slices/sellarSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import Profilecard from "./Profilecard";
import { Badge } from "@/components/ui/badge";

export default function SellersManagement() {
  const [selectedValue, setSelectedValue] = useState("this-week");
  const [sortValue, setSortValue] = useState("sort-by");
  const [profileTab, setProfileTab] = useState("all");
  const [Tab, setTab] = useState("applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const { data, loading, error } = useSelector((state) => state.sellar);
  const [filteredData, setFilteredData] = useState([]);
  const { analytics, loadinganalytics, analyticserror } = useSelector(
    (state) => state.sellar
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllSellars(profileTab));
  }, [dispatch, profileTab, selectedValue, sortValue, Tab,searchQuery]);

  const handleSelectChange = (value) => {
    setSelectedValue(value);
    filterAndSortData(value, sortValue);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    filterAndSortData(selectedValue, value); // Combine filtering and sorting
  };

  const convertToIST = (date) => {
    const utcDate = new Date(date);
    // IST is UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(utcDate.getTime() + istOffset);
  };

  // const filterAndSortData = (period, sortBy) => {
  //   const now = new Date();
  //   const currentIST = convertToIST(now);
  //   const currentMonth = currentIST.getMonth();
  //   const currentYear = currentIST.getFullYear();

  //   const filtered = data.filter((item) => {
  //     const createdAtIST = convertToIST(item.createdAt);
  //     const updatedAtIST = convertToIST(item.updatedAt);

  //     if (period === "this-month") {
  //       const createdInThisMonth =
  //         createdAtIST.getMonth() === currentMonth &&
  //         createdAtIST.getFullYear() === currentYear;

  //       const updatedInThisMonth =
  //         updatedAtIST.getMonth() === currentMonth &&
  //         updatedAtIST.getFullYear() === currentYear;

  //       return createdInThisMonth || updatedInThisMonth;
  //     }

  //     if (period === "this-week") {
  //       const startOfWeek = new Date(currentIST);
  //       startOfWeek.setDate(currentIST.getDate() - currentIST.getDay());
  //       startOfWeek.setHours(0, 0, 0, 0);

  //       return createdAtIST >= startOfWeek || updatedAtIST >= startOfWeek;
  //     }

  //     if (period === "this-year") {
  //       return (
  //         createdAtIST.getFullYear() === currentYear ||
  //         updatedAtIST.getFullYear() === currentYear
  //       );
  //     }

  //     return true;
  //   });

  //   const sortedData = sortData(filtered, sortBy);
  //   setFilteredData(sortedData);
  // };

  // const sortData = (data, sortBy) => {
  //   switch (sortBy) {
  //     case "name-asc":
  //       return data?.sort((a, b) =>
  //         (a?.BusinessName || "").localeCompare(b?.BusinessName || "")
  //       );
  //     case "name-desc":
  //       return data?.sort((a, b) =>
  //         (b?.BusinessName || "").localeCompare(a?.BusinessName || "")
  //       );
  //     case "rating-high":
  //       return data?.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  //     case "rating-low":
  //       return data?.sort((a, b) => (a.rating || 0) - (b.rating || 0));
  //     default:
  //       return data;
  //   }
  // };

  // useEffect(() => {
  //   filterAndSortData(selectedValue, sortValue);
  // }, [selectedValue, sortValue, data]);

const filterAndSortData = (period, sortBy) => {
  const now = new Date();
  const currentIST = convertToIST(now);
  const currentMonth = currentIST.getMonth();
  const currentYear = currentIST.getFullYear();

  const filtered = data.filter((item) => {
    const createdAtIST = convertToIST(item.createdAt);
    const updatedAtIST = convertToIST(item.updatedAt);

    // Filter based on period (this-month, this-week, this-year)
    if (period === "this-month") {
      const createdInThisMonth =
        createdAtIST.getMonth() === currentMonth &&
        createdAtIST.getFullYear() === currentYear;

      const updatedInThisMonth =
        updatedAtIST.getMonth() === currentMonth &&
        updatedAtIST.getFullYear() === currentYear;

      if (!(createdInThisMonth || updatedInThisMonth)) {
        return false;
      }
    }

    if (period === "this-week") {
      const startOfWeek = new Date(currentIST);
      startOfWeek.setDate(currentIST.getDate() - currentIST.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      if (!(createdAtIST >= startOfWeek || updatedAtIST >= startOfWeek)) {
        return false;
      }
    }

    if (period === "this-year") {
      if (!(createdAtIST.getFullYear() === currentYear || updatedAtIST.getFullYear() === currentYear)) {
        return false;
      }
    }

    return true; 
  });

  // Sort the filtered data
  const sortedData = sortData(filtered, sortBy);
  setFilteredData(sortedData);
};

const sortData = (data, sortBy) => {
  switch (sortBy) {
    case "name-asc":
      return data?.sort((a, b) =>
        (a?.BusinessName || "").localeCompare(b?.BusinessName || "")
      );
    case "name-desc":
      return data?.sort((a, b) =>
        (b?.BusinessName || "").localeCompare(a?.BusinessName || "")
      );
    case "rating-high":
      return data?.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "rating-low":
      return data?.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    default:
      return data;
  }
};

useEffect(() => {
  filterAndSortData(selectedValue, sortValue); 
}, [selectedValue, sortValue, data]);

const sellers = Array.isArray(data) ? data : [];

  // Filter the sellers based on searchQuery
  const filteredSellers = sellers.filter((item) => {
    if (!item?.BussinessName) return false;
    return item.BussinessName.toLowerCase().includes(searchQuery.toLowerCase());
  });

console.log(filteredSellers)


  const handletabchange = (value) => {
    setTab(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="w-full rounded-lg border h-full bg-white p-4">
      {/* Main Tabs */}
      <Tabs value={Tab} onValueChange={handletabchange} className="">
        <TabsList className="p-0 bg-transparent space-x-2 h-auto">
          <TabsTrigger
            value="applications"
            onClick={() => setProfileTab("all")}
            className="rounded-md px-6 py-2 cursor-pointer text-base font-medium data-[state=active]:bg-[#106C83] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
          >
            Sellers Applications
          </TabsTrigger>
          <TabsTrigger
            value="active"
            onClick={() => setProfileTab("Approved")}
            className="rounded-md px-6 py-2 text-base cursor-pointer font-medium data-[state=active]:bg-[#106C83] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-gray-300 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
          >
            Approved Sellers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          {/* Profile Tabs and Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="border-b border-gray-200 w-full">
              <div className="flex -mb-px">
                <button
                  onClick={() => setProfileTab("all")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "all"
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Profiles
                </button>
                <button
                  onClick={() => setProfileTab("pending")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "pending"
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pending for Approval
                </button>
                <button
                  onClick={() => setProfileTab("rejected")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "rejected"
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Rejected Profiles
                </button>
                <button
                  onClick={() => setProfileTab("blacklisted")}
                  className={`mr-8 py-4 text-sm font-medium cursor-pointer ${
                    profileTab === "blacklisted"
                      ? "border-b-2 border-[#106C83] text-[#106C83]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Blacklisted Profiles
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Select value={selectedValue} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[130px] border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="This Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
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
            ) : filteredData?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No seller applications available
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50 border border-gray-300 rounded-md">
                  <TableRow className="">
                    <TableHead className="text-xs font-medium text-gray-500">
                      BUSINESS NAME
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      LOCATION
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      OWNER NAME
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      EMAIL ID
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      CONTACT
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      REGISTRATION DATE
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      STATUS
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      ACTION
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems?.map((application, index) => (
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
                      <TableCell>
                        {new Date(application?.createdAt)?.toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium ${
                            application.isCompanyVerified === "Pending"
                              ? "text-amber-500"
                              : application.isCompanyVerified === "Approved"
                              ? "text-green-500 border-green-200 bg-green-50"
                              : application.isCompanyVerified === "Rejected"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {application.isCompanyVerified}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.isCompanyVerified === "Approved" ? (
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

          {!loading && !error && filteredData.length > 0 && (
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
          <div className="flex justify-between items-center mb-2">
            <div className="w-full"></div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Name"
                className="border h-9 p-2 rounded-md w-60"
              />
              <Select value={sortValue} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[130px] border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sort-by">Sort By</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="rating-high">Rating (High-Low)</SelectItem>
                  <SelectItem value="rating-low">Rating (Low-High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seller Cards Grid */}
          <div className=" rounded-md">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <span className="loader2 " />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-10 text-red-500">
                {error}
              </div>
            ) : filteredSellers?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No seller applications available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSellers?.map((seller, index) => (
                  <Card
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden p-3"
                  >
                    <div className="bg-[#EDC5C5] p-8 flex justify-center items-center rounded-md">
                      <Image
                        src={dashiconsstore}
                        alt="store"
                        className=" object-contain  text-gray-800"
                      />
                    </div>
                    <CardContent className="p-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold">
                          {seller?.BussinessName}
                        </h3>
                        <div className="flex items-center text-sm">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-medium">{seller?.rating}</span>
                          <span className="text-gray-500 ml-1">
                            ({seller?.reviews})
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`${seller?.CompanyId?.BussinessWebsite}`}
                        className="text-[#106C83] text-sm flex items-center hover:underline mb-4"
                      >
                        {seller?.CompanyId?.BussinessWebsite}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 shrink-0" />
                          <span className="text-gray-700">
                            {seller?.CompanyId?.Address?.City}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                          <span className="text-gray-700">{seller?.Email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                          <span className="text-gray-700">
                            {seller?.CompanyId?.BussinessNumber}
                          </span>
                        </div>
                      </div>

                      <Profilecard id={seller?._id} />
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button
                        onPress={() =>
                          router.push(`/product-seller/profile/${seller?._id}`)
                        }
                        className="w-full cursor-pointer rounded-md bg-[#106C83] hover:bg-[#106C83] text-white py-2"
                      >
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
