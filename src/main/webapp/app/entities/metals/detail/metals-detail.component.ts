import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMetals } from '../metals.model';

@Component({
  selector: 'jhi-metals-detail',
  templateUrl: './metals-detail.component.html',
})
export class MetalsDetailComponent implements OnInit {
  metals: IMetals | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ metals }) => {
      this.metals = metals;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
