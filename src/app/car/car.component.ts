import { Component, OnInit } from '@angular/core';
import {
  Button, BUTTON_FUNC,
  Field,
  Form,
  Input,
  Option as FormOption,
  RadioGroup, Select,
  Slider, STATUS
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
    let usernameInput = new Input();
    usernameInput.setPlaceholder("Please enter your username");
    username.setInput(usernameInput);
    let andy = new FormOption();
    andy.setIndex(1);
    andy.setValue("Andy");
    usernameInput.addOptions(andy);
    username.setInstantValidate(true);
    username.setStatus(STATUS.REQUIRED);

    let age = new Field();
    let ageSlider = new Slider();
    ageSlider.setValue(25);
    ageSlider.setMin(14);
    ageSlider.setMax(99);
    ageSlider.setStep(1);
    age.setSlider(ageSlider);
    age.setInstantValidate(true);
    age.setStatus(STATUS.REQUIRED);

    let car = new Field();
    car.setLabel("Do you have a car?");
    let carRadio = new RadioGroup();
    let no = new FormOption();
    no.setIndex(1);
    no.setValue("No");
    let yes = new FormOption();
    yes.setIndex(2);
    yes.setValue("Yes");
    carRadio.setOptionsList([no, yes]);
    carRadio.setValue(yes.getIndex());
    car.setRadioGroup(carRadio);
    car.setInstantValidate(true);
    car.setStatus(STATUS.REQUIRED);

    let brand = new Field();
    let brandSelect = new Select();
    brandSelect.setPlaceholder("What kind of car are you driving?");
    let audi = new FormOption();
    audi.setIndex(1);
    audi.setValue("Audi");
    let bmw = new FormOption();
    bmw.setIndex(2);
    bmw.setValue("BMW");
    brandSelect.setValue(bmw.getIndex());
    brandSelect.setOptionsList([audi, bmw]);
    brand.setSelect(brandSelect);
    brand.setInstantValidate(true);
    brand.setStatus(STATUS.REQUIRED);

    this.form = new Form();
    this.form.setName("car");
    this.form.addFields(username, 1);
    this.form.addFields(age, 2);
    this.form.addFields(car, 3);
    this.form.addFields(brand, 4);

    let button = new Button();
    button.setLabel("Send");
    button.setButtonFunc(BUTTON_FUNC.SEND);

    this.form.setButtonsList([button]);
  }

  onSuccess(msg: string) {
    alert(msg)
  }

}
