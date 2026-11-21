# Naruto Is Coming — API and Backend Report

**Target:** `https://naruto.id.vn` (server S1 – Naruto, Alpha Test)
**Client build observed:** `26.11.21` (the server required `26.11.19` earlier on the same day)
**Snapshot:** 21 November 2026 (UTC+7)
**Live window:** Alpha 1–22 Nov 2026; Beta 23–30 Nov 2026; official launch 1 Dec 2026.
**Scope:** the 51 dedicated POST routes, the account/session flow, the generic SQL procedure proxy, and the 186 client-callable stored procedures.

> **Status and caution.** This document is an observation-based interoperability report. It is not an official API specification, and it is not permission to automate the game. The API key below is embedded in the public Unity client and is not a security boundary. Botting, macroing, scraping, credential sharing, or commercial use may violate the game's Terms of Service and can lead to suspension or a permanent ban. Test only on an account you own, keep request rates low, and do not use this document to attack or overload the service. See §11.

---

## 1. Executive summary

- The game is a **Unity WebGL / IL2CPP** client. It talks to a **POST-only JSON REST API**. There is no documented public API, no WebSocket, and no GraphQL endpoint.
- Two API hosts are used:
  - **Global API:** `https://naruto.id.vn/api/api`
  - **Server-bound API:** `https://naruto.id.vn/api1/api`
- Routing is **path/host based**. Most account and metadata routes exist only on the global base; most gameplay routes exist only on the server base.
- Every protected request needs three headers:
  - `X-Api-Key: ninja-local-dev-9f83ac21`
  - `X-Client-Version: 26.11.21`
  - `X-Session-Token: <token>` after login
- The client exposes **51 dedicated routes**. A second, much larger surface is the **SQL procedure proxy**:
  - `/api1/api/sql/table`
  - `/api1/api/sql/row`
  - `/api1/api/sql/scalar`
  - `/api1/api/sql/dataset`
  - `/api1/api/sql/nonquery`
- The SQL proxy accepts only `EXECUTE dbo.<ProcName> ...` against a whitelist of **186 client-callable procedures**. Many game actions that have no dedicated route (team edits, missions, mail, codes, guild management, upgrades, shop purchases) are performed through this proxy.
- Time is **UTC+7** on the server. Daily reset is 00:00 UTC+7; weekly mission/guild reset is Monday 00:00; the weekly login-gift cycle runs Sunday 00:00 to Saturday end; monthly reset is the 1st at 00:00.
- The site is in Vietnamese, but most data rows carry both English and Vietnamese fields (`Name`/`Name2`, `Info`/`Info2`, `...Vi`).

### 1.1 Observed snapshot values

These values change continuously and are included only to show scale and units.

| Item | Observed 21 Nov 2026 |
|---|---|
| Player level cap | 120 |
| Ninja level cap | 60 |
| Equipment level cap | 120 |
| Max ascension | 8 |
| Ultimate Trial cap | stage 200 |
| Ultimate runs/day | 4 per mode |
| Training runs | 6 total/day, 3 per mode |
| Starter resources | 1,000 Diamond, 200,000 Gold, 104 Energy, 10 BP |
| Free team slots at Lv1 | 3 |
| Slot 5 observed unlock | Lv21 (server field; design table says Lv20) |
| Guild creation cost | 3,000 Diamond |
| Guild rename cost | 1,000 Diamond |
| Guild boss at guild Lv1 | Shukaku, 3,000,000 HP, 5 hits/day, 30 s cooldown |
| Energy-food daily cap | 15 items at VIP 0 |
| World War rank cutoff | Top 20 |
| First recharge threshold | 2,000 Diamond / 20,000 VND |
| Turnplate spin | 350 Diamond (3,500 for x10) |
| Legendary draw | 350 Diamond |
| Scratch | 20 Diamond after the free daily |
| Gear recast | 100 Diamond |
| Attribute reroll | 100 Diamond |
| Rename | 1,000 Diamond |
| Gift-day make-up | 100 Diamond |

---

## 2. Hosts, bases, and routing

| Purpose | Base URL | Notes |
|---|---|---|
| Global API | `https://naruto.id.vn/api/api` | Login, register, account contact, password change, version, animation |
| Server API | `https://naruto.id.vn/api1/api` | Everything player/game related, plus all SQL routes |
| Health | `https://naruto.id.vn/api/health` | `GET`; public; `200` with empty body |

Routing rules observed:

| Path family | Global base | Server base |
|---|---|---|
| `/session/login`, `/session/register` | ✅ | ❌ 404 |
| `/account/contact`, `/account/change-pass` | ✅ | ❌ 404 |
| `/version` | ✅ | ❌ 404 |
| `/animation` | ✅ | ✅ (server base requires a token) |
| `/config`, `/lang` | ❌ 404 | ✅ |
| `/session/select-server`, `/session/new-user`, `/session/new-user-info`, `/session/random-name`, `/session/logout` | ❌ 404 | ✅ |
| `/sql/*` | ❌ 404 | ✅ |
| All battle, chat, guild, reward, event routes | ❌ 404 | ✅ |

A route on the wrong base normally returns `404` with an empty body. A missing token on a server route returns `401`; the body may be empty, `Invalid or missing session token.`, or the Vietnamese message `Session chua chon server/nhan vat.` depending on which middleware rejects the request.

---

## 3. Request contract

### 3.1 Headers

| Header | Required | Value / behavior |
|---|---|---|
| `X-Api-Key` | Yes, on all `/api/*` and `/api1/*` routes | `ninja-local-dev-9f83ac21`; exact match. Missing/wrong → `401`, empty body |
| `X-Client-Version` | Yes, except `/api/api/version` and `/api/health` | `26.11.21`; missing/wrong → `426` |
| `X-Session-Token` | Yes on server routes after login | Opaque token from login/registration; invalid → `401` |
| `Content-Type` | Yes for bodies | `application/json` |
| `Accept` | Recommended | `application/json` |

- No cookies or CSRF token are used by the game API.
- `POST` is the only method for the JSON API except the public health check.
- An empty JSON object `{}` is accepted by routes that ignore the body.
- SQL responses may carry an `X-Notify` response header, e.g. `X-Notify: 1795128287.1.311`. It is informational; clients do not need to send it back.

### 3.2 HTTP status codes

| Status | Meaning | Typical body |
|---|---|---|
| `200` | Success | JSON object/array, or empty for some actions |
| `204` | No content | `ping` |
| `400` | Malformed body, invalid SQL text, multiple SQL statements, non-whitelisted procedure, or a bad parameter type | Empty, a JSON string, or a plain error |
| `401` | Missing/wrong API key, missing/invalid token, or session has not selected a character | Empty, `Invalid or missing session token.`, or `Session chua chon server/nhan vat.` |
| `404` | Unknown path, or route used on the wrong base | Empty |
| `405` | Wrong HTTP method after auth | Empty; `Allow: POST` |
| `426` | Missing or wrong `X-Client-Version` | `{"error":"update_required","version":"26.11.21"}` |
| `429` | Rate limit on some account routes | Empty |
| `500` | Invalid procedure parameters, broken procedure, or unhandled server error | `{"error":"Internal server error."}` |

Examples:

```http
HTTP/1.1 426 Upgrade Required
Content-Type: application/json

{"error":"update_required","version":"26.11.21"}
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

"Only 'EXECUTE dbo.<ProcName> ...' statements are allowed."
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

"Procedure is not callable from client."
```

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{"error":"Internal server error."}
```

### 3.3 JSON conventions

- PascalCase is used for most DTO fields (`Id`, `Result`, `Gold`, `NinjaId`).
- Lowercase is used for the auth/session envelope (`result`, `token`, `name`, `remember`) and for a few event responses.
- `Result` is sometimes a number and sometimes a string (`"0"`, `"A"`).
- `Error` is `null` on success and a symbolic string on a handled failure.
- Nullable fields are common; do not assume a field is always present or non-null.
- Arrays are sometimes nested (`/battle/plunder-list`, `/recharge-gift/info`) to represent multiple logical result sets.

---

## 4. Authentication and account lifecycle

### 4.1 Flow

```text
POST /api/api/session/register        → { "result": "1" }        (account created)
POST /api/api/session/login           → { "result": "1", "token": "...", "askContact": true }
POST /api1/api/session/select-server  → { "result": "287" }      (character id; "0" = no character)
POST /api1/api/session/new-user       → { "result": "288" }      (character created)
POST /api1/api/session/select-server  → { "result": "288" }      (bind session to character)
... all gameplay calls with X-Session-Token ...
```

### 4.2 `POST /api/api/session/register` — global

Creates an account. It does **not** return a token in the observed flow; log in afterwards.

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `uname` | string | Yes | Login name |
| `password` | string | Yes | Plaintext over HTTPS; the server hashes it |
| `email` | string | No | Can be empty; can also be set later via `/account/contact` |
| `phone` | string | No | Can be empty |
| `device` | string | No | Client/device identifier |

**Response**

```json
{"result":"1"}
```

| `result` | Meaning |
|---|---|
| `"0"` | Invalid input (empty/short username, missing password) |
| `"1"` | Registered successfully |
| `"2"` | Username already exists |

> Observed: registering `ab` with password `x` succeeded; the server does not enforce a strong password policy at this layer. Do not treat that as a recommendation.

### 4.3 `POST /api/api/session/login` — global

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `uname` | string | Yes | Login name |
| `password` | string | Conditionally | Plaintext password; this is what works in practice |
| `passHash` | string | No | Observed alone it fails (`result:"0"`); do not rely on it |
| `remember` | bool | No | `true` returns an additional `remember` token |
| `rememberToken` | string | No | Re-login with a previous `remember` value; still requires `uname` |

**Response**

```json
{"result":"1","token":"<opaque>","askContact":true}
```

With `remember:true`:

```json
{"result":"1","token":"<opaque>","askContact":true,"remember":"r1.<opaque>"}
```

| `result` | Meaning |
|---|---|
| `"0"` | Wrong username/password, or unsupported/empty credential |
| `"1"` | Success |

Notes:

- `askContact` indicates the account should be prompted to add contact information.
- A `remember` token works with `{ "uname": "...", "rememberToken": "r1...." }`; it is not a substitute for `uname`.
- Token format observed: `base64url(username).unix_timestamp.signature`. Treat it as opaque.

### 4.4 `POST /api1/api/session/select-server` — server

Selects the game server/character for the session. Body can be `{}`.

**Response**

```json
{"result":"287"}
```

| `result` | Meaning |
|---|---|
| numeric string, e.g. `"287"` | Character id; session is bound |
| `"0"` | Account has no character yet; call `/session/new-user` |
| `"-1"` | Session could not be bound / no selectable server |

> **Important observed quirk.** Fresh tokens from `/session/login` repeatedly returned `{"result":"-1"}` and then `401 "Session chua chon server/nhan vat."` on server routes. The original server-bound token from registration/character creation continued to work. Persist the server-bound token; do not overwrite it with a fresh login token without verifying that it can call `P2Info`. This may be an Alpha-environment bug, but a client must handle it defensively.

> **Version bumps invalidate the binding.** On 21 Nov 2026 the required client version moved from `26.11.19` to `26.11.21`. Existing tokens then returned `401 "Session chua chon server/nhan vat."` on SQL routes until `session/select-server` was called again with the new `X-Client-Version`. Re-select the server after every version bump and persist the token that works.

### 4.5 `POST /api1/api/session/new-user` — server

Creates the character after `select-server` returns `"0"`.

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | Character name |
| `ninja` | int | Yes | Starter template id: `21` Naruto, `15` Sasuke, `22` Sakura, `69` Kakashi |
| `keepAlpha` | bool | No | Preserve eligible Alpha name/stage progress |

**Response**

```json
{"result":"288"}
```

| `result` | Meaning |
|---|---|
| numeric string | New character id |
| `"0"` | Failure, name unavailable, or character already exists |

Observed starting state after creation: Lv1, 1,000 Diamond, 200,000 Gold, 104 Energy, 10 BP, 3 unlocked team slots, one starter ninja.

### 4.6 `POST /api1/api/session/new-user-info` — server

```json
{"oldName":"","askKeepAlpha":false}
```

- `oldName`: previous Alpha character name, if any.
- `askKeepAlpha`: whether the client should offer the keep-Alpha choice.

### 4.7 `POST /api1/api/session/random-name` — server

```json
{"result":"1","name":"Skittish Anko"}
```

| `result` | Meaning |
|---|---|
| `"1"` | Name generated |
| `"0"` | Failure (not observed) |

### 4.8 `POST /api1/api/session/logout` — server

Returns `200` with an empty body. In the observed environment the token was not immediately rejected by `select-server`; do not treat logout as a guaranteed server-side revocation.

### 4.9 `POST /api/api/account/contact` — global

**Request:** `{ "email": "a@b.c", "phone": "0901234567" }`

**Response:** `{"result":"1"}` on success; `{"result":"0"}` on failure. Repeated rapid calls returned `429` with an empty body. This route is rate-limited.

### 4.10 `POST /api/api/account/change-pass` — global

**Request:** `{ "oldPassword": "...", "newPassword": "..." }`

**Response:** `{"result":"1"}` on success; `{"result":"0"}` when the old password is wrong. Repeated rapid calls returned `429`.

---

## 5. Generic SQL procedure proxy

### 5.1 Endpoints

All are on the **server base** and require the normal three headers.

| Endpoint | Result shape | Example |
|---|---|---|
| `POST /api1/api/sql/table` | Array of row objects | `[{"Id":287,...}]` |
| `POST /api1/api/sql/row` | First row object, or `null` | `{"Id":287,...}` |
| `POST /api1/api/sql/scalar` | `{"value": <string or null>}` | `{"value":"287"}` |
| `POST /api1/api/sql/dataset` | Array of result sets, each an array of rows | `[[{...}]]` |
| `POST /api1/api/sql/nonquery` | `null` | `null` |

Request body:

```json
{"sql":"EXECUTE dbo.P2Info"}
```

### 5.2 Restrictions

Observed validation rules:

1. The statement must begin with `EXECUTE dbo.<ProcName>`.
2. `SELECT`, DDL, DML, comments before the procedure, and arbitrary SQL are rejected.
3. Multiple statements are rejected:
   ```json
   "Multiple statements are not allowed."
   ```
4. Procedure names are whitelisted. An unknown procedure returns:
   ```json
   "Procedure is not callable from client."
   ```
5. Invalid parameter counts/types or a procedure that throws produce `500 {"error":"Internal server error."}`.
6. String parameters use single quotes; integers are bare; NULL is allowed:
   ```sql
   EXECUTE dbo.P1TeamSetNinja @Slot = 2, @NinjaId = 43180
   EXECUTE dbo.P1Code @Code = 'TUAN47'
   EXECUTE dbo.P1UserRename @Name = 'NewName'
   ```

### 5.3 Response semantics

- `table`: all rows.
- `row`: the first row only; `null` for an empty set.
- `scalar`: the first column of the first row, stringified in `value`.
- `dataset`: one nested array per result set; useful for procedures that return multiple logical tables.
- `nonquery`: no data; used for mutations where the client only needs success/failure.

Examples:

```json
// POST /api1/api/sql/table
{"sql":"EXECUTE dbo.P2Info"}
→ [{"Id":287,"Name":"QaProbe","Lv":6,...}]
```

```json
// POST /api1/api/sql/scalar
{"sql":"EXECUTE dbo.P2Info"}
→ {"value":"287"}
```

```json
// POST /api1/api/sql/dataset
{"sql":"EXECUTE dbo.P2Info"}
→ [[{"Id":287,"Name":"QaProbe",...}]]
```

> **Security note.** The proxy is a SQL surface owned by the game server. Do not attempt SQL injection, procedure enumeration beyond the client-visible whitelist, or automated mutation loops. The examples above are for authorized interoperability testing only.

---

## 6. Dedicated route reference

The following sections cover all **51** dedicated routes. Unless stated otherwise, a route is on the **server base** (`/api1/api`) and requires a server-bound token. Global routes are called out explicitly. Route paths are shown relative to their base: for example, `/battle` on the server base means `https://naruto.id.vn/api1/api/battle`, while `/session/login` on the global base means `https://naruto.id.vn/api/api/session/login`.

