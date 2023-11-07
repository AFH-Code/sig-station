import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunService } from 'src/app/services/commun.service';

declare var $: any;
@Component({
  selector: 'sp-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent implements OnInit, OnDestroy, OnChanges {

  @Input() message = 'notification.message.delElement';
  @Input() btnCancel = ' Annuler ';
  @Input() btnConfirm = 'Confirmer';
  @Input() id = 'sppmodal-container-confirm';
  @Output() onConfirm = new EventEmitter<boolean>(false);
  sub: Subscription = new Subscription();
  isConfirm = false;
  constructor(private communService: CommunService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue) {
      this.id = changes['id'].currentValue;
    }
  }
  ngOnDestroy(): void {
    this.isConfirm = false;
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub.add(
      this.communService.confirm$.subscribe({
        next: (res: boolean) => {
          if (res) {
            this.closeModal();
          }
        },
      })
    );
  }

  closeModal(): void {
    $(`#` + this.id).addClass('out');
    $('body').removeClass('sppmodal-active');
    this.isConfirm = false;
  }

  confirm(): void {
    this.isConfirm = true;
    this.onConfirm.emit(true);
  }
}
