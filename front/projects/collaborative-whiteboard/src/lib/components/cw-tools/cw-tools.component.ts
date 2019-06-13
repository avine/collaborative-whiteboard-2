import {
    AfterViewInit, Component, ContentChild, EmbeddedViewRef, EventEmitter, Input, OnInit, Output,
    TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {
    faCut, faPaintBrush, faPlay, faRedoAlt, faTrash, faUndoAlt
} from '@fortawesome/free-solid-svg-icons';

import { ToolboxCutDirective } from '../../directives/toolbox-cut.directive';
import { ToolboxDrawLineDirective } from '../../directives/toolbox-draw-line.directive';
import { Tool, ToolType } from './cw-tools.model';

// TODO: put this in `tools.icons.ts`
const drawLine = faPaintBrush;
const redraw = faPlay;
const undo = faUndoAlt;
const redo = faRedoAlt;
const cut = faCut;
const undoAll = faTrash;

@Component({
  selector: 'cw-tools',
  templateUrl: './cw-tools.component.html',
  styleUrls: ['./cw-tools.component.scss']
})
export class CwToolsComponent implements OnInit, AfterViewInit {

  @Input() tools: Tool[] = [
    { type: 'drawLine', mode: 'toggle', icon: drawLine },
    { type: 'redraw', mode: 'click', icon: redraw },
    { type: 'undo', mode: 'click', icon: undo },
    { type: 'redo', mode: 'click', icon: redo },
    { type: 'cut', mode: 'toggle', icon: cut },
    { type: 'undoAll', mode: 'click', icon: undoAll }
  ];

  @Input() toolType: ToolType;

  @Output() toolTypeChange = new EventEmitter<ToolType>();

  @ContentChild(ToolboxDrawLineDirective, { static: false, read: TemplateRef })
  private drawLineTmplRef: TemplateRef<any>;

  @ContentChild(ToolboxCutDirective, { static: false, read: TemplateRef })
  private cutTmplRef: TemplateRef<any>;

  @ViewChild('viewContainer', { static: false, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  embeddedView: EmbeddedViewRef<any>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.toolType) {
      this.updateView(this.toolType);
    }
  }

  toolHandler(type: ToolType) {
    const mode = this.getMode(type);

    if (mode === 'toggle' && type === this.toolType) {
      this.updateToolType(null);
      this.updateView(null);
    } else {
      this.updateToolType(type);
      this.updateView(type);
    }
  }

  private updateToolType(type: ToolType) {
    this.toolType = type;
    this.toolTypeChange.emit(type);
  }

  private updateView(type: ToolType) {
    this.destroyView();
    if (type === 'drawLine' && this.drawLineTmplRef) {
      this.createView(this.drawLineTmplRef);
    } else if (type === 'cut' && this.cutTmplRef) {
      this.createView(this.cutTmplRef);
    }
  }

  private createView(tmplRef: TemplateRef<any>) {
    this.embeddedView = this.viewContainer.createEmbeddedView(tmplRef);
  }

  private destroyView() {
    if (this.embeddedView) {
      this.embeddedView.destroy();
      this.embeddedView = null;
    }
  }

  private getMode(type: ToolType) {
    return this.tools.find(action => action.type === type).mode;
  }
}