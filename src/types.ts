export interface Restaurant {
  id: number;
  name: string;
  types: string[];
  rating: number;
  reviews: number;
  city: string;
  address: string;
  desc: string;
  lat: number;
  lng: number;
  link: string;
  phone: string;
  fb: string | null;
  ig: string | null;
  petFriendly: boolean;
}

export type VegType = '純素' | '奶素' | '蛋素' | '五辛素';
export type City = '台北市' | '新北市' | '桃園市';
