import {Modelli} from "./modelli";
import {CategorieOptional} from "./categorie-optional";

export interface OptionalEntity{
  id?: string,
  OptionalID: number
  ModelloID: number
  CategoriaOptionalID: number
  Nome: string
  Prezzo: number
  FileImage: string
  Predefinito: Boolean
  CategoriaOptionalIDmongo: CategorieOptional;
  ModelloIDmongo: Modelli;
}
