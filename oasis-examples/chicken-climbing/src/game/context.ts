import { WireframeManager } from '@oasis-engine-toolkit/auxiliary-lines';
import { Entity, WebGLEngine } from 'oasis-engine';
import { paneData } from './controls';

class Context {
  engine: WebGLEngine;
  rootEntity: Entity;
  wireframe: WireframeManager;
  controls = paneData;
  initContext(params: {
    engine: WebGLEngine;
    rootEntity: Entity;
    wireframe: WireframeManager;
  }) {
    Object.assign(this, params);
  }
}

export const context = new Context();
