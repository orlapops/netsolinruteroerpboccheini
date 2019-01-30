import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';


import { UltReciboPageModule } from '../recibo.ult/ultrecibo.module';
import { UltFacturaPageModule } from '../factura.ult/ultfactura.module';
import { UltPedidoPageModule } from '../pedido.ult/ultpedido.module';

@NgModule({
  imports: [
    UltReciboPageModule,
    UltFacturaPageModule,
    UltPedidoPageModule,
    CommonModule,
    IonicModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }