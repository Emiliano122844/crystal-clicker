
// Загружаем сохранение
let savedGame = JSON.parse(localStorage.getItem("crystalSave")) || {};
let victoryShown = savedGame.victoryShown || false;

let crystals = savedGame.crystals || 0;
let crystalsPerClick = savedGame.crystalsPerClick || 1;
let upgradeCost = savedGame.upgradeCost || 10;

let crystalsPerSecond = savedGame.crystalsPerSecond || 0;
let mineCost = savedGame.mineCost || 50;

// Считаем купленные шахты
let mineCount = savedGame.mineCount || crystalsPerSecond;
// Статистика игрока
let totalCrystals = savedGame.totalCrystals || 0;
let totalClicks = savedGame.totalClicks || 0;
let totalMines = savedGame.totalMines || 0;
// Новые улучшения
let magicPickaxeCost = savedGame.magicPickaxeCost || 500;
let powerMineCost = savedGame.powerMineCost || 2500;
let crystalBoostCost = savedGame.crystalBoostCost || 10000;
let crystalFactoryCost = savedGame.crystalFactoryCost || 50000;
let crystalBoostBought = savedGame.crystalBoostBought || false;
// Уровни обычных улучшений
let upgradeCount = savedGame.upgradeCount || 0;
let magicPickaxeCount = savedGame.magicPickaxeCount || 0;
let powerMineCount = savedGame.powerMineCount || 0;
let crystalFactoryCount = savedGame.crystalFactoryCount || 0;
// Система исследования глубин
let currentDepth = savedGame.currentDepth || 1;
let depthCost = savedGame.depthCost || 1000;
let finalCrystalCost = savedGame.finalCrystalCost || 5000000;
let finalRareCost = Math.max(savedGame.finalRareCost || 0, 15000);
// Редкая технология: Магия древних
let ancientMagicLevel = savedGame.ancientMagicLevel || 0;
let ancientMagicCost = savedGame.ancientMagicCost || 100;
// Редкая технология: Алхимия кристаллов
let crystalAlchemyLevel = savedGame.crystalAlchemyLevel || 0;
let crystalAlchemyCost = savedGame.crystalAlchemyCost || 150;
// Каменный бур
let stoneDrillCost = savedGame.stoneDrillCost || 5000;
let stoneDrillCount = savedGame.stoneDrillCount || 0;
// Редкие кристаллы
let rareCrystals = savedGame.rareCrystals || 0;
// Технология «Удача шахтёра»
let luckLevel = savedGame.luckLevel || 0;
let luckCost = savedGame.luckCost || 10;
let magnetLevel = savedGame.magnetLevel || 0;
let magnetCost = savedGame.magnetCost || 15;
// Названия подземных локаций
const depthNames = [
    "Заброшенная шахта",
    "Каменные пещеры",
    "Светящиеся гроты",
    "Магматические недра",
    "Древние руины",
   "Сердце подземелья",
"Затонувшие катакомбы",
    "Кристальный лес",
    "Подземный океан",
    "Город древних шахтёров",
    "Забытый храм",
    "Лавовые тоннели",
    "Ледяная бездна",
    "Королевство минералов",
    "Пещеры призраков",
    "Зал древних титанов",
    "Разлом миров",
    "Бездна вечности",
];
// Описания подземных локаций
const depthDescriptions = [
    "Старая заброшенная шахта. Здесь начинается твоя история.",
    "Огромные каменные пещеры, скрывающие богатые залежи минералов.",
    "Таинственные гроты, наполненные светящимися кристаллами.",
    "Опасные магматические недра, где земля раскалена докрасна.",
    "Древние руины неизвестной цивилизации. Кто построил их?",
    "Самое сердце подземного мира. Здесь скрывается древняя сила.",
"Затопленные коридоры хранят сокровища давно погибшей цивилизации.",
    "Вместо деревьев здесь растут огромные кристаллы невероятной красоты.",
    "Подземное море скрывает редчайшие минералы на своём дне.",
    "Заброшенный город, построенный древними мастерами горного дела.",
    "Священное место, где когда-то поклонялись силе кристаллов.",
    "Раскалённые тоннели ведут всё глубже к сердцу планеты.",
    "Вечный холод сковал пещеры и спрятал сокровища подо льдом.",
    "Здесь находятся залежи минералов, которых нет больше нигде.",
    "Таинственные голоса доносятся из тёмных коридоров.",
    "Огромные залы, созданные древними существами.",
    "Пространство между мирами, наполненное неизвестной энергией.",
    "Последняя известная область подземного мира. Или только начало?"
];
// Дата последней ежедневной награды
let lastDailyReward = savedGame.lastDailyReward || "";
// Уровень и опыт игрока
let playerLevel = savedGame.playerLevel || 1;
let playerXP = savedGame.playerXP || 0;
let xpNeeded = playerLevel * 100;

