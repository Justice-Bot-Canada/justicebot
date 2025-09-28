import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Play, Pause, RotateCcw, BookOpen, FileText, Scale } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'interactive' | 'quiz';
  action?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  correctAnswer?: number;
  tips?: string[];
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
}

const tutorials: Tutorial[] = [
  {
    id: 'small-claims-basics',
    title: 'Small Claims Court Basics',
    description: 'Learn the fundamentals of filing a small claims court case',
    category: 'Small Claims',
    estimatedTime: 15,
    difficulty: 'beginner',
    steps: [
      {
        id: 'intro',
        title: 'What is Small Claims Court?',
        content: 'Small Claims Court is designed to resolve disputes involving smaller amounts of money quickly and affordably. In Ontario, you can claim up to $35,000.',
        type: 'text',
        tips: ['Cases are heard by Deputy Judges', 'Lawyers are not required', 'Process is simplified']
      },
      {
        id: 'eligibility',
        title: 'Who Can Use Small Claims Court?',
        content: 'Anyone can file a claim if they are 18 or older and the dispute is within the monetary limit.',
        type: 'quiz',
        quizQuestion: 'What is the maximum amount you can claim in Ontario Small Claims Court?',
        quizOptions: ['$25,000', '$35,000', '$50,000', '$100,000'],
        correctAnswer: 1
      },
      {
        id: 'filing',
        title: 'How to File Your Claim',
        content: 'Complete the Plaintiff\'s Claim form, pay the filing fee, and serve the defendant.',
        type: 'interactive',
        action: 'Review the filing checklist and complete each step'
      }
    ]
  },
  {
    id: 'ltb-tenant-rights',
    title: 'Tenant Rights at the LTB',
    description: 'Understanding your rights as a tenant and how to file applications',
    category: 'Landlord & Tenant',
    estimatedTime: 20,
    difficulty: 'intermediate',
    steps: [
      {
        id: 'intro',
        title: 'Your Rights as a Tenant',
        content: 'The Residential Tenancies Act protects tenants in Ontario. Learn about your fundamental rights.',
        type: 'text',
        tips: ['Right to quiet enjoyment', 'Right to essential services', 'Protection from illegal rent increases']
      },
      {
        id: 'applications',
        title: 'Common Tenant Applications',
        content: 'Learn about T1 (rent reduction), T2 (tenant rights), and T6 (maintenance) applications.',
        type: 'quiz',
        quizQuestion: 'Which application form do you use to request a rent reduction?',
        quizOptions: ['T1', 'T2', 'T6', 'L1'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'hrto-discrimination',
    title: 'Filing a Human Rights Complaint',
    description: 'Step-by-step guide to filing with the Human Rights Tribunal',
    category: 'Human Rights',
    estimatedTime: 25,
    difficulty: 'advanced',
    steps: [
      {
        id: 'grounds',
        title: 'Grounds for Human Rights Complaints',
        content: 'Learn about the protected grounds under the Human Rights Code.',
        type: 'text',
        tips: ['Race, ancestry, place of origin', 'Religion, creed, age', 'Sex, sexual orientation', 'Disability, family status']
      },
      {
        id: 'timeline',
        title: 'Important Deadlines',
        content: 'You generally have one year from the last incident to file your application.',
        type: 'quiz',
        quizQuestion: 'How long do you typically have to file an HRTO application?',
        quizOptions: ['6 months', '1 year', '2 years', '3 years'],
        correctAnswer: 1
      }
    ]
  }
];

interface InteractiveTutorialProps {
  tutorialId?: string;
}

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ tutorialId }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (tutorialId) {
      const tutorial = tutorials.find(t => t.id === tutorialId);
      if (tutorial) {
        setSelectedTutorial(tutorial);
      }
    }
  }, [tutorialId]);

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < (selectedTutorial?.steps.length || 0) - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleQuizAnswer = (stepId: string, answerIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [stepId]: answerIndex }));
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setUserAnswers({});
    setShowResults(false);
    setIsPlaying(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Small Claims': return <Scale className="h-4 w-4" />;
      case 'Landlord & Tenant': return <FileText className="h-4 w-4" />;
      case 'Human Rights': return <BookOpen className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedTutorial) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Interactive Legal Tutorials</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn legal processes step-by-step with our interactive tutorials. 
            Each tutorial includes quizzes, tips, and practical guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedTutorial(tutorial)}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  {getCategoryIcon(tutorial.category)}
                  <Badge variant="secondary" className={getDifficultyColor(tutorial.difficulty)}>
                    {tutorial.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{tutorial.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {tutorial.estimatedTime} min • {tutorial.steps.length} steps
                  </span>
                  <Button size="sm">
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showResults) {
    const quizSteps = selectedTutorial.steps.filter(step => step.type === 'quiz');
    const correctAnswers = quizSteps.filter(step => 
      userAnswers[step.id] === step.correctAnswer
    ).length;
    const totalQuizzes = quizSteps.length;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Tutorial Complete!</CardTitle>
          <p className="text-muted-foreground">
            Congratulations on completing "{selectedTutorial.title}"
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalQuizzes > 0 && (
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {correctAnswers}/{totalQuizzes}
              </div>
              <p className="text-muted-foreground">Quiz Questions Correct</p>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <Button onClick={resetTutorial} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Tutorial
            </Button>
            <Button onClick={() => setSelectedTutorial(null)}>
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Tutorials
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStepData = selectedTutorial.steps[currentStep];
  const progress = ((currentStep + 1) / selectedTutorial.steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => setSelectedTutorial(null)}>
            ← Back to Tutorials
          </Button>
          <h1 className="text-2xl font-bold mt-2">{selectedTutorial.title}</h1>
        </div>
        <Badge className={getDifficultyColor(selectedTutorial.difficulty)}>
          {selectedTutorial.difficulty}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Step {currentStep + 1} of {selectedTutorial.steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {completedSteps.has(currentStep) ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p>{currentStepData.content}</p>
          </div>

          {currentStepData.tips && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {currentStepData.type === 'quiz' && currentStepData.quizQuestion && (
            <div className="space-y-4">
              <h4 className="font-semibold">{currentStepData.quizQuestion}</h4>
              <div className="grid grid-cols-1 gap-2">
                {currentStepData.quizOptions?.map((option, index) => (
                  <Button
                    key={index}
                    variant={userAnswers[currentStepData.id] === index ? "default" : "outline"}
                    className="justify-start text-left h-auto p-4"
                    onClick={() => handleQuizAnswer(currentStepData.id, index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStepData.type === 'interactive' && currentStepData.action && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">📋 Interactive Exercise:</h4>
              <p className="text-yellow-800">{currentStepData.action}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleStepComplete}
              disabled={
                currentStepData.type === 'quiz' && 
                userAnswers[currentStepData.id] === undefined
              }
            >
              {currentStep === selectedTutorial.steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTutorial;