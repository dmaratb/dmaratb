import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Tenant } from 'src/app/models/response.model';
import { ApiService } from 'src/app/services/api.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface EditDialogMode {
  mode: 'add' | 'edit';
  tenant: Tenant;
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  username = '';
  tenants: Tenant[] = [];

  private _rows = new BehaviorSubject<Tenant[]>([]);
  rows = this._rows.asObservable();
  rowsNum = 0;
  searchText = '';

  constructor(
    private apiService: ApiService,
    private alertPopup: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTenants();
  }

  onChange() {
    const filtered = this.tenants.filter(
      (t) =>
        t.name.includes(this.searchText) ||
        t.phone.includes(this.searchText) ||
        t.address.includes(this.searchText)
    );

    this.rowsNum = filtered.length;
    this._rows.next(filtered);
  }

  /* actions */
  add() {
    this.dialog
      .open(EditDialog, { data: { mode: 'add' } })
      .afterClosed()
      .toPromise()
      .then((data) => {
        if (data) {
          this.addTenant(data);
        }
      });
  }

  edit(tenant: Tenant) {
    this.dialog
      .open(EditDialog, { data: { mode: 'edit', tenant: tenant } })
      .afterClosed()
      .toPromise()
      .then((data) => {
        if (data) {
          this.updateTenant(data);
        }
      });
  }

  delete(category: any) {}

  expand(category: any) {
    console.log(category);
  }

  /* services */
  getTenants() {
    this.apiService.listTenants().then(
      (tenants) => {
        if (tenants) {
          this.tenants = tenants;
          this.onChange();
        }
      },
      () => {
        this.showError();
      }
    );
  }

  addTenant(tenant: Tenant) {
    this.apiService.addTenant(tenant).then(
      (added) => {
        if (added) {
          tenant.id = added.id;
          this.tenants.push(tenant);
          this.onChange();
        }
      },
      () => {
        this.showError();
      }
    );
  }

  updateTenant(tenant: Tenant) {
    this.apiService.updateTenant(tenant).then(
      (updated) => {
        if (updated) {
          const index = this.tenants.findIndex((t) => t.id == updated.id);
          if (~index) {
            this.tenants[index] = updated;
            this.onChange();
          }
        }
      },
      () => {
        this.showError();
      }
    );
  }

  showError() {
    this.alertPopup.open('something went wrong', undefined, {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'error-popup',
    });

    return;
  }
}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit.dialog.html',
})
export class EditDialog {
  id = '';
  editForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    debt: 0,
  });

  constructor(
    public formBuilder: FormBuilder,
    public editDialog: MatDialogRef<EditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogMode
  ) {
    editDialog.afterOpened().subscribe(() => {
      if (data.mode == 'edit') {
        this.id = data.tenant.id;
        this.editForm = this.formBuilder.group({
          name: [data.tenant.name, [Validators.required]],
          phone: [data.tenant.phone, [Validators.required]],
          address: [data.tenant.address, [Validators.required]],
          debt: [data.tenant.debt],
        });
      }
    });
  }

  save() {
    if (this.editForm.invalid) {
      return;
    }

    this.editDialog.close({
      id: this.id,
      name: this.editForm.controls.name.value,
      phone: this.editForm.controls.phone.value,
      address: this.editForm.controls.address.value,
      debt: this.editForm.controls.debt.value,
    });
  }

  cancel() {
    this.editDialog.close();
  }
}
