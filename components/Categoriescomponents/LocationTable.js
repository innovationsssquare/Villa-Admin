"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  clearLocationError,
} from "@/lib/Redux/Slices/locationSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Card } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import LocationForm from "./LocationForm";
import { toast } from "sonner";

const LocationTable = () => {
  const dispatch = useDispatch();
  const { locations, loading, error: reduxError } = useSelector(
    (state) => state.location
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load locations on mount
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Search filter
  const safeLocations = Array.isArray(locations) ? locations : [];
  const filteredLocations = safeLocations.filter(
    (location) =>
      location?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location?.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / itemsPerPage));
  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Create
  const handleCreate = async (data) => {
    try {
      const res = await dispatch(createLocation(data));
      if (res.meta.requestStatus === "fulfilled" && res.payload?.success !== false) {
        toast.success("Location created successfully");
        setIsFormOpen(false);
        setEditingLocation(null);
        return { success: true };
      } else {
        const errorMsg =
          res.payload?.message ||
          (typeof res.payload === "string" ? res.payload : null) ||
          res.error?.message ||
          "Failed to create location";
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      toast.error(err.message || "Failed to create location");
      return { success: false, error: err.message };
    }
  };

  // Handle Update
  const handleUpdate = async (data) => {
    if (!editingLocation) return;
    try {
      const res = await dispatch(
        updateLocation({ id: editingLocation._id, data })
      );
      if (res.meta.requestStatus === "fulfilled" && res.payload?.success !== false) {
        toast.success("Location updated successfully");
        setIsFormOpen(false);
        setEditingLocation(null);
        return { success: true };
      } else {
        const errorMsg =
          res.payload?.message ||
          (typeof res.payload === "string" ? res.payload : null) ||
          res.error?.message ||
          "Failed to update location";
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      toast.error(err.message || "Failed to update location");
      return { success: false, error: err.message };
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await dispatch(deleteLocation(id));
      if (res.meta.requestStatus === "fulfilled" && res.payload?.res?.success !== false) {
        toast.success("Location deleted successfully");
      } else {
        const errorMsg =
          res.payload?.message ||
          (typeof res.payload === "string" ? res.payload : null) ||
          "Failed to delete location";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete location");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const openEditDialog = (location) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case "city":
        return "default";
      case "area":
        return "secondary";
      case "landmark":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Redux Error Banner */}
      {reduxError && (
        <Alert variant="destructive" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <AlertDescription className="text-sm font-medium">
              {reduxError}
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearLocationError())}
            className="h-7 px-2 text-xs"
          >
            Dismiss
          </Button>
        </Alert>
      )}

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchLocations())}
            disabled={loading}
            className="h-10 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setEditingLocation(null);
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto bg-[#FF6900] text-white hover:bg-[#FF6900]/90 cursor-pointer h-10 font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#121215] overflow-hidden p-0 transition-colors">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-neutral-900/60 border-b border-gray-200 dark:border-neutral-800">
                <TableHead className="font-semibold text-gray-700 dark:text-neutral-300">Name</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-neutral-300">Type</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-neutral-300 hidden md:table-cell">
                  Coordinates
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-neutral-300 hidden lg:table-cell">
                  Features
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-neutral-300 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#FF6900]" />
                      <span className="text-sm text-muted-foreground">Loading locations...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground dark:text-neutral-400"
                  >
                    {searchQuery ? `No locations matching "${searchQuery}"` : "No locations found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLocations.map((location) => {
                  const lng = Number(location?.coordinates?.[0]);
                  const lat = Number(location?.coordinates?.[1]);
                  const coordsText =
                    Number.isFinite(lng) && Number.isFinite(lat)
                      ? `${lng.toFixed(4)}, ${lat.toFixed(4)}`
                      : "—";

                  return (
                    <TableRow
                      key={location?._id}
                      className="hover:bg-gray-50/60 dark:hover:bg-neutral-800/40 border-b border-gray-100 dark:border-neutral-800 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#FF6900] shrink-0" />
                          <span className="font-semibold">{location?.name}</span>
                          {location?.isPopular && (
                            <Badge variant="secondary" className="text-[10px] bg-orange-100 text-[#FF6900] border-orange-200">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getTypeBadgeVariant(location?.type)}
                          className="bg-green-100 dark:bg-green-950/40 border text-green-700 dark:text-green-400 border-green-300 dark:border-green-800/60 capitalize"
                        >
                          {location?.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs text-gray-600 dark:text-neutral-400">
                        {coordsText}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {location.features?.slice(0, 2).map((feature) => (
                            <Badge
                              key={feature}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {location.features?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{location.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(location)}
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingId(location._id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar */}
        {filteredLocations.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Showing <span className="font-semibold text-neutral-700 dark:text-neutral-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">{Math.min(currentPage * itemsPerPage, filteredLocations.length)}</span> of{" "}
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">{filteredLocations.length}</span> locations
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="h-8 text-xs border-neutral-200 dark:border-neutral-800 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>
                <span className="text-xs font-semibold px-2 text-neutral-600 dark:text-neutral-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-8 text-xs border-neutral-200 dark:border-neutral-800 cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? "Edit Location" : "Add New Location"}
            </DialogTitle>
            <DialogDescription>
              {editingLocation
                ? "Update the location coordinates, highlights, and cover image"
                : "Fill in the details to create a new destination or area"}
            </DialogDescription>
          </DialogHeader>
          <LocationForm
            location={editingLocation}
            onSubmit={editingLocation ? handleUpdate : handleCreate}
            onCancel={closeFormDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeletingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              location and its cover image from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deletingId) handleDelete(deletingId);
              }}
              disabled={isDeleting}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocationTable;
