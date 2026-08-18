export interface UrlRecord {
  id: number;
  code: string;
  original_url: string;
  created_at: string;
  expires_at: string | null;
  clicks: number;
}

export interface CreateUrlDTO {
  code: string;
  original_url: string;
  expires_at?: string | null;
}

export interface UrlAnalyticsDTO {
  code: string;
  clicks: number;
  created_at: string;
  last_accessed?: string;
}
