import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchStateService } from './search-state.service';
import { SoundApiService } from '../models/sound-api.model';
import { of, throwError } from 'rxjs';
import { SearchResponse } from '../models/search-response.model';

describe('SearchStateService', () => {
  let service: SearchStateService;
  let mockApiService: jasmine.SpyObj<SoundApiService>;
  const mockResponse: SearchResponse = {
    tracks: [
      { id: '1', trackName: 'Track 1', artistName: 'Artist 1', imageUrl: '', audioEmbedUrl: '' }
    ],
    nextCursor: 'next_123',
    prevCursor: 'prev_123'
  };

  beforeEach(() => {
    localStorage.clear();
    mockApiService = jasmine.createSpyObj('SoundApiService', ['search']);
    TestBed.configureTestingModule({
      providers: [
        SearchStateService,
        { provide: SoundApiService, useValue: mockApiService }
      ]
    });
    service = TestBed.inject(SearchStateService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created and load empty history initially', () => {
    expect(service).toBeTruthy();
    expect(service.history$.value).toEqual([]);
  });

  describe('History Logic', () => {
    it('should save query to history and persist to localStorage', () => {
      mockApiService.search.and.returnValue(of(mockResponse));
      service.triggerSearch('Deep House');
      expect(service.history$.value).toEqual(['Deep House']);
      expect(JSON.parse(localStorage.getItem('recent_searches_history') || '[]')).toEqual(['Deep House']);
    });

    it('should maintain max 5 items in history and prevent duplicates (case-insensitive)', () => {
      mockApiService.search.and.returnValue(of(mockResponse));
      const searches = ['one', 'two', 'three', 'four', 'five', 'six', 'ONE'];
      searches.forEach(query => service.triggerSearch(query));
      const history = service.history$.value;
      expect(history.length).toBe(5);
      expect(history[0]).toBe('ONE'); 
      expect(history).not.toContain('one');
      expect(history).not.toContain('two'); 
    });
  });

  describe('Search Pipeline & Reactive Stream', () => {
    it('should update results and cursors on successful search after debounce (300ms)', fakeAsync(() => {
      mockApiService.search.and.returnValue(of(mockResponse));
      service.triggerSearch('Techno');
      expect(mockApiService.search).not.toHaveBeenCalled();
      tick(300); 
      expect(mockApiService.search).toHaveBeenCalledWith('Techno', undefined);
      expect(service.results$.value).toEqual(mockResponse.tracks);
      expect(service.nextCursor).toBe('next_123');
      expect(service.prevCursor).toBe('prev_123');
      expect(service.isLoading$.value).toBeFalse();
    }));

    it('should handle API errors gracefully and set error state', fakeAsync(() => {
      mockApiService.search.and.returnValue(throwError(() => new Error('Network Error')));
      service.triggerSearch('Trance');
      tick(300);
      expect(service.error$.value).toBe('failed, try again');
      expect(service.isLoading$.value).toBeFalse();
      expect(service.results$.value).toEqual([]);
    }));
  });
});