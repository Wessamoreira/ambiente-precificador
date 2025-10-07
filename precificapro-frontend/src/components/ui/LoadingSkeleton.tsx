import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton = ({ className = '' }: LoadingSkeletonProps) => {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`bg-gradient-to-r from-white/10 to-white/5 rounded-lg ${className}`}
    />
  );
};

export const DashboardLoadingSkeleton = () => {
  return (
    <div>
      <LoadingSkeleton className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="backdrop-blur-lg bg-gray-500/10 border border-white/20 rounded-2xl p-6">
            <LoadingSkeleton className="h-6 w-3/4 mb-4" />
            <LoadingSkeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-8">
        <LoadingSkeleton className="h-10 w-48" />
        <LoadingSkeleton className="h-10 w-32" />
      </div>
      <div className="backdrop-blur-lg bg-gray-500/10 border border-white/20 rounded-2xl p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <LoadingSkeleton key={i} className="h-16 w-full mb-3" />
        ))}
      </div>
    </div>
  );
};