// Состояние достижений
let achievements = savedGame.achievements || {
    achievement1: false,
    achievement2: false,
    achievement3: false,
    achievement4: false
};

// Находим элементы игры
const balanceElement = document.getElementById("balance");
const clickButton = document.getElementById("clickButton");
const perClickElement = document.getElementById("perClick");
const perSecondElement = document.getElementById("perSecond");

const upgradeButton = document.getElementById("upgradeButton");
const upgradeCostElement = document.getElementById("upgradeCost");


const mineButton = document.getElementById("mineButton");
const mineCostElement = document.getElementById("mineCost");

// Описываем достижения
const achievementList = [
    {
        id: "achievement1",
        condition: () => crystals >= 1,
        reward: 5
    },
    {
        id: "achievement2",
        condition: () => crystals >= 100,
        reward: 25
    },
    {
        id: "achievement3",
        condition: () => crystals >= 1000,
        reward: 100
    },
    {
        id: "achievement4",
        condition: () => mineCount >= 5,
        reward: 50
    }
];

// Начисляем опыт игроку
// Начисляем опыт игроку
function addXP(amount) {
    playerXP += amount;

    while (playerXP >= xpNeeded) {
        playerXP -= xpNeeded;
        playerLevel += 1;
        xpNeeded = playerLevel * 100;

        let levelReward = Math.floor(
            25 * Math.pow(1.15, playerLevel - 1)
        );

        crystals += levelReward;
        totalCrystals += levelReward;

        showLevelNotification(playerLevel, levelReward);
    }

    document.getElementById("level").textContent = playerLevel;
    document.getElementById("xp").textContent = playerXP;
    document.getElementById("xpNeeded").textContent = xpNeeded;

    document.getElementById("xpProgress").style.width =
        (playerXP / xpNeeded * 100) + "%";

    updateGame();
    saveGame();
}

// Проверяем достижения
function checkAchievements() {
    

    achievementList.forEach(function(achievement) {
        if (
            achievement.condition() &&
            !achievements[achievement.id]
        ) {
            achievements[achievement.id] = true;
            crystals += achievement.reward;

            alert(
                "🏆 Достижение выполнено!\n" +
                "Награда: +" + achievement.reward + " кристаллов!"
            );
        }
    });
}

