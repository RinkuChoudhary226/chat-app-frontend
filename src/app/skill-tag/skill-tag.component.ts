import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skill-tag',
  templateUrl: './skill-tag.component.html',
  styleUrls: ['./skill-tag.component.scss']
})
export class SkillTagComponent implements OnInit {

  @Input() skill?: string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.skill)
  }

}
