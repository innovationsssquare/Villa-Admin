import { ChevronLeft, ChevronDown } from "lucide-react"

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
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
            <h1 className="text-lg font-medium text-gray-900">Pending Transaction</h1>
          </div>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium">Pay All</button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Section Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Product Wise Breakdown</h2>
            <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <span>This Week</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    ORDER ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    NUMBER OF PRODUCTS
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    UNIT PRICE
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    TOTAL SALES
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    COMMISSION
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    COMMISSION EARNED
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{row.orderId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{row.numberOfProducts}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{row.unitPrice}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{row.totalSales}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{row.commission}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{row.commissionEarned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
