import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import './App.css';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen();
    // eslint-disable-next-line
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Mic Stopped.');
      };
    }
    mic.onstart = () => {
      console.log('Mic Started.');
    };

    mic.onresult = (e) => {
      console.log('enter onresult');
      const transcript = Array.from(e.results)
        .map((res) => res[0])
        .map((res) => res.transcript)
        .join('');
      //console.log('transcript: ', transcript);

      setNote(transcript);

      mic.onerror = (e) => {
        console.log(e.error);
      };
    };
  };

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote('');
  };

  return (
    <>
      <div className='container py-5'>
        <h1>Voice to Text (Only works in Chrome)</h1>
        <div className='row'>
          <div className='m-1 p-5 bg-light shadow-sm col'>
            <h2>Current Note</h2>
            <br />
            {isListening ? (
              <span>Recording ...</span>
            ) : (
              <span>Not Recording</span>
            )}
            <br />
            <button
              onClick={() => {
                setIsListening(!isListening);
              }}
              className='btn btn-danger my-2'
            >
              Start/Stop
            </button>
            <br />
            <button
              onClick={handleSaveNote}
              disabled={!note}
              className='btn btn-primary my-2'
            >
              Save Note
            </button>

            <p>{note}</p>
          </div>

          <div className='m-1 p-5 bg-light shadow-sm col'>
            <h2>Notes</h2>
            <ul>
              {savedNotes.map((n) => (
                <li key={uuid()}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
