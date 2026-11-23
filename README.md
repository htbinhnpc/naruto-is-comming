# Naruto Bot — Quản lý tài khoản, Tổng quan, Daily, Huấn luyện, Boss, PvP, Đội hình, Túi đồ, Nhật ký, Cố vấn & Bot

Công cụ quản lý nhiều tài khoản Naruto Is Coming (server S1 – Naruto).
Mỗi tài khoản là một card riêng, có đăng nhập/đăng xuất, thông tin nhân vật, switch bật/tắt auto, tab nhận thưởng daily và nhật ký hoạt động.
Tab **Cố vấn** tổng hợp việc nên làm cho từng tài khoản; tab **Bot** chạy vòng lặp tự động có ngân sách cho các tài khoản bật Auto.

## Chạy

Yêu cầu Node.js **>= 22.5** (dùng `node:sqlite` có sẵn). CSS utility (Tailwind) được build sẵn trong `public/tailwind.css`; nếu sửa class thì chạy lại:

```bash
npm install        # chỉ cần khi cài lại dependencies (tailwindcss, @tailwindcss/cli)
npm run css:build  # build public/tailwind.css từ styles/tailwind.input.css
npm start
```

Mở: <http://127.0.0.1:3000>

Chế độ tự khởi động lại khi sửa code:

```bash
npm run dev
```

### Chạy thử với mock server

Không cần tài khoản game thật, dữ liệu nhân vật là giả:

```bash
npm run mock
# cửa sổ khác:
GAME_API_BASE=http://127.0.0.1:4001 DATA_DIR=./data-mock npm start
```

Mock chấp nhận mọi mật khẩu trừ `wrong`.

Dữ liệu mock có các kịch bản: `default`, `noguild`, `boss-open`, `boss-defeated`, `boss-closed`, `boss-cooldown`, `boss-killed`, `ultimate-pending`, `story-loss`, `cave-closed`, `cave-lowlevel`, `cave-loss`, `ultimate-loss`, `guild-boss`, `no-guild`, `guild-cooldown`, `guild-killed`, `guild-no-hits`, `pvp-loss`, `pvp-no-bp`, `pvp-no-target`, `pvp-no-gold`, `pvp-unverified`, `pvp-stronger`. Chọn lúc khởi động bằng `MOCK_SCENARIO=... npm run mock`, hoặc đổi khi đang chạy:

```bash
curl -X POST http://127.0.0.1:4001/api/mock/scenario \
  -H 'Content-Type: application/json' \
  -d '{"scenario":"boss-open"}'
```

## Tính năng

