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
  ChevronLeft ,
  Hash,
  BadgeIcon as IdCard,
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
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchownerbyid } from "@/lib/Redux/Slices/ownerSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { verifyowner } from "@/lib/API/Owner/Owner";

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

function DocTypeBadge({ type }) {
  const map = {
    agreement: "Agreement",
    adhaar: "Aadhaar",
    bank_passbook: "Bank Passbook",
  };
  return <Badge variant="secondary">{map[type] ?? type}</Badge>;
}

export default function OwnerDetailsClient() {
  const [owner, setOwner] = useState();
  const [showAcc, setShowAcc] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const params = useParams();
  const { id } = params;
  const { singleowner, singleloading, singleerror } = useSelector(
    (state) => state.owner
  );
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchownerbyid(id));
  }, [dispatch]);

  const docMap = useMemo(() => {
    const m = {};
    for (const d of singleowner?.documents ?? []) {
      const key = d.type;
      if (!m[key]) m[key] = [];
      m[key].push(d);
    }
    return m;
  }, [singleowner?.documents]);

  const hasAdhaar = !!docMap["adhaar"]?.length;
  const hasPassbook = !!docMap["bank_passbook"]?.length;
  const hasAgreement = !!docMap["agreement"]?.length;
  const hasBankDetails =
    !!singleowner?.bankDetails?.accountNumber &&
    !!singleowner?.bankDetails?.ifscCode;

  const requiredOk = hasAdhaar && hasPassbook && hasAgreement;
  const optionalOk = !!singleowner?.email;
  const canVerify = requiredOk;

  async function verifyOwner() {
    setVerifying(true);
    try {
      const data = {
        isVerified: true,
      };

      const res = await verifyowner(id, data);
      if (res) {
        alert("success");
      }
      // toast({
      //   title: "Owner verified",
      //   description: "Verification status updated successfully.",
      // });
    } catch (e) {
      // toast({
      //   title: "Verification failed",
      //   description: "Please try again.",
      //   variant: "destructive",
      // });
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
                        "gap-2",
                        singleowner?.isVerified
                          ? "bg-emerald-600 hover:bg-emerald-600"
                          : ""
                      )}
                      disabled={
                        singleowner?.isVerified || !canVerify || verifying
                      }
                      onClick={verifyOwner}
                    >
                      {owner?.isVerified ? (
                        <>
                          <ShieldCheck className="h-4 w-4" /> Verified
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
              <Alert>
                <AlertTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verification Checklist
                </AlertTitle>
                <AlertDescription>
                  Complete the required items to enable verification.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Verification Requirements</CardTitle>
                <CardDescription>
                  Required items must be present before verifying.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <CheckItem
                  ok={hasAdhaar}
                  label="Aadhaar document uploaded"
                  required
                />
                <CheckItem
                  ok={hasPassbook}
                  label="Bank passbook uploaded"
                  required
                />
                <CheckItem
                  ok={hasAgreement}
                  label="Owner agreement uploaded"
                  required
                />
                <CheckItem ok={hasBankDetails} label="Bank details present" />
                <CheckItem ok={!!singleowner?.email} label="Email provided" />
                <CheckItem ok={!!singleowner?.bankDetails?.phone} label="Phone provided" />
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
                                    <TableCell className="max-w-[260px]">
                                      <div className="line-clamp-1 font-medium">
                                        {d.title}
                                      </div>
                                      <div className="line-clamp-1 text-xs text-muted-foreground">
                                        {d.description}
                                      </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                      {formatDate(d.date)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                      {d.size}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                      {d.status === "available" ? (
                                        <Badge className="bg-emerald-600 text-white">
                                          Available
                                        </Badge>
                                      ) : (
                                        <Badge variant="secondary">
                                          Unavailable
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="gap-2"
                                          onClick={() => setPreviewDoc(d)}
                                        >
                                          <Eye className="h-4 w-4" /> View
                                        </Button>
                                        <a
                                          href={d.downloadUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                          >
                                            <Download className="h-4 w-4" />{" "}
                                            Download
                                          </Button>
                                        </a>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {!docs.length && (
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      className="text-center text-sm text-muted-foreground"
                                    >
                                      No documents in this category.
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

            {/* Document Preview Dialog */}
            <Dialog
              open={!!previewDoc}
              onOpenChange={(o) => !o && setPreviewDoc(null)}
            >
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {previewDoc?.title}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({previewDoc?.size})
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="h-[70vh]">
                  {previewDoc ? (
                    <iframe
                      src={previewDoc.downloadUrl}
                      className="h-full w-full rounded-md border"
                      title={previewDoc.title}
                    />
                  ) : null}
                </div>
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

function CheckItem({ ok, label, required = false }) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex items-center gap-2">
        {ok ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : required ? (
          <FileX2 className="h-5 w-5 text-amber-600" />
        ) : (
          <FileCheck2 className="h-5 w-5 text-muted-foreground" />
        )}
        <span className={cn("text-sm", !ok && required ? "font-medium" : "")}>
          {label}
        </span>
      </div>
      {required && <Badge variant="secondary">{ok ? "OK" : "Required"}</Badge>}
    </div>
  );
}
