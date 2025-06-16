"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DocumentApprovalDialog } from "@/components/Productsellercomponents/document-approval-dialog.";
import Certificate from "@/public/Asset/Certificate.png"
// Updated sample documents with status
const initialDocuments = [
  {
    id: "1",
    name: "Sample Certificate",
    imageUrl: Certificate,
    previewUrl: "/placeholder.svg?height=800&width=600",
    status: "pending",
  },
  {
    id: "2",
    name: "Sample Certificate",
    imageUrl: Certificate,
    previewUrl: "/placeholder.svg?height=800&width=600",
    status: "pending",
  },
  {
    id: "3",
    name: "Business License",
    imageUrl: Certificate,
    previewUrl: "/placeholder.svg?height=800&width=600",
    status: "pending",
  },
  {
    id: "4",
    name: "Tax Document",
    imageUrl: Certificate,
    previewUrl: "/placeholder.svg?height=800&width=600",
    status: "pending",
  },
];

export default function DocumentApprovalPage({data}) {
  console.log(data)
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState(initialDocuments);

  const handleApproveDocument = (documentId) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, status: "approved" } : doc
      )
    );
  };

  const handleRejectDocument = (documentId) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, status: "rejected" } : doc
      )
    );
  };

  const handleBlacklist = () => {};

  const handleApproveProfile = () => {
    setOpen(false);
    setDocuments(initialDocuments);
  };

  return (
    <div className="container flex items-center justify-center">
      <Button variant={"outline"} onClick={() => setOpen(true)}>
        <span href="#" className="text-[#106C83] hover:underline font-medium">
          View Details
        </span>{" "}
      </Button>

      <DocumentApprovalDialog
        businessName="Business Name"
        status="pending"
        progress={{
          current: documents.filter((d) => d.status === "approved").length,
          total: documents.length,
        }}
        documents={documents}
        open={open}
        onOpenChange={setOpen}
        onApproveDocument={handleApproveDocument}
        onRejectDocument={handleRejectDocument}
        onBlacklist={handleBlacklist}
        onApproveProfile={handleApproveProfile}
      />
    </div>
  );
}
