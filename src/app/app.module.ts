import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgMatGrpcFormModule } from "ng-mat-grpc-form";
import { CarComponent } from './car/car.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMatGrpcFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
