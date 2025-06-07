import { useState, useMemo, useEffect } from 'react';
import './App.css';

const MEAT_TYPES = {
    chicken: {
        name: 'Курица',
        baseAmount: 0.35,
        alcoholEffect: 0.1,
        description: 'Нежное мясо, 5-6 кусочков на шампур (~50г каждый). Усадка ~10%.'
    },
    pork: {
        name: 'Свинина',
        baseAmount: 0.4,
        alcoholEffect: 0.15,
        description: '4-5 кусков на шампур (~60г). Усадка ~15%.'
    },
    beef: {
        name: 'Говядина',
        baseAmount: 0.45,
        alcoholEffect: 0.2,
        description: '3-4 куска на шампур (~70г). Усадка ~20%.'
    },
    lamb: {
        name: 'Баранина',
        baseAmount: 0.5,
        alcoholEffect: 0.25,
        description: '2-3 крупных куска на шампур (~90г). Усадка ~25%.'
    }
};

const SKEWER_WEIGHT = 0.2;
const ACTIVE_EATER_FACTOR = 0.3;

function App() {
    const [state, setState] = useState({
        people: 5,
        activePeople: 3,
        vodka: 0,
        beer: 0,
        meatType: 'pork'
    });

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setDarkMode(e.matches);

        setDarkMode(mediaQuery.matches);
        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const { meat, skewers, meatTypeName, meatDescription } = useMemo(() => {
        const config = MEAT_TYPES[state.meatType];
        const baseMeat = state.people * config.baseAmount;
        const activeBonus = state.activePeople * config.baseAmount * ACTIVE_EATER_FACTOR;
        const alcoholEffect = state.vodka * config.alcoholEffect + state.beer * (config.alcoholEffect / 2);
        const totalMeat = baseMeat + activeBonus + alcoholEffect;

        return {
            meat: totalMeat.toFixed(1),
            skewers: Math.ceil(totalMeat / SKEWER_WEIGHT),
            meatTypeName: config.name,
            meatDescription: config.description
        };
    }, [state]);

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'number'
            ? Math.max(0, parseInt(e.target.value) || 0)
            : e.target.value;

        setState(prev => ({
            ...prev,
            [field]: field === 'activePeople' ? Math.min(value, state.people) : value
        }));
    };

    return (
        <div className={`app-container ${darkMode ? 'dark-theme' : ''}`}>
            <div className="calculator">
                <h1>🍢 Калькулятор шашлыка</h1>

                <div className="input-grid">
                    <div className="input-block">
                        <label>
                            <span>👫 Люди</span>
                            <input
                                type="number"
                                value={state.people}
                                onChange={handleChange('people')}
                                min="1"
                            />
                        </label>
                    </div>

                    <div className="input-block">
                        <label>
                            <span>🏃 Активные</span>
                            <input
                                type="number"
                                value={state.activePeople}
                                onChange={handleChange('activePeople')}
                                min="0"
                                max={state.people}
                            />
                        </label>
                    </div>

                    <div className="input-block">
                        <label>
                            <span>🍖 Мясо</span>
                            <select
                                value={state.meatType}
                                onChange={handleChange('meatType')}
                            >
                                {Object.entries(MEAT_TYPES).map(([key, { name }]) => (
                                    <option key={key} value={key}>{name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="input-block">
                        <label>
                            <span>🍶 Водка</span>
                            <input
                                type="number"
                                value={state.vodka}
                                onChange={handleChange('vodka')}
                                min="0"
                            />
                        </label>
                    </div>

                    <div className="input-block">
                        <label>
                            <span>🍺 Пиво</span>
                            <input
                                type="number"
                                value={state.beer}
                                onChange={handleChange('beer')}
                                min="0"
                            />
                        </label>
                    </div>
                </div>

                <div className="result-block">
                    <h2>Результаты</h2>
                    <div className="result-item">
                        <span>Мяса:</span>
                        <strong>{meat} кг ({meatTypeName})</strong>
                    </div>
                    <div className="result-item">
                        <span>Шампуров:</span>
                        <strong>{skewers} шт (по 200г)</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;