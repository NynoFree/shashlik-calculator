import { useState, useMemo } from 'react';
import './App.css';

const MEAT_TYPES = {
    chicken: {
        name: 'Курица',
        baseAmount: 0.35,
        alcoholEffect: 0.1,
        description: 'Нежное мясо, 5-6 кусочков на шампур (~50г каждый). Усадка при жарке ~10%.'
    },
    pork: {
        name: 'Свинина',
        baseAmount: 0.4,
        alcoholEffect: 0.15,
        description: 'Мягкое мясо, 4-5 кусков на шампур (~60г). Усадка ~15%.'
    },
    beef: {
        name: 'Говядина',
        baseAmount: 0.45,
        alcoholEffect: 0.2,
        description: 'Плотное мясо, 3-4 куска на шампур (~70г). Усадка ~20%.'
    },
    lamb: {
        name: 'Баранина',
        baseAmount: 0.5,
        alcoholEffect: 0.25,
        description: 'Жирное мясо, 2-3 крупных куска на шампур (~90г). Усадка ~25%.'
    }
};

const SKEWER_WEIGHT = 0.2; // 200г на шампур
const ACTIVE_EATER_BONUS = 0.3; // +30% для активных едоков

const InputField = ({ label, value, onChange, min, max, type = 'number', ...props }) => (
    <div className="input-block">
        <label>
            <div>{label}</div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                {...props}
            />
        </label>
    </div>
);

const MeatCalculator = () => {
    const [state, setState] = useState({
        people: 5,
        activePeople: 3,
        vodka: 0,
        beer: 0,
        meatType: 'pork'
    });

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
        setState(prev => ({
            ...prev,
            [field]: field === 'activePeople' ? Math.min(value, state.people) : value
        }));
    };

    const { meat, skewers, meatTypeName, meatDescription } = useMemo(() => {
        const { people, activePeople, vodka, beer, meatType } = state;
        const config = MEAT_TYPES[meatType];

        const baseMeat = people * config.baseAmount;
        const activeBonus = activePeople * config.baseAmount * ACTIVE_EATER_BONUS;
        const alcoholEffect = vodka * config.alcoholEffect + beer * (config.alcoholEffect / 2);
        const totalMeat = baseMeat + activeBonus + alcoholEffect;

        return {
            meat: totalMeat.toFixed(1),
            skewers: Math.ceil(totalMeat / SKEWER_WEIGHT),
            meatTypeName: config.name,
            meatDescription: config.description
        };
    }, [state]);

    return (
        <div className="app">
            <h1>🍢 Калькулятор шашлыка</h1>

            <div className="input-grid">
                <InputField
                    label="👫 Количество людей"
                    value={state.people}
                    onChange={handleChange('people')}
                    min="1"
                />

                <InputField
                    label="🏃 Активные едоки"
                    value={state.activePeople}
                    onChange={handleChange('activePeople')}
                    min="0"
                    max={state.people}
                />

                <div className="input-block">
                    <label>
                        <div>🍖 Тип мяса</div>
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

                <InputField
                    label="🍶 Водка (0.5л)"
                    value={state.vodka}
                    onChange={handleChange('vodka')}
                    min="0"
                />

                <InputField
                    label="🍺 Пиво (0.5л)"
                    value={state.beer}
                    onChange={handleChange('beer')}
                    min="0"
                />
            </div>

            <div className="result-block">
                <h2>Результаты расчета</h2>

                <div className="result-item">
                    <span>Мяса ({meatTypeName}):</span>
                    <strong>{meat} кг</strong>
                </div>

                <div className="result-item tooltip-container">
                    <span>Шампуров (по 200г):</span>
                    <strong>{skewers} шт</strong>
                    <div className="tooltip">
                        <h3>{meatTypeName}</h3>
                        <p>{meatDescription}</p>
                        <div className="stats">
                            <p><strong>На человека:</strong> {MEAT_TYPES[state.meatType].baseAmount} кг</p>
                            <p><strong>Алкоголь:</strong> +{MEAT_TYPES[state.meatType].alcoholEffect} кг/водки</p>
                            <p><strong>Всего мяса:</strong> {meat} кг</p>
                        </div>
                    </div>
                </div>

                {state.vodka > 2 && (
                    <div className="warning">
                        ⚠️ При {state.vodka} бутылках водки сделайте запас мяса +10-15%!
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeatCalculator;