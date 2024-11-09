export interface Coordenades {
  lat: number
  lng: number
}

export interface DadesEntrada {
  dia: string
  ciutat: string
  context: string
  localitzacio?: Coordenades
  tipus: {
    [key: string]: boolean
  }
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
