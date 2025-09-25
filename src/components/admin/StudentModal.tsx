/**
 * Modal para criação e edição de estudantes
 */

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StudentModalProps } from '@/types/student';
import { useStudentCreation } from '@/hooks/useStudentCreation';
import StudentForm from './StudentForm';
import CredentialsDisplay from './CredentialsDisplay';

interface ExtendedStudentModalProps extends StudentModalProps {
  student?: any;
}

export default function StudentModal({ isOpen, onClose, onSuccess, student }: ExtendedStudentModalProps) {
  const {
    formData,
    errors,
    isLoading,
    isValidating,
    generatedCredentials,
    showCredentials,
    updateField,
    validateField,
    createStudent,
    submit,
    resetForm,
    closeCredentials,
    setEditingStudent,
  } = useStudentCreation();

  // Resetar formulário quando modal abrir
  useEffect(() => {
    if (isOpen) {
      if (student) {
        // Modo de edição
        setEditingStudent(student);
      } else {
        // Modo de criação
        resetForm();
      }
    }
  }, [isOpen, student, setEditingStudent, resetForm]);

  // Fechar modal e chamar callback de sucesso quando credenciais forem fechadas
  useEffect(() => {
    if (!showCredentials && generatedCredentials) {
      onClose();
      onSuccess();
    }
  }, [showCredentials, generatedCredentials, onClose, onSuccess]);

  const handleClose = () => {
    if (showCredentials) {
      closeCredentials();
    } else {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (student) {
      // Edição de estudante existente
      await submit(student.id || student.user_id);
    } else {
      // Criação de novo estudante
      await createStudent();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {showCredentials && generatedCredentials ? (
          <CredentialsDisplay 
            credentials={generatedCredentials} 
            onClose={closeCredentials}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-semibold">{student ? 'Editar' : '+'}</span>
                </div>
                {student ? 'Editar Estudante' : 'Novo Estudante'}
              </DialogTitle>
              <DialogDescription>
                {student 
                  ? 'Edite os dados do estudante abaixo.'
                  : 'Preencha os dados abaixo para criar uma nova conta de estudante. Uma senha temporária será gerada automaticamente.'
                }
              </DialogDescription>
            </DialogHeader>

            <StudentForm
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              isValidating={isValidating}
              onChange={updateField}
              onSubmit={handleSubmit}
              onValidateField={validateField}
              isEditing={!!student}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
