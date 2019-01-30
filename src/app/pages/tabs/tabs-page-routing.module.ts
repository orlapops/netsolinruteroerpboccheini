import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
// import { SchedulePage } from '../schedule/schedule';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'ultfactura',
        children: [
        //   {
        //     path: '',
        //     component: SchedulePage,
        //   },
          {
            path: 'ultfactura',
            loadChildren: './pages/factura.ult/ultfactura.module#UltFacturaPageModule'
          }
        ]
      },
      {
        path: 'ultpedido',
        children: [
          {
            path: '',
            loadChildren: './pages/pedido.ult/ultpedido.module#UltPedidoPageModule'
          },
          {
            path: 'verpedido/:id',
            loadChildren: './pages/verpedidos/verpedido.module#VerpedidoPageModule'
          }
        ]
      },
      {
        path: 'ultrecibo',
        children: [
          {
            path: '',
            loadChildren: './pages/recibo.ult/ultrecibo.module#UltReciboPageModule'
          }
        ]
      },
    //   {
    //     path: 'about',
    //     children: [
    //       {
    //         path: '',
    //         loadChildren: '../about/about.module#AboutModule'
    //       }
    //     ]
    //   },
    //   {
    //     path: '',
    //     redirectTo: '/app/tabs/schedule',
    //     pathMatch: 'full'
    //   }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
