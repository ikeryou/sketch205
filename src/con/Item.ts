import { Param } from "../core/param";
import { Util } from "../libs/util";
import { MyObject3D } from "../webgl/myObject3D";
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { Vector2 } from "three/src/math/Vector2";
import { Color } from "three/src/math/Color";
import { DoubleSide } from 'three/src/constants';
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { EdgesGeometry } from 'three/src/geometries/EdgesGeometry';
import { Shape } from 'three/src/extras/core/Shape';
import { Object3D } from 'three/src/core/Object3D';
import { Mesh } from 'three/src/objects/Mesh';
import { Func } from "../core/func";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";
import { hoverHeart } from "./hoverHeart";
import { Conf } from "../core/conf";
import { Update } from "../libs/update";
import { LineSegments } from "three/src/objects/LineSegments";
import { HSL } from "../libs/HSL";

export class Item extends MyObject3D {

  public itemId:number

  private _con:Object3D

  private _conShapeA:Object3D
  private _conRotShapeA:Object3D
  private _shapeA:Mesh
  private _shapeAEdge:LineSegments

  private _conShapeC:Object3D
  private _conRotShapeC:Object3D
  private _shapeC:Mesh

  private _conShapeB:Object3D
  private _conRotShapeB:Object3D
  private _shapeB:Mesh
  private _shapeBEdge:LineSegments
  private _shapeBColor:Color = new Color()

  private _edgeA:Vector2
  private _edgeB:Vector2

  private _baseSize:Vector2 = new Vector2(1, 1)

  private _heartMeshShadow:Mesh
  private _heartMesh:Mesh

  private _hoverHeart:Array<hoverHeart> = []

  private _hoverRate:number = 0
  private _hoverRateV:number = 0
  private _heartDelay:number = 0

  public testMesh:Mesh
  public isHover:boolean = false


