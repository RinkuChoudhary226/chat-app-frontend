import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input('rating') rating: number = 0;

  //starRating: number = 0;

  constructor() { }

  ngOnInit(): void {
    //this.starRating = rating;
  }

}
