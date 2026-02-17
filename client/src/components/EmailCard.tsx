interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
}

export default function EmailCard({ email }: { email: Email }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <p className="text-sm text-gray-500">From: {email.from}</p>
      <h3 className="font-semibold text-lg">{email.subject}</h3>
      <p className="mt-2 text-gray-700">{email.body}</p>
    </div>
  );
}
