export module "nhentai-js" {
  export function getDoujin(identifier: string): Promise<{
    title: string;
    nativeTitle: string;
    details: Record<string, string[]>;
    pages: string[];
    thumbnails: string[];
    link: string;
  }>;
  export function exists(identifier: string): Promise<boolean>;
}
