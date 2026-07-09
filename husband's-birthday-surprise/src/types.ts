export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string; // Base64 or asset path
  isDefault?: boolean;
}

export interface SurpriseConfig {
  husbandName: string;
  wifeName: string;
  anniversaryDate: string;
  customLetter: string;
  loveReasons: string[];
  memories: MemoryItem[];
}
