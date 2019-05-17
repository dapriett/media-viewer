import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { BehaviorSubject } from 'rxjs';
import {FormsModule} from '@angular/forms';
import { ActionEvents } from '../../model/action-events';
import { SearchOperation } from '../../model/viewer-operations';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let nativeElement, searchInput

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ SearchBarComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    searchInput = nativeElement.querySelector('input[id=findInput]');
    searchInput.value = 'searchTerm';

    const actionEvents = new ActionEvents();
    component.searchEvents = actionEvents.search as any;
    component.searchBarHidden = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show searchbar', () => {
    const searchbar = nativeElement.querySelector('.findbar');

    expect(searchbar.className).toContain('hidden');
  });

  it('should emit search next event', () => {
    const searchSpy = spyOn(component.searchEvents, 'next');
    component.searchText = 'searchTerm';
    const searchNextButton = nativeElement.querySelector('button[id=findNext]');
    searchNextButton.click();

    expect(searchSpy).toHaveBeenCalledWith(new SearchOperation('searchTerm', true, false, false, false, false));
  });

  it('should emit search previous event', () => {
    const searchSpy = spyOn(component.searchEvents, 'next');
    component.searchText = 'searchTerm';
    const searchPrevButton = nativeElement.querySelector('button[id=findPrevious]');
    searchPrevButton.click();

    expect(searchSpy).toHaveBeenCalledWith(new SearchOperation('searchTerm', true, false, false, true, false));
  });
});
