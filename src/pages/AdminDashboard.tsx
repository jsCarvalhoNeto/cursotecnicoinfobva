import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Settings, BarChart3, LogOut, Home, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
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
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">
                  Administrador: {profile?.full_name || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Administrador
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
              Painel de Controle
            </h2>
            <p className="text-primary-foreground/90">
              Bem-vindo ao painel administrativo. Gerencie estudantes, disciplinas, 
              conteúdo e configurações do portal educacional.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Estudantes Ativos</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Disciplinas</p>
                </div>
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                </div>
                <Shield className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>
                Adicionar, editar e gerenciar estudantes e administradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Gerenciar Usuários
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <CardTitle>Disciplinas e Currículo</CardTitle>
              <CardDescription>
                Gerenciar disciplinas, cronogramas e conteúdo acadêmico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gerenciar Disciplinas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center mb-2">
                <BarChart3 className="w-5 h-5 text-secondary-foreground" />
              </div>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>
                Visualizar estatísticas e gerar relatórios acadêmicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Configurar sistema, notificações e preferências gerais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurações
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle>Conteúdo do Site</CardTitle>
              <CardDescription>
                Editar notícias, eventos e informações do portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gerenciar Conteúdo
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Logs de acesso, permissões e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurar Segurança
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Recentes do Sistema</CardTitle>
              <CardDescription>
                Últimas atividades administrativas e eventos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">5 novos estudantes cadastrados</p>
                    <p className="text-xs text-muted-foreground">Hoje às 14:30</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Disciplina "Desenvolvimento Web" atualizada</p>
                    <p className="text-xs text-muted-foreground">Ontem às 16:45</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Configurações de backup atualizadas</p>
                    <p className="text-xs text-muted-foreground">2 dias atrás</p>
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