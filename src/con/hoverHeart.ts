import { Param } from "../core/param";
import { Util } from "../libs/util";
import { MyObject3D } from "../webgl/myObject3D";
import { Vector2 } from "three/src/math/Vector2";
import { DoubleSide } from 'three/src/constants';
import { Object3D } from 'three/src/core/Object3D';
import { Mesh } from 'three/src/objects/Mesh';
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Conf } from "../core/conf";
import { LineSegments } from "three/src/objects/LineSegments";
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";


export class hoverHeart extends MyObject3D {

  private _con:Object3D
  private _scaleCon:Object3D
  private _edge:LineSegments | undefined
  private _shadow:Mesh | undefined
  private _mesh:Mesh | undefined
  private _sv:number = 0
  private _s:number = 0
  private _time:number = 0
  private _cnt:number = Util.instance.random(0, 1000)
  private _noise:number = Util.instance.random(0, 1)
  private _tgPos:Vector2 = new Vector2()
  private _movePos:Vector2 = new Vector2()
  private _isPt:boolean

  public isEdge:boolean = Util.instance.hit(3)
  public isShow:boolean = false


  constructor(opt:any = {}) {
    super()

    this._isPt = opt.isPt
    if(this._isPt) {
        this.isEdge = Util.instance.hit(2)
    }

    this._con = new Object3D()
    this.add(this._con)

    this._scaleCon = new Object3D()
    this._con.add(this._scaleCon)

    this._shadow = new Mesh(
      opt.heart,
      new MeshBasicMaterial({
        color:Conf.instance.SHADOW_COLOR,
        transparent:true,
        depthTest:false,
        side:DoubleSide,
        opacity:1,
      })
    )
    this._scaleCon.add(this._shadow)
    this._shadow.renderOrder = opt.isPt ? -1 : 10
    this._shadow.position.x = this._shadow.position.y = 2.5

    if(this.isEdge) {
      this._edge = new LineSegments(opt.heartEdge, new LineBasicMaterial({
          color:Util.instance.randomArr(Param.instance.colors),
          transparent:true
      }))
      this._scaleCon.add(this._edge)
      this._edge.renderOrder = this._shadow.renderOrder + 1
    } else {
      this._mesh = new Mesh(
        opt.heart,
        new MeshBasicMaterial({
          color:Util.instance.randomArr(Param.instance.colors),
          transparent:true,
          depthTest:false,
          side:DoubleSide,
          opacity:1,
        })
      )
      this._scaleCon.add(this._mesh)
      this._mesh.renderOrder = this._shadow.renderOrder + 1
    }

    this.visible = false
  }


  // ---------------------------------
  //
  // ---------------------------------
  public updateColor():void {
    let m:any

    if(this._mesh != undefined) {
      m = (this._mesh.material as MeshBasicMaterial);
      m.color = Util.instance.randomArr(Param.instance.colors)
    }

    if(this._shadow != undefined) {
      m = (this._shadow.material as MeshBasicMaterial);
      m.color = Conf.instance.SHADOW_COLOR
    }

    if(this._edge != undefined) {
      m = (this._edge.material as LineBasicMaterial);
      m.color = Util.instance.randomArr(Param.instance.colors)
    }
  }


  // ---------------------------------
  //
  // ---------------------------------
  public show():void {
    if(this.isShow) return
    this.isShow = true

    this._s = 0.00001
    this._time = 50
    this.visible = true

    this._tgPos.x = Util.instance.range(1)
    this._tgPos.y = Util.instance.range(1)
    this._movePos.x = 0
    this._movePos.y = 0
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    if(this.isShow) {
      let tg = 1
      if(this._time < 0) tg = 0.0001
      const spring = 0.35
      this._sv += (tg - this._s) * spring
      this._s += (this._sv *= spring)
      this._con.scale.set(this._s, this._s, 1)
      this._time--
      if(this._time < -10) {
        this.isShow = false
        this.visible = false
      }

      if(this._time > 0) {
        this.position.x = Util.instance.mix(0, this._tgPos.x, this._s)
        this.position.y = Util.instance.mix(0, this._tgPos.y, this._s)
      }

      if(this._edge != undefined) {
        const edgeRPos = 2
        this._edge.position.x = Util.instance.range(edgeRPos)
        this._edge.position.y = Util.instance.range(edgeRPos)
        this._edge.rotation.z = Util.instance.radian(Util.instance.range(10))
      }

      // ふよふよ
      const rad = Util.instance.radian(this._cnt)
      const r = Util.instance.mix(20, 50, this._noise)
      this._con.position.x = Math.sin(rad * 1.11 * 0.5) * r * 2
      this._con.position.y = Math.cos(rad * -0.97 * 0.5) * r + this._movePos.y
      this._con.rotation.z = Util.instance.radian(Math.sin(rad * 0.88) * Util.instance.mix(10, 30, this._noise))

      this._movePos.y -= Util.instance.mix(5, 30, this._noise) * 0.5 * (this._isPt ? 0.1 : 1)
      if(this._noise > 0.9) {
        this._movePos.y -= 20
      }

      let s = Util.instance.map(Math.sin(rad * 1.31), 1, 1.2, -1, 1) * 3
      s *= Util.instance.mix(0.1, 0.8, this._noise)
      this._scaleCon.scale.set(s, s, 1)

      this._cnt += Util.instance.mix(5, 10, this._noise)
    }
  }

}