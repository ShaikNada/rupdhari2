// components/dashboard/ProjectsTab.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Briefcase, RefreshCw, Trash2, Edit, Video } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import ProjectCard from './ProjectCard'; // Adjust path as needed

const ProjectsTab = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    type: 'Interior',
    status: 'Ongoing',
    description: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectImagePreviews, setProjectImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    setProjectsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
    setProjectsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- File Handlers ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setProjectImages((prev) => [...prev, ...newFiles]);
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProjectImagePreviews(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeProjectImage = (index: number) => {
    setProjectImages((prev) => prev.filter((_, i) => i !== index));
    setProjectImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Form Logic ---
  const resetForm = () => {
    setProjectData({
      name: '',
      type: 'Interior',
      status: 'Ongoing',
      description: '',
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setProjectImages([]);
    setProjectImagePreviews([]);
    setVideoFile(null);
    setVideoPreview(null);
    setEditingProject(null);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectsLoading(true);

    let thumbnailUrl = editingProject?.thumbnail_url || '';
    if (thumbnailFile && !editingProject) {
      thumbnailUrl = thumbnailPreview || '';
    }

    // For simplicity, images/videos are stored as previews (base64); in production, upload to storage and save URLs
    const images = projectImagePreviews;
    const videos = videoPreview ? [videoPreview] : [];

    if (editingProject) {
      // Update
      await supabase
        .from('projects')
        .update({
          name: projectData.name,
          type: projectData.type,
          status: projectData.status,
          description: projectData.description,
          thumbnail_url: thumbnailUrl,
          images,
          videos,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProject.id);
    } else {
      // Insert
      await supabase
        .from('projects')
        .insert([{
          name: projectData.name,
          type: projectData.type,
          status: projectData.status,
          description: projectData.description,
          thumbnail_url: thumbnailUrl,
          images,
          videos,
          updated_at: new Date().toISOString(),
        }]);
    }
    resetForm();
    fetchProjects();
    setProjectsLoading(false);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setProjectData({
      name: project.name,
      type: project.type,
      status: project.status,
      description: project.description,
    });
    setThumbnailPreview(project.thumbnail_url || null);
    setProjectImagePreviews(project.images || []);
    setVideoPreview(project.videos?.[0] || null);
  };

  const handleDelete = async (id: string) => {
    setProjectsLoading(true);
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
    setProjectsLoading(false);
  };

  // --- UI ---
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-secondary/20 to-secondary/30">
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5" />
          <span>Projects Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Form */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          {editingProject && (
            <Button variant="outline" size="sm" onClick={resetForm}>
              Cancel Editing
            </Button>
          )}
        </div>
        <form onSubmit={handleAddProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium">Project Thumbnail *</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-desert/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                  required={!thumbnailPreview && !editingProject}
                />
                <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <div className="space-y-3">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="h-40 w-40 object-cover rounded-lg mx-auto shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-desert/10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-desert" />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {thumbnailPreview ? 'Click to change thumbnail' : 'Upload project thumbnail'}
                    </p>
                  </div>
                </Label>
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Modern Apartment Interior"
                value={projectData.name}
                onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                className="h-12"
                required
              />
              <Label htmlFor="type">Project Type *</Label>
              <Select
                value={projectData.type}
                onValueChange={(value) => setProjectData({ ...projectData, type: value })}
                required
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interior">Interior</SelectItem>
                  <SelectItem value="Architecture">Architecture</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="status">Project Status *</Label>
              <Select
                value={projectData.status}
                onValueChange={(value) => setProjectData({ ...projectData, status: value })}
                required
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select project status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Project description..."
                value={projectData.description || ''}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              />
            </div>
          </div>
          {projectData.status === 'Completed' && (
            <>
              <div className="space-y-4">
                <Label>Project Images</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-desert/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProjectImagesChange}
                    className="hidden"
                    id="project-images-upload"
                  />
                  <Label htmlFor="project-images-upload" className="cursor-pointer">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-desert/10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-desert" />
                      </div>
                      <p className="text-sm text-muted-foreground">Click to upload project images</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hold Ctrl (or Cmd) to select multiple files
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {projectImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img src={preview} alt={`Project image ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeProjectImage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {projectImagePreviews.length === 0 && (
                    <div className="col-span-full text-center py-8 border-2 border-dashed border-border rounded-xl">
                      <p className="text-muted-foreground">No project images added yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Click to upload images</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-base font-medium">Project Video (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-desert/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <Label htmlFor="video-upload" className="cursor-pointer">
                    <div className="space-y-3">
                      {videoPreview ? (
                        <div className="aspect-video max-w-md mx-auto bg-black rounded-lg overflow-hidden">
                          <video src={videoPreview} controls className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-desert/10 rounded-full flex items-center justify-center mx-auto">
                          <Video className="w-8 h-8 text-desert" />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {videoPreview ? 'Click to change video' : 'Upload project video'}
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </>
          )}
          <div className="flex space-x-4">
            <Button
              type="submit"
              className="flex-1 h-12 bg-desert hover:bg-desert/90 text-white"
              disabled={projectsLoading}
            >
              {projectsLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {editingProject ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  {editingProject ? 'Update Project' : 'Save Project'}
                </>
              )}
            </Button>
          </div>
        </form>
        {/* Projects List */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Edit Existing Projects</h3>
            <Button variant="outline" size="sm" onClick={fetchProjects} disabled={projectsLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${projectsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {projectsLoading && projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <p className="text-muted-foreground">No projects found</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first project using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    ...project,
                    video_url: project.videos?.[0] ?? null,
                    images: project.images || [],
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsTab;
