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
        <Card>
          <CardContent>
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
            </div>
            <div className="p-4">
              <h3 className="text-lg font-serif text-rhino font-bold truncate">{project.name}</h3>
              <p className="text-sandstone text-sm truncate">{project.description || 'No description available.'}</p>
            </div>
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
            <div className="relative flex flex-col items-center">
              <div className="flex flex-col items-start w-full">
                <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow mt-2 ml-2">Ongoing</span>
                <span className="text-sandstone text-xs font-medium mt-1 ml-2">Will be available soon.</span>
              </div>
              <div className="mt-2 mb-2 flex items-center justify-center">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.name}
                    className="w-[340px] h-[190px] object-cover rounded-md border border-muted"
                  />
                ) : (
                  <Clock className="h-16 w-16 mx-auto mb-4 text-sandstone opacity-50" />
                )}
              </div>
              <div className="text-center px-4 pb-2 w-full">
                <h3 className="text-xl font-serif text-rhino mt-2">{project.name}</h3>
                <p className="text-sandstone text-sm mt-2">{project.description || 'No description available.'}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCard;
