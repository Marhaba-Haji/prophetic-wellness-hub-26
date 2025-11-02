import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Droplets, 
  Milk, 
  Flame, 
  Leaf, 
  Droplet, 
  Coffee,
  Beaker
} from "lucide-react";

const categories = [
  {
    id: "beauty",
    name: "Beauty",
    description: "Natural beauty and skincare products",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "hygiene",
    name: "Hygiene",
    description: "Essential hygiene and wellness items",
    icon: Droplets,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "dairy",
    name: "Dairy",
    description: "Fresh and organic dairy products",
    icon: Milk,
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: "spices",
    name: "Spices",
    description: "Authentic and aromatic spices",
    icon: Flame,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "superfoods",
    name: "Superfoods",
    description: "Nutrient-rich superfoods",
    icon: Leaf,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "oils",
    name: "Oils",
    description: "Pure and natural oils",
    icon: Droplet,
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "honey",
    name: "Honey",
    description: "Pure organic honey varieties",
    icon: Coffee,
    color: "from-amber-600 to-yellow-600",
  },
  {
    id: "vinegars",
    name: "Vinegars",
    description: "Artisanal vinegar selections",
    icon: Beaker,
    color: "from-purple-500 to-pink-500",
  },
];

const Products = () => {
  return (
    <Layout
      title="Our Products | RevivoHeal Bangalore"
      description="Browse our selection of natural, organic beauty products, dairy, spices, superfoods, oils, honey, and vinegars"
      canonical="/products"
      keywords="natural products, organic products, beauty, dairy, spices, superfoods"
      image={undefined}
    >
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover our carefully curated selection of natural, organic, and
              authentic products for your wellness journey
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 px-4 pb-20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.id}
                    to={`/products/category/${category.id}`}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center h-full">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Products;