- **Card tài khoản**: tên nhân vật, level, lực chiến, vàng, kim cương, guild, top bảng xếp hạng.
- **Đăng nhập / Đăng xuất** theo state, tự động lấy thông tin nhân vật sau khi đăng nhập.
- **Đồng bộ** lại thông tin nhân vật khi đang có phiên.
- **Switch Auto** bật/tắt chạy tự động cho từng tài khoản. Chỉ bật được khi tài khoản đang đăng nhập; tự tắt khi đăng xuất, tắt tài khoản, đổi mật khẩu hoặc phiên hết hạn.
- **Tab Tổng quan**: bảng điều khiển chỉ đọc cho tài khoản đang chọn — cấp/EXP/lực chiến, Energy/BP, vàng/kim cương, tiến trình story, việc nên làm hôm nay, lịch hoạt động UTC+7, trạng thái Ultimate/huấn luyện/guild/boss và cảnh báo.
- **Tab Daily**: xem trạng thái và nhận từng mục hoặc **Nhận tất cả** cho tài khoản đang chọn.
- **Tab Huấn luyện**: ba mục con **Cốt truyện**, **Động huấn luyện**, **Thử thách tối thượng**; gợi ý stage theo EXP/Vàng/Cân bằng, chạy theo lô có xem trước, tự dừng khi thua/hết năng lượng/hết lượt, tùy chọn dùng vật phẩm hồi năng lượng có sẵn.
- **Tab Boss**: **Vĩ Thú Tập Kích** và **Guild Boss**; HP dùng chung, bảng xếp hạng sát thương, countdown cửa sổ/cooldown, mỗi hit là một request riêng và tự chờ cooldown khi chọn nhiều hit. Không tiêu Kim cương, không mua lượt.
- **Tab PvP**: **Đấu Rank** và **Cướp vàng**; chỉ chọn đối thủ có lực chiến thấp hơn, xem trước danh sách sẽ đánh, tự dừng khi thua/hết BP/hết mục tiêu. Không tiêu Kim cương, không mua BP.
- **Tab Đội hình**: xem đủ 10 slot (kể cả slot chưa mở), hệ, bậc, vai trò Công/Thủ, bond, trang bị và thông số đầy đủ của từng ninja; tự chọn đội hình mạnh nhất theo hướng Công hoặc Thủ.
- **Tab Túi đồ**: xem ninja sở hữu, trang bị và vật phẩm; tag **Trong đội** / **Đang mặc**; dùng vật phẩm trực tiếp (có nút **Max**); đổi chỗ ninja và chuyển/tháo trang bị. Tab Vật phẩm chỉ hiện vật phẩm thật, không lẫn ninja/trang bị.
- **Tab Quay ninja**: nhập số lượt, luôn quay vòng tốt nhất (`btn 4` – 80.000 Vàng, đảm bảo 3–5 sao), dừng khi hết Vàng, chỉ dùng Vàng.
- **Tab Craftment**: nâng cấp ninja / trang bị bằng nguyên liệu, 3 chế độ An toàn / Tất cả / Thủ công, dừng ở trần level, có nút **Max**.
- **Tab Nhật ký**: mọi hoạt động ghi theo 4 dòng `Tiến trình` / `Cost` / `Gain` / `Đã hoàn thành` hoặc `Đã dừng: <lý do>`; lọc theo mức độ, tải thêm theo trang.
- **Một tài khoản dùng chung**: chọn tài khoản ngay trên thanh điều hướng trên cùng (dropdown cố định); mọi tab tự tải lại theo tài khoản đã chọn, không cần dropdown riêng.
- **Tab Cố vấn**: quét trạng thái từng tài khoản (chỉ đọc) và xếp việc nên làm hôm nay theo ưu tiên, bấm để mở đúng tab với tài khoản đã chọn.
- **Tab Bot**: vòng lặp tự động cho tài khoản bật Auto, mặc định dry-run, có ngân sách hành động/ngày, kill switch và tự treo tài khoản khi lỗi liên tiếp.
- Thêm / sửa / xóa / bật-tắt tài khoản, tìm kiếm, lọc theo trạng thái, thống kê nhanh.
- Mật khẩu và session token được mã hóa **AES-256-GCM** trước khi lưu, không trả về qua API.

## Tab Tổng quan

Tab chỉ đọc, không gọi bất kỳ lệnh thay đổi dữ liệu game nào và không tiêu Kim cương. Server đọc tuần tự, nghỉ ngắn giữa các procedure và cache kết quả 60 giây ở phía giao diện:

| Nhóm | Nguồn đọc |
|---|---|
| Nhân vật | `P4MainLoad`, `P4StaminaStatus`, `P3TeamPower` |
| Tiến trình | `P2StageProgress` |
| Huấn luyện | `P4TrainStatus` (3 động, lượt Công/Thủ còn lại) |
| Ultimate | `P4UltimateStatus @Mode=1` và `@Mode=2` |
| Boss | `P2BossInfo` |
| Guild | `P2MyGuildInfo`, `P2GuildBossInfo` (chỉ đọc khi có guild) |
| Việc hằng ngày | `P3MissionList`, `P4Mail`, `P4DiamondSpending`, `P2KeyStatus` |

Giao diện gồm 4 thẻ KPI, danh sách **Việc nên làm hôm nay** (tối đa 5 gợi ý, có nhãn rủi ro), **Lịch hôm nay (UTC+7)**, trạng thái hệ thống và cảnh báo. Gợi ý chỉ mở được các tab đã có; tab chưa làm hiển thị **Sắp có**. Mobile dùng 2 cột KPI và xếp dọc các panel.

## Tab Daily

Mỗi tài khoản có một danh sách hoạt động daily riêng. Server đọc trạng thái thật từ game trước khi cho nhận, và kiểm tra lại ngay trước khi gọi lệnh nhận:

| Mục | Nguồn đọc | Lệnh nhận |
|---|---|---|
| Thư | `P1MailHasGift`, dự phòng `P4Mail` | `P1MailClaimAll` |
| Thưởng đăng nhập | `P3GiftDay` | `P1GiftDayClaim @Day` |
| Thưởng online | `P3GiftTimeStatus` | `P3GiftTimeClaim` |
| Thưởng nhiệm vụ | `P3MissionList` (`State = 1`) | `P1MissionClaim2 @MissionId` |
| Vòng quay miễn phí | `P4MainLoad.TurnplateFreeCount` | `P1TurnplateSpin @Times` |
| Cào thẻ miễn phí | `P2Scratch.FreeAvailable` | `P1Scratch` |
| Quà cấp độ | `P3Gift` (`Unlocked = 1`, `Claimed = 0`) | `P1GiftClaim @Tier` |
| Mốc tiêu Kim cương | `P4DiamondSpending` | `P1DiamondSpendingClaim @Milestone` |

