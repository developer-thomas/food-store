import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: false,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent implements OnInit {
  isLoading!: boolean;
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.isLoading.subscribe((load) => {
      this.isLoading = load;
    });
  }
}
