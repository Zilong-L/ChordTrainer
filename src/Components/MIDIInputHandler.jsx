import React, { useEffect, useState } from "react";
import { Midi, Note } from "tonal";
import { Typography, Box } from "@mui/material";
import { detect } from "@tonaljs/chord-detect";
import { Piano } from "@tonejs/piano";
let notes = [];
const SoundLevels = [1, 3, 5, 10, 16];
const MIDIInputHandler = ({ chord, setChord }) => {
  const [activeNotes, setActiveNotes] = useState([]);
  const [soundLevel, setSoundLevel] = useState(0);

  useEffect(() => {
    (async () => {
      if (navigator.requestMIDIAccess == null) {
        return;
      }
      const midi = await navigator.requestMIDIAccess();
      console.log("MIDI loaded");
      const piano = new Piano({
        velocities: SoundLevels[soundLevel],
      });
      //connect it to the speaker output
      piano.toDestination();
      await piano.load();
      console.log("Piano loaded");
      if (midi) {
        const inputs = midi.inputs.values();
        for (
          let input = inputs.next();
          input && !input.done;
          input = inputs.next()
        ) {
          input.value.onmidimessage = (message) => {
            const [command, note, velocity] = message.data;
            if (command === 144) {
              notes = notes.concat(note);
              piano.keyDown({
                note: Note.fromMidi(note),
                velocity: velocity / 127,
              });
            } else if (command === 128) {
              piano.keyUp({ note: Note.fromMidi(note) });
              notes = notes.filter((n) => n !== note);
            }
            setActiveNotes(notes.sort((a, b) => a - b));
          };
        }
      }
    })();
  }, [soundLevel]);

  useEffect(() => {
    const notesString = activeNotes.map((note) => Midi.midiToNoteName(note));
    const chordResult = detect(notesString, { assumePerfectFifth: true });
    if (chordResult.length > 0) {
      setChord(chordResult.join(", "));
    } else {
      setChord("");
    }
  }, [activeNotes]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h3" component="h3" sx={{ width: "100%" }}>
        {"Chord: " + chord}
      </Typography>
      <Typography variant="h3" component="h3" sx={{ width: "100%" }}>
        {"Notes: " + activeNotes.map((midi) => Note.fromMidi(midi)).join(", ")}
      </Typography>
    </Box>
  );
};

export default MIDIInputHandler;
