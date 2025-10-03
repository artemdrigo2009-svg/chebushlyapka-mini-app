import React, { useEffect, useState } from 'react';
import { Home, Gift, Users, ShoppingBag, CircleDollarSign, Star, Copy } from 'lucide-react';

function getChebuColor(level, maxLevel) {
  const ratio = Math.min(level / maxLevel, 1);
  const start = [101, 67, 33];
  const end = [138, 43, 226];
  const blended = start.map((c, i) => Math.round(c + (end[i] - c) * ratio));
  return `rgb(${blended[0]}, ${blended[1]}, ${blended[2]})`;
}

function ChebuCharacter({ smiling, level, outfit }) {
  const MAX_LEVEL = 10;
  const color = outfit?.type === 'skin' ? outfit.color : getChebuColor(level, MAX_LEVEL);

  return (
    <svg viewBox="0 0 220 320" className="w-48 h-72 transition-transform duration-200" style={{ transform: smiling ? 'scale(1.05)' : 'scale(1)' }}>
      <circle cx="110" cy="160" r="85" fill="yellow" opacity="0.2" />
      <ellipse cx="110" cy="80" rx="40" ry="45" fill={color} />
      <ellipse cx="50" cy="70" rx="20" ry="35" fill={color} />
      <ellipse cx="170" cy="70" rx="20" ry="35" fill={color} />
      <circle cx="90" cy="75" r="10" fill="white" />
      <circle cx="130" cy="75" r="10" fill="white" />
      <circle cx="90" cy="75" r="5" fill="black" />
      <circle cx="130" cy="75" r="5" fill="black" />
      <circle cx="110" cy="90" r="5" fill="black" />
      {smiling ? (
        <path d="M90 100 Q110 115 130 100" stroke="black" strokeWidth="3" fill="none" />
      ) : (
        <line x1="95" y1="105" x2="125" y2="105" stroke="black" strokeWidth="3" />
      )}
      <ellipse cx="110" cy="190" rx="50" ry="80" fill={color} />
      <ellipse cx="70" cy="170" rx="15" ry="40" fill={color} />
      <ellipse cx="150" cy="170" rx="15" ry="40" fill={color} />
      <ellipse cx="85" cy="270" rx="15" ry="30" fill={color} />
      <ellipse cx="135" cy="270" rx="15" ry="30" fill={color} />
      {outfit && outfit.accessory && <text x="50%" y="150" textAnchor="middle" fontSize="20" fill="black">{outfit.accessory}</text>}
    </svg>
  );
}

function GameTab({ coins, setCoins, xp, setXp, level, setLevel, clickBoost, setClickBoost, outfit, setOutfit }) {
  const [isSmiling, setIsSmiling] = useState(false);

  function xpForLevel(l) { return Math.floor(100 * Math.pow(1.5, l)); }

  function handleClick() {
    const coinGain = 1 + clickBoost;
    const xpGain = 1;
    setCoins(c => c + coinGain);
    setXp(x => x + xpGain);
    setIsSmiling(true);
    setTimeout(() => setIsSmiling(false), 400);
  }

  function buyBoost() {
    const cost = 200 * (clickBoost + 1);
    if (coins >= cost) {
      setCoins(c => c - cost);
      setClickBoost(b => b + 1);
    }
  }

  useEffect(() => {
    const xpForNext = xpForLevel(level);
    if (xp >= xpForNext) {
      setLevel(l => l + 1);
      setXp(prev => prev - xpForNext);
    }
  }, [xp, level, setLevel, setXp]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 min-h-screen">
      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold shadow">
        Монеты: {coins}
      </div>
      <button onClick={handleClick} className="focus:outline-none">
        <ChebuCharacter smiling={isSmiling} level={level} outfit={outfit} />
      </button>
      <div className="mt-3 text-center text-yellow-400">
        <div>Сила буста: <strong>{clickBoost}</strong></div>
        <div>Уровень: <strong>{level}</strong> • XP: {xp}/{xpForLevel(level)}</div>
      </div>
      <button onClick={buyBoost} className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold">
        Купить буст клика за {200 * (clickBoost + 1)} монет
      </button>
    </div>
  );
}

