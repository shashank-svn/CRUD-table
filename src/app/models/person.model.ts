export class Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  job: string;
  experience: number;

  constructor(id: number = null, firstName: string = "", lastName: string = "", age: number = null, job: string = "",
  experience: number = null) {
       this.firstName = firstName;
       this.lastName = lastName;
       this.age = age;
       this.job = job;
       this.id = id;
       this.experience =  experience
  }
}
