import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TeacherForm from './TeacherForm';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacher?: any;
}

export default function TeacherModal({ isOpen, onClose, onSuccess, teacher }: TeacherModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{teacher ? 'Editar Professor' : 'Adicionar Novo Professor'}</DialogTitle>
          <DialogDescription>
            {teacher ? 'Atualize os dados do professor.' : 'Preencha os dados para cadastrar um novo professor.'}
          </DialogDescription>
        </DialogHeader>
        <TeacherForm onSuccess={onSuccess} teacher={teacher} />
      </DialogContent>
    </Dialog>
  );
}
