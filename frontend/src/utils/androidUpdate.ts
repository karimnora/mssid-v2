export type AndroidUpdateKind = 'none' | 'optional' | 'required';

export interface AndroidReleaseInfo {
  latestVersionCode: number;
  minVersionCode: number;
}

/** Compare the APK's bundled versionCode to the live Play numbers from the server. */
export function androidUpdateKind(
  installedVersionCode: number,
  release: AndroidReleaseInfo | null | undefined,
): AndroidUpdateKind {
  if (!release || !Number.isInteger(installedVersionCode) || installedVersionCode < 1) return 'none';
  const latest = Number(release.latestVersionCode);
  const min = Number(release.minVersionCode);
  if (Number.isInteger(min) && min > 0 && installedVersionCode < min) return 'required';
  if (Number.isInteger(latest) && installedVersionCode < latest) return 'optional';
  return 'none';
}
