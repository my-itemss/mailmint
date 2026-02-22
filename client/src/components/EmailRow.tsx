"use client";

import { MdDelete } from "react-icons/md";
import { Email } from "./EmailList";
import { deleteEmail } from "../../lib/api";

interface Props {
  email: Email;
  onClick: () => void;
  userEmail: string;                     
  onDeleted: (id: string) => void;       
}

export default function EmailRow({ email, onClick, userEmail, onDeleted }: Props) {

  const date = new Date(email.createdAt).toLocaleDateString();

 
 const handleDelete = async (e: React.MouseEvent) => {
  e.stopPropagation();

  try {
    await deleteEmail(email._id, userEmail);
    onDeleted(email._id);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div
      onClick={onClick}
      className="
        group flex items-center px-4 py-3
        hover:bg-gray-100 cursor-pointer bg-[#f2f6fc]
      "
    >

      <div
        className={`
          w-[220px] truncate
          ${email.read ? "font-normal" : "font-semibold"}
        `}
      >
        {email.from}
      </div>

      <div className="flex-1 truncate">
        <span
          className={`
            mr-2
            ${email.read ? "font-normal text-gray-700" : "font-semibold"}
          `}
        >
          {email.subject}
        </span>

        <span className="text-gray-400">
          - {email.body.slice(0, 60)}
        </span>
      </div>

      <div className="flex items-center gap-3 ml-10">

        <span className="text-sm text-gray-500 group-hover:hidden">
          {date}
        </span>

        <div className="hidden group-hover:flex gap-3 text-gray-500">

          <MdDelete
            onClick={handleDelete}   
            className="hover:text-red-500 cursor-pointer"
          />

        </div>
      </div>
    </div>
  );
}