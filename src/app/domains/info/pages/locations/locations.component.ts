import { afterNextRender, Component, signal } from '@angular/core';
import { environment as env } from '@env/environment'; // Assuming @env/environment provides env
import { toObservable, toSignal } from '@angular/core/rxjs-interop'; // Import toObservable and toSignal
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // Needed for 'of' operator

@Component({
  selector: 'app-locations',
  imports: [], // Ensure this is correct for your standalone or NgModule setup
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {

  $origin = signal(''); // Signal to hold the user's current location

  constructor() {
    afterNextRender(() => {
      // Get the user's current position after the component has rendered
      navigator.geolocation.getCurrentPosition(position => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(origin); // Update the signal with the acquired location
      }, (error) => {
        // Handle cases where geolocation fails or is denied
        console.error("Error getting geolocation:", error);
        // You might want to set a default origin or display an error message to the user
        // For example, setting an empty string or a known default to still trigger the fetch
        this.$origin.set(''); // Or some default like '0,0' if your API handles it
      });
    });
  }

  // Use toSignal to create a signal that reacts to changes in $origin
  // and fetches locations data
  locations = toSignal(
    toObservable(this.$origin).pipe(
      // switchMap unsubscribes from the previous inner observable and subscribes to a new one.
      // This is perfect for "cancel previous request if source changes" behavior.
      switchMap(currentOrigin => {
        // Only make the request if currentOrigin has a value (e.g., after geolocation is set)
        if (!currentOrigin) {
          // If no origin, return an empty array or specific loading state
          return of([]);
        }

        const url = new URL(`${env.apiUrl}/api/v1/locations`);
        // Add the origin as a search parameter if it exists
        url.searchParams.set('origin', currentOrigin); // Use 'origin' as the parameter name

        // Perform the fetch request
        return fetch(url.toString())
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .catch(error => {
            console.error("Error fetching locations:", error);
            // Return an empty array or a specific error object in the stream
            return of([]); // Ensure the observable stream doesn't break
          });
      }),
      // Catch any errors that might occur within the observable pipeline
      catchError(error => {
        console.error("An unexpected error occurred in the locations stream:", error);
        return of([]); // Return an empty array to maintain the observable stream
      })
    ),
    // Provide an initial value for the 'locations' signal before the first fetch completes
    { initialValue: [] }
  );

}