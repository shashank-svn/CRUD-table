import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { PersonService } from 'src/app/services/person.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit {
  formInstance: FormGroup;
  occupations: string[];
  action: string;
  multiple: any;
  chooseLabel: string = 'Choose';
  deleteButtonIcon: string = 'close';
  allIds: number[] = [];
  @ViewChild('fileUpload', {static: false})
  fileUpload: ElementRef
  previousId: number;
  inputFileName: string

  @Input()
  files: File[] = []

  constructor(public dialogRef: MatDialogRef<FormModalComponent>, private sanitizer: DomSanitizer, private personService: PersonService,
    @Inject(MAT_DIALOG_DATA) public data: {person: Person, action: string, occupationArr: string[]}) {
    this.formInstance = new FormGroup({
      "id":  new FormControl('', Validators.required),
      "firstName": new FormControl('', Validators.required),
      "lastName": new FormControl('', Validators.required),
      "age": new FormControl('', Validators.required),
      "job": new FormControl('', Validators.required),
      "experience": new FormControl('', Validators.required),
      "fileName": new FormControl('', Validators.required),
      "fileBase64": new FormControl('', Validators.required)
    });

    this.formInstance.setValue(data.person);
    this.action = data.action;
    this.occupations = data.occupationArr;
    if(data.person.fileName && data.person.fileBase64) {
      this.chooseLabel = 'Change'
    }
    if(this.action === 'Edit') {
      this.previousId = data.person.id;
    }
  }

  ngOnInit(): void {
    this.allIds = this.personService.getAllIds();
  }

  isIdUnique() {
    let index: number = this.allIds.findIndex((id: number) => +id === +this.formInstance.get("id").value);

    if(index !== -1) {
      if(this.action === 'Edit' && +this.formInstance.get("id").value === this.previousId) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  save(): void {
    this.dialogRef.close(Object.assign(new Person(), this.formInstance.value));
  }

  onClick(event) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput(event) {
  }

  onFileSelected(event) {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    console.log('event::::::', event)
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      if (this.validate(file)) {
        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
        if (!this.isMultiple()) {
          this.files = []
        }
        this.formInstance.get('fileName').setValue(files[i].name);
        this.files.push(files[i]);
        this.getBase64(files[i]);
      }
    }
  }

  getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      this.formInstance.get('fileBase64').setValue(reader.result);
    }.bind(this);
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  removeFile(event, file) {
    let ix
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1)
      this.clearInputElement()
    }
  }

  validate(file: File) {
    for (const f of this.files) {
      if (f.name === file.name
        && f.lastModified === file.lastModified
        && f.size === f.size
        && f.type === f.type
      ) {
        return false
      }
    }
    return true
  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }


  isMultiple(): boolean {
    return this.multiple
  }
}
