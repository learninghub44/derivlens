import {
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  Music2,
  Twitter,
  Youtube,
  Linkedin,
  MessagesSquare,
  Globe,
} from "lucide-react";
import type { SiteConfig, SocialKey } from "@/config/site";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialKey, React.ComponentType<{ size?: number }>> = {
  whatsapp: MessageCircle,
  telegram: Send,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
  x: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  discord: MessagesSquare,
  website: Globe,
};

const LABELS: Record<SocialKey, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  discord: "Discord",
  website: "Website",
};

export function SocialLinks({
  social,
  className,
}: {
  social: SiteConfig["social"];
  className?: string;
}) {
  const entries = Object.entries(social) as [SocialKey, string][];
  if (entries.length === 0) return null;

  return (
    <nav aria-label="Social links" className={cn("flex items-center gap-2", className)}>
      {entries.map(([key, url]) => {
        const Icon = ICONS[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[key]}
            title={LABELS[key]}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-text-muted transition-colors hover:border-signal hover:text-signal"
          >
            <Icon size={15} />
          </a>
        );
      })}
    </nav>
  );
}
