import Image from "next/image"
import { Bell, ChevronDown, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import User from "@/public/Asset/User.png"

import Statcard from "@/components/Productsellercomponents/Statcard"
import RevenueOverview from "@/components/Analyticscomponents/revenue-overview"
import SellerApplicationsTable from "@/components/Analyticscomponents/seller-applications-table"
export default function Dashboard() {
  return (
    <ScrollArea className=" bg-gray-50 h-screen pb-14">
    
    

      {/* Main Content */}
      

        {/* Dashboard Content */}
        <div className=" overflow-auto p-3">
          {/* Stats Cards */}
        <Statcard/>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 items-stretch">
           <RevenueOverview/>
            {/* Customer Requests */}
            {/* <div className="">
              <div className="bg-white border rounded-lg p-4">
                <h2 className="text-lg font-medium mb-4">Customer&apos;s Requests</h2>
                <div className="space-y-4">
                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <Image src={User} alt="Customer Avatar" width={40} height={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Customer Name</p>
                      <p className="text-xs text-gray-500 truncate">Requirements from the customer for the service.</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <Image src={User} alt="Customer Avatar" width={40} height={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Customer Name</p>
                      <p className="text-xs text-gray-500 truncate">Requirements from the customer for the service.</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <Image src={User} alt="Customer Avatar" width={40} height={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Customer Name</p>
                      <p className="text-xs text-gray-500 truncate">Requirements from the customer for the service.</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <Image src={User} alt="Customer Avatar" width={40} height={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Customer Name</p>
                      <p className="text-xs text-gray-500 truncate">Requirements from the customer for the service.</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-[#106C83] text-white text-sm rounded-md hover:bg-teal-700">
                    View all
                  </button>
                </div>
              </div>
            </div> */}
          </div>

          {/* Applications Table */}
        <SellerApplicationsTable/>
         
        </div>
     
    </ScrollArea>
  )
}
