import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Person } from "../models/person.model";
import { ApiModules } from "../providers/app-urls.constants";
import { ApiHandler } from "../providers/api-handlers";


@Injectable({
  providedIn: 'root'
})

export class PersonService {
  persons$: BehaviorSubject<Person[]>;
  persons: Array<Person> = [];

  constructor(private apiHandler: ApiHandler) {
    this.persons$ = new BehaviorSubject([]);
    this.persons = [];
  }

  getAll(): Observable<boolean> {
    return this.apiHandler.get(ApiModules.persons).pipe(
      map((personsData: any) => {
        for(let i = 0; i < personsData.length; i++) {
          let person = new Person();
          person.firstName = personsData[i].firstName;
          person.lastName = personsData[i].lastName;
          person.id = +personsData[i].id;
          person.age = personsData[i].age;
          person.job = personsData[i].job;
          person.experience = +personsData[i].experience;
          person.fileName = personsData[i].fileName;
          person.fileBase64 = personsData[i].fileBase64;

          this.persons.push(person);
          this.persons$.next(this.persons);
        }
        return true;
      })
    ) as Observable<boolean>
  }

  add(person: Person) {
    this.persons.push(person);
    this.persons$.next(this.persons)
  }

  getPersonById(id: number) {
    let personById: Person = this.persons.find((person: Person) => person.id === id);
     return personById;
  }

  getAllIds() {
    let idArr: number[] = [];
    this.persons.forEach((person: Person) => {
      idArr.push(person.id);
    });
    return idArr;
  }

  edit(person: Person) {
    let findElem = this.persons.find(p => p.id == person.id);

    findElem.firstName = person.firstName;
    findElem.lastName = person.lastName;
    findElem.id = person.id;
    findElem.age = person.age;
    findElem.job = person.job;
    findElem.experience = person.experience;
    findElem.fileName = person.fileName;
    findElem.fileBase64 = person.fileBase64;

    this.persons$.next(this.persons);
  }

  remove(id: number) {
    this.persons = this.persons.filter(p =>  p.id != id);
    this.persons$.next(this.persons);
  }

  getOccupations() : Observable<string[]>{
    return this.apiHandler.get(ApiModules.occupations).pipe(
      map((occupations: any) => {
          let occupationArr: String[] = [];
          for(let i = 0; i < occupations.length; i++) {
            occupationArr.push(occupations[i][i.toString()]);
          }
          return occupationArr;
      })
    ) as Observable<string[]>
  }
}
