import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FoodService } from 'src/app/services/food.service';

import { Tag } from 'src/app/shared/models/Tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent {
  public tags!: Tag[];
  constructor(private foodService: FoodService) {
    // codigo anterior
    // this.tags = foodService.getAllTags();
    foodService.getAllTags().subscribe((serverTags) => {
      this.tags = serverTags;
    });
  }
}
