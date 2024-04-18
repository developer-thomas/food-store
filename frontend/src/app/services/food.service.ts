import { Injectable, Input } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods, sample_tags } from '../data';
import { Tag } from '../shared/models/Tag';
import { HttpClient } from '@angular/common/http';
import {
  FOODS_BY_ID_URL,
  FOODS_BY_SEARCH_URL,
  FOODS_TAGS_URL,
  FOODS_URL,
  FOODS_BY_TAG_URL,
} from '../shared/urls/urls';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  // faz o filtro em sample_foods
  // o component search cria um parâmetro de rota com o nome da comida enviado pelo input do usuário
  // o component home pega esse parâmetro gerado pelo search e chama esse método para renderizar na tela aquilo que foi pesquisado
  getAllFoodsBySearchTerm(searchTerm: string) {
    // Substitui o filtro comentado abaixo por este, coloquei o filtro lá no backend e aqui irei fazer apenas o redirecionamento para a rota criada no backend
    this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);

    // codigo anterior
    // return this.getAll().subscribe((res) => {
    //   res.filter((food) => {
    //     food.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
    //   });
    // });
  }

  getFoodById(foodId: string): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_BY_ID_URL + foodId);

    // return this.getAll().find((food) => food.id == foodId) ?? new Food();
  }

  public getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  public getAllFoodsByTag(tag: string): Observable<Food[]> {
    if (tag == 'All') {
      return this.getAll();
    } else {
      return this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);

      // this.getAll().filter((food) =>
      //   food.tags?.toLowerCase().includes(tag.toLowerCase())
      // ) ?? new Tag()
    }
  }
}
