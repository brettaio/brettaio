import { Injectable } from '@angular/core';

import {
  getRestaurantPageCandidateBySlug,
  getRestaurantPageCandidateBySourceId,
  restaurantPageCandidates,
  restaurantPageCandidatePreview,
  type RestaurantPageCandidate,
} from './restaurant-page-candidates';

@Injectable({ providedIn: 'root' })
export class RestaurantPageCandidatesService {
  readonly candidates = restaurantPageCandidates;
  readonly previewCandidate = restaurantPageCandidatePreview;

  list(): readonly RestaurantPageCandidate[] {
    return this.candidates;
  }

  getBySlug(slug: string): RestaurantPageCandidate | null {
    return getRestaurantPageCandidateBySlug(slug);
  }

  getBySourceId(sourceId: string): RestaurantPageCandidate | null {
    return getRestaurantPageCandidateBySourceId(sourceId);
  }
}
