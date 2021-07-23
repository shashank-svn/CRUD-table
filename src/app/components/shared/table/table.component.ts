import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Person } from 'src/app/models/person.model';
import { PersonService } from 'src/app/services/person.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { FormModalComponent } from '../../form-modal/form-modal.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public displayedColumns: string[] = ['checkBox', 'id', 'firstName', 'lastName', 'age', 'job', 'experience', 'fileName'];
  public columnsToDisplay: string[] = [...this.displayedColumns, 'actions'];
  public selectedRows: number[] = [];
  public columnsFilters = {};
  public selectAllCheckbox;
  selection = new SelectionModel<Person>(true, []);
  public dataSource: MatTableDataSource<Person>;
  private serviceSubscribe: Subscription;

  constructor(private personService: PersonService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Person>();
  }


  private filter() {

    this.dataSource.filterPredicate = (data: Person, filter: string) => {
      let find = true;

      for (var columnName in this.columnsFilters) {

        let currentData = "" + data[columnName];

        //if there is no filter, jump to next loop, otherwise do the filter.
        if (!this.columnsFilters[columnName]) {
          return;
        }


        let searchValue = this.columnsFilters[columnName]["contains"];

        if (!!searchValue && currentData.indexOf("" + searchValue) < 0) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["equals"];
        if (!!searchValue && currentData != searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["greaterThan"];
        if (!!searchValue && currentData <= searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["lessThan"];
        if (!!searchValue && currentData >= searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["startWith"];

        if (!!searchValue && !currentData.startsWith("" + searchValue)) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["endWith"];
        if (!!searchValue && !currentData.endsWith("" + searchValue)) {
          find = false;
          //exit loop
          return;
        }

      }

      return find;
    };

    this.dataSource.filter = null;
    this.dataSource.filter = 'activate';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Create a filter for the column name and operate the filter action.
   */
  applyFilter(columnName: string, operationType: string, searchValue: string) {
    this.columnsFilters[columnName] = {};
    this.columnsFilters[columnName][operationType] = searchValue;
    this.filter();
  }

  /**
   * clear all associated filters for column name.
   */
  clearFilter(columnName: string) {
    if (this.columnsFilters[columnName]) {
      delete this.columnsFilters[columnName];
      this.filter();
    }
  }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }

  getOccupations(person?: Person)  {
    this.personService.getOccupations().subscribe((occupationArr: string[]) => {
      if(person) {
        this.edit(person, occupationArr)
      } else {
        this.add(occupationArr);
      }
    });
  }

  selectAllRows() {
    this.selectedRows = [];
    this.dataSource.data.forEach((person: Person) => {
      this.selectedRows.push(person.id);
    });
  }

  edit(person: Person, incomingOccupations: string[]) {
    const dialogRef = this.dialog.open(FormModalComponent, {
      width: '400px',
      data: {
        person: person,
        action: "Edit",
        occupationArr: incomingOccupations
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.edit(result);
      }
    });
  }

  downloadPdf(incomingId: number){
    let personById: Person =  this.personService.getPersonById(incomingId);
    let base64String = personById.fileBase64.split('base64')[1];
    if(window.navigator && window.navigator.msSaveOrOpenBlob){ 
      // download PDF in IE
      let byteChar = atob(base64String);
      let byteArray = new Array(byteChar.length);
      for(let i = 0; i < byteChar.length; i++){
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], {type : 'application/pdf'});
      window.navigator.msSaveOrOpenBlob(blob, `${personById.fileName}.pdf`);
    } else {
      // Download PDF in Chrome etc.
      const source = `data:application/pdf;base64${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${personById.fileName}.pdf`
      link.click();
    }
  }

  add(incomingOccupations: string[]) {
      let person = new Person();
      const dialogRef = this.dialog.open(FormModalComponent, {
        width: '400px',
        data: {
          person: person,
          action: "Add",
          occupationArr: incomingOccupations
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.personService.add(result);
        }
      });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.remove(id);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.personService.getAll().subscribe((status) => {});
    this.serviceSubscribe = this.personService.persons$.subscribe(res => {
      this.dataSource.data = res;
    })
  }

  ngOnDestroy(): void {
    this.serviceSubscribe.unsubscribe();
  }

}
