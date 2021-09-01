import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Tenant } from 'src/app/models/tenant.model';
import { ApiService } from 'src/app/services/api.service';


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
  username: string | null = '';
  tenants: Tenant[] = [];

  searchText = '';
  filterMode: 'all' | 'debt' | 'clear' = 'all';
  private _rows = new BehaviorSubject<Tenant[]>([]);
  rows = this._rows.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertPopup: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.getTenants();
  }

  /* user actions */
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
          data.id = tenant.id;
          this.updateTenant(data);
        }
      });
  }

  delete(tenant: Tenant) {
    this.deleteTenant(tenant.id);
  }

  /* auxiliaries */
  onChange() {
    const filtered = this.tenants.filter((t) => {
      // check search criteria
      if (
        !t.name.includes(this.searchText) &&
        !t.phone.includes(this.searchText) &&
        !t.address.includes(this.searchText)
      ) {
        return false;
      }

      // filter by debt selection mode
      switch (this.filterMode) {
        case 'clear':
          return t.debt <= 0;
        case 'debt':
          return t.debt > 0;
        default:
          return true;
      }
    });

    this._rows.next(filtered);
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

  deleteTenant(id: string) {
    this.apiService.deleteTenant(id).then(
      (deleted) => {
        if (deleted) {
          const index = this.tenants.findIndex((t) => t.id == deleted.id);
          if (~index) {
            this.tenants.splice(index, 1);
            this.onChange();
          }
        }
      },
      () => {
        this.showError();
      }
    );
  }

  logout() {
    this.apiService.logout().then(
      () => {
        localStorage.clear();
        this.router.navigate(['/login']);
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
  name = '';
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
        this.name = data.tenant.name;
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
