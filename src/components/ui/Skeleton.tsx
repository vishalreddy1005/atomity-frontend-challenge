interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 6,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="skel"
      style={{ width, height, borderRadius }}
    />
  );
}
