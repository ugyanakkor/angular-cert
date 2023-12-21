import {Component} from '@angular/core';
import {AsyncPipe, DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    DecimalPipe
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
}
