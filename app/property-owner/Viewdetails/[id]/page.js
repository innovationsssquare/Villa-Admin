"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Shield,
  ShieldCheck,
  ShieldOff,
  FileText,
  FileCheck2,
  FileX2,
  Building2,
  CreditCard,
  Landmark,
  Banknote,
  User,
  Mail,
  Phone,
  ChevronLeft,
  Hash,
  BadgeIcon as IdCard,
  Check,
  X,
  Clock,
  AlertTriangle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchownerbyid } from "@/lib/Redux/Slices/ownerSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { verifyowner, updateDocumentStatus } from "@/lib/API/Owner/Owner";
import { useToast } from "@/components/ui/toast-provider";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function maskAccountNumber(n, visible = 4) {
  if (!n) return "";
  const v = Math.min(visible, n.length);
  const hidden = n.slice(0, -v).replace(/./g, "•");
  return `${hidden}${n.slice(-v)}`;
}

function CopyBtn({ value, label }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          // noop
        }
      }}
      aria-label={label ?? "Copy"}
      title={label ?? "Copy"}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

const PRESET_REASONS = [
  "Document image is blurry or illegible",
  "Name on document does not match profile",
  "Document is expired or invalid",
  "Incorrect document type uploaded",
  "Missing back side or signature page",
  "Bank account or IFSC code does not match passbook",
];

