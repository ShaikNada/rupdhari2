import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/integrations/supabase/client";

type ProjectType = "All" | "Interior" | "Architecture";
type ProjectStatus = "All" | "Completed" | "Ongoing";

interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string | null;
  images: string[] | null;
  videos: string[] | null;
  updated_at?: string;
}

const Services = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectType, setProjectType] = useState<ProjectType>("All");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("All");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      let query = supabase.from("projects").select("*");

      if (projectType !== "All") {
        query = query.eq("type", projectType);
      }
      if (projectStatus !== "All") {
        query = query.eq("status", projectStatus);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [projectType, projectStatus]);

  return (
    <div className="min-h-screen bg-akaroa">
      <Navigation />

      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-b from-akaroa to-sandstone/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif text-rhino">
              Our Services
            </h1>
            <p className="text-lg text-walnut max-w-3xl mx-auto">
              Crafting spaces that tell your story through thoughtful design and quality craftsmanship,
              blending traditional elegance with contemporary functionality
            </p>
          </div>
        </div>
      </div>

      {/* Services Showcase Section */}
      <div className="py-16 bg-white/90">
        <div className="container mx-auto px-6">
          {/* Interior Design Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <h2 className="text-3xl font-serif text-desert">Interior Design</h2>
                <div className="w-20 h-1 bg-walnut"></div>
                <p className="text-sandstone">
                  Transform your space with our comprehensive interior design services.
                  From concept to completion, we create spaces that reflect your personality
                  and lifestyle while maintaining perfect harmony between aesthetics and functionality.
                </p>
                <ul className="space-y-2 text-rhino">
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Custom furniture design and selection</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Color consultation and material selection</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Space planning and layout optimization</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Lighting design and fixture selection</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Accessory and art curation</li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="aspect-square bg-akaroa rounded-lg overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-rhino/20"></div>
                  <div className="h-full w-full flex items-center justify-center text-white">
                    <span className="text-lg font-serif">Interior Image</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-desert/20 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-walnut/20 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>

          {/* Architecture Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="relative">
                <div className="aspect-square bg-akaroa rounded-lg overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-rhino/20"></div>
                  <div className="h-full w-full flex items-center justify-center text-white">
                    <span className="text-lg font-serif">Architecture Image</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-desert/20 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-walnut/20 rounded-lg -z-10"></div>
              </div>
            </div>
            <div>
              <div className="space-y-6">
                <h2 className="text-3xl font-serif text-desert">Architecture</h2>
                <div className="w-20 h-1 bg-walnut"></div>
                <p className="text-sandstone">
                  Our architectural services blend contemporary design with traditional charm.
                  We create structures that stand the test of time, combining innovative design
                  solutions with sustainable practices and meticulous attention to detail.
                </p>
                <ul className="space-y-2 text-rhino">
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Residential and commercial architecture</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Renovation and restoration projects</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Sustainable and eco-friendly design</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>3D visualization and modeling</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Construction documentation and supervision</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Furnishings Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <h2 className="text-3xl font-serif text-desert">Furnishings</h2>
                <div className="w-20 h-1 bg-walnut"></div>
                <p className="text-sandstone">
                  Complete your space with our curated selection of high-quality furnishings.
                  We source and create custom pieces that perfectly complement your interior design,
                  focusing on craftsmanship, comfort, and timeless appeal.
                </p>
                <ul className="space-y-2 text-rhino">
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Custom furniture design and manufacturing</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Upholstery and fabric selection</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Artisanal and handcrafted pieces</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Sustainable and eco-friendly materials</li>
                  <li className="flex items-start"><span className="text-desert mr-2">•</span>Antique restoration and refinishing</li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="aspect-square bg-akaroa rounded-lg overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-rhino/20"></div>
                  <div className="h-full w-full flex items-center justify-center text-white">
                    <span className="text-lg font-serif">Furnishings Image</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-desert/20 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-walnut/20 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section with Filtering */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif text-rhino text-center mb-12">
            Our Projects
          </h2>

          {/* Main Category Tabs */}
          <Tabs
            defaultValue="All"
            className="w-full"
            onValueChange={(value) => setProjectType(value as ProjectType)}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-akaroa/30">
                <TabsTrigger
                  value="All"
                  className="data-[state=active]:bg-desert data-[state=active]:text-white"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="Interior"
                  className="data-[state=active]:bg-desert data-[state=active]:text-white"
                >
                  Interiors
                </TabsTrigger>
                <TabsTrigger
                  value="Architecture"
                  className="data-[state=active]:bg-desert data-[state=active]:text-white"
                >
                  Architecture
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2 bg-akaroa/30 p-1 rounded-md">
                <Button
                  variant={projectStatus === "All" ? "default" : "ghost"}
                  className={
                    projectStatus === "All"
                      ? "bg-walnut text-white hover:bg-walnut/90"
                      : "text-sandstone hover:text-walnut"
                  }
                  onClick={() => setProjectStatus("All")}
                >
                  All
                </Button>
                <Button
                  variant={projectStatus === "Completed" ? "default" : "ghost"}
                  className={
                    projectStatus === "Completed"
                      ? "bg-walnut text-white hover:bg-walnut/90"
                      : "text-sandstone hover:text-walnut"
                  }
                  onClick={() => setProjectStatus("Completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={projectStatus === "Ongoing" ? "default" : "ghost"}
                  className={
                    projectStatus === "Ongoing"
                      ? "bg-walnut text-white hover:bg-walnut/90"
                      : "text-sandstone hover:text-walnut"
                  }
                  onClick={() => setProjectStatus("Ongoing")}
                >
                  Ongoing
                </Button>
              </div>
            </div>

            {/* Project Cards */}
            <TabsContent value="All" className="mt-0">
              {renderProjects()}
            </TabsContent>
            <TabsContent value="Interior" className="mt-0">
              {renderProjects()}
            </TabsContent>
            <TabsContent value="Architecture" className="mt-0">
              {renderProjects()}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );

  function renderProjects() {
    if (loading) {
      return (
        <div className="text-center py-12">
          <p className="text-sandstone">Loading projects...</p>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-sandstone">No projects found. Check back soon!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block hover:opacity-95 transition-opacity"
            style={{ textDecoration: "none" }}
          >
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    );
  }
};

export default Services;