Nguyên tắc an toàn:

- Chỉ nhận mục đang thực sự khả dụng; mục không khả dụng sẽ bị bỏ qua và ghi vào nhật ký.
- Không tự mua lượt quay, không tiêu Kim cương. Vòng quay chỉ dùng `TurnplateFreeCount`; cào thẻ chỉ dùng `FreeAvailable`.
- Nhiệm vụ và quà cấp độ được nhận lần lượt, có nghỉ ngắn giữa các request.
- Tài khoản phải đang `active`, đang bật và còn session token; server kiểm tra lại điều kiện này.

## Tab Huấn luyện

Ba mục con, tất cả đều có bước xem trước và xác nhận trước khi chạy. Không mua lượt, không tiêu Kim cương, không đổi Vàng lấy Energy.

### Cốt truyện

- Đọc `P2StageProgress`, `P4MainLoad`, `P4StaminaStatus`, `P3TeamPower`, `P4BagItem` và `P3StageList @Task=1..6` (catalog cache 10 phút).
- Hai chế độ: **Cày lại** stage đã qua (chọn stage) và **Đẩy cốt truyện** (chạy stage hiện tại, dừng nếu không tiến được).
- Gợi ý 3 chế độ **EXP / Vàng / Cân bằng**, tối đa 3 stage mỗi chế độ. Nguồn: `Đo thực tế` (mẫu lưu trong `story_stage_stats`), `Tham khảo` (dữ liệu đo trước đây), `Danh mục` (catalog). Stage có Vàng/NL bất thường bị loại khỏi gợi ý.
- Mỗi request chạy tối đa 5 trận để cập nhật tiến độ. **Số trận tối đa = 0** nghĩa là không giới hạn, chạy đến khi hết Energy/vật phẩm hoặc gặp điều kiện dừng.
- Tùy chọn **Dùng vật phẩm hồi năng lượng** (mặc định tắt): chỉ dùng vật phẩm `UseType=3` có sẵn, chọn món nhỏ nhất đủ bù thiếu hụt; không mua bằng Vàng/Kim cương.
- Trận đấu xác thực thắng/thua qua `/battle/9vs9/log`; EXP/Vàng tính từ chênh lệch `P4MainLoad` trước/sau.
- Dừng khi: thua, hết Energy, stage khóa, chưa có đội hình, hết lượt dùng vật phẩm/không còn vật phẩm, lỗi phiên, hoặc người dùng bấm dừng.

### Động huấn luyện

- Đọc `P4TrainStatus` và `P3TrainStageList @Cave` cho từng động đang mở.
- Chỉ chạy động `IsOpen=1`; hiển thị lượt Công/Thủ còn lại, hệ ưu tiên và mức giảm lực khi sai hệ.
- Mỗi lần chạy đọc lại `P4TrainStatus`; dừng khi `Closed`, `LowLevel`, `NoRun`, thua hoặc hết lượt.

### Thử thách tối thượng

- Đọc `P4UltimateStatus @Mode=1/2`, `P3UltimateBuffList @Mode`.
- Chạy tuần tự theo `NextStage`, xác thực thắng qua battle log; dừng khi thua, hết lượt hoặc có buff/thưởng đang chờ.
- Buff/thưởng đang chờ phải được nhận qua nút xác nhận (`P1UltimateBuyBuff`, `P2UltimateClaim`) trước khi chạy tiếp.

## Tab Boss

Hai thẻ **Vĩ Thú Tập Kích** và **Guild Boss**. Mỗi hit là một request riêng; khi chọn nhiều hit, giao diện tự chờ cooldown (kèm jitter) và vẫn dừng được giữa chừng. Không mua lượt, không tiêu Kim cương.

### Vĩ Thú Tập Kích

- Đọc `P4MainLoad`, `P2BossInfo`, `P3BossFightRank`.
- Hiển thị boss, phiên, khung giờ, HP dùng chung, hướng Công/Thủ (kèm nhãn **chưa xác nhận**), Fame, hạng, sát thương và cooldown.
- Countdown đếm tới giờ đóng khi `EventOpen=1`, hoặc tới giờ mở khi `EventOpen=0` (kèm nhãn ngày mai).
- Mỗi hit gọi `POST /api1/api/battle/boss`; xác thực bằng `Result=1` và `Dame>0` hoặc HP giảm. Không dùng `Win`.
- Dừng khi: cửa sổ đóng, boss đã bị hạ, cooldown, cửa sổ sắp đóng, không xác thực được sát thương, lỗi hoặc người dùng bấm dừng.
- Cooldown thiết kế 20 giây; server trả `CooldownRemain` thực tế.

