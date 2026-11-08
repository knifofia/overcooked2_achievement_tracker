const SALT = new TextEncoder().encode(
  "jjo+Ffqil5bdpo5VG82kLj8Ng1sK7L/rCqFTa39Zkom2/baqf5j9HMmsuCr0ipjYsPrsaNIOESWy7bDDGYWx1eA=="
);

const ACHIEVEMENTS = [
  { name: "Soaker Cola", desc: "Wash 150 dirty plates or glasses with the water gun", stat: "S_DLC02_ItemsWashedWithWaterGun", goal: 150 },
  { name: "Heat and Greet", desc: "Use the Bellows on BBQs 500 times", stat: "S_DLC02_BellowsUsedOnBBQCount", goal: 500 },
  { name: "Tree Hater", desc: "Burn 300 pieces of wood", stat: "S_DLC05_BurntWoodCount", goal: 300 },
  { name: "Backpack Hijack", desc: "Take 500 items from a backpack", stat: "S_DLC05_ItemsTakenFromBackpack", goal: 500 },
  { name: "Coal of Duty", desc: "Burn 300 buckets of coal in the furnace", stat: "S_DLC07_BurntCoalCount", goal: 300 },
  { name: "Heads Will Roll", desc: "Chop 500 ingredients using the guillotine", stat: "S_DLC07_GuillotineChopCount", goal: 500 },
];

async function sha1(bytes) {
  return new Uint8Array(await crypto.subtle.digest("SHA-1", bytes));
}

function concat(...arrays) {
  const out = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

// Equivalent of .NET PasswordDeriveBytes (2 iterations, 32 bytes)
async function deriveKey(steamId) {
  const enc = new TextEncoder();
  const last = await sha1(concat(enc.encode(steamId), SALT));
  let out = await sha1(last);
  for (let counter = 1; out.length < 32; counter++) {
    out = concat(out, await sha1(concat(enc.encode(String(counter)), last)));
  }
  return out.slice(0, 32);
}

async function decryptSave(buffer, steamId) {
  const data = new Uint8Array(buffer);
  if (data.length <= 20) throw new Error("File too small.");
  const iv = data.slice(0, 16);
  const body = data.slice(16, data.length - 4);
  const key = await crypto.subtle.importKey("raw", await deriveKey(steamId), "AES-CBC", false, ["decrypt"]);
  const invalid = new Error("Decryption failed: wrong SteamID64 or invalid file.");
  let plain;
  try {
    plain = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, body);
  } catch {
    throw invalid;
  }
  try {
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    throw invalid;
  }
}

function extractStats(save) {
  const stats = {};
  save.m_Keys.forEach((key, i) => {
    const m = /^(S_.+)_V_\d+$/.exec(key);
    if (m) stats[m[1]] = JSON.parse(save.m_Entries[i].m_JSON).m_Value;
  });
  return stats;
}

if (typeof module !== "undefined") module.exports = { decryptSave, extractStats, ACHIEVEMENTS };
