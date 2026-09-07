"use client";

import { useState } from "react";
import {
  ChevronDown,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Star,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import OngoingProjects from "./ongoing-projects";
import Image from "next/image";

export default function ProjectTable() {
  const [activeTab, setActiveTab] = useState("all-works");
  const [statusFilter, setStatusFilter] = useState("Quote Sent");

  const projects = [
    {
      id: 1,
      name: "Western Attire for Models",
      client: "Client Name",
      requestedDate: "27/03/2025",
      status: "New",
    },
    {
      id: 2,
      name: "Western Attire for Models",
      client: "Client Name",
      requestedDate: "27/03/2025",
      status: "Quote Sent",
    },
    {
      id: 3,
      name: "Western Attire for Models",
      client: "Client Name",
      requestedDate: "27/03/2025",
      status: "Quote Accepted",
    },
    {
      id: 4,
      name: "Western Attire for Models",
      client: "Client Name",
      requestedDate: "27/03/2025",
      status: "Assigned Provider",
    },
  ];

  return (
    <div className="w-full mx-auto p-4 bg-white dark:bg-[#121215] rounded-xl border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-4 w-full">
        <Tabs
          defaultValue="all-works"
          className="w-full mx-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-auto grid-cols-5 bg-transparent">
            <TabsTrigger
              value="all-works"
              className={`px-4 py-2 border-0 rounded-none cursor-pointer ${
                activeTab === "all-works"
                  ? "border-b-2 border-[#FF6900] font-semibold text-[#FF6900]"
                  : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
              }`}
            >
              All Works
            </TabsTrigger>
            <TabsTrigger
              value="ongoing-projects"
              className={`px-4 py-2 border-0 rounded-none cursor-pointer ${
                activeTab === "ongoing-projects"
                  ? "border-b-2 border-[#FF6900] font-semibold text-[#FF6900]"
                  : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
              }`}
            >
              Ongoing Projects
            </TabsTrigger>

            {activeTab === "all-works" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md px-4 py-2 flex items-center gap-2 col-end-6 cursor-pointer"
                  >
                    {statusFilter}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <DropdownMenuItem onClick={() => setStatusFilter("New")} className="cursor-pointer">
                    New
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Quote Sent")}
                    className="cursor-pointer"
                  >
                    Quote Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Quote Accepted")}
                    className="cursor-pointer"
                  >
                    Quote Accepted
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Assigned Provider")}
                    className="cursor-pointer"
                  >
                    Assigned Provider
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {activeTab === "ongoing-projects" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md px-4 py-2 flex items-center gap-2 col-end-6 cursor-pointer"
                  >
                    {statusFilter}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Completing soon")}
                    className="cursor-pointer"
                  >
                    Completing soon
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Recently updated")}
                    className="cursor-pointer"
                  >
                    Recently updated
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Oldest first")}
                    className="cursor-pointer"
                  >
                    Oldest first
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TabsList>

          <TabsContent value="all-works" className={"w-full"}>
            <div className="rounded-xl overflow-hidden mt-4 border border-gray-200 dark:border-neutral-800">
              <ScrollArea className="h-full w-full">
                <Table>
                  <TableHeader className="bg-gray-50/90 dark:bg-neutral-900/80 border-b border-gray-200 dark:border-neutral-800">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px] text-gray-700 dark:text-neutral-300 font-semibold">PROJECT</TableHead>
                      <TableHead className="text-gray-700 dark:text-neutral-300 font-semibold">CLIENT</TableHead>
                      <TableHead className="text-gray-700 dark:text-neutral-300 font-semibold">REQUESTED DATE</TableHead>
                      <TableHead className="text-gray-700 dark:text-neutral-300 font-semibold">REQUIREMENTS</TableHead>
                      <TableHead className="text-gray-700 dark:text-neutral-300 font-semibold">STATUS</TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-neutral-300 font-semibold">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                    {projects.map((project) => (
                      <TableRow
                        key={project.id}
                        className="hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 h-14 transition-colors"
                      >
                        <TableCell className="font-medium text-neutral-900 dark:text-white">
                          {project.name}
                        </TableCell>
                        <TableCell className="text-neutral-700 dark:text-neutral-300">{project.client}</TableCell>
                        <TableCell className="text-neutral-500 dark:text-neutral-400">{project.requestedDate}</TableCell>
                        <TableCell>
                          <ViewRequirementModal />
                        </TableCell>
                        <TableCell>
                          {project.status === "New" && (
                            <span className="text-[#34A853] dark:text-emerald-400 font-semibold">
                              New
                            </span>
                          )}
                          {project.status === "Quote Sent" && (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              Quote Sent
                            </span>
                          )}
                          {project.status === "Quote Accepted" && (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">
                              Quote Accepted
                            </span>
                          )}
                          {project.status === "Assigned Provider" && (
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              Assigned Provider
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <SendQuoteModal />
                            {project.status === "Assigned Provider" ? (
                              <Button
                                variant="destructive"
                                className="bg-[#F1000B] hover:bg-red-600 w-32"
                                size="sm"
                              >
                                Unassign
                              </Button>
                            ) : (
                              <AssignProviderModal />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="ongoing-projects">
            <OngoingProjects />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ViewRequirementModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-[#FF6900] hover:text-[#FF6900] p-0 h-auto"
        >
          View Requirement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#121215] border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Customer Requirements
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-neutral-900/60 p-4 rounded-xl border border-gray-100 dark:border-neutral-800">
            <h3 className="font-semibold mb-2 text-neutral-900 dark:text-neutral-100">{`Buyer's Request`}</h3>
            <p className="text-sm text-gray-700 dark:text-neutral-300">
             {` Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident.`}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Reference</h3>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/placeholder.svg?height=150&width=250"
                alt="Reference image 1"
                className="rounded-md object-cover w-full h-32"
              />
              <Image
                src="/placeholder.svg?height=150&width=250"
                alt="Reference image 2"
                className="rounded-md object-cover w-full h-32"
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-neutral-900/60 p-4 rounded-xl border border-gray-100 dark:border-neutral-800">
            <h3 className="font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Estimated Timeline</h3>
            <p className="text-sm text-gray-700 dark:text-neutral-300">By April 30th: 4 Weeks</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SendQuoteModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-[#34A853] hover:bg-[#34A853] text-white w-24"
          size="sm"
        >
          Send Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#121215] border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Send Quote</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4 text-neutral-900 dark:text-neutral-100">
              Set Price & Estimated Completion
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Select>
                  <SelectTrigger className="border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <SelectValue placeholder="Set Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">$100</SelectItem>
                    <SelectItem value="200">$200</SelectItem>
                    <SelectItem value="300">$300</SelectItem>
                    <SelectItem value="400">$400</SelectItem>
                    <SelectItem value="500">$500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <div className="flex">
                  <Input type="text" placeholder="Set Date" className="pr-10 border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#FF6900]">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Message (Optional)</h3>
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[150px] border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
            />
          </div>

          <Button className="w-full bg-[#FF6900] hover:bg-[#E05D00] text-white shadow-sm shadow-[#FF6900]/25 cursor-pointer">
            Send Quote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AssignProviderModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-[#FF6900] hover:bg-[#FF6900] text-white w-32 cursor-pointer"
          size="sm"
        >
          Assign Provider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-[#121215] border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Assign a Service Provider
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Select Provider</h3>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Provider Skillset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skillsets</SelectItem>
                <SelectItem value="embroidery">Embroidery</SelectItem>
                <SelectItem value="tailoring">Tailoring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((provider) => (
              <div key={provider} className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-red-100 dark:bg-red-950/40 p-2 relative">
                  <Badge
                    variant="destructive"
                    className="absolute top-2 right-2 bg-red-500"
                  >
                    Not Assigned
                  </Badge>
                  <div className="h-12"></div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Provider Name</h4>
                    <div className="flex items-center text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-neutral-700 dark:text-neutral-300">5.0 (23)</span>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="text-[#FF6900] text-sm flex items-center hover:underline"
                  >
                    www.providername.com
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>

                  <div className="text-sm text-gray-600 dark:text-neutral-400 flex items-start">
                    <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>This is for a sample address</span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-neutral-400 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>providername@gmail.com</span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-neutral-400 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>+91 9736672382 | +91 9763567389</span>
                  </div>

                  <div>
                    <p className="text-xs mb-1 text-gray-500 dark:text-neutral-400">Skills</p>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-500">Embroidery</Badge>
                      <Badge className="bg-yellow-500">Tailoring</Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-[#FF6900] text-[#FF6900] hover:bg-[#FFF1E6] dark:hover:bg-orange-950/40 cursor-pointer"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-[#FF6900] hover:bg-[#E05D00] text-white shadow-sm shadow-[#FF6900]/25">
            Assign Provider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
