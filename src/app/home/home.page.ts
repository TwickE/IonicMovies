import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { Movie } from '../services/movie';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonBadge, IonLabel, IonAlert, IonSkeletonText, IonAvatar, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, DatePipe, RouterModule],
})
export class HomePage {
  private movieService = inject(Movie);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public dummyArray = ["1", "2", "3", "4", "5"];

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((error: any) => {
        console.log(error);

        this.error = error.error.status_message;
        return [];
      })
    ).subscribe({
      next: (res) => {
        this.movies.push(...res.results);
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      }
    });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
      this.currentPage++;
      this.loadMovies(event);
  }
}
