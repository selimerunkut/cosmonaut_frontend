import { Component, Input, OnInit } from '@angular/core';
import { CosmonautInfo } from '../../pages/cosmonaut-dashboard/cosmonaut-dashboard.component';

@Component({
  selector: 'app-cosmonaut-card',
  templateUrl: './cosmonaut-card.component.html',
  styleUrls: ['./cosmonaut-card.component.scss'],
})
export class CosmonautCardComponent implements OnInit {
  @Input() cosmonautInfo: CosmonautInfo;

  constructor() {}

  ngOnInit(): void {}
}
