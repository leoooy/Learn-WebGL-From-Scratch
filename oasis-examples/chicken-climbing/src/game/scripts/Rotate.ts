import { Script, Vector3 } from 'oasis-engine';

export class Rotate extends Script {
  private roatate_y = new Vector3(0, 0.8, 0);
  private roatate_z = new Vector3(0, 0, 0.6);
  private roatate_x = new Vector3(1, 0, 0);
  onUpdate() {
    // this.entity.transform.rotate(this.roatate_x);
    // this.entity.transform.rotate(this.roatate_y);
    // this.entity.transform.rotate(this.roatate_z);
  }
}
