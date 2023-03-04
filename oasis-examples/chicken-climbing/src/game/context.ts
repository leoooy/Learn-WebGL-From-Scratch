import { WireframeManager } from '@oasis-engine-toolkit/auxiliary-lines';
import { Entity, WebGLEngine } from 'oasis-engine';
import initialControls from './controls';

class Context {
  engine: WebGLEngine;
  rootEntity: Entity;
  wireframe: WireframeManager;
  controls = initialControls;
  initContext(params: {
    engine: WebGLEngine;
    rootEntity: Entity;
    wireframe: WireframeManager;
  }) {
    Object.assign(this, params);
  }
}

export const context = new Context();
