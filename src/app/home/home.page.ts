import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Movie } from '../services/movie';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { settings } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonIcon, IonButton, IonButtons, IonSearchbar, IonInfiniteScrollContent, IonInfiniteScroll, IonBadge, IonLabel, IonAlert, IonSkeletonText, IonAvatar, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, DatePipe, RouterModule, TranslatePipe],
})
export class HomePage {
  private movieService = inject(Movie);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public dummyArray = ["1", "2", "3", "4", "5"];

  public query: string = "";
  public isSearching: boolean = false;

  constructor() {
    addIcons({settings})
  }

  ionViewWillEnter(): void {
    this.currentPage = 1;
    this.movies.length = 0;
    this.isSearching = false;
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    const request = this.isSearching && this.query
      ? this.movieService.searchMovie(this.query, this.currentPage)
      : this.movieService.getTopRatedMovies(this.currentPage);

    request.pipe(
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

  handleSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    this.query = target.value?.toLowerCase() || '';

    if (this.query) {
      this.isSearching = true;
      this.currentPage = 1;
      this.movies.length = 0;
      this.movieService.searchMovie(this.query).subscribe({
        next: (res) => {
          this.movies.push(...res.results);
        }
      });
    } else {
      this.isSearching = false;
      this.currentPage = 1;
      this.movies.length = 0;
      this.loadMovies();
    }
  }
}
