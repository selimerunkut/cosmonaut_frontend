import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TransferService } from '../../services/transfer.service';

interface Offer {
  id: string,
  token_id: string,
  list_price: {
    address: string,
    amount: string
  },
  contract_addr: string,
  seller: string
};
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
  @ViewChild('cosmonautAddress', { static: true }) cosmonautAddress: ElementRef;
  @ViewChild('cosmonautPrice', { static: true }) cosmonautPrice: ElementRef;
  @ViewChild('offeringId', { static: true }) offeringId: ElementRef;
  @ViewChild('buyOfferingId', { static: true }) buyOfferingId: ElementRef;
  @ViewChild('buyCosmonautPrice', { static: true }) buyCosmonautPrice: ElementRef;
  offerings: Offer[];
  txOutput: String;

  constructor(private transferService: TransferService) {
    this.offerings = [];
  }

  ngOnInit(): void {
    this.getOfferings();
  }

  sell(): void {
    this.transferService.sellCosmonaut(
      environment.contractAddress721,
      environment.contractAddressMarket,
      environment.contractAddress20,
      this.cosmonautAddress.nativeElement.value,
      this.cosmonautPrice.nativeElement.value).then((value) => {
        this.cosmonautAddress.nativeElement.value = "";
        this.cosmonautPrice.nativeElement.value = "";
        this.txOutput = JSON.stringify(value);
        this.getOfferings();
      }).catch((value) => {
        this.txOutput = JSON.stringify(value);
        console.log('FAILED to sell')
        console.log(JSON.stringify(value))
      });
  }

  buy(): void {
    this.transferService.buyCosmonaut(
      environment.contractAddress20,
      environment.contractAddressMarket,
      this.buyCosmonautPrice.nativeElement.value,
      this.buyOfferingId.nativeElement.value
    ).then((value) => {
      this.buyCosmonautPrice.nativeElement.value = "";
      this.buyOfferingId.nativeElement.value = "";
      this.txOutput = JSON.stringify(value);
      this.getOfferings();
    }).catch((value) => {
      this.txOutput = JSON.stringify(value);
      console.log('FAILED to buy')
      console.log(JSON.stringify(value))
    });
  }

  withdraw(): void {
    this.transferService.withdrawCosmonaut(
      environment.contractAddressMarket,
      this.offeringId.nativeElement.value
    ).then((value) => {
      this.offeringId.nativeElement.value = "";
      this.txOutput = JSON.stringify(value);
      this.getOfferings();
    }).catch((value) => {
      this.txOutput = JSON.stringify(value);
    });
  }

  getOfferings(): void {
    this.transferService.queryNFTOfferings(environment.contractAddressMarket).then((value) => {
      this.offerings = [];
      const res = JSON.parse(JSON.stringify(value));
      res.offerings.forEach(element => {
        this.offerings.push(element);
      });
    }).catch((value) => {
      console.log('FAILED to get offerings')
      console.log(JSON.stringify(value))
    });
  }

}
