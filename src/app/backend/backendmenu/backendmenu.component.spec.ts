import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendmenuComponent } from './backendmenu.component';

describe('BackendmenuComponent', () => {
  let component: BackendmenuComponent;
  let fixture: ComponentFixture<BackendmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackendmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
