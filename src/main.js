import Phaser from 'phaser';
import { AdventureScene } from './game/adventure-scene.js';
import { GameSession } from './app/game-session.js';
import './styles.css';

const session = new GameSession();
const scene = new AdventureScene(session.getSceneCallbacks());

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-host',
  width: 960,
  height: 540,
  backgroundColor: '#19251b',
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scene: [scene],
  render: { antialias: false }
});