### 6.1 Shared response objects

#### `BattleResult`

Used by `/battle`, `/battle/rank`, `/battle/plunder`, `/battle/guild`.

```ts
type BattleResult = {
  Id: number | null;        // battle id, usable with /battle/9vs9/log
  Error: string | null;     // null on success
  KeyItem: number;          // 0 or item id
  KeyName: string | null;
  KeyImg: string | null;
  LevelUp: number;          // player levels gained
  ExpGained: number;
}
```

A non-null `Id` means the battle was simulated. It does **not** always mean the player won. Verify with `/battle/9vs9/log` (`Win`) before treating a stage/rank/plunder attempt as a success.

#### `PlayerState` (`P4MainLoad` / `P2Main`)

```ts
type PlayerState = {
  Name: string;
  Lv: number;
  LvExp: number;
  LvFullExp: number;
  Diamond: number;
  Gold: number;
  Energy: number;
  BP: number;
  ScratchFreeAvailable: number;      // 0/1
  GiftDayUnclaimedCount: number;
  GiftUnclaimedCount: number;
  UnlockedSlots: number;
  Notice: string;                    // rich-text event notice, English
  Notice2: string;                   // rich-text event notice, Vietnamese
  ShowNoticeOnMain: number;
  CatOpen: number;
  Vip: number;
  VipExp: number;
  NextVipPoint: number;
  EnergyCap: number;
  SushiBoughtToday: number;
  SushiMaxToday: number;
  BpBoughtToday: number;
  BpMaxToday: number;
  AutoSkip: boolean;
  SushiPrice: number;
  BpPrice: number;
  BpCap: number;
  DiamondUnclaimedCount: number;
  TurnplateFreeCount: number;
  ChakraTreeOpen: number;
  ChakraTreeSeconds: number;
  FastBattlePlot: boolean;
  FastBattleTraining: boolean;
  FastBattleUltimate: boolean;
  NewbieDue: boolean;
}
```

`Sushi` is the internal name for the purchasable Energy item; `Bp` is Battle Point.

#### `TeamMember` (`P3Team`)

```ts
type TeamMember = {
  Slot: number;
  NinjaId: number | null;
  Ninja: number | null;              // template id
  NinjaName: string | null;
  NinjaImg: string | null;
  Star: number | null;
  Ascend: number | null;
  Lv: number | null;
  LvExp: number | null;
  Attribute: number | null;          // 1..5 element
  Tier: number | null;               // 0 normal, 1 Super, 2 Kage
  Beast: number | null;
  Atk: number | null;
  Def: number | null;
  Skill1: number | null;
  Skill1Name: string | null;
  Skill1Img: string | null;
  Skill1Tier: string | null;
  Skill1TierImg: string | null;
  Skill1Info: string | null;
  Skill1InfoVi: string | null;
  Skill2: number | null;
  Skill2Name: string | null;
  Skill2Img: string | null;
  Skill2Tier: string | null;
  Skill2TierImg: string | null;
  Skill2Info: string | null;
  Skill2InfoVi: string | null;
  Bond1: number | null;
  Bond1Name: string | null;
  Bond1Info: string | null;
  Bond1Info2: string | null;
  Bond1Active: boolean | null;
  // Bond2..Bond4 use the same shape
  EquipAtkId: number | null;
  EquipAtkName: string | null;
  EquipAtkImg: string | null;
  EquipAtkLv: number | null;
  EquipAtkStar: number | null;
  EquipAtkAtk: number | null;
  EquipAtkDef: number | null;
  EquipDefId: number | null;
  EquipDefName: string | null;
  EquipDefImg: string | null;
  EquipDefLv: number | null;
  EquipDefStar: number | null;
  EquipDefAtk: number | null;
  EquipDefDef: number | null;
  TotalAtk: number | null;
  TotalDef: number | null;
  Bond1Type: number | null;
  Bond2Type: number | null;
  Bond3Type: number | null;
  Bond4Type: number | null;
}
```

The team table has 13 DB slots, but the UI/roster rules expose 10 usable slots: 9 battle slots plus 1 reserve for Bonds. Three formations (A/B/C) are stored separately.

#### `Mission`

```ts
type Mission = {
  Id: number;
  Period: number;        // 1 daily, 2 weekly, 3 monthly, 4 main story (observed groups)
  Name: string;
  Action: string;        // "checkin", "plot", "plunder", "ultimate", ...
  GoScene: string;
  Count: number;
  Target: number;
  Pct: number;
  State: number;         // 0 in progress, 1 ready to claim, 2 claimed (daily), 3 claimed/advanced (story, observed)
  RewardImg: string;
  RewardName: string;
  RewardQty: number;
  TabPct: number;
  TabReady: number;
  RewardList: unknown | null;
}
```

`P1MissionClaim2 @MissionId` returns the reward payload on success and sets `State` to `2`:

```ts
type MissionClaim = {
  Result: number;        // 1 success
  Item: number;          // item id
  Name: string;
  Img: string;
  Quantity: number;
  GiftType: number;
}
```

Observed: `{"Result":1,"Item":27,"Name":"Rainbow Pill","Img":"item/27","Quantity":10,"GiftType":0}` for mission `107`.

#### `ChatMessage` and `ChatPoll`

```ts
type ChatMessage = {
  Id: number;
  UserId: number;
  ToUserId: number;
  Name: string;
  ToName: string;
  Text: string;
  Time: string;          // "HH:mm" server time
}

type ChatPoll = {
  Admin: { ChatId: number; Text: string; Seconds: number };
  Me: number;            // current character id
  GuildId: number;
  World: ChatMessage[];
  WorldLast: number;
  Guild?: ChatMessage[];
  GuildLast?: number;
  Dm?: ChatMessage[];
  DmLast?: number;
  Del: number;           // deletion watermark (unix ms)
  Deleted: number;
  TailOnly?: number;
  GuildSummary?: number;
  DmSummary?: number;
}
```

#### `RankRow`

```ts
type RankRow = {
  RankNo: number;
  UserId: number;
  IsBot: boolean;
  Name: string;
  Lv: number | null;
  Img1: string | null; Img2: string | null; Img3: string | null;
  Star1: number | null; Star2: number | null; Star3: number | null;
  Tier1: number | null; Tier2: number | null; Tier3: number | null;
  Attr1: number | null; Attr2: number | null; Attr3: number | null;
}
```

---

### 6.2 Metadata and configuration

#### `POST /api/api/version` — global

No token required. Requires `X-Api-Key`; `X-Client-Version` is not enforced on this route.

**Request:** `{}` (ignored)

**Response:**

```json
{"version":"26.11.21"}
```

#### `GET /api/health` — public

No API key, no token, no version header. Returns `200` with an empty body. Useful as a reachability probe.

#### `POST /api/api/animation` — global

Also available on `/api1/api/animation` with a token. Returns the animation catalog.

**Request:** `{}`

**Response:** array of 297 objects:

```ts
type Animation = {
  AniCode: string;
  AniInfo: string;
  AniImg1: string | null;
  AniFrame1: number | null;
  AniImg2: string | null;
  AniFrame2: number | null;
  Element: number | null;
}
```

#### `POST /api1/api/config` — server

**Request:** `{}`

**Response:** object. Full observed key set:

```json
{
  "TurnplateSpinCost": 350,
  "TurnplateSpinX10Cost": 3500,
  "LegendaryDrawCost": 350,
  "ScratchCost": 20,
  "EquipRecastCost": 100,
  "AttributeRerollCost": 100,
  "UserRenameCost": 1000,
  "GuildRenameCost": 1000,
  "GuildCreateCost": 3000,
  "GiftDayMakeupCost": 100,
  "WorldWarMaxRank": 20,
  "FirstRechargeNeedDiamond": 2000,
  "FirstRechargeNeedVnd": 20000,
  "FirstRechargeNinjas": [
    {"Ninja":111,"Name":"Jiraiya","Attribute":2,"Star":5},
    {"Ninja":113,"Name":"Orochimaru","Attribute":1,"Star":5},
    {"Ninja":114,"Name":"Tsunade Senju","Attribute":5,"Star":5}
  ],
  "FirstRechargeItems": [
    {"Item":1103,"Name":"Arms 5* Atk","Img":"item/3"},
    {"Item":1104,"Name":"Armor 5* Def","Img":"item/4"}
  ],
  "StarterNinjas": [
    {"Ninja":21,"Name":"Naruto Uzumaki","Attribute":2,"Star":4},
    {"Ninja":15,"Name":"Sasuke Uchiha","Attribute":1,"Star":4},
    {"Ninja":22,"Name":"Sakura Haruno","Attribute":3,"Star":4},
    {"Ninja":69,"Name":"Kakashi Hatake","Attribute":4,"Star":4}
  ],
  "PlayerLevelCap": 120,
  "EquipMaxLv": 120,
  "NinjaMaxLv": 60,
  "EquipNormalLv": 60,
  "MaxAscend": 8,
  "UltimateMaxStage": 200,
  "UltimateRunsPerDay": 4,
  "TrainRunsPerDay": 3
}
```

#### `POST /api1/api/lang` — server

Returns localization deltas. The full static text is largely embedded in the client; this endpoint supplies changed/overridden strings.

**Request:** `{ "since": 0 }` where `since` is the last known `Ver`.

**Response:**

```ts
type LangDelta = {
  Ver: number;
  Reset: boolean;
  Items: Array<{ S: string; En: string; Vi: string }>;
}
```

Observed: `since:0` → 2 items; `since:1` → 1 item; `since:2` → 0 items; `since:3` (future) → `Reset:true` plus 2 items. Treat `since` as a delta cursor, and use `Reset` to clear caches.

#### `POST /api1/api/ping` — server

**Request:** `{}` → `204` with empty body.

Without a token: `401` with `Invalid or missing session token.`

---

### 6.3 Session and account routes

See §4 for full request/response semantics. Route index:

| Route | Base | Auth | Purpose |
|---|---|---|---|
| `/session/register` | global | API key only | Create account |
| `/session/login` | global | API key only | Obtain token |
| `/session/select-server` | server | token | Bind to character/server |
| `/session/new-user` | server | token | Create character |
| `/session/new-user-info` | server | token | Alpha/name eligibility |
| `/session/random-name` | server | token | Generate a name |
| `/session/logout` | server | token | Logout |
| `/account/contact` | global | token | Save email/phone |
| `/account/change-pass` | global | token | Change password |

---

### 6.4 Rewards, economy, and ascension

#### `POST /api1/api/ascend/info`

**Request:** `{ "id": 43179 }` (ninja instance id)

**Response (success):**

```ts
type AscendInfo = {
  Id: number;
  Error: string | null;
  Ascend: number;
  NextAscend: number;
  Star: number;
  Lv: number;
  Chance: number;       // percent
  Soul: number;         // souls required
  SoulOwned: number;
  Gold: number;         // gold required
  GoldOwned: number;
  BaseChance: number;
  FailBonus: number;
  FailStep: number;
}
```

Errors: `{"Error":"NotFound"}` for an unknown/zero ninja id.

#### `POST /api1/api/ascend/run`

**Request:** `{ "id": 43179, "auto": 0 }`

- `auto` must be an **integer** `0` or `1`. Sending a JSON boolean produced `400` with an empty body in testing.
- `id` is the ninja instance id, not the template id.

**Response:**

```ts
type AscendRun = {
  Result: number;
  Ascend: number | null;
  Lv: number | null;
  Attempts: number;
  SoulSpent: number;
  GoldSpent: number;
  FailBonus: number;
}
```

Observed with insufficient souls: `{"Result":0,"Ascend":null,"Lv":null,"Attempts":0,"SoulSpent":0,"GoldSpent":0,"FailBonus":0}`. Code `1` is the expected success path; it was not reachable with the probe account.

#### `POST /api1/api/reward/item-rates`

**Request:** `{ "item": 1 }`

**Response:** array:

```ts
type ItemRate = { Star: number | null; Name: string | null; Pct: number }
```

Examples observed:

- `item:1` → star distribution 1★ 30%, 2★ 30%, 3★ 27%, 4★ 10%, 5★ 3%.
- `item:5` → 5★ 100%.
- `item:16` → one entry per Tailed Beast name, 11.11% each (9 entries plus a remainder).
- `item:1001` → 3★ 65%, 4★ 27%, 5★ 8%.
- Unknown items return `[]`.

#### `POST /api1/api/reward/use-item`

**Request:** `{ "item": 7, "quantity": 1 }`

**Response:** array with one entry per item/use:

