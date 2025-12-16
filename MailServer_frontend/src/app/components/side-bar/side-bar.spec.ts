import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBara } from './side-bara';

describe('SideBara', () => {
  let component: SideBara;
  let fixture: ComponentFixture<SideBara>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBara]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBara);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
