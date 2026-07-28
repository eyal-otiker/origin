import { Injectable } from "@angular/core";
import { SoundApiService } from "../models/sound-api.model";
import { map, Observable } from "rxjs";
import { SearchResponse } from "../models/search-response.model";
import { HttpClient } from "@angular/common/http";
import { MixcloudSearchResponse } from "../models/mix-cloud/mix-cloud-search-response.interface";
import { MixcloudCloudcastItem } from "../models/mix-cloud/mix-cloud-cloud-cast-item.interface";

@Injectable({ providedIn: 'root' })
export class MixcloudApiService implements SoundApiService {
    private baseUrl = 'https://api.mixcloud.com/search/';
    
    constructor(private httpClient: HttpClient) {}

    public search(query: string, cursor?: string): Observable<SearchResponse> {
        const url: string = cursor || `${this.baseUrl}?q=${encodeURIComponent(query)}&type=cloudcast&limit=6`;

        return this.httpClient.get<MixcloudSearchResponse>(url).pipe(
            map((res: MixcloudSearchResponse) : SearchResponse => ({
                tracks: (res.data || []).slice(0, 6).map((item: MixcloudCloudcastItem) => ({
                    id: item.key,
                    trackName: item.name,
                    artistName: item.user?.name || 'Unknown Artist',
                    imageUrl: item.pictures?.large || item.pictures?.medium || '',
                    audioEmbedUrl: `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(item.key)}&hide_cover=1&light=1`
                })),
                nextCursor: res.paging?.next || null,
                prevCursor: res.paging?.previous || null
            }))
        );
    } 
}