```ts
type UseItemResult = {
  Result: number;
  UseType?: number | null;
  Gained?: number | null;       // currency/energy/BP amount for UseType 1-4
  Name?: string | null;         // entity name for egg opens
  Name2?: string | null;        // localized name
  Img?: string | null;          // e.g. "ninja/171", "equip/63"
  Quantity?: number | null;
  Star?: number | null;         // entity star for egg opens
  UsedToday?: number;
  PerDay?: number;
}
```

`UseType` observed values:

| UseType | Meaning | Result shape |
|---|---|---|
| `0` | Exchange material / no immediate effect | `{Result:0}` or `{Result:1}` |
| `1` | Gold | `{Result:1,Gained:<gold>}` |
| `2` | Diamond | `{Result:1,Gained:<diamond>}` |
| `3` | Energy | `{Result:1,Gained:<energy>,UsedToday,PerDay}` |
| `4` | Battle Points | `{Result:1,Gained:<bp>}` |
| `5` | Ninja egg | `{Result:2,Name,Img,Quantity,Star}` |
| `6` | Equipment egg | `{Result:2,Name,Name2,Img,Quantity,Star}` |
| `7` | Gem | `{Result:1,...}` or gem payload |

Observed:

- Item 49 ("100 diamond", UseType 2): `quantity:12` → `[{"Result":1,"UseType":2,"Gained":1200,...}]`; `quantity:2` → `+200`. The quantity is the number of items consumed; `Gained` is the total currency added.
- Energy food: Sushi (item 13) → `{"Result":1,"UseType":3,"Gained":60,"UsedToday":1,"PerDay":15}`; Ramen (item 7, ×2) → `Gained:40,"UsedToday":3`. `UsedToday` is cumulative across all Energy items and is capped by VIP (`PerDay:15` at VIP 0).
- Energy food when Energy is full or the daily cap is hit → `{"Result":6,"UseType":3,"UsedToday":<n>,"PerDay":15}`.
- **Partial consumption at the cap:** `quantity:4` with only 2 items of headroom returned `{"Result":1,"UseType":3,"Gained":120,"Quantity":2,"UsedToday":15,"PerDay":15}`. The server consumed 2, left 2 in the bag, and `Gained` reflects only the consumed items. Do not infer the consumed count from the request `quantity`; read the response `Quantity`.
- Ninja eggs: item 5 ("Ninja 5*") → `{"Result":2,"Name":"Manda","Img":"ninja/171","Quantity":1,"Star":5}`; item 1001 ("Ninja 3-5* Egg") → one entry per egg with the rolled ninja and star.
- Equipment eggs: item 1003/1004 → one `{Result:2,Name,Name2,Img,Quantity,Star}` per egg (e.g. 5★ Gunbai Fan, 4★ Seversword).
- Cave material (item 56): `[{"Result":0}]` (accepted/no immediate effect).
- `Result:0` is the generic no-op path; `Result:2` means an egg was opened and the payload describes the entity; `Result:6` is a context/daily-limit rejection. Do not treat `Result:2` as an error on egg items.

#### `POST /api1/api/reward/key-open`

**Request:** `{ "keyType": 1 }` (`1` Bronze, `2` Silver, `3` Gold)

**Response:**

```ts
type KeyOpenResult = {
  Result: number;
  RewardName: string | null;
  RewardImg: string | null;
  RewardQty: number | null;
  RemainingKey: number | null;
  IsMultiplier: number | null;       // 0/1
  MultiplierValue: number | null;
  TotalMultiplier: number | null;
}
```

Observed with zero keys: `Result:2` and all reward fields `null`. Observed success (Bronze key, bought for 50,000 Gold):

```json
{"Result":1,"RewardName":"Ramen","RewardImg":"item/7","RewardQty":2,
 "RemainingKey":0,"IsMultiplier":0,"MultiplierValue":0,"TotalMultiplier":1}
```

`Result:1` is the success path; `RemainingKey` is the count left after the open. `Result:2` with null reward fields means no key of that type.

Additional observed sequence (Bronze ×3, then Silver ×1):

| Open | Response |
|---|---|
| Bronze 1 | `RewardName:"Gold bag"`, `RewardQty:1`, `RemainingKey:2` |
| Bronze 2 | `RewardName:"Silver Key"`, `RewardQty:1`, `RemainingKey:1` |
| Bronze 3 | `RewardName:""`, `RewardQty:0`, `RemainingKey:0`, `IsMultiplier:1`, `MultiplierValue:2`, `TotalMultiplier:2` |
| Silver 1 | `RewardName:""`, `RewardQty:0`, `RemainingKey:0`, `IsMultiplier:1`, `MultiplierValue:2`, `TotalMultiplier:2` |

A multiplier result is a bonus roll rather than a named item; verify the bag before assuming a reward was lost. Read `P2KeyStatus` for `{Bronze,Silver,Gold,MultBronze,MultSilver,MultGold}` before opening.

#### `POST /api1/api/reward/house-draw`

**Request:** `{ "btn": 1 }` (`1` = 1,000 Gold, `2` = 5,000, `3` = 30,000, `4` = 80,000)

**Response:**

```ts
type HouseDrawResult = {
  Result: number;
  NextBtn: number;
  Ninja: number;       // template id, not instance id
  Gold: number;        // remaining Gold
  Star: number;        // 1..5
}
```

Observed: `{"Result":1,"NextBtn":2,"Ninja":6,"Gold":119850,"Star":2}`.

The 80,000 pack is the only one guaranteed to roll 3–5★ ninjas. Each draw can randomly unlock the next pack.

#### `POST /api1/api/first-recharge/info`

**Request:** `{}`

**Response:**

```json
{"Recharged":0,"Need":2000,"Claimed":0,"Ninja":0}
```

- `Recharged`: Diamond-equivalent top-up total.
- `Need`: threshold from config (2,000 Diamond / 20,000 VND).
- `Claimed`: whether the one-time gift was taken.
- `Ninja`: chosen ninja template id, or `0`.

#### `POST /api1/api/first-recharge/claim`

**Request:** `{ "ninja": 111 }` (one of 111/113/114; `0` observed returns `Result:0`)

**Response:** `{"Result":0}` when not eligible; `Result:1` is the success path. The gift includes one 5★ ninja plus a 5★ weapon egg and a 5★ armor egg.

#### `POST /api1/api/recharge-gift/info`

**Request:** `{}`

**Response:** a two-element nested array:

```ts
type RechargeGiftInfo = [
  Array<{
    Rank: number;
    Total: number;
    TotalVnd: number;
    TierTop: number;
    TierFrom: number;
    NextTierTop: number;
    NextTierFrom: number;
    NextNeed: number;
    NextNeedVnd: number;
    NextRankGap: number;
    ResetSec: number;
  }>,
  Array<{
    TierTop: number;
    RankFrom: number;
    MinRecharge: number;
    MinRechargeVnd: number;
    IsMine: number;
  }>
]
```

The second table describes the daily top-up tiers: Top 1, Top 2–3, Top 4–10, Top 11–20, Top 21–50, with minimum recharge requirements.

---

### 6.5 Battle and competitive routes

#### `POST /api1/api/battle` — story/PvE battle

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `opponentId` | int | Yes | Story stage `Scid` (1..335); also used as bot/opponent id in some modes |
| `isBot` | bool | Yes | `true` for the story/bot path |
| `atkOrDef` | int | No | Attack/defense side selector |
| `isPlunder` | bool | No | Plunder variant flag |
| `ultimateBot` | bool | No | Ultimate Trial variant |
| `buffAtkPct` | number | No | Ultimate buff |
| `buffEnemyDefPct` | number | No | Ultimate buff |
| `buffChancePct` | number | No | Ultimate buff |
| `buffMaxAbs` | number | No | Ultimate buff |
| `buffEnemyChancePct` | number | No | Ultimate buff |
| `trainAttrMask` | int | No | Training element mask |
| `trainDebuffPct` | number | No | Training debuff |

The client method signature is:

```text
Battle(opponentId, isBot, callback, atkOrDef, isPlunder, ultimateBot,
       buffAtkPct, buffEnemyDefPct, buffChancePct, buffMaxAbs,
       buffEnemyChancePct, trainAttrMask, trainDebuffPct)
```

**Response:** `BattleResult`.

**Observed**

- `{"opponentId":2,"isBot":true}` → success, battle id; player gained Gold and Energy/level changes.
- `{"opponentId":5,"isBot":true}` initially → `{"Id":null,"Error":"Locked"}` until stage 4 was cleared.
- Successful stage clears advance `P2StageProgress.Scid`.
- A non-null `Id` can still be a loss. `38243` and `38244` returned a normal `BattleResult` but `/battle/9vs9/log` reported `Win:false`.
- Costs Energy for story stages; a level-up can refill Energy.
- `Error:"NoNinja"` means no valid battle team.
- The `ExpGained` field in the response can be `0` even on a win that grants EXP. Verify with `P4MainLoad` (`Lv`, `LvExp`) before and after.
- Repeat clears do not pay the full `P3StageList.Exp` value; the catalog value appears to include a first-clear bonus. Measured: stage 4 (10 Energy, catalog 208) gave **166 EXP** on repeat; stage 149 (21 Energy, catalog 84) gave **54 EXP**. Early-stage farming is much more Energy-efficient for level breakpoints, while the wall stage pays more Gold.

**Story stage data** (`P3StageList`): 6 task groups, 67 chapters, 335 stages. Stage rows:

```ts
type Stage = {
  Chapter: number;
  ChapterName: string;
  ChapterNameVi: string;
  Scid: number;
  StageNo: number;
  Info: string;
  InfoVi: string;
  Energy: number;
  Exp: number;
  Gold: number;
  IsBoss: boolean;
}
```

#### `POST /api1/api/battle/rank`

**Request:** `{ "targetRankNo": 1 }`

**Response:** `BattleResult`.

- Costs 1 BP.
- You may only challenge a player ranked above you; a win swaps ranks.
- `NoTarget` for a rank that does not exist (e.g. 100 at the time of testing).
- `NoBP` when Battle Points are exhausted.
- Daily Top 100 receive Chakra Pills by mail; the amount depends on final rank.
- Companion reads: `P2RankList` (nearby ranks, 10 rows), `P2RankTop20`, `P3UltimateRank`.

#### `POST /api1/api/battle/plunder`

**Request:** `{ "targetUserId": 49 }`

**Response:** `BattleResult`.

Rules from the in-game help:

- Win: steal up to 20,000 Gold per battle, never more than the target owns.
- Lose: steal nothing; the target keeps their Gold.
- Maximum 60,000 Gold per day from the same target.
- Each attempt costs 1 BP.

Observed errors: `NoGold` on tested targets even when their profile displayed Gold; this likely reflects protected/stealable Gold rules rather than literal zero balance. `NoBP` when out of BP.

#### `POST /api1/api/battle/plunder-list`

**Request:** `{}`

**Response:** an array of groups. Group index `0` contains rows with `Grp:1` (higher-level / wider bracket targets); group index `1` contains `Grp:2` (same-bracket targets). At Lv22 the first group had 10 rows and the second was empty.

```ts
type PlunderTarget = {
  Grp: number;              // 1 = wider/high-level group, 2 = same bracket
  UserId: number;
  Name: string;
  Lv: number;
  Gold: number;
  Img1: string | null; Img2: string | null; Img3: string | null;
  Star1: number | null; Star2: number | null; Star3: number | null;
  Tier1: number | null; Tier2: number | null; Tier3: number | null;
  Attr1: number | null; Attr2: number | null; Attr3: number | null;
}
```

Direct plunder of the two owned test accounts (`UserId 287` / `288`) returned `NoGold` even though one alt displayed 200,000 Gold. This confirms that `NoGold` is a stealable-Gold/protection check, not a literal balance check; it is also consistent with the game blocking attacks on linked/alt accounts. Use the list and pick another target rather than retrying.

Companion read: `P2PlunderTop20` returns the day's top plunderers (UserId, Name, TotalGold, Vip), not the target list.

#### `POST /api1/api/battle/tails`

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `targetUserId` | int | Yes | Player to attack |
| `beastId` | int | Yes | 1..10 |
| `chipNo` | int | Yes | 1-based chip slot; `0` → `NoChip` |

**Response:**

```ts
type TailsBattleResult = {
  Id: number | null;
  Error: string | null;
  Win: boolean;
  ChipWon: boolean;
  GoldWon: number;
  LevelUp: number;
  ExpGained: number;
}
```

Observed:

- Beast 1, chip 1, target 49 → success, `Id:38251`, `Win:false`, `ChipWon:false`, 1 BP spent.
- Beast 2 before unlock → `Locked`.
- `chipNo:0` or target 0 → `NoChip`.
- `NoBP` when out of BP.

Companion reads: `P4Tails` (10 beasts, chip counts, levels, unlock chain), `P3TailsChipHolders @BeastId`.

#### `POST /api1/api/battle/train`

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `cave` | int | Yes | 1 Mount Myoboku, 2 Ryuchi Cave, 3 Shikkotsu Forest |
| `tier` | int | Yes | Difficulty tier |
| `mode` | int | Yes | 1 attack, 2 defense (3 total runs per mode) |
| `stageNo` | int | Yes | Stage in the cave |

**Response:**

```ts
type TrainBattleResult = {
  Result: number;
  Id: number | null;
  Error: string | null;
  Win: number;
  Gold: number;
  ItemId: number;
  ItemQty: number;
  MaxStage: number;
}
```

Observed:

- Closed cave → `Result:3`, `Error:"Closed"`. On Saturday 21/11/2026 cave 1/2 were closed (`IsOpen:0`) and returned `Closed`; cave 3 was open (`IsOpen:1`).
- Open cave but player below requirement → `Result:4`, `Error:"LowLevel"`. Cave 3 returned `LowLevel` at Lv10, Lv19, Lv20, Lv21 and Lv23, with team power up to 4,569, for `tier` 0–50 and `stageNo` 0–2. The exact player/ninja-level threshold was not reached in these probes.
- `P3TrainStageList @Cave = <1|2|3>` returned `[]` while the account was in the `LowLevel` state. Calling it without `@Cave` also returns `[]`; the parameter is required.
- No runs left → `Result:2`, `Error:"NoRun"`.
- Success → `Result:1` (not observed yet because of the level gate).

