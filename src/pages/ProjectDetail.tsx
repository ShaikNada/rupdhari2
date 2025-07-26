import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const HERO_MOBILE_HEIGHT = 240;  // px
const HERO_DESKTOP_HEIGHT = 320; // px

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (!error && data) setProject(data);
      setLoading(false);
    };
    if (projectId) fetchProject();
  }, [projectId]);

  if (loading) return <div className="min-h-[40vh] flex justify-center items-center">Loading...</div>;
  if (!project) return <div className="min-h-[40vh] flex justify-center items-center">Project not found.</div>;

  // --- Main image logic
  const heroImg = project.thumbnail_url || (project.images?.[0] || "");
  // Remove the hero image from the gallery if it's also included in images
  const galleryImages = project.images
    ? project.images.filter((url: string) => url && url !== project.thumbnail_url)
    : [];

  return (
    <div className="min-h-screen bg-akaroa">
      <Navigation />
      {/* STICKY HERO IMAGE + OVERLAY DESCRIPTION */}
      <section
        className={`
          sticky top-0 z-30 w-full flex items-end overflow-hidden bg-walnut
        `}
        style={{
          height: `min(${HERO_DESKTOP_HEIGHT}px, 30vh)`,
          minHeight: `${HERO_MOBILE_HEIGHT}px`,
          maxHeight: `${HERO_DESKTOP_HEIGHT}px`,
        }}
      >
        <img
          src={heroImg}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{zIndex: 1}}
        />
        {/* BG overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10" />
        {/* Description Box */}
        <div className="relative z-20 p-6 max-w-2xl w-full text-white">
          <h1 className="text-2xl md:text-4xl font-serif mb-4 drop-shadow font-bold">
            {project.name}
          </h1>
          <div className="bg-black/60 rounded-lg p-3 drop-shadow">
            <p className="text-sm md:text-base">{project.description || "No description provided."}</p>
          </div>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl font-serif mb-6 text-rhino">Project Gallery</h2>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img: string, idx: number) => (
              <Card key={idx} className="overflow-hidden aspect-[4/3]">
                <img
                  src={img}
                  alt={`${project.name} image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-sandstone text-center py-12">No gallery images available.</div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
