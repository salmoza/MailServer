import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailDetail } from './mail-detail';

describe('MailDetail', () => {
  let component: MailDetail;
  let fixture: ComponentFixture<MailDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
