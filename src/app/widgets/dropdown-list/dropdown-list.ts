import {Component, EventEmitter, Input, OnInit, Output, HostListener, Signal, signal} from '@angular/core';
import {Router} from "@angular/router";
// import {RdfColorSchemaService} from "@retail-data-factory/rdf-angular-color-schema";
// import {IDropdownEvent} from "@retail-data-factory/rdf-angular-types-components";

type Callback = (item: any, call: boolean) => void;

// import {faAngleDown, faCheck, faSearch, faTimes} from '@fortawesome/free-regular-svg-icons';
import { DropdownItem } from '../../entities/dropdown-item';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
// import {AssistTranslationService} from "@retail-data-factory/rdf-angular-translation-service";

@Component({
  selector: 'app-dropdown-list',
  imports: [],
  templateUrl: './dropdown-list.html',
  styleUrl: './dropdown-list.less',
  standalone: true,
})
export class DropdownList {

  @Input() title: string = '';

  // angleDown = faAngleDown;
  // check = faCheck;

  private _list: Array<DropdownItem> = [];
  @Input()
  set list(value: Array<DropdownItem>) {
    this.setList(value);
  }

  get list() {
    return this._list;
  }

  fullList: Array<DropdownItem> = [];

  searchQuery: string = '';
  searchQuery$: Subject<string> = new Subject();
  searchQueryDebounced$ = this.searchQuery$.pipe(debounceTime(400));
  // searchBtnIcon = faSearch;

  selection: DropdownItem[] = [];

  @Input() showSearch = true;
  
  _width: number | string = 250;

  @Input() set width(value) {
    if (!(typeof value === 'string' && value.includes('calc'))) {
      this._width = typeof value === 'string' ? 'auto' : value + 'px';
    } else {
      this._width = value;
    }
  }

  get width() {
    return this._width;
  }

  @Output() onSelect: EventEmitter<DropdownItem[]> = new EventEmitter<DropdownItem[]>();

  showList: boolean = false;

  
  ngOnInit(): void {
    const prevSelection = Array.isArray(this.selection) ? this.selection : [];
    this.selection = prevSelection;
    
    this.searchQueryDebounced$.subscribe(value => {
      this.searchChange(value);
    })
  }

  getText(item: DropdownItem): string {
    return item ? item.name : '';
  }


  public setList(list: DropdownItem[]): DropdownList {
    this._list = list;
    this.fullList = list;
    return this;
  }

  public setShowSearch(b: boolean): DropdownList {
    this.showSearch = b;
    return this;
  }
  
  getIconName(item: DropdownItem): string {
    return this.isSelected(item) ? 'check-square' : 'square';
  }

  toggle(): void {
    
    this.showList = !this.showList;
    
    if (!this.showList)
      this.apply();

  }

  close(): void {
    if (this.showList) {
      this.showList = false;
      this.apply();
    }
  }

  apply(): void {
    this.onSelect.emit(this.selection);
  }

  onSearchInputChange(text: string) {
    this.searchQuery$.next(text);
  }

  searchChange(text: string): void {

    this.filter((value: DropdownItem) => {
      const valueStr = value.name + "".toLowerCase();
      return valueStr.indexOf(text) !== -1;
    });
  }

  public filter(func: (value: DropdownItem, index: number, array: any[]) => any) {
    this._list = this.fullList.filter(func);
  }

  isSelected(item: DropdownItem) {
    const result = !!this.selection?.find?.(t => t.id === item.id);
    return result;
  }


}
