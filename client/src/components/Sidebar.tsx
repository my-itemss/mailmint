import { BiPencil } from "react-icons/bi";


interface Props {
  onCompose: () => void;
}

export default function Sidebar({ onCompose }: Props) {
  return (
    <div className="w-64 bg-[#f8fafd] border-r">
      <div>
      <button
        onClick={onCompose}
        className="bg-[#c2e7ff] px-5 py-4 rounded-2xl mb-6 flex flex-row items-center gap-2"
      >
        <BiPencil className=""/>
        Compose
      </button>
</div>
      <div className="space-y-3">
        <div className="bg-[#d3e3fd] px-4">
          Inbox
        </div>
      </div>
    </div>
  );
}
