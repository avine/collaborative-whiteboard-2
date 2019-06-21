import { Subscription } from 'rxjs';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DrawOptions, DrawTransport, Owner } from '../../cw.model';
import { CwService } from '../../cw.service';
import { defaultColor } from '../cw-color-picker/cw-color-picker.operator';

@Component({
  selector: 'cw-whiteboard',
  templateUrl: './cw-whiteboard.component.html',
  styleUrls: ['./cw-whiteboard.component.scss'],
  providers: [CwService]
})
export class CwWhiteboardComponent implements OnInit, OnDestroy {

  @Input() set onwer(owner: Owner) {
    this.service.owner = owner;
  }

  @Input() set broadcast(transport: DrawTransport) {
    this.service.broadcast(transport);
  }

  @Output() emit = new EventEmitter<DrawTransport>();

  drawOptions: DrawOptions = {
    strokeStyle: defaultColor,
    lineWidth: 6
  };

  showDrawLineTool = false;

  showCutTool = false;

  hideGuides = false;

  subscription: Subscription;

  constructor(public service: CwService) { }

  ngOnInit() {
    this.subscription = this.service.emit$.subscribe((transport: DrawTransport) => {
      this.emit.emit(transport);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