Train rules: 3 caves rotate by server day (Mon/Thu/Sun; Tue/Fri/Sun; Wed/Sat/Sun); 6 runs/day total, 3 per mode; wrong-element ninjas lose power; Kage rank is exempt in cave 3. `P4TrainStatus` is the authoritative open/runs read; `OpenDays` uses `0` for Sunday.

#### `POST /api1/api/battle/ultimate`

**Request:** `{ "mode": 1, "stageNo": 1, "star": 1 }`

- `mode`: `1` attack, `2` defense.
- `stageNo`: the stage to attempt; use `P4UltimateStatus.NextStage` (observed calls included it).
- `star`: at least `1`; `0` or missing → `BadParam`.

**Response:**

```ts
type UltimateBattleResult = {
  Result: number;
  Id: number | null;
  Error: string | null;
  StageNo: number;
  Star: number;
  Gold: number;
}
```

Observed:

- `Result:1` means the stage request was accepted and a run/stage was consumed — **not necessarily a win**. The first probe returned `Result:1, StageNo:1, Gold:0` but `/battle/9vs9/log` reported `Win:false`. Always verify `Win` via the log.
- A win on mode 2 returned `Result:1, StageNo:1, Gold:35`; subsequent wins advanced `StageNo` to 2, 3, 4, 5 with Gold 40, 50, 55 and `Win:true` each time.
- `star` is a difficulty/wager multiplier: `star:2` at stage 3 added 2 to `StarEarned` and returned more Gold. `StarMax` grew as `3 × StageNo` (3, 6, 9, …); `StarEarned` is the sum of the star values you cleared.
- Every 3rd stage sets `PendingBuff:1`. The next battle returns `Result:3, Error:"Pending"` until you call `P1UltimateBuyBuff @Mode = <mode>` (returns `Result:1` when a buff is pending, `Result:3` when none is pending). Adding `@BuffId` was not accepted (`Result:3`); the server chooses/records the buff. No visible Star deduction or `Buff*` stat change was observed in `P4UltimateStatus` after the purchase — treat the displayed buff totals as unreliable and verify in battle.
- Every 5th stage sets `PendingReward:1` and blocks further battles with `Result:3, Error:"Pending"`. `P2UltimateClaim @Mode = <mode>` then returned `{Result:1, Item:10, Qty:1, Name:"Gold bag", Img:"item/10", StageNo:5}`. Claiming before stage 5 returned `{Result:0, Item:0, Qty:0, StageNo:<current>}`.
- `RunsLeft` is **not** a per-stage counter. Mode 1 went `2 → 1` on its first battle and stayed `1` after the next stage win; mode 2 stayed at `2` across five consecutive wins, later read `1`, and stayed `1` after a sixth-stage win. Treat it as consumed at chain/run boundaries; re-read `P4UltimateStatus` after every battle and stop at `0` or on `NoRun`.
- Stage 6 (divisible by 3) set `PendingBuff:1` again, confirming the every-3-stage cadence after the stage-5 reward.
- Ultimate does **not** change player EXP; only Gold is credited. It is a Gold/ranking mode, not a leveling mode.
- `InRun:1` means a chain is active; `NextStage` is the next stage number. Mode 1 and mode 2 keep separate `StageNo`, `Star`, and rank state.
- No runs left → `Result:2`, `Error:"NoRun"`.
- Invalid mode/star → `Result:0`, `Error:"BadParam"`.
- Low level / locked → `Result:4`, `Error:"LowLevel"`.

Ultimate rules: 4 runs/day per mode is the design value, but the live account started with **2** `RunsLeft`; treat `P4UltimateStatus.RunsLeft` as authoritative. Separate Attack/Defend progress, stage 200 cap, buff every 3 stages, gift every 5 stages. Rewards include Gold per stage and a Gold bag every 5 stages; daily rank pays additional rewards. Companion reads: `P4UltimateStatus @Mode`, `P3UltimateBuffList @Mode`, `P3UltimateRank`; claim with `P2UltimateClaim @Mode`, buy/clear a pending buff with `P1UltimateBuyBuff @Mode`.

#### `POST /api1/api/battle/boss`

**Request:** `{}`

**Response:**

```ts
type BossResult = {
  Result: number;
  Id: number | null;
  Error: string | null;
  CooldownRemain: number;
  Dame: number;
  HP: number;
  MaxHP: number;
  Fame: number;
  FameGain: number;
  LastHit: number;
  Drops: string;
  GiftItem: number;
  GiftQty: number;
  GiftName: string;
  GiftImg: string;
}
```

Observed outside the event window: `Result:4`, `Error:"Closed"`, zeros. Observed after the shared boss was killed early in an open window: `Result:5`, `Error:"Defeated"`, with `HP:0` and `Defeated:1` in `P2BossInfo`. Companion read: `P2BossInfo`. The boss is free, has a 20-second cooldown, and runs 12:00–13:00 and 19:00–21:00 UTC+7. Top 10 damage and the killing blow receive mail rewards.

#### `POST /api1/api/battle/guildboss`

**Request:** `{}`

**Response:**

```ts
type GuildBossResult = {
  Result: number;
  Id: number | null;
  Error: string | null;
  CooldownRemain: number;
  HitsLeft: number;
  Dame: number;
  HP: number;
  MaxHP: number;
  Killed: number;
  Drops: string;
  GuildExp: number;
  Contribution: number;
  GuildLv: number;
  LevelUp: number;
}
```

Observed without a guild: `Result:4`, `Error:"NoGuild"`.

Observed with a guild (Guild Lv1, boss Shukaku, 3,000,000 HP, 5 hits/day, 30 s cooldown):

- Hit: `Result:1`, `Id`, `HitsLeft:4`, `Dame:4020`, `HP:2995980`, `GuildExp:20`, `Contribution:20`, `Killed:0`.
- `/battle/9vs9/log` reported `Win:false` for the same hit. **Guild boss is a damage exchange, not a win/loss battle**; `Win:false` does not mean the hit failed. Use `Dame`/`HitsLeft`/`HP` to verify.
- Second hit after the cooldown: `Dame:4106`, `HitsLeft:3`, shared HP dropped to `2,991,571`.
- Immediate third hit: `Result:2`, `Error:"Cooldown"`, `CooldownRemain:17`, `HitsLeft` unchanged.
- `P2GuildBossInfo` reports the viewer's `HitsUsed`, `Dame`, `MyRank`, plus shared `HP`, `Killed`, `SecondsToReset`, `ExpPerHit`, `ContribPerHit`, `KillReward`, and `Rank1Reward`.

Companion reads: `P2GuildBossInfo`, `P3GuildBossRank` (`{RankNo,UserId,Name,Lv,Dame,Hits,IsMe}`).

#### `POST /api1/api/battle/guild`

**Request:** `{ "targetUserId": 49 }`

**Response:** `BattleResult`.

Observed: `NoTarget` when the target is not a valid guild-battle opponent. Guild battles cost 1 BP, max 3 fights/day against the same player. Companion reads: `P3GuildBattleList`, `P3GuildMemberList`.

#### `POST /api1/api/battle/9vs9/demo`

**Request:** `{}`

**Response:**

```ts
type BattleDemo = {
  Result: number;
  Id: number;
  BattleLog: string;
}
```

Observed success: `Result:1`, a battle id, and a full `BattleLog`. This is a free demo/simulation and does not consume Energy or BP in testing.

#### `POST /api1/api/battle/9vs9/log`

**Request:** `{}` or `{ "id": 38226 }`

**Response (found):**

```ts
type BattleLogResult = {
  Result: number;
  Id: number;
  CreatedAt: string;   // "YYYY-MM-DD HH:mm:ss" server time
  MeTeam: number;      // 1 or 2
  Win: boolean;
  BattleLog: string;
}
```

Not found / no id:

```json
{"Result":0,"Id":0,"CreatedAt":"","MeTeam":1,"Win":false,"BattleLog":""}
```

This endpoint is the authoritative way to check whether a battle was a win. It works for story, rank, tails, and Ultimate battles by id.

`BattleLog` is an opaque line format. Example (truncated):

```text
V9|1
U|15|21|2|0|1000|Nine-Tails Chakra Mode~H~3~Images/animation/50049~~0|~A~0~~~0
U|14|20|2|0|1000|~A~0~~~0|~A~0~~~0
U|16|19|5|0|1000|~A~0~~~0|~A~0~~~0
G|15|1|15:300,14:300,16:300|0
```

#### `POST /api1/api/battle/9vs9/skill-preview`

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `ninja` | int | Yes | Ninja template id, e.g. 21 |
| `skillNum` | int | Yes | 1 or 2 |
| `ninjaId` | int | Yes | Owned ninja instance id |
| `equipId` | int | No | Equipment instance id, or 0 |

**Response:**

```ts
type SkillPreview = {
  Result: number;
  Area: number;
  Kind: string;        // "H", "A", "L", ...
  Count: number;
  Side: number;
  Cells: string;       // "4,5,6"
  Effect: number;
  Percent: number;
  GemPct: number;
  LifeStealPct: number;
  BossPct: number;
  BattleLog: string;
}
```

`skillNum:0` or an invalid ninja returns `{"Result":0}`. The `BattleLog` uses the same `V9|...` format and is useful for theorycrafting without running a real battle.

---

### 6.6 Chat

#### `POST /api1/api/chat/poll`

**Request**

| Field | Type | Notes |
|---|---|---|
| `world` | int | World cursor; `0`/omitted returns latest 100 |
| `guild` | int | Guild cursor |
| `dm` | int | DM cursor |
| `del` | int | Deletion cursor |
| `peek` | int/bool | Peek mode; no visible effect in tests |
| `tailOnly` | int/bool | Return summary counts plus tail; observed adds `TailOnly`, `GuildSummary`, `DmSummary` |

**Response:** `ChatPoll` (see §6.1). World is capped at 100 messages. Without `tailOnly`, the response includes full `World`/`Guild`/`Dm` arrays; with it, summary counts are added.

#### `POST /api1/api/chat/send`

**Request:** `{ "type": 1, "toUserId": 0, "text": "hello" }`

Channel mapping observed:

| `type` | Channel | `toUserId` rule | Result |
|---|---|---|---|
| `1` | World/Server | must be `0` | `1` on success |
| `2` | Guild | must be `0` | `5` when not in a guild |
| `3` | Private message | valid other character id | `1` on success; `6` for self/no target |
| `0`, `4`, `5`, other | Invalid | — | `6` |

Result envelope:

```ts
type ChatSendResult = {
  Result: number;
  Id?: number;
  Text?: string;
  Time?: string;
  MuteSeconds?: number;
}
```

Observed errors:

- `3`: invalid `toUserId` for the chosen channel (e.g. world message with a target, or guild message with a target).
- `5`: guild channel unavailable because the character has no guild.
- `6`: invalid channel/self-target/rate limit; `MuteSeconds` carries a mute/cooldown if any.

Text can be filtered/censored by the server; the returned `Text` is authoritative. Do not assume the submitted string is stored verbatim.

#### `POST /api1/api/chat/block`

**Request:** `{ "userId": 196, "block": 1 }` (`block:0` unblocks)

**Response:** `{"Result":1}`.

#### `POST /api1/api/chat/blocks`

**Request:** `{}`

**Response:** array:

```ts
type BlockedUser = { Id: number; Name: string }
```

---

### 6.7 Guild

#### `POST /api1/api/guild/info`

**Request:** `{}`

**Response without a guild:** `{"GuildId":null}`.

**Response with a guild** (observed for `ProbeGuild`, GuildId 7):

```ts
type GuildInfo = {
  GuildId: number;
  GuildName: string;
  Lv: number;
  Exp: number;
  ExpNext: number;
  Menber: number;            // server typo for "Member"
  MaxMember: number;
  MaxDeputy: number;
  Contribution: number;      // the viewer's contribution
  ContributionTotal: number;
  GoldOwned: number;
  DiamondOwned: number;
  EmblemImg: string | null;
  D1CostGold: number; D1CostDiamond: number; D1Exp: number; D1Contribution: number; D1Limit: number; D1Left: number;
  D2CostGold: number; D2CostDiamond: number; D2Exp: number; D2Contribution: number; D2Limit: number; D2Left: number;
  D3CostGold: number; D3CostDiamond: number; D3Exp: number; D3Contribution: number; D3Limit: number; D3Left: number;
}
```

Observed: Lv1, `ExpNext:1000`, `MaxMember:20`, `MaxDeputy:1`; D1 = 50,000 Gold / 10 EXP / 10 contribution / 3 per day; D2 = 50 Diamond / 50 EXP / 60 contribution / 1 per day; D3 = 200 Diamond / 220 EXP / 250 contribution / 1 per day. `Contribution` and `ContributionTotal` are the **viewer's** current/lifetime contribution, not the guild's total; the same guild can show different values to different members. `GoldOwned`/`DiamondOwned` are the viewer's balances.

**Companion read:** `P2MyGuildInfo`:

```ts
type MyGuildInfo = {
  GuildId: number | null;
  IsLeader: number;          // 1 for the leader
  GuildName: string | null;
  GuildLv: number | null;
  Role: number;              // 2 leader, 1 deputy, 0 member
}
```

#### `POST /api1/api/guild/emblems`

**Request:** `{}`

**Response:** array of emblems (empty without a guild):

```ts
type GuildEmblem = {
  Ninja: number;
  Name: string;
  Img: string;
  Star: number;
  Tier: number;
  State: number;             // 1 owned/unlocked, 2 locked/purchasable
  UnlockLv: number;          // guild level required
  Price: number;             // Diamond price for State 2
}
```

Observed: 80 `State:1` and 132 `State:2` entries; prices `0`, `200`, `500`, `1000`; unlock guild levels `1`, `3`, `6`, `9`. **All `State:2` (purchasable) emblems require guild level 3, 6, or 9**; at guild Lv1 no emblem is purchasable, even with enough Diamond.

#### `POST /api1/api/guild/donate`

**Request:** `{ "type": 1 }` (1 Gold, 2 Diamond-50, 3 Diamond-200)

**Response:**

```ts
type GuildDonateResult = {
  Result: number;
  Lv: number;
  Exp: number;
  ExpNext: number;
  LevelUp: number;
  GoldSpent: number;
  DiamondSpent: number;
  GuildExp: number;
  Contribution: number;
}
```

