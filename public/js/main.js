/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const view = document.getElementById('view');

// // set up fps monitoring
// const stats = new Stats();
// view.getElementsByClassName('stats')[0].appendChild(stats.domElement);

// initialize rendering and set correct sizing
const ratio = window.devicePixelRatio;
const renderer = PIXI.autoDetectRenderer({
  transparent: true,
  antialias: true,
  resolution: ratio,
  width: view.clientWidth,
  height: view.clientHeight,
});
const element = renderer.view;
element.style.width = `${renderer.width / ratio}px`;
element.style.height = `${renderer.height / ratio}px`;
view.appendChild(element);

// center stage and normalize scaling for all resolutions
const stage = new PIXI.Container();
// stage.position.set(view.clientWidth / 2, view.clientHeight / 2);
stage.scale.set(Math.max(renderer.width, renderer.height) / 1024);

// // load a sprite from a svg file
// const sprite = PIXI.Sprite.from('triangle.svg');
// sprite.anchor.set(0.5);
// sprite.tint = 0x00FF00; // green
// stage.addChild(sprite);

// load a frog gif
let frogImages = ["f1.png","f2.png","f3.png","f4.png", "f5.png", "f6.png", "f7.png"];
let textureArray = [];

for (let i=0; i < 4; i++)
{
     let texture = PIXI.Texture.fromImage(frogImages[i]);
     textureArray.push(texture);
};

let frogSprite = new PIXI.extras.AnimatedSprite(textureArray);
var begining = -view.clientWidth/6;
var frogOrigX = begining;
 frogSprite.x = frogOrigX;
 frogSprite.y = 0;//(view.clientHeight/2);//- frogSprite.height;
// frogSprite.position.set(-30, 0)
frogSprite.animationSpeed = 0.067; 
frogSprite.play();
// const frogSprite = PIXI.Sprite.from('frog-walk-15.gif');
stage.addChild(frogSprite);

var style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 90,
  fill: ['#ffffff', '#ff0263'], // gradient
  stroke: '#010633',
  strokeThickness: 5,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: false,
  // wordWrapWidth: 440
});
// 'view.clientWidth = ' + view.clientWidth + ", view.clientHeight = " + view.clientHeight +"\n"
// + "frogSprite.width = " + frogSprite.width + ", frogSprite.height = " + frogSprite.height
var richText = new PIXI.Text("Happy Mother's Day!", style);
var richTextOrigX = begining + view.clientWidth/8;
richText.x = richTextOrigX;
richText.y = frogSprite.y + view.clientHeight/6;//frogSprite.y + (frogSprite.height/2);

stage.addChild(richText);

let spin = true;

// register assistant canvas callbacks
const callbacks = {
  onUpdate(state) {
    console.log('onUpdate', JSON.stringify(state));
    // if ('tint' in state) {
    //   sprite.tint = state.tint;
    // }
    if ('spin' in state) {
      spin = state.spin;
    }
    if ('timer' in state) {
      setTimeout(() => {
        // trigger the assistant as if the user said "instructions"
        assistantCanvas.sendTextQuery('instructions');
      }, state.timer * 1000);
    }
  },
};
assistantCanvas.ready(callbacks);

// // toggle spin on touch events of the triangle
// sprite.interactive = true;
// sprite.buttonMode = true;
// sprite.on('pointerdown', () => {
//   spin = !spin;
// });

let last = performance.now();
// frame-by-frame animation function
const frame = () => {
  // stats.begin();

  // calculate time differences for smooth animations
  const now = performance.now();
  const delta = now - last;

  // // rotate the triangle only if spin is true
  // if (spin) {
  //   sprite.rotation += delta / 1000;
  // }
  last = now;

  // frogSprite.position.set(frogSprite.x + 1, frogSprite.y);
  if (frogSprite.x > view.clientWidth) {
    frogSprite.x = frogOrigX;
    richText.x = richTextOrigX
  } else {
    frogSprite.x++;
    richText.x++;
  }
  renderer.render(stage);
  // stats.end();
  requestAnimationFrame(frame);
};
frame();
