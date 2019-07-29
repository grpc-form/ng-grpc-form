import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
	Button,
	ButtonFuncType,
	ButtonStatus,
	Field,
	FieldStatus,
	Form,
	FormServiceClient,
	GetFormRequest,
	SelectType,
	Option as FormOption, SelectField, TextField, Validator
} from "grpc-form-ts";

@Component({
	selector: 'ng-mat-grpc-form',
	template: `
<div class="ng-mat-grpc-form mat-typography">
  	<div *ngFor="let field of form.getFieldsList(); index as i" [hidden]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_HIDDEN">
      	<div *ngIf="field.getTextField(); let textField">
          	<mat-form-field (change)="textField.setValue($event.target.value); validateField(field)">
              	<input matInput [placeholder]="field.getLabel()" 
              		[value]="textField.getValue()" [matAutocomplete]="auto"
              		[attr.disabled]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_DISABLED"
              		[required]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_REQUIRED">
              	<mat-autocomplete (optionSelected)="textField.setValue($event.option.value); validateField(field)" 
              		#auto="matAutocomplete">
                  	<mat-option *ngFor="let option of textField.getOptionsList()" 
                  		[value]="option.getValue()">
                      	{{ option.getValue() }}
                  	</mat-option>
              	</mat-autocomplete>
          	</mat-form-field>
      	</div>
      	<div *ngIf="field.getSelectField(); let select">
			<div *ngIf="select.getType() == SELECT_TYPE.SELECT_TYPE_MULTI">
				<mat-form-field>
              		<mat-label>{{ field.getLabel() }}</mat-label>
              		<mat-select (selectionChange)="select.setIndex($event.value); validateField(field)" 
              			[value]="select.getIndex()" [disabled]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_DISABLED"
              			[required]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_REQUIRED">
                  		<mat-option *ngFor="let option of select.getOptionsList()" 
                  			[value]="option.getIndex()">
                      		{{ option.getValue() }}
                  		</mat-option>
              		</mat-select>
          		</mat-form-field>
			</div>
			<div *ngIf="select.getType() == SELECT_TYPE.SELECT_TYPE_SIMPLE">
			 	<div *ngIf="field.getLabel()">
			 		<label>{{ field.getLabel() }}<br></label>
				</div>
				<mat-radio-group (change)="select.setIndex($event.value); validateField(field)" 
					[value]="select.getIndex()" [disabled]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_DISABLED"
					[required]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_REQUIRED">
					<mat-radio-button *ngFor="let option of select.getOptionsList()" 
						[value]="option.getIndex()">{{ option.getValue() }}</mat-radio-button>
				</mat-radio-group>
			</div>
		</div>
		<div *ngIf="field.getNumericField(); let numericField">
		 	<div *ngIf="field.getLabel()">
			 	<label>{{ field.getLabel() }}<br></label>
			</div>
			<mat-slider (change)="numericField.setValue($event.value); validateField(field)" thumbLabel 
				[step]="numericField.getStep()" [min]="numericField.getMin()" [max]="numericField.getMax()" 
				[value]="numericField.getValue()" [disabled]="field.getStatus() == FIELD_STATUS.FIELD_STATUS_DISABLED"></mat-slider>
		</div>
		<mat-error>
			{{ field.getError() }}
		</mat-error>
	</div>
	<div *ngFor="let button of form.getButtonsList()">
		<button *ngIf="button.getStatus != BUTTON_STATUS.BUTTON_HIDDEN" (click)="do(button)" [disabled]="button.getStatus() == BUTTON_STATUS.BUTTON_DISABLED" 
			mat-button>{{ button.getLabel() }}</button>
	</div>
</div>
  `,
	styles: []
})
export class NgMatGrpcFormComponent implements OnInit {
	FIELD_STATUS = FieldStatus;
	BUTTON_STATUS = ButtonStatus;
	SELECT_TYPE = SelectType;
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
		if (button.getType() == ButtonFuncType.SEND) {
			this.send();
		} else if (button.getType() == ButtonFuncType.RESET) {
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
		req.setName(this.name);
		this.client.getForm(req, null, (err, form) => {
			console.log(form);
			if (err) {
				console.log(err);
				return;
			}
			this.form = form;
		});
	}

	validateField(field: Field): void {
		if (field.getInstantValidate()) {
			this.validate();
		}
		let fields = this.form.getFieldsList();
		fields.forEach(function(field) {
			if (field.getInstantValidate()) {
				return
			}
			let textField = field.getTextField();
			if (textField) {
				if (textField.getValue().length < textField.getMin()) {
					field.setError(textField.getMinError());
					return
				}
				if (textField.getValue().length > textField.getMax()) {
					field.setError(textField.getMaxError());
					return
				}
			}
			field.setError("");
		});
		this.test();
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
		});
		this.test();
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
			if (res.getSucceed()) {
				this.success.emit(res.getMessage());
			}
		});
		this.test()
	}

	test(): boolean {
		if (this.host == undefined) {
			console.log(this.form);
			return true
		}
		return false
	}

}