Observed type 1: `{"Result":1,"Lv":1,"Exp":40,"ExpNext":1000,"LevelUp":0,"GoldSpent":50000,"DiamondSpent":0,"GuildExp":10,"Contribution":10}`. Without a guild, `Result:0`. The `D*Left` counters in `guild/info` decrement per donation. Type 2: `{"Result":1,"Lv":1,"Exp":130,"ExpNext":1000,"DiamondSpent":50,"GuildExp":50,"Contribution":60}`. Type 3: `{"Result":1,"Lv":1,"Exp":350,"ExpNext":1000,"DiamondSpent":200,"GuildExp":220,"Contribution":250}`. After using D2/D3, `D2Left`/`D3Left` become `0`, so no further donation of that tier is available that day.

#### `POST /api1/api/guild/emblem/set`

**Request:** `{ "ninja": 1 }`

**Response:** `{"Result":1,"Ninja":1,"Img":"ninja/1","Price":0}` for an owned emblem. A locked emblem (e.g. ninja 21, `State:2`) returns `{"Result":0}`. Without a guild, `Result:0`.

#### `POST /api1/api/guild/emblem/buy`

**Request:** `{ "ninja": 21 }`

**Response:** `{"Result":3}` when the emblem price exceeds the current Diamond balance; `{"Result":4}` when the emblem is not purchasable — guild level below its `UnlockLv`, or the emblem is already owned (observed at guild Lv1 for every `State:2` emblem with enough Diamond, and for owned `ninja:1`); `Result:0` without a guild. `Result:1` is the success path (not observed, because the test guild was Lv1).

#### Guild lifecycle and management (SQL procedures)

Guild creation, joining, approval, kicking, roles, and rename are **not** dedicated routes; use these procedures:

- `P1GuildCreate @Name = N'ProbeGuild'` takes **only** `@Name`. Adding `@Notice` or other parameters returns HTTP `500`.
- Create cost is **3,000 Diamond** (`GuildCreateCost`); rename cost is **1,000** (`GuildRenameCost`).
- With 2,705 Diamond, create returned `[{"Result":3,"GuildId":null,"NewDiamond":null}]` — `Result:3` is the insufficient-Diamond path.
- With 3,005 Diamond, create succeeded: `[{"Result":1,"GuildId":7,"NewDiamond":5}]`.
- Join is request-based: `P1GuildRequestJoin @GuildId = 7` → `[{"Result":1}]`; `P2MyGuildInfo` stays `GuildId:null` while pending.
- `P3GuildRequestList` shows **your outgoing** requests, e.g. `{Mode:3,GuildId:6,UserId:287,Name:"THienlong",Lv:1,IsReject:0,RejectAt:null}`.
- `P1GuildRequestCancel @GuildId = 6` returned `[{"P1GuildRequestCancel":null}]` and cleared the list.
- `P1GuildRequestPending` is a scalar result: `[{"Result":"1"}]` for a leader with a pending request, `[{"Result":"0"}]` for a non-leader. It does **not** return the request list.
- Approve with `P1GuildAcceptMember @TargetUserId = 287` → `[{"Result":1}]`; reject with `P1GuildRejectRequest @TargetUserId = <id>` → `[{"Result":1}]`.
- After a rejection, `P3GuildRequestList` keeps the row with `IsReject:1` and `RejectAt` (e.g. `"2026-11-21T14:06:30.549"`). An immediate `P1GuildRequestJoin` returned `[{"Result":0}]`, but the leader could still `P1GuildAcceptMember` successfully; do not treat `Result:0` on re-request as a permanent block.
- After the member is accepted, `P3GuildRequestList` becomes `[]`.
- Kick with `P1GuildKickMember @TargetUserId = 287` → `[{"Result":1}]`; the kicked member's `P2MyGuildInfo` returns to null.
- A member can leave with `P1GuildLeave` → `[{"Result":1}]`; contribution resets to 0 on rejoin.
- Set a role with `P1GuildSetRole @TargetUserId = 287, @Role = 1` → `[{"Result":1}]`. Omitting `@Role` returns HTTP `500`. Role values observed: `2` leader, `1` deputy, `0` member.
- `P1GuildTransferLeader @TargetUserId = 287` → `[{"Result":1}]`; the target's `P2MyGuildInfo` becomes `IsLeader:1, Role:2` and the old leader becomes `Role:0`. Transferring back with the new leader's token works the same way.
- `P3GuildMemberList.ViewerIsLeader` / `ViewerRole` describe the **viewer**, not the row's target. A leader viewing the list sees `ViewerIsLeader:true` on every row; use the row's `Role`/`IsSelf` for the target's actual role.
- Rename with `P1GuildRename @Name = N'ProbeGuild2'` returned `[{"Result":3,"NewDiamond":null}]` with only 5 Diamond.
- `P1GuildDelete` exists but was not called (it would destroy the test guild).

**Member list** (`P3GuildMemberList`) rows:

```ts
type GuildMember = {
  Id: number;
  Name: string;
  Lv: number;
  Vip: number;
  Img1: string; Img2: string | null; Img3: string | null;
  RankNo: number | null;
  ViewerIsLeader: boolean;
  Role: number;              // 2 leader, 1 deputy, 0 member
  Contribution: number;
  ViewerRole: number;
  IsSelf: boolean;
  Star1: number;
  Tier1: number;
}
```

**Guild rankings** (`P3GuildRankList`): `{Id,Name,Lv,Menber,MaxMember,GuildScore,RankNo,EmblemImg,IsMine}`. Observed top guilds: Akatsuki (Lv4, 20/26, score 1214), ProbeGuild (Lv1, 1/20, 1000), THienlong (Lv1, 3/20, 999). `P3GuildList @Name = N'...'` searches guilds and adds `CanJoin`; own guild returns `CanJoin:0`.

**Guild boss** (`P2GuildBossInfo`, `P3GuildBossRank`, `/battle/guildboss`):

```ts
type GuildBossInfo = {
  Result: number;
  GuildLv: number;
  BeastIndex: number;
  BeastNinja: number;
  BeastName: string;
  BeastImg: string;
  HP: number; MaxHP: number;
  Killed: number;
  HitsPerDay: number;        // 5 at guild Lv1
  HitsUsed: number;          // per viewer
  CooldownSec: number;       // 30
  CooldownRemain: number;
  Dame: number;              // viewer's damage
  MyRank: number;
  ExpPerHit: number;         // 20
  ContribPerHit: number;     // 20
  ExpKill: number;           // 200
  SecondsToReset: number;
  KillReward: string;        // "Gold chest|1;Ninja Soul|3"
  Rank1Reward: string;       // "Ninja Soul|10"
}
```

Observed at guild Lv1: Shukaku (BeastNinja 1001), 3,000,000 HP, 5 hits/day, 30 s cooldown. A hit returned `Result:1`, `Dame:4020`, `HitsLeft:4`, `GuildExp:20`, `Contribution:20`, but `/battle/9vs9/log` reported `Win:false` — **guild boss damage is not a win/loss battle; `Win:false` does not mean the hit failed**. A second hit after the cooldown did 4,106 damage. An immediate third hit returned `Result:2, Error:"Cooldown", CooldownRemain:17`, with `HitsLeft` unchanged. `P3GuildBossRank` rows are `{RankNo,UserId,Name,Lv,Dame,Hits,IsMe}` and update after each hit.

**Guild battle:** `/battle/guild` with an unrelated `targetUserId` returned `NoTarget`. `P3GuildBattleList` returned only the player's own guild row (`{GuildId,GuildName,GuildScore,GuildRank,EmblemImg}`) outside an active guild-battle window; `GuildRank` was null.

---

### 6.8 World War

#### `POST /api1/api/worldwar/register`

**Request:** `{}`

**Response:** lowercase envelope:

```json
{"result":"6"}
```

Observed codes:

- `{"result":"6"}` for an **unranked** character (`RankNo:0`).
- `{"result":"7"}` for a **ranked but outside Top 20** character (`RankNo:68`).

The event is a cross-server bracket: registration locks at 17:50, battles at 18:00 UTC+7, and only the Top 20 ranked players may register (`WorldWarMaxRank: 20`). Companion reads: `P3WorldWarTeam` (team snapshot; 16 max participants observed), `P4WorldWarStatus @UName` (returned `500` in testing; treat as unstable).

---

### 6.9 SQL routes (dedicated reference)

These are covered in detail in §5; this is the route-level index.

| Route | Response |
|---|---|
| `/api1/api/sql/table` | `Row[]` |
| `/api1/api/sql/row` | `Row \| null` |
| `/api1/api/sql/scalar` | `{"value": string \| null}` |
| `/api1/api/sql/dataset` | `Row[][]` |
| `/api1/api/sql/nonquery` | `null` |

All use `{"sql":"EXECUTE dbo.<ProcName> ..."}`.

---

## 7. Result and error code reference

### 7.1 Symbolic `Error` strings

| Error | Meaning | Seen on |
|---|---|---|
| `NoNinja` | No valid ninja/team for the battle | `battle` |
| `Locked` | Stage/opponent/beast not unlocked | `battle`, `battle/tails` |
| `Closed` | Event/cave/boss is outside its open window | `battle/train`, `battle/boss` |
| `Defeated` | The shared boss has already been killed this session | `battle/boss` |
| `LowLevel` | Player does not meet the level/tier requirement | `battle/train`, `battle/ultimate` |
| `NoRun` | No daily runs left | `battle/train`, `battle/ultimate` |
| `NoBP` | Battle Points exhausted | `battle/rank`, `battle/plunder`, `battle/tails` |
| `NoGold` | No stealable Gold / plunder rule blocks the target | `battle/plunder` |
| `NoTarget` | Rank or guild-battle target not found/eligible | `battle/rank`, `battle/guild` |
| `NoChip` | Invalid/missing Tailed Beast chip slot | `battle/tails` |
| `NoGuild` | Character is not in a guild | `battle/guildboss` |
| `BadParam` | Invalid mode/star/parameter combination | `battle/ultimate` |
| `NotFound` | Ninja/item/entity not found | `ascend/info` |

These are game-level errors and normally arrive with **HTTP 200**. Do not infer success from the HTTP status alone.

### 7.2 Integer `Result` codes by route family

| Route family | Code | Meaning |
|---|---|---|
| `battle/train` | `0` | Bad parameter |
| | `1` | Success |
| | `2` | No runs left (`NoRun`) |
| | `3` | Cave closed (`Closed`) |
| | `4` | Low level / locked |
| `battle/ultimate` | `0` | Bad parameter |
| | `1` | Stage accepted (verify `Win` in the log) |
| | `2` | No runs left (`NoRun`) |
| | `3` | Pending buff or reward (`Pending`) |
| | `4` | Low level / locked |
| `P2UltimateClaim` (SQL) | `0` | No claimable milestone at the current stage |
| | `1` | Claimed a stage-5/10/… reward |
| `P1UltimateBuyBuff` (SQL) | `1` | Pending buff cleared/recorded |
| | `3` | No pending buff |
| `P1NinjaUpgrade` / `P1EquipUpgrade` (SQL) | `1` | Upgrade succeeded (`Lv`, `LvExp`, `Gained`, `Wasted`) |
| `P1TeamSetNinja` / `P1TeamSetEquip` (SQL) | `"1"` | Success (string) |
| `battle/boss` | `1` | Success (in window) |
| | `4` | Closed (out of window) |
| | `5` | Boss already `Defeated` |
| `battle/guildboss` | `1` | Hit accepted (damage dealt; verify `Dame`/`HitsLeft`, not `Win`) |
| | `2` | Cooldown (`Error:"Cooldown"`, `CooldownRemain`) |
| | `4` | `NoGuild` |
| `chat/send` | `1` | Success |
| | `3` | Invalid target for channel |
| | `5` | Guild channel unavailable / no guild |
| | `6` | Invalid channel/self-target/rate limit |
| `reward/key-open` | `0` | Failure |
| | `1` | Success (including multiplier rolls) |
| | `2` | No keys of that type |
| `reward/use-item` | `0` | Accepted/no-op |
| | `1` | Consumable effect applied (`Gained`) |
| | `2` | Egg opened; payload describes the entity |
| | `6` | Context/daily limit |
| `ascend/run` | `0` | Failure/insufficient materials (observed) |
| | `1` | Success (expected) |
| `first-recharge/claim` | `0` | Not eligible |
| | `1` | Success (expected) |
| `guild/*` | `0` | No guild / rejected |
| | `1` | Success (expected) |
| `guild/emblem/buy` | `1` | Success (not observed; requires guild level ≥3) |
| | `3` | Insufficient Diamond |
| | `4` | Not purchasable: guild level below `UnlockLv`, or already owned |
| `guild/emblem/set` | `1` | Owned emblem set |
| | `0` | Emblem locked/not owned, or no guild |
| `reward/house-draw` | `0` | Failure/insufficient Gold |
| | `1` | Success |
| `P1Code` (SQL) | `0` | Invalid/expired code |
| | `1` | Success |
| | `2` | Already used |
| `P1GuildCreate` (SQL) | `1` | Success |
| | `2` | Name exists (expected) |
| | `3` | Insufficient Diamond (observed at 2,705 < 3,000) |
| `P1GuildRename` (SQL) | `1` | Success (expected) |
| | `3` | Insufficient Diamond (observed at 5 < 1,000) |
| `P1GuildRequestJoin` (SQL) | `1` | Request created/pending |
| | `0` | Already pending, or immediate re-request after rejection |
| `P1GuildAcceptMember` / `RejectRequest` / `KickMember` / `Leave` / `TransferLeader` / `SetRole` (SQL) | `1` | Success |
| `P1MissionClaim2` (SQL) | `0` | Invalid/already claimed |
| | `1` | Success, reward payload returned |
| `P2MissionClaimAll` (SQL) | `0` | Nothing claimed (`Claimed:0`) |
| | `1` | Claimed one or more (`Claimed` count returned) |
| `P1DiamondSpendingClaim` (SQL) | `0` | Invalid milestone amount |
| | `1` | Success |
| | `3` | Milestone not reached yet |
| | `4` | Already claimed |
| `P1GiftDayClaim` (SQL) | `0` | Day locked or already claimed |
| | `1` | Success |
| `P1GiftClaim` (SQL) | `0` | Tier locked or already claimed |
| | `1` | Success |

### 7.3 Lowercase `result` envelope

