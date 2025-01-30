import { useState, useEffect } from "react";
import StudentServices from "@/app/Services/StudentServices";
// import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Student } from "@/app/interfaces/StudentInterface";

const useStudentDetails = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [error, setError] = useState(false); // Track if an error occurred

  const getTeacherDetails = async () => {
    try {
      const res = await StudentServices.getStudentDetails();

      if (!res.data.status) {
        setError(true); // Set error state
        setCurrentStudent(null); // Ensure the state is explicitly set to null
        // StandardErrorToast("Failed to fetch teacher details.");
        return;
      }

      setCurrentStudent(res.data.data); // Set valid teacher data
      setError(false); // Reset error state if data fetch succeeds
    } catch (error) {
      console.error("An error occurred while fetching teacher details:", error);
      setError(true); // Set error state
      setCurrentStudent(null); // Explicitly set state to null on error
    }
  };

  useEffect(() => {
    getTeacherDetails();
  }, []);

  return currentStudent;
};

export default useStudentDetails;
