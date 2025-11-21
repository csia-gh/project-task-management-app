import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class BaseService<T> {
  protected readonly baseUrl = '/api';
  // protected readonly baseUrl = 'https://localhost:7140/api';

  protected get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  constructor(protected http: HttpClient, protected endpoint: string) {}

  // GET /api/{endpoint}
  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.baseUrl}/${this.endpoint}`)
      .pipe(catchError(this.handleError));
  }

  // GET /api/{endpoint}/{id}
  getById(id: string): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // POST /api/{endpoint}
  create(item: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${this.endpoint}`, item, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // PUT /api/{endpoint}/{id}
  update(id: string, item: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${this.endpoint}/${id}`, item, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // DELETE /api/{endpoint}/{id}
  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found (404)';
      } else if (error.status === 400) {
        // Validation error
        if (error.error?.errors) {
          // ASP.NET Core validation errors
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = `Validation Error: ${validationErrors.join(', ')}`;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Bad Request (400): ${error.message}`;
        }
      } else if (error.status === 500) {
        errorMessage = 'Internal Server Error (500). Please try again later.';
      } else {
        errorMessage = `Server Error (${error.status}): ${error.message}`;
      }
    }

    console.error('HTTP Error:', error);
    console.error('Error Message:', errorMessage);

    return throwError(() => errorMessage);
  }
}
