class NtCollisionResolver {
    hasCollision(manifold: NtManifold): boolean {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let a_shape: NtShapeBase = A.shape;
        let b_shape: NtShapeBase = B.shape;
        if (a_shape instanceof NtRectangleShape
                && b_shape instanceof NtRectangleShape) {
            return NtCollisionUtils.AABBvsAABB(manifold);
        } else if (a_shape instanceof NtCircleShape
                && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.CircleVsCircle(manifold);
        } else if (a_shape instanceof NtRectangleShape
                && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.AABBvsCircle(manifold);
        } else if (a_shape instanceof NtCircleShape
                && b_shape instanceof NtRectangleShape) {
            manifold.A = B;
            manifold.B = A;
            return NtCollisionUtils.AABBvsCircle(manifold);
        }
        return false;
    }
    resolve(manifold: NtManifold) {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let relativeVelocity: NtVec2 = NtVec2.subtract(B.velocity, A.velocity);
        let collisionNormal = manifold.normal;
        let velocityAlondNormal: number =
            NtVec2.dotProduct(relativeVelocity, collisionNormal);
        // calculate restitution
        let e: number = Math.min(A.restitution, B.restitution);

        // calculate impulse scalar
        let j: number = -(1 + e) * velocityAlondNormal;
        j /= A.inverse_mass + B.inverse_mass;

        // apply impulse
        let impulse: NtVec2 = NtVec2.multiply(collisionNormal, j);
        A.apply_impulse(NtVec2.negate(impulse));
        B.apply_impulse(impulse);
    }
}
