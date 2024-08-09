"use client";

import { atom, createStore } from "jotai";
import { Student } from "../interfaces/StudentInterface";
import StudentServices from "../Services/StudentServices";

const store = createStore();

// Vairables
export const studentDetails = atom<Student>();

// Setters
export const setStudentDetails = atom(null, async (get, set) => {
  const res = await StudentServices.getStudentDetails();
  if (res.data.status) {
    set(studentDetails, res.data.data);
  }
});

export default store;