function ShopTab({ inventory, setInventory, coins, setCoins }) {
  const items = [
    { id: 1, name: 'Акула', type: 'skin', cost: 500, color: '#1E90FF' },
    { id: 2, name: 'Крокодил', type: 'skin', cost: 500, color: '#32CD32' },
    { id: 3, name: 'Тигр', type: 'skin', cost: 500, color: '#FF8C00' },
    { id: 4, name: 'Очки', type: 'accessory', cost: 200, accessory: 'Очки' },
    { id: 5, name: 'Шляпа', type: 'accessory', cost: 200, accessory: 'Шляпа' },
  ];

  function buyItem(item) {
    if (coins >= item.cost && !inventory.find(i => i.id === item.id)) {
      setCoins(c => c - item.cost);
      setInventory([...inventory, item]);
    }
  }

  return (
    <div className="p-4 text-yellow-400 flex flex-wrap gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-gray-800 p-4 rounded-lg flex flex-col items-center w-32">
          <div className="font-semibold mb-2 text-center">{item.name}</div>
          <div className="mb-2">Стоимость: {item.cost}</div>
          <button onClick={() => buyItem(item)} className="px-2 py-1 bg-yellow-400 text-gray-900 rounded-lg">
            Купить
          </button>
        </div>
      ))}
    </div>
  );
}

function InventoryTab({ inventory, setOutfit }) {
  function equipItem(item) {
    setOutfit(item);
  }

  return (
    <div className="p-4 text-yellow-400 flex flex-wrap gap-4">
      {inventory.length === 0 && <div>Инвентарь пуст</div>}
      {inventory.map(item => (
        <div key={item.id} className="bg-gray-800 p-4 rounded-lg flex flex-col items-center w-32">
          <div className="font-semibold mb-2 text-center">{item.name}</div>
          <button onClick={() => equipItem(item)} className="px-2 py-1 bg-yellow-400 text-gray-900 rounded-lg">
            Использовать
          </button>
        </div>
      ))}
    </div>
  );
}

function ChebuClickerWebApp() {
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('coins')) || 1000);
  const [xp, setXp] = useState(() => Number(localStorage.getItem('xp')) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem('level')) || 1);
  const [clickBoost, setClickBoost] = useState(() => Number(localStorage.getItem('clickBoost')) || 0);
  const [lastClaim, setLastClaim] = useState(() => new Date(localStorage.getItem('lastClaim') || 0));
  const [tab, setTab] = useState('game');
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('inventory') || '[]'));
  const [outfit, setOutfit] = useState(() => { const saved = localStorage.getItem('outfit'); try { return saved ? JSON.parse(saved) : null; } catch (e) { return null; }});

  useEffect(() => { localStorage.setItem('coins', coins); }, [coins]);
  useEffect(() => { localStorage.setItem('xp', xp); }, [xp]);
  useEffect(() => { localStorage.setItem('level', level); }, [level]);
  useEffect(() => { localStorage.setItem('clickBoost', clickBoost); }, [clickBoost]);
  useEffect(() => { localStorage.setItem('lastClaim', lastClaim.toISOString()); }, [lastClaim]);
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('outfit', JSON.stringify(outfit)); }, [outfit]);

  const claimDaily = () => { setLastClaim(new Date()); setCoins(c => c + 100); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 relative">
      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold shadow">
        Монеты: {coins}
      </div>

      {tab === 'game' && <GameTab coins={coins} setCoins={setCoins} xp={xp} setXp={setXp} level={level} setLevel={setLevel} clickBoost={clickBoost} setClickBoost={setClickBoost} outfit={outfit} setOutfit={setOutfit} />}
      {tab === 'gifts' && <GiftsTab lastClaim={lastClaim} claimDaily={claimDaily} />}
      {tab === 'referrals' && <ReferralsTab coins={coins} setCoins={setCoins} />}
      {tab === 'shop' && <ShopTab inventory={inventory} setInventory={setInventory} coins={coins} setCoins={setCoins} />}
      {tab === 'inventory' && <InventoryTab inventory={inventory} setOutfit={setOutfit} />}

      <div className="fixed bottom-0 left-0 w-full flex justify-around p-4 bg-gray-800">
        <button onClick={() => setTab('game')} className="text-yellow-400 flex flex-col items-center">
          <Home size={24} />
          <span className="text-xs">Игра</span>
        </button>
        <button onClick={() => setTab('gifts')} className="text-yellow-400 flex flex-col items-center">
          <Gift size={24} />
          <span className="text-xs">Подарки</span>
        </button>
        <button onClick={() => setTab('referrals')} className="text-yellow-400 flex flex-col items-center">
          <Users size={24} />
          <span className="text-xs">Друзья</span>
        </button>
        <button onClick={() => setTab('shop')} className="text-yellow-400 flex flex-col items-center">
          <ShoppingBag size={24} />
          <span className="text-xs">Магазин</span>
        </button>
        <button onClick={() => setTab('inventory')} className="text-yellow-400 flex flex-col items-center">
          <Star size={24} />
          <span className="text-xs">Инвентарь</span>
        </button>
      </div>
    </div>
  );
}

export default ChebuClickerWebApp;
