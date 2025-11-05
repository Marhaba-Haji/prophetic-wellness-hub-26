import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  category?: string;
  category_id?: string;
  in_stock: boolean;
  stock_quantity: number;
  featured_image?: string;
  images?: string[];
  sku?: string;
  meta_title?: string;
  meta_description?: string;
  featured?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id?: string;
  product_id?: string;
  variant_name: string;
  variant_value: string;
  price: number;
  compare_at_price?: number;
  sku?: string;
  stock_quantity: number;
  in_stock: boolean;
  featured_image?: string;
  display_order: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [managingProductId, setManagingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    compare_at_price: "",
    category_id: "",
    stock_quantity: "",
    featured_image: "",
    sku: "",
    meta_title: "",
    meta_description: "",
    featured: false,
    images: [] as string[],
  });

  const [variantFormData, setVariantFormData] = useState({
    variant_name: "",
    variant_value: "",
    price: "",
    compare_at_price: "",
    sku: "",
    stock_quantity: "",
    display_order: "0",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("active", true)
        .order("display_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const newImages = [...productImages, ...uploadedUrls];
      setProductImages(newImages);
      setFormData(prev => ({
        ...prev,
        images: newImages,
        featured_image: prev.featured_image || uploadedUrls[0]
      }));

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index);
    setProductImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingProduct?.featured_image || formData.featured_image || "";

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        short_description: formData.short_description || null,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        category: "", // Legacy field - kept for backward compatibility
        category_id: formData.category_id || null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        in_stock: parseInt(formData.stock_quantity) > 0,
        featured_image: imageUrl || null,
        images: productImages,
        sku: formData.sku || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        featured: formData.featured,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        toast.success("Product created successfully");
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        short_description: "",
        price: "",
        compare_at_price: "",
        category_id: "",
        stock_quantity: "",
        featured_image: "",
        sku: "",
        meta_title: "",
        meta_description: "",
        featured: false,
        images: [],
      });
      setImageFile(null);
      setImagePreview("");
      setProductImages([]);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      short_description: product.short_description || "",
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || "",
      category_id: product.category_id || "",
      stock_quantity: product.stock_quantity.toString(),
      featured_image: product.featured_image || "",
      sku: product.sku || "",
      meta_title: product.meta_title || "",
      meta_description: product.meta_description || "",
      featured: product.featured || false,
      images: product.images || [],
    });
    setImagePreview(product.featured_image || "");
    setProductImages(product.images || []);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const fetchVariants = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("display_order");

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error("Error fetching variants:", error);
      toast.error("Failed to load variants");
    }
  };

  const handleManageVariants = (productId: string) => {
    setManagingProductId(productId);
    fetchVariants(productId);
    setIsVariantDialogOpen(true);
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingProductId) return;

    try {
      const variantData = {
        product_id: managingProductId,
        variant_name: variantFormData.variant_name,
        variant_value: variantFormData.variant_value,
        price: parseFloat(variantFormData.price),
        compare_at_price: variantFormData.compare_at_price ? parseFloat(variantFormData.compare_at_price) : null,
        sku: variantFormData.sku || null,
        stock_quantity: parseInt(variantFormData.stock_quantity) || 0,
        in_stock: parseInt(variantFormData.stock_quantity) > 0,
        display_order: parseInt(variantFormData.display_order) || 0,
      };

      const { error } = await supabase.from("product_variants").insert([variantData]);
      if (error) throw error;

      toast.success("Variant added successfully");
      setVariantFormData({
        variant_name: "",
        variant_value: "",
        price: "",
        compare_at_price: "",
        sku: "",
        stock_quantity: "",
        display_order: "0",
      });
      fetchVariants(managingProductId);
    } catch (error: any) {
      console.error("Error adding variant:", error);
      toast.error(error.message || "Failed to add variant");
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    try {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", variantId);

      if (error) throw error;
      toast.success("Variant deleted successfully");
      if (managingProductId) fetchVariants(managingProductId);
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: "",
                slug: "",
                description: "",
                short_description: "",
                price: "",
                compare_at_price: "",
                category_id: "",
                stock_quantity: "",
                featured_image: "",
                sku: "",
                meta_title: "",
                meta_description: "",
                featured: false,
                images: [],
              });
              setImageFile(null);
              setImagePreview("");
              setProductImages([]);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="Product SKU"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Pricing & Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Price (₹) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Compare at Price (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.compare_at_price}
                      onChange={(e) =>
                        setFormData({ ...formData, compare_at_price: e.target.value })
                      }
                      placeholder="Original price"
                    />
                  </div>
                  <div>
                    <Label>Stock Quantity *</Label>
                    <Input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock_quantity: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Product Description</h3>
                <div>
                  <Label>Short Description</Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.short_description}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        short_description: value,
                      })
                    }
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link']
                      ]
                    }}
                  />
                </div>
                <div>
                  <Label>Full Description</Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        description: value,
                      })
                    }
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Media</h3>
                <div>
                  <Label>Product Images (Multiple)</Label>
                  <div className="mt-2 space-y-3">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleMultipleImageUpload(e.target.files)}
                      disabled={uploadingImages}
                      id="product-images"
                    />
                    {uploadingImages && (
                      <p className="text-sm text-muted-foreground">Uploading images...</p>
                    )}
                    
                    {productImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {productImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Product ${index + 1}`} 
                              className="w-full h-24 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">SEO & Metadata</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Meta Title</Label>
                    <Input
                      value={formData.meta_title}
                      onChange={(e) =>
                        setFormData({ ...formData, meta_title: e.target.value })
                      }
                      placeholder="SEO title for this product"
                    />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          meta_description: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="SEO description for this product"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Settings</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Feature this product on homepage
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : editingProduct ? "Update" : "Create"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {(product as any).categories?.name || "No category"}
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.in_stock ? "default" : "destructive"}
                      >
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleManageVariants(product.id)}
                        >
                          Variants
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
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
        </CardContent>
      </Card>

      {/* Variants Management Dialog */}
      <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Product Variants</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add Variant Form */}
            <form onSubmit={handleAddVariant} className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-semibold">Add New Variant</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Variant Type *</Label>
                  <Input
                    value={variantFormData.variant_name}
                    onChange={(e) =>
                      setVariantFormData({ ...variantFormData, variant_name: e.target.value })
                    }
                    placeholder="e.g., Size, Color"
                    required
                  />
                </div>
                <div>
                  <Label>Variant Value *</Label>
                  <Input
                    value={variantFormData.variant_value}
                    onChange={(e) =>
                      setVariantFormData({ ...variantFormData, variant_value: e.target.value })
                    }
                    placeholder="e.g., Large, Red"
                    required
                  />
                </div>
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variantFormData.price}
                    onChange={(e) =>
                      setVariantFormData({ ...variantFormData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Stock Quantity *</Label>
                  <Input
                    type="number"
                    value={variantFormData.stock_quantity}
                    onChange={(e) =>
                      setVariantFormData({ ...variantFormData, stock_quantity: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Compare at Price (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variantFormData.compare_at_price}
                    onChange={(e) =>
                      setVariantFormData({ ...variantFormData, compare_at_price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input
                    value={variantFormData.sku}
                    onChange={(e) =>
                      setVariantFormData({ ...variantFormData, sku: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={variantFormData.display_order}
                    onChange={(e) =>
                      setVariantFormData({ ...variantFormData, display_order: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Variant
              </Button>
            </form>

            {/* Variants List */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Existing Variants</h3>
              {variants.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No variants added yet. Add your first variant above.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>{variant.variant_name}</TableCell>
                        <TableCell>{variant.variant_value}</TableCell>
                        <TableCell>
                          ₹{variant.price}
                          {variant.compare_at_price && (
                            <span className="text-xs text-muted-foreground ml-2 line-through">
                              ₹{variant.compare_at_price}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={variant.in_stock ? "default" : "destructive"}>
                            {variant.stock_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>{variant.sku || "-"}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteVariant(variant.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