function DocStatusBadge({ status, reason }) {
  const s = String(status || "").toLowerCase();
  if (s === "approved" || s === "available") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 flex items-center gap-1 font-medium w-fit">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        Approved
      </Badge>
    );
  }
  if (s === "rejected" || s === "error") {
    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 flex items-center gap-1 font-medium w-fit">
          <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
          Rejected
        </Badge>
        {reason ? (
          <span
            className="text-[11px] text-rose-600 font-medium max-w-[220px] truncate"
            title={reason}
          >
            Reason: {reason}
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 flex items-center gap-1 font-medium w-fit">
      <Clock className="h-3.5 w-3.5 text-amber-600" />
      Pending Review
    </Badge>
  );
}

function DocTypeBadge({ type }) {
  const map = {
    agreement: "Agreement",
    adhaar: "Aadhaar",
    bank_passbook: "Bank Passbook",
  };
  return <Badge variant="secondary">{map[type] ?? type}</Badge>;
}

export default function OwnerDetailsClient() {
  const [showAcc, setShowAcc] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [rejectModalDoc, setRejectModalDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");

  const { addToast } = useToast();
  const params = useParams();
  const { id } = params;
  const { singleowner, singleloading, singleerror } = useSelector(
    (state) => state.owner
  );
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchownerbyid(id));
  }, [dispatch, id]);

  const docMap = useMemo(() => {
    const m = {};
    for (const d of singleowner?.documents ?? []) {
      const key = d.type;
      if (!m[key]) m[key] = [];
      m[key].push(d);
    }
    return m;
  }, [singleowner?.documents]);

  const getDocCheckStatus = (type) => {
    const docs = docMap[type] || [];
    if (!docs.length) {
      return { uploaded: false, approved: false, rejected: false, statusText: "Missing" };
    }
    const approved = docs.some(
      (d) => d.status === "approved" || d.status === "available"
    );
    if (approved) {
      return { uploaded: true, approved: true, rejected: false, statusText: "Approved" };
    }
    const rejected = docs.every(
      (d) => d.status === "rejected" || d.status === "error"
    );
    if (rejected) {
      return { uploaded: true, approved: false, rejected: true, statusText: "Rejected" };
    }
    return { uploaded: true, approved: false, rejected: false, statusText: "Pending Review" };
  };

  const adhaarStatus = getDocCheckStatus("adhaar");
  const passbookStatus = getDocCheckStatus("bank_passbook");
  const agreementStatus = getDocCheckStatus("agreement");

  const hasBankDetails =
    !!singleowner?.bankDetails?.accountNumber &&
    !!singleowner?.bankDetails?.ifscCode;

  const allRequiredApproved =
    adhaarStatus.approved && passbookStatus.approved && agreementStatus.approved;
  const canVerify = allRequiredApproved && hasBankDetails;

  const handleApproveDoc = async (doc) => {
    if (!doc?._id) return;
    setActionLoading((prev) => ({ ...prev, [doc._id]: "approving" }));
    try {
      const res = await updateDocumentStatus(id, doc._id, {
        status: "approved",
      });
      if (res?.success || res?.status !== false) {
        addToast({
          title: "Document Approved",
          description: `"${doc.title}" has been verified and approved.`,
          variant: "success",
        });
        dispatch(fetchownerbyid(id));
      } else {
        addToast({
          title: "Approval Failed",
          description: res?.message || "Could not approve document.",
          variant: "destructive",
        });
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message || "An error occurred while approving.",
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [doc._id]: null }));
    }
  };

  const handleOpenRejectModal = (doc) => {
    setRejectModalDoc(doc);
    setRejectionReason(doc.rejectionReason || "");
    setSelectedPreset("");
  };

  const handleConfirmReject = async () => {
    if (!rejectModalDoc?._id || !rejectionReason.trim()) {
      addToast({
        title: "Reason Required",
        description: "Please enter or select a reason for rejecting this document.",
        variant: "warning",
      });
      return;
    }
    const docId = rejectModalDoc._id;
    setActionLoading((prev) => ({ ...prev, [docId]: "rejecting" }));
    try {
      const res = await updateDocumentStatus(id, docId, {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });
      if (res?.success || res?.status !== false) {
        addToast({
          title: "Document Rejected",
          description: `"${rejectModalDoc.title}" marked as rejected. Host will see this reason in app.`,
          variant: "destructive",
        });
        setRejectModalDoc(null);
        setRejectionReason("");
        setSelectedPreset("");
        dispatch(fetchownerbyid(id));
      } else {
        addToast({
          title: "Rejection Failed",
          description: res?.message || "Could not reject document.",
          variant: "destructive",
        });
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message || "An error occurred while rejecting.",
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [docId]: null }));
    }
  };

  async function verifyOwner() {
    setVerifying(true);
    try {
      const nextVerified = !singleowner?.isVerified;
      const data = {
        isVerified: nextVerified,
      };

      const res = await verifyowner(id, data);
      if (res?.success || res?.status !== false) {
        addToast({
          title: nextVerified ? "Owner Verified" : "Owner Unverified",
          description: nextVerified
            ? "Host account has been verified successfully."
            : "Owner verification status was revoked.",
          variant: "success",
        });
        dispatch(fetchownerbyid(id));
      } else {
        addToast({
          title: "Verification failed",
          description: res?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      addToast({
        title: "Verification failed",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  }

  return (
    <>
      {singleloading ? (
        <div className="flex w-full h-screen justify-center items-center">
          <span className="loader2"></span>
        </div>
      ) : (
        <ScrollArea className="w-full mx-auto bg-white h-screen pb-14 px-4 pt-6 ">
          <div className="space-y-6">
          <div className=" flex items-center gap-2">
             <ChevronLeft
          className="h-5 w-5 mr-2 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Owner Details</h1>
          </div>
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={singleowner?.profilePic || "/placeholder.svg"}
                        alt={`${singleowner?.name} profile`}
                      />
                      <AvatarFallback>
                        {singleowner?.name?.slice(0, 2)?.toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">
                          {singleowner?.name}
                        </h1>
                        <Badge variant="outline" className="capitalize">
                          {singleowner?.role || "owner"}
                        </Badge>
                        {singleowner?.isVerified ? (
                          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-amber-100 text-amber-900 hover:bg-amber-100"
                          >
                            <ShieldOff className="mr-1 h-3.5 w-3.5" />
                            Not Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-4 w-4" />{" "}
                          {singleowner?.email || "No email"}
                        </span>
                        <Separator
                          orientation="vertical"
                          className="hidden h-4 md:block"
                        />
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-4 w-4" />{" "}
                          {singleowner?.bankDetails?.phone || "No phone"}
                        </span>
                        <Separator
                          orientation="vertical"
                          className="hidden h-4 md:block"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {formatDate(singleowner?.createdAt)} · Updated:{" "}
                        {formatDate(singleowner?.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row">
                    <Button
                      className={cn(
                        "gap-2 font-medium shadow-sm transition-all",
                        singleowner?.isVerified
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : canVerify
                          ? "bg-[#FF6900] hover:bg-[#0e5b6e] text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                      disabled={
                        (!canVerify && !singleowner?.isVerified) || verifying
                      }
                      onClick={verifyOwner}
                    >
                      {singleowner?.isVerified ? (
                        <>
                          <ShieldCheck className="h-4 w-4" /> Verified (Click to Revoke)
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />{" "}
                          {verifying ? "Verifying..." : "Verify Owner"}
                        </>
                      )}
                    </Button>
                    {/* <a href="#documents">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" /> View Documents
                  </Button>
                </a> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status badges */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4" />
                    Bank details
                  </div>
                  {singleowner?.bankDetails ? (
                    <Badge className="bg-emerald-600 text-white">Updated</Badge>
                  ) : (
                    <Badge variant="secondary">Not Updated</Badge>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Documents
                  </div>
                  {singleowner?.documentsUpdated ? (
                    <Badge className="bg-emerald-600 text-white">Updated</Badge>
                  ) : (
                    <Badge variant="secondary">Not Updated</Badge>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4" />
                    Properties
                  </div>
                  <Badge variant="secondary">
                    {singleowner?.properties?.length || 0}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Verification checklist */}
            {!singleowner?.isVerified && (
              <Alert className="border-amber-200 bg-amber-50/50">
                <AlertTitle className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Shield className="h-4 w-4 text-amber-600" />
                  Verification Checklist
                </AlertTitle>
                <AlertDescription className="text-amber-800 text-xs mt-1">
                  Each required document must be Approved individually before final owner verification can be completed.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Verification Requirements</CardTitle>
                <CardDescription>
                  All required documents must be Approved individually before verifying owner.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <CheckItem
                  ok={adhaarStatus.approved}
                  label="Aadhaar Document"
                  statusText={adhaarStatus.statusText}
                  isRejected={adhaarStatus.rejected}
                  required
                />
                <CheckItem
                  ok={passbookStatus.approved}
                  label="Bank Passbook"
                  statusText={passbookStatus.statusText}
                  isRejected={passbookStatus.rejected}
                  required
                />
                <CheckItem
                  ok={agreementStatus.approved}
                  label="Owner Agreement"
                  statusText={agreementStatus.statusText}
                  isRejected={agreementStatus.rejected}
                  required
                />
                <CheckItem
                  ok={hasBankDetails}
                  label="Bank details present"
                  statusText={hasBankDetails ? "Provided" : "Missing"}
                />
                <CheckItem
                  ok={!!singleowner?.email}
                  label="Email provided"
                  statusText={singleowner?.email ? "Provided" : "Missing"}
                />
                <CheckItem
                  ok={!!singleowner?.bankDetails?.phone || !!singleowner?.phone}
                  label="Phone provided"
                  statusText={singleowner?.bankDetails?.phone || singleowner?.phone ? "Provided" : "Missing"}
                />
              </CardContent>
            </Card>

            {/* Bank details */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Bank Details
                  </CardTitle>
                  <CardDescription>
                    Information provided by the owner.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Account holder name"
                  value={singleowner?.bankDetails?.accountHolderName}
                  icon={<User className="h-4 w-4" />}
                />
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Account number
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium font-mono">
                      {showAcc
                        ? singleowner?.bankDetails?.accountNumber
                        : maskAccountNumber(
                            singleowner?.bankDetails?.accountNumber || ""
                          )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAcc((s) => !s)}
                    >
                      {showAcc ? "Hide" : "Show"}
                    </Button>
                    <CopyBtn
                      value={singleowner?.bankDetails?.accountNumber || ""}
                      label="Copy account number"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">IFSC code</div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium font-mono">
                      {singleowner?.bankDetails?.ifscCode?.trim()}
                    </div>
                    <CopyBtn
                      value={singleowner?.bankDetails?.ifscCode?.trim() || ""}
                      label="Copy IFSC"
                    />
                  </div>
                </div>
                <Field
                  label="Bank name"
                  value={singleowner?.bankDetails?.bankName}
                  icon={<Banknote className="h-4 w-4" />}
                />
                <Field
                  label="Branch"
                  value={singleowner?.bankDetails?.branchName}
                />
                <Field
                  label="Account type"
                  value={singleowner?.bankDetails?.accountType}
                />
                <div className="space-y-1 sm:col-span-2">
                  <div className="text-xs text-muted-foreground">UPI ID</div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">
                      {singleowner?.bankDetails?.upiId}
                    </div>
                    <CopyBtn
                      value={singleowner?.bankDetails?.upiId || ""}
                      label="Copy UPI"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Properties
                </CardTitle>
                <CardDescription>
                  References associated with this owner.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {(singleowner?.properties || []).map((p) => (
                  <Badge
                    key={p._id}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <span className="capitalize">{p.refType}</span>
                    <span className="font-mono text-xs">
                      {p.refId.slice(0, 6)}…{p.refId.slice(-4)}
                    </span>
                  </Badge>
                ))}
                {!singleowner?.properties?.length && (
                  <div className="text-sm text-muted-foreground">
                    No properties
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card id="documents">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
                <CardDescription>
                  Review and download owner documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="flex flex-wrap">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="agreement">Agreement</TabsTrigger>
                    <TabsTrigger value="adhaar">Aadhaar</TabsTrigger>
                    <TabsTrigger value="bank_passbook">
                      Bank Passbook
                    </TabsTrigger>
                  </TabsList>
                  {["all", "agreement", "adhaar", "bank_passbook"].map(
                    (tab) => {
                      const docs =
                        tab === "all"
                          ? singleowner?.documents || []
                          : (singleowner?.documents || []).filter(
                              (d) => d.type === tab
                            );
                      return (
                        <TabsContent key={tab} value={tab}>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Size</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {docs.map((d) => (
                                  <TableRow key={d._id}>
                                    <TableCell className="whitespace-nowrap">
                                      <DocTypeBadge type={d.type} />
                                    </TableCell>
                                    <TableCell className="max-w-[240px]">
                                      <div className="line-clamp-1 font-medium">
                                        {d.title}
                                      </div>
                                      <div className="line-clamp-1 text-xs text-muted-foreground">
                                        {d.description}
                                      </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                      {formatDate(d.date)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                      {d.size}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                      <DocStatusBadge
                                        status={d.status}
                                        reason={d.rejectionReason}
                                      />
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-2.5 gap-1.5 text-xs"
                                          onClick={() => setPreviewDoc(d)}
                                        >
                                          <Eye className="h-3.5 w-3.5" /> View
                                        </Button>
                                        <a
                                          href={d.downloadUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2.5 gap-1.5 text-xs"
                                          >
                                            <Download className="h-3.5 w-3.5" />
                                          </Button>
                                        </a>
                                        <Button
                                          size="sm"
                                          className={cn(
                                            "h-8 px-3 gap-1.5 text-xs font-medium transition-all",
                                            d.status === "approved" ||
                                              d.status === "available"
                                              ? "bg-emerald-600/90 text-white cursor-default hover:bg-emerald-600/90"
                                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                          )}
                                          disabled={
                                            actionLoading[d._id] ||
                                            d.status === "approved" ||
                                            d.status === "available"
                                          }
                                          onClick={() => handleApproveDoc(d)}
                                        >
                                          {actionLoading[d._id] ===
                                          "approving" ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <Check className="h-3.5 w-3.5" />
                                          )}
                                          {d.status === "approved" ||
                                          d.status === "available"
                                            ? "Approved"
                                            : "Approve"}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={cn(
                                            "h-8 px-2.5 gap-1.5 text-xs font-medium border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-all",
                                            d.status === "rejected" ||
                                              d.status === "error"
                                              ? "bg-rose-50 border-rose-300"
                                              : ""
                                          )}
                                          disabled={!!actionLoading[d._id]}
                                          onClick={() =>
                                            handleOpenRejectModal(d)
                                          }
                                        >
                                          {actionLoading[d._id] ===
                                          "rejecting" ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                                          ) : (
                                            <X className="h-3.5 w-3.5 text-rose-600" />
                                          )}
                                          {d.status === "rejected" ||
                                          d.status === "error"
                                            ? "Change Reason"
                                            : "Reject"}
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {!docs.length && (
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      className="text-center text-sm text-muted-foreground py-6"
                                    >
                                      No documents uploaded in this category.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                      );
                    }
                  )}
                </Tabs>
              </CardContent>
            </Card>

            {/* Reject Document Reason Dialog */}
            <Dialog
              open={!!rejectModalDoc}
              onOpenChange={(o) => !o && setRejectModalDoc(null)}
            >
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-rose-700">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                    Reject Document
                  </DialogTitle>
                  <DialogDescription>
                    Provide the rejection reason for this document. The property owner will see this notification in their mobile app to re-upload.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Selected document summary */}
                  <div className="p-3 bg-muted/60 rounded-lg border flex items-center justify-between text-sm">
                    <div>
                      <div className="font-semibold">{rejectModalDoc?.title}</div>
                      <div className="text-xs text-muted-foreground capitalize mt-0.5">
                        Type: {rejectModalDoc?.type} · Size: {rejectModalDoc?.size}
                      </div>
                    </div>
                    <DocTypeBadge type={rejectModalDoc?.type} />
                  </div>

                  {/* Preset quick reasons */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Quick Preset Reasons
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_REASONS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setSelectedPreset(preset);
                            setRejectionReason(preset);
                          }}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-full border transition-all text-left",
                            selectedPreset === preset
                              ? "bg-rose-500 text-white border-rose-600 font-medium shadow-xs"
                              : "bg-background hover:bg-muted text-foreground border-border"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed custom note */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Rejection Reason / Guidance for Owner *
                    </label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => {
                        setRejectionReason(e.target.value);
                        if (selectedPreset && e.target.value !== selectedPreset) {
                          setSelectedPreset("");
                        }
                      }}
                      placeholder="Explain why this document was rejected..."
                      rows={3}
                      className="resize-none text-sm"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setRejectModalDoc(null)}
                    disabled={!!actionLoading[rejectModalDoc?._id]}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
                    onClick={handleConfirmReject}
                    disabled={
                      !rejectionReason.trim() ||
                      !!actionLoading[rejectModalDoc?._id]
                    }
                  >
                    {actionLoading[rejectModalDoc?._id] === "rejecting" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Confirm Rejection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Document Preview Dialog */}
            <Dialog
              open={!!previewDoc}
              onOpenChange={(o) => !o && setPreviewDoc(null)}
            >
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between gap-2 pr-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>{previewDoc?.title}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        ({previewDoc?.size})
                      </span>
                    </div>
                    {previewDoc && <DocTypeBadge type={previewDoc?.type} />}
                  </DialogTitle>
                </DialogHeader>
                <div className="h-[70vh] flex items-center justify-center overflow-auto bg-muted/20 rounded-md border p-2">
                  {previewDoc ? (
                    previewDoc.downloadUrl?.match(
                      /\.(jpeg|jpg|png|webp|avif)($|\?)/i
                    ) || previewDoc.downloadUrl?.includes("/image/upload/") ? (
                      <img
                        src={previewDoc.downloadUrl}
                        alt={previewDoc.title}
                        className="max-h-full max-w-full object-contain rounded-md shadow-sm"
                      />
                    ) : (
                      <iframe
                        src={previewDoc.downloadUrl}
                        className="h-full w-full rounded-md border bg-white"
                        title={previewDoc.title}
                      />
                    )
                  ) : null}
                </div>
                <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
                  <div className="text-xs text-muted-foreground">
                    Uploaded: {formatDate(previewDoc?.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={previewDoc?.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Download File
                      </Button>
                    </a>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewDoc(null)}
                    >
                      Close
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </ScrollArea>
      )}
    </>
  );
}

function Field({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        <div className="font-medium">{value || "—"}</div>
      </div>
    </div>
  );
}

function CheckItem({ ok, label, statusText, isRejected, required = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border p-3 transition-colors",
        ok
          ? "border-emerald-200 bg-emerald-50/40"
          : isRejected
          ? "border-rose-200 bg-rose-50/40"
          : required
          ? "border-amber-200 bg-amber-50/30"
          : "border-border"
      )}
    >
      <div className="flex items-center gap-2.5">
        {ok ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
        ) : isRejected ? (
          <FileX2 className="h-5 w-5 text-rose-600 shrink-0" />
        ) : required ? (
          <Clock className="h-5 w-5 text-amber-600 shrink-0" />
        ) : (
          <FileCheck2 className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
        <span
          className={cn(
            "text-sm",
            ok
              ? "font-medium text-emerald-950"
              : isRejected
              ? "font-medium text-rose-950"
              : !ok && required
              ? "font-medium"
              : ""
          )}
        >
          {label}
        </span>
      </div>
      <Badge
        variant={ok ? "default" : "secondary"}
        className={cn(
          "text-xs font-medium capitalize",
          ok
            ? "bg-emerald-600 text-white hover:bg-emerald-600"
            : isRejected
            ? "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100"
            : required
            ? "bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-100"
            : ""
        )}
      >
        {statusText || (ok ? "OK" : required ? "Required" : "Optional")}
      </Badge>
    </div>
  );
}
