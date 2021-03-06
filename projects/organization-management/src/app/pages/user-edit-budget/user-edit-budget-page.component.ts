import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { UserBudget } from '../../models/user-budget/user-budget.model';

@Component({
  selector: 'ish-user-edit-budget-page',
  templateUrl: './user-edit-budget-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditBudgetPageComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private organizationManagementFacade: OrganizationManagementFacade) {}
  selectedUser$: Observable<B2bUser>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  budgetForm: FormGroup;
  user: B2bUser;
  submitted = false;

  private destroy$ = new Subject();

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.error$ = this.organizationManagementFacade.usersError$;
    this.selectedUser$ = this.organizationManagementFacade.selectedUser$;

    this.selectedUser$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(user => {
      this.user = user;
      this.initForm(user);
    });
  }

  initForm(user: B2bUser) {
    this.budgetForm = this.fb.group({
      orderSpentLimit: [user.userBudget?.orderSpentLimit?.value || '', SpecialValidators.moneyAmount],
      budget: [user.userBudget?.budget?.value || '', SpecialValidators.moneyAmount],
      budgetPeriod: [
        !user.userBudget?.budgetPeriod || user.userBudget?.budgetPeriod === 'none'
          ? 'weekly'
          : user.userBudget.budgetPeriod,
      ],
      currency: [user.userBudget?.remainingBudget?.currency, Validators.required],
    });
  }

  submitForm() {
    if (this.budgetForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.budgetForm);
      return;
    }

    const formValue = this.budgetForm.value;

    const budget: UserBudget = formValue
      ? {
          budget: formValue.budget
            ? { value: formValue.budget, currency: formValue.currency, type: 'Money' }
            : undefined,
          budgetPeriod: formValue.budgetPeriod,
          orderSpentLimit: formValue.orderSpentLimit
            ? {
                value: formValue.orderSpentLimit,
                currency: formValue.currency,
                type: 'Money',
              }
            : undefined,
        }
      : undefined;

    this.organizationManagementFacade.setSelectedUserBudget(budget);
  }

  get formDisabled() {
    return this.budgetForm.invalid && this.submitted;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
