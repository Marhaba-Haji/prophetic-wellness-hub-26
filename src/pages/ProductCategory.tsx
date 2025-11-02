import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  featured_image?: string;
  in_stock: boolean;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

const ProductCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      
      // First, fetch the category by slug
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categoryId)
        .eq("active", true)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Then fetch products for this category
      if (categoryData) {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", categoryData.id)
          .eq("in_stock", true)
          .order("featured", { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={`${category?.name || "Products"} | RevivoHeal Bangalore`}
      description={category?.description || `Browse our selection of products`}
      canonical={`/products/category/${categoryId}`}
      keywords={`${category?.name || "products"}, natural products, organic`}
      image={category?.image_url}
    >
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <section className="py-12 px-4 border-b">
          <div className="container mx-auto max-w-6xl">
            <Link to="/products">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
            {loading ? (
              <>
                <Skeleton className="h-12 w-64 mb-4" />
                <Skeleton className="h-6 w-96" />
              </>
            ) : category ? (
              <>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-muted-foreground">{category.description}</p>
                )}
              </>
            ) : (
              <h1 className="text-3xl font-bold text-foreground">Category Not Found</h1>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-4 pb-20">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="w-full h-64" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-6 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">
                  No products available in this category yet.
                </p>
                <Link to="/products">
                  <Button>Browse Other Categories</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                      <div className="relative overflow-hidden rounded-t-lg">
                        {product.featured_image ? (
                          <img
                            src={product.featured_image}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-64 bg-muted flex items-center justify-center">
                            <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                        {product.compare_at_price &&
                          product.compare_at_price > product.price && (
                            <Badge className="absolute top-2 right-2 bg-destructive">
                              Sale
                            </Badge>
                          )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        {product.short_description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {product.short_description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ₹{product.price}
                          </span>
                          {product.compare_at_price &&
                            product.compare_at_price > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.compare_at_price}
                              </span>
                            )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductCategory;
