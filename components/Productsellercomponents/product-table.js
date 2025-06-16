"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, Pencil } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllsellarproduct } from "@/lib/Redux/Slices/sellarSlice";
import { useParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductTable() {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [totalRecords, setTotalRecords] = useState(0); // Track total records
  const [perPage, setPerPage] = useState(10); // Items per page

  const [selectedTab, setSelectedTab] = useState("approved"); // Track selected tab
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const dispatch = useDispatch();
  const { productloading, productdata, producterror, pagination } = useSelector(
    (state) => state.sellar
  );

  useEffect(() => {
    dispatch(
      fetchAllsellarproduct({
        Status: selectedTab === "approved" ? "Approved" : "Pending",
        VendorId: id,
        page: totalPages,
        limit: perPage,
      })
    );
  }, [selectedTab, totalPages]);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "text-green-600";
      case "Pending":
        return "text-amber-500";
      case "Out of Stock":
        return "text-red-600";
      default:
        return "";
    }
  };

  useEffect(() => {
    setTotalRecords(productdata?.pagination?.totalRecords);
    setCurrentPage(productdata?.pagination?.currentPage);
    setTotalPages(productdata?.pagination?.totalPages);
    setPerPage(productdata?.pagination?.perPage);
  }, [productdata]);

  // Handle page change (Next, Previous, or specific page number)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Fetch the data based on the current page
      console.log(`Fetching page ${page}...`);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">
            <Tabs
              defaultValue="approved"
              className="w-auto"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList className="bg-transparent p-0">
                <TabsTrigger
                  value="approved"
                  className="px-0 py-2 cursor-pointer mr-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-0 data-[state=active]:border-[#106C83] data-[state=active]:rounded-none data-[state=active]:shadow-none"
                >
                  Approved Products
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="px-0 py-2 cursor-pointer data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-0 data-[state=active]:border-[#106C83] data-[state=active]:rounded-none data-[state=active]:shadow-none"
                >
                  Pending Products
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        {productloading ? (
          <div className="flex w-full justify-center items-center">
            <span className="loader2"></span>
          </div>
        ) : (
          <>
            {productdata?.length > 0 ? (
              <CardContent className="p-3 overflow-hidden">
                <ScrollArea className="h-auto rounded-md overflow-hidden">
                  <Table className="overflow-hidden">
                    <TableHeader className="bg-gray-100 text-[#9C9C9C]">
                      <TableRow>
                        <TableHead className="w-auto text-gray-500">
                          PRODUCT NAME
                        </TableHead>
                        <TableHead className="text-gray-500 uppercase">
                          Stock
                        </TableHead>
                        <TableHead className="text-gray-500">
                          PRODUCT PRICE
                        </TableHead>
                        <TableHead className="text-gray-500">
                          DISCOUNTS
                        </TableHead>
                        <TableHead className="text-gray-500">
                          PRICE ON DISPLAY
                        </TableHead>
                        <TableHead className="text-gray-500">STATUS</TableHead>
                        <TableHead className="text-gray-500">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productdata?.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                  src={product?.Images[0]}
                                  alt={product?.Name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium">
                                  {product?.Name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.Stock}</TableCell>
                          <TableCell>{product.Yourprice}</TableCell>
                          <TableCell>{product.Discount}</TableCell>
                          <TableCell>{product.SellingPrice}</TableCell>

                          <TableCell>
                            <span
                              className={`font-medium ${getStatusColor(
                                product?.Status
                              )}`}
                            >
                              {product?.Status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {product?.Status === "Pending" ? (
                                <Button
                                  onClick={() =>
                                    router.push(
                                      `/product-seller/Viewproduct/${product?._id}`
                                    )
                                  }
                                  variant="outline"
                                  className=" cursor-pointer"
                                >
                                  View Product
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              {/* <Button variant="outline" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {!productloading &&
                    !producterror &&
                    productdata.length > 0 && (
                      <div className="flex justify-center mt-4">
                        <div className="flex items-center space-x-4">
                          {/* Previous Button */}
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm"
                          >
                            Previous
                          </Button>

                          {/* Page Numbers */}
                          <div className="flex space-x-2">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <Button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                variant="outline"
                                className={`px-4 py-2 text-sm ${
                                  currentPage === page
                                    ? "bg-blue-500 text-black"
                                    : ""
                                }`}
                              >
                                {page}
                              </Button>
                            ))}
                          </div>

                          {/* Next Button */}
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                </ScrollArea>
              </CardContent>
            ) : (
              <div className="w-full flex justify-center items-center h-60">
                <span>No products</span>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}
