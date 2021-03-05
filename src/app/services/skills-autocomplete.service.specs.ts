import { TestBed } from '@angular/core/testing';

import { SkillsAutocompleteService } from './skills-autocomplete.service';

describe('SkillsAutocompleteService', () => {
  let service: SkillsAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillsAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
