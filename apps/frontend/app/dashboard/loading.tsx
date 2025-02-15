export default function LoadingSkeleton() {
  return (
    <div className="p-6 border border-white/10 rounded-xl h-[150px] bg-white/5 backdrop-blur-lg shadow-xl flex flex-col justify-center items-center gap-4">
      <div className="w-2/3 h-6 bg-gradient-to-r from-white/10 to-white/5 animate-pulse rounded-md" />
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
        <div className="w-1/2 h-4 bg-white/5 animate-pulse rounded-md" />
      </div>
      <div className="w-1/3 h-4 bg-white/5 animate-pulse rounded-md" />
    </div>
  );
}
