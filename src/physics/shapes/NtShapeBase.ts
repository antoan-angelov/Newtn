abstract class NtShapeBase {
    private _area: number = -1;

    abstract calculate_area(): number;
    abstract get_bounds_for_orientation(orientation: number): NtBounds;

    get area() {
        if (this._area == -1) {
            this._area =  this.calculate_area();
        }
        return this._area;
    }
}
