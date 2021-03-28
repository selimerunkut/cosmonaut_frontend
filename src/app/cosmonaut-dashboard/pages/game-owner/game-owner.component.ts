import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game-owner',
  templateUrl: './game-owner.component.html',
  styleUrls: ['./game-owner.component.scss']
})
export class GameOwnerComponent implements OnInit {
  @ViewChild('cosmonautAddress', { static: true }) cosmonautAddress: ElementRef;
  @ViewChild('cosmonautName', { static: true }) cosmonautName: ElementRef;
  @ViewChild('cosmonautLevel', { static: true }) cosmonautLevel: ElementRef;
  @ViewChild('cosmonautDescription', { static: true }) cosmonautDescription: ElementRef;
  @ViewChild('cosmonautImage', { static: true }) cosmonautImage: ElementRef;
  txOutput: String;


  constructor(private transferService: TransferService) { }

  ngOnInit(): void {
  }

  createCosmonaut() {
    this.transferService.mintCosmonaut(
      environment.contractAddress721,
      this.cosmonautAddress.nativeElement.value,
      this.cosmonautName.nativeElement.value,
      parseInt(this.cosmonautLevel.nativeElement.value),
      this.cosmonautDescription.nativeElement.value,
      null).then((value) => {
        this.txOutput = JSON.stringify(value);
      }).catch((value) => {
        this.txOutput = JSON.stringify(value);
      });
  }
}