### Guild Boss

- Đọc `P2MyGuildInfo`, `P2GuildBossInfo`, `P3GuildBossRank`; không có guild thì chỉ hiển thị trạng thái khóa.
- Hiển thị HP dùng chung, lượt còn lại (`HitsPerDay - HitsUsed`), cooldown, sát thương, hạng, EXP guild/cống hiến mỗi hit và quà hạ boss.
- Mỗi hit gọi `POST /api1/api/battle/guildboss`; xác thực bằng `Result=1`, `Dame>0` và `HitsLeft` giảm hoặc HP giảm. `Win:false` là bình thường.
- Dừng khi: chưa có guild, hết lượt, boss đã bị hạ, cooldown, không xác thực được sát thương, lỗi hoặc người dùng bấm dừng.

### An toàn

- Luôn có hộp xác nhận trước mỗi lô hit, nêu rõ số hit, HP hiện tại và cảnh báo ảnh hưởng tới người chơi khác.
- Không thêm bảng thống kê mới; lịch sử hit chỉ ghi vào **Nhật ký** (`boss.beast`, `boss.guild`).
- Chỉ dùng tài khoản đang bật, `active` và còn session; server kiểm tra lại điều kiện.

## Tab PvP

Hai thẻ **Đấu Rank** và **Cướp vàng**. Trước mỗi lô, tool quét lực chiến đối thủ qua `P3TeamVisit` (tổng `TotalAtk + TotalDef` của các slot có ninja) và **chỉ chọn đối thủ có lực chiến thấp hơn**. Mỗi trận là một request riêng, tốn 1 BP; không mua BP, không tiêu Kim cương.

### Đấu Rank

- Đọc `P2Info`, `P4MainLoad`, `P4StaminaStatus`, `P3TeamPower`, `P2RankList`, `P2RankTop20`.
- Hạng của bạn lấy từ hàng của mình trong `P2RankList`; nếu game không trả về, suy ra `max(RankNo) + 1`.
- Chọn các hạng phía trên gần nhất có lực chiến thấp hơn; bỏ qua đối thủ mạnh hơn hoặc chưa đọc được lực chiến.
- Mỗi trận gọi `POST /api1/api/battle/rank`; xác thực `Win` qua `/battle/9vs9/log`.
- Thắng đổi hạng; thua dừng lô.

### Cướp vàng

- Đọc danh sách mục tiêu từ `POST /api1/api/battle/plunder-list` và `P2PlunderTop20`.
- Lọc mục tiêu có lực chiến thấp hơn, sắp xếp theo Vàng giảm dần.
- Mỗi trận gọi `POST /api1/api/battle/plunder`; xác thực `Win` qua `/battle/9vs9/log`.
- Thắng lấy tối đa 20.000 vàng/trận, tối đa 60.000 vàng/người/ngày; `NoGold` thì bỏ qua mục tiêu đó và thử mục tiêu kế tiếp.

### An toàn

- Luôn có hộp xác nhận trước mỗi lô, nêu danh sách đối thủ, lực chiến so với bạn và số đối thủ bị bỏ qua.
- Dừng khi: hết BP, thua, đối thủ mạnh hơn, không xác thực được kết quả, lỗi hoặc người dùng bấm dừng.
- Không thêm bảng thống kê mới; lịch sử trận ghi vào **Nhật ký** (`pvp.rank`, `pvp.plunder`).

## Tab Đội hình

- Đọc `P3Team`, `P3TeamNinjaList`, `P3NinjaAttributePicker @Mode=0`, `P3SlotUnlock`, `P3TeamPower`, `P2BattleTeamStat`, `P3TeamEquipList`.
- Hiển thị 10 slot theo cấp mở khóa (1, 1, 1, 10, 20, 30, 45, 60, 75, 90), kể cả slot trống hoặc chưa mở.
- Mỗi ninja có icon, tên, level, sao, hệ (Hỏa/Phong/Thủy/Lôi/Thổ), bậc (Thường/Super/Kage), vai trò Công/Thủ, Công/Thủ/Lực chiến, bond và trang bị.
- **Dùng đội hình mạnh nhất**: chọn ninja theo thứ tự ưu tiên bond → chỉ số của hướng đang chọn → lực chiến, sau đó mặc trang bị cũng theo bond → chỉ số. Có bản xem trước và bước xác nhận trước khi đổi đội hình thật.
- Chỉ ninja đang nằm trong đội mới có dữ liệu bond; ninja ngoài đội được tính theo chỉ số và trang bị.

## Tab Túi đồ

