import { Component, OnInit } from "@angular/core";
import {
  NavController,
  MenuController,
  LoadingController,
  Platform,
  ModalController,
  ActionSheetController
} from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ParEmpreService } from '../../providers/par-empre.service';
// import { VisitasProvider } from "../../providers/visitas/visitas.service";
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { VisitanService } from "../../providers/visitan.service";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProdsService } from '../../providers/prods/prods.service';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion.service';
import { ActividadesService } from '../../providers/actividades/actividades.service';
import { VisitasProvider } from '../../providers/visitas/visitas.service';

@Injectable({
  providedIn: "root"
})

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public visitnanList: Observable<any>;

  openMenu: Boolean = false;
  searchQuery: String = "";
  items: string[];
  showItems: Boolean = false;
  rooms: any;
  adults: any;

  childs: any = 0;
  children: number;
  // hotellocation: string;
  visitas: any;
  cargovisitas = false;
  visitalocation: string;

  agmStyles: any[] = environment.agmStyles;
  user: any = {};
  // search conditions
  public checkin = {
    name: this.translate.get("app.pages.home.label.checkin"),
    date: new Date().toISOString()
  };

  public checkout = {
    name: this.translate.get("app.pages.home.label.checkout"),
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
  };
  coords: any = { lat: 0, lng: 0 };

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    public _parEmpre: ParEmpreService,
    public platform: Platform,
    public modalCtrl: ModalController,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private translate: TranslateProvider,
    public _visitas: VisitasProvider,
    public _prods: ProdsService,
    public _actividades: ActividadesService,
    public _ubicacionService: UbicacionProvider
  ) {
    // this.visitas = this._visitas.cargaRutaActiva();
    // console.log("constructor home");
    // console.log(this._visitas.visitaTodas);
    platform.ready().then(() => {
      console.log("En constructor home usuario: " + _parEmpre.usuario.cod_usuar);
      // La plataforma esta lista y ya tenemos acceso a los plugins.
      // this._parEmpre.reg_log('Home', 'Dispositivo listo');
      this.obtenerPosicion();
      this._ubicacionService.iniciarGeoLocalizacion();
      this._ubicacionService.inicializarUsuario();
      this._ubicacionService.usuario.valueChanges()
          .subscribe( data => {
          this.user = data;
          });
    });
  }

  ngOnInit() {

    // console.log(this._visitas.visitaTodas);
    //Actualizar Inventario para factura y pedido a Firebase
    // const bodega = 'VEH';
    //carga inventario para factura
    this._prods
      .cargaInventarioNetsolin()
      .then(cargo => {
        //Si carga el inventario lo actualiza en firebase
        if (cargo) {
          // console.log("Cargo Inventario de Netsolin");
          const reginv = {
            // inventario : this._visitas.inventario
            inventario: this._prods.inventario
          };
          //  this._visitas.guardarInvdFB(bodega, reginv).then(res => {
          this._prods
            .guardarInvdFB(this._parEmpre.usuario.bod_factura, reginv)
            .then(res => {
              // console.log("Se guardo el Inventario de Netsolin en firebase");
            });
        } else {
          console.log("No pudo cargar inventario de Netsolin");
        }
      })
      .catch(() => {
        console.log("error en homE ngoniti al cargaInventarioNetsolin");
      });
    //carga inventario para pedido
    this._prods.cargaInventarioNetsolinPedido()
      .then(cargo => {
        //Si carga el inventario lo actualiza en firebase
        if (cargo) {
          // console.log("Cargo cargaInventarioNetsolinPedido de Netsolin");
          const reginv = {
            // inventario : this._visitas.inventario
            inventario: this._prods.inventarioPed
          };
          //  this._visitas.guardarInvdFB(bodega, reginv).then(res => {
          this._prods
            .guardarInvdFBpedido(this._parEmpre.usuario.bod_pedido, reginv)
            .then(res => {
              // console.log(
              //   "Se guardo el cargaInventarioNetsolinPedido de Netsolin en firebase"
              // );
            });
        } else {
          console.log(
            "No pudo cargar cargaInventarioNetsolinPedido de Netsolin"
          );
        }
      })
      .catch(() => {
        console.log(
          "error en home por catch al cargaInventarioNetsolinPedido"
        );
      });
      console.log('a cargaActividadesNetsolin');
      //Cargar tipos de actividades a Firebase
      this._actividades.cargaActividadesNetsolin()
      .then(cargo => {
        console.log('a cargaActividadesNetsolin Cargo ', cargo);
        if (cargo) {
          console.log('a cargaActividadesNetsolin Cargo si ', cargo);
          this._actividades.guardarTiposactFB()
            .then(resul => {
                //cargar las actividades de firebase

            });
        } else {
          console.log("No pudo cargar cargaActividadesNetsolin");
        }
      })
      .catch(() => {
        console.log("error en homr cargaActividadesNetsolin ");
      });      

    // this._visitas.userId = '1014236804';
    // this._visitas.cargaPeriodoUsuar(this._visitas.userId).then(cargo => {
    console.log("home antes cargar visitas _parempre:",this._parEmpre,this._visitas);
    this._visitas
      .cargaPeriodoUsuar(this._parEmpre.usuario.cod_usuar)
      .then(cargo => {
        if (cargo) {
          // console.log(
          //   "cargo periodo datos para cargar visitas: ",
          //   this._visitas.userId,
          //   this._visitas.id_ruta,
          //   this._visitas.id_periodo
          // );
          this._visitas
            .cargaVisitas()
            .then(cargo => {
              // console.log("ngOnInit home 2 luego de cargaVisitas");
              // console.log(this._visitas.visitaTodas);
              // console.log(cargo);
              if (cargo) {
                // console.log("ngonit home cargo visitas verdadero");
                this.cargovisitas = true;
              } else {
                // console.log("ngonit home cargo visitas falso");
                this.cargovisitas = false;
              }
            })
            .catch(() => {
              console.log("error en homr ngoniti al cargar visitas");
            });
          //Cargar el Inventario de Firebase suscribirse
          // this._visitas.cargaInventariodFB(bodega);
          this._prods.cargaInventariodFB(this._parEmpre.usuario.bod_factura);
          this._prods.cargaInventariodFBpedido(
            this._parEmpre.usuario.bod_pedido
          );
        } else {
          console.log("ngOnInit home NO CARGO cargaPeriodoUsuar");
        }
      })
      .catch(error => {
        console.log("error en cargaPeriodoUsuar ", error);
      });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }


  itemSelected(item: string) {
    this.visitalocation = item;
    this.showItems = false;
  }

  childrenArr(chil) {
    const child = Number(chil);
    this.childs = Array(child)
      .fill(0)
      .map((v, i) => i);
  }


  obtenerPosicion(): any {
    this.geolocation
      .getCurrentPosition()
      .then(res => {
        this.coords.lat = res.coords.latitude;
        this.coords.lng = res.coords.longitude;
        // this.loadMap();
      })
      .catch(error => {
        console.log(error.message);
        this.coords.lat = 4.625749001284896;
        this.coords.lng = -74.078441;
        // this.loadMap();
      });
  }

  // async nuevoRegistroVisita() {
  //   const modal = await this.modalCtrl.create({
  //     componentProps: { coords: this.coords }
  //   });
  //   return await modal.present();
  // }

  nuevoRegistroVisitssa() {
    // console.log("Mostrsr modal");
    //modal para añadir nuevo Visita
    // let mimodal = this.modalCtrl.create('ModalNuevoSitioPage',this.coords);
    // mimodal.present();
  }
  // togglePopupMenu() {
  //   return this.openMenu = !this.openMenu;
  // }
  // // //
  async viewVisitas() {
    // console.log("homepage visita-list home checkin", this.checkin);
    // console.log("homepage visita-list home ", this.checkin);
    // console.log(
    //   "homepage visita-list home visitalocation",
    //   this.visitalocation
    // );

    const loader = await this.loadingCtrl.create({
      duration: 1000
    });

    loader.present();
    loader.onWillDismiss().then(() => {
      this.navCtrl.navigateForward(
        `visita-list/${this.visitalocation}/${this.checkin.date}/${
          this.checkout.date
        }`
      );
      // this.navCtrl.navigateForward(['visita-list', this.visitalocation,this.checkin.date, this.visitalocation, this.checkout.date]);
      // this.router.navigate(['visita-list', 'text buscar']);
      // this.router.navigate(['/bill-detail', billId]);
    });
  }

  editprofile() {
    this.navCtrl.navigateForward("edit-profile");
  }

  settings() {
    this.navCtrl.navigateForward("settings");
  }

  goToWalk() {
    this.navCtrl.navigateRoot("walkthrough");
  }

  logout() {
    this.navCtrl.navigateRoot("login");
  }

  register() {
    this.navCtrl.navigateForward("register");
  }

  messages() {
    this.navCtrl.navigateForward("messages");
  }
  //convertir cadena "20181020" a una fecha
  convCadenaFecha(cadena) {
    let ano = cadena.substr(0, 4);
    let mes = cadena.substr(4, 2);
    let dia = cadena.substr(6, 2);
    let fecha = new Date(ano, mes, dia, 0, 0, 0, 0);
    return fecha;
  }

  async moreBillOptions(billId): Promise<void> {
    const action = await this.actionSheetCtrl.create({
      header: "Modify your bill",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          icon: "trash",
          handler: () => {
          }
        },
        {
          text: "More details",
          icon: "play",
          handler: () => {
          }
        },
        {
          text: "Mark as Paid!",
          icon: "checkmark",
          handler: () => {
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          icon: "close",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    action.present();
  }
  colorxEstado(estado) {
    // console.log('colorxEstado, estado');
    if (estado === 'C') {
      return 'colorviscerrada';
      // return 'bg-red';
    } else {
      if (estado === 'A') {
        return 'colorvisabierta';
        // console.log('retorna bg-verde');
        // return 'bg-verde';
      } else {
        return 'colorvispend';
        // return 'bg-white';
    }
  }
  }
}
