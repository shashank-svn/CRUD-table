export class Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  job: string;
  experience: number;
  fileName: string;
  fileBase64: string;

  constructor(id: number = null, firstName: string = "", lastName: string = "", age: number = null, job: string = "",
  experience: number = null, fileName: string = "", fileBase64: string = "") {
       this.firstName = firstName;
       this.lastName = lastName;
       this.age = age;
       this.job = job;
       this.id = id;
       this.experience =  experience;
       this.fileName = fileName;
       this.fileBase64 = fileBase64;
  }
}
