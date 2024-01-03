import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  @Input() tabName? = 'default';
  @Input() hidden? = new BehaviorSubject<boolean>(true);
}
