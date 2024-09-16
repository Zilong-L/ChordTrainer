import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper, Box, Button, Typography, AppBar, Toolbar, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import StairsIcon from '@mui/icons-material/Stairs';
import SensorsIcon from '@mui/icons-material/Sensors';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import MenuIcon from '@mui/icons-material/Menu';
import ReplayIcon from '@mui/icons-material/Replay';
import SettingsIcon from '@mui/icons-material/Settings';

import Sidebar from '@components/Sidebar';
import ChordColorTrainerSettings from '@components/EarTrainers/ChordColorTrainer/Settings';
import IntroModal from '@components/EarTrainers/ChordColorTrainer/ChordColorTrainerIntro';
import useChordColorTrainer from '@components/EarTrainers/ChordColorTrainer/useChordColorTrainer';
import useChordColorTrainerSettings from '@components/EarTrainers/ChordColorTrainer/useChordColorTrainerSettings';
import { apps, keyMap, degrees } from '@components/EarTrainers/ChordColorTrainer/Constants';
let midi = null;
const EarTrainer = () => {
  const settings = useChordColorTrainerSettings();

  const {
    currentNote,
    disabledChords,
    gameStarted,
    filteredChords,
    setActiveChord,
    startGame,
    endGame,
    playChord,
    playBrokenChord,

  } = useChordColorTrainer(settings);

  const {
    rootNote,
    practiceRecords,
    muteDrone,
    setMuteDrone,
  } = settings;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatOpen, setIsStatOpen] = useState(true);
  const [isIntroOpen, setIsIntroOpen] = useState(true);

  const handleIntroClose = () => {
    setIsIntroOpen(false);
    startGame();
  };
  useEffect(() => {
    return () => {
      endGame();
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      if (key === 'r') {
        playChord();
        return;
      }

      let degreeIndex;
      if (keyMap[key] !== undefined) {
        degreeIndex = keyMap[key];
      }
      if (degreeIndex !== undefined) {
        const selectedDegree = degrees[degreeIndex];
        const noteName = Tone.Frequency(rootNote + selectedDegree.distance, 'midi').toNote().slice(0, -1); // 获取对应的音符名称
        // 模拟点击对应的按钮
        const button = document.querySelector(`button[data-note="${noteName}"]`);
        if (button) {
          button.click();
        }
      }

      // Hit the replay button if R or space is pressed

    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [rootNote, currentNote]);

  useEffect(() => {
    const midiMessageHandler = (message) => {
      const [command, note, velocity] = message.data;
      if (command === 144 && velocity > 0) {
        const noteName = Tone.Frequency(note, 'midi').toNote(); // 获取当前音符名称
        const noteWithoutOctave = noteName.slice(0, -1); // 去掉最后一位（八度）
        // 模拟点击对应的按钮，忽略八度
        // const buttons = document.querySelectorAll(`button[data-note="${noteWithoutOctave}"]`); // 匹配以音符字母开头的按钮

        // buttons.forEach(button => {
        //     button.click();
        // });
        setActiveChord(noteName)
      }

    };
    (async () => {
      if (navigator.requestMIDIAccess == null) {
        return;
      }
      if (midi == null) {
        midi = await navigator.requestMIDIAccess();
        console.log("MIDI loaded for degree trainer");
      }
      if (midi) {
        console.log('midi is already loaded, now register listener')
        const inputs = midi.inputs.values();
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
          input.value.onmidimessage = midiMessageHandler
        }
      }
    })();
    return () => {
      console.log('midi is not deleted, but delete listener')
      if (midi) {
        const inputs = midi.inputs.values();
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
          input.value.onmidimessage = null
        }
      }
    }
  }, []);
  const renderRecords = () => {
    const totalResults = Object.values(practiceRecords).reduce(
      (acc, record) => {
        acc.total += record.total;
        acc.correct += record.correct;
        return acc;
      },
      { total: 0, correct: 0 }
    );

    return (
      <>
        <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.paper }}>总尝试: {totalResults.total}</Typography>
        <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.paper }}>正确数: {totalResults.correct}</Typography>
        <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.paper }}>
          正确率: {totalResults.total > 0 ? Math.round((totalResults.correct / totalResults.total).toFixed(2) * 100) + '%' : '0%'}
        </Typography>
      </>
    );
  };



  return (
    <>
      <AppBar position="static" sx={{ boxShadow: 0, paddingX: '0.5rem' }}>
        <Toolbar sx={{ height: '64px', color: (theme) => theme.palette.text.primary }}>

          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'left', color: (theme) => theme.palette.text.primary }}>
            <Link to="/ear-trainer" style={{ textDecoration: 'none', color: 'inherit' }}>
              Ear Trainer
            </Link>
          </Typography>
          <Button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            variant="contained"
            color="primary"
            sx={{ boxShadow: 'none' }}
          >
            <SettingsIcon />
          </Button>
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="contained"
            color="primary"
            sx={{ boxShadow: 'none', '@media (min-width:600px)': { display: 'none' } }}
          >
            <MenuIcon />
          </Button>
          {muteDrone ?
            <Button 
            variant="contained"
            color="primary"
            sx={{ boxShadow: 'none' }}
            onClick={() => { setMuteDrone(!muteDrone) }}><SensorsOffIcon /></Button>
            :
            <Button
            variant="contained"
            color="primary"
            sx={{ boxShadow: 'none' }}
            onClick={() => { setMuteDrone(!muteDrone) }}><SensorsIcon  /></Button> 
          }
          {apps.map((item) => (
            <Button
              variant="contained"
              key={item.name}
              component={Link}
              to={item.path}
              sx={{
                display: 'none',
                '@media (min-width:600px)': { display: 'block', boxShadow: 'none', textTransform: 'none' },
              }}
            >
              {item.name}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Paper sx={{ borderRadius: 0 }}>
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 'calc(100svh - 64px)',
            paddingY: '1rem',
            paddingX: '1.5rem',
          }}
        >
          <CssBaseline />
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <ChordColorTrainerSettings
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            playChord={playChord}
            settings={settings}
          />
          <IntroModal isOpen={isIntroOpen} handleClose={handleIntroClose} />
          {gameStarted && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', marginBottom: '2rem' }}>
              {isStatOpen && renderRecords()}
              <Box sx={{ flexGrow: 1 }} />
              <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
                {filteredChords.map((note) => (
                  <Grid item xs={4} key={`${note.degree}${note.chordType}`}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveChord(`${note.degree}${note.chordType}`)}
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        fontSize: '1.5rem',
                        height: '4rem',
                        background: disabledChords.some(disabledNote => `${note.degree}${note.chordType}` === disabledNote) ? (theme) => theme.palette.action.disabled : 'default',
                      }}
                      data-note={Tone.Frequency(rootNote + note.distance, 'midi').toNote().slice(0, -1)}
                    >
                      {note.degree}{note.chordType}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => playChord()}
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ReplayIcon sx={{ fontSize: '3rem' }} />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => playBrokenChord()}
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <StairsIcon sx={{ fontSize: '3rem' }} />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Paper>
    </>
  );
};

export default EarTrainer;