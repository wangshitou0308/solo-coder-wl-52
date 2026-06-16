## 1. 架构设计

```mermaid
graph TB
    subgraph "前端层 (React 18)"
        A["页面层 (Pages)"]
        B["组件层 (Components)"]
        C["状态管理层 (Zustand)"]
    end
    
    subgraph "业务逻辑层"
        D["业务 Hooks"]
        E["工具函数 (Utils)"]
    end
    
    subgraph "数据层"
        F["IndexedDB 封装"]
        G["数据模型定义"]
    end
    
    subgraph "可视化层"
        H["图表 (Recharts)"]
        I["地图 (Leaflet)"]
    end
    
    A --> B
    B --> C
    C --> D
    D --> F
    F --> G
    A --> H
    A --> I
```

## 2. 技术描述

- **前端框架**：React@18 + TypeScript
- **构建工具**：Vite@5
- **样式方案**：TailwindCSS@3 + CSS 变量（主题系统）
- **状态管理**：Zustand
- **路由**：react-router-dom@6
- **数据库**：IndexedDB（idb 库封装）
- **图表库**：Recharts
- **地图库**：Leaflet + react-leaflet
- **图标库**：lucide-react
- **日期处理**：date-fns

## 3. 路由定义

| 路由 | 用途 |
|-----|-----|
| `/` | 首页仪表盘 - 待回信提醒、概览统计、最近记录 |
| `/letters` | 信件列表 - 所有信件记录，筛选搜索 |
| `/letters/new` | 新增信件 - 创建新信件/明信片记录 |
| `/letters/:id` | 信件详情 - 查看单条记录详情 |
| `/letters/:id/edit` | 编辑信件 - 修改现有记录 |
| `/contacts` | 联系人列表 - 所有笔友概览 |
| `/contacts/:id` | 联系人时间线 - 与某笔友的通信时间线 |
| `/postcards` | 明信片专区 - 分类浏览 + 地图 |
| `/dashboard` | 数据看板 - 统计图表与分析 |

## 4. 数据模型

### 4.1 实体关系图

```mermaid
erDiagram
    LETTER {
        string id PK "主键"
        string type "类型: letter/postcard"
        string direction "方向: sent/received"
        string contact_id FK "联系人ID"
        string contact_name "联系人姓名（冗余）"
        string contact_address "联系人地址"
        string contact_city "城市"
        string contact_country "国家"
        float contact_latitude "纬度（可选）"
        float contact_longitude "经度（可选）"
        date sent_date "寄出日期"
        date received_date "收到日期"
        float stamp_value "邮票面值"
        string stamp_description "邮票图案描述"
        date postmark_date "邮戳日期"
        string postmark_location "邮戳地点"
        string notes "备注"
        boolean is_replied "是否已回复（仅收到）"
        string reply_to_id FK "回复的信件ID"
        string[] photos "照片（Base64）"
        date created_at "创建时间"
        date updated_at "更新时间"
    }
    
    CONTACT {
        string id PK "主键"
        string name "姓名"
        string address "地址"
        string city "城市"
        string country "国家"
        string avatar "头像（可选）"
        string notes "备注"
        date created_at "创建时间"
    }
    
    CONTACT ||--o{ LETTER : "往来"
    LETTER ||--o| LETTER : "回复关联"
```

### 4.2 IndexedDB Store 定义

```typescript
// database: letter_tracker

interface DBConfig {
  name: 'letter_tracker';
  version: 1;
  stores: {
    contacts: {
      keyPath: 'id';
      indexes: [
        { name: 'name', keyPath: 'name', unique: false },
        { name: 'city', keyPath: 'city', unique: false },
        { name: 'country', keyPath: 'country', unique: false },
        { name: 'created_at', keyPath: 'created_at', unique: false }
      ];
    };
    letters: {
      keyPath: 'id';
      indexes: [
        { name: 'contact_id', keyPath: 'contact_id', unique: false },
        { name: 'type', keyPath: 'type', unique: false },
        { name: 'direction', keyPath: 'direction', unique: false },
        { name: 'sent_date', keyPath: 'sent_date', unique: false },
        { name: 'received_date', keyPath: 'received_date', unique: false },
        { name: 'is_replied', keyPath: 'is_replied', unique: false },
        { name: 'contact_city', keyPath: 'contact_city', unique: false },
        { name: 'contact_country', keyPath: 'contact_country', unique: false },
        { name: 'created_at', keyPath: 'created_at', unique: false }
      ];
    };
  };
}
```
