# Naruto Is Coming — Gameplay Playbook and Automation Priorities

**Target:** `https://naruto.id.vn` — server **S1 – Naruto**, Alpha Test build `26.11.21` (gameplay observations captured on build `26.11.19`)
**Snapshot:** 21 November 2026 (UTC+7)
**Live window:** Alpha 1–22 Nov 2026; Beta 23–30 Nov 2026; official launch 1 Dec 2026.
**Companion document:** [`api.md`](./api.md) — routes, request/response schemas, result codes, SQL procedure catalog.
**Scope:** how the game actually plays, what to do in what order, and where a future bot should stop.

> **Read this first.** This is a strategy and operations document, not permission to automate the game. Botting, macros, unauthorized clients, scraping, account sharing, and commercial exploitation can violate the game's Terms of Service and lead to warnings, rollbacks, suspension, or a permanent ban. The Alpha/Beta/test servers are wiped on the published schedule; do not build paid or irreversible workflows on test data. See §16.

---

## 1. The 60-second version

- **Genre:** 9-vs-9 idle/team RPG on a 3×3 grid, wrapped in a Naruto fan-game economy.
- **Core loop:** clear story stages → earn Gold/EXP/items → recruit and fuse ninjas → raise player level → unlock team slots → push story, Rank, Ultimate Trial, Training, and timed bosses → repeat.
- **Power comes from:** ninja star/level/ascension, **Super/Kage** fusion, elements and counters, gear + gems, **Potential**, **Senjutsu**, **Bonds**, and **Tailed Beasts**.
- **Two regenerating battle resources:**
  - **Energy** — story/PvE; refills at House 4 and on level-up.
  - **BP (Battle Point)** — PvP and some modes; max 10; refills at House 5 and on level-up.
- **Daily rhythm:** claim everything → spend Energy on story → spend BP on Rank/Plunder/Guild → do Ultimate/Training → hit the boss in its window → donate/fight for the guild → claim milestone rewards before reset.
- **Server time is UTC+7.** Daily reset 00:00; weekly mission/guild reset Monday 00:00; weekly login gift resets Sunday 00:00; monthly 1st 00:00.
- **The biggest early mistake:** selling duplicate 5★ ninjas. They are the raw material for **Super** and **Kage**.
- **The biggest bot mistake:** trusting `BattleResult.Id` as a win. Always verify with `/battle/9vs9/log` (`Win`) and re-read state.

---

## 2. Server clock and reset calendar

All times below are **server time (UTC+7)**. Convert to UTC by subtracting 7 hours.

| Cadence | Reset / window | What resets or happens |
|---|---|---|
| Daily | 00:00 | Daily missions, daily gift, shop purchase limits, Scratch free ticket, Diamond-spend milestones, Rank rewards, plunder ranking, boss sessions |
| Weekly | Monday 00:00 | Weekly missions and guild week |
| Monthly | 1st 00:00 | Monthly missions |
| Weekly gift | Sunday 00:00 to Saturday end; auto-claim at end of Saturday | 7-day login gifts; next cycle starts Sunday |
| Beast Boss | 12:00–13:00 and 19:00–21:00 daily | Free hits, 20 s cooldown, shared HP |
| World War | Register before 17:50; fights at 18:00 daily | Top-20 bracket, single elimination |
| Chakra Tree | Contributions close 21:00 on the last day; rewards mailed 23:50 | Server-wide contribution event |
| Recharge gifts | Mailed around 00:00–00:02 daily | Top-up ranking rewards |
| Legendary / Turnplate | 2 days on, 2 days off, alternating | Diamond events |
| Culture exchange | Saturday and Sunday | Weekend Legend exchange |
| Cat | 1 week on, 1 week off | Diamond investment event |

**Operational rule:** do not schedule a bot exactly at 00:00. Run the reset routine at **00:03–00:10** and finish the day’s final claims by **23:50**. This avoids boundary races and lets the server settle.

---

## 3. Core currencies and what they are for

| Currency | Cap / source | Primary use | Bot notes |
|---|---|---|---|
| **Gold** | No observed cap; story, plunder, House 5 idle, selling, events | Recruit ninjas, gear upgrades, gem fusion, Potential tries, ascension, guild donate, Chakra Tree | The main spendable currency. Do not hoard it while a cheap power upgrade is available. |
| **Diamond** | No observed cap; level gifts, daily gift, missions, Scratch, Keys, Ultimate rank, boss, events, top-up | Premium recruits, Energy/BP refills, element reroll, gear recast, Potential restore, rename, guild creation, event spins | Treat as scarce. Cap event spending per day. Never automate top-ups. |
| **Energy** | 104 at Lv1, **+4 per player level** (Lv6 cap = 124); refills on level-up; House 4 idle; Ramen/Sushi items | Story stages and PvE | Spend before it caps. Level-ups refill it, so push story when close to a level. |
| **BP** | Max 10; refills on level-up; House 5 idle; BP pills | Rank, Plunder, Guild Battle, Tails | Max 10 means PvP is a tempo resource, not a grind resource. |
| **Fame** | Beast Boss | Battle/Fame shop | Spend on the shop; do not let it sit idle. |
| **Ninja Soul** | Ascension, events, disassembly, gifts | Ascend 5★ ninjas | Save for the main carry; ascension failures still consume materials. |
| **Rainbow Pill** | Missions, events, exchange | Potential / Culture exchange | A key currency for Potential and weekend exchange. |
| **Chakra Pill** | Daily Rank Top 100 | Potential training | Rank is the main repeatable source. |

**Rule of thumb:** Gold is for breadth (levels, gear, recruits); Diamond is for tempo and breakpoints (energy/BP refills, key recruits, event guarantees). Never convert Diamond to Gold casually.

---

## 4. Onboarding: the first session

### 4.1 Account and character

1. Register at the global API (`/api/api/session/register`).
2. Log in (`/api/api/session/login`) and keep the returned token.
3. Call `/api1/api/session/select-server`:
   - `"0"` → no character yet.
   - numeric string → existing character id.
   - `"-1"` → session is not server-bound; see the token quirk in `api.md` §4.4.
4. If `"0"`, call `/api1/api/session/new-user` with a name and one starter template:
   - `21` Naruto Uzumaki (Wind, 4★)
   - `15` Sasuke Uchiha (Fire, 4★)
   - `22` Sakura Haruno (Lightning, 4★)
   - `69` Kakashi Hatake (Earth, 4★)
5. The observed starting state is **Lv1, 1,000 Diamond, 200,000 Gold, 104 Energy, 10 BP, 3 unlocked team slots, 1 starter ninja**.

> **Token quirk:** in the Alpha environment, a freshly issued login token often returned `{"result":"-1"}` on `select-server`, while the older server-bound token continued to work. Persist the token that can actually call `P4MainLoad`/`P2Info`; do not overwrite it with every new login. This is a client-side resilience requirement, not a game rule.

### 4.2 The tutorial, in order

The new-player tutorial is a fixed sequence (`P3NewbieStep` exposes each step with scene, coordinates, and text). The important beats:

1. Tap the **Recruit Hall** (House 1).
2. Summon a ninja for **1,000 Gold**.
3. Return home, open **Team**.
4. Put the newly summoned ninja into **slot 2**.
5. Continue the guided story/team setup until the tutorial releases control.

Do not skip the tutorial on a fresh account; it seeds the first ninja, team, and story state. If you are scripting a new account, model the tutorial as a state machine keyed by `P3NewbieStep.Step`, not as a fixed click sequence.

### 4.3 First-hour checklist

| Priority | Action | Why |
|---|---|---|
| 1 | Finish the tutorial | Unlocks the normal UI and first team |
| 2 | Claim level gifts as they unlock (`P3Gift` → `P1GiftClaim`) | First at Lv5: free 5★ egg and resources |
| 3 | Claim the daily login gift (`P3GiftDay` → `P1GiftDayClaim @Day = Today`) | Free Gold/items every day |
| 4 | Claim mail (`P1MailClaimAll`) | Launch mail and event rewards |
| 5 | Redeem **TUAN47** once (`P1Code`) | Confirmed active on 21/11/2026; one per account |
| 6 | Do the free daily **Scratch** (`P1Scratch`) | Free Diamond chance |
| 7 | Push story until the first wall | Levels, Gold, team slots, gear |
| 8 | Fill all three open team slots | `NoNinja` blocks battles otherwise |
| 9 | Join a guild if possible | Guild boss, donations, chat, battle rewards |
| 10 | Do not sell duplicate 5★ ninjas | Save them for Super/Kage |

**Gift codes:** `TANTHU`, `TUAN45`, `TUAN46`, `TUAN47` are the codes observed in official news. `TUAN47` was confirmed working on 21/11/2026. Codes are case-insensitive, one redemption per account, and have expiry windows. Older codes may be expired. Redeem through `P1Code @Code = '...'`; result `0` = invalid/expired, `1` = success, `2` = already used.

### 4.4 What to do with the first 1,000 Diamond

A sensible free-to-play opening:

- **Do not** spin Turnplate or chase the Legendary leaderboard.
- **Do not** create a guild (3,000 Diamond).
- **Consider** one or two Energy/BP refills only if they unlock a story breakpoint or a timed event.
- **Save** the rest for a 10-pull on the Legendary event if it is open, or for 5★ fodder/gear when it accelerates your main team.
- **Never** spend Diamond on cosmetic rerolls or rename before you have a stable team.

---

## 5. Progression systems, in upgrade order

### 5.1 Player level

- Player level unlocks **team slots**, raises **Energy cap**, and gates story/training/features.
- Level gifts arrive every 5 levels: **5, 10, 15, … 120**.
- Level-up refills Energy and BP. Plan a story push when you are close to a level.
- The player level cap is **120**.
- **Priority:** player level is the master key. If you can level, do it before horizontal sidegrades.

### 5.2 Team slots

| Slot | Unlock level |
|---|---|
| 1 | 1 |
| 2 | 1 |
| 3 | 1 |
| 4 | 10 |
| 5 | 20 |
| 6 | 30 |
| 7 | 45 |
| 8 | 60 |
| 9 | 75 |
| 10 | 90 |

Nine ninjas fight on the 3×3 grid. The **10th slot is a reserve** that only counts for **Bonds**; it does not fight. More slots mean more Bond options and more combat power.

**Live nuance:** `P3Team.UnlockedSlots` was observed as **4 at Lv20** and **5 at Lv21**, even though the documented table says slot 5 unlocks at Lv20. Treat the table as design intent and the server field as authoritative; re-read `UnlockedSlots` after each level rather than assuming the unlock level.

