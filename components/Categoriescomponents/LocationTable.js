"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
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
import { Pencil, Trash2, Plus, Search, MapPin } from "lucide-react";
import LocationForm from "./LocationForm";
import { toast } from "sonner";

const LocationTable = () => {
  const dispatch = useDispatch();
  const { locations, loading } = useSelector((state) => state.location);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Load locations on mount
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // Search filter
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Create
  const handleCreate = async (data) => {
    const res = await dispatch(createLocation(data));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Location created successfully");
      setIsFormOpen(false);
    } else {
      toast.error("Failed to create location");
    }
  };

  // Handle Update
  const handleUpdate = async (data) => {
    if (!editingLocation) return;
    const res = await dispatch(
      updateLocation({ id: editingLocation._id, data })
    );
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Location updated successfully");
      setIsFormOpen(false);
      setEditingLocation(null);
    } else {
      toast.error("Failed to update location");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const res = await dispatch(deleteLocation(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Location deleted successfully");
    } else {
      toast.error("Failed to delete location");
    }
    setDeletingId(null);
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
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto bg-[#FF6900] text-white hover:bg-[#FF6900] cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
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
                  <TableCell colSpan={6} className="text-center py-8">
                   <span className="loader2"></span>
                  </TableCell>
                </TableRow>
              ) : filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground dark:text-neutral-400"
                  >
                    No locations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations?.map((location) => (
                  <TableRow
                    key={location?._id}
                    className="hover:bg-gray-50/60 dark:hover:bg-neutral-800/40 border-b border-gray-100 dark:border-neutral-800 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500 " />
                        {location?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(location?.type)} className={"bg-green-100 dark:bg-green-950/40 border text-green-700 dark:text-green-400 border-green-300 dark:border-green-800/60"}>
                        {location?.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm text-gray-600 dark:text-neutral-400">
                      {location.coordinates?.[0]?.toFixed(4)},{" "}
                      {location.coordinates?.[1]?.toFixed(4)}
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(location)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingId(location._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? "Edit Location" : "Add New Location"}
            </DialogTitle>
            <DialogDescription>
              {editingLocation
                ? "Update the location details below"
                : "Fill in the details to create a new location"}
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
        onOpenChange={() => setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-red-500 cursor-pointer hover:bg-red-500/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocationTable;
