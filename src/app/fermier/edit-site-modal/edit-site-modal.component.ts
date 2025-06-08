import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-site-modal',
  standalone: false,
  templateUrl: './edit-site-modal.component.html',
  styleUrl: './edit-site-modal.component.css'
})
export class EditSiteModalComponent {
  @Input() site: any;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveSite() {
    this.save.emit(this.site);
  }

  closeModal() {
    this.close.emit();
  }
}
