export interface TravelPhoto {
  url: string
  caption?: string
}

export interface TravelChapter {
  id: string
  num: string           // '01' '02'
  name: string          // 'BROMO'  (display name in caps)
  chinese: string       // '布 罗 莫'
  dateLabel: string     // '04.26'
  region: string        // 'EAST JAVA'
  country: string
  area: string          // 'JAVA' | 'BALI' | 'SG' etc.
  coords: string        // '-7.906, 112.950'
  locationCn: string    // '火山口'
  time: string          // '04:29'
  tags: string          // 'crater · viewpoint'
  quote: string
  caption: string       // photo caption
  description?: string
  spots: string[]
  photos: string[]      // photo URLs
  coverImg: string
  coverGrad: string
  tintColor: string     // rgba for hover tint on cover page
  bg: string            // chapter left panel bg color
  textColor: string     // chapter text color
  accent: string        // chapter accent color
  pageNum: string       // '03' '05' etc.
  totalExp: string      // total exposures e.g. '31'
  contactSheet: string  // '01'
}

export interface TravelTrip {
  id: string
  year: number
  title: string         // 'BALI'  (main title word)
  titleYear: string     // '2026'
  subtitle: string      // 'TRAVEL JOURNAL'
  chinese: string       // '巴 厘 · 二 〇 二 六'
  tagline: string       // multi-line handwritten tagline
  filmLabel: string     // roll meta top-left
  filmHeader: string    // cover right header
  devCredit: string     // 'DEV 05.04.2026 · BLACKWATER LAB'
  sideText: string      // rotated side text
  coverImg: string
  accentColor: string
  description?: string
  chapters: TravelChapter[]
}

export interface TravelYear {
  year: number
  trips: TravelTrip[]
  coverImg: string
  label: string         // 'Bali · Prague · ...'
}
