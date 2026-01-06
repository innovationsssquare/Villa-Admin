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
import { X } from "lucide-react";
import MapPicker from "./MapPicker";

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
  const [imagePreview, setImagePreview] = useState(
    location?.coverImage || null
  );


const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setSelectedFile(file);

  const reader = new FileReader();
  reader.onloadend = () => setImagePreview(reader.result);
  reader.readAsDataURL(file);
};

const removeImage = () => {
  setSelectedFile(null);
  setImagePreview(null);
  setFormData((prev) => ({ ...prev, coverImage: "" }));
};

const uploadImage = async (file) => {
  if (!file) return null;

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
  if (!data.success) throw new Error("Image upload failed");
  return data.url;
};




  const handleSubmit = async (e) => {
  e.preventDefault();

  let uploadedImageUrl = formData.coverImage;

  if (selectedFile) {
    uploadedImageUrl = await uploadImage(selectedFile);
  }

  onSubmit({
    ...formData,
    coverImage: uploadedImageUrl,
  });
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
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label>Coordinates *</Label>
        <MapPicker
          coordinates={formData.coordinates}
          onCoordinatesChange={(coords) =>
            setFormData({ ...formData, coordinates: coords })
          }
        />
      </div>
      <div className="grid grid-cols-2 w-full items-center gap-2">
        <div className="space-y-2">
          <Label htmlFor="name">Location Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter location name"
            required
          />
        </div>

        <div className="space-y-2 mt-2 w-full">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger id="type" className={"w-full"}>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter location description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
          />
          <Button type="button" onClick={addFeature} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.features.map((feature) => (
            <Badge key={feature} variant="secondary" className="pl-3 pr-1">
              {feature}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 ml-1"
                onClick={() => removeFeature(feature)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
        <div className="space-y-0.5">
          <Label htmlFor="isPopular" className="text-base">
            Popular Location
          </Label>
          <p className="text-sm text-muted-foreground">
            Mark this location as popular
          </p>
        </div>
        <Switch
          id="isPopular"
          checked={formData.isPopular}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isPopular: checked })
          }
        />
      </div>
<div className="space-y-2">
  <Label>Cover Image</Label>

  <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center">
    {imagePreview ? (
      <div className="relative h-32 w-32 rounded-md overflow-hidden">
        <img
          src={imagePreview}
          alt="Cover preview"
          className="h-full w-full object-cover"
        />
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          onClick={removeImage}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    ) : (
      <label className="cursor-pointer text-sm text-muted-foreground">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        Click to upload image
      </label>
    )}
  </div>
</div>



      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-[#106C83] hover:bg-[#106C83] cursor-pointer text-white"
        >
          {location ? "Update Location" : "Create Location"}
        </Button>
        <Button
          type="button"
          className={"bg-red-500 hover:bg-red-500 text-white cursor-pointer"}
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default LocationForm;
