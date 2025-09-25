import { useState, useEffect, useCallback } from 'react';
import { getSubjectsByTeacher, getGradesBySubject, getAbsencesBySubject } from '@/services/teacherService'; // Esses serviços precisarão ser criados
import { useAuth } from './useAuth';

// Supondo que essas interfaces/tipos existam em algum lugar
interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  studentName: string;
  value: number;
}

interface Absence {
  id: number;
  studentName: string;
  date: string;
  present: boolean;
}

export const useTeacherData = () => {
  const { user, isTeacher } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Record<number, Grade[]>>({});
  const [absences, setAbsences] = useState<Record<number, Absence[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user || !isTeacher) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const teacherSubjects = await getSubjectsByTeacher(user.id);
      setSubjects(teacherSubjects);

      const gradesPromises = teacherSubjects.map(subject => getGradesBySubject(subject.id));
      const absencesPromises = teacherSubjects.map(subject => getAbsencesBySubject(subject.id));

      const gradesResults = await Promise.all(gradesPromises);
      const absencesResults = await Promise.all(absencesPromises);

      const gradesMap: Record<number, Grade[]> = {};
      teacherSubjects.forEach((subject, index) => {
        gradesMap[subject.id] = gradesResults[index];
      });
      setGrades(gradesMap);

      const absencesMap: Record<number, Absence[]> = {};
      teacherSubjects.forEach((subject, index) => {
        absencesMap[subject.id] = absencesResults[index];
      });
      setAbsences(absencesMap);

    } catch (err) {
      setError('Falha ao buscar os dados do professor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, isTeacher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { subjects, grades, absences, loading, error, refetch: fetchData };
};
