// The Play Store release builder is intentionally disabled on the V2 development branch.
console.error('V2: use npm run cap:sync:beta and assembleBeta; Play Store release builds are disabled.');
process.exitCode = 1;
