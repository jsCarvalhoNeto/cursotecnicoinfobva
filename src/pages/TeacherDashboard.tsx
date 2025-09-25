import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, Home, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubjectModal from '@/components/SubjectModal';
import { useTeacherData } from '@/hooks/useTeacherData';

export default function TeacherDashboard() {
  const { user, profile, isTeacher, signOut, loading: authLoading } = useAuth();
  const { subjects, loading: subjectsLoading, error, refetch } = useTeacherData();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const openSubjectModal = (subject?: any) => {
    setEditingSubject(subject || null);
    setShowSubjectModal(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isTeacher) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Painel do Professor</h1>
                <p className="text-sm text-muted-foreground">
                  Bem-vindo, {profile?.full_name || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Professor
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

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Minhas Disciplinas</h2>
        {subjectsLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <div className="col-span-full text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        )}
        {!subjectsLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      {/* Esses campos (teacher_name, schedule, etc.) podem não existir no mock, ajuste conforme necessário */}
                      <CardDescription>ID da Matéria: {subject.id}</CardDescription>
                    </div>
                    <Badge variant="outline">Mock</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openSubjectModal(subject)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Ver/Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {subjects.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Nenhuma disciplina encontrada</p>
              </div>
            )}
          </div>
        )}
      </main>

      <SubjectModal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        subject={editingSubject}
        onSuccess={refetch}
      />
    </div>
  );
}
