import { ChevronLeft, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function PendingTransactionPage() {
  const transactionData = [
    {
      orderId: "#6547",
      numberOfProducts: 2,
      unitPrice: "₹59",
      totalSales: "₹118",
      commission: "10%",
      commissionEarned: "₹15",
    },
    {
      orderId: "#6547",
      numberOfProducts: 1,
      unitPrice: "₹59",
      totalSales: "₹59",
      commission: "8%",
      commissionEarned: "₹5",
    },
    {
      orderId: "#6547",
      numberOfProducts: 1,
      unitPrice: "₹59",
      totalSales: "₹59",
      commission: "10%",
      commissionEarned: "₹5",
    },
    {
      orderId: "#6547",
      numberOfProducts: 1,
      unitPrice: "₹59",
      totalSales: "₹59",
      commission: "10%",
      commissionEarned: "₹5",
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-64px)] pb-14 bg-gray-50 dark:bg-[#09090B] p-4 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/revenue" className="flex items-center gap-2 group cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-neutral-400 group-hover:text-[#FF6900] transition-colors" />
            <h1 className="text-lg font-medium text-gray-900 dark:text-neutral-100 group-hover:text-[#FF6900] transition-colors">Pending Transaction</h1>
          </Link>
          <button className="bg-[#FF6900] hover:bg-[#E05D00] text-white px-6 py-2 rounded-md font-medium shadow-sm shadow-[#FF6900]/25 transition-colors cursor-pointer">
            Pay All
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-[#121215] rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
          {/* Section Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Product Wise Breakdown</h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 cursor-pointer">
              <span className="text-sm">This Week</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-neutral-900/60 border-b border-gray-200 dark:border-neutral-800">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    ORDER ID
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    NUMBER OF PRODUCTS
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    UNIT PRICE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    TOTAL SALES
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    COMMISSION
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    COMMISSION EARNED
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#121215] divide-y divide-gray-200 dark:divide-neutral-800/60">
                {transactionData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-4 px-6 text-sm font-mono font-medium text-gray-900 dark:text-neutral-100">{row.orderId}</td>
                    <td className="py-4 px-6 text-sm text-gray-700 dark:text-neutral-300">{row.numberOfProducts}</td>
                    <td className="py-4 px-6 text-sm text-gray-700 dark:text-neutral-300">{row.unitPrice}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-neutral-100">{row.totalSales}</td>
                    <td className="py-4 px-6 text-sm text-gray-700 dark:text-neutral-300">{row.commission}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{row.commissionEarned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
