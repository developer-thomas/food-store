import { Injectable, Input } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods, sample_tags } from '../data';
import { Tag } from '../shared/models/Tag';
@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor() {}

  getAll(): Food[] {
    return sample_foods;
  }

  getAllFoodsBySearchTerm(searchTerm: string) {
    return this.getAll().filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
  }

  getFoodById(foodId: string): Food {
    return this.getAll().find((food) => food.id == foodId) ?? new Food();
  }

  public getAllTags(): Tag[] {
    return sample_tags;
  }

  public getAllFoodsByTag(tag: string): Food[] {
    if (tag == 'All') {
      return this.getAll();
    } else {
      return (
        this.getAll().filter((food) =>
          food.tags?.toLowerCase().includes(tag.toLowerCase())
        ) ?? new Tag()
      );
    }
  }
}
