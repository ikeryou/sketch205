import GUI from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Color } from "three/src/math/Color";
import { Conf } from './conf';
import { Update } from '../libs/update';
import { FPS } from '../core/fps';

export class Param {
  private static _instance: Param;

  public fps: number = FPS.MIDDLE;
  public debug: HTMLElement = document.querySelector('.l-debug') as HTMLElement;

  private _dat: any;
  private _stats: any;

  public colors:Array<Color> = []
  public mx:number = 0
  public my:number = 0
  public vMx:number = 0
  public vMy:number = 0
  public tMx:number = 0
  public tMy:number = 0

  public noise = {
    alpha:{value:11, min:0, max:50},
  }

  public edge = {
    yA:{value:-0, min:-50, max:50},
    yB:{value:0, min:-50, max:50},
  }

  public baseSize = {
    width:{value:100, min:100, max:200},
    height:{value:100, min:100, max:200},
    scale:{value:150, min:10, max:350},
    hScale:{value:15, min:1, max:100},
  }

  public shapeA = {
    rot:{value:0, min:-180, max:180},
    rot2:{value:0, min:-180, max:180},
  }
  public shapeB = {
    rot:{value:-123, min:-180, max:180},
    rot2:{value:0, min:-180, max:180},
  }

  public light = {
    x:{value:44, min:-100, max:100},
    y:{value:-24, min:-100, max:100},
    z:{value:100, min:-100, max:100},
    r:{value:0x000000, type:'color'},
  }

  constructor() {
    if (Conf.instance.FLG_PARAM) {
      this.makeParamGUI();
    }

    if (Conf.instance.FLG_STATS) {
      this._stats = Stats();
      document.body.appendChild(this._stats.domElement);
    }

    Update.instance.add(() => {
      this._update();
    });
  }

  private _update(): void {
    if (this._stats != undefined) {
      this._stats.update();
    }
  }

  public static get instance(): Param {
    if (!this._instance) {
      this._instance = new Param();
    }
    return this._instance;
  }

  public makeParamGUI(): void {
    if (this._dat != undefined) return;

    this._dat = new GUI();
    this._add(this.noise, 'noise');
    this._add(this.baseSize, 'baseSize');
  }

  private _add(obj: any, folderName: string): void {
    const folder = this._dat.addFolder(folderName);
    for (var key in obj) {
      const val: any = obj[key];
      if (val.use == undefined) {
        if (val.type == 'color') {
          folder.addColor(val, 'value').name(key);
        } else {
          if (val.list != undefined) {
            folder.add(val, 'value', val.list).name(key);
          } else {
            folder.add(val, 'value', val.min, val.max).name(key);
          }
        }
      }
    }
  }
}
