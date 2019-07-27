import { NgModule } from '@angular/core';
import { NgMatGrpcFormComponent } from './ng-mat-grpc-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule, MatOptionModule,
  MatRadioModule, MatSelectModule, MatSliderModule
} from "@angular/material";



@NgModule({
  declarations: [NgMatGrpcFormComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatOptionModule
  ],
  exports: [NgMatGrpcFormComponent]
})
export class NgMatGrpcFormModule { }