// Обновляем экран
function updateGame() {
 
    balanceElement.textContent = Math.floor(crystals);
    perClickElement.textContent = crystalsPerClick;
    perSecondElement.textContent = crystalsPerSecond;
    
 // Обновление исследования глубин
document.getElementById("currentDepth").textContent =
    `${depthNames[currentDepth - 1] || "Неизведанные глубины"} (${currentDepth} уровень)`;

document.getElementById("depthBonus").textContent =
    `+${Math.round((getDepthMultiplier() - 1) * 100)}%`;
    document.getElementById("finalProgress").textContent = currentDepth;
    // Открываем Каменный бур со второй глубины
document.getElementById("stoneDrillUpgrade").style.display =
    currentDepth >= 2 ? "flex" : "none";
    document.getElementById("depthDescription").textContent =
    depthDescriptions[currentDepth - 1] || "Ты достиг неизведанных глубин. Здесь скрываются неизвестные тайны.";
    // Обновление редких кристаллов
document.getElementById("rareCrystals").textContent = rareCrystals;
document.getElementById("rareFindAmount").textContent = 1 + magnetLevel
// Показываем текущий шанс найти редкий кристалл
const currentRareChance = Math.min(
    50,
    currentDepth * 2 + luckLevel * 2 + crystalAlchemyLevel * 3
);

document.getElementById("rareChanceDisplay").textContent =
    currentDepth >= 3
        ? currentRareChance + "%"
        : "Доступно с 3-й глубины";
// Обновляем магазин редких технологий
document.getElementById("luckCost").textContent = luckCost;
document.getElementById("luckLevel").textContent = luckLevel;
document.getElementById("magnetCost").textContent = magnetCost;
document.getElementById("magnetLevel").textContent = magnetLevel;
// Обновляем Магию древних
document.getElementById("ancientMagicLevel").textContent = ancientMagicLevel;
document.getElementById("ancientMagicCost").textContent = ancientMagicCost;

document.getElementById("ancientMagicButton").disabled =
    rareCrystals < ancientMagicCost;
    // Обновляем Алхимию кристаллов
document.getElementById("crystalAlchemyLevel").textContent = crystalAlchemyLevel;
document.getElementById("crystalAlchemyCost").textContent = crystalAlchemyCost;

document.getElementById("crystalAlchemyButton").disabled =
    rareCrystals < crystalAlchemyCost;

document.getElementById("magnetButton").disabled = rareCrystals < magnetCost;

document.getElementById("luckButton").disabled =
    rareCrystals < luckCost;
document.getElementById("depthProgress").textContent = Math.min(Math.floor(crystals), depthCost);
document.getElementById("depthCost").textContent = depthCost;

// Показываем цену редких кристаллов перед финальной глубиной
document.getElementById("finalRareCost").textContent =
    finalRareCost.toLocaleString("ru-RU");

document.getElementById("finalCrystalCost").textContent =
    finalCrystalCost.toLocaleString("ru-RU");
    document.getElementById("finalRareHint").style.display =
    currentDepth === 17 ? "block" : "none";

// Проверяем наличие обеих валют
document.getElementById("exploreDepthButton").disabled =
    currentDepth === 17
        ? crystals < finalCrystalCost || rareCrystals < finalRareCost
        : crystals < depthCost;

    upgradeCostElement.textContent = upgradeCost;
    document.getElementById("upgradeLevel").textContent = upgradeCount;
    document.getElementById("magicPickaxeLevel").textContent = magicPickaxeCount;
document.getElementById("powerMineLevel").textContent = powerMineCount;
document.getElementById("crystalFactoryLevel").textContent = crystalFactoryCount;
    mineCostElement.textContent = mineCost;
    document.getElementById("magicPickaxeCost").textContent = magicPickaxeCost;
document.getElementById("powerMineCost").textContent = powerMineCost;
document.getElementById("crystalBoostCost").textContent = crystalBoostCost;
document.getElementById("crystalFactoryCost").textContent = crystalFactoryCost;
document.getElementById("stoneDrillCost").textContent = stoneDrillCost;
document.getElementById("stoneDrillButton").disabled = crystals < stoneDrillCost;

    upgradeButton.disabled = crystals < upgradeCost;
    mineButton.disabled = crystals < mineCost;
    document.getElementById("magicPickaxeButton").disabled = crystals < magicPickaxeCost;
document.getElementById("powerMineButton").disabled = crystals < powerMineCost;
const boostButton = document.getElementById("crystalBoostButton");
boostButton.disabled = crystals < crystalBoostCost || crystalBoostBought;
boostButton.textContent = crystalBoostBought ? "Куплено ✅" : "Купить";
document.getElementById("crystalFactoryButton").disabled = crystals < crystalFactoryCost;

    // Показываем выполненные достижения
    achievementList.forEach(function(achievement) {
        const element = document.getElementById(achievement.id);

        element.classList.toggle(
            "completed",
            achievements[achievement.id]
        );
    });
        // Обновляем уровень и опыт
    document.getElementById("level").textContent = playerLevel;
    document.getElementById("xp").textContent = playerXP;
    document.getElementById("xpNeeded").textContent = xpNeeded;

    document.getElementById("xpProgress").style.width =
        (playerXP / xpNeeded * 100) + "%";
            // Обновляем статистику
   document.getElementById("totalCrystals").textContent = totalCrystals;
document.getElementById("totalClicks").textContent = totalClicks;
document.getElementById("totalMines").textContent = totalMines;

// Проверяем достижение финальной глубины

}