### 5.3 Ninja stars, level, and ascension

- **Stars:** 1–5. Higher stars mean better stats, growth, and skills. 5★ is the base for Super/Kage.
- **Level:** 1–60, capped by player level. Feed other ninjas as fuel.
- **Ascension (Chuyển sinh):** at Lv60 on a 5★ ninja, spend **Ninja Soul + Gold** to increase the ascension rank; the ninja returns to Lv1 with higher stats. Max ascension observed: **8**.
  - Success raises the rank immediately.
  - Failure loses only the materials.
  - Do this on your **main carry**, not on a bench ninja.

### 5.4 Elements and the counter wheel

The wheel:

```text
Fire → Wind → Lightning → Earth → Water → Fire
```

| Tier | When countering | When countered |
|---|---|---|
| Normal | +15% Atk/Def | −15% |
| Super | +25% Atk/Def | only −5% |
| Kage | +30% Atk/Def; non-Kage enemies also −15% | immune; cannot be countered |

A countering attacker also **heals and deals extra damage**. Counters trigger only on an active **normal attack**; a ninja that is attacked by an element it counters does **not** retaliate.

**Practical rules:**

- Build around one or two elements so your Tailed Beast support and gear gems line up.
- Against a known opponent, bring the element that counters theirs.
- **Kage** counters every Normal and Super enemy regardless of element, but **cannot counter another Kage**.
- **Kage** is the long-term goal: it removes the counter risk and adds a large stat bump.
- Element reroll costs **100 Diamond** and gives a random different element; stats do not change. Only do it when the element blocks a team plan.

### 5.5 Super and Kage fusion

Only **5★** ninjas can be fused. The main ninja should have the highest level/ascension, because materials cannot exceed it.

| Target | Requirement |
|---|---|
| **Super** | 3 identical 5★ ninjas: 1 main + 2 materials, any elements |
| **Kage** (from Super) | 2 identical Super ninjas: 1 main + 1 Super material, any elements |
| **Kage** (from Normal) | 5 identical 5★ ninjas: 1 main + 4 materials, covering all 5 elements |

Materials are consumed. They must be 5★, the same character, not in the team, and not higher level/ascension than the main.

**Priority:** pick one carry, get it to **Super** first, then **Kage**. A single Kage carry is worth more than a wide bench of normal 5★ ninjas. Never sell duplicates of your carry's character.

### 5.6 Gear and gems

- Each ninja has **2 gear slots**: one **Atk** weapon and one **Def** armor.
- Gear levels up by feeding other gear; max level is the lower of **120** and your player level. After Lv60, upgrades consume more fuel.
- Gems: **Red = Atk**, **Blue = Def**, **Yellow = skill power** (up to +50%).
- Each gear has **0–4 sockets**, each with a color. A socket only accepts a matching-color gem. Filling all sockets activates a hidden bonus line.
- **Fuse** 2 same-color, same-level gems into 1 higher-level gem for **10,000 Gold**. The success rate is shown first; failure loses both gems and the Gold.
- **Recast** a gear's socket colors for **100 Diamond**; the gear must have no gems inlaid. Recast until the colors match your gem stock.

**Priority:**

1. Put the best Atk gear on your main damage dealer and the best Def gear on your tank.
2. Match gem colors to sockets; do not fuse away the only copies you need.
3. Recast only on gear you will keep for a long time.
4. Do not spread gems across the whole bench; concentrate on the nine fighters.

### 5.7 Potential training

- Spend **1 Chakra Pill + 1,000 Gold** per try.
- Success gives **+1** permanent Atk or Def to that ninja.
- Every **1,000 points** of potential, success rate drops **10%**, down to a minimum of **10%**.
- **Restore** returns all points as Pills for **1,000 Diamond**.
- Chakra Pills come mainly from the **daily Rank Top 100** reward.

**Priority:** dump Potential into the main carry's damage stat, or into the main tank's Def if the carry dies too early. Do not spread it across ten ninjas. Restore only when you are re-speccing, because 1,000 Diamond is expensive.

### 5.8 Senjutsu (Sage Mode)

- Collect **Sage materials** in **Training** mode.
- Each Senjutsu level gives the ninja **+2% Atk and HP**, and every other ninja in the team **+1% Atk and HP**.
- Max **Lv5**; higher levels need more materials.
- Counts separately from **Bonds**.

**Priority:** Senjutsu is one of the best team-wide multipliers in the game. Put materials into the carry first, then the second carry. Do not ignore it because it is not flashy.

### 5.9 Bonds (Kích duyên)

- Certain ninja have bonds with other ninja, weapons, or Tailed Beasts.
- Arranging the right combination grants **% Atk/Def** or **skill power**.
- The 10th team slot exists specifically to satisfy bond conditions without fighting.
- Check each ninja's bond panel; do not break a strong bond just to raise a single raw-stat number.

**Priority:** after your core nine are set, use the reserve slot and gear choices to activate 2–4 strong bonds on your carry.

### 5.10 Tailed Beasts

- There are **10** beasts; you can equip up to **5**.
- Each beast is assembled from **3–6 numbered chips**. Steal chips in battle, then merge and upgrade.
- Chips must be held long enough to merge (the guide describes a **1-hour** hold); if another player steals a chip, you must hunt it again.
- Beast levels go to **10**; higher levels increase the chance the beast's support triggers.
- Unlock chain: Beast 1 at player **Lv5**; later beasts require the previous beast at **Lv5**.

| Beast | Element / role | Effect |
|---|---|---|
| 1 Shukaku | Earth | +Ninjutsu power for Earth ninjas, up to 50% |
| 2 Matatabi | Lightning | +Ninjutsu power for Lightning ninjas, up to 50% |
| 3 Isobu | Water | +Ninjutsu power for Water ninjas, up to 50% |
| 4 Son Goku | Fire | +Ninjutsu power for Fire ninjas, up to 50% |
| 5 Kokuo | Wind | +Ninjutsu power for Wind ninjas, up to 50% |
| 6 Saiken | Debuff | −enemy Atk, up to 20% |
| 7 Chomei | Debuff | −enemy skill chance, up to 10% |
| 8 Gyuki | Defense | +own Def, up to 20% |
| 9 Kurama | Attack | +own Atk, up to 20% |
| 10 Jubi | Skill | +skill chance for all beasts, up to 50% |

**Priority:** match the first five beasts to your main element, then add Kurama/Gyuki for raw stats, then Saiken/Chomei for difficult PvE walls. Do not chase all ten early; the chip and level investment is huge.

### 5.11 Chakra Tree

- Requires **Lv20**.
- Contribute **Gold** (max **1,000,000/day**), **Diamond** (1 Diamond = 1,000 points), or a **5★ ninja** (100,000 points).
- The tree grows with the **whole server's** points; higher tree level means more **Chakra Fruit**.
- Top individuals and top guilds receive Fruit; rewards are mailed at **23:50** on the last day; contributions close at **21:00**.
- Fruit and points are exchanged in the Chakra Tree shop.
- The sacrificed ninja must be 5★, not in the team, not reincarnated, not Super/Kage, and below Lv60.

**Priority:** a cheap daily Gold contribution is worth it for participation; do not sacrifice 5★ ninjas unless you have excess fodder and the event rewards justify it. This is a server-cooperative event, so a bot should not monopolize it.

---

## 6. Combat model

### 6.1 The 9-vs-9 battle

- Both teams place up to **9 ninjas** on a **3×3 grid**.
- Cells are numbered **1–9 from bottom to top**; row **1-2-3** acts first.
- Drag between cells to swap; drag to the list below to rest (no battle).
- Normal attacks and Ninjutsu alternate. Up to **2 skills** per ninja; skill grade **D–S** affects trigger chance.
- The battle ends when one side has **no ninja left**.
- **If both sides are still standing after the last round, the attacker loses.** This is critical for slow/stall teams.
- **Atk** is damage dealt; **Def** is HP and healing. A glass cannon needs Def gear/support to survive, and a pure tank needs Atk to close fights.
- Build separate attack and defense formations; the game gives you three saved teams (A/B/C).

### 6.2 Positioning

- Put your **strongest damage dealers** in the front row (cells 1–3) because that row acts first.
- Put tanks/high-Def ninjas where they will absorb the first enemy skills.
- Put fragile supports and revive/lifesteal units in the back.
- Use the 10th slot for Bonds, not for a fighter.
- Save **three formations (A/B/C)** so you can switch between attack, defense, and event teams without rebuilding.

### 6.3 Skill archetypes

| Archetype | Use |
|---|---|
| Lifesteal | Sustain through long PvE fights |
| Atk/Def down | Break enemy carries and tanks |
| Atk/Def up | Buff your carry before its skill |
| Revive | Clutch in Ultimate Trial and boss fights |
| Skill resistance | Counter skill-heavy opponents |
| Death trigger | Trade value when a ninja dies |

A carry with **2 offensive skills** and a support with **revive/lifesteal** is a strong core. Do not judge a ninja by star alone; skill grade and trigger chance matter.

### 6.4 Formation templates

These are role templates, not fixed rosters. Adapt them to the ninjas you own and the enemy you face.

| Template | Front row (1–3) | Middle (4–6) | Back (7–9) | Use |
|---|---|---|---|---|
| **Standard** | 2 tanks + 1 bruiser | 3 damage dealers | 2 supports + 1 flex | Story, Rank, general PvP |
| **Boss burn** | 1 tank + 2 bruisers | 3 highest single-target damage | 3 buffers / lifesteal | Beast Boss, Guild Boss |
| **Defense** | 3 tanks | 2 tanks + 1 support | 2 supports + 1 revive | Defense formation, guild defense |
| **Ultimate sustain** | 2 tanks | 3 lifesteal/bruisers | 3 revive/support | Ultimate Trial deep stages |
| **Element counter** | 3 of the countering element | 3 countering damage | 3 supports | PvP against a known element |

**Rules for all templates:**

- The front row acts first; do not put a fragile support there.
- A tank without gear/gems is not a tank; give it Def gear and blue gems.
- A damage dealer without accuracy/skill support may lose to revive/stall teams; bring a yellow-gem skill unit.
- If both teams survive to the last round, the attacker loses; add damage, not just sustain, when attacking.

### 6.5 Win verification

`/battle`, `/battle/rank`, `/battle/plunder`, `/battle/guild`, and `/battle/tails` return a `BattleResult` with an `Id`. **A non-null `Id` does not mean you won.** Always call:

