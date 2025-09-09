-- Create subjects table
CREATE TABLE public.subjects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    teacher_name TEXT NOT NULL,
    max_students INTEGER DEFAULT 50,
    current_students INTEGER DEFAULT 0,
    semester TEXT,
    schedule TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for subject access
CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage subjects" 
ON public.subjects 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_subjects_updated_at
BEFORE UPDATE ON public.subjects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample subjects
INSERT INTO public.subjects (name, description, teacher_name, max_students, current_students, semester, schedule) VALUES
('Programação I', 'Introdução à programação com conceitos fundamentais', 'Prof. João', 50, 45, '2024.1', 'Segunda e Quarta 14:00-16:00'),
('Banco de Dados', 'Modelagem e administração de bancos de dados relacionais', 'Prof. Maria', 45, 42, '2024.1', 'Terça e Quinta 08:00-10:00'),
('Redes de Computadores', 'Fundamentos de redes e protocolos de comunicação', 'Prof. Carlos', 40, 38, '2024.1', 'Segunda e Quarta 10:00-12:00'),
('Desenvolvimento Web', 'Criação de aplicações web modernas', 'Prof. Ana', 55, 50, '2024.1', 'Terça e Quinta 14:00-16:00');

-- Create enrollment table to track student-subject relationships
CREATE TABLE public.enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    grade DECIMAL(4,2),
    UNIQUE(student_id, subject_id)
);

-- Enable RLS for enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for enrollments
CREATE POLICY "Students can view their own enrollments" 
ON public.enrollments 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage all enrollments" 
ON public.enrollments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Students can enroll themselves" 
ON public.enrollments 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);