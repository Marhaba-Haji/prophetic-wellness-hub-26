import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ShoppingCart, Package, Truck } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  featured_image?: string;
  images?: string[];
  in_stock: boolean;
  stock_quantity: number;
  category: string;
  sku?: string;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      setProduct(data);
      setSelectedImage(data.featured_image || "");
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const allImages = product
    ? [
        product.featured_image,
        ...(product.images || []),
      ].filter((img): img is string => !!img)
    : [];

  if (loading) {
    return (
      <Layout
        title="Loading... | RevivoHeal Bangalore"
        description="Loading product details"
        canonical={`/products/${slug}`}
        keywords="products"
        image={undefined}
      >
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="w-full h-96" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout
        title="Product Not Found | RevivoHeal Bangalore"
        description="Product not found"
        canonical="/products"
        keywords="products"
        image={undefined}
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) /
          product.compare_at_price) *
          100
      )
    : 0;

  return (
    <Layout
      title={`${product.name} | RevivoHeal Bangalore`}
      description={product.short_description || product.description || `Buy ${product.name}`}
      canonical={`/products/${product.slug}`}
      image={product.featured_image}
      keywords={`${product.name}, ${product.category}, natural products`}
    >
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Link to={`/products/category/${product.category}`}>
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {product.category}
            </Button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-muted">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center">
                    <ShoppingCart className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`border-2 rounded-lg overflow-hidden ${
                        selectedImage === img
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2">{product.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {product.name}
                </h1>
                {product.short_description && (
                  <p className="text-lg text-muted-foreground">
                    {product.short_description}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.price}
                </span>
                {product.compare_at_price &&
                  product.compare_at_price > product.price && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        ₹{product.compare_at_price}
                      </span>
                      <Badge variant="destructive">{discount}% OFF</Badge>
                    </>
                  )}
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">
                      {product.in_stock ? (
                        <span className="text-green-600 font-medium">
                          In Stock ({product.stock_quantity} available)
                        </span>
                      ) : (
                        <span className="text-destructive font-medium">
                          Out of Stock
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Free delivery on orders above ₹500
                    </span>
                  </div>
                  {product.sku && (
                    <div className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                size="lg"
                className="w-full"
                disabled={!product.in_stock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.in_stock ? "Add to Cart" : "Out of Stock"}
              </Button>

              {product.description && (
                <div className="pt-6 border-t">
                  <h2 className="text-2xl font-semibold mb-4">
                    Product Description
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