```json
POST /api1/api/battle/9vs9/log
{"id": 38226}
```

and read `Win`. The log also gives `CreatedAt`, `MeTeam`, and the full `BattleLog`.

This is the single most important correctness rule for any bot: **verify, do not assume.**

---

## 7. PvE content

### 7.1 Story / Plot (Phó bản)

- **335 stages**, **67 chapters**, **6 task groups**.
- Boss stages appear at the end of each chapter (observed as StageNo 5); boss counts by task were 6, 10, 8, 12, 15, 16.
- Costs **Energy**; gives **EXP, Gold, items**, and sometimes ninjas.
- A stage is **Locked** until the previous one is cleared. `P2StageProgress.Scid` is the current stage; `MaxScid` is an internal high-water mark, not the stage count.
- You can farm an already-cleared stage for Gold/EXP, but it will not advance progress.
- A loss can still return a battle `Id`; check the log.

**Story priority:**

1. Push until you hit a wall (level, power, or `Locked`).
2. Farm the highest stage you can **win consistently** for Gold/EXP.
3. Do not waste Energy on a stage you lose repeatedly; upgrade first.
4. Use story level-ups to refill Energy and BP.

**EXP efficiency (observed):** repeat clears do **not** pay the full catalog `Exp`. The catalog value appears to include a first-clear bonus. Measured on `DocProbe` at Lv22–23:

| Stage | Energy | Catalog EXP | Repeat EXP | EXP/Energy |
|---|---|---|---|---|
| 4 (Ch.1-4) | 10 | 208 | **166** | **16.6** |
| 149 (Ch.30-4) | 21 | 84 | **54** | 2.6 |

Farming an early 4th stage was ~6× more Energy-efficient for player leveling than the current wall stage, at the cost of much lower Gold per battle (1,500 vs 3,150). Use early-stage farming when the goal is a level breakpoint (slot unlock, gift tier), and farm the wall stage when the goal is Gold.

**Quirk:** the `/battle` response can report `"ExpGained":0` even when the player gains EXP. Verify level/EXP with `P4MainLoad` before and after, not with the battle response field.

### 7.2 Training caves

Three caves rotate by server day:

| Cave | Name | Open days | No penalty for |
|---|---|---|---|
| 1 | Mount Myoboku (Động Cóc) | Mon, Thu, Sun (`1,4,0`) | Earth or Fire |
| 2 | Ryuchi Cave (Động Rắn) | Tue, Fri, Sun (`2,5,0`) | Lightning or Wind |
| 3 | Shikkotsu Forest (Động Ốc Sên) | Wed, Sat, Sun (`3,6,0`) | Water or Kage |

- **3 runs per mode**, **6 runs total/day** (Attack + Defense).
- Wrong-element ninjas lose power: **−50%** normal, **−30%** Super, **−10%** Kage.
- Wins give **Gold + rare cave materials** (items 55/56/57).
- Error mapping: `Closed` = cave not open today; `LowLevel` = player below requirement; `NoRun` = daily runs exhausted.

**Live gate observation (Saturday 21/11/2026):** cave 3 was the open cave (`IsOpen:1`), caves 1/2 returned `Closed`. Cave 3 still returned `Result:4, Error:"LowLevel"` at **Lv10, 19, 20, 21 and 23**, with team power up to **4,569**, for every tested `tier` (0–50) and `stageNo` (0–2). `P3TrainStageList @Cave = 3` returned `[]` in that state, and omitting `@Cave` also returns `[]` (the parameter is required). The gate is therefore **not** team power or `tier`; it is most likely a player-level or ninja-level requirement that was still above Lv23. Do not burn attempts guessing `tier` values.

**Priority:** run the open cave with a matching-element team every day. Cave materials feed Senjutsu and other upgrades, so this is not optional long-term.

### 7.3 Ultimate Trial (Thử Thách Tối Thượng)

- Climb to **stage 200**.
- **Attack** (mode 1) and **Defense** (mode 2) have separate progress, stars, and `InRun` state; switch freely.
- **4 runs/day per mode** (design value; live `RunsLeft` was **2** on both modes and is authoritative).
- Losing, or clearing stage 200, sends that mode back to **stage 1**; the best stage still counts for ranking.
- Every **3 stages** a buff becomes pending; every **5 stages** a reward becomes pending.
- Daily ranking by best stage pays **Gold, Diamond, and items**.

**Verified chain mechanics:**

1. Call `/battle/ultimate` with `{mode, stageNo, star}`; `star` must be **≥1** (`0` → `BadParam`).
2. `Result:1` only means the stage request was accepted. Read `/battle/9vs9/log` and require `Win:true`. A loss still consumes the request and can return `Result:1`.
3. On a win, `StageNo` advances and `Gold` is credited immediately (observed 35, 40, 50, 55, 60 for stages 1–6). Player **EXP does not change**; Ultimate is a Gold/ranking mode, not a leveling mode.
4. `StarMax` grows as **3 × StageNo** (3 after stage 1, 15 after stage 5). `StarEarned` is cumulative; `Star` is the spendable balance.
5. The `star` parameter is a wager/difficulty multiplier: `star:2` added 2 to `StarEarned` and paid more Gold.
6. At stages divisible by 3, `PendingBuff:1` and the next battle returns `Result:3, Error:"Pending"`. Call `P1UltimateBuyBuff @Mode = <mode>`; it returns `1` when a buff was pending and `3` when none was. Adding `@BuffId` is **not** accepted. No visible Star deduction or stat change was observed — verify the effect in the battle log rather than trusting `Buff*` totals.
7. At stages divisible by 5, `PendingReward:1` blocks the next battle. Call `P2UltimateClaim @Mode = <mode>`: before the milestone it returns `{Result:0,...}`; at stage 5 it returned `{Result:1, Item:10, Qty:1, Name:"Gold bag", StageNo:5}`.
8. `RunsLeft` is **not** a per-stage counter. Mode 1 went `2 → 1` on its first battle and stayed `1` after the next stage win; mode 2 stayed at `2` across five consecutive wins, later read `1`, and stayed `1` after a sixth-stage win. Treat it as consumed at chain/run boundaries; re-read `P4UltimateStatus` after every battle and stop at `0` or on `NoRun`.
9. `InRun:1` marks an active chain; `NextStage` is the next stage. Mode 1 and mode 2 keep independent `StageNo`, `Star`, and rank state.

**Buff strategy:**

- Buffs exist for your Atk/Def/skill and for lowering the enemy's Atk/Def/skill.
- Each buff type has a stacking cap. Spread Stars across categories instead of dumping everything into one.
- Before a hard stage, inspect the enemy's Atk/Def and buy the counter that matters.
- Matching Tailed Beasts: element support for your carry, or Saiken/Chomei against scary enemy skills.

**Priority:** use all runs if you can win at least one stage; the ranking rewards are a major Diamond source. Clear pending buffs/rewards promptly so the next run is not blocked.

### 7.4 Beast Boss (Vĩ Thú Tập Kích)

- One shared server boss per session.
- **12:00–13:00** and **19:00–21:00** daily.
- **Free** — no Energy or Gold; **20-second cooldown** between hits.
- A hit deals roughly **1–2%** of the boss's HP; the boss is flagged **Attack** or **Defense**, so use the matching formation.
- Every hit gives **Fame**; the **final blow** gives a huge Fame bonus + a gift box by mail; **Top 10 damage** gets Fame + gifts after the session.
- The in-game notice lists **Noon Beast: Gyuki** and **Night Beast: Kurama**; the observed 21/11 weekend-noon session was Gyuki at 150,000,000 HP. Weekday sessions rotate, so read `P2BossInfo` for `BeastName`, `HP`, `BeastAtkOrDef`, and the window before each session.
- The shared boss can be **killed before the window ends**. Once `Defeated:1` / `HP:0`, further hits return `Result:5, Error:"Defeated"`; stop and wait for the next session.

**Priority:** this is one of the best free activities in the game. Hit at the start of the window, respect the 20 s cooldown, and use your strongest matching formation. Do not automate past the cooldown; the server will reject or waste attempts.

### 7.5 Guild Boss

- Requires a guild.
- Has its own HP, hit limit, cooldown, damage rank, and kill rewards.
- Hits give **guild EXP** and **contribution**; the kill gives guild-wide rewards.
- Without a guild, `/battle/guildboss` returns `Result:4, Error:"NoGuild"`.

**Observed at guild Lv1:** boss **Shukaku** (`BeastNinja:1001`), **3,000,000 HP**, **5 hits/day per member**, **30 s cooldown**, **20 guild EXP + 20 contribution per hit**, **200 EXP on kill**. Kill reward string `Gold chest|1;Ninja Soul|3`; rank-1 reward `Ninja Soul|10`. `SecondsToReset` counts down to the 00:00 UTC+7 reset.

- A hit returns `{Result:1, Id, HitsLeft, Dame, HP, MaxHP, GuildExp, Contribution, Killed}`. At 4,569 team power the observed damage was **4,020** and **4,106** on two hits, so expect roughly 0.13% of the boss HP per hit at that power — guild boss is a long-term guild effort, not a solo kill.
- **`/battle/9vs9/log` reports `Win:false` for guild-boss hits. That is normal.** Guild boss is a damage exchange, not a win/loss battle; verify `Dame`, `HitsLeft`, and `HP`, not `Win`.
- An immediate second hit returns `Result:2, Error:"Cooldown", CooldownRemain:<seconds>`, and `HitsLeft` does **not** decrement. Wait out the cooldown.
- `HitsUsed` is per viewer; `HP` is shared by the whole guild. `P3GuildBossRank` rows (`RankNo,UserId,Name,Lv,Dame,Hits,IsMe`) update after each hit.
- `P2GuildBossInfo` exposes `MyRank`, `Dame` (your total), `ExpPerHit`, `ContribPerHit`, `ExpKill`, `KillReward`, and `Rank1Reward`.

**Priority:** join an active guild early. Guild boss is repeatable progression and contribution; a solo player loses a large passive income stream. Hit at the start of the day, then again after each 30 s cooldown until the 5 hits are gone.

---

## 8. PvP content

### 8.1 Rank Battle (Đấu Rank)

- Challenge a player ranked **above** you.
- **Win = swap ranks**; loss changes nothing.
- Costs **1 BP**.
- At daily reset, **Top 100** receive **Chakra Pills** by rank:

