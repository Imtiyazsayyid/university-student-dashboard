import { Student } from "./StudentInterface";
import { Unit } from "./UnitInterface";

export type UnitQuiz = {
  id: number;
  name: string;
  unitId: number;
  unit: Unit;

  questions: UnitQuizQuestion[];

  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type UnitQuizQuestion = {
  id: number;

  unitQuizId: number;
  unitQuiz: UnitQuiz;

  options: UnitQuizQuestionOption[];
  responses: unitQuizQuestionResponses[];

  question: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type UnitQuizQuestionOption = {
  id: number;

  unitQuizId: number;
  unitQuizQuestionId: number;
  unitQuizQuestion: UnitQuizQuestion;

  value: string;
  isCorrect: boolean;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type unitQuizQuestionResponses = {
  id: number;
  unitQuizId: number;
  unitQuizQuestionId: number;
  unitQuizQuestion: UnitQuizQuestion;

  selectedOptionId: number;
  selectedOption: UnitQuizQuestionOption;

  studentId: number;
  student: Student;

  attemptId: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
