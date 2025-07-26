// components/dashboard/ProjectCard.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    type: string;
    status: string;
    description: string | null;
    thumbnail_url: string | null;
    images: string[] | null;
    video_url: string | null;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isCompleted = project.status === 'Completed';
  const isOngoing = project.status === 'Ongoing';
  const hasImages = project.images && project.images.length > 0;
  const hasVideo = !!project.video_url;

  const handleNextImage = () => {
    if (project.images && currentImageIndex < project.images.length - 1)
      setCurrentImageIndex(currentImageIndex + 1);
  };
  const handlePrevImage = () => {
    if (currentImageIndex > 0)
      setCurrentImageIndex(currentImageIndex - 1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-elegant">
          <div className="relative h-48 bg-muted">
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-akaroa text-rhino">
                {project.type}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rhino/80 to-transparent p-2">
              <span className={`text-xs font-medium text-white px-2 py-1 rounded-full ${
                isCompleted ? 'bg-desert' : 'bg-sandstone'
              }`}>{project.status}</span>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-serif text-rhino">{project.name}</h3>
            <p className="text-sm text-sandstone mt-1">{project.type}</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <div className="flex flex-col space-y-4">
          {isCompleted ? (
            <>
              {hasImages ? (
                <div className="relative">
                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    <img
                      src={project.images![currentImageIndex]}
                      alt={`${project.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {project.images!.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/80 hover:bg-white"
                        onClick={handlePrevImage}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/80 hover:bg-white"
                        onClick={handleNextImage}
                        disabled={!project.images || currentImageIndex === project.images.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4">
                    <span className="text-xs bg-white/80 px-2 py-1 rounded-full">
                      {currentImageIndex + 1} / {project.images!.length}
                    </span>
                  </div>
                </div>
              ) : hasVideo && (
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <video
                    src={project.video_url || ''}
                    controls
                    className="w-full h-full"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
              <div className="text-center p-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-sandstone opacity-50" />
                <h3 className="text-xl font-serif text-rhino">
                  {isOngoing ? "Project In Progress" : "Project"}
                </h3>
                <p className="text-sandstone mt-2">
                  {isOngoing
                    ? "This project is currently ongoing. Check back later for images and updates."
                    : "Project details will be available soon."}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-lg font-serif text-rhino">Project Details</h2>
            <p className="text-sandstone text-sm">
              {project.description || 'No description available.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCard;
