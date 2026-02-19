interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
  date?: string;
}

interface Props {
  email: Email;
  onClick: () => void;
}

export default function EmailRow({ email, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center
        px-6 py-3
        cursor-pointer
        hover:bg-gray-50
        transition
      "
    >
      {/* Sender */}
      <p className="w-56 font-semibold truncate">
        {email.from}
      </p>

      {/* Subject */}
      <p className="flex-1 text-gray-700 truncate">
        {email.subject}
      </p>

      {/* Date */}
      <p className="text-sm text-gray-400 w-28 text-right">
        {email.date || ""}
      </p>
    </div>
  );
}