| Rank | Pills |
|---|---|
| 1 | 50 |
| 2 | 45 |
| 3 | 40 |
| 4–5 | 35 |
| 6–10 | 30 |
| 11–20 | 20 |
| 21–50 | 15 |
| 51–100 | 10 |

- `NoTarget` = rank not found; `NoBP` = out of Battle Points.
- Read `P2RankList` (nearby ranks), `P2RankTop20`, and `P3UltimateRank`.

**Priority:** climb to the highest rank you can **hold** before reset. The Pill income compounds into Potential, which compounds into combat power. Do not burn all BP on unwinnable fights; scout the target's team first.

**Bot policy:** never attack a target whose combat power is **not strictly lower** than ours. Measure it with `P3TeamVisit @TargetUserId` (sum `TotalAtk + TotalDef` of filled slots) and compare with `P3TeamPower.Power`. If power cannot be read, skip the target instead of gambling. This keeps BP spend on fights we should win.

### 8.2 Plunder (Cướp vàng)

- Pick a target from the list (Gold close to yours) and fight.
- Costs **1 BP**.
- **Win:** steal up to **20,000 Gold** per battle, never more than the target owns.
- **Lose:** you lose nothing; the target keeps their Gold.
- **Max 60,000 Gold/day from the same target.**
- The daily ranking shows who stole the most Gold; it resets daily.

Observed: `NoGold` can appear even when the target profile shows Gold; this is a protection/stealable-Gold rule, not necessarily a zero balance. Pick another target instead of retrying.

**Priority:** plunder is a Gold faucet, but it is also the most socially visible PvP action. Attack only eligible targets, respect the daily cap, and do not harass the same player.

**Bot policy:** same power rule as Rank — only targets with strictly lower combat power, scouted via `P3TeamVisit`; skip unknown-power and stronger targets. On `NoGold`, move to the next target instead of retrying the same one.

### 8.3 Guild Battle (Bang hội Chiến)

- Fight members of rival guilds.
- Costs **1 BP**.
- **Win:** your guild +1 point, enemy −1.
- **Lose:** your guild −1, enemy +1 (never below 0).
- **Max 3 battles/day against the same player.**
- Daily guild ranking; members who **donated today** in a guild that **fought today** receive mail rewards:

| Guild rank | Reward |
|---|---|
| Top 1 | 3 Gold Chest + 10 Ninja Soul |
| Top 2–3 | 2 Gold Chest + 6 Ninja Soul |
| Top 4–10 | 1 Gold Chest + 3 Ninja Soul |

**Priority:** donate and fight every day if you are in an active guild. The reward requires both conditions; a passive member gets nothing.

### 8.4 World War (Liên Server)

- Cross-server single-elimination bracket.
- **Only Top 20 Rank** players may register (`WorldWarMaxRank: 20`).
- Registration locks at **17:50**; battles at **18:00** daily.
- Win and advance; lose and you are eliminated.
- Top 1 reward: **one Ten-Tails Beast chip**.
- Outside the Top 20, `/worldwar/register` returns `{"result":"6"}`.
- Companion reads: `P3WorldWarTeam`, `P4WorldWarStatus` (the latter returned `500` in testing; treat it as unstable).

**Priority:** only relevant for top accounts. Do not build a bot dependency on World War; the eligibility gate and bracket timing make it high-variance.

### 8.5 Guild operations

**Create and join (verified live):**

- **Create:** `P1GuildCreate @Name = N'...'` costs **3,000 Diamond** (`GuildCreateCost`). Only `@Name` is accepted; extra parameters return HTTP 500. Success returns `{Result:1, GuildId, NewDiamond}`. With 2,705 Diamond it returned `Result:3`; with 3,005 it created GuildId 7 and left 5 Diamond.
- **Join:** browse `P3GuildList` / `P3GuildRankList`, then `P1GuildRequestJoin @GuildId`. The request is **pending** until a leader/deputy approves; `P2MyGuildInfo` stays `GuildId:null` while pending.
- **Outgoing request list:** `P3GuildRequestList` shows your requests, including a rejected one with `IsReject:1` and `RejectAt` (e.g. `2026-11-21T14:06:30`). `P1GuildRequestCancel @GuildId` clears it.
- **Leader pending flag:** `P1GuildRequestPending` returns scalar `"1"` for a leader with a pending request, `"0"` otherwise; it is not a list.
- **Approve/reject:** `P1GuildAcceptMember @TargetUserId` and `P1GuildRejectRequest @TargetUserId` both return `{Result:1}`. After a rejection, an immediate `P1GuildRequestJoin` returned `Result:0`, but the leader could still `P1GuildAcceptMember` successfully — the rejected row remains actionable. Do not assume `Result:0` on re-request means the player is permanently blocked.
- **Kick/leave:** `P1GuildKickMember @TargetUserId` and `P1GuildLeave` both return `{Result:1}` and reset the member to `GuildId:null`. Rejoining resets contribution to 0.
- **Roles:** `P1GuildSetRole @TargetUserId, @Role` (omitting `@Role` → HTTP 500). Values: **2 leader, 1 deputy, 0 member**. `P1GuildTransferLeader @TargetUserId` works both directions and swaps `IsLeader`/`Role` immediately.
- **Rename:** `P1GuildRename @Name = N'...'` costs **1,000 Diamond** (`GuildRenameCost`); with 5 Diamond it returned `Result:3`.
- **Delete:** `P1GuildDelete` exists but is destructive; a bot should never call it.
- **Member cap:** `MaxMember:20`, `MaxDeputy:1` at guild Lv1; `ExpNext:1000`. Leveling raises the cap (observed Lv4 guild with 26 members).

**Donations (`/api1/api/guild/donate`, `type` 1–3):**

| Type | Cost | Guild EXP | Contribution | Daily limit |
|---|---|---|---|---|
| 1 | 50,000 Gold | 10 | 10 | 3 |
| 2 | 50 Diamond | 50 | 60 | 1 |
| 3 | 200 Diamond | 220 | 250 | 1 |

`guild/info` exposes `D1Left`/`D2Left`/`D3Left`, which decrement per donation. A type-1 donation returned `{Result:1, Lv:1, Exp:30, ExpNext:1000, GoldSpent:50000, GuildExp:10, Contribution:10}`. Type 2 returned `{Result:1, Exp:130, DiamondSpent:50, GuildExp:50, Contribution:60}`; type 3 returned `{Result:1, Exp:350, DiamondSpent:200, GuildExp:220, Contribution:250}`. Without a guild, `Result:0`.

**Emblems:**

- `guild/emblems` returns 212 entries: 80 `State:1` (owned) and 132 `State:2` (locked). Locked prices observed: **200, 500, 1,000 Diamond**, with guild-level gates at **3, 6, 9** (`UnlockLv`). At guild Lv1 **no** `State:2` emblem is purchasable, even with enough Diamond.
- `guild/emblem/set` with an owned emblem (e.g. `ninja:1`) returns `{Result:1, Ninja, Img, Price}`; a locked emblem returns `{Result:0}`.
- `guild/emblem/buy` codes: `3` = insufficient Diamond; `4` = not purchasable — guild level below the emblem's `UnlockLv`, or already owned (observed for every locked emblem at guild Lv1 with 330 Diamond, and for owned `ninja:1`). `1` = success (requires guild Lv3+; not observed).
- The guild emblem is cosmetic; buy only after functional needs are covered and the guild has leveled.

**Guild battle:**

- `P3GuildBattleList` returns only your own guild row (`GuildId,GuildName,GuildScore,GuildRank,EmblemImg`) outside an active guild-battle window; `GuildRank` was `null`. `/battle/guild` with an unrelated target returned `NoTarget`.
- Donate and fight on the same day to qualify for the daily mail reward; see §8.3.

**Management is manual-only for a bot.** Accept/reject/kick/role/transfer/rename/delete are social actions with irreversible consequences; require explicit human approval and a confirmation step.

---

## 9. Events and limited-time systems

### 9.1 Legendary Ninja

- Runs **2 days on, 2 days off**, alternating with Turnplate.
- Draw **Ninja Eggs, Weapons, and Armor** with Diamond; **350 Diamond per draw**.
- Every draw gives **+10 Score**.
- Every **10th draw** guarantees a **5★ egg + a free Diamond draw**.
- Reach **1,000 Score** and rank **#1** to claim the cycle's **Legendary Ninja**.
- Top rewards are visible in the event's **Top Prize** panel.

**Reality check:** 1,000 Score = **100 draws** = **35,000 Diamond** before free draws/competition. This is a whale race. A normal bot should either skip it or do a single 10-pull for the guaranteed 5★ egg, not chase rank 1.

### 9.2 Turnplate

- Runs **2 days on, 2 days off**, alternating with Legendary.
- **350 Diamond** per spin; **3,500** for 10.
- Every spin feeds the **Grand Prize**; landing on it wins the accumulated Diamond.
- The top spinner receives the cycle's **Legend Equip**.
- High variance and Diamond-hungry. Skip unless you are specifically competing for the top spot.

### 9.3 Culture Cultivation (weekend exchange)

- Opens **Saturday and Sunday**.
- Trade **Rainbow Pill**, **Diamond material**, and **Gold Chest** for **Legend Ninjas and Equipment**.
- Each gift can be claimed **once per round**.
- Check `P2CultureStatus` for `EventOpen`, `Round`, `RemainSeconds`, and owned materials.

**Priority:** if you have surplus materials, this is one of the few deterministic Legend sources. Do not sacrifice resources you need for Potential or ascension.

### 9.4 Cat (Mèo chiêu tài)

- Invest Diamond and win back **110%–130%** if successful; you can lose the investment.
- **7 tiers**, from **500** to **15,000 Diamond**; win repeatedly to climb.
- Opens **1 week, rests 1 week**.
- Current snapshot: `CatTo` 15/11/2026, `CatOpen:0` — closed on 21/11.

**Priority:** treat it as a gamble, not an investment. Only play with surplus Diamond you can afford to lose.

### 9.5 Recharge, first recharge, and recharge gifts

- **First recharge:** total **2,000 Diamond / 20,000 VND** unlocks a one-time choice of **Jiraiya (111), Orochimaru (113), or Tsunade (114)**, all 5★, plus a 5★ weapon egg and 5★ armor egg. Claim once per account.
- **Recharge gifts:** daily top-up ranking. You receive the **best tier you qualify for**, requiring both rank and minimum recharge. Gifts are mailed around **00:00–00:02**; outside Top 50, no gift.
- **VIP:** each top-up adds VIP EXP. Higher VIP gives more daily Energy food/BP pills, beast upgrade time reduction, VIP shop access, and **Fast Battle at VIP 4**.

