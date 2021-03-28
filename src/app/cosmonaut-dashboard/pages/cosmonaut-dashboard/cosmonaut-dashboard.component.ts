import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  TransferService,
  ExBankBalancesResponse,
} from '../../services/transfer.service';

export interface CosmonautInfo {
  address: String;
  access: {
    owner: String;
    approvals: [];
  };
  info: {
    name: String;
    level: number;
    description: string;
    image: any;
  };
}

@Component({
  selector: 'app-cosmonaut-dashboard',
  templateUrl: './cosmonaut-dashboard.component.html',
  styleUrls: ['./cosmonaut-dashboard.component.scss'],
})
export class CosmonautDashboardComponent implements OnInit {
  env_cont721 = environment.contractAddress721;
  env_cont20 = environment.contractAddress20;
  env_contMarket = environment.contractAddressMarket;
  breakpoint: number;
  breakpointUpper: string;
  cwBalance: string;
  acc: ExBankBalancesResponse;
  cosmonautAddr: [];
  cosmonautInfoArr: CosmonautInfo[];
  constructor(private transferService: TransferService) {
    this.cosmonautInfoArr = [];
  }

  ngOnInit(): void {
    // resizing
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2;
    if (window.innerWidth <= 500) {
      this.breakpointUpper = '2:6';
    } else if (window.innerWidth <= 900 && window.innerWidth > 500) {
      this.breakpointUpper = '2:3';
    } else if (window.innerWidth > 900 && window.innerWidth < 1200) {
      this.breakpointUpper = '2:1';
    } else {
      this.breakpointUpper = '2:0.7';
    }
    // Get AccountDetails
    this.transferService.getAccount().then((value) => {
      this.acc = value;
    });
    // Fetch all possible contract Token/Cosmonaut
    this.transferService
      .queryAllCosmonautAddr(environment.contractAddress721)
      .then((value) => {
        this.cosmonautAddr = value.tokens;
        if (this.cosmonautAddr.length !== 0) {
          // Fetch more details for every Cosmonaut
          this.cosmonautAddr.forEach((element) => {
            this.transferService
              .queryAllCosmonautInfo(environment.contractAddress721, element)
              .then((value: CosmonautInfo) => {
                value.address = element;
                this.cosmonautInfoArr.push(value);
                console.log(JSON.stringify(this.cosmonautInfoArr));
              });
          });
        }
      });
    // Fetch cw-20 balance
    this.getBalance();

    // Fetch number of Tokens
    this.transferService
      .queryNumOfCosmonaut(environment.contractAddress721)
      .then((value) => {
        console.log(JSON.stringify(value));
      });
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  onResize2(event) {
    if (event.target.innerWidth <= 500) {
      this.breakpointUpper = '2:6';
    } else if (
      event.target.innerWidth <= 900 &&
      event.target.innerWidth > 500
    ) {
      this.breakpointUpper = '2:3';
    } else if (
      event.target.innerWidth > 900 &&
      event.target.innerWidth < 1200
    ) {
      this.breakpointUpper = '2:1';
    } else {
      this.breakpointUpper = '2:0.7';
    }
  }

  getBalance(): void {
    this.transferService.getAccount().then((value) => {
      const addr = value.address.toString();
      this.transferService
        .queryCW20Token(environment.contractAddress20, addr)
        .then((value) => {
          this.cwBalance = value.balance;
        });
    });
  }
}
