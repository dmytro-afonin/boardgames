import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SessionFacade } from '@boardgames/data/session';
import { tap } from 'rxjs';

@Component({
  selector: 'feature-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent implements OnInit {
  constructor(private readonly sessionsFacade: SessionFacade) {}

  ngOnInit(): void {
    this.sessionsFacade.allSession$.pipe(
      tap((s) => {
        console.log(s);
      })
    ).subscribe();
  }
}
