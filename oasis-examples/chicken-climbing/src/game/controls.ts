import { Pane } from 'tweakpane';
import { context } from './context';
const pane = new Pane();

export const paneData = {
  animation: '-3038@jump_b',
  gameStart: true,
};

export const animationControl = pane.addInput(paneData, 'animation', {
  options: {
    idle: '-3046@idle',
    jump: '-3038@jump_b',
  },
});
export const gameStart = pane
  .addInput(paneData, 'gameStart')
  .on('change', (ev) => {
    context.controls.gameStart = ev.value;
  });

export default pane;
