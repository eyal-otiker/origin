import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from "rxjs";
import { TrackResult } from "../models/track-result.model";
import { SoundApiService } from "../models/sound-api.model";
import { SearchResponse } from "../models/search-response.model";

@Injectable({ providedIn: 'root' })
export class SearchStateService {
    private historyKey: string = 'recent_searches_history';

    private searchSubject = new Subject<{ query: string; cursor?: string }>();
    
    public results$ = new BehaviorSubject<TrackResult[]>([]);
    public history$ = new BehaviorSubject<string[]>(this.loadHistory());
    public isLoading$ = new BehaviorSubject<boolean>(false);
    public error$ = new BehaviorSubject<string | null>(null);
    
    public nextCursor: string | null = null;
    public prevCursor: string | null = null;
    public currentQuery: string = '';

    constructor(private apiService: SoundApiService) {
        this.initSearchPipeline();
    }

    private initSearchPipeline(): void {
        this.searchSubject.pipe(
            debounceTime(300), // wait 300ms before next search
            distinctUntilChanged((p, c) => p.query === c.query && p.cursor === c.cursor),
            tap(() => {
                this.isLoading$.next(true);
                this.error$.next(null);
            }),
            switchMap(({ query, cursor }) => 
                this.apiService.search(query, cursor).pipe(
                    catchError(err => {
                        this.error$.next('failed, try again');
                        this.isLoading$.next(false);
                        return of(null);
                    })
                )
            )
        ).subscribe((res: SearchResponse | null) => {
            if (res) {
                this.results$.next(res.tracks);
                this.nextCursor = res.nextCursor;
                this.prevCursor = res.prevCursor;
                this.isLoading$.next(false);
            }
        });
    }

    public triggerSearch(query: string, cursor?: string): void {
        if (!query.trim()) return;
        this.currentQuery = query;
        this.saveToHistory(query);
        this.searchSubject.next({ query, cursor });
    }

    private saveToHistory(query: string): void {
        let searchList: string[] = this.loadHistory().filter(q => q.toLowerCase() !== query.toLowerCase());
        searchList.unshift(query);
        if (searchList.length > 5) searchList = searchList.slice(0, 5);
    
        localStorage.setItem(this.historyKey, JSON.stringify(searchList));
        this.history$.next(searchList);
    }

    private loadHistory(): string[] {
        try {
        return JSON.parse(localStorage.getItem(this.historyKey) || '[]');
        } 
        catch {
        return [];
        }
    }
}