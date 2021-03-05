import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-mentor-profile',
  templateUrl: './view-mentor-profile.component.html',
  styleUrls: ['./view-mentor-profile.component.scss']
})
export class ViewMentorProfileComponent implements OnInit {

  selectedId : string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => 
      {
        this.selectedId = params['mentorId'];
      }
      );
  }

}
