import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  MessageSquare, 
  ExternalLink, 
  Copy, 
  Settings,
  BarChart3,
  Calendar,
  Filter
} from "lucide-react";

const feedbackFormSchema = z.object({
  content: z.string().min(1, "Feedback content is required"),
  source: z.string().min(1, "Source is required"),
});

const collectionFormSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  description: z.string().optional(),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(["text", "rating", "multiple_choice"]),
    question: z.string(),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })),
});

export default function FeedbackCollection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const { toast } = useToast();

  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/feedback"],
  });

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["/api/feedback-collections"],
  });

  const feedbackForm = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      content: "",
      source: "",
    },
  });

  const collectionForm = useForm<z.infer<typeof collectionFormSchema>>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      questions: [
        {
          id: "1",
          type: "text",
          question: "How would you rate your overall experience?",
          required: true,
        },
      ],
    },
  });

  const createFeedbackMutation = useMutation({
    mutationFn: (data: z.infer<typeof feedbackFormSchema>) =>
      apiRequest("POST", "/api/feedback", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      feedbackForm.reset();
      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  const createCollectionMutation = useMutation({
    mutationFn: (data: z.infer<typeof collectionFormSchema>) =>
      apiRequest("POST", "/api/feedback-collections", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback-collections"] });
      collectionForm.reset();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Feedback collection created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create feedback collection",
        variant: "destructive",
      });
    },
  });

  const onSubmitFeedback = (data: z.infer<typeof feedbackFormSchema>) => {
    createFeedbackMutation.mutate(data);
  };

  const onSubmitCollection = (data: z.infer<typeof collectionFormSchema>) => {
    createCollectionMutation.mutate(data);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    }
  };

  const copyEmbedCode = (collectionId: number) => {
    const embedCode = `<iframe src="${window.location.origin}/embed/feedback/${collectionId}" width="100%" height="400" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied",
      description: "Embed code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback Collection</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Collect and organize customer feedback</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Feedback Collection</DialogTitle>
                  <DialogDescription>
                    Set up a new feedback collection form to gather insights from your audience.
                  </DialogDescription>
                </DialogHeader>
                <Form {...collectionForm}>
                  <form onSubmit={collectionForm.handleSubmit(onSubmitCollection)} className="space-y-6">
                    <FormField
                      control={collectionForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Collection Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Content Feedback Survey" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={collectionForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Help us improve our content by sharing your feedback..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createCollectionMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {createCollectionMutation.isPending ? "Creating..." : "Create Collection"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <Tabs defaultValue="collections" className="space-y-6">
            <TabsList>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="feedback">All Feedback</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="collections" className="space-y-6">
              {collectionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : collections?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((collection: any) => (
                    <Card key={collection.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{collection.name}</CardTitle>
                          <Badge variant={collection.isActive ? "default" : "secondary"}>
                            {collection.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <CardDescription>{collection.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                            <span className="font-medium">{collection.questions?.length || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Created:</span>
                            <span className="font-medium">
                              {new Date(collection.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Settings className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyEmbedCode(collection.id)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Embed
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No collections created yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                      Create your first feedback collection to start gathering insights from your audience.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Collection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Feedback</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date Range
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {feedbackLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse">
                          <div className="flex items-start space-x-4">
                            <div className="w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full mt-2"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                              <div className="flex space-x-4">
                                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : feedback?.length > 0 ? (
                    <div className="space-y-4">
                      {feedback.map((item: any) => (
                        <div key={item.id} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              item.sentiment === 'positive' ? 'bg-green-500' :
                              item.sentiment === 'negative' ? 'bg-red-500' : 'bg-amber-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white mb-2">{item.content}</p>
                              <div className="flex items-center space-x-4">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{item.source}</span>
                                <Badge variant="secondary" className={getSentimentColor(item.sentiment)}>
                                  {item.sentiment}
                                </Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(item.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No feedback collected yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Start collecting feedback through your forms or manual entry
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Feedback Entry</CardTitle>
                  <CardDescription>
                    Manually add feedback from various sources like emails, social media, or direct messages.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...feedbackForm}>
                    <form onSubmit={feedbackForm.handleSubmit(onSubmitFeedback)} className="space-y-6">
                      <FormField
                        control={feedbackForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Feedback Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter the feedback content here..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={feedbackForm.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select feedback source" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="youtube">YouTube Comment</SelectItem>
                                <SelectItem value="twitter">Twitter/X</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="direct_message">Direct Message</SelectItem>
                                <SelectItem value="survey">Survey</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        disabled={createFeedbackMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {createFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
