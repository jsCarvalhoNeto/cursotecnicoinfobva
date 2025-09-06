import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, FileText, User, LogOut, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, profile, isStudent, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isStudent) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Portal do Estudante</h1>
                <p className="text-sm text-muted-foreground">
                  Bem-vindo, {profile?.full_name || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Estudante
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Início
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
            <h2 className="text-2xl font-bold mb-2">
              Olá, {profile?.full_name || 'Estudante'}!
            </h2>
            <p className="text-primary-foreground/90">
              Bem-vindo ao seu painel de estudante. Aqui você pode acompanhar suas disciplinas, 
              notas e atividades do curso técnico em informática.
            </p>
            {profile?.student_registration && (
              <p className="text-sm text-primary-foreground/80 mt-2">
                Matrícula: {profile.student_registration}
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Minhas Disciplinas</CardTitle>
              <CardDescription>
                Acompanhe suas disciplinas e cronograma de aulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Acessar Disciplinas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <CardTitle>Notas e Avaliações</CardTitle>
              <CardDescription>
                Consulte suas notas e histórico acadêmico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Notas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-secondary-foreground" />
              </div>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>
                Verifique prazos, provas e eventos importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Abrir Calendário
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Suas últimas atividades e atualizações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nova atividade em Programação I</p>
                    <p className="text-xs text-muted-foreground">Prazo: 15 de Janeiro</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nota disponível - Banco de Dados</p>
                    <p className="text-xs text-muted-foreground">Publicada hoje</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Prova de Redes - próxima semana</p>
                    <p className="text-xs text-muted-foreground">20 de Janeiro às 14:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}