- Tab con **Ninja**: toàn bộ ninja sở hữu, kèm tag `Trong đội · Slot n`; xem chi tiết hoặc đổi chỗ giữa các slot.
- Tab con **Trang bị**: vũ khí và giáp, kèm tag `Đang mặc · <ninja>` và slot; mặc vào ninja, chuyển slot hoặc tháo ra.
- Tab con **Vật phẩm**: vật phẩm đọc được từ `P4BagItem` / `P4BagNinjaStack` / `P4BagEquipStack`; chọn số lượng và dùng trực tiếp qua `POST /api1/api/reward/use-item`.
- Tab con **Ngọc**: ngọc đọc được từ `P4BagGem`.
- Túi đồ dùng chung dữ liệu đội hình, nên sau khi đổi ninja/trang bị tab Đội hình sẽ tự đọc lại.
- Khi túi trống, các procedure `P4Bag*` chỉ trả về dòng tiền tệ (Vàng/Kim cương/Năng lượng/BP); giao diện vẫn hiển thị phần tiền tệ và danh sách ninja/trang bị.

## Tab Cố vấn

Tab **chỉ đọc**: không gửi lệnh thay đổi, không tiêu Kim cương. Mỗi tài khoản được đọc bằng cùng nguồn với tab Tổng quan (`P4MainLoad`, `P4StaminaStatus`, `P3TeamPower`, `P2StageProgress`, `P4TrainStatus`, `P4UltimateStatus`, `P2BossInfo`, guild, mission, mail, mốc Kim cương) rồi biến gợi ý thành danh sách việc nên làm.

- **Quét tài khoản** đọc lại một tài khoản; **Quét tất cả** đọc lần lượt các tài khoản đang đăng nhập, nghỉ 400–800 ms giữa mỗi tài khoản.
- Kết quả cache **10 phút**; quá hạn được đánh dấu **Dữ liệu cũ** nhưng vẫn hiển thị.
- Mỗi tài khoản có tối đa 5 gợi ý theo thứ tự ưu tiên, nhãn rủi ro và nút mở thẳng tab liên quan với đúng tài khoản đó.
- Lỗi ở một tài khoản không dừng cả lượt quét; lỗi được ghi vào **Nhật ký** (`advisor.scan`).
- Thống kê nhanh: số tài khoản cần xử lý, đã quét, dữ liệu cũ, cảnh báo và số phần thưởng có thể nhận.

## Tab Bot

Bot chạy một vòng lặp tuần tự cho các tài khoản **đang bật Auto**, `active` và còn session. Mặc định **dry-run**: chỉ đọc trạng thái và ghi việc sẽ làm, không gửi lệnh thay đổi.

### Cấu hình

| Mục | Mặc định | Ý nghĩa |
|---|---|---|
| Dry-run | bật | Chỉ đọc và báo việc sẽ làm |
| Chu kỳ | 300 giây | Khoảng cách giữa hai lần chạy của mỗi tài khoản, có jitter |
| Hành động / chu kỳ | 1 | Tối đa 1–5 hành động, nghỉ ngắn giữa các hành động |
| Nhận daily | bật | Tự hoàn thành nhiệm vụ an toàn rồi `claimAllDaily`, tối đa mỗi 30 phút |
| Cốt truyện | tắt | `runStoryBatch` chế độ đẩy, tối đa 5 trận/lần, có trần/ngày |
| Boss | tắt | Một hit Vĩ Thú, sau đó Guild Boss; tôn trọng cooldown |
| PvP Rank | tắt | Quét 1 đối thủ yếu hơn rồi đánh 1 trận, có trần/ngày |

Cấu hình lưu trong bảng `engine_settings` của `data/bot.db`.

### Tự hoàn thành nhiệm vụ

Mỗi chu kỳ daily, bot đọc `P3MissionList` và tự hiểu từng nhiệm vụ thay vì hard-code số lần:

- Ưu tiên `Period = 1` (ngày), sau đó mới đến tuần/tháng.
- Đọc `Action`, `GoScene`, `Name`, `Count`, `Target`, `Pct`, `State` để biết **phải làm gì** và **còn bao nhiêu lần**.
- Gộp các nhiệm vụ cùng loại/cùng kỳ thành một lượt hành động, chạy đúng số lần còn thiếu (có trần mỗi lượt và ngân sách/ngày).
- Sau mỗi loại hành động, đọc lại `P3MissionList` để xác nhận tiến độ thật; không tin kết quả battle đơn thuần.

