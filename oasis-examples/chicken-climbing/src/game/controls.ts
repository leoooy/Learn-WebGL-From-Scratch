import { Pane } from 'tweakpane';
const pane = new Pane();
export const data = {
  diffuseIntensity: 1.2,
  title: 'hello',
  animation: '-3038@jump_b',
  color: '#ff0055',
};
export const field = {};

// Object.keys(data).forEach((k) => {
//   field[k] = pane.addInput(data, k);
// });

pane.addInput(data, 'diffuseIntensity');
export const animationControl = pane.addInput(data, 'animation', {
  options: {
    idle: '-3046@idle',
    jump: '-3038@jump_b',
  },
});

export default pane;