**Bot rule:** **never automate payments, top-up approval, or refund logic.** These are manual, real-money actions. A bot may read `first-recharge/info` and `recharge-gift/info` for state, but must not call `P1Pay`/`P1PayInternational`.

### 9.6 Diamond spending milestones

- Every Diamond spent today counts.
- Milestones start at **300 Diamond**; each reached milestone gives **3 gifts**.
- Observed ladder: **300, 1,000, 3,000, 6,000, 10,000, 20,000, 30,000, 50,000**. After claiming 300/1,000/3,000 at `TodaySpent:3000`, `NextMilestone` advanced to **6,000**.
- Claim manually before day end; unclaimed gifts are mailed at day end.
- Progress resets daily.
- Read `P4DiamondSpending` for `TodaySpent`, `NextMilestone`, `Remaining`, `SecondsLeft`.
- Claim with `P1DiamondSpendingClaim @Milestone = <amount>` (e.g. `300`, not a tab index). Observed results: `1` success, `3` not reached, `4` already claimed, `0` invalid amount. Claims return only `{Result:1}`; rewards are delivered as gifts/items rather than immediate currency fields.

**Priority:** if you are already spending Diamond for a real goal, claim the milestones. Do not spend extra just to reach a milestone unless the gifts are worth more than the spend.

### 9.7 Daily and weekly gifts