| Nhiệm vụ nhận diện | Hành động |
|---|---|
| Điểm danh / check-in | `P0GiftDayCheckIn` |
| Plot / cốt truyện / lên cấp | `runStoryBatch` chế độ đẩy, dừng khi hết Energy hoặc gặp tường |
| Cướp vàng / plunder | `planPlunderBattles` + `battlePlunder` (chỉ khi bật PvP) |
| Thử thách tối thượng / ultimate | `runUltimateBatch`, tự xử lý buff/reward đang chờ |
| Huấn luyện / training | `runCaveBatch` ở động đang mở còn lượt |
| Boss | Một hit Vĩ Thú, sau đó Guild Boss |
| Vòng quay / turnplate | Chỉ quay lượt miễn phí |
| Nâng cấp ninja/trang bị, nạp tiền, Atk+Def | **Bỏ qua** và ghi lý do, không tiêu tài nguyên hay nạp tiền |

Nhiệm vụ đã `State = 1` được để nguyên cho `claimAllDaily` nhận; nhiệm vụ `State = 2/3` coi như đã nhận.

### An toàn

- Chỉ tác động tài khoản `enabled`, `active`, còn session và `autoEnabled = true`.
- Không mua lượt, không tiêu Kim cương, không đổi Vàng lấy tài nguyên.
- Tự hoàn thành nhiệm vụ chỉ dùng Energy/BP/lượt miễn phí sẵn có; không mua thêm bằng Kim cương. Cướp vàng chỉ chạy khi bật PvP; nâng cấp/nạp tiền luôn bị bỏ qua.
- Mỗi chu kỳ chạy tối đa `maxActions` hành động; mọi hành động đều đi qua module đã có kiểm tra trước/sau.
- Lỗi liên tiếp **5 lần** sẽ treo tài khoản đó; chạy lại thủ công hoặc chạy 1 vòng để mở treo.
- **Dừng bot** là kill switch: vòng lặp dừng ngay sau hành động đang chạy.
- Hoạt động ghi vào **Nhật ký** với tiền tố `engine.*`; tab Bot giữ 80 sự kiện gần nhất.

## Tab Nhật ký

- Ghi lại: thêm/sửa/xóa tài khoản, bật/tắt tài khoản, bật/tắt auto, đăng nhập, đăng xuất, đồng bộ, nhận từng mục daily và nhận tất cả.
- Lọc theo tài khoản và mức độ (`success`, `info`, `warn`, `error`), tải thêm 50 bản ghi mỗi lần.
- SQLite chỉ giữ **5.000 bản ghi gần nhất** để tránh phình database.
- Nhật ký nằm trong `data/bot.db`; xóa database là xóa luôn nhật ký.

## State của tài khoản

| State | Ý nghĩa |
|---|---|
| `new` | Chưa đăng nhập (hoặc vừa đăng xuất) |
| `active` | Đang có phiên hợp lệ |
| `error` | Đăng nhập / đồng bộ lỗi — xem dòng lỗi trên card |
| `disabled` | Tài khoản bị tắt, không cho đăng nhập |

`autoEnabled` chỉ có thể `true` khi state là `active`. Server kiểm tra lại điều kiện này, không chỉ dựa vào UI.

## Luồng đăng nhập

1. `POST /api/api/session/login` bằng tài khoản/mật khẩu đã lưu.
2. `POST /api1/api/session/select-server` để bind nhân vật.
3. Đọc hồ sơ: `P2Info`, `P4MainLoad`, `P3TeamPower`, `P2MyGuildInfo`, `P2RankList`.
4. Lưu token đã bind + snapshot thông tin nhân vật.

Lưu ý từ `api.md`: token mới có thể trả `result: "-1"` ở `select-server` (lỗi môi trường Alpha), nên chỉ coi là thành công khi đọc được hồ sơ. Token hỏng/không bind được sẽ đưa tài khoản về state `error`.

## Cấu hình

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | `3000` | Cổng HTTP |
| `HOST` | `127.0.0.1` | Địa chỉ lắng nghe |
| `DATA_DIR` | `./data` | Nơi lưu SQLite và khóa mã hóa |
| `GAME_API_BASE` | `https://naruto.id.vn` | Base URL của game (đổi khi test mock) |
| `GAME_API_KEY` | `ninja-local-dev-9f83ac21` | `X-Api-Key` |
| `GAME_CLIENT_VERSION` | `26.11.21` | Fallback nếu không đọc được `/version` |
| `GAME_TIMEOUT_MS` | `15000` | Timeout request tới game |

## API nội bộ

