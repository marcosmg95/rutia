export type Equipament = "museu" | "patrimoni arquitectònic"

export interface Coordenades {
  lat: number
  lng: number
}

export interface DadesEntrada {
  dia: string
  ciutat: string
  localitzacio?: Coordenades
  tipus: Equipament[]
}

export interface Marcador {
  localitzacio: Coordenades
  nom: string
}

export interface ResultatAPI {
  field: string
  title: string
  location: {
    latitude: number
    longitude: number
  }
}