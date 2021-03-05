import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SkillsAutocompleteService } from '../services/skills-autocomplete.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


constructor(private skillService: SkillsAutocompleteService) { }


searchedSkills: string[] = [];

 getSkillsFromService(event) {
     if (event.length > 0) {
       this.skillService.getSkills(event).subscribe(suggestions=>{
         this.searchedSkills = suggestions.content.data[0].options.map((source) => {
           return {
           title: source._source.skill
           }
           });
       })
       //this.searchedskills = this.skils.filter(el => el.title.indexOf(event) !== -1);
     } else {
       this.searchedSkills = [];
     }
   }

  @Output() search : EventEmitter<string> = new EventEmitter();

   clearSearch() {
     console.log("cleared")
   }

   select(event) {
     this.search.emit(event.title)
   }

  onclick(){
    console.log("clicked")
  }

  ngOnInit(): void {

  }

}
