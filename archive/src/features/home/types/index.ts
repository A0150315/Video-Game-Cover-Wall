export interface GameListData {
  count: number;
  next: string;
  previous?: any;
  results: GameListDataResult[];
  user_platforms: boolean;
}

export interface GameListDataResult {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: Addedbystatus;
  metacritic?: number;
  playtime: number;
  suggestions_count: number;
  updated: string;
  user_game?: any;
  reviews_count: number;
  users: Users;
  promo: string;
  saturated_color: string;
  dominant_color: string;
  platforms: Platform2[];
  parent_platforms: Parentplatform[];
  genres: Genre[];
  stores: Store2[];
  clip?: Clip;
  tags: Tag[];
  esrb_rating?: Platform3;
  charts: Charts;
  short_screenshots: Shortscreenshot[];
  community_rating?: number;
}

export interface Shortscreenshot {
  id: number;
  image: string;
}

export interface Charts {
  year?: Year;
}

export interface Year {
  year: number;
  change: string;
  position: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

export interface Clip {
  clip: string;
  clips: Clips;
  video: string;
  preview: string;
}

export interface Clips {
  '320': string;
  '640': string;
  full: string;
}

export interface Store2 {
  id: number;
  store: Store;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  domain: string;
  games_count: number;
  image_background: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface Parentplatform {
  platform: Platform3;
}

export interface Platform3 {
  id: number;
  name: string;
  slug: string;
}

export interface Platform2 {
  platform: Platform;
  released_at: string;
  requirements_en?:
    | Requirementsen
    | Requirementsen
    | Requirementsen3
    | Requirementsen3
    | null
    | null;
  requirements_ru?: any;
}

export interface Requirementsen3 {
  minimum: string;
}

export interface Requirementsen {
  minimum: string;
  recommended: string;
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
  image?: any;
  year_end?: any;
  year_start?: (null | number)[];
  games_count: number;
  image_background: string;
}

export interface Users {
  count: number;
  status: string;
  results: Result[];
}

export interface Result {
  id: number;
  username: string;
  slug: string;
  full_name: string;
  avatar?: string;
  games_count: number;
  collections_count: number;
  followers_count: number;
}

export interface Addedbystatus {
  yet?: number;
  owned?: number;
  beaten?: number;
  toplay?: number;
  dropped?: number;
  playing?: number;
}

export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}
