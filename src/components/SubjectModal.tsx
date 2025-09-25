import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: string;
  name: string;
  description?: string;
  teacher_id?: string;
  teacher_name?: string;
  max_students?: number;
  current_students?: number;
  semester?: string;
  schedule?: string;
}

interface Teacher {
  id: string;
  full_name: string;
  email: string;
}

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject | null;
  onSuccess: () => void;
}

export default function SubjectModal({ isOpen, onClose, subject, onSuccess }: SubjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher_id: '',
    max_students: 50,
    semester: '',
    schedule: ''
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || '',
        description: subject.description || '',
        teacher_id: subject.teacher_id || '',
        max_students: subject.max_students || 50,
        semester: subject.semester || '',
        schedule: subject.schedule || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        teacher_id: '',
        max_students: 50,
        semester: '',
        schedule: ''
      });
    }
  }, [subject]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/teachers');
      if (!response.ok) {
        throw new Error('Falha ao buscar professores');
      }
      const teacherData = await response.json();
      setTeachers(teacherData);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de professores",
        variant: "destructive",
      });
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = 'http://localhost:4001/api/subjects';

    try {
      if (subject) {
        // Lógica de atualização (ainda não implementada na API de exemplo)
        // Para implementar edição, seria necessário adicionar uma rota PUT /api/subjects/:id
        console.warn("A funcionalidade de editar ainda precisa ser conectada à API.");
        toast({
          title: "Funcionalidade não implementada",
          description: "A edição de disciplinas via API ainda não foi criada.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          teacher_id: formData.teacher_id || null
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao criar a disciplina');
      }

      toast({
        title: "Sucesso",
        description: "Disciplina criada com sucesso no banco de dados!",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: "Erro",
        description: (error as Error).message || "Erro ao salvar disciplina",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {subject ? 'Editar Disciplina' : 'Nova Disciplina'}
          </DialogTitle>
          <DialogDescription>
            {subject ? 'Edite as informações da disciplina' : 'Preencha os dados da nova disciplina'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Disciplina</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher_id">Professor</Label>
              <Select
                value={formData.teacher_id}
                onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_students">Máximo de Alunos</Label>
              <Input
                id="max_students"
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="Ex: 2024.1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Horário</Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="Ex: Segunda e Quarta 14:00-16:00"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (subject ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
