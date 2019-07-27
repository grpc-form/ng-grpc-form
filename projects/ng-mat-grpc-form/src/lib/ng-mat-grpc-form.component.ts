import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
	Button, BUTTON_FUNC,
	Field,
	Form,
	FormServiceClient, GetFormRequest, RadioGroup,
	STATUS,
	Select as FormSelect
} from "grpc-form-ts";

@Component({
	selector: 'ng-mat-grpc-form',
	template: `
<div class="ng-mat-grpc-form mat-typography">
  <div *ngFor="let field of form.getFieldsList(); index as i" [hidden]="field.getStatus() == STATUS.HIDDEN">
      <label>{{ field.getLabel() }}</label>
      <div *ngIf="field.getInput(); let input">
          <mat-form-field (change)="input.setValue($event.target.value); validateField(field)">
              <input matInput [placeholder]="input.getPlaceholder()" 
              	[value]="input.getValue()" [matAutocomplete]="auto"
              	[attr.disabled]="field.getStatus() == STATUS.DISABLED"
              	[required]="field.getStatus() == STATUS.REQUIRED">
              <mat-autocomplete (optionSelected)="input.setValue($event.option.value); validateField(field)" 
              	#auto="matAutocomplete">
                  <mat-option *ngFor="let option of input.getOptionsList()" 
                  	[value]="option.getValue()">
                      {{ option.getValue() }}
                  </mat-option>
              </mat-autocomplete>
          </mat-form-field>
      </div>
      <div *ngIf="field.getSelect(); let select">
          <mat-form-field (change)="select.setValue($event.target.value); validateField(field)">
              <mat-label>{{ select.getPlaceholder() }}</mat-label>
              <mat-select (selectionChange)="select.setValue($event.value); validateField(field)" 
              	[value]="select.getValue()" [disabled]="field.getStatus() == STATUS.DISABLED"
              	[required]="field.getStatus() == STATUS.REQUIRED">
                  <mat-option *ngFor="let option of select.getOptionsList()" 
                  	[value]="option.getIndex()">
                      {{ option.getValue() }}
                  </mat-option>
              </mat-select>
          </mat-form-field>
      </div>
      <div *ngIf="field.getSlider(); let slider">
          <mat-slider (change)="slider.setValue($event.value); validateField(field)" thumbLabel 
          	[step]="slider.getStep()" [min]="slider.getMin()" [max]="slider.getMax()" 
          	[value]="slider.getValue()" [disabled]="field.getStatus() == STATUS.DISABLED"></mat-slider>
      </div>
      <div *ngIf="field.getRadioGroup(); let radioGroup">
          <mat-radio-group (change)="radioGroup.setValue($event.value); validateField(field)" 
          	[value]="radioGroup.getValue()" [disabled]="field.getStatus() == STATUS.DISABLED"
          	[required]="field.getStatus() == STATUS.REQUIRED">
              <mat-radio-button *ngFor="let option of radioGroup.getOptionsList()" 
              [value]="option.getIndex()">{{ option.getValue() }}</mat-radio-button>
          </mat-radio-group>
      </div>
      <mat-error>
          {{ field.getError() }}
      </mat-error>
  </div>
  <div *ngFor="let button of form.getButtonsList()">
      <button *ngIf="button.getStatus != STATUS.HIDDEN" (click)="do(button)" [disabled]="button.getStatus() == STATUS.DISABLED" 
      	mat-button>{{ button.getLabel() }}</button>
  </div>
</div>
  `,
	styles: []
})
export class NgMatGrpcFormComponent implements OnInit {
	STATUS = STATUS;
	@Input() form: Form;
	@Input() name: string;
	@Input() host: string;

	@Output() success = new EventEmitter<string>();

	client: FormServiceClient;
	constructor() {
		this.form = new Form();
	}

	ngOnInit() {
		if (this.test()) {
			return
		}
		this.client = new FormServiceClient(this.host);
		this.get();
	}

	do(button: Button): void {
		if (button.getButtonFunc() == BUTTON_FUNC.SEND) {
			this.send();
		} else if (button.getButtonFunc() == BUTTON_FUNC.RESET) {
			this.get();
		} else {
			this.validate()
		}
	}

	get(): void {
		if (this.test()) {
			return
		}
		const req = new GetFormRequest();
		console.log(this.name);
		req.setName(this.name);
		this.client.getForm(req, null, (err, form) => {
			if (err) {
				console.log(err);
				return;
			}
			this.form = form;
			console.log(this.form);
		});
	}

	validateField(field: Field): void {
		if (this.test()) {
			return
		}
		if (field.getInstantValidate()) {
			this.validate()
		}
	}

	validate() {
		if (this.test()) {
			return
		}
		this.client.validateForm(this.form, null, (err, form) => {
			if (err) {
				console.log(err);
				return;
			}
			this.form = form;
			console.log(this.form);
		});
	}

	send(): void {
		if (this.test()) {
			this.success.emit("Thanks");
			return
		}
		this.client.sendForm(this.form, null, (err, res) => {
			if (err) {
				console.log(err);
				return;
			}
			this.form = res.getForm();
			console.log(this.form);
			console.log(res.getMessage());
			console.log(res.getSucceed());
			if (res.getSucceed()) {
				this.success.emit(res.getMessage());
			}
		});
	}

	test(): boolean {
		if (this.host == undefined) {
			return true
		}
		return false
	}

}
