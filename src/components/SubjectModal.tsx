import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject | null;
  onSuccess: () => void;
}

export default function SubjectModal({ isOpen, onClose, subject, onSuccess }: SubjectModalProps) {
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    description: subject?.description || '',
    teacher_name: subject?.teacher_name || '',
    max_students: subject?.max_students || 50,
    semester: subject?.semester || '',
    schedule: subject?.schedule || ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (subject) {
        // Update existing subject
        const { error } = await supabase
          .from('subjects')
          .update(formData)
          .eq('id', subject.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Disciplina atualizada com sucesso",
        });
      } else {
        // Create new subject
        const { error } = await supabase
          .from('subjects')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Disciplina criada com sucesso",
        });
      }

      onSuccess();
      onClose();
      setFormData({
        name: '',
        description: '',
        teacher_name: '',
        max_students: 50,
        semester: '',
        schedule: ''
      });
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar disciplina",
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
              <Label htmlFor="teacher_name">Professor</Label>
              <Input
                id="teacher_name"
                value={formData.teacher_name}
                onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                required
              />
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
}