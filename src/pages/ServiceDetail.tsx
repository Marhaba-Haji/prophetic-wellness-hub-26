import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { serviceContent } from "@/data/serviceContent";
import {
  Clock,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Heart,
  Shield,
  Calendar,
  ArrowRight,
} from "lucide-react";
import NotFound from "./NotFound";

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  if (!serviceId || !serviceContent[serviceId]) {
    return <NotFound />;
  }

  const service = serviceContent[serviceId];

  return (
    <Layout
      title={service.seoTitle}
      description={service.seoDescription}
      keywords={service.keywords}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4">
            {service.title}
          </h1>
          <div className="h-1 w-24 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {service.shortDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2 bg-brand-green/10 text-brand-green"
            >
              <Clock className="h-4 w-4 mr-2" />
              {service.duration}
            </Badge>
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2 bg-brand-gold/10 text-amber-700"
            >
              <IndianRupee className="h-4 w-4 mr-2" />
              {service.price}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About This Treatment */}
            <Card className="border-t-4 border-t-brand-green">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-green flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  About This Treatment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.longDescription}
                </p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-t-4 border-t-brand-gold">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-green flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Treatment Process */}
            <Card className="border-t-4 border-t-brand-green">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-green flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  Treatment Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-brand-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What We Treat */}
            <Card className="border-t-4 border-t-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-green flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  Conditions We Treat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.conditions.map((condition, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-700 font-medium">
                        {condition}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Aftercare */}
            <Card className="border-t-4 border-t-brand-gold">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-green">
                  Post-Treatment Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {service.aftercare.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{instruction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Appointment */}
            <Card className="bg-brand-green text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">
                  Ready to Begin Your Healing Journey?
                </h3>
                <p className="mb-6 text-brand-green-light">
                  Book your appointment today and experience the benefits of
                  professional therapy.
                </p>
                <Link to="/booking">
                  <Button className="w-full bg-brand-gold hover:bg-brand-gold/90 text-white font-semibold py-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-green">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  <strong>Phone:</strong>
                  <br />
                  +91 9480389296
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong>
                  <br />
                  revivoheal@gmail.com
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong>
                  <br />
                  Paramount Avenue, 63/1, 3rd floor,
                  <br />
                  Mosque Road Cross, Frazer Town,
                  <br />
                  Bangalore 560005
                </p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full mt-4">
                    Get Directions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Other Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-green">
                  Other Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.values(serviceContent)
                    .filter((s) => s.id !== serviceId)
                    .map((otherService) => (
                      <Link
                        key={otherService.id}
                        to={`/service/${otherService.id}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-brand-green hover:text-brand-green-dark font-medium">
                          {otherService.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;
