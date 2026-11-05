"""Compress generated voices locally, preserving originals outside the repository."""
import array
import argparse
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
import wave
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[2])
parser.add_argument('--archive', type=Path, required=True)
args = parser.parse_args()
ROOT = args.root.resolve()
META = ROOT / 'docs/audio-v1/enregistrements-v2-openai.json'
meta = json.loads(META.read_text(encoding='utf-8'))
archive = args.archive.resolve()
if archive.is_relative_to(ROOT):
    raise ValueError('Archive must be outside the repository')
ffmpeg = shutil.which('ffmpeg')
if not ffmpeg:
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
audit = []
for language, data in meta.items():
    for clip in data['clips']:
        source = ROOT / 'frontend/public/sounds/preschool' / language / clip['fichier']
        if source.suffix != '.wav':
            continue
        with wave.open(str(source), 'rb') as recording:
            if recording.getsampwidth() != 2:
                raise ValueError(f'Unsupported PCM width: {source.name}')
            samples = array.array('h', recording.readframes(recording.getnframes()))
            # Streaming WAV headers can advertise an unspecified data length.
            duration = len(samples) / (recording.getframerate() * recording.getnchannels())
        peak = max(abs(sample) for sample in samples) / 32768
        rms = math.sqrt(sum(sample * sample for sample in samples) / len(samples)) / 32768
        if rms < 0.001 or duration < 0.15:
            raise ValueError(f'Empty or silent recording: {source.name}')
        target = source.with_suffix('.mp3')
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-codec:a', 'libmp3lame', '-b:a', '80k', '-ar', '24000', '-ac', '1', str(target)], check=True, capture_output=True)
        # Decode the result to ensure that conversion really produced a playable file.
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-i', str(target), '-f', 'null', '-'], check=True, capture_output=True)
        archive_dir = archive / language
        archive_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, archive_dir / source.name)
        clip['sourceWavSha256'] = clip['sha256']
        clip['fichier'] = target.name
        clip['sha256'] = hashlib.sha256(target.read_bytes()).hexdigest()
        clip['duration'] = duration
        audit.append({'language': language, 'file': target.name, 'durationSeconds': round(duration, 3), 'peak': round(peak, 4), 'rms': round(rms, 4), 'originalBytes': source.stat().st_size, 'compressedBytes': target.stat().st_size})

# Save metadata before removing only the generated WAVs whose archived copy is verified.
META.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
for row in audit:
    source = ROOT / 'frontend/public/sounds/preschool' / row['language'] / Path(row['file']).with_suffix('.wav')
    saved = archive / row['language'] / source.name
    if hashlib.sha256(source.read_bytes()).digest() != hashlib.sha256(saved.read_bytes()).digest():
        raise ValueError('Archive verification failed')
    source.unlink()
report_path = ROOT / 'docs/audio-v2/openai-generation-audit.json'
previous = json.loads(report_path.read_text(encoding='utf-8'))['files'] if report_path.exists() else []
audit = list({(row['language'], row['file']): row for row in previous + audit}.values())
report = {'clips': len(audit), 'originalBytes': sum(row['originalBytes'] for row in audit), 'compressedBytes': sum(row['compressedBytes'] for row in audit), 'checks': 'PCM nonempty, non-silent, WAV duration, MP3 decode, SHA-256. Pronunciation requires listening.', 'files': audit}
report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({key: value for key, value in report.items() if key != 'files'}))
