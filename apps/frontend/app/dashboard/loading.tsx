import { Loader2 } from "lucide-react";

export default function LoadingSkeleton() {
  return (
    <div className="p-5 border rounded-lg h-[150px] flex justify-center ">
      <Loader2 size={32} className="animate-spin mt-10" />
    </div>
  );
}
