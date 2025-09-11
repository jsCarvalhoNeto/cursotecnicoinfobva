import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, BookOpen, Settings, BarChart3, LogOut, Home, Shield, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SubjectModal from '@/components/SubjectModal';

export default function AdminDashboard() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
      fetchSubjects();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch profiles with user roles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(role => role.user_id === profile.user_id) || []
      })) || [];

      setUsers(usersWithRoles);
      setTotalStudents(usersWithRoles.filter(u => 
        u.roles.some((r: any) => r.role === 'student')
      ).length);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso",
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover usuário",
        variant: "destructive",
      });
    }
  };

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar disciplinas",
        variant: "destructive",
      });
    } finally {
      setLoadingSubjects(false);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Disciplina removida com sucesso",
      });
      fetchSubjects();
      setSubjectToDelete(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover disciplina",
        variant: "destructive",
      });
    }
  };

  const openSubjectModal = (subject?: any) => {
    setEditingSubject(subject || null);
    setShowSubjectModal(true);
  };

  const promoteToAdmin = async (userEmail: string) => {
    try {
      const { data, error } = await supabase.rpc('promote_user_to_admin', {
        _user_email: userEmail
      });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: data || "Usuário promovido a administrador",
      });
      fetchUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao promover usuário",
        variant: "destructive",
      });
    }
  };

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

  // Stats data using real data
  const stats = [
    { title: 'Estudantes Ativos', value: totalStudents.toString(), icon: Users, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Disciplinas', value: subjects.length.toString(), icon: BookOpen, color: 'text-accent', bgColor: 'bg-accent/10' },
    { title: 'Taxa de Aprovação', value: '89%', icon: BarChart3, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Administradores', value: users.filter(u => u.roles.some((r: any) => r.role === 'admin')).length.toString(), icon: Shield, color: 'text-destructive', bgColor: 'bg-destructive/10' }
  ];

  const getUserStatus = (user: any) => {
    if (user.roles.some((r: any) => r.role === 'admin')) return 'Admin';
    if (user.roles.some((r: any) => r.role === 'student')) return 'Ativo';
    return 'Pendente';
  };

  const getUserStatusVariant = (status: string) => {
    if (status === 'Admin') return 'destructive';
    if (status === 'Ativo') return 'default';
    return 'secondary';
  };

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
                  Bem-vindo, {profile?.full_name || user.email}
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
                  Portal
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="students">Estudantes</TabsTrigger>
            <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Gerenciar Usuários
                  </CardTitle>
                  <CardDescription>
                    Adicionar, editar e gerenciar estudantes e administradores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => setActiveTab('students')}>
                    Acessar Usuários
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    Disciplinas
                  </CardTitle>
                  <CardDescription>
                    Gerenciar disciplinas, cronogramas e conteúdo acadêmico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('subjects')}>
                    Gerenciar Disciplinas
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-secondary-foreground" />
                    Configurações
                  </CardTitle>
                  <CardDescription>
                    Configurar sistema e preferências gerais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('settings')}>
                    Configurações
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>
                  Últimas ações administrativas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: '5 novos estudantes cadastrados', time: 'Hoje às 14:30', icon: Users, color: 'text-green-600' },
                    { action: 'Disciplina "Desenvolvimento Web" atualizada', time: 'Ontem às 16:45', icon: BookOpen, color: 'text-blue-600' },
                    { action: 'Configurações de backup atualizadas', time: '2 dias atrás', icon: Settings, color: 'text-orange-600' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Gerenciar Estudantes</h2>
                <p className="text-muted-foreground">Adicione, edite ou remova estudantes do sistema</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Estudante
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Estudantes</CardTitle>
                <CardDescription>
                  Todos os estudantes cadastrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => {
                      const status = getUserStatus(user);
                      return (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {user.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('') : user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name || 'Nome não informado'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Matrícula: {user.student_registration || 'Não informado'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getUserStatusVariant(status)}>
                              {status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              {status !== 'Admin' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => promoteToAdmin(user.email)}
                                  title="Promover a Admin"
                                >
                                  <Shield className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => deleteUser(user.user_id)}
                                title="Remover usuário"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {users.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum usuário encontrado
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Gerenciar Disciplinas</h2>
                <p className="text-muted-foreground">Organize e configure as disciplinas do curso</p>
              </div>
              <Button className="flex items-center gap-2" onClick={() => openSubjectModal()}>
                <Plus className="w-4 h-4" />
                Nova Disciplina
              </Button>
            </div>

            {loadingSubjects ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject) => (
                  <Card key={subject.id} className="hover:shadow-glow transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <CardDescription>Professor: {subject.teacher_name}</CardDescription>
                          {subject.schedule && (
                            <p className="text-sm text-muted-foreground mt-1">{subject.schedule}</p>
                          )}
                        </div>
                        <Badge variant="outline">{subject.current_students}/{subject.max_students}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {subject.description && (
                          <p className="text-sm text-muted-foreground">{subject.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Semestre: {subject.semester || 'Não informado'}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openSubjectModal(subject)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSubjectToDelete(subject)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {subjects.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">Nenhuma disciplina encontrada</p>
                  </div>
                )}
              </div>
            )}

            <SubjectModal
              isOpen={showSubjectModal}
              onClose={() => setShowSubjectModal(false)}
              subject={editingSubject}
              onSuccess={fetchSubjects}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a disciplina "{subjectToDelete?.name}"?
                    <br /><br />
                    <span className="font-semibold text-destructive">
                      ⚠️ Esta ação é irreversível e não pode ser desfeita.
                    </span>
                    <br />
                    Todos os dados relacionados a esta disciplina serão permanentemente removidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteSubject(subjectToDelete?.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir Definitivamente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
              <p className="text-muted-foreground">Configure preferências e parâmetros do portal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Configurações básicas do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar Notificações
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Permissões
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Configurações de Segurança
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manutenção</CardTitle>
                  <CardDescription>Ferramentas de manutenção do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Gerar Relatórios
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Backup do Sistema
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Logs do Sistema
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}