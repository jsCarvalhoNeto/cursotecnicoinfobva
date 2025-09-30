import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Activity, 
  PenTool, 
  FolderOpen, 
  ClipboardList, 
  Settings,
  Clock,
  Users,
  Trophy,
  Gamepad2,
  Download,
  Edit,
  Wrench,
  Megaphone
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  description: string;
  teacher_name: string;
  schedule: string;
  semester: string;
  max_students: number;
  current_students: number;
}

export default function SubjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isStudent, loading } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loadingSubject, setLoadingSubject] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');

  useEffect(() => {
    if (id) {
      fetchSubject();
    }
  }, [id]);

  const fetchSubject = async () => {
    try {
      const response = await fetch(`http://localhost:4002/api/subjects/${id}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar disciplina');
      }
      const data = await response.json();
      setSubject(data);
    } catch (error) {
      console.error('Error fetching subject:', error);
    } finally {
      setLoadingSubject(false);
    }
  };

  if (loading || loadingSubject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isStudent) {
    return <Navigate to="/auth" replace />;
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Disciplina não encontrada</h1>
          <p className="text-muted-foreground">A disciplina que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  const quickAccessItems = [
    {
      icon: Gamepad2,
      title: 'Atividades Interativas',
      description: 'Jogos e simuladores educativos',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Download,
      title: 'Material Didático',
      description: 'Slides, apostilas e PDFs',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Edit,
      title: 'Exercícios',
      description: 'Listas de exercícios práticos',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: Wrench,
      title: 'Projetos',
      description: 'Projetos práticos para desenvolver',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{subject.name}</h1>
                <p className="text-primary-foreground/80">EEEP - Baibina Viana Arrais</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                  {subject.teacher_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="font-semibold">{subject.teacher_name}</p>
                <p className="text-sm text-primary-foreground/80">Sistemas de Informação</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="inicio" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <Home className="w-4 h-4" />
                Início
              </TabsTrigger>
              <TabsTrigger 
                value="conteudo"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <FileText className="w-4 h-4" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger 
                value="material"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <BookOpen className="w-4 h-4" />
                Material
              </TabsTrigger>
              <TabsTrigger 
                value="atividades"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <Activity className="w-4 h-4" />
                Atividades
              </TabsTrigger>
              <TabsTrigger 
                value="exercicios"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <PenTool className="w-4 h-4" />
                Exercícios
              </TabsTrigger>
              <TabsTrigger 
                value="projetos"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <FolderOpen className="w-4 h-4" />
                Projetos
              </TabsTrigger>
              <TabsTrigger 
                value="avaliacoes"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <ClipboardList className="w-4 h-4" />
                Avaliações
              </TabsTrigger>
              <TabsTrigger 
                value="recursos"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-3"
              >
                <Settings className="w-4 h-4" />
                Recursos
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="inicio" className="py-8">
              <div className="container mx-auto px-4 space-y-8">
                {/* Welcome Section */}
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          Bem-vindos à {subject.name}! 
                          <Edit className="w-6 h-6 text-primary" />
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                          Desenvolva seu raciocínio lógico e aprenda os fundamentos da programação de forma prática e interativa.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center bg-card rounded-lg p-4 border">
                          <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <p className="font-bold text-lg">100h</p>
                          <p className="text-sm text-muted-foreground">Carga Horária</p>
                        </div>
                        <div className="text-center bg-card rounded-lg p-4 border">
                          <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
                          <p className="font-bold text-lg">1º Ano</p>
                          <p className="text-sm text-muted-foreground">Série</p>
                        </div>
                        <div className="text-center bg-card rounded-lg p-4 border">
                          <Users className="w-6 h-6 mx-auto mb-2 text-secondary-foreground" />
                          <p className="font-bold text-lg">Técnico</p>
                          <p className="text-sm text-muted-foreground">Nível</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Access */}
                <div>
                  <h3 className="text-xl font-semibold mb-6">Acesso Rápido</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickAccessItems.map((item, index) => (
                      <Card key={index} className="hover:shadow-glow transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className={`w-16 h-16 ${item.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                            <item.icon className={`w-8 h-8 ${item.color}`} />
                          </div>
                          <h4 className="font-semibold mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Important Announcements */}
                <div>
                  <h3 className="text-xl font-semibold mb-6">Anúncios Importantes</h3>
                  <Card className="border-l-4 border-l-destructive">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Megaphone className="w-4 h-4 text-destructive" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Início das Aulas</h4>
                          <p className="text-muted-foreground mb-3">
                            As aulas de Lógica de Programação começam na próxima semana. Preparem-se!
                          </p>
                          <Badge variant="destructive">31/08/2025</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Other tabs content */}
            <TabsContent value="conteudo">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Conteúdo Programático</h2>
                <p className="text-muted-foreground">Conteúdo em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="material">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Material Didático</h2>
                <p className="text-muted-foreground">Material em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="atividades">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Atividades</h2>
                <p className="text-muted-foreground">Atividades em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="exercicios">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Exercícios</h2>
                <p className="text-muted-foreground">Exercícios em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="projetos">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Projetos</h2>
                <p className="text-muted-foreground">Projetos em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="avaliacoes">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
                <p className="text-muted-foreground">Avaliações em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="recursos">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Recursos</h2>
                <p className="text-muted-foreground">Recursos em desenvolvimento...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
