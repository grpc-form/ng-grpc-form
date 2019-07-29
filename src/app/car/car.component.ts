import {
  Component,
  OnInit
} from '@angular/core';
import {
  Button,
  ButtonFuncType,
  ButtonStatus,
  Field,
  FieldStatus,
  Form,
  NumericField,
  Option as FormOption,
  SelectField,
  SelectType,
  TextField,
} from "grpc-form-ts";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  form: Form;
  constructor() { }

  ngOnInit() {
    let username = new Field();
    let usernameInput = new TextField();
    username.setLabel("Please enter your username");
    username.setTextField(usernameInput);
    usernameInput.setMin(4);
    usernameInput.setMinError("Too short");
    let andy = new FormOption();
    andy.setIndex(1);
    andy.setValue("Andy");
    usernameInput.addOptions(andy);
    username.setInstantValidate(false);
    username.setStatus(FieldStatus.FIELD_STATUS_REQUIRED);

    let age = new Field();
    let ageSlider = new NumericField();
    ageSlider.setValue(25);
    ageSlider.setMin(14);
    ageSlider.setMax(99);
    ageSlider.setStep(1);
    age.setNumericField(ageSlider);
    age.setInstantValidate(false);
    age.setStatus(FieldStatus.FIELD_STATUS_REQUIRED);

    let car = new Field();
    car.setLabel("Do you have a car?");
    let carRadio = new SelectField();
    let no = new FormOption();
    no.setIndex(1);
    no.setValue("No");
    let yes = new FormOption();
    yes.setIndex(2);
    yes.setValue("Yes");
    carRadio.setOptionsList([no, yes]);
    carRadio.setIndex(1);
    carRadio.setType(SelectType.SELECT_TYPE_SIMPLE);
    car.setSelectField(carRadio);
    car.setInstantValidate(false);
    car.setStatus(FieldStatus.FIELD_STATUS_REQUIRED);

    let brand = new  Field();
    let brandSelect = new SelectField();
    brand.setLabel("What kind of car are you driving?");
    let audi = new FormOption();
    audi.setIndex(1);
    audi.setValue("Audi");
    let bmw = new FormOption();
    bmw.setIndex(2);
    bmw.setValue("BMW");
    brandSelect.setIndex(2);
    brandSelect.setOptionsList([audi, bmw]);
    brandSelect.setType(SelectType.SELECT_TYPE_MULTI);
    brand.setSelectField(brandSelect);
    brand.setInstantValidate(false);
    brand.setStatus(FieldStatus.FIELD_STATUS_REQUIRED);

    this.form = new Form();
    this.form.setName("car");
    this.form.addFields(username, 1);
    this.form.addFields(age, 2);
    this.form.addFields(car, 3);
    this.form.addFields(brand, 4);

    let button = new Button();
    button.setLabel("Send");
    button.setType(ButtonFuncType.SEND);
    button.setStatus(ButtonStatus.BUTTON_ACTIVE);

    this.form.setButtonsList([button]);
  }

  onSuccess(msg: string) {
    alert(msg)
  }

}
