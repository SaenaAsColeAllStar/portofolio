export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export class Spring {
  public value: number;
  public target: number;
  public velocity: number;

  private stiffness: number;
  private damping: number;
  private mass: number;

  constructor(
    initialValue = 0,
    config: SpringConfig = {}
  ) {
    this.value = initialValue;
    this.target = initialValue;
    this.velocity = 0;

    this.stiffness = config.stiffness ?? 170;
    this.damping = config.damping ?? 26;
    this.mass = config.mass ?? 1;
  }

  setTarget(target: number) {
    this.target = target;
  }

  update(dt: number): number {
    const force = -this.stiffness * (this.value - this.target);
    const dampingForce = -this.damping * this.velocity;
    const acceleration = (force + dampingForce) / this.mass;

    this.velocity += acceleration * dt;
    this.value += this.velocity * dt;

    return this.value;
  }

  isSettled(tolerance = 0.001): boolean {
    return Math.abs(this.value - this.target) < tolerance && Math.abs(this.velocity) < tolerance;
  }
}
