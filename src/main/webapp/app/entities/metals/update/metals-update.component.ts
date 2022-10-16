import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MetalsFormService, MetalsFormGroup } from './metals-form.service';
import { IMetals } from '../metals.model';
import { MetalsService } from '../service/metals.service';

@Component({
  selector: 'jhi-metals-update',
  templateUrl: './metals-update.component.html',
})
export class MetalsUpdateComponent implements OnInit {
  isSaving = false;
  metals: IMetals | null = null;

  editForm: MetalsFormGroup = this.metalsFormService.createMetalsFormGroup();

  constructor(
    protected metalsService: MetalsService,
    protected metalsFormService: MetalsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ metals }) => {
      this.metals = metals;
      if (metals) {
        this.updateForm(metals);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const metals = this.metalsFormService.getMetals(this.editForm);
    if (metals.id !== null) {
      this.subscribeToSaveResponse(this.metalsService.update(metals));
    } else {
      this.subscribeToSaveResponse(this.metalsService.create(metals));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMetals>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(metals: IMetals): void {
    this.metals = metals;
    this.metalsFormService.resetForm(this.editForm, metals);
  }
}
