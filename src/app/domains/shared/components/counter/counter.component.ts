import {
  Component,
  SimpleChanges,
  signal,
  OnChanges,
  OnInit,
  input,
  afterNextRender
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  imports: [CommonModule],
  templateUrl: './counter.component.html',
})
export class CounterComponent
  implements OnChanges, OnInit
{
  readonly duration = input.required<number>();
  readonly message = input.required<string>();
  counter = signal(0);
  counterRef: number | null = null;

  constructor() {
    // NO ASYNC
    // before render
    // una vez
    console.log('constructor');
    console.log('-'.repeat(10));

    afterNextRender(() => {
    this.counterRef = window.setInterval(() => {
      console.log('run interval');
      this.counter.update((statePrev) => statePrev + 1);
    }, 1000);
  });
  }

  ngOnChanges(changes: SimpleChanges) {
    // before and during render
    console.log('ngOnChanges');
    console.log('-'.repeat(10));
    console.log(changes);
    const duration = changes['duration'];
    if (duration && duration.currentValue !== duration.previousValue) {
      this.doSomething();
    }
  }

  ngOnInit() {
    // after render
    // una vez
    // async, then, subs
    console.log('ngOnInit');
    console.log('-'.repeat(10));
    console.log('duration =>', this.duration());
    console.log('message =>', this.message());
  }


  doSomething() {
    console.log('change duration');
    // async
  }
}
