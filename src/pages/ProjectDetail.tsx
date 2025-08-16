import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const HERO_MOBILE_HEIGHT = 240;
const HERO_DESKTOP_HEIGHT = 320;

const badgeColors = {
  Completed: "bg-green-600 text-white",
  Ongoing: "bg-yellow-500 text-white",
  Upcoming: "bg-gray-500 text-white",
  Interior: "bg-desert text-white",
  Architecture: "bg-walnut text-white",
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
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

  const heroImg = project.thumbnail_url || (project.images?.[0] || "");
  const galleryImages = project.images
    ? project.images.filter((url) => url && url !== project.thumbnail_url)
    : [];
  const videoUrl = project.videos && project.videos[0];

  return (
    <div className="min-h-screen bg-akaroa">
      <Navigation />

      {/* STICKY HERO IMAGE + BADGES */}
      <section
        className="sticky top-0 z-30 w-full flex items-end overflow-hidden bg-walnut"
        style={{
          height: `min(${HERO_DESKTOP_HEIGHT}px, 30vh)`,
          minHeight: `${HERO_MOBILE_HEIGHT}px`,
          maxHeight: `${HERO_DESKTOP_HEIGHT}px`,
        }}
      >
        {/* Hero image */}
        <img
          src={heroImg}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ zIndex: 1 }}
          loading="lazy"
        />
        {/* BG overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10" />
        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-row gap-2 z-20">
          {project.type && (
            <span className={`px-3 py-1 rounded-xl text-xs font-semibold shadow ${badgeColors[project.type] || "bg-desert text-white"}`}>
              {project.type}
            </span>
          )}
          {project.status && (
            <span className={`px-3 py-1 rounded-xl text-xs font-semibold shadow ${badgeColors[project.status] || "bg-walnut text-white"}`}>
              {project.status}
            </span>
          )}
        </div>
        {/* Project name only */}
        <div className="relative z-20 p-6 max-w-2xl w-full text-white">
          <h1 className="text-2xl md:text-4xl font-serif mb-4 drop-shadow font-bold">
            {project.name}
          </h1>
        </div>
      </section>

      {/* PROJECT DESCRIPTION (separate section) */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl md:text-2xl font-serif mb-4 text-rhino">About This Project</h2>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-gray-800 text-base md:text-lg">
            {project.description || "No description provided."}
          </p>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl font-serif mb-6 text-rhino">Project Gallery</h2>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <Card key={idx} className="overflow-hidden aspect-[4/3] group cursor-zoom-in">
                <Zoom>
                  <img
                    src={img}
                    alt={`${project.name} image ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    style={{
                      minWidth: '100%',
                      minHeight: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'cover',
                      background: '#eee',
                    }}
                  />
                </Zoom>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-sandstone text-center py-12">No gallery images available.</div>
        )}
      </section>

      {/* VIDEO SECTION */}
      {videoUrl && (
        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-xl md:text-2xl font-serif mb-6 text-rhino">Project Video</h2>
          <div className="bg-black rounded-lg overflow-hidden max-w-3xl mx-auto">
            <video
              src={videoUrl}
              controls
              preload="auto"
              className="w-full h-[220px] md:h-[340px] bg-black"
              poster={heroImg}
              style={{
                maxWidth: '100%',
                height: 'auto',
                background: '#000',
              }}
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetail;
