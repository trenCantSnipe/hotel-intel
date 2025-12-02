export interface HotelData {
  name: string;
  ownerEmail: string;
  companyEmail: string;
  phone: string;
  website: string;
  websiteQuality: string;
  hasChatbot: string;
  chatbotQuality: string;
  rating: string;
  comments: string;
}

export interface SearchResult {
  location: string;
  data: HotelData[];
  sources: string[];
  rawText: string;
}

export enum AppState {
  IDLE,
  SEARCHING,
  COMPLETE,
  ERROR
}