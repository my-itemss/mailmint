interface Props {
  email: string;
}

export default function Topbar({ email }: Props) {
  return (
    <div className="bg-[#f8fafd] px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-semibold text-red-600">
        MailMint
      </div>

      <div className="text-sm font-mono text-gray-600">
        {email}
      </div>
    </div>
  );
}
