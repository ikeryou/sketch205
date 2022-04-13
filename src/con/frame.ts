import { Param } from "../core/param";
import { Util } from "../libs/util";
import { MyObject3D } from "../webgl/myObject3D";
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { Func } from "../core/func";
import { LineSegments } from "three/src/objects/LineSegments";
import { EdgesGeometry } from 'three/src/geometries/EdgesGeometry';
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";


export class frame extends MyObject3D {

  private _mesh:LineSegments

  constructor() {
    super()

    this._mesh = new LineSegments(
      new EdgesGeometry(new PlaneGeometry(1, 1)),
      new LineBasicMaterial({
        color:Util.instance.randomArr(Param.instance.colors),
        transparent:true
      })
    )
    this.add(this._mesh)
  }


  // ---------------------------------
  //
  // ---------------------------------
  public updateColor():void {
    let m = (this._mesh.material as LineBasicMaterial);
    m.color = Util.instance.randomArr(Param.instance.colors)
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    const w = Func.instance.sw()
    const h = Func.instance.sh()

    const m = 50
    this._mesh.scale.set(w - m, h - m, 1)

    const r = 1
    this._mesh.position.x = Util.instance.range(r)
    this._mesh.position.y = Util.instance.range(r)

    this._mesh.rotation.z = Util.instance.radian(Util.instance.range(0))
  }
}