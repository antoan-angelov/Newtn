abstract class NtShapeBase {
    private _bounds: NtBounds|null = null;
    private _area: number = -1;

    abstract calculate_bounds(): NtBounds;
    abstract calculate_area(): number;

    get bounds() {
        this._bounds = this._bounds || this.calculate_bounds();
        return this._bounds;
    }

    get area() {
        if (this._area == -1) {
            this._area =  this.calculate_area();
        }
        return this._area;
    }
}
