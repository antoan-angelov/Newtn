class NtMaterial {
    density: number;
    restitution: number;
    constructor(density: number = 0.5, restitution: number = 1) {
        this.density = density;
        this.restitution = restitution;
    }
}
