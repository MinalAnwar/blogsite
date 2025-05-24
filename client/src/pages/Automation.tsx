import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Trash2,
  ArrowRight,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Mail,
  MessageSquare,
  Tag,
  FileText
} from "lucide-react";

const automationRuleSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  description: z.string().optional(),
  trigger: z.enum(["new_feedback", "sentiment_threshold", "keyword_match", "time_based"]),
  conditions: z.object({
    sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
    keywords: z.array(z.string()).optional(),
    threshold: z.number().optional(),
    schedule: z.string().optional(),
  }),
  actions: z.object({
    type: z.enum(["categorize", "notify", "create_content", "tag", "respond"]),
    parameters: z.record(z.any()),
  }),
  isActive: z.boolean(),
});

export default function Automation() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const { toast } = useToast();

  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ["/api/automation-rules"],
  });

  const ruleForm = useForm<z.infer<typeof automationRuleSchema>>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      trigger: "new_feedback",
      conditions: {},
      actions: {
        type: "categorize",
        parameters: {},
      },
      isActive: true,
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: (data: z.infer<typeof automationRuleSchema>) =>
      apiRequest("POST", "/api/automation-rules", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automation-rules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      ruleForm.reset();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Automation rule created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create automation rule",
        variant: "destructive",
      });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<z.infer<typeof automationRuleSchema>> }) =>
      apiRequest("PUT", `/api/automation-rules/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automation-rules"] });
      setEditingRule(null);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Automation rule updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update automation rule",
        variant: "destructive",
      });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/automation-rules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automation-rules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Automation rule deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete automation rule",
        variant: "destructive",
      });
    },
  });

  const toggleRuleStatus = (rule: any) => {
    updateRuleMutation.mutate({
      id: rule.id,
      data: { isActive: !rule.isActive },
    });
  };

  const onSubmitRule = (data: z.infer<typeof automationRuleSchema>) => {
    if (editingRule) {
      updateRuleMutation.mutate({ id: editingRule.id, data });
    } else {
      createRuleMutation.mutate(data);
    }
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    ruleForm.reset({
      name: rule.name,
      description: rule.description || "",
      trigger: rule.trigger,
      conditions: rule.conditions || {},
      actions: rule.actions || { type: "categorize", parameters: {} },
      isActive: rule.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleNewRule = () => {
    setEditingRule(null);
    ruleForm.reset();
    setIsDialogOpen(true);
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "new_feedback":
        return MessageSquare;
      case "sentiment_threshold":
        return AlertCircle;
      case "keyword_match":
        return Tag;
      case "time_based":
        return Clock;
      default:
        return Bot;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "categorize":
        return Tag;
      case "notify":
        return Mail;
      case "create_content":
        return FileText;
      case "respond":
        return MessageSquare;
      default:
        return Zap;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
  };

  // Predefined automation templates
  const automationTemplates = [
    {
      name: "Auto-categorize feedback by sentiment",
      description: "Automatically sorts feedback into positive, neutral, and negative categories",
      trigger: "new_feedback",
      actions: { type: "categorize", parameters: { method: "sentiment" } },
    },
    {
      name: "Weekly feedback digest",
      description: "Sends a summary of feedback trends every Monday",
      trigger: "time_based",
      actions: { type: "notify", parameters: { schedule: "weekly", day: "monday" } },
    },
    {
      name: "Content suggestion generator",
      description: "Creates content ideas based on common feedback themes",
      trigger: "keyword_match",
      actions: { type: "create_content", parameters: { type: "suggestion" } },
    },
    {
      name: "Negative feedback alerts",
      description: "Sends instant notifications for negative feedback",
      trigger: "sentiment_threshold",
      actions: { type: "notify", parameters: { immediate: true } },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automation Rules</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Configure intelligent workflows to automate feedback processing</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button onClick={handleNewRule} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Rule
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          <Tabs defaultValue="rules" className="space-y-6">
            <TabsList>
              <TabsTrigger value="rules">Active Rules</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="history">Execution History</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-6">
              {rulesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
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
              ) : rules?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rules.map((rule: any) => {
                    const TriggerIcon = getTriggerIcon(rule.trigger);
                    const ActionIcon = getActionIcon(rule.actions?.type);
                    
                    return (
                      <Card key={rule.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  rule.isActive 
                                    ? "bg-green-100 dark:bg-green-900/20" 
                                    : "bg-gray-100 dark:bg-gray-700"
                                }`}>
                                  <Bot className={`w-5 h-5 ${
                                    rule.isActive 
                                      ? "text-green-600 dark:text-green-400" 
                                      : "text-gray-400"
                                  }`} />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                                  <Badge className={getStatusColor(rule.isActive)}>
                                    {rule.isActive ? "Active" : "Paused"}
                                  </Badge>
                                </div>
                              </div>
                              <CardDescription>{rule.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Workflow visualization */}
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <TriggerIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-blue-700 dark:text-blue-300 font-medium">
                                  {rule.trigger.replace("_", " ")}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <ActionIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-purple-700 dark:text-purple-300 font-medium">
                                  {rule.actions?.type?.replace("_", " ") || "Action"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Created {new Date(rule.createdAt).toLocaleDateString()}</span>
                              <span>Last run: Never</span>
                            </div>

                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleEditRule(rule)}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => toggleRuleStatus(rule)}
                                disabled={updateRuleMutation.isPending}
                              >
                                {rule.isActive ? (
                                  <Pause className="w-4 h-4 mr-2" />
                                ) : (
                                  <Play className="w-4 h-4 mr-2" />
                                )}
                                {rule.isActive ? "Pause" : "Activate"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteRuleMutation.mutate(rule.id)}
                                disabled={deleteRuleMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Bot className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No automation rules configured
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                      Set up intelligent workflows to automate feedback processing and save time.
                    </p>
                    <Button onClick={handleNewRule} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Rule
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {automationTemplates.map((template, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-blue-700 dark:text-blue-300 font-medium">
                              {template.trigger.replace("_", " ")}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <span className="text-purple-700 dark:text-purple-300 font-medium">
                              {template.actions.type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            ruleForm.reset({
                              name: template.name,
                              description: template.description,
                              trigger: template.trigger as any,
                              conditions: {},
                              actions: template.actions as any,
                              isActive: true,
                            });
                            setEditingRule(null);
                            setIsDialogOpen(true);
                          }}
                        >
                          Use This Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Execution History</CardTitle>
                  <CardDescription>Recent automation rule executions and their results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No execution history available</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Automation executions will appear here once rules start running
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Rule Creation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRule ? "Edit Automation Rule" : "Create Automation Rule"}</DialogTitle>
              <DialogDescription>
                {editingRule ? "Modify your automation rule" : "Set up a new automation rule to streamline your workflow"}
              </DialogDescription>
            </DialogHeader>
            <Form {...ruleForm}>
              <form onSubmit={ruleForm.handleSubmit(onSubmitRule)} className="space-y-6">
                <FormField
                  control={ruleForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Auto-categorize feedback by sentiment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ruleForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what this automation rule does..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={ruleForm.control}
                    name="trigger"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trigger</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trigger" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new_feedback">New Feedback</SelectItem>
                            <SelectItem value="sentiment_threshold">Sentiment Threshold</SelectItem>
                            <SelectItem value="keyword_match">Keyword Match</SelectItem>
                            <SelectItem value="time_based">Time Based</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={ruleForm.control}
                    name="actions.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="categorize">Categorize</SelectItem>
                            <SelectItem value="notify">Send Notification</SelectItem>
                            <SelectItem value="create_content">Create Content</SelectItem>
                            <SelectItem value="tag">Add Tags</SelectItem>
                            <SelectItem value="respond">Auto Respond</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={ruleForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Activate Rule</FormLabel>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Enable this automation rule to start processing
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createRuleMutation.isPending || updateRuleMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {(createRuleMutation.isPending || updateRuleMutation.isPending) 
                      ? "Saving..." 
                      : editingRule ? "Update Rule" : "Create Rule"
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