  constructor(opt:any = {}) {
    super()

    this.itemId = opt.id

    this._con = new Object3D()
    this.add(this._con)

    // あたり判定用のMesh
    this.testMesh = new Mesh(
        new PlaneGeometry(1.5, 1.5),
        new MeshBasicMaterial({
            color:0xff0000,
            transparent:true,
            depthTest:false,
            side:DoubleSide,
            opacity:0,
        })
    )
    this._con.add(this.testMesh)
    this.testMesh.renderOrder = 10;
    // (this.testMesh['P_ITEM'] as any) = this

    this._edgeA = new Vector2(0, 0)
    this._edgeB = new Vector2(0, 0)

    this._conShapeA = new Object3D()
    this._con.add(this._conShapeA)

    this._conRotShapeA = new Object3D()
    this._conShapeA.add(this._conRotShapeA)

    const isWire = false

    this._shapeA = new Mesh(
      this._getShape(),
      new MeshPhongMaterial({
        color:Util.instance.randomArr(Param.instance.colors),
        emissive:0x000000,
        specular:0x222222,
        transparent:true,
        side:DoubleSide,
        depthTest:false,
        wireframe:isWire
      })
    )
    this._conRotShapeA.add(this._shapeA)
    this._shapeA.renderOrder = 0

    this._shapeAEdge = new LineSegments(
      new EdgesGeometry(this._shapeA.geometry),
      new LineBasicMaterial({
        color:Util.instance.randomArr(Param.instance.colors),
        transparent:true,
        depthTest:false,
      })
    )
    this._conRotShapeA.add(this._shapeAEdge)
    this._shapeAEdge.renderOrder = 5

    // 影
    this._conShapeC = new Object3D()
    this._con.add(this._conShapeC)

    this._conRotShapeC = new Object3D()
    this._conShapeC.add(this._conRotShapeC)

    const bColor = Util.instance.randomArr(Param.instance.colors)
    this._shapeC = new Mesh(
      this._getShape(-1),
      new MeshBasicMaterial({
        color:Conf.instance.SHADOW_COLOR,
        transparent:true,
        depthTest:false,
        side:DoubleSide,
        opacity:1,
        wireframe:isWire
      })
    )
    this._conRotShapeC.add(this._shapeC)
    this._shapeC.renderOrder = 1

    this._conShapeB = new Object3D()
    this._con.add(this._conShapeB)

    this._conRotShapeB = new Object3D()
    this._conShapeB.add(this._conRotShapeB)

    // 上部分
    this._shapeB = new Mesh(
      this._getShape(-1),
      new MeshPhongMaterial({
        color:bColor,
        emissive:0x000000,
        specular:0x222222,
        transparent:true,
        depthTest:false,
        side:DoubleSide,
        wireframe:isWire
      })
    )
    this._conRotShapeB.add(this._shapeB)
    this._shapeB.renderOrder = 2

    this._shapeBEdge = new LineSegments(
      new EdgesGeometry(this._shapeB.geometry),
      new LineBasicMaterial({
        color:Util.instance.randomArr(Param.instance.colors),
        transparent:true,
        depthTest:false,
      })
    )
    this._conRotShapeB.add(this._shapeBEdge)
    this._shapeBEdge.renderOrder = this._shapeAEdge.renderOrder

    // ハート
    this._heartMeshShadow = new Mesh(
      opt.heart,
      new MeshBasicMaterial({
        color:Conf.instance.SHADOW_COLOR,
        transparent:true,
        depthTest:false,
        side:DoubleSide,
        opacity:1,
      })
    )
    this._conRotShapeB.add(this._heartMeshShadow)
    this._heartMeshShadow.renderOrder = 3

    this._heartMesh = new Mesh(
      opt.heart,
      new MeshBasicMaterial({
        color:Util.instance.randomArr(Param.instance.colors),
        transparent:true,
        depthTest:false,
        side:DoubleSide,
        opacity:1,
      })
    )
    this._conRotShapeB.add(this._heartMesh)
    this._heartMesh.renderOrder = 4

    // ホバー用のハート
    for(let i = 0; i < 15; i++) {
      const hh = new hoverHeart({
          heart:opt.heart,
          heartEdge:opt.heartEdge,
          isPt:false,
      })
      this._hoverHeart.push(hh)
      this._con.add(hh)
      const s = Param.instance.baseSize.hScale.value * 0.0001
      hh.scale.set(s, s * -1, 1)
    }

    this._resize()
  }


  // ---------------------------------
  //
  // ---------------------------------
  public updateColor():void {
    let m:any = (this._shapeA.material as MeshPhongMaterial);
    m.color = Util.instance.randomArr(Param.instance.colors)

    m = (this._shapeB.material as MeshPhongMaterial);
    m.color = Util.instance.randomArr(Param.instance.colors)
    this._shapeBColor = m.color

    m = (this._shapeC.material as MeshBasicMaterial);
    m.color = Conf.instance.SHADOW_COLOR

    m = (this._heartMesh.material as MeshBasicMaterial);
    m.color = Util.instance.randomArr(Param.instance.colors)

    m = (this._heartMeshShadow.material as MeshBasicMaterial);
    m.color = Conf.instance.SHADOW_COLOR

    m = (this._shapeAEdge.material as LineBasicMaterial);
    m.color = Util.instance.randomArr(Param.instance.colors)

    m = (this._shapeBEdge.material as LineBasicMaterial);
    m.color = Util.instance.randomArr(Param.instance.colors)

    this._shapeA.visible = !Util.instance.hit(6)
    this._shapeB.visible = !Util.instance.hit(6)
    this._shapeC.visible = this._shapeB.visible

    this._hoverHeart.forEach((val) => {
      val.updateColor()
    })
  }


