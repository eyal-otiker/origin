import { Observable } from "rxjs";
import { SearchResponse } from "./search-response.model";

export abstract class SoundApiService {
  abstract search(query: string, cursor?: string): Observable<SearchResponse>;
}