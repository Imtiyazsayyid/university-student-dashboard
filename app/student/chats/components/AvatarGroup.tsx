import { Student } from "@/app/interfaces/StudentInterface";
import Image from "next/image";

interface Props {
  students: Student[];
}

const AvatarGroup = ({ students }: Props) => {
  // this retreive the first three users
  console.log("Teachers: ", students);
  const slicedUsers = students?.slice(0, 3);
  console.log("SlicedUser: ", slicedUsers);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0 ",
    2: "bottom-0 right-0",
  };

  const getInitials = (student: Student) => {
    const firstNameInitial = student.firstName?.[0] ?? "";
    const lastNameInitial = student.lastName?.[0] ?? "";
    return (firstNameInitial + lastNameInitial).toUpperCase();
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((student, i) => (
        <div
          key={i}
          className={`absolute rounded-full overflow-hidden h-[21px] w-[21px] bg-neutral-200 flex items-center justify-center text-sm font-semibold text-gray-500 select-none ${
            positionMap[i as keyof typeof positionMap]
          }`}
        >
          {student.profileImg ? (
            <Image
              src={student.profileImg}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <span>{getInitials(student)}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
