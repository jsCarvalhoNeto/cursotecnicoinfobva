-- Inserir a disciplina "Lógica de Programação" caso não exista
INSERT INTO public.subjects (name, description, teacher_name, schedule, semester, max_students, current_students)
VALUES (
  'Lógica de Programação',
  'Desenvolva seu raciocínio lógico e aprenda os fundamentos da programação de forma prática e interativa.',
  'Santos Carvalho',
  'Segunda e Quarta 14:00-16:00',
  '2025.2',
  50,
  0
)
ON CONFLICT DO NOTHING;