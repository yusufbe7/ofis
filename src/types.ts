export type OfficeStatus = "Bo'sh" | "Band" | "Band qilingan";

export interface Building {
  id: string;
  name: string;
  district: string;
  address: string;
  description: string;
  image: string;
  /** Real coordinates — drives the Leaflet map. */
  lat: number;
  lng: number;
}

export interface Office {
  id: string;
  buildingId: string;
  /** Internal room reference, matches the owner's own records. */
  roomId: string;
  roomNo: string;
  area: number;
  floor: number;
  monthlyRent: number;
  status: OfficeStatus;
  /** "Hozir" or a move-in date, shown as-is. */
  available: string;
  furnished: boolean;
  description: string;
  amenities: string[];
  images: string[];
}

export interface DataSet {
  buildings: Building[];
  offices: Office[];
}

export type LeadType = "viewing" | "finder";

export interface Lead {
  type: LeadType;
  name: string;
  phone: string;
  officeId?: string;
  date?: string;
  area?: string;
  budget?: string;
  message?: string;
  page: string;
  utm: Record<string, string>;
  createdAt: string;
}

export interface FilterState {
  building: string;
  area: string;
  price: string;
  floor: string;
  furnished: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  building: "",
  area: "",
  price: "",
  floor: "",
  furnished: false,
};
