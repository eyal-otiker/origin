import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MixcloudApiService } from './mixcloud.api.service';
import { MixcloudSearchResponse } from '../models/mix-cloud/mix-cloud-search-response.interface';

describe('MixcloudApiService', () => {
  let service: MixcloudApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MixcloudApiService]
    });
    service = TestBed.inject(MixcloudApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should transform raw Mixcloud response correctly and limit to 6 tracks', () => {
    const mockRawResponse: MixcloudSearchResponse = {
      data: Array.from({ length: 8 }, (_, i) => ({
        key: `/artist/track-${i}/`,
        name: `Track ${i}`,
        user: { name: `Artist ${i}` },
        pictures: { large: `http://img-${i}.jpg`, medium: '' }
      })) as any,
      paging: { next: 'http://api.mixcloud.com/next', previous: 'http://api.mixcloud.com/prev' }
    };

    service.search('chillout').subscribe(response => {
      expect(response.tracks.length).toBe(6); 
      expect(response.tracks[0].id).toBe('/artist/track-0/');
      expect(response.tracks[0].artistName).toBe('Artist 0');
      expect(response.tracks[0].audioEmbedUrl).toContain('https://www.mixcloud.com/widget/iframe/');
      expect(response.nextCursor).toBe('http://api.mixcloud.com/next');
      expect(response.prevCursor).toBe('http://api.mixcloud.com/previous');
    });

    const req = httpMock.expectOne('https://api.mixcloud.com/search/?q=chillout&type=cloudcast&limit=6');
    expect(req.request.method).toBe('GET');
    req.flush(mockRawResponse);
  });
});