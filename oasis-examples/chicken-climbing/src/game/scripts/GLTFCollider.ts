import {
  BoundingBox,
  BoxColliderShape,
  ColliderShape,
  DynamicCollider,
  Matrix,
  MeshRenderer,
  Script,
  StaticCollider,
  Vector3,
} from 'oasis-engine';
import { context } from '../context';

export class GlTFCollider extends Script {
  collider: any;
  onStart(): void {
    const { entity } = this;
    const renderers = entity.getComponentsIncludeChildren(MeshRenderer, []);
    const boundingBox = renderers[0].bounds.clone();
    for (let i = renderers.length - 1; i > 0; i--) {
      BoundingBox.merge(boundingBox, renderers[i].bounds, boundingBox);
    }
    const worldPosition = new Vector3();
    const worldSize = new Vector3();
    const worldMatrix = new Matrix();
    // Calculate the position and size of the collider.
    boundingBox.getCenter(worldPosition);
    Vector3.subtract(boundingBox.max, boundingBox.min, worldSize);
    // Add entity and calculate the world matrix of the collider.
    const boxEntity = entity.createChild('box');
    boxEntity.transform.worldMatrix = worldMatrix.translate(worldPosition);
    // Add collider.
    const boxCollider = boxEntity.addComponent(StaticCollider);
    const boxColliderShape = new BoxColliderShape();
    boxColliderShape.setSize(worldSize.x, worldSize.y, worldSize.z);
    boxCollider.addShape(boxColliderShape);
    context.wireframe.addCollideWireframe(boxCollider);
    this.collider = boxCollider;
  }
  onTriggerEnter(other: ColliderShape): void {
    console.log('onTriggerEnter', other);
  }
}
