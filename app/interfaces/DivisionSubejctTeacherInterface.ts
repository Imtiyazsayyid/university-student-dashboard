import { Subject } from "./SubjectInterface";
import { Teacher } from "./TeacherInterface";

export type DivisionSubjectTeacher = {
  id: number;
  subjectId: number;
  teacherId: number;
  divisionId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;

  subject: Subject;
  teacher: Teacher;
};
