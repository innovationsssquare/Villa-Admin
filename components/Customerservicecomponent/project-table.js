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
    <div className="w-full  mx-auto p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4 w-full">
        <Tabs
          defaultValue="all-works"
          className="w-full mx-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-auto grid-cols-5">
            <TabsTrigger
              value="all-works"
              className={`px-4 py-2 border-0 rounded-none ${
                activeTab === "all-works"
                  ? "border-b-2 border-[#106C83] font-medium text-[#106C83]"
                  : "text-gray-500"
              }`}
            >
              All Works
            </TabsTrigger>
            <TabsTrigger
              value="ongoing-projects"
              className={`px-4 py-2 border-0 rounded-none ${
                activeTab === "ongoing-projects"
                  ? "border-b-2 border-[#106C83] font-medium text-[#106C83]"
                  : "text-gray-500"
              }`}
            >
              Ongoing Projects
            </TabsTrigger>

            {activeTab === "all-works" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border rounded-md px-4 py-2 flex items-center gap-2 col-end-6"
                  >
                    {statusFilter}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("New")}>
                    New
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Quote Sent")}
                  >
                    Quote Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Quote Accepted")}
                  >
                    Quote Accepted
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Assigned Provider")}
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
                    className="border rounded-md px-4 py-2 flex items-center gap-2 col-end-6"
                  >
                    {statusFilter}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Completing soon")}
                  >
                    Completing soon
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Recently updated")}
                  >
                    Recently updated
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Oldest first")}
                  >
                    Oldest first
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TabsList>

          <TabsContent value="all-works" className={"w-full"}>
            <div className=" rounded-lg overflow-hidden mt-4">
              <ScrollArea className="h-full w-full">
                <Table>
                  <TableHeader className="bg-gray-100 border border-gray-300 ">
                    <TableRow>
                      <TableHead className="w-[200px]">PROJECT</TableHead>
                      <TableHead>CLIENT</TableHead>
                      <TableHead>REQUESTED DATE</TableHead>
                      <TableHead>REQUIREMENTS</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow
                        key={project.id}
                        className="border-t border-gray-200 h-14"
                      >
                        <TableCell className="font-medium">
                          {project.name}
                        </TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>{project.requestedDate}</TableCell>
                        <TableCell>
                          <ViewRequirementModal />
                        </TableCell>
                        <TableCell>
                          {project.status === "New" && (
                            <span className="text-[#34A853] font-medium">
                              New
                            </span>
                          )}
                          {project.status === "Quote Sent" && (
                            <span className="text-blue-500 font-medium">
                              Quote Sent
                            </span>
                          )}
                          {project.status === "Quote Accepted" && (
                            <span className="text-amber-500 font-medium">
                              Quote Accepted
                            </span>
                          )}
                          {project.status === "Assigned Provider" && (
                            <span className="text-purple-600 font-medium">
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
          className="text-[#106C83] hover:text-[#106C83] p-0 h-auto"
        >
          View Requirement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Customer Requirements
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">{`Buyer's Request`}</h3>
            <p className="text-sm text-gray-700">
             {` Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident.`}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Reference</h3>
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

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Estimated Timeline</h3>
            <p className="text-sm">By April 30th: 4 Weeks</p>
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Send Quote</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">
              Set Price & Estimated Completion
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Select>
                  <SelectTrigger>
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
                  <Input type="text" placeholder="Set Date" className="pr-10" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#106C83]">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Message (Optional)</h3>
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[150px]"
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
            />
          </div>

          <Button className="w-full bg-[#106C83] hover:bg-[#106C83]">
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
          className="bg-[#106C83] hover:bg-[#106C83] text-white w-32 "
          size="sm"
        >
          Assign Provider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
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
              <div key={provider} className="border rounded-md overflow-hidden">
                <div className="bg-red-100 p-2 relative">
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
                    <h4 className="font-medium">Provider Name</h4>
                    <div className="flex items-center text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>5.0 (23)</span>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="text-[#106C83] text-sm flex items-center hover:underline"
                  >
                    www.providername.com
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>

                  <div className="text-sm text-gray-600 flex items-start">
                    <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>This is for a sample address</span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>providername@gmail.com</span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>+91 9736672382 | +91 9763567389</span>
                  </div>

                  <div>
                    <p className="text-xs mb-1">Skills</p>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-500">Embroidery</Badge>
                      <Badge className="bg-yellow-500">Tailoring</Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-[#106C83] text-[#106C83] hover:bg-teal-50"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-[#106C83] hover:bg-[#106C83]">
            Assign Provider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
