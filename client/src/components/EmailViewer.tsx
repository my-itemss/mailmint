interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
  date?: string;
}

interface Props {
  email: Email;
  onBack: () => void;
}

export default function EmailViewer({ email, onBack }: Props) {
  return (
    <div className="flex flex-col h-full bg-white rounded-l-2xl">

      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        <h2 className="text-lg font-semibold">
          {email.subject}
        </h2>
      </div>

      {/* Mail Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <p className="text-sm text-gray-500 mb-4">
          From: {email.from}
        </p>

        <div className="whitespace-pre-wrap text-gray-800">
          {email.body}
        </div>
      </div>

    </div>
  );
}
