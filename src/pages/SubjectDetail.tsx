import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FileText, 
  PenTool, 
  Calculator, 
  FolderOpen, 
  BarChart3, 
  Settings,
  Clock,
  Users,
  Calendar,
  Megaphone,
  Play,
  Download,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Subject {
  id: string;
  name: string;
  description?: string;
  teacher_name: string;
  max_students?: number;
  current_students?: number;
  semester?: string;
  schedule?: string;
}

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, loading: authLoading } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isStudent)) {
      navigate('/auth');
      return;
    }
    
    if (id && user && isStudent) {
      fetchSubject();
    }
  }, [id, user, isStudent, authLoading, navigate]);

  const fetchSubject = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setSubject(data);
    } catch (error) {
      console.error('Error fetching subject:', error);
      navigate('/disciplinas');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando disciplina...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Disciplina não encontrada
              </h3>
              <Button onClick={() => navigate('/disciplinas')} variant="outline">
                Voltar às disciplinas
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const quickAccessItems = [
    {
      icon: Play,
      title: "Atividades Interativas",
      description: "Jogos e simuladores educativos",
      color: "text-purple-600"
    },
    {
      icon: FileText,
      title: "Material Didático",
      description: "Slides, apostilas e PDFs",
      color: "text-blue-600"
    },
    {
      icon: PenTool,
      title: "Exercícios",
      description: "Listas de exercícios práticos",
      color: "text-orange-600"
    },
    {
      icon: FolderOpen,
      title: "Projetos",
      description: "Projetos práticos para desenvolver",
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subject Header */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {subject.name}
                  </h1>
                  <p className="text-white/90 text-lg mb-4">
                    {subject.teacher_name}
                  </p>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Prof. Santos Carvalho</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs defaultValue="inicio" className="w-full">
            <TabsList className="grid w-full grid-cols-8 mb-8">
              <TabsTrigger value="inicio" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Início
              </TabsTrigger>
              <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              <TabsTrigger value="material">Material</TabsTrigger>
              <TabsTrigger value="atividades">Atividades</TabsTrigger>
              <TabsTrigger value="exercicios">Exercícios</TabsTrigger>
              <TabsTrigger value="projetos">Projetos</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              <TabsTrigger value="recursos">Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="inicio" className="space-y-8">
              {/* Welcome Section */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Play className="w-6 h-6 text-primary" />
                    Bem-vindos à {subject.name}! 🚀
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Desenvolva seu raciocínio lógico e aprenda os fundamentos da programação de forma prática e interativa.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-6 rounded-2xl border">
                      <div className="text-2xl font-bold text-primary mb-1">100h</div>
                      <div className="text-sm text-muted-foreground">Carga Horária</div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border">
                      <div className="text-2xl font-bold text-accent mb-1">1° Ano</div>
                      <div className="text-sm text-muted-foreground">Série</div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border">
                      <div className="text-2xl font-bold text-secondary-foreground mb-1">Técnico</div>
                      <div className="text-sm text-muted-foreground">Nível</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Access */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Acesso Rápido</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickAccessItems.map((item, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className={`w-8 h-8 ${item.color}`} />
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Important Announcements */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Anúncios Importantes</h2>
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Megaphone className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Início das Aulas</CardTitle>
                        <CardDescription>
                          As aulas de Lógica de Programação começam na próxima semana. Preparem-se!
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      31/08/2025
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs content - placeholder for now */}
            <TabsContent value="conteudo">
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo Programático</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Conteúdo em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="material">
              <Card>
                <CardHeader>
                  <CardTitle>Material Didático</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Material em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="atividades">
              <Card>
                <CardHeader>
                  <CardTitle>Atividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Atividades em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exercicios">
              <Card>
                <CardHeader>
                  <CardTitle>Exercícios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Exercícios em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projetos">
              <Card>
                <CardHeader>
                  <CardTitle>Projetos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Projetos em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avaliacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Avaliações em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recursos">
              <Card>
                <CardHeader>
                  <CardTitle>Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recursos em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubjectDetail;
