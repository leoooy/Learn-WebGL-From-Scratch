import { Entity, WebGLEngine } from 'oasis-engine';

class Context {
  engine: WebGLEngine;
  rootEntity: Entity;
  initContext(params: { engine: WebGLEngine; rootEntity: Entity }) {
    Object.assign(this, params);
  }
}

export const context = new Context();
