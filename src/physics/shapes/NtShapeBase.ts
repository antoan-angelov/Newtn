abstract class NtShapeBase {
    private _area: number = -1;

    abstract calculate_area(): number;
    abstract get_bounds_for_orientation(orientation: number): NtBounds;
    abstract get_moment_of_inertia(density: number): number;
    abstract is_point_in_shape(point: NtVec2): boolean;
    abstract intersection_with_segment(start: NtVec2, end: NtVec2): NtVec2|null;

    get area() {
        if (this._area == -1) {
            this._area =  this.calculate_area();
        }
        return this._area;
    }
}
