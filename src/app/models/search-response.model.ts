import { TrackResult } from "./track-result.model";

export interface SearchResponse {
  tracks: TrackResult[];
  nextCursor: string | null;
  prevCursor: string | null;
}