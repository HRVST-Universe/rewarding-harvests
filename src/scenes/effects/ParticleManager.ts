import Phaser from 'phaser';

export class ParticleManager {
  private scene: Phaser.Scene;
  private particleSystems: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('ParticleManager: Initialized');
    
    // Add scene cleanup listener
    this.scene.events.on('shutdown', this.clearParticles, this);
    this.scene.events.on('destroy', this.clearParticles, this);
  }

  createWinParticles(x: number, y: number, radius: number): void {
    console.log('ParticleManager: Creating win particles at', { x, y, radius });
    
    const particles = this.scene.add.particles(x, y, 'particle', {
      lifespan: 2000,
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
      quantity: 1,
      frequency: 150,
      rotate: { min: 0, max: 360 }
    });

    // Set proper depth to avoid rendering issues
    particles.setDepth(1);
    this.particleSystems.push(particles);

    // Only start emitting when explicitly called
    particles.start();

    // Auto cleanup after animation duration
    this.scene.time.delayedCall(2000, () => {
      if (particles && particles.active) {
        console.log('ParticleManager: Cleaning up particle system');
        particles.stop();
        const index = this.particleSystems.indexOf(particles);
        if (index > -1) {
          this.particleSystems.splice(index, 1);
          particles.destroy();
        }
      }
    });
  }

  clearParticles(): void {
    console.log('ParticleManager: Clearing all particles');
    this.particleSystems.forEach(particles => {
      if (particles && particles.active) {
        particles.stop();
        particles.destroy();
      }
    });
    this.particleSystems = [];
  }

  destroy(): void {
    this.clearParticles();
    this.scene.events.off('shutdown', this.clearParticles, this);
    this.scene.events.off('destroy', this.clearParticles, this);
  }
}