export function ProductCardSkeleton() {
    return (
        <div className="glass-card p-4 space-y-4">
            {/* Image skeleton */}
            <div className="skeleton aspect-video rounded-lg" />

            {/* Category badge skeleton */}
            <div className="skeleton h-5 w-20 rounded-full" />

            {/* Title skeleton */}
            <div className="skeleton h-6 w-3/4 rounded" />

            {/* Description skeleton */}
            <div className="space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-2/3 rounded" />
            </div>

            {/* Price and button skeleton */}
            <div className="flex items-center justify-between pt-2">
                <div className="skeleton h-7 w-24 rounded" />
                <div className="skeleton h-10 w-24 rounded-lg" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="glass-card p-6 space-y-4">
            {/* Icon skeleton */}
            <div className="skeleton w-14 h-14 rounded-xl" />

            {/* Title skeleton */}
            <div className="skeleton h-6 w-2/3 rounded" />

            {/* Description skeleton */}
            <div className="space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between pt-2">
                <div className="skeleton h-4 w-16 rounded" />
                <div className="skeleton h-5 w-5 rounded" />
            </div>
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <tr className="border-b border-white/5">
            <td className="py-4 px-4">
                <div className="skeleton h-5 w-24 rounded" />
            </td>
            <td className="py-4 px-4">
                <div className="skeleton h-5 w-32 rounded" />
            </td>
            <td className="py-4 px-4">
                <div className="skeleton h-5 w-20 rounded" />
            </td>
            <td className="py-4 px-4">
                <div className="skeleton h-6 w-16 rounded-full" />
            </td>
            <td className="py-4 px-4">
                <div className="skeleton h-8 w-20 rounded-lg" />
            </td>
        </tr>
    );
}

export function DashboardStatSkeleton() {
    return (
        <div className="glass-card p-6 space-y-2">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-8 w-28 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
        </div>
    );
}
