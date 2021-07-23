import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material';

import { TableComponent } from './components/shared/table/table.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { FormModalComponent } from './components/form-modal/form-modal.component';
import { ApiHandler } from './providers/api-handlers';
import { HttpInterceptorProvider } from './providers/http-interceptor';
import { LoaderComponent } from './components/shared/loader/loader.component';

@NgModule({

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    FormsModule,
    MatCheckboxModule
  ],
  declarations: [
    AppComponent,
    TableComponent,
    ConfirmationModalComponent,
    FormModalComponent,
    HomeComponent,
    NavBarComponent,
    LoaderComponent
  ],
  providers: [ApiHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorProvider,
      multi: true,
    },],
  entryComponents: [ConfirmationModalComponent, FormModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