| Method | Đường dẫn | Mô tả |
|---|---|---|
| `GET` | `/api/health` | Kiểm tra server |
| `GET` | `/api/accounts?q=&status=` | Danh sách + thống kê |
| `POST` | `/api/accounts` | Thêm tài khoản |
| `PATCH` | `/api/accounts/:id` | Cập nhật (mật khẩu trống = giữ nguyên) |
| `DELETE` | `/api/accounts/:id` | Xóa |
| `POST` | `/api/accounts/:id/toggle` | Bật/tắt tài khoản |
| `POST` | `/api/accounts/:id/login` | Đăng nhập game |
| `POST` | `/api/accounts/:id/logout` | Đăng xuất, xóa phiên cục bộ |
| `POST` | `/api/accounts/:id/sync` | Đồng bộ lại thông tin nhân vật |
| `POST` | `/api/accounts/:id/auto` | Bật/tắt auto (`{"enabled": true}`) |
| `GET` | `/api/accounts/:id/dashboard` | Đọc tổng quan chỉ đọc (KPI, gợi ý, lịch, cảnh báo) |
| `GET` | `/api/accounts/:id/daily` | Đọc trạng thái các mục daily |
| `POST` | `/api/accounts/:id/daily/claim` | Nhận một mục (`{"feature": "mail"}`) |
| `POST` | `/api/accounts/:id/daily/claim-all` | Nhận tất cả mục đang khả dụng |
| `GET` | `/api/accounts/:id/missions` | Đọc và phân loại nhiệm vụ (tiến độ, loại hành động, mục bỏ qua) |
| `GET` | `/api/accounts/:id/story` | Đọc tiến trình, năng lượng, vật phẩm hồi NL, catalog và gợi ý stage |
| `POST` | `/api/accounts/:id/story/run` | Chạy cốt truyện theo lô (`{"confirm":true,"mode":"farm"\|"push","scid":4,"maxRuns":0,"useEnergyItems":false}`) |
| `GET` | `/api/accounts/:id/training` | Đọc động huấn luyện + Thử thách tối thượng |
| `POST` | `/api/accounts/:id/training/caves/run` | Chạy động (`{"confirm":true,"cave":1,"mode":1,"tier":0,"stageNo":1,"maxRuns":0}`) |
| `POST` | `/api/accounts/:id/training/ultimate/run` | Chạy Ultimate (`{"confirm":true,"mode":1,"maxRuns":0,"star":1}`) |
| `POST` | `/api/accounts/:id/training/ultimate/claim` | Nhận buff/thưởng Ultimate (`{"confirm":true,"mode":1,"kind":"reward"}`) |
| `GET` | `/api/accounts/:id/boss` | Đọc Vĩ Thú, Guild Boss, bảng xếp hạng và trạng thái cooldown |
| `POST` | `/api/accounts/:id/boss/beast/hit` | Đánh Vĩ Thú 1 hit (`{"confirm":true}`) |
| `POST` | `/api/accounts/:id/boss/guild/hit` | Đánh Guild Boss 1 hit (`{"confirm":true}`) |
| `GET` | `/api/accounts/:id/pvp` | Đọc BP, hạng, lực chiến, bảng rank và danh sách cướp vàng |
| `POST` | `/api/accounts/:id/pvp/rank/plan` | Quét đối thủ Rank yếu hơn (`{"battles":1..5}`) |
| `POST` | `/api/accounts/:id/pvp/rank/battle` | Đánh Rank 1 trận (`{"confirm":true,"targetRankNo","targetUserId","targetName"}`) |
| `POST` | `/api/accounts/:id/pvp/plunder/plan` | Quét mục tiêu Cướp vàng yếu hơn (`{"battles":1..10}`) |
| `POST` | `/api/accounts/:id/pvp/plunder/battle` | Cướp vàng 1 trận (`{"confirm":true,"targetUserId","targetName"}`) |
| `GET` | `/api/accounts/:id/team` | Đọc đội hình, ninja, bond, trang bị, slot |
| `POST` | `/api/accounts/:id/team/plan` | Tạo đề xuất đội hình mạnh nhất (`{"mode": "atk"\|"def"}`) |
| `POST` | `/api/accounts/:id/team/apply` | Áp dụng đội hình + trang bị (`{"mode": "atk", "confirm": true}`) |
| `GET` | `/api/accounts/:id/bag` | Đọc túi đồ: ninja, trang bị, vật phẩm, tiền tệ |
| `POST` | `/api/accounts/:id/bag/use-item` | Dùng vật phẩm (`{"item": 49, "quantity": 2}`) |
| `POST` | `/api/accounts/:id/bag/team` | Xếp ninja (`{"action":"set","slot":1,"ninjaId":...}`) hoặc đổi chỗ (`{"action":"swap","slotA":1,"slotB":2}`) |
| `POST` | `/api/accounts/:id/bag/equip` | Mặc/chuyển/tháo trang bị (`{"slot":1,"equipId":10442,"equipSlot":1}`; `equipId: 0` để tháo) |
| `GET` | `/api/advisor` | Ảnh chụp Cố vấn từ cache (không gọi game) |
| `POST` | `/api/advisor/scan` | Quét một hoặc nhiều tài khoản (`{"accountIds":[1,2],"force":true}`; bỏ `accountIds` để quét tất cả) |
| `GET` | `/api/engine` | Trạng thái bot, cấu hình, tài khoản và sự kiện gần đây |
| `POST` | `/api/engine/start` | Bật bot (`{"settings":{...}}`, tùy chọn) |
| `POST` | `/api/engine/stop` | Dừng bot (kill switch) |
| `PATCH` | `/api/engine/settings` | Cập nhật cấu hình bot (`{"dryRun":false,"allowStory":true,...}`) |
| `POST` | `/api/engine/tick` | Chạy một vòng ngay, bỏ qua lịch chờ |
| `GET` | `/api/logs?limit=&offset=&accountId=&level=` | Danh sách nhật ký + tổng số bản ghi |

