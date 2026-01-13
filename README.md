# SITCON 2026 閉幕動畫

SITCON 2026 年會閉幕影片，使用 Three.js 製作 3D 動畫背景，搭配 GSAP 時間軸控制動畫流程。

## 專案架構

```
src/
├── main.ts          # 主程式進入點，初始化時間軸
├── three-setup.ts   # Three.js 場景、相機、渲染器設定
├── style.css        # 樣式設定
└── scenes/          # 各場景動畫
    ├── intro.ts     # 開場動畫（紫色浮動方塊）
    ├── names.ts     # 工作人員名單（青綠色粒子球體）
    └── outro.ts     # 結尾動畫（橘紅色環形圖案）
```

## 技術棧

- **Vite** - 開發伺服器與建置工具
- **TypeScript** - 型別安全的 JavaScript
- **Three.js** - 3D 渲染引擎
- **GSAP** - 動畫時間軸控制
- **gsap-video-export** - 將動畫輸出為影片檔

## 開發指引

### 環境需求

- Node.js 18+
- pnpm 10+

### 安裝依賴

```bash
pnpm install
```

### 啟動開發伺服器

```bash
pnpm dev
```

開啟瀏覽器至 http://localhost:5173 預覽動畫。

> 如果要沒有控制的版本，可以到 <http://localhost:5173/?export=true>。

### 建置專案

```bash
pnpm build
```

### 輸出影片

```bash
pnpm render
```

將動畫輸出為 `out.mp4`（1920x1080，60fps）。

## 新增場景

1. 在 `src/scenes/` 建立新的場景檔案
2. 匯入 Three.js 與 `three-setup.ts` 的共用元件：

```typescript
import * as THREE from "three";
import { registerAnimate, scene, unregisterAnimate } from "../three-setup";
```

3. 建立場景函式並加入時間軸：

```typescript
export function myScene(tl: gsap.core.Timeline) {
  // 建立 3D 物件
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 註冊動畫函式
  function animate(time: number) {
    mesh.rotation.y = time;
  }
  
  tl.call(() => registerAnimate(animate), [], startTime);

  // 清理函式
  function cleanup() {
    unregisterAnimate(animate);
    scene.remove(mesh);
  }
  
  tl.call(cleanup, [], endTime);
}
```

4. 在 `main.ts` 匯入並加入時間軸

## 動畫系統說明

### 時間軸

使用 GSAP Timeline 控制所有動畫的時序，每個場景函式接收同一個 timeline 實例，透過指定時間點來安排動畫。

### Three.js 動畫註冊

- `registerAnimate(fn)` - 註冊動畫函式，每幀會被呼叫
- `unregisterAnimate(fn)` - 取消註冊動畫函式
- 場景結束時務必清理所有 3D 物件與動畫函式，避免記憶體洩漏

### 背景顏色

透過 GSAP 對 `body` 的 `backgroundColor` 進行動畫，實現場景切換時的背景色漸變。

## 授權

Apache-2.0
