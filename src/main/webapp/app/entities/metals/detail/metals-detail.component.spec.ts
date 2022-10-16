import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MetalsDetailComponent } from './metals-detail.component';

describe('Metals Management Detail Component', () => {
  let comp: MetalsDetailComponent;
  let fixture: ComponentFixture<MetalsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetalsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ metals: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MetalsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MetalsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load metals on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.metals).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
