import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socialLinks = {
    twitter: process.env.SOCIAL_TWITTER ?? "#",
    github: process.env.SOCIAL_GITHUB ?? "#",
    linkedin: process.env.SOCIAL_LINKEDIN ?? "#",
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
