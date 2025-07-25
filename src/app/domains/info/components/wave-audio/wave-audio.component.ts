import {
  Component,
  viewChild,
  signal,
  AfterViewInit,
  input,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-wave-audio',
  imports: [CommonModule],
  templateUrl: './wave-audio.component.html',
})
export class WaveAudioComponent implements AfterViewInit {
  readonly audioUrl = input.required<string>();
  $waveContainerRef = viewChild.required<ElementRef<HTMLDivElement>>('wave');
  private ws!: WaveSurfer;
  isPlaying = signal(false);

  ngAfterViewInit() {
    this.ws = WaveSurfer.create({
      url: this.audioUrl(),
      container: this.$waveContainerRef().nativeElement,
    });
    this.ws.on('play', () => this.isPlaying.set(true));
    this.ws.on('pause', () => this.isPlaying.set(false));
  }

  playPause() {
    this.ws.playPause();
  }
}
