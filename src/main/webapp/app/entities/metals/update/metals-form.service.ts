import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMetals, NewMetals } from '../metals.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMetals for edit and NewMetalsFormGroupInput for create.
 */
type MetalsFormGroupInput = IMetals | PartialWithRequiredKeyOf<NewMetals>;

type MetalsFormDefaults = Pick<NewMetals, 'id'>;

type MetalsFormGroupContent = {
  id: FormControl<IMetals['id'] | NewMetals['id']>;
  elementCode: FormControl<IMetals['elementCode']>;
  elementDescription: FormControl<IMetals['elementDescription']>;
};

export type MetalsFormGroup = FormGroup<MetalsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MetalsFormService {
  createMetalsFormGroup(metals: MetalsFormGroupInput = { id: null }): MetalsFormGroup {
    const metalsRawValue = {
      ...this.getFormDefaults(),
      ...metals,
    };
    return new FormGroup<MetalsFormGroupContent>({
      id: new FormControl(
        { value: metalsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      elementCode: new FormControl(metalsRawValue.elementCode),
      elementDescription: new FormControl(metalsRawValue.elementDescription),
    });
  }

  getMetals(form: MetalsFormGroup): IMetals | NewMetals {
    return form.getRawValue() as IMetals | NewMetals;
  }

  resetForm(form: MetalsFormGroup, metals: MetalsFormGroupInput): void {
    const metalsRawValue = { ...this.getFormDefaults(), ...metals };
    form.reset(
      {
        ...metalsRawValue,
        id: { value: metalsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MetalsFormDefaults {
    return {
      id: null,
    };
  }
}
