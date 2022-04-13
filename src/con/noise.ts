import vBase from "../glsl/base.vert";
import fImage from "../glsl/noise.frag";
import { Param } from "../core/param";
import { MyObject3D } from "../webgl/myObject3D";
import { Color } from "three/src/math/Color";
import { DoubleSide } from 'three/src/constants';
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry';
import { Mesh } from 'three/src/objects/Mesh';
import { Func } from "../core/func";
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Update } from "../libs/update";


export class noise extends MyObject3D {

  private _mesh:Mesh

  constructor() {
    super()

    this._mesh = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new ShaderMaterial({
        vertexShader:vBase,
        fragmentShader:fImage,
        transparent:true,
        side:DoubleSide,
        depthTest:false,
        uniforms:{
          alpha:{value:1},
          seed:{value:Math.random()},
          color:{value:new Color(0xffffff)}
        }
      })
    )
    this.add(this._mesh)
    this._mesh.renderOrder = 20
  }

  // ---------------------------------
  //
  // ---------------------------------
  public setColor(c:Color):void {
    const uni = (this._mesh.material as ShaderMaterial).uniforms
    uni.color.value = c
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    const w = Func.instance.sw()
    const h = Func.instance.sh()

    const uni = (this._mesh.material as ShaderMaterial).uniforms
    if(Update.instance.cnt % 2 == 0) uni.seed.value = Math.random()
    uni.alpha.value = Param.instance.noise.alpha.value * 0.01

    const size = Math.max(w, h)
    this._mesh.scale.set(size, size, 1)
  }

}