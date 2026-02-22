"use client";

import { FaStar } from "react-icons/fa";
import { MdDelete, MdArchive, MdMarkEmailRead } from "react-icons/md";
import { Email } from "./EmailList";

interface Props {
  email: Email;
  onClick: () => void;
}

export default function EmailRow({ email, onClick }: Props) {

  const date = new Date(email.createdAt).toLocaleDateString();

  return (
    <div
      onClick={onClick}
      className="
        group flex items-center px-4 py-3
       hover:bg-gray-100 cursor-pointer bg-[#f2f6fc] 
      "
    >
      {/* checkbox */}
      {/* <input
        type="checkbox"
        className="mr-4"
        onClick={(e) => e.stopPropagation()}
      /> */}

      {/* star */}
      {/* <FaStar
        className={`
          mr-4 text-sm
          ${email.starred ? "text-yellow-400" : "text-gray-400"}
          hover:text-yellow-400
        `}
        onClick={(e) => e.stopPropagation()}
      /> */}

      {/* sender */}
      <div
        className={`
          w-[220px] truncate
          ${email.read ? "font-normal" : "font-semibold"}
        `}
      >
        {email.from}
      </div>

      {/* subject */}
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

      {/* right */}
      <div className="flex items-center gap-3 ml-10">

        <span className="text-sm text-gray-500 group-hover:hidden">
          {date}
        </span>

        <div className="hidden group-hover:flex gap-3 text-gray-500">

          {/* <MdArchive
            onClick={(e) => e.stopPropagation()}
            className="hover:text-black"
          /> */}

          <MdDelete
            onClick={(e) => e.stopPropagation()}
            className="hover:text-red-500"
          />

          {/* <MdMarkEmailRead
            onClick={(e) => e.stopPropagation()}
            className="hover:text-blue-500"
          /> */}

        </div>

      </div>
    </div>
  );
}