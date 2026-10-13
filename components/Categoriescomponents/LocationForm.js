import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Loader2, AlertCircle, UploadCloud } from "lucide-react";
import MapPicker from "./MapPicker";

const MAX_FILE_SIZE_MB = 8;

const LocationForm = ({ location, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: location?.name || "",
    type: location?.type || "city",
    coordinates: location?.coordinates || [
      73.4149859407758, 18.754284332995855,
    ],
    description: location?.description || "",
    features: location?.features || [],
    isPopular: location?.isPopular || false,
    coverImage: location?.coverImage || "",
  });

  const [newFeature, setNewFeature] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(location?.coverImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleImageChange = (e) => {
    setFormError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFormError(`Image exceeds ${MAX_FILE_SIZE_MB}MB limit. Please choose a smaller image.`);
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (isUploading || isSubmitting) return;
    setSelectedFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, coverImage: "" }));
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Cloudinary");
      }
      return data.url;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Location name is required.");
      return;
    }

    if (!imagePreview && !formData.coverImage && !selectedFile) {
      setFormError("Cover image is required. Please upload an image for this location.");
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageUrl = formData.coverImage;

      if (selectedFile) {
        uploadedImageUrl = await uploadImage(selectedFile);
      }

      if (!uploadedImageUrl) {
        throw new Error("Cover image is required. Please upload an image.");
      }

      const payload = {
        ...formData,
        coverImage: uploadedImageUrl,
      };

      const result = await onSubmit(payload);
      if (result && result.success === false) {
        setFormError(result.error || "Failed to save location");
      }
    } catch (err) {
      console.error("LocationForm submit error:", err);
      setFormError(err.message || "An error occurred while saving the location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (feature) => {
    if (isSubmitting) return;
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    });
  };

  const isLoading = isUploading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error state banner */}
      {formError && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      {/* Map Picker with Coordinates */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Coordinates *</Label>
        <MapPicker
          coordinates={formData.coordinates}
          onCoordinatesChange={(coords) =>
            setFormData({ ...formData, coordinates: coords })
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 w-full items-center gap-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            Location Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (formError) setFormError("");
            }}
            placeholder="e.g. Lonavala, Pawna Lake, Alibaug"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="type" className="text-sm font-semibold">
            Type *
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="landmark">Landmark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of the destination or area"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Features & Highlights</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="e.g. Waterfalls, Mountain View, Lake Touch"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
          />
          <Button
            type="button"
            onClick={addFeature}
            variant="secondary"
            disabled={isLoading || !newFeature.trim()}
          >
            Add
          </Button>
        </div>
        {formData.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {formData.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="pl-2.5 pr-1 py-1">
                {feature}
                <button
                  type="button"
                  className="ml-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => removeFeature(feature)}
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3.5 border border-border rounded-lg bg-card">
        <div className="space-y-0.5">
          <Label htmlFor="isPopular" className="text-sm font-semibold cursor-pointer">
            Popular Destination
          </Label>
          <p className="text-xs text-muted-foreground">
            Display this location in featured search filters & home carousels
          </p>
        </div>
        <Switch
          id="isPopular"
          checked={formData.isPopular}
          disabled={isLoading}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isPopular: checked })
          }
        />
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1">
          Cover Image <span className="text-red-500">*</span>
        </Label>

        <div className="border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-neutral-900/30">
          {imagePreview ? (
            <div className="relative h-44 w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-xs">
              <img
                src={imagePreview}
                alt="Location Cover Preview"
                className="h-full w-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#FF6900]" />
                  <span className="text-xs font-medium">Uploading to Cloudinary...</span>
                </div>
              )}
              {!isLoading && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full p-0 shadow-md cursor-pointer"
                  onClick={removeImage}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center w-full py-6 cursor-pointer ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF6900] flex items-center justify-center mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Click to upload cover photo
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PNG, JPG, or WEBP up to {MAX_FILE_SIZE_MB}MB
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isLoading}
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-3 border-t border-border">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#FF6900] hover:bg-[#FF6900]/90 text-white cursor-pointer h-10 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? "Uploading image..." : "Saving location..."}
            </>
          ) : location ? (
            "Update Location"
          ) : (
            "Create Location"
          )}
        </Button>
        <Button
          type="button"
          disabled={isLoading}
          variant="outline"
          onClick={onCancel}
          className="h-10 cursor-pointer"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default LocationForm;
