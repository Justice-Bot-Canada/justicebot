import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Star, 
  Search, 
  Filter,
  Eye,
  Heart,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  tribunal: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  downloads: number;
  rating: number;
  isFavorite?: boolean;
  isPremium?: boolean;
  tags: string[];
  lastUpdated: string;
  fileType: 'pdf' | 'word' | 'fillable-pdf';
  previewUrl?: string;
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'small-claims-plaintiff',
    title: 'Small Claims Court - Plaintiff\'s Claim',
    description: 'Complete form for filing a claim in Small Claims Court with step-by-step instructions',
    category: 'Forms',
    tribunal: 'Small Claims Court',
    difficulty: 'beginner',
    estimatedTime: 30,
    downloads: 1247,
    rating: 4.8,
    tags: ['plaintiff', 'claim', 'ontario'],
    lastUpdated: '2025-01-15',
    fileType: 'fillable-pdf'
  },
  {
    id: 'ltb-t1-rent-reduction',
    title: 'LTB Application T1 - Tenant Application for Rent Reduction',
    description: 'Official LTB form T1 with detailed completion guide for rent reduction claims',
    category: 'Forms',
    tribunal: 'Landlord & Tenant Board',
    difficulty: 'intermediate',
    estimatedTime: 45,
    downloads: 892,
    rating: 4.6,
    tags: ['tenant', 'rent-reduction', 'ltb'],
    lastUpdated: '2025-01-10',
    fileType: 'fillable-pdf'
  },
  {
    id: 'hrto-application',
    title: 'HRTO Human Rights Application',
    description: 'Complete application package for filing human rights complaints with evidence checklist',
    category: 'Forms',
    tribunal: 'Human Rights Tribunal',
    difficulty: 'advanced',
    estimatedTime: 90,
    downloads: 445,
    rating: 4.7,
    isPremium: true,
    tags: ['human-rights', 'discrimination', 'hrto'],
    lastUpdated: '2025-01-08',
    fileType: 'fillable-pdf'
  },
  {
    id: 'demand-letter-template',
    title: 'Demand Letter Template',
    description: 'Professional demand letter template for debt collection and breach of contract',
    category: 'Letters',
    tribunal: 'General',
    difficulty: 'beginner',
    estimatedTime: 20,
    downloads: 2156,
    rating: 4.5,
    tags: ['demand', 'debt', 'contract'],
    lastUpdated: '2025-01-12',
    fileType: 'word'
  },
  {
    id: 'evidence-checklist',
    title: 'Evidence Collection Checklist',
    description: 'Comprehensive checklist for gathering and organizing evidence for legal proceedings',
    category: 'Checklists',
    tribunal: 'General',
    difficulty: 'beginner',
    estimatedTime: 15,
    downloads: 1834,
    rating: 4.9,
    tags: ['evidence', 'organization', 'checklist'],
    lastUpdated: '2025-01-20',
    fileType: 'pdf'
  },
  {
    id: 'family-court-motion',
    title: 'Family Court Motion Template',
    description: 'Template for filing motions in family court with supporting affidavit format',
    category: 'Forms',
    tribunal: 'Family Court',
    difficulty: 'advanced',
    estimatedTime: 60,
    downloads: 567,
    rating: 4.3,
    isPremium: true,
    tags: ['family', 'motion', 'affidavit'],
    lastUpdated: '2025-01-05',
    fileType: 'word'
  },
  {
    id: 'settlement-agreement',
    title: 'Settlement Agreement Template',
    description: 'Comprehensive settlement agreement template for resolving disputes out of court',
    category: 'Agreements',
    tribunal: 'General',
    difficulty: 'intermediate',
    estimatedTime: 40,
    downloads: 723,
    rating: 4.4,
    tags: ['settlement', 'agreement', 'resolution'],
    lastUpdated: '2025-01-18',
    fileType: 'word'
  },
  {
    id: 'witness-statement',
    title: 'Witness Statement Template',
    description: 'Structured template for collecting witness statements with legal formatting',
    category: 'Templates',
    tribunal: 'General',
    difficulty: 'beginner',
    estimatedTime: 25,
    downloads: 1023,
    rating: 4.6,
    tags: ['witness', 'statement', 'testimony'],
    lastUpdated: '2025-01-22',
    fileType: 'word'
  }
];

const categories = ['All', 'Forms', 'Letters', 'Checklists', 'Agreements', 'Templates'];
const tribunals = ['All', 'Small Claims Court', 'Landlord & Tenant Board', 'Human Rights Tribunal', 'Family Court', 'General'];

const DocumentTemplateLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTribunal, setSelectedTribunal] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const filteredTemplates = documentTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesTribunal = selectedTribunal === 'All' || template.tribunal === selectedTribunal;
    
    if (activeTab === 'favorites') {
      return matchesSearch && matchesCategory && matchesTribunal && favorites.has(template.id);
    }
    
    if (activeTab === 'premium') {
      return matchesSearch && matchesCategory && matchesTribunal && template.isPremium;
    }
    
    return matchesSearch && matchesCategory && matchesTribunal;
  });

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const TemplateCard: React.FC<{ template: DocumentTemplate }> = ({ template }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getFileTypeIcon(template.fileType)}
            <Badge variant="secondary" className={getDifficultyColor(template.difficulty)}>
              {template.difficulty}
            </Badge>
            {template.isPremium && (
              <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleFavorite(template.id)}
            className="h-8 w-8 p-0"
          >
            <Heart
              className={`h-4 w-4 ${
                favorites.has(template.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </Button>
        </div>
        
        <CardTitle className="text-lg leading-tight">{template.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {template.estimatedTime} min
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {template.downloads.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {template.rating}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Document Template Library</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access professional legal document templates, forms, and checklists to help
          with your legal proceedings. All templates are up-to-date and tribunal-approved.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates, forms, and documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Category:</span>
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tribunal:</span>
            {tribunals.slice(0, 4).map(tribunal => (
              <Button
                key={tribunal}
                size="sm"
                variant={selectedTribunal === tribunal ? 'default' : 'outline'}
                onClick={() => setSelectedTribunal(tribunal)}
              >
                {tribunal}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Templates ({documentTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites ({favorites.size})
          </TabsTrigger>
          <TabsTrigger value="premium">
            Premium ({documentTemplates.filter(t => t.isPremium).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTemplates.length} of {documentTemplates.length} templates
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {favorites.size === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">
                  Heart templates you use frequently to add them to your favorites.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Premium Templates</h3>
                  <p className="text-sm text-purple-700">
                    Advanced templates with detailed instructions and expert guidance
                  </p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or browse different categories.
            </p>
            <Button onClick={() => { 
              setSearchTerm(''); 
              setSelectedCategory('All'); 
              setSelectedTribunal('All');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentTemplateLibrary;