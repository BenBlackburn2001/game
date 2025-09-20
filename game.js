// --- Store Boost State ---
let boost2xActive = false;
let boost2xEndTime = 0;
let perm2xCoal = false;
let perm2xIron = false;

// --- Ascension State ---
let ascensionCount = 0;
let ascensionEPSBonus = 1;
let ascensionPoints = 0;
let superGens = { coal: false, iron: false, gold: false };

// --- Used Codes State ---
let usedCodes = {};

// --- Toast Notification ---
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s';
    toast.style.opacity = '0';
    setTimeout(() => container.removeChild(toast), 500);
  }, 2000);
}

// --- Initial Upgrade/Max Upgrade Costs for Reset ---
// Balanced for smoother progression and realistic upgrade pacing
const initialUpgradeCosts = {
  coal: 15, iron: 120, gold: 350, ruby: 900, emerald: 1800,
  diamond: 50000, platinum: 250000, uranium: 1000000, sapphire: 5000000, obsidian: 20000000,
  mythril: 100000000, amethyst: 500000000, topaz: 2000000000, onyx: 10000000000, crystal: 50000000000,
  void: 250000000000, nebula: 1000000000000, quantum: 5000000000000, singularity: 20000000000000, eternity: 100000000000000,
  omega: 500000000000000, alpha: 2000000000000000, zeta: 10000000000000000, lambda: 50000000000000000, sigma: 200000000000000000
};
const initialMaxUpgradeCosts = {
  coal: 500, iron: 750, gold: 1200, ruby: 2000, emerald: 3500,
  diamond: 2500000, platinum: 10000000, uranium: 40000000, sapphire: 150000000, obsidian: 600000000,
  mythril: 2500000000, amethyst: 10000000000, topaz: 40000000000, onyx: 150000000000, crystal: 600000000000,
  void: 2500000000000, nebula: 10000000000000, quantum: 40000000000000, singularity: 150000000000000, eternity: 600000000000000,
  omega: 2500000000000000, alpha: 10000000000000000, zeta: 40000000000000000, lambda: 150000000000000000, sigma: 600000000000000000
};

// --- Default Game Data ---
const defaultGameData = {
  energy: "10",
  eps: "0",
  generators: "0",
  generatorsCoal: "0",
  generatorsIron: "0",
  generatorsGold: "0",
  generatorsRuby: "0",
  generatorsEmerald: "0",
  generatorsDiamond: "0",
  generatorsPlatinum: "0",
  generatorsUranium: "0",
  generatorsSapphire: "0",
  generatorsObsidian: "0",
  generatorsMythril: "0",
  generatorsAmethyst: "0",
  generatorsTopaz: "0",
  generatorsOnyx: "0",
  generatorsCrystal: "0",
  generatorsVoid: "0",
  generatorsNebula: "0",
  generatorsQuantum: "0",
  generatorsSingularity: "0",
  generatorsEternity: "0",
  generatorsOmega: "0",
  generatorsAlpha: "0",
  generatorsZeta: "0",
  generatorsLambda: "0",
  generatorsSigma: "0",
  generatorMax: {
    coal: 100, iron: 100, gold: 100, ruby: 100, emerald: 100, diamond: 100,
    platinum: 100, uranium: 100, sapphire: 100, obsidian: 100,
    mythril: 75, amethyst: 75, topaz: 75, onyx: 75, crystal: 75,
    void: 50, nebula: 50, quantum: 50, singularity: 50, eternity: 50,
    omega: 25, alpha: 25, zeta: 25, lambda: 25, sigma: 25
  }
};

let username = "";
let gameData = JSON.parse(JSON.stringify(defaultGameData));
let multiplier = 1;

// --- Upgrades State ---
const generatorUpgrades = {};
const generatorMaxUpgrades = {};
  // --- Generator Config (with tier property) ---
  const generatorConfig = {
    // Tier 1
    coal:    { tier: 1, baseCost: new BigNumber(8),    power: () => 1 + generatorUpgrades.coal.level * 1.2,  key: "generatorsCoal",    label: "Coal Generators",    button: "generateCoal",    span: "generatorsCoal",    max: defaultGameData.generatorMax.coal, upgrade: "upgradeCoal", sell: "sellCoal", maxBtn: "maxCoal" },
    iron:    { tier: 1, baseCost: new BigNumber(60),   power: () => 4 + generatorUpgrades.iron.level * 1.5,    key: "generatorsIron",    label: "Iron Generators",    button: "generateIron",    span: "generatorsIron",    max: defaultGameData.generatorMax.iron, upgrade: "upgradeIron", sell: "sellIron", maxBtn: "maxIron" },
    gold:    { tier: 1, baseCost: new BigNumber(180),   power: () => 10 + generatorUpgrades.gold.level * 2,   key: "generatorsGold",    label: "Gold Generators",    button: "generateGold",    span: "generatorsGold",    max: defaultGameData.generatorMax.gold, upgrade: "upgradeGold", sell: "sellGold", maxBtn: "maxGold" },
    ruby:    { tier: 1, baseCost: new BigNumber(450),   power: () => 28 + generatorUpgrades.ruby.level * 2.5,   key: "generatorsRuby",    label: "Ruby Generators",    button: "generateRuby",    span: "generatorsRuby",    max: defaultGameData.generatorMax.ruby, upgrade: "upgradeRuby", sell: "sellRuby", maxBtn: "maxRuby" },
    emerald: { tier: 1, baseCost: new BigNumber(900),  power: () => 70 + generatorUpgrades.emerald.level * 3, key: "generatorsEmerald", label: "Emerald Generators", button: "generateEmerald", span: "generatorsEmerald", max: defaultGameData.generatorMax.emerald, upgrade: "upgradeEmerald", sell: "sellEmerald", maxBtn: "maxEmerald" },
    // Tier 2
    diamond:   { tier: 2, baseCost: new BigNumber("25000"),  power: () => 5000 + generatorUpgrades.diamond.level * 4, key: "generatorsDiamond", label: "Diamond Generators", button: "generateDiamond", span: "generatorsDiamond", max: defaultGameData.generatorMax.diamond, upgrade: "upgradeDiamond", sell: "sellDiamond", maxBtn: "maxDiamond" },
    platinum:  { tier: 2, baseCost: new BigNumber("125000"),  power: () => 25000 + generatorUpgrades.platinum.level * 5, key: "generatorsPlatinum", label: "Platinum Generators", button: "generatePlatinum", span: "generatorsPlatinum", max: defaultGameData.generatorMax.platinum, upgrade: "upgradePlatinum", sell: "sellPlatinum", maxBtn: "maxPlatinum" },
    uranium:   { tier: 2, baseCost: new BigNumber("500000"),  power: () => 100000 + generatorUpgrades.uranium.level * 6, key: "generatorsUranium", label: "Uranium Generators", button: "generateUranium", span: "generatorsUranium", max: defaultGameData.generatorMax.uranium, upgrade: "upgradeUranium", sell: "sellUranium", maxBtn: "maxUranium" },
    sapphire:  { tier: 2, baseCost: new BigNumber("2500000"),  power: () => 500000 + generatorUpgrades.sapphire.level * 7, key: "generatorsSapphire", label: "Sapphire Generators", button: "generateSapphire", span: "generatorsSapphire", max: defaultGameData.generatorMax.sapphire, upgrade: "upgradeSapphire", sell: "sellSapphire", maxBtn: "maxSapphire" },
    obsidian:  { tier: 2, baseCost: new BigNumber("10000000"),  power: () => 2000000 + generatorUpgrades.obsidian.level * 8, key: "generatorsObsidian", label: "Obsidian Generators", button: "generateObsidian", span: "generatorsObsidian", max: defaultGameData.generatorMax.obsidian, upgrade: "upgradeObsidian", sell: "sellObsidian", maxBtn: "maxObsidian" },
    // Tier 3
    mythril:   { tier: 3, baseCost: new BigNumber("50000000"),  power: () => 10000000 + generatorUpgrades.mythril.level * 1000000, key: "generatorsMythril", label: "Mythril Generators", button: "generateMythril", span: "generatorsMythril", max: defaultGameData.generatorMax.mythril, upgrade: "upgradeMythril", sell: "sellMythril", maxBtn: "maxMythril" },
    amethyst:  { tier: 3, baseCost: new BigNumber("250000000"),  power: () => 50000000 + generatorUpgrades.amethyst.level * 2000000, key: "generatorsAmethyst", label: "Amethyst Generators", button: "generateAmethyst", span: "generatorsAmethyst", max: defaultGameData.generatorMax.amethyst, upgrade: "upgradeAmethyst", sell: "sellAmethyst", maxBtn: "maxAmethyst" },
    topaz:     { tier: 3, baseCost: new BigNumber("1000000000"), power: () => 200000000 + generatorUpgrades.topaz.level * 5000000, key: "generatorsTopaz", label: "Topaz Generators", button: "generateTopaz", span: "generatorsTopaz", max: defaultGameData.generatorMax.topaz, upgrade: "upgradeTopaz", sell: "sellTopaz", maxBtn: "maxTopaz" },
    onyx:      { tier: 3, baseCost: new BigNumber("5000000000"), power: () => 1000000000 + generatorUpgrades.onyx.level * 10000000, key: "generatorsOnyx", label: "Onyx Generators", button: "generateOnyx", span: "generatorsOnyx", max: defaultGameData.generatorMax.onyx, upgrade: "upgradeOnyx", sell: "sellOnyx", maxBtn: "maxOnyx" },
    crystal:   { tier: 3, baseCost: new BigNumber("25000000000"), power: () => 5000000000 + generatorUpgrades.crystal.level * 20000000, key: "generatorsCrystal", label: "Crystal Generators", button: "generateCrystal", span: "generatorsCrystal", max: defaultGameData.generatorMax.crystal, upgrade: "upgradeCrystal", sell: "sellCrystal", maxBtn: "maxCrystal" },
    // Tier 4
    void:        { tier: 4, baseCost: new BigNumber("125000000000"), power: () => 25000000000 + generatorUpgrades.void.level * 100000000, key: "generatorsVoid", label: "Void Generators", button: "generateVoid", span: "generatorsVoid", max: defaultGameData.generatorMax.void, upgrade: "upgradeVoid", sell: "sellVoid", maxBtn: "maxVoid" },
    nebula:      { tier: 4, baseCost: new BigNumber("500000000000"), power: () => 100000000000 + generatorUpgrades.nebula.level * 200000000, key: "generatorsNebula", label: "Nebula Generators", button: "generateNebula", span: "generatorsNebula", max: defaultGameData.generatorMax.nebula, upgrade: "upgradeNebula", sell: "sellNebula", maxBtn: "maxNebula" },
    quantum:     { tier: 4, baseCost: new BigNumber("2000000000000"), power: () => 400000000000 + generatorUpgrades.quantum.level * 500000000, key: "generatorsQuantum", label: "Quantum Generators", button: "generateQuantum", span: "generatorsQuantum", max: defaultGameData.generatorMax.quantum, upgrade: "upgradeQuantum", sell: "sellQuantum", maxBtn: "maxQuantum" },
    singularity: { tier: 4, baseCost: new BigNumber("10000000000000"), power: () => 2000000000000 + generatorUpgrades.singularity.level * 1000000000, key: "generatorsSingularity", label: "Singularity Generators", button: "generateSingularity", span: "generatorsSingularity", max: defaultGameData.generatorMax.singularity, upgrade: "upgradeSingularity", sell: "sellSingularity", maxBtn: "maxSingularity" },
    eternity:    { tier: 4, baseCost: new BigNumber("50000000000000"), power: () => 10000000000000 + generatorUpgrades.eternity.level * 2000000000, key: "generatorsEternity", label: "Eternity Generators", button: "generateEternity", span: "generatorsEternity", max: defaultGameData.generatorMax.eternity, upgrade: "upgradeEternity", sell: "sellEternity", maxBtn: "maxEternity" },
    // Tier 5
    omega:   { tier: 5, baseCost: new BigNumber("250000000000000"), power: () => 50000000000000 + generatorUpgrades.omega.level * 10000000000, key: "generatorsOmega", label: "Omega Generators", button: "generateOmega", span: "generatorsOmega", max: defaultGameData.generatorMax.omega, upgrade: "upgradeOmega", sell: "sellOmega", maxBtn: "maxOmega" },
    alpha:   { tier: 5, baseCost: new BigNumber("1000000000000000"), power: () => 200000000000000 + generatorUpgrades.alpha.level * 20000000000, key: "generatorsAlpha", label: "Alpha Generators", button: "generateAlpha", span: "generatorsAlpha", max: defaultGameData.generatorMax.alpha, upgrade: "upgradeAlpha", sell: "sellAlpha", maxBtn: "maxAlpha" },
    zeta:    { tier: 5, baseCost: new BigNumber("4000000000000000"), power: () => 800000000000000 + generatorUpgrades.zeta.level * 50000000000, key: "generatorsZeta", label: "Zeta Generators", button: "generateZeta", span: "generatorsZeta", max: defaultGameData.generatorMax.zeta, upgrade: "upgradeZeta", sell: "sellZeta", maxBtn: "maxZeta" },
    lambda:  { tier: 5, baseCost: new BigNumber("15000000000000000"), power: () => 3000000000000000 + generatorUpgrades.lambda.level * 100000000000, key: "generatorsLambda", label: "Lambda Generators", button: "generateLambda", span: "generatorsLambda", max: defaultGameData.generatorMax.lambda, upgrade: "upgradeLambda", sell: "sellLambda", maxBtn: "maxLambda" },
    sigma:   { tier: 5, baseCost: new BigNumber("60000000000000000"), power: () => 12000000000000000 + generatorUpgrades.sigma.level * 200000000000, key: "generatorsSigma", label: "Sigma Generators", button: "generateSigma", span: "generatorsSigma", max: defaultGameData.generatorMax.sigma, upgrade: "upgradeSigma", sell: "sellSigma", maxBtn: "maxSigma" }
  };

  // Initialize upgrades and max upgrades
  for (const key in generatorConfig) {
    generatorUpgrades[key] = { level: 0, cost: new BigNumber(initialUpgradeCosts[key]) };
    generatorMaxUpgrades[key] = { cost: new BigNumber(initialMaxUpgradeCosts[key]), increment: generatorConfig[key].tier === 1 ? 100 : 1 };
  }

  // --- Helpers ---
  function getEnergy() { return new BigNumber(gameData.energy); }
  function setEnergy(val) { gameData.energy = val.toString(); }
  function getEPS() { return new BigNumber(gameData.eps); }
  function setEPS(val) { gameData.eps = val.toString(); }
  function getGenCount(key) { return new BigNumber(gameData[key]); }
  function setGenCount(key, val) { gameData[key] = val.toString(); }
  function getTotalGenerators() { return new BigNumber(gameData.generators); }
  function setTotalGenerators(val) { gameData.generators = val.toString(); }

  function formatNumber(num) {
    if (!(num instanceof BigNumber)) num = new BigNumber(num);
    const suffixes = ['', 'k', 'm', 'b', 't', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    if (num.isLessThan(1000)) return num.toFixed(2).replace(/\.00$/, '');
    const exponent = num.e;
    const tier = Math.floor(exponent / 3);
    if (tier >= suffixes.length) return num.toExponential(3);
    const scaled = num.dividedBy(new BigNumber(10).pow(tier * 3));
    return scaled.toFixed(2).replace(/\.00$/, '') + suffixes[tier];
  }

  function getTotalCost(base, owned, amount) {
    return base.times(amount); // flat cost
  }

  // --- EPS Calculation ---
  function recalculateEPS() {
    let total = new BigNumber(0);
    for (const key in generatorConfig) {
      let power = generatorConfig[key].power();
      // Apply permanent boosts
      if (key === 'coal' && perm2xCoal) power *= 2;
      if (key === 'iron' && perm2xIron) power *= 2;
      // Apply ascension super gens
      if (superGens[key]) power *= 2;
      total = total.plus(getGenCount(generatorConfig[key].key).times(power));
    }
    if (boost2xActive) total = total.times(2);
    // Defensive: ensure ascensionEPSBonus is always at least 1
    let epsBonus = ascensionEPSBonus;
    if (!epsBonus || isNaN(epsBonus) || epsBonus < 1) {
      epsBonus = 1 + (ascensionCount || 0) * 0.1;
      ascensionEPSBonus = epsBonus;
    }
    total = total.times(epsBonus);
    setEPS(total);
  }

  // --- Factory Animation Update ---
  function updateFactoryAnimations() {
    // Unique colors for each generator
    const generatorColors = {
      coal:      "#424242",
      iron:      "#bdbdbd",
      gold:      "#ffd600",
      ruby:      "#d32f2f",
      emerald:   "#43a047",
      diamond:   "#81d4fa",
      platinum:  "#e5e4e2",
      uranium:   "#cddc39",
      sapphire:  "#1976d2",
      obsidian:  "#212121",
      mythril:   "#90caf9",
      amethyst:  "#ab47bc",
      topaz:     "#ffb300",
      onyx:      "#000000",
      crystal:   "#e1f5fe",
      void:      "#212121",
      nebula:    "#7e57c2",
      quantum:   "#00bcd4",
      singularity: "#263238",
      eternity:  "#fbc02d",
      omega:     "#f44336",
      alpha:     "#8bc34a",
      zeta:      "#00e676",
      lambda:    "#ff4081",
      sigma:     "#3f51b5"
    };
    for (const key in generatorConfig) {
      const gen = generatorConfig[key];
      let container = document.getElementById(`factory-anim-${key}`);
      if (!container) {
        // Find the generator row and add the container if missing
        const row = document.getElementById(gen.span)?.parentElement;
        if (row) {
          container = document.createElement('div');
          container.id = `factory-anim-${key}`;
          container.className = 'factory-anim-container';
          row.appendChild(container);
        }
      }
      if (!container) continue;
      const owned = getGenCount(gen.key).toNumber();
      const factoriesToShow = Math.min(owned, 10);
      container.innerHTML = '';
      for (let i = 0; i < factoriesToShow; i++) {
        const color = generatorColors[key] || "#1F1C1C";
        const factoryDiv = document.createElement('div');
        factoryDiv.className = 'factory-animation';
        factoryDiv.innerHTML = `
          <svg viewBox="0 0 48 48" width="48" height="48">
            <rect x="8" y="24" width="32" height="16" rx="4" fill="${color}"/>
            <rect x="12" y="20" width="8" height="8" fill="#bdbdbd"/>
            <rect x="28" y="20" width="8" height="8" fill="#bdbdbd"/>
            <rect x="20" y="12" width="8" height="12" fill="#ffd600"/>
            <rect x="22" y="8" width="4" height="4" fill="#ffb300"/>
            <rect x="16" y="36" width="4" height="4" fill="#fff"/>
            <rect x="28" y="36" width="4" height="4" fill="#fff"/>
          </svg>
        `;
        container.appendChild(factoryDiv);
      }
    }
  }

  // --- UI Update ---
  function updateAllUI() {
    document.getElementById('energy').textContent = `Total Energy: ${formatNumber(getEnergy())}`;
    document.getElementById('eps').textContent = `EPS: ${formatNumber(getEPS())}`;
    document.getElementById('generators').textContent = `Generators: ${formatNumber(getTotalGenerators())}`;
    // Store UI
    const boostMsg = document.getElementById('boost-active-msg');
    if (boostMsg) {
      if (boost2xActive) {
        boostMsg.style.display = '';
        boostMsg.textContent = `Active! Ends in ${formatBoostTime()}`;
      } else {
        boostMsg.style.display = 'none';
      }
    }
    // Permanent coal boost UI
    const permCoalMsg = document.getElementById('perm-coal-active-msg');
    const permCoalBtn = document.getElementById('buy-perm-2x-coal');
    if (permCoalMsg && permCoalBtn) {
      if (perm2xCoal) {
        permCoalMsg.style.display = '';
        permCoalBtn.disabled = true;
      } else {
        permCoalMsg.style.display = 'none';
        permCoalBtn.disabled = false;
      }
    }

    for (const key in generatorConfig) {
      if (!document.getElementById(generatorConfig[key].span)) continue;
      const gen = generatorConfig[key];
      const owned = getGenCount(gen.key);
      if (gameData.generatorMax && gameData.generatorMax[key] !== undefined) {
        gen.max = gameData.generatorMax[key];
      }
      const upgrade = generatorUpgrades[key];
      const upgradeBtn = document.getElementById(gen.upgrade);
      upgradeBtn.textContent = `Upgrade (Cost: ${formatNumber(upgrade.cost)}) [+${gen.power()}]`;
      upgradeBtn.disabled = !getEnergy().gte(upgrade.cost) || owned.lte(0);
      const maxBtn = document.getElementById(gen.maxBtn);
      const maxUpgrade = generatorMaxUpgrades[key];
      maxBtn.textContent = `Max+ (Cost: ${formatNumber(maxUpgrade.cost)}) [+${gen.max}]`;
      maxBtn.disabled = !getEnergy().gte(maxUpgrade.cost);
      const sellBtn = document.getElementById(gen.sell);
      sellBtn.disabled = owned.lte(0);
      if (owned.gte(gen.max)) {
        document.getElementById(gen.span).textContent = `${gen.label}: ${formatNumber(owned)} / ${gen.max}`;
        const btn = document.getElementById(gen.button);
        btn.textContent = `${gen.label} (MAXED)`;
        btn.disabled = true;
        continue;
      }
      const cost = getTotalCost(gen.baseCost, owned, multiplier);
      document.getElementById(gen.span).textContent = `${gen.label}: ${formatNumber(owned)} / ${gen.max}`;
      const btn = document.getElementById(gen.button);
      btn.textContent = `Buy ${gen.label.replace('s', '')} (Cost: ${formatNumber(cost)})`;
      btn.disabled = !getEnergy().gte(cost);
    }
    // Update factory animations
    updateFactoryAnimations();
  }

  // --- Purchase Logic ---
  function purchaseGenerator(key) {
    const gen = generatorConfig[key];
    const owned = getGenCount(gen.key);
    if (owned.gte(gen.max)) return;
    let actualBuyAmount = Math.min(multiplier, gen.max - owned.toNumber());
    const cost = getTotalCost(gen.baseCost, owned, actualBuyAmount);
    if (getEnergy().gte(cost)) {
      setEnergy(getEnergy().minus(cost));
      setGenCount(gen.key, owned.plus(actualBuyAmount));
      setTotalGenerators(getTotalGenerators().plus(actualBuyAmount));
      recalculateEPS();
      updateAllUI();
    }
  }

  // --- Sell Logic ---
  function sellGenerator(key) {
    const gen = generatorConfig[key];
    const owned = getGenCount(gen.key);
    if (owned.lte(0)) return;
    setGenCount(gen.key, owned.minus(1));
    setTotalGenerators(getTotalGenerators().minus(1));
    setEnergy(getEnergy().plus(gen.baseCost.times(0.5)));
    recalculateEPS();
    updateAllUI();
  }

  // --- Upgrade Logic (per generator) ---
  function upgradeGenerator(key) {
    const gen = generatorConfig[key];
    const upgrade = generatorUpgrades[key];
    const owned = getGenCount(gen.key);
    if (getEnergy().gte(upgrade.cost) && owned.gt(0)) {
      setEnergy(getEnergy().minus(upgrade.cost));
      upgrade.level += 1;
      upgrade.cost = upgrade.cost.times(2);
      recalculateEPS();
      updateAllUI();
    }
  }

  // --- Max Upgrade Logic (per generator) ---
  function upgradeMaxGenerator(key) {
    const gen = generatorConfig[key];
    const maxUpgrade = generatorMaxUpgrades[key];
    if (getEnergy().gte(maxUpgrade.cost)) {
      setEnergy(getEnergy().minus(maxUpgrade.cost));
      gen.max += maxUpgrade.increment;
      gameData.generatorMax[key] = gen.max;
      maxUpgrade.cost = maxUpgrade.cost.times(2);
      updateAllUI();
    }
  }

  // --- Save / Load / Reset ---
  function saveGame() {
    username = sanitizeInput(document.getElementById('username').value.trim());
    if (!username) { showToast('Enter your username before saving.'); return; }
    const saveCopy = { ...gameData, generatorMax: {} };
    for (const key in generatorConfig) {
      saveCopy.generatorMax[key] = generatorConfig[key].max;
    }
    saveCopy.generatorUpgrades = {};
    for (const key in generatorUpgrades) {
      saveCopy.generatorUpgrades[key] = {
        level: generatorUpgrades[key].level,
        cost: generatorUpgrades[key].cost.toString()
      };
    }
    saveCopy.generatorMaxUpgrades = {};
    for (const key in generatorMaxUpgrades) {
      saveCopy.generatorMaxUpgrades[key] = {
        cost: generatorMaxUpgrades[key].cost.toString()
      };
    }
    // Save all persistent state
    saveCopy.ascensionPoints = ascensionPoints;
    saveCopy.ascensionCount = ascensionCount;
    saveCopy.ascensionEPSBonus = ascensionEPSBonus;
    saveCopy.superGens = superGens;
    saveCopy.perm2xCoal = perm2xCoal;
    saveCopy.perm2xIron = perm2xIron;
    saveCopy.usedCodes = usedCodes;
    try {
      localStorage.setItem(username, JSON.stringify(saveCopy));
      localStorage.setItem('lastUsername', username);
      showToast('Game saved!');
    } catch (e) {
      showToast('Save failed!');
    }
  }

  function loadGame() {
    username = sanitizeInput(document.getElementById('username').value.trim());
    if (!username) { showToast('Enter a username first.'); return; }
    try {
      const savedData = localStorage.getItem(username);
      if (savedData) {
        const saved = JSON.parse(savedData);
        gameData = saved;
        ascensionPoints = saved.ascensionPoints || 0;
        ascensionCount = saved.ascensionCount || 0;
        ascensionEPSBonus = saved.ascensionEPSBonus || (1 + ascensionCount * 0.1);
        superGens = saved.superGens || { coal: false, iron: false, gold: false };
        perm2xCoal = saved.perm2xCoal || false;
        perm2xIron = saved.perm2xIron || false;
        usedCodes = saved.usedCodes || {};
        // MIGRATION: Add missing fields for new generators/upgrades
        for (const key in generatorConfig) {
          if (typeof gameData[key] === "undefined" || isNaN(Number(gameData[key]))) {
            gameData[key] = "0";
          }
          if (!gameData.generatorMax) gameData.generatorMax = {};
          if (typeof gameData.generatorMax[key] === "undefined" || isNaN(Number(gameData.generatorMax[key]))) {
            gameData.generatorMax[key] = generatorConfig[key].max;
          }
          if (!gameData.generatorUpgrades) gameData.generatorUpgrades = {};
          if (!gameData.generatorUpgrades[key]) {
            gameData.generatorUpgrades[key] = {
              level: 0,
              cost: initialUpgradeCosts[key] ? initialUpgradeCosts[key].toString() : "1000"
            };
          }
          if (!gameData.generatorMaxUpgrades) gameData.generatorMaxUpgrades = {};
          if (!gameData.generatorMaxUpgrades[key]) {
            gameData.generatorMaxUpgrades[key] = {
              cost: initialMaxUpgradeCosts[key] ? initialMaxUpgradeCosts[key].toString() : "1000"
            };
          }
        }
        if (gameData.generatorMax) {
          for (const key in gameData.generatorMax) {
            generatorConfig[key].max = gameData.generatorMax[key];
          }
        }
        if (gameData.generatorUpgrades) {
          for (const key in gameData.generatorUpgrades) {
            generatorUpgrades[key].level = gameData.generatorUpgrades[key].level;
            generatorUpgrades[key].cost = new BigNumber(gameData.generatorUpgrades[key].cost);
          }
        }
        if (gameData.generatorMaxUpgrades) {
          for (const key in gameData.generatorMaxUpgrades) {
            if (gameData.generatorMaxUpgrades[key].cost)
              generatorMaxUpgrades[key].cost = new BigNumber(gameData.generatorMaxUpgrades[key].cost);
          }
        }
        recalculateEPS();
        updateAllUI();
        showToast('Game loaded!');
      } else {
        showToast('No save found for this username.');
      }
    } catch (e) {
      showToast('Corrupt save data. Resetting game.');
      resetGame();
    }
  }

  function resetGame() {
    if (confirm("Are you sure you want to reset your game? This cannot be undone!")) {
      gameData = JSON.parse(JSON.stringify(defaultGameData));
      for (const key in generatorConfig) {
        generatorConfig[key].max = defaultGameData.generatorMax[key];
      }
      for (const key in generatorUpgrades) {
        generatorUpgrades[key].level = 0;
        generatorUpgrades[key].cost = new BigNumber(initialUpgradeCosts[key]);
      }
      for (const key in generatorMaxUpgrades) {
        generatorMaxUpgrades[key].cost = new BigNumber(initialMaxUpgradeCosts[key]);
      }
      // Reset all persistent state except ascension bonuses (if ascension, keep bonus)
      perm2xCoal = false;
      perm2xIron = false;
      superGens = { coal: false, iron: false, gold: false };
      usedCodes = {};
      recalculateEPS();
      updateAllUI();
      showToast("Game reset to original state!");
    }
  }

  // --- Dynamic Generator Rendering ---
  let currentTier = 1;
  function renderGenerators() {
    const section = document.getElementById('generators-section');
    section.innerHTML = '';
    for (const key in generatorConfig) {
      if (generatorConfig[key].tier !== currentTier) continue;
      const gen = generatorConfig[key];
      const row = document.createElement('div');
      row.className = 'generator-row';
      row.innerHTML = `
        <span id="${gen.span}" class="generator-label">${gen.label}: 0 / ${gen.max}</span>
        <button id="${gen.button}" class="generator-btn"></button>
        <button id="${gen.sell}" class="sell-btn">Sell</button>
        <button id="${gen.upgrade}" class="upgrade-btn"></button>
        <button id="${gen.maxBtn}" class="max-btn"></button>
        <div id="factory-anim-${key}" class="factory-anim-container"></div>
      `;
      section.appendChild(row);
    }
    for (const key in generatorConfig) {
      if (generatorConfig[key].tier !== currentTier) continue;
      document.getElementById(generatorConfig[key].button).onclick = () => purchaseGenerator(key);
      document.getElementById(generatorConfig[key].sell).onclick = () => sellGenerator(key);
      document.getElementById(generatorConfig[key].upgrade).onclick = () => upgradeGenerator(key);
      document.getElementById(generatorConfig[key].maxBtn).onclick = () => upgradeMaxGenerator(key);
    }
    updateAllUI();
  }

  // --- Tier Button Logic ---
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tier-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTier = parseInt(this.getAttribute('data-tier'), 10);
        renderGenerators();
      });
    });
  });

  // --- Start Game After DOM Loads ---
  window.onload = function() {
    document.getElementById('purchase-multiplier').onchange = function() {
      multiplier = parseInt(this.value, 10);
      updateAllUI();
    };
    document.getElementById('saveBtn').onclick = saveGame;
    document.getElementById('loadBtn').onclick = loadGame;
    document.getElementById('resetBtn').onclick = resetGame;
    const lastUser = localStorage.getItem('lastUsername');
    if (lastUser) {
      document.getElementById('username').value = lastUser;
      username = lastUser;
      loadGame();
    } else {
      recalculateEPS();
      renderGenerators();
    }
    document.getElementById('storeBtn').onclick = function() {
      document.getElementById('store-modal').style.display = 'flex';
      updateAllUI();
    };
    document.getElementById('closeStoreBtn').onclick = function() {
      document.getElementById('store-modal').style.display = 'none';
    };
    document.getElementById('codeBtn').onclick = function() {
      document.getElementById('code-modal').style.display = 'flex';
      document.getElementById('codeInput').value = '';
      document.getElementById('codeResultMsg').style.display = 'none';
    };
    document.getElementById('closeCodeBtn').onclick = function() {
      document.getElementById('code-modal').style.display = 'none';
    };
    document.getElementById('redeemCodeBtn').onclick = function() {
      const code = sanitizeInput(document.getElementById('codeInput').value.trim().toUpperCase());
      const msg = document.getElementById('codeResultMsg');
      msg.style.display = '';
      if (usedCodes[code]) {
        msg.textContent = 'Code already used.';
        msg.style.color = '#ff5252';
        return;
      }
      if (code === 'FREE100K') {
        setEnergy(getEnergy().plus(100000));
        msg.textContent = 'Success! 100,000 energy added.';
        msg.style.color = '#69f0ae';
        showToast('Code redeemed: 100,000 energy!');
        usedCodes[code] = true;
        updateAllUI();
        saveGame();
      } else if (code === 'FREE100B') {
        setEnergy(getEnergy().plus(100000000000));
        msg.textContent = 'Success! 100,000,000,000 energy added.';
        msg.style.color = '#69f0ae';
        showToast('Code redeemed: 100,000,000,000 energy!');
        usedCodes[code] = true;
        updateAllUI();
        saveGame();
      } else if (code === 'COALBOOST') {
        if (!perm2xCoal) {
          perm2xCoal = true;
          msg.textContent = 'Success! Permanent 2x Coal boost unlocked!';
          msg.style.color = '#69f0ae';
          showToast('Code redeemed: Permanent 2x Coal boost!');
          usedCodes[code] = true;
          recalculateEPS();
          updateAllUI();
          saveGame();
        } else {
          msg.textContent = 'Code already used.';
          msg.style.color = '#ff5252';
        }
      } else if (code === 'IRONBOOST2025') {
        if (!perm2xIron) {
          perm2xIron = true;
          msg.textContent = 'Success! Permanent 2x Iron boost unlocked!';
          msg.style.color = '#69f0ae';
          showToast('Code redeemed: Permanent 2x Iron boost!');
          usedCodes[code] = true;
          recalculateEPS();
          updateAllUI();
          saveGame();
        } else {
          msg.textContent = 'Code already used.';
          msg.style.color = '#ff5252';
        }
      } else {
        msg.textContent = 'Invalid code.';
        msg.style.color = '#ff5252';
      }
    };
    document.getElementById('buy-boost-2x').onclick = function() {
      if (boost2xActive) {
        showToast('Boost already active!');
        return;
      }
      const cost = new BigNumber(100000);
      if (!getEnergy().gte(cost)) {
        showToast('Not enough energy!');
        return;
      }
      setEnergy(getEnergy().minus(cost));
      boost2xActive = true;
      boost2xEndTime = Date.now() + 24 * 60 * 60 * 1000;
      showToast('2x Energy Output for 24h activated!');
      recalculateEPS();
      updateAllUI();
    };
    document.getElementById('buy-perm-2x-coal').onclick = function() { 
      if (perm2xCoal) {
        showToast('Already purchased!');
        return;
      }
      const cost = new BigNumber(1000000);
      if (!getEnergy().gte(cost)) {
        showToast('Not enough energy!');
        return;
      }
      setEnergy(getEnergy().minus(cost));
      perm2xCoal = true;
      showToast('Permanent 2x Coal Generator Output purchased!');
      recalculateEPS();
      updateAllUI();
    };
    document.getElementById('ascendBtn').onclick = function() {
      document.getElementById('ascension-modal').style.display = 'flex';
      document.getElementById('ascendResultMsg').style.display = 'none';
    };
    document.getElementById('closeAscendBtn').onclick = function() {
      document.getElementById('ascension-modal').style.display = 'none';
    };
    document.getElementById('ascendConfirmBtn').onclick = function() {
      const msg = document.getElementById('ascendResultMsg');
      msg.style.display = '';
      if (getEnergy().gte("1e9")) {
        ascensionCount += 1;
        ascensionEPSBonus = 1 + ascensionCount * 0.1;
        ascensionPoints += 1; // Award 1 ascension point per ascension
        saveGame();
        resetGame();
        recalculateEPS();
        updateAllUI();
        msg.textContent = `Ascended! Permanent EPS bonus: +${(ascensionEPSBonus * 100 - 100).toFixed(0)}%`;
        msg.style.color = '#69f0ae';
        showToast('Ascension complete! EPS permanently boosted.');
      } else {
        msg.textContent = 'Not enough energy to ascend.';
        msg.style.color = '#ff5252';
      }
    };
    document.getElementById('ascendUpgradesBtn').onclick = function() {
      document.getElementById('ascend-upgrades-modal').style.display = 'flex';
      renderAscensionSkillTree();
    };
    document.getElementById('closeAscendUpgradesBtn').onclick = function() {
      document.getElementById('ascend-upgrades-modal').style.display = 'none';
    };
    setInterval(() => {
      // Calculate EPS using the same logic as recalculateEPS
      let totalAdd = new BigNumber(0);
      for (const key in generatorConfig) {
        let power = generatorConfig[key].power();
        if (key === 'coal' && perm2xCoal) power *= 2;
        if (key === 'iron' && perm2xIron) power *= 2;
        if (superGens[key]) power *= 2;
        totalAdd = totalAdd.plus(getGenCount(generatorConfig[key].key).times(power));
      }
      if (boost2xActive) totalAdd = totalAdd.times(2);
      let epsBonus = ascensionEPSBonus;
      if (!epsBonus || isNaN(epsBonus) || epsBonus < 1) {
        epsBonus = 1 + (ascensionCount || 0) * 0.1;
        ascensionEPSBonus = epsBonus;
      }
      totalAdd = totalAdd.times(epsBonus);

      // Actually add EPS to energy and update EPS value
      setEnergy(getEnergy().plus(totalAdd));
      setEPS(totalAdd); // This sets the EPS display to match actual gain
      updateAllUI();
    }, 1000);
    setInterval(() => {
      if (boost2xActive && Date.now() > boost2xEndTime) {
        boost2xActive = false;
        boost2xEndTime = 0;
        showToast('2x Energy Output boost expired.');
        recalculateEPS();
        updateAllUI();
      } else if (boost2xActive) {
        updateAllUI();
      }
    }, 10000);
    renderGenerators();
  };

  function formatBoostTime() {
    if (!boost2xActive) return '';
    const ms = boost2xEndTime - Date.now();
    if (ms <= 0) return 'Expired';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  // Add at the top:
  function sanitizeInput(str) {
    return str.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);
  }

  // --- Keyboard navigation for modals ---
  document.addEventListener('keydown', function(e) {
    // ESC closes any open modal
    if (e.key === "Escape") {
      document.getElementById('code-modal').style.display = 'none';
      document.getElementById('store-modal').style.display = 'none';
      document.getElementById('ascension-modal').style.display = 'none';
      document.getElementById('ascend-upgrades-modal').style.display = 'none';
    }
    // TAB cycles focus in modals (simple implementation)
    if (e.key === "Tab") {
      const modals = ['code-modal', 'store-modal', 'ascension-modal', 'ascend-upgrades-modal'];
      for (const id of modals) {
        const modal = document.getElementById(id);
        if (modal && modal.style.display !== 'none') {
          const focusables = modal.querySelectorAll('button, input');
          if (focusables.length) {
            e.preventDefault();
            let idx = Array.from(focusables).indexOf(document.activeElement);
            idx = (idx + 1) % focusables.length;
            focusables[idx].focus();
          }
        }
      }
    }
  });

  // --- Scalable ascension upgrades ---
  const ascensionUpgrades = [
    {
      key: 'coal',
      name: 'Super Coal Gen',
      cost: 1,
      applied: () => superGens.coal,
      apply: () => { superGens.coal = true; }
    },
    {
      key: 'iron',
      name: 'Super Iron Gen',
      cost: 2,
      applied: () => superGens.iron,
      apply: () => { superGens.iron = true; }
    }
    // Add more upgrades here
  ];

  // In Ascension Upgrades Modal rendering:
  function renderAscensionUpgrades() {
    document.getElementById('ascendPointsDisplay').textContent = ascensionPoints;
    const list = document.getElementById('ascend-upgrades-list');
    list.innerHTML = '';
    ascensionUpgrades.forEach(upg => {
      const div = document.createElement('div');
      div.style = "margin-bottom:18px; padding:12px; background:#181a1b; border-radius:8px;";
      div.innerHTML = `
        <div style="font-weight:bold; color:#fff;">${upg.name}</div>
        <div style="color:#ffb300; margin-bottom:8px;">Cost: ${upg.cost} Ascension Point${upg.cost > 1 ? 's' : ''}</div>
        <button id="buySuper${upg.key}Btn" class="menu-button" style="width:100%;" ${upg.applied() ? 'disabled' : ''}>Apply to ${upg.name.split(' ')[1]}</button>
        <div id="super${upg.key}Msg" style="color:#69f0ae; margin-top:8px; display:${upg.applied() ? '' : 'none'};">Applied!</div>
      `;
      list.appendChild(div);
      div.querySelector(`#buySuper${upg.key}Btn`).onclick = function() {
        if (ascensionPoints < upg.cost || upg.applied()) return;
        ascensionPoints -= upg.cost;
        upg.apply();
        renderAscensionUpgrades();
        showToast(`${upg.name} applied!`);
        recalculateEPS();
        updateAllUI();
      };
    });
  }

  const ascendSkillTree = [
    {
      key: 'coal',
      name: 'Super Coal Gen',
      icon: '⛏️',
      cost: 1,
      applied: () => superGens.coal,
      apply: () => { superGens.coal = true; },
      unlock: () => true,
      x: 100, y: 160
    },
    {
      key: 'iron',
      name: 'Super Iron Gen',
      icon: '🪨',
      cost: 2,
      applied: () => superGens.iron,
      apply: () => { superGens.iron = true; },
      unlock: () => superGens.coal,
      x: 250, y: 80
    },
    {
      key: 'gold',
      name: 'Super Gold Gen',
      icon: '💰',
      cost: 3,
      applied: () => superGens.gold,
      apply: () => { superGens.gold = true; },
      unlock: () => superGens.iron,
      x: 400, y: 160
    }
    // Add more nodes as desired, chaining unlocks
  ];

  function renderAscensionSkillTree() {
    const nodesDiv = document.getElementById('ascend-skilltree-nodes');
    const svg = document.getElementById('ascend-skilltree-lines');
    nodesDiv.innerHTML = '';
    svg.innerHTML = '';
    // Render nodes
    ascendSkillTree.forEach((node, idx) => {
      const div = document.createElement('div');
      div.className = 'ascend-node' +
        (node.applied() ? ' applied' : '') +
        (!node.unlock() ? ' locked' : '');
      div.tabIndex = 0;
      div.style.left = node.x + 'px';
      div.style.top = node.y + 'px';
      div.innerHTML = `
        <div class="ascend-icon">${node.icon}</div>
        <div class="ascend-label">${node.name}</div>
        <div class="ascend-cost">Cost: ${node.cost}</div>
      `;
      if (!node.applied() && node.unlock() && ascensionPoints >= node.cost) {
        div.onclick = () => {
          ascensionPoints -= node.cost;
          node.apply();
          showToast(`${node.name} applied!`);
          recalculateEPS();
          updateAllUI();
          renderAscensionSkillTree();
        };
      }
      nodesDiv.appendChild(div);
    });
    // Draw lines between nodes
    for (let i = 1; i < ascendSkillTree.length; ++i) {
      const from = ascendSkillTree[i - 1];
      const to = ascendSkillTree[i];
      svg.innerHTML += `<line class="ascend-line" x1="${from.x + 32}" y1="${from.y + 32}" x2="${to.x + 32}" y2="${to.y + 32}" />`;
    }
    document.getElementById('ascendPointsDisplay').textContent = ascensionPoints;
  }