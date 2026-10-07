"use client";

import { useEffect, useMemo, useState } from "react";
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
  Check,
  X,
  Clock,
  AlertTriangle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Wallet,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchownerbyid } from "@/lib/Redux/Slices/ownerSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { verifyowner, updateDocumentStatus } from "@/lib/API/Owner/Owner";
import { useToast } from "@/components/ui/toast-provider";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      addToast({
        title: "Copied to Clipboard",
        description: value,
        variant: "default",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-7 w-7 rounded-lg border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      onClick={handleCopy}
      aria-label={label ?? "Copy"}
      title={label ?? "Copy"}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
      )}
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
      <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/50 flex items-center gap-1.5 font-medium w-fit text-xs px-2.5 py-0.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        Approved
      </Badge>
    );
  }
  if (s === "rejected" || s === "error") {
    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100/50 flex items-center gap-1.5 font-medium w-fit text-xs px-2.5 py-0.5">
          <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
          Rejected
        </Badge>
        {reason ? (
          <span
            className="text-[11px] text-rose-600 dark:text-rose-400 font-medium max-w-[200px] truncate"
            title={reason}
          >
            {reason}
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100/50 flex items-center gap-1.5 font-medium w-fit text-xs px-2.5 py-0.5">
      <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      Pending Review
    </Badge>
  );
}

function DocTypeBadge({ type }) {
  const map = {
    agreement: { label: "Partnership Agreement", color: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60" },
    adhaar: { label: "Aadhaar Card", color: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60" },
    bank_passbook: { label: "Bank Passbook", color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60" },
  };
  const config = map[type] || { label: type || "Document", color: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700" };
  return (
    <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-md border", config.color)}>
      {config.label}
    </span>
  );
}

export default function OwnerDetailsClient() {
  const [showAcc, setShowAcc] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [rejectModalDoc, setRejectModalDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { addToast } = useToast();
  const params = useParams();
  const { id } = params;
  const { singleowner, singleloading } = useSelector(
    (state) => state.owner
  );
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchownerbyid(id));
    }
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

  // Calculate KYC Completion percentage
  const kycRequirements = [
    { label: "Aadhaar Document", met: adhaarStatus.approved },
    { label: "Bank Passbook", met: passbookStatus.approved },
    { label: "Owner Agreement", met: agreementStatus.approved },
    { label: "Bank Account & IFSC", met: hasBankDetails },
  ];
  const completedCount = kycRequirements.filter((r) => r.met).length;
  const kycPercent = Math.round((completedCount / kycRequirements.length) * 100);

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
        if (previewDoc?._id === doc._id) {
          setPreviewDoc({ ...previewDoc, status: "approved" });
        }
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
          description: `"${rejectModalDoc.title}" marked as rejected. Host has been notified.`,
          variant: "destructive",
        });
        setRejectModalDoc(null);
        setRejectionReason("");
        setSelectedPreset("");
        dispatch(fetchownerbyid(id));
        if (previewDoc?._id === docId) {
          setPreviewDoc({ ...previewDoc, status: "rejected", rejectionReason: rejectionReason.trim() });
        }
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

  const handleToggleVerification = async () => {
    if (singleowner?.isVerified) {
      // Opening confirmation dialog before revoking
      setShowRevokeDialog(true);
      return;
    }
    await executeVerification(true);
  };

  const executeVerification = async (targetVerified) => {
    setVerifying(true);
    try {
      const data = { isVerified: targetVerified };
      const res = await verifyowner(id, data);
      if (res?.success || res?.status !== false) {
        addToast({
          title: targetVerified ? "Owner Verified" : "Verification Revoked",
          description: targetVerified
            ? "Host account has been verified successfully."
            : "Owner verification status was revoked.",
          variant: "success",
        });
        setShowRevokeDialog(false);
        dispatch(fetchownerbyid(id));
      } else {
        addToast({
          title: "Action Failed",
          description: res?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      addToast({
        title: "Action Failed",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const allDocuments = singleowner?.documents || [];
  const approvedDocsCount = allDocuments.filter(
    (d) => d.status === "approved" || d.status === "available"
  ).length;

  return (
    <>
      {singleloading ? (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] justify-center items-center gap-3 bg-neutral-50 dark:bg-[#09090B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6900]" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Loading Owner Details...
          </p>
        </div>
      ) : (
        <ScrollArea className="w-full h-[calc(100vh-64px)] bg-neutral-50/70 dark:bg-[#09090B] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                  className="h-8 px-2.5 gap-1.5 rounded-lg border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
                <span
                  onClick={() => router.push("/property-owner")}
                  className="hover:underline cursor-pointer"
                >
                  Property Owners
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
                <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[200px]">
                  {singleowner?.name || "Owner Profile"}
                </span>
              </div>

              {/* Quick Reload Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(fetchownerbyid(id))}
                className="h-8 px-3 gap-1.5 rounded-lg border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-neutral-700 dark:text-neutral-300 hover:text-[#FF6900] transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh Data</span>
              </Button>
            </div>

            {/* Profile Hero Header Card */}
            <div className="relative rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] p-6 shadow-sm overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-[#FF6900]/10 via-transparent to-transparent pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                {/* Left Profile Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative shrink-0">
                    <Avatar className="h-20 w-20 rounded-2xl ring-2 ring-neutral-200 dark:ring-neutral-700 shadow-md">
                      <AvatarImage
                        src={singleowner?.profilePic || "/placeholder.svg"}
                        alt={singleowner?.name || "Owner"}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-2xl text-lg font-bold bg-[#FF6900]/10 text-[#FF6900]">
                        {singleowner?.name?.slice(0, 2)?.toUpperCase() || "OW"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Status Dot */}
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white dark:border-[#121215]",
                        singleowner?.isVerified
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                      )}
                      title={singleowner?.isVerified ? "Verified" : "Pending Verification"}
                    >
                      {singleowner?.isVerified ? (
                        <Check className="h-3 w-3 stroke-[3]" />
                      ) : (
                        <Clock className="h-3 w-3 stroke-[3]" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {singleowner?.name || "Unnamed Host"}
                      </h1>
                      <Badge
                        variant="outline"
                        className="capitalize border-neutral-300 dark:border-neutral-700 font-semibold text-xs text-neutral-700 dark:text-neutral-300"
                      >
                        {singleowner?.role || "Property Owner"}
                      </Badge>
                      {singleowner?.isVerified ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent gap-1 font-semibold text-xs">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified Host
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 gap-1 font-semibold text-xs">
                          <ShieldOff className="h-3.5 w-3.5" />
                          Unverified
                        </Badge>
                      )}
                    </div>

                    {/* Contact details row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{singleowner?.email || "No email"}</span>
                        {singleowner?.email && (
                          <CopyBtn value={singleowner?.email} label="Copy email" />
                        )}
                      </div>

                      <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>

                      <div className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{singleowner?.bankDetails?.phone || singleowner?.phone || "No phone"}</span>
                        {(singleowner?.bankDetails?.phone || singleowner?.phone) && (
                          <CopyBtn
                            value={singleowner?.bankDetails?.phone || singleowner?.phone}
                            label="Copy phone"
                          />
                        )}
                      </div>

                      <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>

                      <div className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-500">
                        <span>ID: {singleowner?._id ? `${singleowner._id.slice(0, 8)}...` : id}</span>
                        <CopyBtn value={singleowner?._id || id} label="Copy ID" />
                      </div>
                    </div>

                    {/* Timestamp info */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 pt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {formatDate(singleowner?.createdAt)}</span>
                      <span>·</span>
                      <span>Updated {formatDate(singleowner?.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Button
                    className={cn(
                      "h-10 px-5 rounded-xl gap-2 font-semibold text-sm transition-all shadow-sm cursor-pointer",
                      singleowner?.isVerified
                        ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                        : canVerify
                        ? "bg-gradient-to-r from-[#FF6900] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] text-white shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700 cursor-not-allowed"
                    )}
                    disabled={(!canVerify && !singleowner?.isVerified) || verifying}
                    onClick={handleToggleVerification}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating Status...</span>
                      </>
                    ) : singleowner?.isVerified ? (
                      <>
                        <ShieldOff className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        <span>Revoke Verification</span>
                      </>
                    ) : canVerify ? (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Verify Host Account</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        <span>Complete KYC to Verify</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* 4 KPI Metric Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1: Verification Status */}
              <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Account Status</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {singleowner?.isVerified ? "Verified Host" : "Pending Approval"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {singleowner?.isVerified ? "Active on platform" : "Requires review"}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    singleowner?.isVerified
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {singleowner?.isVerified ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : (
                    <Clock className="h-6 w-6" />
                  )}
                </div>
              </div>

              {/* Stat 2: KYC Documents */}
              <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">KYC Documents</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {approvedDocsCount} / {allDocuments.length} Approved
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {allRequiredApproved ? "All required approved" : "Some docs pending"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FileCheck2 className="h-6 w-6" />
                </div>
              </div>

              {/* Stat 3: Bank & Payouts */}
              <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Payout Details</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {hasBankDetails ? "Configured" : "Missing Details"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[140px]">
                    {singleowner?.bankDetails?.bankName || "No bank on file"}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    hasBankDetails
                      ? "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
                      : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  )}
                >
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              {/* Stat 4: Linked Properties */}
              <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Linked Properties</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {singleowner?.properties?.length || 0} Stays
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">Assigned to this host</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#FF6900]">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Verification Checklist Card */}
            <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#FF6900]" />
                    Host Verification Checklist
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    All 3 essential KYC documents and bank details must be verified before account activation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {completedCount} of {kycRequirements.length} Ready ({kycPercent}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <Progress value={kycPercent} className="h-2 bg-neutral-100 dark:bg-neutral-800" />

              {/* Requirements Checklist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <CheckItem
                  ok={adhaarStatus.approved}
                  label="Aadhaar Card"
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
                  label="Bank & IFSC Code"
                  statusText={hasBankDetails ? "Provided" : "Missing"}
                  isRejected={false}
                  required
                />
              </div>
            </div>

            {/* Main Tabs Container */}
            <Tabs defaultValue="documents" className="w-full space-y-4">
              <TabsList className="bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 inline-flex">
                <TabsTrigger
                  value="documents"
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-[#121215] data-[state=active]:text-[#FF6900] data-[state=active]:shadow-xs px-3.5 py-1.5 gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Documents ({allDocuments.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="bank"
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-[#121215] data-[state=active]:text-[#FF6900] data-[state=active]:shadow-xs px-3.5 py-1.5 gap-1.5"
                >
                  <Landmark className="h-3.5 w-3.5" />
                  <span>Bank & Payouts</span>
                </TabsTrigger>
                <TabsTrigger
                  value="properties"
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-[#121215] data-[state=active]:text-[#FF6900] data-[state=active]:shadow-xs px-3.5 py-1.5 gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Properties ({singleowner?.properties?.length || 0})</span>
                </TabsTrigger>
              </TabsList>

              {/* ========================================================================= */}
              {/* TAB 1: KYC DOCUMENTS                                                      */}
              {/* ========================================================================= */}
              <TabsContent value="documents" className="space-y-4 outline-none">
                <Card className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm">
                  <CardHeader className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div>
                      <CardTitle className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-[#FF6900]" />
                        Owner Documents & KYC Records
                      </CardTitle>
                      <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Verify uploaded identity, legal agreements, and bank proof documents.
                      </CardDescription>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: "all", label: "All" },
                        { id: "agreement", label: "Agreement" },
                        { id: "adhaar", label: "Aadhaar" },
                        { id: "bank_passbook", label: "Bank Passbook" },
                      ].map((f) => {
                        const count =
                          f.id === "all"
                            ? allDocuments.length
                            : (docMap[f.id] || []).length;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setActiveTab(f.id)}
                            className={cn(
                              "text-xs px-3 py-1 rounded-lg font-medium transition-all cursor-pointer border",
                              activeTab === f.id
                                ? "bg-[#FF6900] text-white border-[#FF6900] shadow-xs"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            )}
                          >
                            {f.label} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/40">
                          <TableRow className="border-neutral-200/80 dark:border-neutral-800 hover:bg-transparent">
                            <TableHead className="w-[180px] text-xs font-semibold text-neutral-500 dark:text-neutral-400 pl-5">
                              Type
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                              Title & Details
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                              Upload Date
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                              File Size
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                              Review Status
                            </TableHead>
                            <TableHead className="text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 pr-5">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const filtered =
                              activeTab === "all"
                                ? allDocuments
                                : allDocuments.filter((d) => d.type === activeTab);

                            if (!filtered.length) {
                              return (
                                <TableRow>
                                  <TableCell
                                    colSpan={6}
                                    className="text-center py-10 text-neutral-400 dark:text-neutral-500"
                                  >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <FileX2 className="h-8 w-8 text-neutral-300 dark:text-neutral-700" />
                                      <p className="text-sm font-medium">No documents uploaded in this category.</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            }

                            return filtered.map((d) => {
                              const isApproved =
                                d.status === "approved" || d.status === "available";
                              const isRejected =
                                d.status === "rejected" || d.status === "error";

                              return (
                                <TableRow
                                  key={d._id}
                                  className="border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                                >
                                  {/* Type */}
                                  <TableCell className="pl-5 whitespace-nowrap">
                                    <DocTypeBadge type={d.type} />
                                  </TableCell>

                                  {/* Title & Description */}
                                  <TableCell className="max-w-[280px]">
                                    <div className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                                      {d.title || "Untitled Document"}
                                    </div>
                                    {d.description && (
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                        {d.description}
                                      </p>
                                    )}
                                  </TableCell>

                                  {/* Date */}
                                  <TableCell className="whitespace-nowrap text-xs text-neutral-600 dark:text-neutral-400">
                                    {formatDate(d.date)}
                                  </TableCell>

                                  {/* Size */}
                                  <TableCell className="whitespace-nowrap text-xs font-mono text-neutral-500">
                                    {d.size || "—"}
                                  </TableCell>

                                  {/* Status */}
                                  <TableCell className="whitespace-nowrap">
                                    <DocStatusBadge status={d.status} reason={d.rejectionReason} />
                                  </TableCell>

                                  {/* Actions */}
                                  <TableCell className="text-right pr-5">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* View Modal */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2.5 gap-1 text-xs rounded-lg border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                                        onClick={() => setPreviewDoc(d)}
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>View</span>
                                      </Button>

                                      {/* Download Link */}
                                      {d.downloadUrl && (
                                        <a href={d.downloadUrl} target="_blank" rel="noreferrer">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2.5 rounded-lg border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                                            title="Download Document"
                                          >
                                            <Download className="h-3.5 w-3.5" />
                                          </Button>
                                        </a>
                                      )}

                                      {/* Approve Button */}
                                      <Button
                                        size="sm"
                                        className={cn(
                                          "h-8 px-3 gap-1 text-xs font-medium rounded-lg transition-all",
                                          isApproved
                                            ? "bg-emerald-600/90 text-white cursor-default hover:bg-emerald-600/90"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                        )}
                                        disabled={actionLoading[d._id] || isApproved}
                                        onClick={() => handleApproveDoc(d)}
                                      >
                                        {actionLoading[d._id] === "approving" ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          <Check className="h-3.5 w-3.5" />
                                        )}
                                        <span>{isApproved ? "Approved" : "Approve"}</span>
                                      </Button>

                                      {/* Reject Button */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                          "h-8 px-2.5 gap-1 text-xs font-medium rounded-lg border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all",
                                          isRejected && "bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700"
                                        )}
                                        disabled={!!actionLoading[d._id]}
                                        onClick={() => handleOpenRejectModal(d)}
                                      >
                                        {actionLoading[d._id] === "rejecting" ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                                        ) : (
                                          <X className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                                        )}
                                        <span>{isRejected ? "Reason" : "Reject"}</span>
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            });
                          })()}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ========================================================================= */}
              {/* TAB 2: BANK & FINANCIAL PAYOUT DETAILS                                    */}
              {/* ========================================================================= */}
              <TabsContent value="bank" className="space-y-4 outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visual Bank Card */}
                  <div className="rounded-2xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white border border-neutral-700 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6900]/15 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Landmark className="h-6 w-6 text-[#FF6900]" />
                        <span className="font-bold text-sm tracking-wide">
                          {singleowner?.bankDetails?.bankName || "Official Bank Account"}
                        </span>
                      </div>
                      <Badge className="bg-emerald-500 text-white font-semibold text-[10px] uppercase">
                        {hasBankDetails ? "Verified IFSC" : "Missing Info"}
                      </Badge>
                    </div>

                    <div className="my-4">
                      <p className="text-xs text-neutral-400 uppercase tracking-widest">Account Number</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider">
                          {showAcc
                            ? singleowner?.bankDetails?.accountNumber
                            : maskAccountNumber(singleowner?.bankDetails?.accountNumber || "")}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAcc((s) => !s)}
                          className="h-7 px-2 text-xs text-neutral-300 hover:text-white hover:bg-white/10"
                        >
                          {showAcc ? "Hide" : "Show"}
                        </Button>
                        <CopyBtn
                          value={singleowner?.bankDetails?.accountNumber || ""}
                          label="Copy Account Number"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-700/60">
                      <div>
                        <p className="text-neutral-400 uppercase tracking-wider text-[10px]">Account Holder</p>
                        <p className="font-semibold text-white mt-0.5">
                          {singleowner?.bankDetails?.accountHolderName || singleowner?.name || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-400 uppercase tracking-wider text-[10px]">IFSC Code</p>
                        <p className="font-mono font-semibold text-white mt-0.5">
                          {singleowner?.bankDetails?.ifscCode || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Structured Bank Fields Grid */}
                  <Card className="lg:col-span-2 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm">
                    <CardHeader className="p-5 pb-3 border-b border-neutral-100 dark:border-neutral-800/60">
                      <CardTitle className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-[#FF6900]" />
                        Payout & Banking Credentials
                      </CardTitle>
                      <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                        Official bank credentials for processing host booking payouts.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldItem
                        label="Account Holder Name"
                        value={singleowner?.bankDetails?.accountHolderName}
                        icon={<User className="h-4 w-4" />}
                      />
                      <FieldItem
                        label="Bank Name"
                        value={singleowner?.bankDetails?.bankName}
                        icon={<Landmark className="h-4 w-4" />}
                      />
                      <FieldItem
                        label="IFSC Code"
                        value={singleowner?.bankDetails?.ifscCode?.trim()}
                        copyable
                        icon={<Banknote className="h-4 w-4" />}
                      />
                      <FieldItem
                        label="Branch Location"
                        value={singleowner?.bankDetails?.branchName}
                        icon={<Building2 className="h-4 w-4" />}
                      />
                      <FieldItem
                        label="Account Type"
                        value={singleowner?.bankDetails?.accountType || "Savings Account"}
                        icon={<CreditCard className="h-4 w-4" />}
                      />
                      <FieldItem
                        label="Direct UPI ID"
                        value={singleowner?.bankDetails?.upiId}
                        copyable
                        icon={<Wallet className="h-4 w-4" />}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ========================================================================= */}
              {/* TAB 3: PROPERTIES PORTFOLIO                                               */}
              {/* ========================================================================= */}
              <TabsContent value="properties" className="space-y-4 outline-none">
                <Card className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm">
                  <CardHeader className="p-5 pb-3 border-b border-neutral-100 dark:border-neutral-800/60">
                    <CardTitle className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#FF6900]" />
                      Properties Portfolio
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                      Villas, cottages, campsites, or hotels registered under this property owner.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5">
                    {singleowner?.properties && singleowner.properties.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {singleowner.properties.map((p) => (
                          <div
                            key={p._id}
                            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex items-center justify-between"
                          >
                            <div className="space-y-1">
                              <Badge
                                variant="outline"
                                className="capitalize font-semibold text-xs border-neutral-300 dark:border-neutral-700 text-[#FF6900]"
                              >
                                {p.refType || "Property"}
                              </Badge>
                              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                                ID: {p.refId}
                              </p>
                            </div>
                            <CopyBtn value={p.refId} label="Copy Property ID" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center space-y-2">
                        <Building2 className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mx-auto" />
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          No properties linked to this owner yet.
                        </p>
                        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                          Properties will automatically appear here once the owner lists villas, cottages, or camps.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* ========================================================================= */}
            {/* DOCUMENT REJECTION DIALOG                                                 */}
            {/* ========================================================================= */}
            <Dialog
              open={!!rejectModalDoc}
              onOpenChange={(o) => !o && setRejectModalDoc(null)}
            >
              <DialogContent className="max-w-lg rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-neutral-900 dark:text-neutral-100">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Reject Document Verification</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                    Provide the clear rejection reason for this document. The property owner will see this notification in their mobile app to re-upload.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Selected doc summary chip */}
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">{rejectModalDoc?.title}</p>
                      <p className="text-xs text-neutral-500 capitalize mt-0.5">
                        Type: {rejectModalDoc?.type} · Size: {rejectModalDoc?.size}
                      </p>
                    </div>
                    <DocTypeBadge type={rejectModalDoc?.type} />
                  </div>

                  {/* Preset quick reasons */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
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
                            "text-xs px-2.5 py-1 rounded-full border transition-all text-left cursor-pointer",
                            selectedPreset === preset
                              ? "bg-rose-500 text-white border-rose-600 font-medium shadow-xs"
                              : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom note textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Rejection Reason / Guidance for Host *
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
                      className="resize-none text-sm rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <Button
                    variant="outline"
                    onClick={() => setRejectModalDoc(null)}
                    disabled={!!actionLoading[rejectModalDoc?._id]}
                    className="rounded-xl border-neutral-200 dark:border-neutral-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 rounded-xl"
                    onClick={handleConfirmReject}
                    disabled={!rejectionReason.trim() || !!actionLoading[rejectModalDoc?._id]}
                  >
                    {actionLoading[rejectModalDoc?._id] === "rejecting" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span>Confirm Rejection</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ========================================================================= */}
            {/* DOCUMENT PREVIEW DIALOG (With Quick In-Modal Approval/Rejection)           */}
            {/* ========================================================================= */}
            <Dialog
              open={!!previewDoc}
              onOpenChange={(o) => !o && setPreviewDoc(null)}
            >
              <DialogContent className="max-w-4xl max-h-[92vh] rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-neutral-900 dark:text-neutral-100 flex flex-col p-6">
                <DialogHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <DialogTitle className="flex items-center justify-between gap-3 pr-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#FF6900]" />
                      <span className="text-base font-bold text-neutral-900 dark:text-white">
                        {previewDoc?.title}
                      </span>
                      <span className="text-xs font-normal text-neutral-400">
                        ({previewDoc?.size || "Document"})
                      </span>
                    </div>
                    {previewDoc && <DocStatusBadge status={previewDoc?.status} reason={previewDoc?.rejectionReason} />}
                  </DialogTitle>
                </DialogHeader>

                {/* Preview Viewport */}
                <div className="flex-1 min-h-[55vh] max-h-[65vh] flex items-center justify-center overflow-auto bg-neutral-100/70 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 p-2 my-2">
                  {previewDoc ? (
                    previewDoc.downloadUrl?.match(/\.(jpeg|jpg|png|webp|avif)($|\?)/i) ||
                    previewDoc.downloadUrl?.includes("/image/upload/") ? (
                      <img
                        src={previewDoc.downloadUrl}
                        alt={previewDoc.title}
                        className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                      />
                    ) : (
                      <iframe
                        src={previewDoc.downloadUrl}
                        className="h-full w-full rounded-lg border bg-white dark:bg-neutral-900"
                        title={previewDoc.title}
                      />
                    )
                  ) : null}
                </div>

                {/* In-Modal Action Toolbar */}
                <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 w-full">
                  <div className="text-xs text-neutral-400">
                    Uploaded: {formatDate(previewDoc?.date)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Direct Download */}
                    {previewDoc?.downloadUrl && (
                      <a href={previewDoc.downloadUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm" className="h-9 px-3 gap-1.5 rounded-xl border-neutral-200 dark:border-neutral-700">
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </Button>
                      </a>
                    )}

                    {/* Quick In-Modal Reject */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 gap-1.5 rounded-xl border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      onClick={() => {
                        handleOpenRejectModal(previewDoc);
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </Button>

                    {/* Quick In-Modal Approve */}
                    <Button
                      size="sm"
                      className="h-9 px-4 gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={
                        previewDoc?.status === "approved" ||
                        previewDoc?.status === "available" ||
                        actionLoading[previewDoc?._id] === "approving"
                      }
                      onClick={() => handleApproveDoc(previewDoc)}
                    >
                      {actionLoading[previewDoc?._id] === "approving" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {previewDoc?.status === "approved" || previewDoc?.status === "available"
                          ? "Approved"
                          : "Approve Document"}
                      </span>
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ========================================================================= */}
            {/* REVOKE VERIFICATION CONFIRMATION DIALOG                                   */}
            {/* ========================================================================= */}
            <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
              <AlertDialogContent className="rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-neutral-900 dark:text-neutral-100">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Revoke Owner Verification?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                    Are you sure you want to revoke verified status for <strong>{singleowner?.name}</strong>?
                    This will remove the Verified Host badge and flag the account for review.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl border-neutral-200 dark:border-neutral-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
                    onClick={() => executeVerification(false)}
                  >
                    Yes, Revoke Verification
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </ScrollArea>
      )}
    </>
  );
}

function FieldItem({ label, value, icon, copyable }) {
  return (
    <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/70 bg-neutral-50/60 dark:bg-neutral-900/30 flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </div>
        <p className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
          {value || "—"}
        </p>
      </div>
      {copyable && value ? <CopyBtn value={value} label={`Copy ${label}`} /> : null}
    </div>
  );
}

function CheckItem({ ok, label, statusText, isRejected, required = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border p-3 transition-colors",
        ok
          ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20"
          : isRejected
          ? "border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20"
          : required
          ? "border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20"
          : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30"
      )}
    >
      <div className="flex items-center gap-2.5">
        {ok ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : isRejected ? (
          <FileX2 className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
        ) : required ? (
          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
        ) : (
          <FileCheck2 className="h-4 w-4 text-neutral-400 shrink-0" />
        )}
        <span
          className={cn(
            "text-xs sm:text-sm font-medium",
            ok
              ? "text-emerald-950 dark:text-emerald-300 font-semibold"
              : isRejected
              ? "text-rose-950 dark:text-rose-300 font-semibold"
              : "text-neutral-800 dark:text-neutral-200"
          )}
        >
          {label}
        </span>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "text-[10px] sm:text-xs font-semibold capitalize px-2 py-0.5",
          ok
            ? "bg-emerald-600 text-white border-transparent"
            : isRejected
            ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            : required
            ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            : "text-neutral-500"
        )}
      >
        {statusText || (ok ? "Approved" : required ? "Required" : "Optional")}
      </Badge>
    </div>
  );
}
