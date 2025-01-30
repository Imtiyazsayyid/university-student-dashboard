"use client";
import UserBox from "./UserBox";
// import StandardErrorToast from "@/app/extras/StandardErrorToast";

import { useEffect, useState } from "react";
// import Input from "./inputs/Input";
import { Input } from "@chakra-ui/react";
import { Loader } from "lucide-react";
import StudentServices from "@/app/Services/StudentServices";
import { Student } from "@/app/interfaces/StudentInterface";

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Student[]>([]);
  const [filters, setFilters] = useState({
    searchText: "",
  });

  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await StudentServices.getStudentsList({ ...filters });
      if (!res.data?.status) {
        // StandardErrorToast();
        return [];
      }

      setUsers(res.data.data || []);
    } catch (error) {
      console.log("Error fetching Teachers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear the previous timeout to avoid redundant calls
    }

    // Set a new timeout for debouncing
    const newTimeout = setTimeout(() => {
      getAllUsers();
    }, 800); // Wait for 500ms after user stops typing

    setDebounceTimeout(newTimeout);

    return () => {
      clearTimeout(newTimeout); // Cleanup on unmount or dependency change
    };
  }, [filters.searchText]);

  return (
    <aside className="fixed h-full w-full p-2 lg:w-[320px] overflow-y-auto border-r border-gray-200 dark:border-gray-800 dark:bg-[#111]">
      <div className="px-3">
        <div className="flex-col">
          <div className="dark:text-white text-2xl font-bold text-neutral-800 py-4">
            People
          </div>
          <div className="flex items-center w-full border mb-5 p-1 rounded-lg">
            <Input
              type="text"
              placeholder="Search"
              value={filters.searchText}
              onChange={(e) =>
                setFilters({ ...filters, searchText: e.target.value })
              }
              variant="" // Removes the border to match the className "border-none"
              width="100%" // Makes it fill the parent container, similar to "flex-1"
              className="focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center text-lg font-bold gap-4">
            <Loader size={20} className="animate-spin" /> Loading Users...
          </div>
        ) : (
          users.map((student) => (
            <UserBox key={student.firstName} student={student} />
          ))
        )}
      </div>
    </aside>
  );
};

export default UserList;
