
/// BEANIE BOY ///
import beanIdle from "./assets/bean-idle.png";
import beanSit from "./assets/bean-sit.png";
import beanHappy from "./assets/bean-happy.png";
import beanEat from "./assets/bean-eat.png";
import beanSleep from "./assets/bean-sleep.png";
import beanRun from "./assets/bean-run.png";
import beanPlay from "./assets/bean-play.png";

/// ENZO ///
import enzoIdle from "./assets/enzo-idle.png";
import enzoHappy from "./assets/enzo-pet.png";
import enzoSit from "./assets/enzo-sit.png";
import enzoEat from "./assets/enzo-eat.png";
import enzoSleep from "./assets/enzo-sleep.png";
import enzoPlay from "./assets/enzo-play.png";
import enzoBark from "./assets/enzo-bark.png";

import { useState, useEffect } from "react";
import "./App.css";


const characters = {
  bean: {
    name: "BeanieBoy",
    cost: 0,
    coinReward: 5,
    xpReward: 10,
    tagline: "Minus a toe. Still running this joint.",

    sprites: {
      idle: beanIdle,
      sit: beanSit,
      happy: beanHappy,
      eat: beanEat,
      sleep: beanSleep,
      play: beanPlay,
      special: beanRun
    },

    specialName: "🌪️ Zoomies",
    specialMessage: "I AM SPEED!",
    sleepMessage: "Zzz... dreaming of toes..."
  },

  enzo: {
    name: "Enzo",
    cost: 10,
    coinReward: 10,
    xpReward: 15,
    tagline: "All muscle. No thoughts.",

    sprites: {
      idle: enzoIdle,
      sit: enzoSit,
      happy: enzoHappy,
      eat: enzoEat,
      sleep: enzoSleep,
      play: enzoPlay,
      special: enzoBark
    },

    specialName: "📢 Bark",
    specialMessage: "INTRUDER! Oh... it's a leaf.",
    sleepMessage: "Zzz... dreaming of bones..."
  }
};


function App() {
  // ==========================
  // BEANIE STATS
  // ==========================

  const [stats, setStats] = useState({
    fullness: 80,
    happiness: 80,
    energy: 100,
    chaos: 20
  });

  const [activeCharacter, setActiveCharacter] =
  useState("bean");

  const [unlockedCharacters, setUnlockedCharacters] =
  useState(["bean"]);

  const [showShop, setShowShop] = useState(false);

  const character = characters[activeCharacter];

  // ==========================
  // CHARACTER STATE
  // ==========================

  const [sprite, setSprite] = useState("idle");
 const [idleSprite, setIdleSprite] = useState("idle");
  const [message, setMessage] = useState("Hewwo!");
  const [actionCount, setActionCount] = useState(0);

  // ==========================
  // XP AND BEAN COINS
  // ==========================

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);
  const level = Math.floor(xp / 100) + 1;

  // ==========================
  // HANDLE PLAYER ACTIONS
  // ==========================

  function updateStats(changes, text, newSprite) {
    setStats(previous => {
      const updated = { ...previous };

      for (const key in changes) {
        updated[key] = Math.max(
          0,
          Math.min(100, previous[key] + changes[key])
        );
      }

      return updated;
    });

    

    setMessage(text);
    setSprite(newSprite || "idle");
    setActionCount(previous => previous + 1);

    // Reward the player
    setXp(previous => previous + character.xpReward);

    setCoins(previous => previous + character.coinReward);
  }

  // ==========================
  // PURCHASE AND UNLOCK CHARACTERS
  // ==========================
  function unlockCharacter(id) {
  const selected = characters[id];

  if (unlockedCharacters.includes(id)) return;
  if (coins < selected.cost) return;

  setCoins(previous => previous - selected.cost);

  setUnlockedCharacters(previous => [
    ...previous,
    id
  ]);

  setMessage(`${selected.name} has been unlocked!`);
}
  // ==========================
  // RETURN TO IDLE
  // ==========================

  useEffect(() => {
    if (actionCount === 0 || isSleeping || sprite === "idle") return;

    const timer = setTimeout(() => {
      setSprite("idle");
      setMessage("Hewwo!");
    }, 3000);

  return () => clearTimeout(timer);
  }, [actionCount, isSleeping, sprite]);


  useEffect(() => {
  if (isSleeping || sprite !== "idle") return;

  const idlePoses = ["idle", "sit"];

  const timer = setInterval(() => {
    const randomIndex = Math.floor(
      Math.random() * idlePoses.length
    );

    setIdleSprite(idlePoses[randomIndex]);
  }, 5000);

  return () => clearInterval(timer);
}, [isSleeping, sprite]);

  // ==========================
  // SLEEP-WAKE CYCLE
  // ==========================

  function goToSleep() {
  setIsSleeping(true);
  setSprite("sleep");
  setMessage("BeanieBoy.exe entering sleep mode...");
}

