interface Props {
  emails: any[];
}

export default function EmailList({ emails }: Props) {
  return (
    <div className="flex-1 bg-white rounded-2xl overflow-y-auto">
      {emails.length === 0 && (
        <div className="p-6 text-gray-500">
          No emails yet.
        </div>
      )}

      {emails.map((email) => (
        <div
          key={email._id}
          className="px-6 py-4 border-b hover:bg-gray-50"
        >
          <p className="font-semibold">{email.from}</p>
          <p>{email.subject}</p>
        </div>
      ))}
    </div>
  );
}
