class NtCollisionResolver {
    hasCollision(manifold: NtManifold): boolean {
        let A: NtBase = manifold.A;
        let B: NtBase = manifold.B;
        if (A instanceof NtRectangle && B instanceof NtRectangle) {
            return NtCollisionUtils.AABBvsAABB(manifold);
        } else if (A instanceof NtCircle && B instanceof NtCircle) {
            return NtCollisionUtils.CircleVsCircle(manifold);
        } else if (A instanceof NtRectangle && B instanceof NtCircle) {
            return NtCollisionUtils.AABBvsCircle(manifold);
        } else if (A instanceof NtCircle && B instanceof NtRectangle) {
            manifold.A = B;
            manifold.B = A;
            return NtCollisionUtils.AABBvsCircle(manifold);
        }
        return false;
    }
    resolve(manifold: NtManifold) {
        let A: NtBase = manifold.A;
        let B: NtBase = manifold.B;
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
