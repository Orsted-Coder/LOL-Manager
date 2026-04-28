// Component skeleton loading - thay thế spinner bằng placeholder có hình dạng
// Dùng animation pulse (nhấp nháy nhẹ) để báo hiệu đang tải dữ liệu

// Thanh skeleton đơn giản
export function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-lol-border/50 rounded ${className}`} />
  );
}

// Thẻ skeleton tuyển thủ
export function PlayerCardSkeleton() {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full animate-pulse bg-lol-border/50 shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-3/4" />
          <SkeletonLine className="h-3 w-1/2" />
        </div>
        <div className="text-right space-y-1">
          <SkeletonLine className="h-7 w-10" />
          <SkeletonLine className="h-3 w-8" />
        </div>
      </div>
      <SkeletonLine className="h-2 w-full mb-3" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonLine className="h-3 w-16" />
            <SkeletonLine className="h-2 flex-1" />
            <SkeletonLine className="h-3 w-6" />
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-lol-border flex justify-between">
        <SkeletonLine className="h-3 w-20" />
        <SkeletonLine className="h-3 w-16" />
      </div>
    </div>
  );
}

// Thẻ skeleton tướng
export function ChampionCardSkeleton() {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full animate-pulse bg-lol-border/50" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-2/3" />
          <SkeletonLine className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3].map((i) => <SkeletonLine key={i} className="h-5 w-14" />)}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonLine className="h-3 w-14" />
            <SkeletonLine className="h-2 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Thẻ skeleton trang bị
export function ItemCardSkeleton() {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded animate-pulse bg-lol-border/50" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-3/4" />
          <SkeletonLine className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <SkeletonLine className="h-3 w-16" />
            <SkeletonLine className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton cho StatCard trên Dashboard
export function StatCardSkeleton() {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <SkeletonLine className="h-6 w-6" />
        <SkeletonLine className="h-3 w-16" />
      </div>
      <SkeletonLine className="h-8 w-12" />
    </div>
  );
}

// Skeleton cho một dòng đội tuyển
export function TeamRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-lol-border/20 rounded-lg">
      <div className="w-10 h-10 rounded-lg animate-pulse bg-lol-border/50" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="h-4 w-1/3" />
        <SkeletonLine className="h-3 w-1/4" />
      </div>
      <div className="text-right space-y-1">
        <SkeletonLine className="h-5 w-8" />
        <SkeletonLine className="h-3 w-12" />
      </div>
    </div>
  );
}

// Skeleton cho section thông tin transfer
export function TransferCardSkeleton() {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full animate-pulse bg-lol-border/50" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-3/4" />
          <SkeletonLine className="h-3 w-1/2" />
        </div>
        <SkeletonLine className="h-6 w-16" />
      </div>
      <div className="flex gap-2">
        <SkeletonLine className="h-8 flex-1" />
        <SkeletonLine className="h-8 flex-1" />
      </div>
    </div>
  );
}
