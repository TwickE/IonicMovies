import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResult, MovieResult } from './interfaces';
import { Language } from './language';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class Movie {
  private http = inject(HttpClient);
  private languageService = inject(Language);

  getTopRatedMovies(page: number = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/movie/popular?page=${page}&language=${this.languageService.getCurrentLanguage() === 'en' ? 'en-US' : 'pt-PT'}&api_key=${API_KEY}`);
  }

  getMovieDetails(id: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(`${BASE_URL}/movie/${id}?language=${this.languageService.getCurrentLanguage() === 'en' ? 'en-US' : 'pt-PT'}&api_key=${API_KEY}`);
  }

  searchMovie(query: string, page: number = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/search/movie?query=${query}&include_adult=false&language=${this.languageService.getCurrentLanguage() === 'en' ? 'en-US' : 'pt-PT'}&page=${page}&api_key=${API_KEY}`);
  }
}
