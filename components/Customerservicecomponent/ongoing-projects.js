"use client";

import { useState } from "react";
import { ChevronDown, Calendar, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

export default function OngoingProjects() {
  const [statusFilter, setStatusFilter] = useState("Completing soon");
  const [activeTab, setActiveTab] = useState("ongoing-projects");

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
  ];

  return (
    <div className="w-full mx-auto p-4 bg-white dark:bg-[#121215] transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-xl p-5 relative shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-900 dark:text-neutral-100 font-semibold">#{project.id}</h3>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Client: {project.client}</p>
        </div>
        <div className="bg-[#FFB300] text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm">On going</div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center text-sm">
          <Briefcase className="h-4 w-4 mr-2 text-gray-400 dark:text-neutral-500" />
          <span className="text-gray-600 dark:text-neutral-400">Service: </span>
          <span className="text-[#FF6900] ml-1 font-medium">{project.service}</span>
        </div>

        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-gray-400 dark:text-neutral-500" />
          <span className="text-gray-600 dark:text-neutral-400">Assigned to: </span>
          <span className="text-[#FF6900] ml-1 font-medium">{project.provider}</span>
        </div>

        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-neutral-500" />
          <span className="text-gray-600 dark:text-neutral-400">Due: </span>
          <span className="text-[#FF6900] ml-1 font-medium">{project.dueDate}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700 dark:text-neutral-300 font-medium">Progress</span>
          <span className="text-gray-500 dark:text-neutral-400 font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2 bg-gray-100 dark:bg-neutral-800" indicatorClassName="bg-[#FF6900]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-[#FF6900] hover:bg-[#E05D00] text-white shadow-sm shadow-[#FF6900]/25 cursor-pointer">View</Button>
        <Button variant="outline" className="border-[#FF6900] text-[#FF6900] hover:bg-[#FFF1E6] dark:hover:bg-orange-950/40 cursor-pointer">
          Requirements
        </Button>
      </div>
    </div>
  );
}
