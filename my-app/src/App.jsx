import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import bellSound from "./assets/beep.mp3";

export default function App() {
  return (
    <div className="app">
      <Header />
      <Main />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <h1>PomodoroTimer</h1>
    </div>
  );
}

function Main() {
  const [timeLeft, setTimeLeft] = useState(2500);
  const [isRunning, setIsRunning] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [currentState, setCurrentState] = useState("pomodoro");
  const audioRef = useRef(new Audio(bellSound));
  function runningHandle() {
    if (timeLeft === 0 && currentState === "pomodoro") {
      setTimeLeft(1500);
    } else if (timeLeft === 0 && currentState === "short-break") {
      setTimeLeft(300);
    } else if (timeLeft === 0 && currentState === "long-break") {
      setTimeLeft(900);
    }

    if (!isRunning) {
      setIsRunning(true);
    }
  }

  function pauseHandle() {
    if (isRunning) {
      setIsRunning(false);
    }
  }

  function handleShortBreak() {
    if (isRunning) {
      setIsRunning(false);
    }
    stopAlarmHandle();
    setCurrentState("short-break");
    setTimeLeft(300);
  }

  function handlePomdoro() {
    if (isRunning) {
      setIsRunning(false);
    }
    stopAlarmHandle();
    setCurrentState("pomodoro");
    setTimeLeft(1500);
  }

  function handleLongBreak() {
    if (isRunning) {
      setIsRunning(false);
    }
    stopAlarmHandle();
    setCurrentState("long-break");
    setTimeLeft(900);
  }

  function stopAlarmHandle() {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsAlarmPlaying(false);
  }

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          audioRef.current.play();
          setIsAlarmPlaying(true);
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <div className="setting">
        <Setting value="Pomodoro" handle={handlePomdoro} />
        <Setting value="Short Break" handle={handleShortBreak} />
        <Setting value="Long Break" handle={handleLongBreak} />
      </div>

      <Timer minutes={minutes} seconds={seconds} handle={runningHandle} />
      <StartPause
        value={isRunning ? "Pause" : "Start"}
        handle={!isRunning ? runningHandle : pauseHandle}
      />
      {isAlarmPlaying && (
        <button className="start-pause" onClick={stopAlarmHandle}>
          Stop Alarm
        </button>
      )}
      <Footer />
    </>
  );
}

function Setting({ handle, value }) {
  return (
    <div>
      <button className="setting-button" onClick={handle}>
        {value}
      </button>
    </div>
  );
}

function Timer({ minutes, seconds }) {
  return (
    <div className="timer">
      <span>{String(minutes).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(seconds).padStart(2, "0")}</span>
    </div>
  );
}

function StartPause({ handle, value }) {
  return (
    <button className="start-pause" onClick={handle}>
      {value}
    </button>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 Pomodoro Timer. Built by Adinda Puja Puspita.</p>
    </footer>
  );
}