| Context | Code | Meaning |
|---|---|---|
| Login | `"0"` | Wrong credentials |
| | `"1"` | Success |
| Register | `"0"` | Invalid input |
| | `"1"` | Success |
| | `"2"` | Username exists |
| Select server | `"0"` | No character |
| | `"-1"` | Not selectable/unbound |
| | numeric string | Character id |
| New user | `"0"` | Failure/already exists |
| | numeric string | New character id |
| Contact / change-pass | `"1"` | Success |
| | `"0"` | Failure/wrong old password |
| World War register | `"6"` | Unranked / not eligible |
| | `"7"` | Ranked but outside Top 20 |
| Random name | `"1"` | Success |

### 7.4 HTTP status patterns by route

| Pattern | Routes |
|---|---|
| `200` + JSON | Most read/action routes |
| `200` + empty | `session/logout`; some mutations |
| `204` + empty | `ping` |
| `401` | Missing/wrong API key; missing/invalid token; no server binding |
| `404` | Wrong base or unknown path |
| `405` | Wrong method; `Allow: POST` |
| `426` | Missing/wrong client version |
| `429` | Repeated `account/contact` / `account/change-pass` |
| `500` | Invalid procedure parameters or broken procedure |

---

## 8. Stored procedure catalog

The SQL proxy exposes **186 signatures**. Parameters are inlined as T-SQL; the names below are the parameter names used by the client metadata.

### 8.1 High-value procedure behavior

These are the procedures most useful for understanding or operating an account. They are grouped by purpose.

| Procedure | Important parameters | Behavior / response |
|---|---|---|
| `P0AddFriend` | `@S2` (name) | Send friend request |
| `P0AddRival` | `@S2` (name) | Add rival |
| `P0DeleteMail` | `@MailId` | Delete one mail |
| `P0DeleteMailAll` | — | Delete all mail |
| `P0GiftDayCheckIn` | — | Daily check-in; returns a column named `P0GiftDayCheckIn` |
| `P0NewbieDone` | `@Lv` | Mark tutorial/newbie step done |
| `P0Request` | `@S2` | Social request |
| `P0SelectSv` | `@UName` | Server/character selection primitive |
| `P0TeamBattleRefresh` | — | Refresh team battle state |
| `P0UnFriend` / `P0UnRival` | `@S2` | Remove friend/rival |
| `P1Clear` | `@Star` | Clear/claim a stage result with a star rating; did not advance story in isolation |
| `P1Code` | `@Code` | Gift code redeem: `0` invalid, `1` success, `2` already used |
| `P1GetTeam` | — | Read current formation; returns `Result:"A"` plus team data |
| `P1GuildCreate` | `@Name` | Create guild for 3,000 Diamond; only `@Name` is accepted (extra params → 500); success `{Result:1,GuildId,NewDiamond}`; `3` = insufficient Diamond |
| `P1GuildRequestJoin` / `P1GuildRequestCancel` / `P1GuildRequestResend` | `@GuildId` | Outgoing join request lifecycle; join/cancel return `{Result:1}` and `P3GuildRequestList` reflects the pending row |
| `P1GuildRequestPending` | — | Scalar: `"1"` for a leader with a pending request, `"0"` for a non-leader; not a request list |
| `P1GuildAcceptMember` / `P1GuildRejectRequest` / `P1GuildKickMember` / `P1GuildSetRole` / `P1GuildTransferLeader` | `@TargetUserId` (+ `@Role` for set-role) | Leader/deputy management. `P1GuildSetRole` without `@Role` → HTTP 500. Roles: 2 leader, 1 deputy, 0 member. |
| `P1GuildLeave` / `P1GuildRename` / `P1GuildDelete` | — / `@Name` / — | Leave returns `{Result:1}`; rename costs 1,000 Diamond (`3` = insufficient); delete is destructive and was not called |
| `P1MissionClaim2` | `@MissionId` | Claim one mission; success returns `{Result:1, Item, Name, Img, Quantity, GiftType}`, then `State:2` |
| `P1MissionHasReward` | — | Whether any mission reward is ready |
| `P1TeamSetNinja` | `@Slot`, `@NinjaId` | Put a ninja into a formation slot; success `[{"Result":"1"}]` |
| `P1TeamSetEquip` | `@Slot`, `@EquipId`, `@EquipSlot` | Equip an item on a formation slot; `@EquipSlot` 1 = weapon, 2 = armor. Omitting `@EquipSlot` (or sending only `@Slot`) returns HTTP 500. Success `[{"Result":"1"}]`. |
| `P1TeamSwap` | `@SlotA`, `@SlotB` (client template) | Swap positions |
| `P1Team3x3Set` | `@Team` | Save 3x3 layout |
| `P1SetTeam` | `@Team` | Save formation |
| `P1NinjaUpgrade` | `@Id`, `@FuelIds = N'id,id,…'` | Level a ninja by feeding other ninjas. `@Id` alone returns HTTP 500. Success `[{"Result":1,"Lv":8,"LvExp":68,"Gained":60,"Wasted":0}]`; `Gained` is the fuel EXP added. |
| `P1NinjaAttribute` | `@Id` | Reroll/change element |
| `P1PotentialAdd` / `P1PotentialRestore` | `@NinjaId` | Spend/restore potential |
| `P1SenjutsuUpgrade` | `@NinjaId` | Upgrade Sage Mode |
| `P1EquipUpgrade` / `P1EquipRecasting` | `@Id`, `@FuelIds = N'id,id,…'` (upgrade) / `@Id` (recast) | Upgrade gear with other gear as fuel. `@Id` alone returns HTTP 500. Success `[{"Result":1,"Lv":2,"LvExp":20}]`; equipped gear can be upgraded without unequipping it. |
| `P1StoneSetGem` | `@EquipId` | Socket a gem |
| `P1StoneUpgrade` | `@Gem` | Fuse gems |
| `P1TailsSummon` | `@Slot` | Summon a Tailed Beast |
| `P1TailsUpgradeStart` / `P1TailsUpgradeSkip` | `@BeastId` | Start/skip beast upgrade |
| `P1UltimateBuyBuff` | `@Mode` | Clear/record the pending Ultimate buff; `1` = pending buff handled, `3` = no pending buff. `@BuffId` is not accepted. |
| `P1TurnplateSpin` | `@Times` | Spin the event wheel |
| `P1LegendaryDraw` / `P1LegendaryDrawX10` | `@Type` / — | Legendary event draws |
| `P1Scratch` | — | Free/paid scratch; returns `{Pos,Tier,Img,Diamond,Result,WinTier,WinDiamond,IsFree,NewDiamond}`. `Result:1` only means the scratch ran; `WinDiamond` is the prize. |
| `P1Sell` | `@Id` | Sell an item/ninja |
| `P1Disassemble` / `P1DisassembleAll` | `@Id` / `@Star`,`@Type` | Disassemble gear |
| `P1GiftClaim` / `P1GiftDayClaim` / `P1GiftDayMakeup` | `@Tier` / `@Day` / — | Level gift (every 5 levels), daily gift, missed-day make-up. Claims return only `{Result:1}`; rewards land in the bag. |
| `P1MailClaim` / `P1MailClaimAll` | `@MailId` / — | Claim mail |
| `P1DiamondSpendingClaim` | `@Milestone` | Claim Diamond-spend milestone; `@Milestone` is the **amount** (e.g. `300`), not an index. Valid amounts observed: `300,1000,3000,6000,10000,20000,30000,50000`; other amounts return `0`. Observed: `1` success, `3` not reached, `4` already claimed. After claiming 300/1,000/3,000 at `TodaySpent:3000`, `P4DiamondSpending.NextMilestone` advanced to **6,000**; claiming 6,000 or 10,000 then returned `3`. |
| `P1ChakraTreeDonate` | `@Kind` | Donate to Chakra Tree |
| `P1CultureExchange` | `@GiftSlot` | Weekend Legend exchange |
| `P1CatPlay` | — | Cat investment event |
| `P1Pay` / `P1PayInternational` | `@UName` | Top-up primitives (server-side use; do not automate payments) |
| `P2Info` | — | Profile summary |
| `P2Main` | — | Main-player state |
| `P2GetBP` | — | Convert idle time/Gold into BP; observed `Result:1` with `BP`, `Gold`, `Minutes`, `Gained`, `GoldGained` |
| `P2GetEnergy` | — | Convert idle time into Energy/EXP; observed `{Result:1,Energy:57,Gold:604785,Minutes:54,Gained:44,Saved:0,ExpGained:5,LevelUp:0}`. An immediate retry returns `{Result:0,...null}` until more idle time accrues; `Gained` is Energy, `ExpGained` is player EXP. |
| `P2BuyItemQty` | `@Buy` | Shop purchase; `@Buy` is the **shop row `Id`** (e.g. `30` = Bronze Key, `24` = Sushi ×10 for 600,000 Gold). Observed `{Result:1, Gold, Diamond, Quantity}` where `Gold`/`Diamond` are the **new balances**. Sushi rows: `5` = ×1/20 Diamond, `6` = ×10/180 Diamond, `24` = ×10/600,000 Gold. |
| `P2BuyBattleQty` | `@Buy` | Battle/Fame shop purchase |
| `P2BuyVip` | `@Buy` | VIP shop purchase |
| `P2ChakraTreeBuyQty` | `@Buy` | Chakra Tree shop purchase |
| `P2MissionClaimAll` | `@Tab` | Claim ready missions in a UI tab; response `{Result, Claimed, Full}`. Observed: `@Tab=0`/`1` each claimed one in an early probe; `@Tab=2` claimed a Period-3 (monthly) mission; `@Tab=3` claimed the Period-5 story mission (and in a later probe also cleared the remaining Period-1 claimables); `@Tab=4`/`5` claimed nothing. The period→tab mapping is not stable enough to hard-code; diff `P3MissionList` after each call. |
| `P2UltimateClaim` | `@Mode` | Claim the Ultimate stage-5/10/… reward; `Result:0` before the milestone, `Result:1` with `{Item,Qty,Name,Img,StageNo}` when ready. |
| `P2KeyStatus` | — | Key counts and multipliers |
| `P2Scratch` | — | Scratch availability + Diamond balance |
| `P2StageProgress` | — | `{Scid,Task,Chapter,StageNo,MaxScid}` |
| `P2RankList` / `P2RankTop20` | — | Nearby ranks / top 20 |
| `P2PlunderTop20` | — | Today's top plunderers |
| `P2BossInfo` | — | Beast Boss window, HP, cooldown, rank |
| `P2GuildBossInfo` | — | Guild boss state: `BeastName`, `HP/MaxHP`, `HitsPerDay/Used`, `CooldownSec/Remain`, `Dame`, `MyRank`, `ExpPerHit`, `ContribPerHit`, `KillReward`, `Rank1Reward` |
| `P2MyGuildInfo` | — | `{GuildId,IsLeader,GuildName,GuildLv,Role}`; Role 2 leader, 1 deputy, 0 member |
| `P2TurnplateStatus` | — | Turnplate cycle/status |
| `P2LegendaryStatus` | — | Legendary event leaderboard |
| `P2CultureStatus` | — | Weekend exchange status |
| `P2Cat` | — | Cat event status |
| `P2FastBattleSet` | `@Mode` | Toggle fast battle |
| `P3StageList` | `@Task` | Story stages: 6 groups, 67 chapters, 335 stages |
| `P3MissionList` | — | 24 missions across periods; `State:1` = claimable |
| `P3Team` | — | Full team/formation read |
| `P3TeamNinjaList` | — | Owned ninja roster for team selection |
| `P3SlotUnlock` | — | Slot unlock levels: 1,1,1,10,20,30,45,60,75,90 |
| `P3Gift` | — | Level gifts every 5 levels to 120 |
| `P3GiftDay` | — | 7-day login gifts; the `Diamond` field mirrors the player's current Diamond balance, not a price |
| `P3GiftRechargeList` | — | Top-up tier gifts |
| `P3GiftTimeStatus` / `P3GiftTimeClaim` | `@Minutes` / — | Timed gift status/claim |
| `P3Shop` | — | Diamond/Gold shop items |
| `P3ShopBattle` | — | Fame balance (battle shop) |
| `P3ShopVip` | — | VIP shop |
| `P3KeyTreasureList` | — | Key reward pools with percentages |
| `P3TrainStageList` | `@Cave` | Training stages; empty at low level |
| `P3UltimateBuffList` / `P3UltimateRank` | `@Mode` / — | Ultimate buffs/leaderboard |
| `P3WorldWarTeam` | — | World War team snapshot |
| `P3BossFightRank` / `P3GuildBossRank` | — | Boss damage ranks |
| `P3GuildRankList` / `P3GuildList` / `P3GuildMemberList` | `@Name` for search | Guild rankings (`GuildScore`, `Menber/MaxMember`), search (`CanJoin`), and member roster (`Role`, `Contribution`, top-3 team images) |
| `P3GuildBattleList` | — | Current guild-battle row (`GuildId`, `GuildName`, `GuildScore`, `GuildRank`, `EmblemImg`); only the own guild was returned outside an active window |
| `P3GuildRequestList` | — | The player's outgoing join requests (`Mode`, `GuildId`, `UserId`, `Name`, `Lv`, `IsReject`, `RejectAt`) |
| `P4MainLoad` | — | Full player state |
| `P4MainPreview` | — | Lightweight main state |
| `P4StaminaStatus` | — | Energy/BP current/max/used/limits |
| `P4Mail` / `P4Mail_9vs9` | — | Mailboxes |
| `P4BagItem` / `P4BagEquipStack` / `P4BagGem` / `P4BagNinjaStack` | — | Bag views; observed returning only currency header when empty |
| `P4Tails` | — | 10 beasts, chips, levels, unlock chain |
| `P4TrainStatus` | — | Three caves, open days, debuffs, runs |
| `P4UltimateStatus` | `@Mode` | Runs, stage, stars, buffs, rank |
| `P4PotentialInfo` | — | Potential by team slot |
| `P4SenjutsuInfo` | `@NinjaId` | Sage Mode info |
| `P4DiamondSpending` | — | Daily Diamond-spend progress: `{TodaySpent,NextMilestone,Remaining,SecondsLeft}`; observed `{3000,6000,3000,33601}` after a 3,000-Diamond guild creation |
| `P4Relationship` | — | Friends/rivals |
| `P4BattleLog` | `@Id` | Battle log read; returned empty for a story battle in testing |
| `P4WorldWarStatus` | `@UName` | Returned `500` in testing; unstable |

