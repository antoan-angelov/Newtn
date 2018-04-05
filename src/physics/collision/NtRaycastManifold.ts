class NtRaycastManifold {
    penetration: number = 0;
    readonly intersection_global: NtVec2 = new NtVec2();
    other_body: NtBody|null = null;
}
