"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Building, CheckCircle2, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent,DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import dashiconsstore from "@/public/Asset/dashiconsstore.png"



export function DocumentApprovalDialog({
  businessName,
  status,
  progress,
  documents: initialDocuments,
  open,
  onOpenChange,
  onApproveDocument,
  onRejectDocument,
  onBlacklist,
  onApproveProfile,
}) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0)
  const selectedDocument = documents[selectedDocumentIndex]

  const handleApproveDocument = () => {
    const updatedDocuments = [...documents]
    updatedDocuments[selectedDocumentIndex] = {
      ...updatedDocuments[selectedDocumentIndex],
      status: "approved",
    }
    setDocuments(updatedDocuments)
    onApproveDocument(selectedDocument.id)
  }

  const handleRejectDocument = () => {
    const updatedDocuments = [...documents]
    updatedDocuments[selectedDocumentIndex] = {
      ...updatedDocuments[selectedDocumentIndex],
      status: "rejected",
    }
    setDocuments(updatedDocuments)
    onRejectDocument(selectedDocument.id)
  }

  const getApprovedCount = () => {
    return documents.filter((doc) => doc.status === "approved").length
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTitle></DialogTitle>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
       

        <div className="flex flex-col h-[90vh] md:h-[90vh]">
          {/* Header */}
          <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex bg-[#106C83] items-center p-2 rounded-xl gap-4">
              <div className="bg-white text-[#106C83] font-bold rounded-md p-2 flex items-center justify-center">
                <span className="text-2xl">
                  {getApprovedCount()}/{documents.length}
                </span>
              </div>
              <div className="text-sm text-white font-bold">Documents Submitted</div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-[#EDC5C5] p-2 rounded">
                  <Image src={dashiconsstore} className="object-contain" alt="dashiconsstore"  />
                </div>
                <span className="font-medium">{businessName}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2 px-3 py-1 rounded-full font-medium",
                    status === "pending" && "bg-[#FFB300] text-white border-[#FFB300]",
                    status === "approved" && "bg-green-500 text-white border-green-500",
                    status === "rejected" && "bg-red-500 text-white border-red-500",
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>

              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  className="bg-[#333333] text-white hover:bg-zinc-700 hover:text-white"
                  onClick={onBlacklist}
                >
                  + Add to Black List
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={onApproveProfile}
                  disabled={getApprovedCount() !== documents.length}
                >
                  Approve Profile for Listing
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r hidden md:block">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {documents.map((doc, index) => (
                    <div
                      key={doc.id}
                      className={cn(
                        "border rounded-md overflow-hidden cursor-pointer transition-all relative",
                        selectedDocumentIndex === index
                          ? "ring-2 ring-emerald-500"
                          : "hover:ring-1 hover:ring-gray-300",
                      )}
                      onClick={() => setSelectedDocumentIndex(index)}
                    >
                      <div className="relative h-40">
                        <Image src={doc.imageUrl} alt={doc.name} fill className="object-cover" />
                        {doc.status !== "pending" && (
                          <div
                            className={cn(
                              "absolute inset-0 flex items-center justify-center bg-black/30",
                              doc.status === "approved" ? "bg-green-500/30" : "bg-red-500/30",
                            )}
                          >
                            {doc.status === "approved" ? (
                              <CheckCircle2 className="h-10 w-10 text-white" />
                            ) : (
                              <XCircle className="h-10 w-10 text-white" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-sm font-medium flex justify-between items-center">
                        <span>{doc.name}</span>
                        {doc.status === "approved" && <Badge className="bg-green-500">Approved</Badge>}
                        {doc.status === "rejected" && <Badge className="bg-red-500">Rejected</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Document preview */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 h-96">
                <div className="p-4">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="relative h-[500px] w-full">
                      <Image
                        src={selectedDocument.previewUrl}
                        alt={selectedDocument.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    This will help in case the want to mention and provide more information.
                  </div>
                </div>
              </ScrollArea>

              {/* Mobile document selector */}
              <div className="md:hidden border-t">
                <ScrollArea className="h-24" orientation="horizontal">
                  <div className="flex p-2 gap-2">
                    {documents.map((doc, index) => (
                      <div
                        key={doc.id}
                        className={cn(
                          "border rounded-md overflow-hidden cursor-pointer flex-shrink-0 w-20 relative",
                          selectedDocumentIndex === index ? "ring-2 ring-emerald-500" : "",
                        )}
                        onClick={() => setSelectedDocumentIndex(index)}
                      >
                        <div className="relative h-16">
                          <Image
                            src={doc.imageUrl || "/placeholder.svg"}
                            alt={doc.name}
                            fill
                            className="object-cover"
                          />
                          {doc.status !== "pending" && (
                            <div
                              className={cn(
                                "absolute inset-0 flex items-center justify-center",
                                doc.status === "approved" ? "bg-green-500/30" : "bg-red-500/30",
                              )}
                            >
                              {doc.status === "approved" ? (
                                <CheckCircle2 className="h-6 w-6 text-white" />
                              ) : (
                                <XCircle className="h-6 w-6 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Action buttons */}
              <div className="p-2 flex justify-end gap-2 border-t">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleApproveDocument}
                  disabled={selectedDocument.status !== "pending"}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectDocument}
                  disabled={selectedDocument.status !== "pending"}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