### 8.2 Full signature catalog

The following block is the complete client-visible signature list, grouped by prefix. `@Param =` indicates a required/inline parameter; procedures without parameters are shown bare.

#### P0 — account, social, mail, tutorial

```text
P0AddFriend @S2 =
P0AddRival @S2 =
P0DeleteMail @MailId =
P0DeleteMailAll
P0GiftDayCheckIn
P0NewbieDone @Lv =
P0Request @S2 =
P0SelectSv @UName =
P0SendMail @S2 =
P0StoneCheck
P0TeamBattleRefresh
P0UnFriend @S2 =
P0UnRival @S2 =
```

#### P1 — player mutations and actions

```text
P1CatPlay
P1ChakraTreeDonate @Kind =
P1Clear @Star =
P1Code @Code =
P1CultureExchange @GiftSlot =
P1DiamondSpendingClaim @Milestone =
P1Disassemble @Id =
P1DisassembleAll @Star = 4, @Type =
P1EquipRecasting @Id =
P1EquipUpgrade @Id =
P1GetTeam
P1GiftClaim @Tier =
P1GiftDayClaim @Day =
P1GiftDayMakeup
P1GuildAcceptMember @TargetUserId =
P1GuildCreate @Name =
P1GuildDelete
P1GuildKickMember @TargetUserId =
P1GuildLeave
P1GuildRejectRequest @TargetUserId =
P1GuildRename @Name =
P1GuildRequestCancel @GuildId =
P1GuildRequestJoin @GuildId =
P1GuildRequestPending
P1GuildRequestResend @GuildId =
P1GuildSetRole @TargetUserId =
P1GuildTransferLeader @TargetUserId =
P1LegendaryDraw @Type =
P1LegendaryDrawX10
P1MailClaim @MailId =
P1MailClaimAll
P1MailHasGift
P1MissionClaim2 @MissionId =
P1MissionHasReward
P1NinjaAttribute @Id =
P1NinjaUpgrade @Id =
P1Pay @UName =
P1PayInternational @UName =
P1PotentialAdd @NinjaId =
P1PotentialRestore @NinjaId =
P1RelationshipPending
P1Scratch
P1Sell @Id =
P1SenjutsuUpgrade @NinjaId =
P1SetTeam @Team = '
P1StoneSetGem @EquipId =
P1StoneUpgrade @Gem =
P1TailsSummon @Slot =
P1TailsUpgradeSkip @BeastId =
P1TailsUpgradeStart @BeastId =
P1Team3x3Set @Team = '
P1TeamSetEquip @Slot =
P1TeamSetNinja @Slot =
P1TeamSwap @SlotA =
P1TurnplateSpin @Times =
P1UltimateBuyBuff @Mode =
P1UserNameCheck @Name =
P1UserRename @Name =
```

> The metadata signature for `P1TeamSetNinja` shows only `@Slot`; the current server also accepts `@NinjaId`. The working call observed was:
> ```sql
> EXECUTE dbo.P1TeamSetNinja @Slot = 2, @NinjaId = 43180
> ```
> Treat the metadata list as a lower bound, not a complete parameter contract.

#### P2 — player reads and economy actions

```text
P2BattleTeamStat
P2BattleWorldWarLog @Id =
P2BossInfo
P2BuyBattleQty @Buy =
P2BuyItemQty @Buy =
P2BuyVip @Buy =
P2Cat
P2ChakraTreeBuyQty @Buy =
P2CultureStatus
P2Detail @Detail =
P2DisassembleAllInfo @Star = 4, @Type =
P2FastBattleSet @Mode =
P2GetBP
P2GetEnergy
P2GuildBossInfo
P2Info
P2KeyStatus
P2LegendaryStatus
P2Main
P2MissionClaimAll @Tab =
P2MyGuildInfo
P2PlunderTop20
P2PotentialNinja @NinjaId =
P2RankList
P2RankTop20
P2Scratch
P2StageProgress
P2StoneUpgradeInfo @Gem =
P2TailsSkipQuote @BeastId =
P2TurnplateStatus
P2UltimateClaim @Mode =
```

#### P3 — static/config lists and read-only pickers

```text
P3BankList @Tab =
P3BossFightRank
P3ChakraTreeInfo
P3ChakraTreeNinjaList
P3ChakraTreeRank
P3ChakraTreeRewardList
P3ChakraTreeShop
P3EquipRecastingPicker
P3EquipUpgradeAuto @TargetId =
P3EquipUpgradeFuel @ExcludeId =
P3EquipUpgradePicker
P3Gallery
P3Gift
P3GiftDay
P3GiftRechargeList
P3GiftTimeClaim
P3GiftTimeStatus @Minutes =
P3GuildBattleList
P3GuildBossRank
P3GuildList @Name =
P3GuildMemberList
P3GuildRankList
P3GuildRequestList
P3InternationalReceiverList
P3KeyTreasureList
P3MailGift @MailId =
P3MissionList
P3NewbieStep
P3NinjaAscendPicker
P3NinjaAttributeFuel @ExcludeId =
P3NinjaAttributePicker @Mode =
P3NinjaUpgradeAuto @TargetId =
P3NinjaUpgradeFuel @ExcludeId =
P3NinjaUpgradePicker
P3NoticeEvent
P3RechargeRank
P3Search @Name =
P3SenjutsuPicker
P3ServerList
P3Shop
P3ShopBattle
P3ShopVip
P3SlotUnlock
P3StageList @Task =
P3Stone @Team = '
P3StoneGemList @GemColor =
P3StoneNinja @Team = '
P3StoneUpgradePicker
P3TailsChipHolders @BeastId =
P3Team
P3Team3x3 @Team = '
P3TeamEquipList @EquipType =
P3TeamLore
P3TeamLoreVisit @TargetUserId =
P3TeamNinjaList
P3TeamPower
P3TeamVisit @TargetUserId =
P3TopupList
P3TrainStageList @Cave =
P3TurnplateLog
P3TurnplateRank
P3TurnplateWheel
P3UltimateBuffList @Mode =
P3UltimateRank
P3VipExpList
P3WorldWarTeam
```

#### P4 — composite state and player-facing reads

```text
P4BagEquipStack
P4BagGem
P4BagItem
P4BagNinjaStack
P4BattleLog @Id =
P4DiamondSpending
P4Mail
P4Mail_9vs9
P4MainLoad
P4MainPreview
P4PotentialInfo
P4Relationship
P4SenjutsuInfo @NinjaId =
P4StaminaStatus
P4Tails
P4TrainStatus
P4UltimateStatus @Mode =
P4WorldWarStatus @UName =
```

### 8.3 Procedures that were unstable or unconfigured

| Procedure | Observed |
|---|---|
| `P3ServerList` | `500 Internal server error` |
| `P3TopupList` | `{"error":"Internal server error."}` |
| `P3InternationalReceiverList` | `{"error":"Internal server error."}` |
| `P4WorldWarStatus` | `500` with several `@UName` forms |
| `P3ChakraTreeNinjaList` | `[]` |
| `P4BattleLog` | `[]` / `null` for a story battle that `/battle/9vs9/log` could read |
| `P2Bag` | `500 Internal server error`; use `P3TeamNinjaList` / `P4BagNinjaStack` for inventory reads |

Do not build a dependency on these without a fallback.

---

## 9. Route-to-procedure map

“Companion” means the procedure returns the same or closely related data; the dedicated route is still the canonical call. “Action” means the operation is only available through the SQL proxy.

| # | Dedicated route | Primary/companion procedures | Notes |
|---|---|---|---|
| 1 | `/api/account/change-pass` | — | Account DB, not in public proc list |
| 2 | `/api/account/contact` | — | Account DB |
| 3 | `/api/animation` | — | Static animation catalog |
| 4 | `/api/ascend/info` | `P3NinjaAscendPicker`, `P2Info` | Info is computed server-side |
| 5 | `/api/ascend/run` | — | Server action; no exposed proc |
| 6 | `/api/battle` | `P2StageProgress`, `P3StageList`, `P4BattleLog` | Story battle |
| 7 | `/api/battle/9vs9/demo` | — | Battle engine |
| 8 | `/api/battle/9vs9/log` | `P4BattleLog` (fallback) | Canonical win/log check |
| 9 | `/api/battle/9vs9/skill-preview` | — | Static skill data + simulator |
| 10 | `/api/battle/boss` | `P2BossInfo`, `P3BossFightRank` | Event boss |
| 11 | `/api/battle/guild` | `P3GuildBattleList`, `P3GuildMemberList` | Guild PvP |
| 12 | `/api/battle/guildboss` | `P2GuildBossInfo`, `P3GuildBossRank` | Guild boss |
| 13 | `/api/battle/plunder` | `P2PlunderTop20` | Gold steal |
| 14 | `/api/battle/plunder-list` | `P2PlunderTop20` | Target list is server-computed |
| 15 | `/api/battle/rank` | `P2RankList`, `P2RankTop20` | Rank battle |
| 16 | `/api/battle/tails` | `P4Tails`, `P3TailsChipHolders` | Chip steal |
| 17 | `/api/battle/train` | `P3TrainStageList`, `P4TrainStatus` | Cave training |
| 18 | `/api/battle/ultimate` | `P4UltimateStatus`, `P3UltimateBuffList`, `P3UltimateRank` | Ultimate Trial |
| 19 | `/api/chat/block` | — | Chat DB |
| 20 | `/api/chat/blocks` | — | Chat DB |
| 21 | `/api/chat/poll` | — | Chat DB |
| 22 | `/api/chat/send` | — | Chat DB |
| 23 | `/api/config` | — | Static config |
| 24 | `/api/first-recharge/claim` | — | Billing/account state |
| 25 | `/api/first-recharge/info` | — | Billing/account state |
| 26 | `/api/guild/donate` | `P2MyGuildInfo` | Server action |
| 27 | `/api/guild/emblem/buy` | `P2MyGuildInfo` | Server action |
| 28 | `/api/guild/emblem/set` | `P2MyGuildInfo` | Server action |
| 29 | `/api/guild/emblems` | `P2MyGuildInfo` | Emblem catalog |
| 30 | `/api/guild/info` | `P2MyGuildInfo` | Guild summary |
| 31 | `/api/lang` | — | Localization DB |
| 32 | `/api/ping` | — | Health |
| 33 | `/api/recharge-gift/info` | `P3GiftRechargeList`, `P3RechargeRank` | Top-up tiers |
| 34 | `/api/reward/house-draw` | — | Recruit engine |
| 35 | `/api/reward/item-rates` | — | Static rates |
| 36 | `/api/reward/key-open` | `P2KeyStatus`, `P3KeyTreasureList` | Key engine |
| 37 | `/api/reward/use-item` | — | Item engine |
| 38 | `/api/session/login` | — | Account DB |
| 39 | `/api/session/logout` | — | Session DB |
| 40 | `/api/session/new-user` | `P3NewbieStep`, `P4MainLoad` | Character creation |
| 41 | `/api/session/new-user-info` | — | Account DB |
| 42 | `/api/session/random-name` | — | Name generator |
| 43 | `/api/session/register` | — | Account DB |
| 44 | `/api/session/select-server` | `P0SelectSv` | Server binding |
| 45 | `/api/sql/dataset` | all 186 | Multi-result-set proxy |
| 46 | `/api/sql/nonquery` | all 186 | Mutation proxy |
| 47 | `/api/sql/row` | all 186 | Single-row proxy |
| 48 | `/api/sql/scalar` | all 186 | Scalar proxy |
| 49 | `/api/sql/table` | all 186 | Table proxy |
| 50 | `/api/version` | — | Static |
| 51 | `/api/worldwar/register` | `P3WorldWarTeam`, `P4WorldWarStatus` | Cross-server bracket |

---

## 10. Data models and field notes

### 10.1 `P3Team` / formation

