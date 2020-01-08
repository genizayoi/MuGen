import pretty_midi as pm
from random import randint
from tempfile import NamedTemporaryFile
import subprocess

midi = pm.PrettyMIDI(resolution=960, initial_tempo=150)
inst = pm.Instrument(0)
loop = 1

acc = [
[
    (2.00, ['C#4', 'F4', 'G#4', 'C5']),
    (2.00, ['D#4', 'G4', 'A#4', 'C5']),
    (4.00, ['F4', 'G#4', 'C5', 'D#5']),
],
[
    (2.00, ['C#4', 'F4', 'G#4', 'C5']),
    (2.00, ['D#4', 'G4', 'A#4', 'C5']),
    (4.00, ['F4', 'G#4', 'C5', 'D#5']),
],
[
    (0.25, ['C#4']),
    (0.25, ['F4']),
    (0.25, ['G#4']),
    (1.25, ['C5']),
    (0.25, ['D#4']),
    (0.25, ['G4']),
    (0.25, ['A#4']),
    (1.25, ['C5']),
    (0.25, ['F4']),
    (0.25, ['G#4']),
    (0.25, ['C5']),
    (1.25, ['D#5']),
    (0.25, ['F4']),
    (0.25, ['G#4']),
    (0.25, ['C5']),
    (1.25, ['D#5']),
],
[
    (0.25, ['C#4']),
    (0.25, ['F4']),
    (0.25, ['G#4']),
    (1.25, ['C5']),
    (0.25, ['D#4']),
    (0.25, ['G4']),
    (0.25, ['A#4']),
    (1.25, ['C5']),
    (0.25, ['F4']),
    (0.25, ['G#4']),
    (0.25, ['C5']),
    (1.25, ['D#5']),
    (0.25, ['F4']),
    (0.25, ['G#4']),
    (0.25, ['C5']),
    (1.25, ['D#5']),
],
[
    (2.00, ['C#3', 'F3', 'G#3', 'C4']),
    (2.00, ['D#3', 'G3', 'A#3', 'C4']),
    (2.00, ['F3', 'G#3', 'C4', 'D#4']),
    (2.00, ['F3', 'G#3', 'C4', 'D#4']),
],
[
    (2.00, ['C#3', 'F3', 'G#3', 'C4']),
    (2.00, ['D#3', 'G3', 'A#3', 'C4']),
    (2.00, ['F3', 'G#3', 'C4', 'D#4']),
    (2.00, []),
],
[
    (0.75, ['C#2', 'C#3', 'F3', 'G#3', 'C4']),
    (0.75, ['C#2', 'C#3', 'F3', 'G#3', 'C4']),
    (0.50, ['C#2', 'C#3', 'F3', 'G#3', 'C4']),
    (0.75, ['D#2', 'D#3', 'G3', 'A#3', 'C4']),
    (0.75, ['D#2', 'D#3', 'G3', 'A#3', 'C4']),
    (0.50, ['D#2', 'D#3', 'G3', 'A#3', 'C4']),

    (0.75, ['C3', 'D#3', 'G3', 'A#3']),
    (0.75, ['C3', 'D#3', 'G3', 'A#3']),
    (0.50, ['C3', 'D#3', 'G3', 'A#3']),
    (0.75, ['F3', 'G#3', 'C4', 'D#4']),
    (0.75, ['F3', 'G#3', 'C4', 'D#4']),
    (0.50, ['F3', 'G#3', 'C4', 'D#4']),
],
[
    (0.75, ['C#2', 'C#3', 'F3', 'G#3', 'C4']),
    (0.75, ['C#2', 'C#3', 'F3', 'G#3', 'C4']),
    (0.50, ['C#2', 'C#3', 'F3', 'G#3', 'C4']),
    (0.75, ['D#2', 'D#3', 'G3', 'A#3', 'C4']),
    (0.75, ['D#2', 'D#3', 'G3', 'A#3', 'C4']),
    (0.50, ['D#2', 'D#3', 'G3', 'A#3', 'C4']),

    (0.75, ['C3', 'D#3', 'G3', 'A#3']),
    (0.75, ['C3', 'D#3', 'G3', 'A#3']),
    (0.50, ['C3', 'D#3', 'G3', 'A#3']),
    (0.75, ['F3', 'G#3', 'C4', 'D#4']),
    (0.75, ['F3', 'G#3', 'C4', 'D#4']),
    (0.50, ['F3', 'G#3', 'C4', 'D#4']),
]]

time = 0
for _ in range(loop):
    for i in range(len(acc)):
        for (beat, codes) in acc[i]:
            for code in codes:
                pitch = pm.note_name_to_number(code)
                inst.notes.append(pm.Note(velocity=100, pitch=pitch, start=time, end=time+beat))
            time+=beat

main = ['C6', 'D#6', 'F6', 'G#6', 'A#6']
for i in range(3):
    time = 0
    while time < loop*sum([sum([beat for (beat, _) in sec]) for sec in acc]):
        beat = randint(1,4)/4.0
        code = main[randint(0, len(main)-1)].replace('6',str(6-i))
        pitch = pm.note_name_to_number(code)
        inst.notes.append(pm.Note(velocity=100, pitch=pitch, start=time, end=time+beat))
        time+=beat

midi.instruments.append(inst)
with NamedTemporaryFile() as tmp_midi:
    with NamedTemporaryFile() as tmp_wav:
        midi.write(tmp_midi.name)
        subprocess.call(['timidity', tmp_midi.name, '-Ow', '-o', tmp_wav.name])
        subprocess.call(['afplay', tmp_wav.name])