function wakeUp() {
  setIsSleeping(false);
  setSprite("idle");
  setMessage("System rebooted. Ready for chaos!");
}


  // ==========================
  // AUTOMATIC STAT DEPLETION
  // ==========================

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(previous => ({
        ...previous,
        fullness: Math.max(0, previous.fullness - 2),
        happiness: Math.max(0, previous.happiness - 1),
        energy: Math.max(0, previous.energy - 1)
      }));
    }, 10000);

    return () => clearInterval(timer);
  }, [isSleeping]);

  // ==========================
  // RECOVERY TIMER
  // ==========================

  useEffect(() => {
  if (!isSleeping) return;

  const timer = setInterval(() => {
    setStats(previous => ({
      ...previous,
      energy: Math.min(100, previous.energy + 5),
      chaos: Math.max(0, previous.chaos - 2)
    }));
  }, 3000);

  return () => clearInterval(timer);
}, [isSleeping]);

  // ==========================
  // WAKE UP AT FULL ENERGY
  // ==========================

  useEffect(() => {
  if (isSleeping && stats.energy >= 100) {
    setIsSleeping(false);
    setSprite("idle");
    setMessage("Battery fully charged. Prepare for chaos!");
  }
}, [isSleeping, stats.energy]);

  // ==========================
  // GAME INTERFACE
  // ==========================

  return (
    <main className="game">

      <h1>{character.name}</h1>
<p>{character.tagline}</p>

      {/* Player information */}

      <div className="player-info">
        <span>🐾 Level {level}</span>
        <span>🪙 {coins} BC</span>
      </div>

      {/* XP progress */}

      <div className="xp-bar">
        <progress value={xp % 100} max="100" />
        <small>{xp % 100}/100 XP</small>
      </div>

      {/* Beanie character */}

      <div className="pet">
      <p>
        {isSleeping ? character.sleepMessage : message}
      </p>

<img
  src={
    character.sprites[
      isSleeping
        ? "sleep"
        : sprite === "idle"
          ? idleSprite
          : sprite
    ] || character.sprites.idle
  }
  className={`bean ${isSleeping ? "sleeping" : ""}`}
  alt={character.name}
/>
      </div>

      {/* Character stats */}

      <div className="stats">
        {Object.entries(stats).map(([name, value]) => (
          <div className="stat" key={name}>
            <label>{name}: {value}%</label>
            <progress value={value} max="100" />
          </div>
        ))}
      </div>

      {/* Action buttons */}

      <div className="actions">

 
<button
  disabled={isSleeping}
  onClick={() => updateStats(
    { fullness: 25 },
    "Nom nom nom!",
    "eat"
  )}
>
  🍗 Feed
</button>

<button
  disabled={isSleeping}
  onClick={() => updateStats(
    { happiness: 20 },
    "More belly rubs pls!",
    "happy"
  )}
>
  ❤️ Pet
</button>

<button
  disabled={isSleeping}
  onClick={() => updateStats(
    { happiness: 15, energy: -10 },
    "BALL?!",
    "play"
  )}
>
  🎾 Play
</button>

<button
  onClick={isSleeping ? wakeUp : goToSleep}
  disabled={!isSleeping && stats.energy >= 100}
>
  {isSleeping ? "☀️ Wake Up" : "💤 Sleep"}
</button>

<button
  disabled={isSleeping}
  onClick={() => updateStats(
    { chaos: 30, energy: -20 },
    character.specialMessage,
    "special"
  )}
>
  {character.specialName}
</button>

</div>

<button
  className="shop-toggle"
  onClick={() => setShowShop(previous => !previous)}
>
  {showShop ? "Close Shop" : "🛒 Character Shop"}
</button>

{showShop && (
  <div className="character-shop">
    <h2>Unlock the Pack</h2>

    {Object.entries(characters).map(([id, dog]) => {
      const owned = unlockedCharacters.includes(id);
      const equipped = activeCharacter === id;

      return (
        <div className="character-card" key={id}>

          <h3>{dog.name}</h3>
          <p>{dog.tagline}</p>

          <p>🪙 {dog.coinReward} BC per action</p>
          <p>⭐ {dog.xpReward} XP per action</p>

          {owned ? (
            <button
  disabled={equipped || isSleeping}
  onClick={() => {
    setActiveCharacter(id);
    setSprite("idle");
    setIdleSprite("idle");
    setActionCount(0);
    setMessage(`Hello! I'm ${dog.name}!`);
  }}
>
  
  {equipped ? "Equipped" : "Equip"}
</button>
          ) : (
            <>
              <progress
                value={Math.min(coins, dog.cost)}
                max={dog.cost}
              />

              <button
                disabled={coins < dog.cost}
                onClick={() => unlockCharacter(id)}
              >
                🔓 Unlock — {dog.cost} BC
              </button>
            </>
          )}

        </div>
      );
    })}
  </div>
)}

      
    </main>
    
  );
}

export default App;