- 13 rows are returned by `P3Team`; slots 1–3 are unlocked at player Lv1, then 4 at Lv10, 5 at Lv20, 6 at Lv30, 7 at Lv45, 8 at Lv60, 9 at Lv75, 10 at Lv90.
- Slot data includes full skill/bond/equipment projections, which makes `P3Team` the best single read for combat power.
- `NinjaId` is the **owned instance id** (e.g. `43179`); `Ninja` is the **template id** (e.g. `21`). Do not mix them.
- `Tier`: 0 normal, 1 Super, 2 Kage.
- `Attribute`: 1 Fire, 2 Wind, 3 Lightning, 4 Earth, 5 Water (as used in config; verify against the client's element labels before hard-coding UI).

### 10.2 `P2StageProgress`

```json
{"Scid":5,"Task":1,"Chapter":1,"StageNo":5,"MaxScid":1145}
```

- `Scid` is the current story stage id.
- `Task` selects one of six stage-list groups (1..6).
- `Chapter`/`StageNo` are display coordinates.
- `MaxScid` is an internal high-water mark, not the number of stages. The stage catalog has 335 rows across 67 chapters.

### 10.3 `P4UltimateStatus`

```ts
type UltimateStatus = {
  RunsLeft: number;
  Mode: number;            // 1 attack, 2 defense
  StageNo: number;
  NextStage: number;
  InRun: number;
  OtherMode: number;
  OtherModeStage: number;
  Star: number;            // spendable stars
  StarEarned: number;
  StarMax: number;
  MaxStage: number;
  StagesWon: number;
  Gold: number;
  Diamond: number;
  PendingBuff: number;
  PendingReward: number;
  MyRank: number;
  MyCount: number;
  BuffAtk: number;
  BuffDef: number;
  BuffChance: number;
  BuffEnemyAtk: number;
  BuffEnemyDef: number;
  BuffEnemyChance: number;
}
```

Observed semantics:

- `StageNo` is the last cleared stage; `NextStage` is the next one; `InRun:1` means a chain is active.
- `Star` is the spendable balance; `StarEarned` is the cumulative stars earned; `StarMax` grows as `3 × StageNo`.
- `PendingBuff:1` blocks the next battle (`Result:3, Error:"Pending"`) until `P1UltimateBuyBuff @Mode` is called.
- `PendingReward:1` blocks the next battle until `P2UltimateClaim @Mode` is called (every 5 stages).
- `RunsLeft` is not a per-stage counter: mode 1 went `2 → 1` on its first battle and stayed `1` on the next stage win; mode 2 stayed at `2` across five wins, later read `1`, and stayed `1` after stage 6. Treat it as consumed at chain boundaries and re-read it after every battle. `MyRank`/`MyCount` reflect the daily leaderboard.
- Ultimate grants Gold but **no player EXP**; do not use it to push a level breakpoint.

### 10.4 `P4TrainStatus`

Each row:

```ts
type TrainCave = {
  Cave: number;
  Name: string;
  Name0: string;
  Info: string;
  Info0: string;
  OpenDays: string;        // "1,4,0" where 0=Sunday
  Img: string;
  AttrMask: number;
  DebuffPct: number;       // 50
  DebuffPctSuper: number;  // 30
  DebuffPctKage: number;   // 10
  ItemId: number;
  IsOpen: number;
  RunsUsed: number;
  RunsMax: number;         // 6
  RunsUsedAtk: number;
  RunsUsedDef: number;
  RunsMaxMode: number;     // 3
}
```

Observed on Saturday 21/11/2026: cave 3 had `IsOpen:1`; caves 1/2 had `IsOpen:0` and returned `Closed`. Cave 3 still returned `LowLevel` at Lv10–Lv23 with team power up to 4,569 and every tested `tier`/`stageNo`, so the gate is not `tier`-driven. `P3TrainStageList @Cave` was `[]` throughout that state. `ItemId` is 55/56/57 for caves 1/2/3.

### 10.5 `P4Tails`

```ts
type TailedBeast = {
  BeastId: number;
  Name: string;
  ChipCount: number;
  Level: number;
  Info: string;
  UnlockUserLv: number | null;
  UnlockBeastId: number | null;
  UnlockBeastLv: number | null;
  IsUnlocked: boolean;
  MaxLevel: number;        // 10
}
```

### 10.6 `P3GiftDay`

```ts
type DailyGift = {
  Day: number;
  Unlocked: number;
  Claimed: number;
  Diamond: number;         // mirrors the player's current Diamond balance (not a price)
  Today: number;           // day-of-week or day index
  WeekStartText: string;
  WeekEndText: string;
  GiftType: number;
  Gift: number;
  Quantity: number;
  GiftImg: string;
  GiftName: string;
}
```

Observed: `Today:7`, week `15/11/2026`–`21/11/2026`; day 7 was unlocked and gave a 5★ ninja egg (`Gift:5`). `P1GiftDayClaim @Day = 7` returned `{Result:1}` and the reward landed in the bag. After the claim the rows showed `Unlocked:0, Claimed:0` for the completed week. Claim only the row with `Unlocked:1, Claimed:0`; `@Day` is the `Today` value, not a fixed day index.

### 10.7 `P3Gift` (level gifts)

24 tiers at Lv5, 10, 15, … 120. Each tier has three rewards:

```ts
type LevelGift = {
  Tier: number;
  Lv: number;
  Unlocked: number;
  Claimed: number;
  Item1: number; Qty1: number; Img1: string; Star1: number;
  Item2: number; Qty2: number; Img2: string; Star2: number;
  Item3: number; Qty3: number; Img3: string; Star3: number;
}
```

Notable guaranteed items: 5★ eggs (`49`) at every tier; 5★ ninja/equipment at Lv25, 50, 75, 100; Legendary ninja at Lv120; large Soul/Rainbow Pill bundles at high levels.

Observed claim behavior: tier N unlocks at player level `5 × N` (tier 1 = Lv5, tier 2 = Lv10, tier 3 = Lv15, tier 4 = Lv20, tier 5 = Lv25). `P1GiftClaim @Tier = N` returned `{Result:1}` for tiers 1–4; rewards appear in the bag. Tier 5 gives `3 × item 49` (300 Diamond), which is the cheapest observed route from 2,705 to the 3,000-Diamond guild-create threshold. `P3Gift` exposes `Unlocked`/`Claimed` flags; claim only `Unlocked:1, Claimed:0`.

### 10.8 `P3NoticeEvent`

```ts
type NoticeEvent = {
  Sort: number;
  Code: string;            // "legendary", "boss", "culture", ...
  Title: string;
  Title2: string;
  Dates: string;
  Dates2: string;
  Info: string;
  Info2: string;
}
```

### 10.9 `P3Shop`, `P3ShopVip`, `P3KeyTreasureList`

- `P3Shop` rows are `{Id,Item,Quantity,Price,ImgPrice,Name,Name2,Img,Star,PriceOrigin,SalePct,HasRate}`. `ImgPrice` is `newui/gold` or `newui/diamond`.
- `P3ShopVip` rows are gated by VIP level and include 5★ ninja/equipment (Kakashi, Orochimaru, Masked Man, Susanoo-Sasuke) at 1,500–25,000 Diamond.
- `P3KeyTreasureList` rows are `{KeyType,KeyName,ItemName,ItemName2,ItemImg,Quantity,Pct}`. Bronze Key examples: Ramen 30%, Small BP 25%, Gold bag 20%, 10 Diamond 10%, Silver Key 7%, “Next reward x2” 8%.

### 10.10 `P2BossInfo`

```ts
type BossInfo = {
  Result: number;
  EventOpen: number;        // 1 inside the session window
  Defeated: number;         // 1 once the shared boss is killed
  Session: number;          // observed 1 at the noon session; night value not captured
  Tier: number;
  TierName: string;         // "Weekend Noon", "Weekday Night", ...
  BeastIndex: number;
  BeastNinja: number;
  BeastName: string;        // "Gyuki", "Kurama", ...
  BeastImg: string;
  BeastAtkOrDef: number;    // observed 2 for Gyuki; 1/2 are believed Attack/Defense but the mapping is inferred
  HP: number;
  MaxHP: number;
  StartText: string;        // "12:00"
  EndText: string;          // "13:00"
  SecondsToOpen: number;
  SecondsToClose: number;
  IsTomorrow: number;
  Fame: number;
  Dame: number;
  MyRank: number;
  CooldownRemain: number;
}
```

Observed 21/11/2026 weekend-noon state before the kill: `TierName:"Weekend Noon"`, `BeastName:"Gyuki"`, `HP:150000000`, `BeastAtkOrDef:2`, window `12:00–13:00`. After the shared boss died: `Defeated:1`, `HP:0`, while `EventOpen` remained `1` until the window closed. The in-game notice lists the noon beast as Gyuki and the night beast as Kurama.

### 10.11 `P1Scratch`

```ts
type ScratchResult = {
  Pos: number;             // revealed card position 1..9
  Tier: number;            // card tier
  Img: string;
  Diamond: number;         // Diamond value printed on the card
  Result: number;          // 1 = scratch executed
  WinTier: number;         // 0 = no match
  WinDiamond: number;      // 0 = no prize
  IsFree: boolean;
  NewDiamond: number;      // balance after the scratch
}
```

Observed paid scratch: `{"Pos":1,"Tier":1,"Diamond":5,"Result":1,"WinTier":0,"WinDiamond":0,"IsFree":false,"NewDiamond":580}`. A scratch with no three-of-a-kind still returns `Result:1`; read `WinTier`/`WinDiamond`, not `Result`, to decide whether you won. `P2Scratch.Diamond` is the player's current Diamond balance and `FreeAvailable` is the free-scratch flag. A free scratch can reveal up to 9 positions in one response; the observed free spin returned 9 `Pos` entries, each with its own `Tier`/`Diamond`, and `NewDiamond` rose by 5.

### 10.12 Item use (`reward/use-item`)

`UseType` drives the response shape:

| UseType | Item kind | Success shape |
|---|---|---|
| `0` | Exchange material / no immediate effect | `{Result:0}` or `{Result:1}` |
| `1` | Gold | `{Result:1,UseType:1,Gained:<gold>}` |
| `2` | Diamond | `{Result:1,UseType:2,Gained:<diamond>}` |
| `3` | Energy | `{Result:1,UseType:3,Gained:<energy>,UsedToday,PerDay}` |
| `4` | Battle Points | `{Result:1,UseType:4,Gained:<bp>}` |
| `5` | Ninja egg | `{Result:2,Name,Img,Quantity,Star}` |
| `6` | Equipment egg | `{Result:2,Name,Name2,Img,Quantity,Star}` |
| `7` | Gem | `{Result:1,...}` or gem payload |

`Result:2` is the normal egg-open result, not a failure. `Result:6` is the context/daily-limit rejection (for example Energy food at full Energy or past `PerDay`). `Gained` is the total amount added for the whole `quantity`, not per item.

---

## 11. Operational and legal caveats

> **Read this before writing any automation.**

1. **Terms of Service.** The game's Terms of Service, rules, and event rules govern your account. Botting, automation, macros, unauthorized third-party clients, scraping, and commercial exploitation may be prohibited and can result in warnings, rollbacks, suspension, or permanent bans. This report does not grant permission or a license.
2. **No official support.** These routes are undocumented and can change without notice. The API key and version header are client artifacts, not a public integration contract. A patch can invalidate every schema in this document.
3. **Alpha/Beta data loss.** The published timeline says Alpha runs 1–22 Nov 2026, Beta 23–30 Nov 2026, and official launch 1 Dec 2026. Alpha data is wiped at the end; only name/stage progress may be preserved. Do not build paid or irreversible workflows on Alpha data.
4. **Rate limits and stability.** Account routes returned `429` under rapid repeated calls. SQL routes can return `500` for bad parameters. Add conservative backoff, jitter, and a global concurrency limit. Never retry mutations blindly; use reads to confirm state.
5. **Privacy and credentials.** Do not log passwords, tokens, remember tokens, email addresses, or phone numbers. Do not share accounts. Do not use another player's token. The `X-Api-Key` is public but should still not be used to attack the service.
6. **Fair play.** Rank, plunder, boss, guild, and world-war systems affect other players. Automated play can distort rankings and event outcomes even if it is technically possible. Prefer read-only analysis, private test accounts, and explicit permission from the operator.
7. **Payments.** `P1Pay`/`P1PayInternational` and recharge flows touch real money. Do not automate payment, top-up approval, or refund logic. Treat all billing state as server-authoritative.
8. **No redistribution of game assets.** The report references asset paths and ids for interoperability. It does not grant rights to redistribute art, audio, text, or data.

---

## 12. Methodology and confidence

**Sources**

- Static IL2CPP metadata (`global-metadata.dat`, v107) for route names, method signatures, JSON keys, UI/tutorial strings, config keys, and procedure names.
- Live probing against `naruto.id.vn` with a test account during the Alpha period.
- Public site guides and news pages for gameplay rules, event schedules, and release timeline.

**Confidence**

- **High:** header requirements, base routing, login/register/select flows, SQL proxy shape/restrictions, the 51 route list, the 186 procedure signatures, observed response envelopes, and the core battle/tails/train/ultimate/chat/guild behaviors. Also verified live: shop purchase (`P2BuyItemQty` row id), key opening (`Result:1` payload, including multiplier rolls), mission claim (`P1MissionClaim2`, `P2MissionClaimAll`), paid scratch, Diamond-spend milestone claim, boss `Closed`/`Defeated` states, guild create/join/reject/accept/kick/leave/role/transfer/rename, guild donations types 1–3, guild boss damage/cooldown/rank, Ultimate stages 1–6 with buff/reward claims, item-use quantity truncation, gift tiers 1–5, and story repeat-EXP efficiency.
- **Medium:** exact enum meanings where only one side of a condition was observable (e.g. guild emblem `buy` success — blocked by guild Lv1, boss `Session`/`BeastAtkOrDef` mapping, milestone amounts above 300, story-mission `State:3`), the exact `RunsLeft` chain-boundary rule, and event schedules that are config-driven.
- **Low / do not rely on:** guild battle success/targets outside an active window, training success (blocked by `LowLevel` through Lv23), full `worldwar` status, `P4WorldWarStatus`, `P3ServerList`/`P3TopupList`, exact battle-log token semantics, and the complete Diamond-milestone ladder.

**Blocked / unresolved (not failures of the API):**

- Training success could not be observed: cave 3 was open but returned `LowLevel` at Lv10–Lv23 with 4,569 power; the exact player/ninja-level gate is still unknown.
- Guild emblem purchase success requires guild Lv3; the test guild was Lv1. At Lv1, `guild/emblem/buy` returns `4` (guild level), and `3` only when Diamond is also insufficient.
- Guild battle success requires an active window/valid opponent; outside it, `P3GuildBattleList` returns only your own guild and `/battle/guild` returns `NoTarget`.
- World War success/Top-20 behavior is unobservable without a Top-20 account; unranked returns `"6"`, ranked outside Top 20 returns `"7"`.
- Plunder success against real players was intentionally not attempted; owned alts returned `NoGold`. Treat `NoGold` as a protection/stealable-Gold check.
- Fresh login tokens still fail `session/select-server` with `-1`; saved server-bound tokens remain valid.

**Not covered**

- Payment provider callbacks and anti-fraud.
- Server-side rate-limit thresholds.
- Full IL2CPP method body decompilation (blocked by IL2CPP metadata/protection).
- Browser network capture (headless Chromium stalled at load; probes were made directly against the API).

---

## 13. Notes for a future companion stack

The preferred stack from the brief is SQLite + a modern lightweight frontend + the fastest practical backend. A conservative, analysis-friendly design:

- **Backend:** Go (single static binary, strong concurrency, low memory) or Rust (Axum) behind nginx/Caddy. A Bun/Node service is acceptable for velocity but adds runtime overhead.
- **Database:** SQLite in WAL mode with a single writer. Tables: `accounts`, `tokens` (encrypted/limited), `snapshots` (player/team/resources), `battles`, `battle_logs`, `daily_tasks`, `events`, `procedure_calls`, `rate_limits`.
- **Frontend:** SvelteKit or SolidStart with Tailwind; static build served by the backend. Keep it read-only for analysis first.
- **Scheduler:** in-process cron/worker, no Redis for a single-account tool. Store all timestamps in UTC and render in UTC+7.
- **Safety:** one account per process, global request budget, exponential backoff on `429`/`500`, idempotency keys for mutations, and a hard “dry-run” switch that blocks every mutating procedure and route.
- **Verification:** after a battle, read `/battle/9vs9/log` and `P2StageProgress` rather than trusting `BattleResult.Id`. After a mutation, re-read the relevant `P2*`/`P4*` state.
- **No bot code is included in this report.** The next step, if the operator permits it, is a read-only dashboard and a manual-action queue.

---

*End of report.*
