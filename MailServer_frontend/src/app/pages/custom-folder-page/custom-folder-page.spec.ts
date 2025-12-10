import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFolderPage } from './custom-folder-page';

describe('CustomFolderPage', () => {
  let component: CustomFolderPage;
  let fixture: ComponentFixture<CustomFolderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFolderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomFolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
