import { Component, OnInit } from '@angular/core';
import {
	Field,
	Form,
	Input,
	Input as FormInput, MaxLength,
	MinLength, RadioGroup, Slider,
	Option as FormOption, Select, Button, BUTTON_FUNC
} from "grpc-form-ts";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	constructor() { }

	ngOnInit() {}

}