`POST /api/engine/start` và `POST /api/engine/tick` cần `confirm: true`; `PATCH /api/engine/settings` cần `confirm: true` khi đặt `dryRun: false`.

Body thêm tài khoản:

```json
{
  "username": "naruto01",
  "password": "mat-khau-game",
  "server": "S1",
  "characterName": "Naruto",
  "label": "acc chính"
}
```

## Cấu trúc

```
server/
  index.js            HTTP server + API + file tĩnh
  db.js               SQLite, migration, state tài khoản
  secret-box.js       Mã hóa mật khẩu / token
  game/client.js      Client gọi API game
  game/service.js     Luồng login / logout / sync
  game/dashboard.js   Đọc tổng quan chỉ đọc + gợi ý/lịch/cảnh báo
  game/daily.js       Đọc trạng thái + nhận thưởng daily
  game/missions.js    Đọc hiểu nhiệm vụ + tự hoàn thành hành động an toàn
  game/story.js       Đọc/chạy cốt truyện, gợi ý stage, hồi năng lượng bằng vật phẩm
  game/training.js    Đọc/chạy động huấn luyện + Thử thách tối thượng
  game/boss.js        Đọc Vĩ Thú/Guild Boss + đánh 1 hit, xác thực sát thương
  game/pvp.js         Đọc PvP + quét lực chiến + đánh Rank/Cướp vàng 1 trận
  game/team.js        Đọc đội hình, bond, trang bị + chọn đội mạnh nhất
  game/bag.js         Đọc túi đồ + dùng vật phẩm
  game/gacha.js       Quay ninja (house-draw), luôn vòng tốt nhất
  game/craftment.js   Nâng cấp ninja / trang bị bằng nguyên liệu
  game/runlog.js      Định dạng log 4 dòng Tien trinh / Cost / Gain / Trang thai
  game/advisor.js     Tổng hợp gợi ý theo tài khoản + cache 10 phút
  game/engine.js      Vòng lặp bot, ngân sách, dry-run, kill switch
public/
  index.html          Giao diện 13 tab: Tài khoản / Tổng quan / Daily / Huấn luyện / Boss / PvP / Đội hình / Túi đồ / Quay ninja / Craftment / Nhật ký / Cố vấn / Bot
  style.css           Theme tối, responsive
  tailwind.css        Tailwind utility (build từ styles/tailwind.input.css)
  app.js              Render các tab, global account bar, modal, toast, gọi API
dev/
  mock-game-server.js Mock API để test không cần tài khoản thật
data/                 (tự tạo, đã gitignore)
  bot.db              SQLite
  secret.key          Khóa mã hóa — sao lưu cùng bot.db
```

## Lưu ý an toàn

- `data/secret.key` là chìa khóa giải mã mật khẩu và token. Mất file này thì không khôi phục được. Sao lưu **cả** `bot.db` và `secret.key`, không commit lên git.
- Trang chưa có đăng nhập; mặc định chỉ nghe `127.0.0.1`. Nếu mở ra LAN, hãy thêm lớp xác thực.
- Chỉ dùng với tài khoản bạn sở hữu, giữ tần suất request thấp khi kiểm thử.

## Bước tiếp theo

Đã có đủ 11 tab, engine bot và module tự hiểu/tự hoàn thành nhiệm vụ ngày. Việc tiếp theo là **soak test** trên server thật với dry-run 24 giờ, đối chiếu gợi ý Cố vấn với trạng thái game, rồi mới bật từng hành động của Bot theo thứ tự: nhiệm vụ + nhận daily → cốt truyện → boss → PvP. Chưa tự động hoá guild, chat, nạp tiền hoặc quản lý thành viên.