- **Daily gift:** 7-day login calendar. Each day unlocks a gift box; claim it. Missed days can be made up with Diamond (config `GiftDayMakeupCost: 100`; the row's `Diamond` field mirrors your balance, not the price). The system auto-claims remaining gifts at the end of **Saturday**; resets **Sunday**.
- **Level gifts:** unlock at every 5 levels to 120; each milestone can be claimed once. Big milestones contain 5★ and Legend rewards.
- **Gift day claim:** use `P1GiftDayClaim @Day = Today` (the `Today` field from `P3GiftDay`), not `@Day = 1`. Claiming a locked day returns `Result:0`.
- **Level gift claim:** `P1GiftClaim @Tier = N`; claim only `Unlocked:1, Claimed:0`.
- **Observed tier contents:** tier 1 (Lv5) = 1× item 49 + Sushi ×3 + Gold bag ×5; tier 2 (Lv10) = 1× item 49 + 3–5★ ninja egg + item 8 ×2; tier 3 (Lv15) = 2× item 49 + 4★ gear egg + Sushi ×3; tier 4 (Lv20) = 2× item 49 + 4★ gear egg + item 54 ×3; **tier 5 (Lv25) = 3× item 49 (300 Diamond) + 5★ ninja egg + item 11 ×2**. Tier 5 is the cheapest observed route from 2,705 to the 3,000-Diamond guild-create threshold.
- **Day-7 gift:** the completed week's day 7 was claimable and gave a **5★ ninja egg**; after the claim the row showed `Unlocked:0, Claimed:0` for the finished week.

### 9.8 Scratch, Keys, and Codes

**Scratch (Cào 9 ô):**

- **1 free scratch/day**, then **20 Diamond** per scratch.
- Flip cards; **3 matching ninja** wins the Diamond shown.
- No match = nothing.
- Read `P2Scratch` for `FreeAvailable` and `Diamond` (the current Diamond balance).
- `P1Scratch` returns the revealed card and the result. `Result:1` only means the scratch ran; check `WinTier`/`WinDiamond` for an actual win.

**Keys:**

- Three types: **Bronze**, **Silver**, **Gold**, each with its own treasure pool.
- Key rewards include Ramen, BP, Gold, Diamonds, higher keys, ninja eggs, gear, and Ninja Souls.
- A **Bronze Key** costs **50,000 Gold** in the shop (`P2BuyItemQty @Buy = 30`); one observed open gave **Ramen ×2**. The pool is random, so treat this as a sample, not an expected yield.
- Open only when you have keys; `reward/key-open` returns `Result:2` with zero keys.
- Read `P2KeyStatus` and `P3KeyTreasureList` before opening.

**Multiplier rolls (observed):**

| Open | Response |
|---|---|
| Bronze 1 | `RewardName:"Gold bag"`, `RewardQty:1`, `RemainingKey:2` |
| Bronze 2 | `RewardName:"Silver Key"`, `RewardQty:1`, `RemainingKey:1` |
| Bronze 3 | `RewardName:""`, `RewardQty:0`, `RemainingKey:0`, `IsMultiplier:1`, `MultiplierValue:2`, `TotalMultiplier:2` |
| Silver 1 | `RewardName:""`, `RewardQty:0`, `RemainingKey:0`, `IsMultiplier:1`, `MultiplierValue:2`, `TotalMultiplier:2` |

A multiplier result is a **bonus roll**, not a lost reward. Do not treat an empty `RewardName` with `IsMultiplier:1` as a failure; check the bag and `P2KeyStatus` (`Bronze,Silver,Gold,MultBronze,MultSilver,MultGold`) before and after. `RemainingKey` is the count left after the open.

**Codes:**

- `P1Code @Code = '...'`.
- Case-insensitive; one use per account; expiry applies.
- Confirmed active on 21/11/2026: **TUAN47**. Older: `TANTHU`, `TUAN45`, `TUAN46` (may be expired).
- Never brute-force codes; it is rate-limited and abusive.

---

## 10. Daily, weekly, and monthly routine

### 10.1 Daily checklist (priority order)

| # | Action | API / procedure | Notes |
|---|---|---|---|
| 1 | Login and bind session | `/session/login`, `/session/select-server` | Verify with `P4MainLoad`; handle `-1` |
| 2 | Snapshot state | `P4MainLoad`, `P2Info`, `P4StaminaStatus` | Save to SQLite; detect anomalies |
| 3 | Claim mail | `P4Mail`, `P1MailClaimAll` | Do this before other claims; mail may contain event rewards |
| 4 | Claim daily gift | `P3GiftDay` → `P1GiftDayClaim @Day = Today` | Only the unlocked day |
| 5 | Claim level gifts | `P3Gift` → `P1GiftClaim @Tier` | `Unlocked:1, Claimed:0` |
| 6 | Claim missions | `P3MissionList` → `P1MissionClaim2 @MissionId` or `P2MissionClaimAll @Tab` | `State:1` = ready; the `@Tab` → period mapping was **unstable** across probes. Try each tab, diff `P3MissionList`, and stop when `Claimed:0` |
| 7 | Free Scratch | `P1Scratch` | Free first; paid only with a cap |
| 8 | Redeem codes | `P1Code` | One-time; record results |
| 9 | Collect idle BP | `P2GetBP` | After overnight; converts time + Gold |
| 10 | Collect idle Energy | `P2GetEnergy` | After overnight; one idle window, then `Result:0` until time accrues |
| 11 | Buy daily BP/Energy | `P2BuyItemQty @Buy` | Energy food is capped at **15 items/day** (`UsedToday`/`PerDay`); extra items stay in the bag |
| 12 | Spend Energy on story | `/battle` | Push until wall; verify wins |
| 13 | Spend BP on Rank | `/battle/rank` | Attack above; stop on `NoBP`/`NoTarget` |
| 14 | Spend BP on Plunder | `/battle/plunder` | Eligible targets; stop on `NoGold` |
| 15 | Guild donate | `/api1/api/guild/donate` | Daily contribution |
| 16 | Guild boss | `/battle/guildboss` | If guild and open |
| 17 | Guild battle | `/battle/guild` | Max 3/day/target |
| 18 | Ultimate Trial | `/battle/ultimate` | 4 runs/mode |
| 19 | Training | `/battle/train` | 3 runs/mode; open cave |
| 20 | Beast Boss | `/battle/boss` | 12:00–13:00 / 19:00–21:00 |
| 21 | Chakra Tree | `P1ChakraTreeDonate` | Lv20+; Gold cap |
| 22 | Diamond milestones | `P1DiamondSpendingClaim` | Claim before day end |
| 23 | Event checks | Legendary/Turnplate/Culture/Cat | Budget caps |
| 24 | Final snapshot | `P4MainLoad` | Log deltas; stop before 00:00 |

**Do not** do all 24 steps blindly. The scheduler should skip actions whose preconditions are false (`NoBP`, `NoEnergy`, `Closed`, `NoGuild`, `NoRun`, `Locked`).

### 10.2 Weekly checklist

- **Monday:** weekly missions refresh; guild week resets.
- **Saturday:** claim the weekly gift before the end-of-day auto-claim; Culture exchange opens; weekend boss is stronger.
- **Sunday:** weekly gift cycle resets; Culture exchange still open; plan the next week’s Diamond budget.
- **Every day:** check whether the Legendary/Turnplate cycle is on or off; the 2-on/2-off rhythm is easy to miss.

### 10.3 Monthly checklist

- **1st of the month, 00:00:** monthly missions refresh.
- Review the month’s Diamond income vs. spend; reset budget caps.
- Check for new gift codes and event schedules in official news.

### 10.4 Time-blocked calendar (UTC+7)

| Time | Action |
|---|---|
| 00:03–00:10 | Reset routine: login, snapshot, mail, daily gift, missions, free scratch |
| 00:10–11:45 | Story push, Training, Ultimate, Rank/Plunder; low concurrency |
| 11:55 | Pre-boss snapshot; set Attack/Defense formation |
| 12:00–13:00 | Beast Boss hits every ~20 s |
| 13:00–17:45 | Story/Training/Ultimate; guild donate/boss; event checks |
| 17:50 | World War registration lock (Top 20 only) |
| 18:00 | World War battles |
| 19:00–21:00 | Beast Boss hits every ~20 s |
| 21:00 | Chakra Tree contribution cutoff (last day) |
| 23:50 | Chakra Tree rewards mailed; final claims |
| 23:55–23:59 | Final snapshot; stop before reset |

Adjust for maintenance and for the server’s actual event state; the API is authoritative, not this table.

---

## 11. Economy guide

### 11.1 Gold: earn and spend

**Earn:**

- Story stages (main repeatable source).
- Plunder (up to 20k/battle; 60k/day/target).
- House 5 idle (BP + Gold).
- Selling excess items/ninjas (careful: never sell 5★ dupes).
- Events, mail, keys, guild rewards.

**Spend, in rough priority:**

1. **Ninja recruitment** — 1k/5k/30k/80k Gold packs; the 80k pack gives 3–5★. This is your main source of fodder and new ninjas.
2. **Gear upgrades** — feed excess gear; max level = player level.
3. **Gem fusion** — 10,000 Gold per try; only fuse when you have duplicates.
4. **Potential** — 1,000 Gold per try, plus 1 Chakra Pill.
5. **Ascension** — Gold + Ninja Soul; only on the main carry.
6. **Guild donate** — daily, for contribution and guild EXP.
7. **Chakra Tree** — up to 1M Gold/day during the event.

**Do not** spend Gold on low-value rerolls or on upgrading gear you will replace tomorrow.

### 11.2 Diamond: earn and spend

**Earn:**

- Level gifts (every 5 levels).
- Daily gift.
- Missions.
- Free Scratch.
- Keys.
- Ultimate Trial daily rank.
- Beast Boss top 10/killing blow.
- Events, codes, mail.
- Top-up (manual; not for a bot).

**Spend, in rough priority:**

1. **Energy/BP refills** when they unlock a time-gated goal or a story breakpoint.
2. **5★ fodder/gear** if it completes a Super/Kage or a main-team breakpoint.
3. **Legendary 10-pull** (3,500 Diamond) for the guaranteed 5★ egg, only if the event is open and you need fodder.
4. **Gear recast** (100) only on long-term gear with bad socket colors.
5. **Element reroll** (100) only when the element blocks a team plan.
6. **Potential restore** (1,000) only when re-speccing.
7. **Guild creation** (3,000) only if you are committed to leading.
8. **Turnplate/Legendary rank chase** — whale territory; skip by default.
9. **Cat** — gamble; skip unless surplus.

**Budget rule:** set a daily Diamond cap (e.g., 10% of current balance) and a per-event cap. Never let an event’s sunk-cost pressure override the cap.

### 11.3 Energy and BP

- **Energy** is for story/PvE. It refills at House 4 and on level-up. Spend it before it caps; overflow is wasted.
- **BP** is for PvP and some modes. Max 10; refills at House 5 and on level-up. Spend it on the highest-value PvP action available, not on random fights.
- `P2GetBP` and `P2GetEnergy` convert idle time + Gold into BP/Energy. Call them after long idle periods, not every few minutes. `P2GetEnergy` observed: 54 idle minutes → **+44 Energy, +5 EXP**, `Result:1`; an immediate retry returned `Result:0` until more time accrued.
- **Energy-food daily cap:** `reward/use-item` tracks `UsedToday` and `PerDay` (15 at VIP 0) across all Energy items. When the cap is reached, the server may consume only part of a requested stack: `quantity:4` returned `Quantity:2`, `Gained:120`, `UsedToday:15`. The unused items stay in the bag; do not assume a `Result:1` consumed the whole request.
- **Shop refills:** Sushi ×1 costs **20 Diamond** (row 5), ×10 costs **180 Diamond** (row 6), and ×10 costs **600,000 Gold** (row 24). The Gold pack is the efficient choice when the goal is a level breakpoint and Gold can be re-farmed; the Diamond packs are for emergencies only.
- Buy only when the refill enables a concrete goal (level 25 gift tier, slot unlock, event cutoff).

### 11.4 Fame

- Earned from Beast Boss.
- Spend in the Battle/Fame shop.
- Do not let Fame sit at cap; check the shop after boss sessions.

### 11.5 Shop priorities (observed)

| Item | Price | Why |
|---|---|---|
| Big BP | 20 Diamond | Tempo for PvP; buy when pushing rank |
| Sushi | 20 Diamond | Energy for story/event push |
| Gold Chest | 100 Diamond | Gold injection |
| Ninja 5★ | 800 Diamond (1), 7,500 (10) | Fodder for Super/Kage; expensive |
| Bronze Key | 50,000 Gold | Key pool includes Gold/Diamond/BP |
| Gem 1★ ×10 | 300,000 Gold | Gem fusion fuel |
| 5★ Atk/Def gear | 800 Diamond | Main-team breakpoint |

**Do not** buy random low-tier eggs at full price once your team is stable; the 80k Gold recruit and event eggs are better value.

### 11.6 VIP

- VIP EXP comes from top-ups. Thresholds observed: **10,000 / 20,000 / 50,000 / 100,000 / 200,000 / 500,000 / 1M / 2M / 5M / 10M** VIP EXP, corresponding to cumulative recharge of **100,000 VND (VIP 1) up to 100,000,000 VND (VIP 10)**.
- Benefits include more daily Energy food/BP pills, beast upgrade time reduction, VIP shop packs/discounts, and **Fast Battle at VIP 4**.
- A free-to-play bot should ignore VIP except as a data field; never automate the top-up.

---

## 12. Progression roadmap

This is a planning heuristic, not a speedrun guarantee. The bottleneck is always **player level → team slots → gear/ninja level → Super/Kage → Potential/Senjutsu → beasts**.

| Phase | Player level | Goals |
|---|---|---|
| **Onboarding** | 1–9 | Tutorial, first recruit, 3 slots, story push, daily gifts, join a guild, first Scratch |
| **Foundation** | 10–19 | Slot 4, gear on the core, first 5★ carry, Rank Top 100 push, Training cave 1/2 |
| **Consolidation** | 20–29 | Slot 5, Chakra Tree, guild boss, first **Super**, Potential on carry |
| **Breakpoint** | 30–44 | Slot 6, Kage path, gem sockets, Ultimate Trial push, plunder income |
| **Midgame** | 45–59 | Slot 7, second Super/Kage, Tailed Beast levels, consistent Rank Top 50 |
| **Endgame** | 60–89 | Slots 8–9, Kage team, ascension, Ultimate stage 100+, boss top 10 |
| **Cap** | 90–120 | Slot 10, full Kage team, Legend gear, Rank Top 10, World War contention |

**Each phase, in order:**

1. Fill new team slots.
2. Raise the carry’s level/gear/gems.
3. Complete the next Super/Kage.
4. Push story to the new wall.
5. Raise Potential/Senjutsu on the core.
6. Add beast levels.
7. Re-enter Rank/Ultimate with the new power.

### 12.1 A 30-day plan for a fresh account

This assumes a stable server and no wipe. **Do not apply it to Alpha data**; Alpha is wiped on 22/11 and Beta may also be wiped. Start the clock at launch (1/12/2026) or at the start of a persistent server.

| Days | Focus | Concrete goals |
|---|---|---|
| **1–3** | Onboarding and claims | Finish the tutorial, fill 3 slots, claim daily/level gifts and codes, join a guild, spend the first Energy on story |
| **4–7** | Foundation | Reach Lv10 (slot 4), get a 5★ carry, push Rank into the Top 100, run the open Training cave, start daily boss hits |
| **8–14** | Consolidation | Reach Lv20 (slot 5), unlock Chakra Tree, complete the first **Super**, put Potential into the carry, donate and fight for the guild daily |
| **15–21** | Breakpoint | Reach Lv30–45 (slots 6–7), start the Kage path, push Ultimate Trial, use plunder for Gold, keep Rank Top 50 |
| **22–30** | Midgame | Reach Lv45–60, finish a second Super/Kage, level the main Tailed Beasts, hold Rank Top 50, budget Diamond per event instead of chasing rank 1 |

**Weekly rhythm inside the 30 days:** Monday weekly missions and guild week; Saturday weekly gift before auto-claim plus Culture exchange; Sunday gift reset and next week’s Diamond budget. Check the Legendary/Turnplate 2-on/2-off cycle every day.

---

## 13. Bot priorities

This section is about **what to automate first**, not how to write code. The API report covers the mechanics.

### 13.1 Principles

1. **Read-only first.** Build a collector and dashboard before any mutation. You cannot debug a bot whose state you cannot see.
2. **Idempotent claims first.** Rewards and gifts are the highest value per unit of risk.
3. **One account, one process, serial requests.** No parallel battles, no multi-account farming.
4. **Verify every mutation.** Re-read the relevant state; check `Win` for battles.
5. **Budget every currency.** Daily caps for Energy, BP, Gold, Diamond, and event spend.
6. **Time-gated actions beat grinding.** Boss windows, World War, guild battle, and event cycles are where the value is.
7. **Stop on ambiguity.** Unknown `Result`/`Error` → stop and report, do not retry blindly.
8. **Never automate money, account security, or social harm.** See §16.

### 13.2 Priority tiers

| Tier | Actions | Why | Risk |
|---|---|---|---|
| **S** | Session health, snapshot, mail, daily gift, level gifts, mission claims, free Scratch, code redemption, idle BP/Energy collection | Free, repeatable, high value, mostly idempotent | Low |
| **A** | Story Energy spend, Rank above, Plunder eligible, Ultimate runs, Training runs, boss hits, guild donate/boss/battle, shop BP/Energy | Converts regenerating resources into permanent power | Medium |
| **B** | Gear/gem upgrades, Potential, Senjutsu, ascension, key opening, Culture exchange, Diamond milestones | Power spikes, but requires judgment and currency caps | Medium |
| **C** | Legendary/Turnplate chasing, Cat, World War, guild management, chat | High variance, high spend, or social/competitive impact | High |
| **Never** | Payments, password/contact changes, mass registration, chat spam, harassment, exploitation | Legal/ToS/ethical risk | Extreme |

### 13.3 The action ladder

Automate in this order, and only move up when the lower tier is stable:

1. **Observe:** `P4MainLoad`, `P2Info`, `P3Team`, `P2StageProgress`, `P4StaminaStatus`, `P3MissionList`, `P4Mail`, event statuses. Store snapshots.
2. **Claim:** mail, daily gift, level gifts, missions, free Scratch, codes.
3. **Collect:** `P2GetBP`, `P2GetEnergy` after idle periods.
4. **Spend regenerating resources:** story (Energy), Rank/Plunder/Guild (BP), Ultimate/Training runs.
5. **Spend currency:** gear, gems, Potential, Senjutsu, ascension, shop.
6. **Compete:** timed boss, guild battle, World War.
7. **Social:** chat, guild management. **Manual-only by default.**

### 13.4 Scheduler design

- Use a **single scheduler** with a persisted action queue and a `next_run_at` per action.
- Store all times in UTC; render in UTC+7. The server’s day boundary is 00:00 UTC+7.
- Give every action a **precondition check**, a **budget check**, and a **postcondition check**.
- Use **jitter** (±30–120 s) on non-time-critical actions to avoid a robotic pattern and thundering-herd behavior.
- For the boss, schedule hits at **20 s + jitter**; stop at the window end.
- For World War, register at **17:40**, not 17:59.
- For reset claims, run at **00:03–00:10**, not exactly 00:00.
- For the weekly gift, claim on **Saturday before 23:50**.

### 13.5 State machine

A simple, robust loop:

```text
BOOT → AUTH → SNAPSHOT → PLAN → ACT → VERIFY → PERSIST → SLEEP
                 ↑                                  │
                 └──────────── on error ────────────┘
```

- **AUTH:** login/select; if `-1`, reuse the persisted server-bound token; if still failing, stop.
- **SNAPSHOT:** read the minimum state needed for the plan (not every endpoint every cycle).
- **PLAN:** select the highest-priority action whose preconditions and budget pass.
- **ACT:** call one mutation.
- **VERIFY:** re-read the affected state; compare expected vs actual.
- **PERSIST:** write the result, delta, and timestamp to SQLite.
- **SLEEP:** until the next action or event window.

### 13.6 Verification rules

| Action | Verify with |
|---|---|
| Story/Rank/Plunder/Guild/Tails battle | `/battle/9vs9/log` → `Win`; `P2StageProgress` for story advance |
| Ultimate/Training | Response `Result` + `P4UltimateStatus`/`P4TrainStatus` |
| Boss/Guild boss | `P2BossInfo`/`P2GuildBossInfo` HP/damage/cooldown |
| Claim | Re-read the claim state (`Claimed`, `State`, `Unlocked`) |
| Purchase | Re-read currency and inventory |
| Team change | `P3Team` |
| Guild action | `P2MyGuildInfo` |

**Never** treat `BattleResult.Id` as proof of a win. **Never** treat HTTP 200 as proof that a game action succeeded.

### 13.7 Stop conditions and circuit breakers

Stop the bot and alert when:

- `401` persists after a fresh token and `select-server` retry.
- `426 update_required` — the client version changed; do not spoof or retry.
- `429` on more than N consecutive requests — back off exponentially.
- `500` repeats on the same procedure/route — the parameters or server state changed.
- `NoBP`/`NoEnergy`/`NoGold` repeats after the expected refill — the economy assumption is wrong.
- A battle returns an `Id` but the log is missing or `Win` is false repeatedly.
- Inventory/team/roster state is inconsistent (e.g., a ninja disappears, currency goes negative).
- A mutation produces an unknown `Result`/`Error` code.
- The account is close to a daily/event cap and the remaining actions are low value.

### 13.8 Anti-patterns

- **Blind retry loops** on mutations. A retry can double-spend or duplicate a claim.
- **Parallel battles.** The server races; state can desync.
- **Token churn.** Do not log in repeatedly and overwrite the working token.
- **Full-state polling every few seconds.** It is wasteful and noisy; poll on a schedule and after mutations.
- **Trusting the UI text.** The API’s `Result`/`Error` and the authoritative state are the truth.
- **Chasing event rank 1 by default.** The expected value is usually negative for a normal account.
- **Automating chat or PvP harassment.** It is the fastest route to a ban and harms the community.
- **Storing passwords/tokens in logs.** Redact them.

### 13.9 Beta validation plan

Use the Alpha remainder for read-only work and the Beta window (23–30 Nov 2026) to validate the bot tier by tier. Do not jump to PvP automation on day one.

| Window | Focus | Success criteria |
|---|---|---|
| Alpha remainder | Read-only collector and dashboard | 24 h of snapshots; no mutations; clean schema diff |
| Beta day 1 | Auth, session, claims | Login/select stable; mail/gift/mission claims idempotent; zero double-claims |
| Beta day 2 | Energy/BP actions | Story, Rank, Plunder verified via log/state; budget caps respected |
| Beta day 3 | Upgrades | Gear/gem/Potential/Senjutsu deltas match expectations; no negative currency |
| Beta day 4 | Timed events | Boss hits respect 20 s cooldown; Ultimate/Training runs stop at caps |
| Beta day 5 | Guild and World War | Guild donate/boss/battle stable; World War remains manual |
| Beta day 6–7 | Soak test | 48 h unattended with error budget; no unexplained state drift |

**Exit criteria for each tier:** no verification failures for 24 h, no unknown result codes, and a documented rollback/manual recovery path.

### 13.10 Manual-only list

Keep these human:

- Payments, top-ups, first recharge, recharge gifts.
- Password change, email/phone change, account recovery.
- Guild creation/rename/delete, kick, role change, leader transfer.
- User rename, guild rename.
- Selling/disassembling high-value items or 5★ ninjas.
- Chat, friend/rival requests, block lists.
- World War registration/bracket decisions (high stakes).
- Any action affecting another player’s account or standing.

---

## 14. Metrics and dashboards

Track these in SQLite and render on a read-only dashboard:

**Account**

- Player level/EXP, Diamond, Gold, Energy, BP, Fame.
- Energy/BP cap utilization; idle minutes converted.
- VIP level/EXP; daily shop purchase counts.

**Roster**

- Ninja count by star, element, tier (Normal/Super/Kage), ascension.
- Main team power, per-slot Atk/Def, skill grades, bond activations.
- Gear levels, socket colors, gem levels.
- Potential points, Senjutsu levels, beast levels/chips.

**Progress**

- Stage `Scid`/`Task`/`Chapter`, wins/losses, energy per stage.
- Rank, Top 100 margin, daily Pill income.
- Ultimate best stage per mode, runs used, stars/buffs.
- Training runs used, cave open/closed, materials.
- Boss damage, rank, Fame, kills.
- Guild contribution, guild rank, boss damage, battle points.

**Economy**

- Daily Gold/Diamond income and spend by category.
- Event spend vs. cap; milestone progress.
- Shop purchases; key counts; Scratch free/paid.

**Reliability**

- Request count, error rate by status/code, p50/p95 latency.
- Verification failures (battle `Id` but no `Win`, claim not reflected).
- Token age, re-auth count.
- Action queue depth, skipped actions by reason.

---

## 15. Common traps and observed quirks

| Trap | What happens | Handling |
|---|---|---|
| Fresh login token returns `select-server: -1` | Server routes return `401 Session chua chon server/nhan vat.` | Persist the server-bound token; do not overwrite it with a fresh login token |
| `battle` with an empty team | `NoNinja` | Fill slots via `P1TeamSetNinja` |
| `isBot` missing/false on story | Wrong path or failure | Send `isBot: true` for story |
| `ascend/run` with boolean `auto` | `400` empty body | Send integer `0`/`1` |
| `battle/ultimate` with `star: 0` | `BadParam` | Send `star >= 1` |
| `battle/plunder` shows Gold but returns `NoGold` | Protection/stealable-Gold rule | Pick another target; do not retry |
| Battle returns `Id` but you lost | `Id` is not a win flag | Check `/battle/9vs9/log` `Win` |
| `/battle` reports `ExpGained:0` | The field is unreliable on story wins | Compare `P4MainLoad` before/after; the state gains EXP |
| Guild-boss log says `Win:false` | Guild boss is a damage exchange, not a win/loss battle | Verify `Dame`, `HitsLeft`, `HP`; the hit still counted |
| `reward/use-item` consumes fewer items than requested | Daily Energy-food cap (`UsedToday`/`PerDay`) | Read `Quantity`/`UsedToday`; keep the remainder in the bag |
| `P2MissionClaimAll @Tab` claims nothing | The tab → period mapping is not stable | Try each tab and diff `P3MissionList`; stop on `Claimed:0` |
| `P1GuildRequestPending` returns `"1"`/`"0"` | It is a scalar leader flag, not a request list | Use `P3GuildRequestList` for rows; approve by `@TargetUserId` |
| Re-request after a guild rejection returns `Result:0` | The rejected row is still actionable | The leader can still `P1GuildAcceptMember`; verify the member list |
| `P3TrainStageList @Cave` returns `[]` | Required parameter missing, or the account is `LowLevel` | Always send `@Cave`; do not infer success from an empty list |
| `P3Team.UnlockedSlots` disagrees with the table | Slot 5 appeared at Lv21, not Lv20 | Trust the server field; re-read after each level |
| Key open returns an empty `RewardName` with `IsMultiplier:1` | It is a bonus roll, not a failure | Check the bag and `P2KeyStatus`; do not retry |
| `P2Bag` returns HTTP 500 | Procedure is broken/unconfigured | Use `P3TeamNinjaList` / `P4BagNinjaStack` for inventory reads |
| `P1GuildCreate` with `@Notice` returns 500 | Only `@Name` is accepted | Send only `@Name` |
| `P1GuildSetRole` without `@Role` returns 500 | `@Role` is required | Send `@Role` 0/1/2 |
| `P3GiftDay.Diamond` looks like a price | It mirrors your current Diamond balance | Use `GiftDayMakeupCost` config for the makeup price |
| `P1GiftDayClaim @Day = 1` returns 0 | Day 1 is locked; only today’s day is unlocked | Use `@Day = Today` from `P3GiftDay` |
| `P4WorldWarStatus` returns 500 | Procedure unstable | Use `P3WorldWarTeam`; do not depend on status |
| `P3ServerList`/`P3TopupList` return 500 | Unconfigured/broken in test | Avoid; use static/news data |
| `P4BattleLog` returns empty | Story log not exposed there | Use `/battle/9vs9/log` |
| `P1TeamSetNinja` metadata only shows `@Slot` | Actual call needs `@NinjaId` too | Send both |
| `Result` is a string on some routes | `"0"`, `"1"`, `"A"` | Normalize types before comparing |
| Daily reset at 00:00 UTC+7, not UTC | Actions at the wrong time hit the previous day | Store UTC, schedule in UTC+7 |
| Alpha/Beta wipe | Test progress disappears | Do not build paid/irreversible workflows on test data |

---

## 16. Legal, operational, and ethical caveats

> **This section is not legal advice. Read the game’s actual Terms of Service and event rules.**

1. **Terms of Service.** Botting, automation, macros, unauthorized third-party clients, scraping, account sharing, and commercial exploitation may be prohibited. Penalties can include warnings, rollbacks, suspension, or permanent bans. This document does not grant permission, a license, or immunity.
2. **Alpha/Beta data loss.** Published timeline: Alpha **1–22 Nov 2026**, Beta **23–30 Nov 2026**, official launch **1 Dec 2026**. Alpha data is wiped at the end; only name/stage progress may be preserved. Treat all test-server progress as disposable. Confirm the Beta wipe policy with the operator before investing.
3. **Rate limits and stability.** Account routes returned `429` under rapid repeated calls. SQL routes can return `500` for bad parameters. Use conservative backoff, jitter, and a global concurrency limit. Never retry mutations blindly.
4. **Privacy and credentials.** Do not log passwords, tokens, remember tokens, email addresses, or phone numbers. Do not share accounts. Do not use another player’s token or data.
5. **Fair play.** Rank, Plunder, Guild Battle, Beast Boss, and World War affect other players. Automated play can distort rankings and event outcomes even when technically possible. Prefer read-only analysis, private test accounts, and explicit operator permission.
6. **Payments.** `P1Pay`/`P1PayInternational`, first recharge, and recharge gifts touch real money. Do not automate payment, top-up approval, or refund logic. Treat billing state as server-authoritative and human-controlled.
7. **No redistribution of game assets.** The report references asset paths and ids for interoperability. It does not grant rights to redistribute art, audio, text, or data.
8. **No mass registration or credential attacks.** Creating accounts in bulk, brute-forcing codes, or probing other accounts is abusive and may be illegal.
9. **Kill switch.** Any bot should have a human-accessible stop control and a dry-run mode. If the operator asks you to stop, stop.

---

## Appendix A — Action-to-route cheat sheet

| Goal | Best call | Fallback / notes |
|---|---|---|
| Full player state | `P4MainLoad` | `P2Main`, `P2Info` |
| Lightweight profile | `P2Info` | `P4MainPreview` |
| Energy/BP caps | `P4StaminaStatus` | `P4MainLoad` |
| Story progress | `P2StageProgress` | `P3StageList @Task` |
| Team | `P3Team` | `P1GetTeam` |
| Owned ninjas | `P3TeamNinjaList` | `P4BagNinjaStack` |
| Set team slot | `P1TeamSetNinja @Slot, @NinjaId` | `P1SetTeam`/`P1Team3x3Set` |
| Missions | `P3MissionList` | `P1MissionClaim2`; `P2MissionClaimAll @Tab` (mapping unstable — diff states) |
| Mail | `P4Mail` | `P1MailClaimAll` |
| Daily gift | `P3GiftDay` | `P1GiftDayClaim @Day = Today` |
| Level gifts | `P3Gift` | `P1GiftClaim @Tier` |
| Shop | `P3Shop`, `P3ShopVip` | `P2BuyItemQty @Buy` |
| Keys | `P2KeyStatus`, `P3KeyTreasureList` | `reward/key-open` |
| Scratch | `P2Scratch` | `P1Scratch` |
| Rank | `P2RankList`, `P2RankTop20` | `/battle/rank` |
| Target scouting | `P3TeamVisit @TargetUserId`, `P3TeamPower`, `P2Detail @Detail` | Check power/element before attacking |
| Plunder | `/battle/plunder-list`, `P2PlunderTop20` | `/battle/plunder` |
| Ultimate | `P4UltimateStatus @Mode`, `P3UltimateBuffList` | `/battle/ultimate` |
| Training | `P4TrainStatus`, `P3TrainStageList @Cave` | `/battle/train` |
| Tails | `P4Tails`, `P3TailsChipHolders` | `/battle/tails` |
| Boss | `P2BossInfo`, `P3BossFightRank` | `/battle/boss` |
| Guild | `P2MyGuildInfo`, `P3GuildList` | `P1GuildRequestJoin`, `guild/donate`; create with `P1GuildCreate @Name` |
| Guild boss | `P2GuildBossInfo`, `P3GuildBossRank` | `/battle/guildboss`; `Win:false` is normal |
| World War | `P3WorldWarTeam` | `worldwar/register` |
| Battle logs | `/battle/9vs9/log` | `P4BattleLog` (unreliable) |

---

## Appendix B — Result/error quick reference

| Code / Error | Meaning | What to do |
|---|---|---|
| `NoNinja` | No valid team | Fill team slots |
| `Locked` | Stage/beast not unlocked | Clear prerequisite |
| `Closed` | Event/cave/boss window closed | Schedule the window |
| `Defeated` | Shared boss already killed this session | Stop; wait for the next session |
| `LowLevel` | Player below requirement | Level up / lower tier |
| `NoRun` | Daily runs exhausted | Stop until reset |
| `Cooldown` | Action still on cooldown (guild boss, etc.) | Wait `CooldownRemain` seconds; do not retry |
| `Pending` | Ultimate buff/reward must be cleared first | Call `P1UltimateBuyBuff` / `P2UltimateClaim` |
| `NoBP` | BP exhausted | Collect idle BP / buy / stop |
| `NoEnergy` | Energy exhausted | Collect idle Energy / buy / stop |
| `NoGold` | No stealable Gold / protection | Pick another target |
| `NoTarget` | Rank/guild target invalid | Refresh list |
| `NoChip` | Invalid/missing Tail chip | Check `P4Tails` |
| `NoGuild` | Not in a guild | Join/create guild |
| `BadParam` | Invalid parameter | Fix request (`star>=1`, `auto` int) |
| `NotFound` | Entity not found | Validate id |
| `Result:0` | Generic failure/no-op | Inspect context; do not retry blindly |
| `Result:1` | Success (most routes) | Verify state |
| `Result:2` | No keys / no runs / already used (context) | Check route-specific meaning |
| `Result:3` | Invalid target / insufficient Diamond (context) | Check route-specific meaning |
| `Result:4` | Closed / NoGuild / guild level too low / milestone already claimed (context) | Check route-specific meaning |
| `Result:5` | Guild channel unavailable / boss already defeated (context) | Join guild or wait for next boss session |
| `Result:6` | Invalid channel/self/rate limit | Fix or back off |
| HTTP `401` | Auth/session | Re-auth; check server binding |
| HTTP `426` | Client version | Update `X-Client-Version` |
| HTTP `429` | Rate limit | Back off with jitter |
| HTTP `500` | Bad procedure params / server error | Stop; inspect parameters |

---

## Appendix C — Key constants (observed build 26.11.19)

| Constant | Value |
|---|---|
| Player level cap | 120 |
| Ninja level cap | 60 |
| Equip max level | 120 |
| Max ascension | 8 |
| Ultimate max stage | 200 |
| Ultimate runs/day | 4 per mode (design; live observed 2) |
| Ultimate buff cadence | Every 3 stages (`PendingBuff`) |
| Ultimate reward cadence | Every 5 stages (`PendingReward`, Gold bag) |
| Training runs/day | 3 per mode, 6 total |
| Team slots | 1,1,1,10,20,30,45,60,75,90 (slot 5 observed at Lv21) |
| Starter resources | 1,000 Diamond, 200,000 Gold, 104 Energy, 10 BP |
| Guild create cost | 3,000 Diamond |
| Guild rename cost | 1,000 Diamond |
| Guild boss (Lv1) | Shukaku, 3,000,000 HP, 5 hits/day, 30 s cooldown, 20 EXP/contribution per hit |
| Energy food cap | 15 items/day at VIP 0 (`UsedToday`/`PerDay`) |
| Guild battle cap | 3/day/target |
| Plunder cap | 20,000 Gold/battle, 60,000/day/target |
| Rank reward cutoff | Top 100 |
| World War cutoff | Top 20 |
| First recharge | 2,000 Diamond / 20,000 VND |
| Turnplate spin | 350 / 3,500 Diamond |
| Legendary draw | 350 Diamond |
| Scratch | 20 Diamond after free |
| Gear recast | 100 Diamond |
| Attribute reroll | 100 Diamond |
| Rename | 1,000 Diamond |
| Gift-day makeup | 100 Diamond (config; not live-verified) |
| Chakra Tree gold cap | 1,000,000/day |
| Chakra Tree minimum level | 20 |

---

## Appendix D — Sources and confidence

**Sources**

- In-game UI/tutorial strings extracted from the Unity IL2CPP build (`guides_blocks.txt`).
- Official site guides 1–14 (`site/guide_*.txt`) covering UI, ninja, elements, Super/Kage, Tailed Beasts, Diamond, Legendary, Beast Boss, Turnplate, gems, early power, Ultimate Trial, and codes.
- Official news pages for the Alpha/Beta timeline, gift codes, and event rules.
- Live API probes on a test account during Alpha: `P3Gift`, `P3GiftDay`, `P3MissionList`, `P4TrainStatus`, `P4Tails`, `P2BossInfo`, `P2TurnplateStatus`, `P2LegendaryStatus`, `P2CultureStatus`, `P3Shop`, `P3ShopVip`, `P3GiftRechargeList`, `P3VipExpList`, `P3ChakraTreeInfo`, `P3ChakraTreeRewardList`, `P4UltimateStatus`, battle/battle-log responses, and successful claims/purchases (mission, key, scratch, Diamond milestone, shop, boss state). Guild probes: `P1GuildCreate`, `P1GuildRequestJoin`/`AcceptMember`/`RejectRequest`/`KickMember`/`Leave`/`SetRole`/`TransferLeader`, `guild/info`, `guild/donate`, `guild/emblems`, `guild/emblem/set`, `P2GuildBossInfo`, `P3GuildBossRank`, `/battle/guildboss`, and `/battle/guild`. Also probed: Ultimate stages 1–6 with buff/reward claims, Training `LowLevel` at Lv10–23, item-use quantity truncation at the daily cap, and story repeat-EXP efficiency.

**Confidence**

- **High:** currencies, team slots, story/training/ultimate structure, elemental wheel, Super/Kage requirements, guild/plunder/rank rules, boss windows, event cadence, the daily/weekly/monthly resets, and the claim/purchase flows observed live. Guild create/join/reject/accept/kick/leave/role/transfer, donations types 1–3, guild-boss damage/cooldown/rank, Ultimate stages 1–6 with buff/reward claims, item-use quantity truncation, and story repeat-EXP efficiency were all probed directly.
- **Medium:** exact drop rates, event schedule exceptions, VIP benefit details, weekday boss rotation, the Diamond-milestone ladder above 300, the exact Ultimate `RunsLeft` chain-boundary rule, the training `LowLevel` threshold (still blocked at Lv23), and guild-emblem purchase success (blocked by guild Lv1). These are config-driven or only partially observable.
- **Low / verify before relying:** exact makeup cost (config says 100 Diamond, not live-verified), guild-battle success outside an active window, plunder success against real players, World War bracket behavior, `P4WorldWarStatus`, `P3ServerList`/`P3TopupList`, and the full BattleLog token semantics.

---

*End of playbook.*
