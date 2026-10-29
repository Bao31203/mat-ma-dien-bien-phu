import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioController } from '../src/audio/audio-controller.js';

// A controlled Web Audio adapter verifies lifecycle state and graph cleanup;
// it does not simulate or claim audible PCM output.
class AudioNodeAdapter {
  constructor() {
    this.gain = this.frequency = { value: 0, cancelScheduledValues() {},
      setValueAtTime(value) { this.value = value; }, exponentialRampToValueAtTime() {} };
    this.Q = { value: 0 };
  }
  connect() {}
  disconnect() { this.disconnected = true; }
  start() {}
  stop() { this.onended?.(); }
}

class AudioContextAdapter extends EventTarget {
  constructor() {
    super(); this.state = 'suspended'; this.currentTime = 1; this.sampleRate = 8000;
    this.destination = {}; this.resumeCalls = 0; this.pendingResume = null;
  }
  createGain() { return new AudioNodeAdapter(); }
  createOscillator() { return new AudioNodeAdapter(); }
  createBufferSource() { return new AudioNodeAdapter(); }
  createBiquadFilter() { return new AudioNodeAdapter(); }
  createBuffer() { return { getChannelData: () => new Float32Array(this.sampleRate) }; }
  createAnalyser() {
    const node = new AudioNodeAdapter();
    node.getFloatTimeDomainData = samples => samples.fill(0); return node;
  }
  changeState(state) { this.state = state; this.dispatchEvent(new Event('statechange')); }
  async resume() {
    this.resumeCalls++;
    if (this.pendingResume) await this.pendingResume;
    this.changeState('running');
  }
  async close() { this.changeState('closed'); }
}

test('saved preferences stay silent, suspension offers explicit resume, and one controller reuses its context', async () => {
  const changes = [];
  const audio = new AudioController({ onStatusChange: () => changes.push(audio.getSnapshot()) });
  audio.Engine = AudioContextAdapter;
  audio.setPreferences({ audioEnabled: true, audioVolume: 0.5 });
  audio.setMode('exploration');
  assert.equal(audio.context, null, 'saved preference cannot create or resume audio');
  assert.equal(audio.getSnapshot().audible, false);

  assert.equal((await audio.unlockFromGesture()).ok, true);
  const context = audio.context;
  assert.equal(audio.getSnapshot().audible, true);
  assert.equal(audio.getSnapshot().ambientSources, 2);
  context.changeState('suspended');
  const suspended = audio.getSnapshot();
  assert.equal(suspended.unlocked, false);
  assert.equal(suspended.running, false);
  assert.equal(suspended.audible, false);
  assert.equal(suspended.activeSources, 0);
  assert.match(suspended.notice, /Bật lại âm thanh/);
  assert.equal(changes.at(-1).state, 'suspended', 'UI receives the changed playback state');
  audio.setMode('exploration');
  audio.reportMotion({ distance: 100 });
  assert.equal(context.resumeCalls, 1, 'mode/movement must not auto-resume');

  assert.equal((await audio.unlockFromGesture()).ok, true);
  assert.equal(audio.context, context);
  assert.equal(context.resumeCalls, 2);
  assert.equal(audio.getSnapshot().audible, true);
  assert.equal(audio.getSnapshot().notice, null);
  audio.setPreferences({ audioEnabled: false });
  assert.equal(audio.getSnapshot().activeSources, 0);
  assert.equal(audio.master.gain.value, 0);
  audio.destroy();
});

test('disabling sound during a pending resume cannot restart ambient sources', async () => {
  const audio = new AudioController(); audio.Engine = AudioContextAdapter;
  audio.initialize();
  let release;
  audio.context.pendingResume = new Promise(resolve => { release = resolve; });
  audio.setPreferences({ audioEnabled: true }); audio.setMode('exploration');
  const pending = audio.unlockFromGesture();
  audio.setPreferences({ audioEnabled: false });
  release(); await pending;
  assert.equal(audio.getSnapshot().running, true);
  assert.equal(audio.getSnapshot().enabled, false);
  assert.equal(audio.getSnapshot().audible, false);
  assert.equal(audio.getSnapshot().activeSources, 0);
  assert.equal(audio.master.gain.value, 0);
  audio.destroy();
});
