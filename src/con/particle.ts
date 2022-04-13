import { Util } from "../libs/util";
import { MyObject3D } from "../webgl/myObject3D";
import { Func } from "../core/func";
import { hoverHeart } from "./hoverHeart";
import { Object3D } from 'three/src/core/Object3D';

export class particle extends MyObject3D {

  private _item:Array<any> = []

  constructor(opt:any = {}) {
    super()

    for(let i = 0; i < 15; i++) {
      const con = new Object3D()
      this.add(con)

      const item = new hoverHeart({
        heart:opt.heart,
        heartEdge:opt.heartEdge,
        isPt:true,
      })
      con.add(item)

      this._item.push({
        mesh:item,
        con:con
      })
    }
  }

  // ---------------------------------
  //
  // ---------------------------------
  public updateColor():void {
    this._item.forEach((val) => {
      val.mesh.updateColor()
    })
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    const w = Func.instance.sw()
    const h = Func.instance.sh()

    if(Util.instance.hit(20)) {
      let isShowPt:boolean = false
      this._item.forEach((val) => {
        const item = val.mesh
        const con = val.con
        if(!item.isShow && !isShowPt) {
          item.show()
          isShowPt = true
          con.position.x = Util.instance.range(w * 0.5)
          con.position.y = Util.instance.range(h * 0.5)

          const s = w * 0.001
          con.scale.set(s, s * -1, 1)
        }
      })
    }
  }

}