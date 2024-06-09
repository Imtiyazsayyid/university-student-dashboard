import { SubjectType } from "./SubjectTypeInterface";

export type Subject = {
  id: number;
  name: string;
  abbr: string;
  code: string;
  subjectTypeId: number;
  subjectType: SubjectType;
  credits: number;
  semesterId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