  // ---------------------------------
  //
  // ---------------------------------
  private _getShape(p:number = 0):ShapeGeometry {
    const shape = new Shape()

    const w = this._baseSize.x
    const h = this._baseSize.y

    const edgeA = this._edgeA
    const edgeB = this._edgeB

    if(p == 0) {
      shape.moveTo(-w * 0.5, -h * 0.5)
      shape.lineTo(w * 0.5, -h * 0.5)
      shape.lineTo(edgeB.x, edgeB.y)
      shape.lineTo(edgeA.x, edgeA.y)
      shape.lineTo(edgeA.x, -h * 0.5)
    } else {
      // B 上部分
      shape.moveTo(-w * 0.5, edgeA.y)
      shape.lineTo(edgeB.x, edgeB.y)
      shape.lineTo(edgeB.x, h * 0.5)
      shape.lineTo(-w * 0.5, h * 0.5)
      shape.lineTo(-w * 0.5, edgeA.y)
    }

    return new ShapeGeometry(shape)
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    if(!this.visible) return

    const w = Func.instance.sw()

    let mx = Param.instance.mx
    let my = Param.instance.my
    const max = 0.8
    mx = Util.instance.clamp(mx, -max, max)
    my = Util.instance.clamp(my, -max, max)

    // ホバー対応
    const hTg = this.isHover ? 1 : 0
    this._hoverRateV += (hTg - this._hoverRate) * 0.2
    this._hoverRate += (this._hoverRateV *= 0.7)

    let m
    if(this.isHover) {
      this._heartMeshShadow.renderOrder = 1
      this._heartMesh.renderOrder = 1
      this._shapeC.renderOrder = 3

      const cc = this._shapeBColor.clone()
      let hsl = new HSL()
      cc.getHSL(hsl)
      hsl.l *= 0.75
      hsl.s *= 0.75
      cc.setHSL(hsl.h, hsl.s, hsl.l)

      m = (this._shapeC.material as MeshBasicMaterial);
      m.color = cc
    } else {
      this._heartMeshShadow.renderOrder = 3
      this._heartMesh.renderOrder = 4
      this._shapeC.renderOrder = 1
      if(this._shapeB.visible) this._shapeC.visible = true

      m = (this._shapeC.material as MeshBasicMaterial);
      m.color = Conf.instance.SHADOW_COLOR
    }

    let noise = this.itemId % 2 == 0 ? 1 : -1
    this._baseSize.x = this._baseSize.y = Util.instance.mix(1, 1.1, this._hoverRate)
    this._baseSize.x *= 1.1

    this._edgeA.x = this._baseSize.x * -0.5
    this._edgeA.y = this._baseSize.y * Util.instance.map(mx * noise, -0.5, 0.5, -1, 1)
    this._edgeA.y = Util.instance.mix(this._edgeA.y, 0, this._hoverRate)
    // this._edgeA.y = this._baseSize.y * 0.25

    this._edgeB.x = this._baseSize.x * 0.5
    this._edgeB.y = this._baseSize.y * Util.instance.map(my * noise, -0.5, 0.5, -1, 1)
    this._edgeB.y = Util.instance.mix(this._edgeB.y, 0, this._hoverRate)
    // this._edgeB.y = this._baseSize.y * 0.25

    const dx = this._edgeA.x - this._edgeB.x
    const dy = this._edgeA.y - this._edgeB.y
    const center = new Vector2((this._edgeA.x + this._edgeB.x) * 0.5, (this._edgeA.y + this._edgeB.y) * 0.5)

    this._shapeA.geometry.dispose()
    this._shapeA.geometry = this._getShape()

    this._shapeB.geometry.dispose()
    this._shapeB.geometry = this._getShape(-1)
    this._shapeC.geometry.dispose()
    this._shapeC.geometry = this._shapeB.geometry

    const ang = Util.instance.degree(Math.atan2(dy, dx))
    this._shapeA.position.x = center.x * -1
    this._shapeA.position.y = center.y * -1
    this._conRotShapeA.rotation.z = Util.instance.radian(ang * -1 + 180)
    this._conShapeA.rotation.z = this._conRotShapeA.rotation.z * -1

    // A ライン
    const edgeRangePos = 0.04
    const edgeRangeRot = 0
    this._shapeAEdge.geometry.dispose()
    this._shapeAEdge.geometry = new EdgesGeometry(this._shapeA.geometry)
    this._shapeAEdge.position.copy(this._shapeA.position)
    this._shapeAEdge.position.x += Util.instance.range(edgeRangePos)
    this._shapeAEdge.position.y += Util.instance.range(edgeRangePos)
    this._shapeAEdge.rotation.z = Util.instance.radian(Util.instance.range(edgeRangeRot))

    this._shapeB.position.x = center.x * -1
    this._shapeB.position.y = center.y * -1
    this._conRotShapeB.rotation.z = Util.instance.radian(ang * -1 + 180)
    this._conShapeB.rotation.z = this._conRotShapeB.rotation.z * -1

    // B ライン
    this._shapeBEdge.geometry.dispose()
    this._shapeBEdge.geometry = new EdgesGeometry(this._shapeB.geometry)
    this._shapeBEdge.position.copy(this._shapeB.position)
    this._shapeBEdge.position.x += Util.instance.range(edgeRangePos)
    this._shapeBEdge.position.y += Util.instance.range(edgeRangePos)
    this._shapeBEdge.rotation.z = Util.instance.radian(Util.instance.range(edgeRangeRot))

    this._shapeC.position.copy(this._shapeB.position)
    this._conRotShapeC.rotation.z = this._conRotShapeB.rotation.z
    this._conShapeC.rotation.z = this._conShapeB.rotation.z
    this._conShapeC.position.y = this.isHover ? 0 : -0.03

    // 全体サイズ
    const allRad = Util.instance.radian(this.itemId * 10 + Update.instance.cnt * 3)
    let size = w * 0.05 * Param.instance.baseSize.scale.value * 0.01
    size *= Util.instance.mix(1, 1.3, this._hoverRate)
    size *= Util.instance.mix(1, Util.instance.map(Math.sin(allRad), 1, 1.2, -1, 1), this._hoverRate)
    this._con.scale.set(size, size, 1)

    // 全体ゆらゆら
    const allR = Util.instance.mix(0, size * 0.05, this._hoverRate)
    this._con.position.x = Math.sin(allRad * 1.11) * allR
    this._con.position.y = Math.cos(allRad * -0.89) * allR
    this._con.rotation.z = Util.instance.radian(Math.cos(allRad * 1.29) * Util.instance.mix(0, 10, this._hoverRate))

    // this._conRotShapeA.rotation.x = Util.instance.radian(Param.instance.shapeA.rot.value + mx * 40)
    this._conRotShapeA.rotation.x = Util.instance.radian(Param.instance.shapeA.rot.value + mx * 0)
    this._conRotShapeB.rotation.x = Util.instance.radian(Param.instance.shapeB.rot.value + Util.instance.mix(0, 90, this._hoverRate))
    this._conRotShapeC.rotation.x = this._conRotShapeB.rotation.x

    const matA = this._shapeA.material as MeshPhongMaterial
    matA.specular = new Color(Param.instance.light.r.value)
    const matB = this._shapeB.material as MeshPhongMaterial
    matB.specular = new Color(Param.instance.light.r.value)

    // ハート
    const hSize = Param.instance.baseSize.hScale.value * 0.0001
    this._heartMesh.scale.set(hSize, hSize, 1)
    this._heartMeshShadow.scale.set(hSize, hSize, 1)
    this._heartMesh.position.x = this._shapeB.position.x
    this._heartMesh.position.y = this._shapeB.position.y + this._baseSize.y * 0.5
    this._heartMeshShadow.position.copy(this._heartMesh.position)
    this._heartMeshShadow.position.y += 0.04

    if((this.isHover && this._heartDelay < 0) || (Util.instance.hit(150))) {
      let isHoverShow = false
      this._hoverHeart.forEach((val) => {
        if(!isHoverShow && !val.isShow) {
          val.show()
          isHoverShow = true
          this._heartDelay = 2
        }
      })
    }
    this._heartDelay--
  }

}