// Сохраняем игру
function saveGame() {
    const save = {
        crystals,
        crystalsPerClick,
        upgradeCost,
        crystalsPerSecond,
        mineCost,
        mineCount,
        totalCrystals,
        ancientMagicLevel,
ancientMagicCost,
crystalAlchemyLevel,
crystalAlchemyCost,
totalClicks,
totalMines,
lastDailyReward,
magicPickaxeCost,
powerMineCost,
crystalBoostCost,
crystalFactoryCost,
crystalBoostBought,
upgradeCount,
magicPickaxeCount,
powerMineCount,
crystalFactoryCount,
currentDepth,
depthCost,
finalRareCost,
finalCrystalCost,
stoneDrillCost,
stoneDrillCount,
rareCrystals,
luckLevel,
luckCost,
magnetLevel,
magnetCost,
        achievements,
       playerLevel,
playerXP,
victoryShown
};

localStorage.setItem("crystalSave", JSON.stringify(save));
}

    // Показываем уведомление о редких кристаллах
function showRareNotification(amount) {
    const notification = document.createElement("div");

    notification.textContent = `✨ Найдены редкие кристаллы! +${amount}`;

    notification.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        background: linear-gradient(135deg, #7137c8, #a855f7);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: bold;
        box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
        z-index: 99999;
        opacity: 1;
        transition: opacity 0.4s ease;
        pointer-events: none;
    `;

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.style.opacity = "0";
    }, 1600);

    setTimeout(function() {
        notification.remove();
    }, 2000);
}
// Универсальное уведомление о покупке технологии
function showTechnologyNotification(technologyName) {
    const notification = document.createElement("div");

    notification.textContent = "✨ Технология «" + technologyName + "» улучшена!";

    notification.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        background: linear-gradient(135deg, #7137c8, #a855f7);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: bold;
        box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
        z-index: 99999;
        opacity: 1;
        transition: opacity 0.4s ease;
        pointer-events: none;
    `;

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.style.opacity = "0";
    }, 1600);

    setTimeout(function() {
        notification.remove();
    }, 2000);
}
// Уведомление о повышении уровня
function showLevelNotification(level, reward) {
    const notification = document.createElement("div");

    notification.innerHTML =
        "⭐ Новый уровень: " + level +
        "<br>💎 Награда: +" + reward + " кристаллов!";

    notification.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        background: linear-gradient(135deg, #d97706, #facc15);
        color: white;
        padding: 18px 26px;
        border-radius: 14px;
        font-weight: bold;
        line-height: 1.7;
        box-shadow: 0 0 25px rgba(250, 204, 21, 0.5);
        z-index: 99999;
        opacity: 1;
        transition: opacity 0.5s ease;
        pointer-events: none;
    `;

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.style.opacity = "0";
    }, 2200);

    setTimeout(function() {
        notification.remove();
    }, 2700);
}
// Бонус добычи за глубину и Магию древних
function getDepthMultiplier() {
    const depthBonus = 1 + (currentDepth - 1) * 0.1;
    const magicBonus = 1 + ancientMagicLevel * 0.25;

    return depthBonus * magicBonus;
}
    // Нажатие на кнопку добычи
clickButton.addEventListener("click", function() {
    let earned = Math.floor(crystalsPerClick * getDepthMultiplier());

crystals += earned;

    totalClicks += 1;
    totalCrystals += earned;

    addXP(1);
      // Поиск редких кристаллов
    if (currentDepth >= 3) {
    const rareChance = Math.min(
    50,
    currentDepth * 2 + luckLevel * 2 + crystalAlchemyLevel * 3
);

        if (Math.random() * 100 < rareChance) {
            const rareEarned = 1 + magnetLevel;
            rareCrystals += rareEarned;
            showRareNotification(rareEarned);
        }
}
    const floatingText = document.createElement("span");
    floatingText.className = "float-number";
    floatingText.textContent = `+${earned} 💎`;

    clickButton.appendChild(floatingText);

    setTimeout(function() {
        floatingText.remove();
   }, 800);

checkAchievements();
    updateGame();
    saveGame();
});

// Покупка улучшения клика
upgradeButton.addEventListener("click", function() {
    if (crystals >= upgradeCost) {
        crystals -= upgradeCost;
        crystalsPerClick += 1;
        upgradeCount += 1;
        addXP(5);

        upgradeCost = Math.floor(upgradeCost * 1.7);

        checkAchievements();
        updateGame();
        saveGame();
    }
});
// Покупка магической кирки
document.getElementById("magicPickaxeButton").addEventListener("click", function() {
    if (crystals >= magicPickaxeCost) {
        crystals -= magicPickaxeCost;
        crystalsPerClick += 5;
        magicPickaxeCount += 1;

        addXP(15);

        magicPickaxeCost = Math.floor(magicPickaxeCost * 1.8);

        updateGame();
        saveGame();
    }
});
// Покупка мощной шахты
document.getElementById("powerMineButton").addEventListener("click", function() {
    if (crystals >= powerMineCost) {
        crystals -= powerMineCost;
        crystalsPerSecond += 5;
        powerMineCount += 1;

        mineCount += 1;
        totalMines += 1;

        addXP(20);

        powerMineCost = Math.floor(powerMineCost * 1.8);

        checkAchievements();
        updateGame();
        saveGame();
    }
});
// Покупка кристального усилителя
document.getElementById("crystalBoostButton").addEventListener("click", function() {
    if (crystals >= crystalBoostCost && !crystalBoostBought) {
        crystals -= crystalBoostCost;

        crystalsPerClick *= 2;
        crystalBoostBought = true;

        addXP(50);

        updateGame();
        saveGame();
    }
});
// Покупка кристальной фабрики
document.getElementById("crystalFactoryButton").addEventListener("click", function() {
    if (crystals >= crystalFactoryCost) {
        crystals -= crystalFactoryCost;
        crystalsPerSecond += 25;
        crystalFactoryCount += 1;

        mineCount += 1;
        totalMines += 1;

        addXP(30);

        crystalFactoryCost = Math.floor(crystalFactoryCost * 1.8);

        checkAchievements();
        updateGame();
        saveGame();
    }
});
// Покупка Каменного бура
document.getElementById("stoneDrillButton").addEventListener("click", function() {
    if (crystals >= stoneDrillCost && currentDepth >= 2) {
        crystals -= stoneDrillCost;

        crystalsPerSecond += 10;
        stoneDrillCount += 1;

        mineCount += 1;
        totalMines += 1;

        addXP(25);

        stoneDrillCost = Math.floor(stoneDrillCost * 1.8);

        checkAchievements();
        updateGame();
        saveGame();
    }
});

// Покупка автоматической шахты
mineButton.addEventListener("click", function() {
    if (crystals >= mineCost) {
        crystals -= mineCost;
        crystalsPerSecond += 1;
        mineCount += 1;
        totalMines += 1;
        addXP(10);

        mineCost = Math.floor(mineCost * 1.7);

        checkAchievements();
        updateGame();
        saveGame();
    }
});

// Автоматическая добыча каждую секунду
setInterval(function() {
    let autoEarned = Math.floor(
    crystalsPerSecond * getDepthMultiplier()
);

crystals += autoEarned;
totalCrystals += autoEarned;

    checkAchievements();
    updateGame();
    saveGame();
}, 1000);

// Проверяем достижения при запуске игры
checkAchievements();
updateGame();
saveGame();
// Ежедневная награда
const dailyRewardButton = document.getElementById("dailyRewardButton");

function updateDailyReward() {
    const today = new Date().toLocaleDateString();

    if (lastDailyReward === today) {
        dailyRewardButton.disabled = true;
        dailyRewardButton.textContent = "Награда уже получена ✅";
    } else {
        dailyRewardButton.disabled = false;
        dailyRewardButton.textContent = "Забрать 100 💎";
    }
}

dailyRewardButton.addEventListener("click", function() {
    const today = new Date().toLocaleDateString();

    if (lastDailyReward !== today) {
        crystals += 100;
        totalCrystals += 100;
        lastDailyReward = today;

        alert("🎁 Ты получил 100 кристаллов!");

        updateDailyReward();
        updateGame();
        saveGame();
    }
});

updateDailyReward();
// Открытие следующей глубины
document.getElementById("exploreDepthButton").addEventListener("click", function() {

    if (currentDepth >= 18) return;

    const requiredCrystals =
    currentDepth === 17 ? finalCrystalCost : depthCost;

if (crystals < requiredCrystals) {
    alert("Недостаточно обычных кристаллов! Нужно: " + requiredCrystals);
    return;
}

    // Для открытия 18-й глубины нужны обе валюты
    if (currentDepth === 17 && rareCrystals < finalRareCost) {
        alert("Недостаточно редких кристаллов! Нужно: " + finalRareCost);
        return;
    }

   crystals -= requiredCrystals;

    if (currentDepth === 17) {
        rareCrystals -= finalRareCost;
    }

    addXP(25);

updateGame();

if (currentDepth === 18 && !victoryShown) {
    document.getElementById("victoryCrystals").textContent =
        Math.floor(crystals).toLocaleString("ru-RU");

    document.getElementById("victoryRare").textContent =
        rareCrystals.toLocaleString("ru-RU");

    document.getElementById("victoryModal").style.display = "flex";

    victoryShown = true;
}

saveGame();
});
document.getElementById("continueGameButton").addEventListener("click", function() {
    document.getElementById("victoryModal").style.display = "none";
    saveGame();
});
// Покупка технологии «Удача шахтёра»
document.getElementById("luckButton").addEventListener("click", function() {
    if (rareCrystals >= luckCost) {
        rareCrystals -= luckCost;

        luckLevel += 1;
        showTechnologyNotification("Удача шахтёра");

       luckCost = Math.floor(luckCost * 1.5);

        updateGame();
        saveGame();
    }
});
// Покупка технологии «Магнит кристаллов»
document.getElementById("magnetButton").addEventListener("click", function() {
    if (rareCrystals >= magnetCost) {
        rareCrystals -= magnetCost;

        magnetLevel += 1;
       magnetCost = Math.floor(magnetCost * 1.5);

        showTechnologyNotification("Магнит кристаллов");

        updateGame();
        saveGame();
    }
});
// Покупка технологии «Магия древних»
document.getElementById("ancientMagicButton").addEventListener("click", function() {
    if (rareCrystals >= ancientMagicCost) {
        rareCrystals -= ancientMagicCost;

        ancientMagicLevel += 1;
        ancientMagicCost = Math.floor(ancientMagicCost * 1.5);

        showTechnologyNotification("Магия древних");

        updateGame();
        saveGame();
    } else {
        alert("Недостаточно редких кристаллов!");
    }
});
// Покупка технологии «Алхимия кристаллов»
document.getElementById("crystalAlchemyButton").addEventListener("click", function() {
    if (rareCrystals >= crystalAlchemyCost) {
        rareCrystals -= crystalAlchemyCost;

        crystalAlchemyLevel += 1;
       crystalAlchemyCost = Math.floor(crystalAlchemyCost * 1.5);

        showTechnologyNotification("Алхимия кристаллов");

        updateGame();
        saveGame();
    } else {
        alert("Недостаточно редких кристаллов!");
    }
});
// Проверяем победу при загрузке игры
if (currentDepth >= 18 && !victoryShown) {
    document.getElementById("victoryCrystals").textContent =
        Math.floor(crystals).toLocaleString("ru-RU");

    document.getElementById("victoryRare").textContent =
        rareCrystals.toLocaleString("ru-RU");

    document.getElementById("victoryModal").style.display = "flex";

    victoryShown = true;
    saveGame();
}
// Инициализация Telegram Mini App
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();
}