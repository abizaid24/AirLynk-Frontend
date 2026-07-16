import * as THREE from "three";

/** Converts latitude/longitude (degrees) to a point on a sphere of given radius. */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/** Fibonacci sphere point distribution — used for the abstract "dotted" globe surface. */
export function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < samples; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phiVal = Math.acos(1 - (2 * (i + 0.5)) / samples);
    const x = Math.cos(theta) * Math.sin(phiVal) * radius;
    const y = Math.cos(phiVal) * radius;
    const z = Math.sin(theta) * Math.sin(phiVal) * radius;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}
