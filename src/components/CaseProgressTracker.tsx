import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Award, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Milestone {
  id: string;
  milestone_type: string;
  title: string;
  description: string | null;
  completed: boolean;
  completed_at: string | null;
  order_index: number;
}

interface CaseProgressTrackerProps {
  caseId: string;
}

export default function CaseProgressTracker({ caseId }: CaseProgressTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadMilestones();
    initializeMilestones();
  }, [caseId]);

  useEffect(() => {
    calculateProgress();
  }, [milestones]);

  const initializeMilestones = async () => {
    // Check if milestones exist for this case
    const { data: existing } = await supabase
      .from('case_milestones')
      .select('id')
      .eq('case_id', caseId)
      .limit(1);

    if (existing && existing.length > 0) return;

    // Create default milestones
    const defaultMilestones = [
      { title: "Case Created", description: "Your case has been initiated", order_index: 1 },
      { title: "Information Gathered", description: "All required details collected", order_index: 2 },
      { title: "Documents Prepared", description: "Forms and evidence organized", order_index: 3 },
      { title: "Filing Ready", description: "Ready to submit to tribunal", order_index: 4 },
      { title: "Filed Successfully", description: "Case submitted to authorities", order_index: 5 },
      { title: "Hearing Scheduled", description: "Date and time confirmed", order_index: 6 },
      { title: "Case Resolved", description: "Final outcome received", order_index: 7 },
    ];

    for (const milestone of defaultMilestones) {
      await supabase
        .from('case_milestones')
        .insert({
          case_id: caseId,
          milestone_type: 'default',
          ...milestone,
          completed: milestone.order_index === 1, // First milestone auto-completed
        });
    }

    loadMilestones();
  };

  const loadMilestones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('case_milestones')
      .select('*')
      .eq('case_id', caseId)
      .order('order_index');

    if (error) {
      console.error('Error loading milestones:', error);
      toast.error('Failed to load progress');
    } else {
      setMilestones(data || []);
    }
    setLoading(false);
  };

  const calculateProgress = () => {
    if (milestones.length === 0) {
      setProgress(0);
      return;
    }
    const completed = milestones.filter(m => m.completed).length;
    setProgress(Math.round((completed / milestones.length) * 100));
  };

  const toggleMilestone = async (milestone: Milestone) => {
    const newCompleted = !milestone.completed;
    
    const { error } = await supabase
      .from('case_milestones')
      .update({ 
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null
      })
      .eq('id', milestone.id);

    if (error) {
      console.error('Error updating milestone:', error);
      toast.error('Failed to update milestone');
    } else {
      setMilestones(prev => 
        prev.map(m => m.id === milestone.id 
          ? { ...m, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
          : m
        )
      );
      toast.success(newCompleted ? 'Milestone completed! 🎉' : 'Milestone unmarked');
    }
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-muted rounded mb-4 w-1/3" />
        <div className="h-2 bg-muted rounded mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </Card>
    );
  }

  const completedCount = milestones.filter(m => m.completed).length;
  const estimatedHours = Math.max(1, (milestones.length - completedCount) * 2);

  return (
    <Card className="p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Your Progress</h3>
          <Badge variant={progress === 100 ? "default" : "secondary"} className="text-lg px-3 py-1">
            {progress}%
          </Badge>
        </div>
        <Progress value={progress} className="h-3 mb-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{completedCount} of {milestones.length} milestones completed</span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            ~{estimatedHours}h remaining
          </span>
        </div>
      </div>

      {/* Motivational Message */}
      {progress > 0 && progress < 100 && (
        <div className="bg-primary/10 rounded-lg p-4 mb-6 border border-primary/20">
          <p className="text-sm font-medium text-primary">
            {progress < 25 && "🚀 Great start! You're on your way to resolving your case."}
            {progress >= 25 && progress < 50 && "💪 Keep going! You're making excellent progress."}
            {progress >= 50 && progress < 75 && "⭐ Halfway there! You're doing amazing."}
            {progress >= 75 && progress < 100 && "🎯 Almost done! The finish line is in sight."}
          </p>
        </div>
      )}

      {progress === 100 && (
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-6 mb-6 text-center border-2 border-primary">
          <Award className="w-12 h-12 mx-auto mb-3 text-primary" />
          <h4 className="text-xl font-bold mb-2">Congratulations! 🎉</h4>
          <p className="text-muted-foreground">
            You've completed all milestones. Your case is ready for submission!
          </p>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
              milestone.completed 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-card hover:bg-muted/50'
            }`}
            onClick={() => toggleMilestone(milestone)}
          >
            <div className="flex-shrink-0 mt-0.5">
              {milestone.completed ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium ${milestone.completed ? 'text-primary' : ''}`}>
                  {milestone.title}
                </h4>
                {milestone.completed && (
                  <Badge variant="outline" className="text-xs">
                    ✓ Done
                  </Badge>
                )}
              </div>
              {milestone.description && (
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              )}
              {milestone.completed_at && (
                <p className="text-xs text-muted-foreground mt-1">
                  Completed {new Date(milestone.completed_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
