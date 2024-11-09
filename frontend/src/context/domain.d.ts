export interface Coordenades {
  lat: number
  lng: number
}

export interface DadesEntrada {
  dia: string
  ciutat: string
  context: string
  tipus: {
    [key: string]: boolean
  }
}

export interface Marcador {
  code: number
  localitzacio: Coordenades
  nom: string
  adreca: string
  descripcio: string
  ambit: string
}

export interface ResultatAPI {
  code: number
  field: string
  title: string
  description: string
  location: {
    latitude: number
    longitude: number
  }
}
