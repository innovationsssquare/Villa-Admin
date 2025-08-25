"use client"
import { Button } from "@heroui/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { fetchAllCategories, fetchCategorybyid } from "@/lib/Redux/Slices/masterSlice"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Tag, Plus, Edit, Trash2, Upload, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Createcategory, Deletecategory, updateCategory } from "@/lib/API/Master/Master"
import { useToast } from "@/components/ui/toast-provider"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Categoriestable() {
  const { addToast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogOpen2, setIsDialogOpen2] = useState(false)

  const [loadingg, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    seasonalTrends: [],
    isActive: true,
  })

  const [newTrend, setNewTrend] = useState({ season: "", demand: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  const [deleteid, Setdeleteid] = useState("")
  const [updateid, Setupdatteid] = useState("")

  const dispatch = useDispatch()
  const { categories, loading, error, Singlecategory, singleloading, singleerror } = useSelector(
    (state) => state.master,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const seasons = ["Spring", "Summer", "Fall", "Winter"]
  const demandLevels = ["Low", "Medium", "High", "Very High"]

  useEffect(() => {
    dispatch(fetchAllCategories())
  }, [dispatch])

  useEffect(() => {
    if (updateid) {
      dispatch(fetchCategorybyid(updateid))
      setImagePreview(null)
      setSelectedFile(null) // Reset selected file when opening update dialog
      return
    }
  }, [dispatch, updateid])

  useEffect(() => {
    if (Singlecategory && isDialogOpen2) {
      setFormData({
        name: Singlecategory?.name || "",
        image: Singlecategory?.image || "",
        description: Singlecategory?.description || "",
        seasonalTrends: Singlecategory?.seasonalTrends || [],
        isActive: Singlecategory?.isActive !== undefined ? Singlecategory.isActive : true,
      })
      setImagePreview(Singlecategory?.image || null)
    }
  }, [Singlecategory, isDialogOpen2])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file) // Store the actual file object
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" })) // Use empty string instead of null
    setImagePreview(null)
    setSelectedFile(null) // Also reset selected file
  }

  const uploadImage = async (file) => {
    if (!file) return null

    const reader = new FileReader()
    const base64 = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: base64 }),
    })

    const data = await res.json()
    if (!data.success) throw new Error("Upload failed")
    return data.url
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    if (!formData.name) {
      addToast({
        title: "Category Name Required",
        description: "Category field required",
        variant: "destructive",
        duration: 2000,
      })
      setIsSubmitting(false)
      return
    }

    try {
      let uploadedImageUrl = formData.image
      if (selectedFile) {
        uploadedImageUrl = await uploadImage(selectedFile)
      }

      const result = await Createcategory({
        ...formData,
        image: uploadedImageUrl,
      })

      if (result.success) {
        setIsDialogOpen(false)
        resetForm() // Reset form after successful creation
        dispatch(fetchAllCategories())
        addToast({
          title: "Category created successfully!",
          description: "Category created successfully!",
          variant: "success",
          duration: 5000,
        })
      } else {
        addToast({
          title: "Error creating category",
          description: result.message,
          variant: "destructive",
          duration: 2000,
        })
      }
    } catch (error) {
      addToast({
        title: "Error creating category",
        description: error.message || error,
        variant: "destructive",
        duration: 2000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleupdate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let uploadedImageUrl = formData.image
      if (selectedFile) {
        uploadedImageUrl = await uploadImage(selectedFile)
      }

      const updatedData = {
        name: formData.name, // Fixed field name consistency
        image: uploadedImageUrl,
        description: formData.description,
        seasonalTrends: formData.seasonalTrends,
        isActive: formData.isActive,
      }

      const result = await updateCategory(updateid, updatedData)

      if (result.status || result.success) {
        // Handle both possible success indicators
        addToast({
          title: "Category Updated",
          description: "Category updated successfully",
          variant: "success",
        })
        setIsDialogOpen2(false)
        resetForm() // Use proper reset function
        Setupdatteid("")
        dispatch(fetchAllCategories())
      } else {
        addToast({
          title: "Update Failed",
          description: result.message || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      addToast({
        title: "Update Error",
        description: error.message || "Unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      description: "",
      seasonalTrends: [],
      isActive: true,
    })
    setImagePreview(null)
    setSelectedFile(null)
    setNewTrend({ season: "", demand: "" })
  }

  const handleDelete = async (deleteid) => {
    setIsDeleting(true)

    try {
      const result = await Deletecategory(deleteid)

      if (result.success) {
        dispatch(fetchAllCategories())
        addToast({
          title: "Category Deleted",
          description: "Category deleted successfully",
          variant: "success",
        })
      } else {
        addToast({
          title: "Delete Failed",
          description: result.message || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      addToast({
        title: "Delete Error",
        description: error.message || "Unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSeasonalTrend = () => {
    if (newTrend.season && newTrend.demand) {
      setFormData((prev) => ({
        ...prev,
        seasonalTrends: [...prev.seasonalTrends, newTrend],
      }))
      setNewTrend({ season: "", demand: "" })
    }
  }

  const removeSeasonalTrend = (index) => {
    setFormData((prev) => ({
      ...prev,
      seasonalTrends: prev.seasonalTrends.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categories Management
              </CardTitle>
              <CardDescription>Manage and view all categories</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-[#106C83] rounded-sm text-white cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] h-[95vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new category with all the necessary details and configurations.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className={"h-[80vh] w-full"}>
                  <Card className="border-0 w-full">
                    <CardContent className="pb-8">
                      <form className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Category Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              placeholder="Enter category name"
                              required
                            />
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label htmlFor="image">Category Image</Label>
                          <div className="flex items-center gap-4">
                            <Input type="file" accept="image/*" onChange={handleFileChange} />
                          </div>
                          {imagePreview && (
                            <div className="relative h-32 w-32 rounded-md overflow-hidden bg-muted">
                              <Image
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500"
                                onClick={removeImage} // Fixed to use onClick instead of onPress
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter category description"
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Seasonal Trends */}
                        <div className="space-y-4">
                          <Label>Seasonal Trends</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                            <Select
                              value={newTrend.season}
                              onValueChange={(value) =>
                                setNewTrend((prev) => ({
                                  ...prev,
                                  season: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select season" />
                              </SelectTrigger>
                              <SelectContent>
                                {seasons?.map((season) => (
                                  <SelectItem key={season} value={season}>
                                    {season}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={newTrend.demand}
                              onValueChange={(value) =>
                                setNewTrend((prev) => ({
                                  ...prev,
                                  demand: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select demand" />
                              </SelectTrigger>
                              <SelectContent>
                                {demandLevels?.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              className="bg-[#106C83] rounded-lg text-white h-9"
                              type="button"
                              onPress={addSeasonalTrend} 
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Trend
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {formData?.seasonalTrends?.map((trend, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="text-sm">
                                  <strong>{trend.season}:</strong> {trend.demand} demand
                                </span>
                                <X
                                  className="w-4 h-4 cursor-pointer hover:text-red-500"
                                  onClick={() => removeSeasonalTrend(index)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Popularity Score and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="isActive">Status</Label>
                            <div className="flex items-center space-x-2 pt-2">
                              <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                              />
                              <Label htmlFor="isActive" className="text-sm">
                                {formData.isActive ? "Active" : "Inactive"}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </ScrollArea>

                <DialogFooter className="absolute bottom-0 w-full px-8 bg-white">
                  <div className="flex justify-end gap-4 py-2">
                    <Button
                      onClick={handleSubmit} // Fixed to use onClick instead of onPress
                      className="bg-[#106C83] rounded-lg text-white h-9 w-44"
                    >
                      {isSubmitting ? <span className="loader"></span> : "Create Category"}
                    </Button>
                  </div>
                </DialogFooter>
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
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories?.map((subcategory) => (
                      <TableRow key={subcategory._id}>
                        <TableCell>
                          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={subcategory?.image || "/placeholder.svg?height=48&width=48"}
                              alt={subcategory?.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{subcategory?.name}</span>
                            <span className="text-sm text-muted-foreground">ID: {subcategory?._id.slice(-8)}</span>
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
                            <Dialog
                              open={isDialogOpen2}
                              onOpenChange={(open) => {
                                setIsDialogOpen2(open)
                                if (!open) {
                                  resetForm()
                                  Setupdatteid("")
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <button
                                  onClick={async () => {
                                    Setupdatteid(subcategory._id)
                                    setIsDialogOpen2(true)
                                  }}
                                  className="p-2 text-[#106C83] cursor-pointer hover:text-[#106C83] hover:bg-blue-50 rounded-md transition-colors"
                                  title="Edit category"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] h-[95vh] overflow-hidden">
                                <DialogHeader>
                                  <DialogTitle>Update Category</DialogTitle>
                                  <DialogDescription>Update existing category</DialogDescription>
                                </DialogHeader>
                                {singleloading ? (
                                  <div className="flex justify-center items-center h-60">
                                    <span className="loader2"></span>
                                  </div>
                                ) : (
                                  <ScrollArea className="h-[70vh] w-full">
                                    <form onSubmit={handleupdate} className="space-y-6 pr-4">
                                      <div className="space-y-4">
                                        {/* Category Name */}
                                        <div className="space-y-2">
                                          <Label htmlFor="categoryName">Category Name</Label>
                                          <Input
                                            id="categoryName"
                                            placeholder="Enter category name"
                                            value={formData.name}
                                            onChange={(e) =>
                                              setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                              }))
                                            }
                                            required
                                          />
                                        </div>

                                        {/* Image Upload */}
                                        <div className="space-y-2">
                                          <Label>Category Image</Label>
                                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                                            {imagePreview ? (
                                              <div className="relative">
                                                <div className="relative h-32 w-full rounded-md overflow-hidden bg-muted">
                                                  <Image
                                                    src={imagePreview || "/placeholder.svg"}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                  />
                                                </div>
                                                <Button
                                                  type="button"
                                                  variant="destructive"
                                                  size="sm"
                                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500"
                                                  onClick={removeImage}
                                                >
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            ) : (
                                              <div className="text-center flex justify-center items-center gap-2 flex-col">
                                                <Upload
                                                  htmlFor="image-upload"
                                                  className="mx-auto h-8 w-8 text-muted-foreground"
                                                />
                                                <div className="mt-2">
                                                  <Label htmlFor="image-upload" className="cursor-pointer">
                                                    <span className="text-sm text-center font-medium bg-[#106C83] p-2 rounded-full text-white hover:text-primary/80">
                                                      Click to upload
                                                    </span>
                                                  </Label>
                                                  <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                  />
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  PNG, JPG, GIF up to 10MB
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                          <Label htmlFor="description">Description</Label>
                                          <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder="Enter category description"
                                            className="min-h-[100px]"
                                          />
                                        </div>

                                        {/* Seasonal Trends */}
                                        <div className="space-y-4">
                                          <Label>Seasonal Trends</Label>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                                            <Select
                                              value={newTrend.season}
                                              onValueChange={(value) =>
                                                setNewTrend((prev) => ({
                                                  ...prev,
                                                  season: value,
                                                }))
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select season" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {seasons?.map((season) => (
                                                  <SelectItem key={season} value={season}>
                                                    {season}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <Select
                                              value={newTrend.demand}
                                              onValueChange={(value) =>
                                                setNewTrend((prev) => ({
                                                  ...prev,
                                                  demand: value,
                                                }))
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select demand" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {demandLevels?.map((level) => (
                                                  <SelectItem key={level} value={level}>
                                                    {level}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <Button
                                              className="bg-[#106C83] rounded-lg text-white h-9"
                                              type="button"
                                              onPress={addSeasonalTrend}
                                              size="sm"
                                            >
                                              <Plus className="w-4 h-4 mr-2" />
                                              Add Trend
                                            </Button>
                                          </div>
                                          <div className="space-y-2">
                                            {formData?.seasonalTrends?.map((trend, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                              >
                                                <span className="text-sm">
                                                  <strong>{trend.season}:</strong> {trend.demand} demand
                                                </span>
                                                <X
                                                  className="w-4 h-4 cursor-pointer hover:text-red-500"
                                                  onClick={() => removeSeasonalTrend(index)}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-2">
                                          <Label htmlFor="isActive">Status</Label>
                                          <div className="flex items-center space-x-2 pt-2">
                                            <Switch
                                              id="isActive"
                                              checked={formData.isActive}
                                              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                                            />
                                            <Label htmlFor="isActive" className="text-sm">
                                              {formData.isActive ? "Active" : "Inactive"}
                                            </Label>
                                          </div>
                                        </div>
                                      </div>

                                      <DialogFooter>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => {
                                            resetForm()
                                            setIsDialogOpen2(false)
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
                                              Updating...
                                            </>
                                          ) : (
                                            <>
                                              <Edit className="h-4 w-4 mr-2" />
                                              Update
                                            </>
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </ScrollArea>
                                )}
                              </DialogContent>
                            </Dialog>
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
                                  <DialogDescription>Do you want delete it?</DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <Button
                                    onClick={() => handleDelete(deleteid)} // Fixed to use onClick instead of onPress
                                    className="bg-red-500 text-white rounded-md"
                                  >
                                    {isDeleting ? <span className="loader"></span> : "Delete"}
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
  )
}
