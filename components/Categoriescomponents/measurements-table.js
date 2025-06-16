"use client";

import { Filter } from "lucide-react";
import { Button } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllMeasurement } from "@/lib/Redux/Slices/masterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2,CalendarDays } from "lucide-react";
import { Createmeasurement, Deletemeasurement } from "@/lib/API/Master/Master";

export function MeasurementsTable() {
  const { addToast } = useToast();

  const dispatch = useDispatch();
  const { measurement, loading, error } = useSelector((state) => state.master);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteid, Setdeleteid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    measurement: "",
  });

  useEffect(() => {
    dispatch(fetchAllMeasurement());
  }, [dispatch]);

  console.log(measurement);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.measurement) {
      addToast({
        title: `"measurement type  Required`,
        description: "measurement field required",
        variant: "destructive",
        duration: 2000,
      });
    }
    try {
      const categoryData = {
        measurement: formData.measurement,
      };

      const result = await Createmeasurement(categoryData);

      if (result.status) {
        setFormData({ measurement: "" });
        setIsDialogOpen(false);
        dispatch(fetchAllMeasurement());
        addToast({
          title: `measurement created successfully!`,
          description: `measurement created successfully!`,
          variant: "success",
          duration: 5000,
        });
      } else {
        addToast({
          title: `Error creating measurement`,
          description: `Error creating measurement`,
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      addToast({
        title: `"Error creating measurement`,
        description: `Error creating measurement`,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (deleteid) => {
    setIsDeleting(true);

    try {
      const result = await Deletemeasurement(deleteid);

      if (result.status) {
        dispatch(fetchAllMeasurement());
      } else {
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Measurments Management
              </CardTitle>
              <CardDescription>Manage and view all Measurments</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-[#106C83] rounded-sm text-white cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Measurments</DialogTitle>
                  <DialogDescription>Add a new Measurments</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="measurement">Tax Type</Label>
                      <Input
                        id="measurement"
                        placeholder="Enter measurement type"
                        value={formData.measurement}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            measurement: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onPress={() => {
                        resetForm();
                        setIsDialogOpen(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-[#106C83] rounded-sm text-white cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="loader2"></span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Measurment Type</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Updated
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measurement?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No Tax found
                      </TableCell>
                    </TableRow>
                  ) : (
                    measurement?.map((subcategory) => (
                      <TableRow key={subcategory._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {subcategory?.measurement}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />

                            {formatDate(subcategory?.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />

                            {formatDate(subcategory?.updatedAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  onClick={() => Setdeleteid(subcategory._id)}
                                  className="p-2 text-red-600 cursor-pointer hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                  title="Delete category"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Confirm Delete!</DialogTitle>
                                  <DialogDescription>
                                    Do you want delete it?
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <Button
                                    onPress={() => handleDelete(deleteid)}
                                    className="bg-red-500 text-white rounded-md"
                                  >
                                    {isDeleting ? (
                                      <span className="loader"></span>
                                    ) : (
                                      "Delete"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
