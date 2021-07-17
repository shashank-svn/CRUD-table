import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Person } from "../models/person.model";
import { personsData } from '../constants/persons-static-data';

@Injectable({
  providedIn: 'root'
})

export class PersonService {
  persons$: BehaviorSubject<Person[]>;
  persons: Array<Person> = [];

  constructor() {
    this.persons$ = new BehaviorSubject([]);
    this.persons = personsData;
  }

  getAll() {
    this.persons$.next(this.persons);
  }

  add(person: Person) {
    this.persons.push(person);
    this.persons$.next(this.persons)
  }

  edit(person: Person) {
    let findElem = this.persons.find(p => p.id == person.id);

    findElem.firstName = person.firstName;
    findElem.age = person.age;
    findElem.job = person.job;

    this.persons$.next(this.persons);
  }

  remove(id: number) {
    this.persons = this.persons.filter(p =>  p.id != id);
    this.persons$.next(this.persons);
  }
}
