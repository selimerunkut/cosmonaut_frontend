import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TransferService } from '../../services/transfer.service';

@Component({
  selector: 'app-battle-area',
  templateUrl: './battle-area.component.html',
  styleUrls: ['./battle-area.component.scss']
})
export class BattleAreaComponent implements OnInit {
  @ViewChild('cosmonautAttAddress', { static: true }) cosmonautAttAddress: ElementRef;
  @ViewChild('cosmonautDefAddress', { static: true }) cosmonautDefAddress: ElementRef;
  txOutput: String;

  constructor(private transferService: TransferService) { }

  ngOnInit(): void {
  }

  battle() {
    this.transferService.battleCosmonaut(
      environment.contractAddress721,
      this.cosmonautAttAddress.nativeElement.value,
      this.cosmonautDefAddress.nativeElement.value,
    ).then((value) => {
      this.txOutput = JSON.stringify(value);
    }).catch((value) => {
      this.txOutput = JSON.stringify(value);
    });
  }
}
