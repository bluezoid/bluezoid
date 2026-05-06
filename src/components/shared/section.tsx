import { cn } from "@/lib/utils";
import { Container } from "./container";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

export function Section({
  children,
  className,
  containerClassName,
  id,
  as: Tag = "section",
  style,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("py-16 md:py-24", className)} style={style}>
      <Container className={containerClassName}>{children}</Container>
    </Tag>
  );
}

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  badge,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      {badge && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-400">{badge}</p>
      )}
      <h2
        className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/45">{description}</p>
      )}
    </div>
  );
}
