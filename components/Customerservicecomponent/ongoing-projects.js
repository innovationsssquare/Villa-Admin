"use client"

import { useState } from "react"
import { ChevronDown, Calendar, Briefcase, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"


export default function OngoingProjects() {
  const [statusFilter, setStatusFilter] = useState("Completing soon")
  const [activeTab, setActiveTab] = useState("ongoing-projects")

  const projects = [
    {
      id: "projectid789",
      client: "John Smith",
      service: "Embroidery",
      provider: "Service Provider Name",
      dueDate: "April 5, 2025",
      progress: 90,
    },
    {
      id: "projectid789",
      client: "John Smith",
      service: "Embroidery",
      provider: "Service Provider Name",
      dueDate: "April 5, 2025",
      progress: 90,
    },
    {
      id: "projectid789",
      client: "John Smith",
      service: "Embroidery",
      provider: "Service Provider Name",
      dueDate: "April 5, 2025",
      progress: 90,
    },
    {
      id: "projectid789",
      client: "John Smith",
      service: "Embroidery",
      provider: "Service Provider Name",
      dueDate: "April 5, 2025",
      progress: 90,
    },
  ]

  return (
    <div className="w-full mx-auto p-4 bg-white  ">
    

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="border rounded-lg p-5 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-700 font-medium">#{project.id}</h3>
          <p className="text-gray-500 text-sm">Client: {project.client}</p>
        </div>
        <div className="bg-[#FFB300] text-white text-xs font-medium px-3 py-1 rounded-md">On going</div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center text-sm">
          <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-700">Service: </span>
          <span className="text-[#106C83] ml-1 font-medium">{project.service}</span>
        </div>

        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-700">Assigned to: </span>
          <span className="text-[#106C83] ml-1 font-medium">{project.provider}</span>
        </div>

        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-700">Due: </span>
          <span className="text-[#106C83] ml-1 font-medium">{project.dueDate}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Progress</span>
          <span className="text-gray-500">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2 bg-gray-100" indicatorClassName="bg-[#106C83]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-[#106C83] hover:bg-[#106C83] text-white">View</Button>
        <Button variant="outline" className="border-[#106C83] text-[#106C83] hover:bg-teal-50">
          Requirements
        </Button>
      </div>
    </div>
  )
}
