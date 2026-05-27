# Projects & Travel Diary 全栈实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 RuoYi-Vue-Pro 中创建 yudao-module-ip 模块，实现项目展示和旅行日记的完整 CRUD + 公开 API，并在 Next.js 前端展示真实数据。

**Architecture:** 后端单 jar 模块 yudao-module-ip，代码生成器出管理端骨架，手动补充公开 App 端 Controller；前端以 portfolio-website-design 为基础，增加 /projects 和 /travel 路由，通过 lib/api 层调用后端接口。

**Tech Stack:** Java 17 / Spring Boot 3 / MyBatis-Plus / RuoYi-Vue-Pro；Next.js 14 / TypeScript / Tailwind CSS / Framer Motion

---

## Phase 1 — 后端模块骨架

---

### Task 1: 创建 yudao-module-ip Maven 模块

**Files:**
- Create: `personal-ip-backend/yudao-module-ip/pom.xml`
- Create: `personal-ip-backend/yudao-module-ip/src/main/java/cn/iocoder/yudao/module/ip/.gitkeep`
- Create: `personal-ip-backend/yudao-module-ip/src/main/resources/.gitkeep`

- [ ] **Step 1: 创建模块目录结构**

在 IDEA 中或文件管理器中手动创建以下目录：
```
personal-ip-backend/
└── yudao-module-ip/
    └── src/
        ├── main/
        │   ├── java/cn/iocoder/yudao/module/ip/
        │   └── resources/mapper/ip/
        └── test/
            └── java/cn/iocoder/yudao/module/ip/
```

- [ ] **Step 2: 创建 pom.xml**

新建文件 `personal-ip-backend/yudao-module-ip/pom.xml`，内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>cn.iocoder.boot</groupId>
        <artifactId>yudao</artifactId>
        <version>${revision}</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>
    <artifactId>yudao-module-ip</artifactId>
    <packaging>jar</packaging>

    <name>${project.artifactId}</name>
    <description>ip 模块 — 个人 IP 网站内容管理（项目展示、旅行日记、随想等）</description>

    <dependencies>
        <dependency>
            <groupId>cn.iocoder.boot</groupId>
            <artifactId>yudao-module-infra</artifactId>
            <version>${revision}</version>
        </dependency>

        <!-- Web + Security -->
        <dependency>
            <groupId>cn.iocoder.boot</groupId>
            <artifactId>yudao-spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- DB -->
        <dependency>
            <groupId>cn.iocoder.boot</groupId>
            <artifactId>yudao-spring-boot-starter-mybatis</artifactId>
        </dependency>

        <!-- Test -->
        <dependency>
            <groupId>cn.iocoder.boot</groupId>
            <artifactId>yudao-spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

---

### Task 2: 注册模块到根 pom 和 yudao-server

**Files:**
- Modify: `personal-ip-backend/pom.xml`
- Modify: `personal-ip-backend/yudao-server/pom.xml`

- [ ] **Step 1: 在根 pom.xml 的 `<modules>` 块中添加新模块**

找到 `personal-ip-backend/pom.xml` 中的 `<modules>` 节，在 `yudao-module-infra` 一行之后添加：

```xml
        <module>yudao-module-ip</module>
```

完整 modules 节应如下：
```xml
    <modules>
        <module>yudao-dependencies</module>
        <module>yudao-framework</module>
        <module>yudao-server</module>
        <module>yudao-module-system</module>
        <module>yudao-module-infra</module>
        <module>yudao-module-ip</module>   <!-- 新增 -->
        <!-- 其余注释掉的模块保持不动 -->
    </modules>
```

- [ ] **Step 2: 在 yudao-server/pom.xml 中引入依赖**

找到 `personal-ip-backend/yudao-server/pom.xml` 的 `<dependencies>` 块，在 `yudao-module-infra` 依赖之后添加：

```xml
        <dependency>
            <groupId>cn.iocoder.boot</groupId>
            <artifactId>yudao-module-ip</artifactId>
            <version>${revision}</version>
        </dependency>
```

- [ ] **Step 3: 在 IDEA 中刷新 Maven**

右键根目录 pom.xml → Maven → Reload Project。确认 yudao-module-ip 出现在项目模块列表中。

---

## Phase 2 — Projects 模块（后端）

---

### Task 3: 创建 ip_project 表

**Files:**
- Create: `personal-ip-backend/yudao-module-ip/src/main/resources/sql/ip_project.sql`

- [ ] **Step 1: 创建 SQL 文件**

```sql
-- personal-ip-backend/yudao-module-ip/src/main/resources/sql/ip_project.sql
CREATE TABLE IF NOT EXISTS `ip_project` (
  `id`           bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name`         varchar(100) NOT NULL                COMMENT '项目名称',
  `slug`         varchar(100) NOT NULL                COMMENT 'URL 标识，唯一',
  `description`  varchar(500)     DEFAULT NULL        COMMENT '简短描述',
  `cover_url`    varchar(500)     DEFAULT NULL        COMMENT '封面图 URL',
  `preview_url`  varchar(500)     DEFAULT NULL        COMMENT '悬浮预览图 URL',
  `github_url`   varchar(300)     DEFAULT NULL        COMMENT 'GitHub 链接',
  `demo_url`     varchar(300)     DEFAULT NULL        COMMENT '演示链接',
  `tech_stack`   varchar(300)     DEFAULT NULL        COMMENT '技术栈，逗号分隔',
  `content`      longtext         DEFAULT NULL        COMMENT 'Markdown 详情',
  `sort_order`   int          NOT NULL DEFAULT 0      COMMENT '排序权重',
  `featured`     tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否首页置顶',
  `status`       tinyint      NOT NULL DEFAULT 0      COMMENT '状态：0草稿 1发布',
  `creator`      varchar(64)      DEFAULT ''          COMMENT '创建者',
  `create_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`      varchar(64)      DEFAULT ''          COMMENT '更新者',
  `update_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否删除',
  `tenant_id`    bigint       NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目展示';
```

- [ ] **Step 2: 在 MySQL 中执行 SQL**

打开 IDEA Database 工具或 MySQL Workbench，选中 `ruoyi-vue-pro` 数据库，执行上面的 SQL。

执行成功后验证：
```sql
SHOW TABLES LIKE 'ip_project';
-- 应返回 1 行
```

---

### Task 4: 代码生成器生成 Projects 管理端代码

**操作：浏览器访问芋道管理后台**

- [ ] **Step 1: 打开代码生成器**

浏览器访问 `http://localhost:1024`，登录（admin/admin123）。

菜单：基础设施 → 代码生成

- [ ] **Step 2: 导入表**

点击「导入」按钮 → 选择数据库 `ruoyi-vue-pro` → 搜索 `ip_project` → 勾选 → 确认导入。

- [ ] **Step 3: 配置生成参数**

点击 ip_project 行的「编辑」按钮，按以下配置填写：

| 字段 | 值 |
|------|-----|
| 模块名 | ip |
| 业务名 | project |
| 类名称 | Project |
| 类描述 | 项目展示 |
| 上级菜单 | 选择「首页」或留空 |
| 生成模板 | 单表（增删改查） |
| 前端类型 | Vue3（yudao-ui-admin-vue3） |

字段配置（在「字段信息」tab）：
- `slug`：不允许修改勾去掉（允许编辑），必填
- `featured`、`status`：字段类型选「radio」，字典类型留空（无需字典）
- `content`：显示类型改为「textarea」

保存。

- [ ] **Step 4: 预览并下载代码**

点击「预览」确认生成代码无误，然后点击「生成代码」下载 zip 包。

zip 解压后结构：
```
backend/
└── cn/iocoder/yudao/module/ip/
    ├── controller/admin/project/
    │   ├── ProjectController.java
    │   └── vo/
    │       ├── ProjectPageReqVO.java
    │       ├── ProjectSaveReqVO.java
    │       └── ProjectRespVO.java
    ├── dal/dataobject/project/
    │   └── ProjectDO.java
    ├── dal/mysql/project/
    │   └── ProjectMapper.java
    ├── service/project/
    │   ├── ProjectService.java
    │   └── ProjectServiceImpl.java
    └── convert/project/
        └── ProjectConvert.java
resources/
└── mapper/ip/
    └── ProjectMapper.xml
frontend/   ← 本次不需要，可忽略
sql/        ← 菜单 SQL，选择性执行
```

- [ ] **Step 5: 将生成代码复制到模块中**

将 zip 中 `backend/` 下的所有 Java 文件复制到：
```
personal-ip-backend/yudao-module-ip/src/main/java/
```

将 `resources/mapper/ip/ProjectMapper.xml` 复制到：
```
personal-ip-backend/yudao-module-ip/src/main/resources/mapper/ip/
```

---

### Task 5: 精简生成代码 + 添加 AppProjectController

**Files:**
- Modify: `yudao-module-ip/src/main/java/cn/iocoder/yudao/module/ip/controller/admin/project/ProjectController.java`
- Create: `yudao-module-ip/src/main/java/cn/iocoder/yudao/module/ip/controller/app/project/AppProjectController.java`
- Create: `yudao-module-ip/src/main/java/cn/iocoder/yudao/module/ip/controller/app/project/vo/AppProjectRespVO.java`
- Modify: `yudao-module-ip/src/main/java/cn/iocoder/yudao/module/ip/service/project/ProjectService.java`
- Modify: `yudao-module-ip/src/main/java/cn/iocoder/yudao/module/ip/service/project/ProjectServiceImpl.java`

- [ ] **Step 1: 精简 ProjectController.java（删除 Excel 导出）**

打开生成的 `ProjectController.java`，删除以下两个方法（我们不需要 Excel 导出）：

```java
// 删除这个方法
@GetMapping("/export-excel")
@Operation(summary = "导出项目展示 Excel")
@PreAuthorize("@ss.hasPermission('ip:project:export')")
@ApiAccessLog(operateType = EXPORT)
public void exportProjectExcel(...) { ... }
```

其余方法（create/update/delete/get/page）保留不动。

- [ ] **Step 2: 在 ProjectService 接口中添加公开查询方法**

打开 `ProjectService.java`，在已有方法末尾追加：

```java
/**
 * 获得已发布的项目列表，按 sort_order 降序
 */
List<ProjectDO> getPublishedProjectList();

/**
 * 根据 slug 获得已发布的项目
 */
ProjectDO getPublishedProjectBySlug(String slug);
```

- [ ] **Step 3: 在 ProjectServiceImpl 中实现这两个方法**

打开 `ProjectServiceImpl.java`，追加实现：

```java
@Override
public List<ProjectDO> getPublishedProjectList() {
    return projectMapper.selectList(
        new LambdaQueryWrapperX<ProjectDO>()
            .eq(ProjectDO::getStatus, 1)       // 仅发布状态
            .eq(ProjectDO::getDeleted, false)
            .orderByDesc(ProjectDO::getFeatured)  // 置顶优先
            .orderByDesc(ProjectDO::getSortOrder)
    );
}

@Override
public ProjectDO getPublishedProjectBySlug(String slug) {
    return projectMapper.selectOne(
        new LambdaQueryWrapperX<ProjectDO>()
            .eq(ProjectDO::getSlug, slug)
            .eq(ProjectDO::getStatus, 1)
            .eq(ProjectDO::getDeleted, false)
    );
}
```

注意：`LambdaQueryWrapperX` 是芋道框架扩展类，已在 starter-mybatis 中引入，直接使用。

- [ ] **Step 4: 创建 AppProjectRespVO.java**

新建文件 `controller/app/project/vo/AppProjectRespVO.java`：

```java
package cn.iocoder.yudao.module.ip.controller.app.project.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Schema(description = "用户 App - 项目展示 Response VO")
@Data
public class AppProjectRespVO {

    @Schema(description = "主键", example = "1")
    private Long id;

    @Schema(description = "项目名称", example = "Personal IP Site")
    private String name;

    @Schema(description = "URL slug", example = "personal-ip-site")
    private String slug;

    @Schema(description = "简短描述")
    private String description;

    @Schema(description = "封面图 URL")
    private String coverUrl;

    @Schema(description = "悬浮预览图 URL")
    private String previewUrl;

    @Schema(description = "GitHub 链接")
    private String githubUrl;

    @Schema(description = "演示链接")
    private String demoUrl;

    @Schema(description = "技术栈，逗号分隔", example = "Next.js,Java,Three.js")
    private String techStack;

    @Schema(description = "Markdown 详情正文")
    private String content;

    @Schema(description = "是否置顶")
    private Boolean featured;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
```

- [ ] **Step 5: 创建 AppProjectController.java**

新建文件 `controller/app/project/AppProjectController.java`：

```java
package cn.iocoder.yudao.module.ip.controller.app.project;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.app.project.vo.AppProjectRespVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.project.ProjectDO;
import cn.iocoder.yudao.module.ip.service.project.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 项目展示")
@RestController
@RequestMapping("/ip/project")
@Validated
public class AppProjectController {

    @Resource
    private ProjectService projectService;

    @GetMapping("/list")
    @Operation(summary = "获得项目列表（已发布，featured 优先）")
    public CommonResult<List<AppProjectRespVO>> getProjectList() {
        List<ProjectDO> list = projectService.getPublishedProjectList();
        return success(BeanUtils.toBean(list, AppProjectRespVO.class));
    }

    @GetMapping("/get")
    @Operation(summary = "根据 slug 获得项目详情")
    @Parameter(name = "slug", description = "项目 slug", required = true, example = "my-project")
    public CommonResult<AppProjectRespVO> getProjectBySlug(@RequestParam("slug") String slug) {
        ProjectDO project = projectService.getPublishedProjectBySlug(slug);
        if (project == null) {
            return success(null);
        }
        return success(BeanUtils.toBean(project, AppProjectRespVO.class));
    }
}
```

- [ ] **Step 6: 确认编译通过**

在 IDEA 中对 `yudao-module-ip` 模块执行 Build → Build Module，确保无编译错误。

---

## Phase 3 — Travel Diary 模块（后端）

---

### Task 6: 创建 ip_travel_diary 表

**Files:**
- Create: `personal-ip-backend/yudao-module-ip/src/main/resources/sql/ip_travel_diary.sql`

- [ ] **Step 1: 创建 SQL 文件并执行**

```sql
-- personal-ip-backend/yudao-module-ip/src/main/resources/sql/ip_travel_diary.sql
CREATE TABLE IF NOT EXISTS `ip_travel_diary` (
  `id`           bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title`        varchar(200) NOT NULL                COMMENT '章节标题',
  `destination`  varchar(100)     DEFAULT NULL        COMMENT '目的地',
  `trip_date`    date             DEFAULT NULL        COMMENT '旅行日期',
  `cover_url`    varchar(500)     DEFAULT NULL        COMMENT '封面图 URL',
  `accent_color` varchar(20)      DEFAULT '#3B82F6'   COMMENT '章节主题色，如 #FF6B35',
  `content`      longtext         DEFAULT NULL        COMMENT 'Markdown 正文',
  `photos`       json             DEFAULT NULL        COMMENT '图片 URL 数组',
  `sort_order`   int          NOT NULL DEFAULT 0      COMMENT '章节排序',
  `status`       tinyint      NOT NULL DEFAULT 0      COMMENT '状态：0草稿 1发布',
  `creator`      varchar(64)      DEFAULT ''          COMMENT '创建者',
  `create_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`      varchar(64)      DEFAULT ''          COMMENT '更新者',
  `update_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否删除',
  `tenant_id`    bigint       NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='旅行日记';
```

在 `ruoyi-vue-pro` 数据库中执行，验证：
```sql
SHOW TABLES LIKE 'ip_travel_diary';
-- 应返回 1 行
```

---

### Task 7: 代码生成器生成 Travel Diary 管理端代码

**操作：浏览器访问芋道管理后台**

- [ ] **Step 1: 导入 ip_travel_diary 表**

同 Task 4 Step 2，导入 `ip_travel_diary` 表。

- [ ] **Step 2: 配置生成参数**

| 字段 | 值 |
|------|-----|
| 模块名 | ip |
| 业务名 | travelDiary |
| 类名称 | TravelDiary |
| 类描述 | 旅行日记 |
| 生成模板 | 单表（增删改查） |
| 前端类型 | Vue3 |

字段配置：
- `accent_color`：显示类型「input」
- `content`：显示类型「textarea」
- `photos`：显示类型「textarea」（存 JSON 字符串）
- `trip_date`：显示类型「date」
- `status`：显示类型「radio」

- [ ] **Step 3: 下载并复制生成代码**

同 Task 4 Step 4-5，将生成的 Java 文件复制到 `yudao-module-ip/src/main/java/`，XML 复制到 `resources/mapper/ip/`。

---

### Task 8: 精简 Travel Diary 代码 + 添加 AppTravelDiaryController

**Files:**
- Modify: `controller/admin/travelDiary/TravelDiaryController.java`
- Create: `controller/app/travelDiary/AppTravelDiaryController.java`
- Create: `controller/app/travelDiary/vo/AppTravelDiaryRespVO.java`
- Modify: `service/travelDiary/TravelDiaryService.java`
- Modify: `service/travelDiary/TravelDiaryServiceImpl.java`

- [ ] **Step 1: 删除 TravelDiaryController 中的 export-excel 方法**

同 Task 5 Step 1，删除导出 Excel 的方法。

- [ ] **Step 2: 在 TravelDiaryService 接口中添加公开查询方法**

```java
/** 获得已发布的旅行日记列表，按 sort_order 升序 */
List<TravelDiaryDO> getPublishedTravelDiaryList();

/** 根据 id 获得已发布的旅行日记 */
TravelDiaryDO getPublishedTravelDiary(Long id);
```

- [ ] **Step 3: 在 TravelDiaryServiceImpl 中实现**

```java
@Override
public List<TravelDiaryDO> getPublishedTravelDiaryList() {
    return travelDiaryMapper.selectList(
        new LambdaQueryWrapperX<TravelDiaryDO>()
            .eq(TravelDiaryDO::getStatus, 1)
            .eq(TravelDiaryDO::getDeleted, false)
            .orderByAsc(TravelDiaryDO::getSortOrder)
    );
}

@Override
public TravelDiaryDO getPublishedTravelDiary(Long id) {
    return travelDiaryMapper.selectOne(
        new LambdaQueryWrapperX<TravelDiaryDO>()
            .eq(TravelDiaryDO::getId, id)
            .eq(TravelDiaryDO::getStatus, 1)
            .eq(TravelDiaryDO::getDeleted, false)
    );
}
```

- [ ] **Step 4: 创建 AppTravelDiaryRespVO.java**

```java
package cn.iocoder.yudao.module.ip.controller.app.travelDiary.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "用户 App - 旅行日记 Response VO")
@Data
public class AppTravelDiaryRespVO {

    @Schema(description = "主键")
    private Long id;

    @Schema(description = "章节标题")
    private String title;

    @Schema(description = "目的地")
    private String destination;

    @Schema(description = "旅行日期")
    private LocalDate tripDate;

    @Schema(description = "封面图 URL")
    private String coverUrl;

    @Schema(description = "章节主题色，如 #FF6B35")
    private String accentColor;

    @Schema(description = "Markdown 正文")
    private String content;

    @Schema(description = "图片 URL 数组（JSON 字符串）")
    private String photos;

    @Schema(description = "排序")
    private Integer sortOrder;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
```

- [ ] **Step 5: 创建 AppTravelDiaryController.java**

```java
package cn.iocoder.yudao.module.ip.controller.app.travelDiary;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.app.travelDiary.vo.AppTravelDiaryRespVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travelDiary.TravelDiaryDO;
import cn.iocoder.yudao.module.ip.service.travelDiary.TravelDiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 旅行日记")
@RestController
@RequestMapping("/ip/travel-diary")
@Validated
public class AppTravelDiaryController {

    @Resource
    private TravelDiaryService travelDiaryService;

    @GetMapping("/list")
    @Operation(summary = "获得旅行日记列表（已发布，按 sort_order 升序）")
    public CommonResult<List<AppTravelDiaryRespVO>> getTravelDiaryList() {
        List<TravelDiaryDO> list = travelDiaryService.getPublishedTravelDiaryList();
        return success(BeanUtils.toBean(list, AppTravelDiaryRespVO.class));
    }

    @GetMapping("/get")
    @Operation(summary = "根据 id 获得旅行日记详情")
    @Parameter(name = "id", description = "日记 id", required = true, example = "1")
    public CommonResult<AppTravelDiaryRespVO> getTravelDiary(@RequestParam("id") Long id) {
        TravelDiaryDO diary = travelDiaryService.getPublishedTravelDiary(id);
        if (diary == null) {
            return success(null);
        }
        return success(BeanUtils.toBean(diary, AppTravelDiaryRespVO.class));
    }
}
```

---

### Task 9: 重启后端，Swagger 验证 API

- [ ] **Step 1: 重启 YudaoServerApplication**

在 IDEA 中停止并重新运行 `YudaoServerApplication`（profile=local）。

观察启动日志，确认无报错。关键日志应出现：
```
Mapped "{[/ip/project/list],methods=[GET]}"
Mapped "{[/ip/travel-diary/list],methods=[GET]}"
```

- [ ] **Step 2: 在管理后台新增测试数据**

访问 `http://localhost:1024`，找到「项目展示」菜单，新增一条数据：
- name: `测试项目`
- slug: `test-project`
- description: `这是测试描述`
- status: 发布
- featured: 是

同样在「旅行日记」菜单新增一条数据。

- [ ] **Step 3: Swagger 验证公开 API**

访问 `http://localhost:48080/doc.html`，找到「用户 App - 项目展示」分组：

测试 `GET /app-api/ip/project/list`，应返回：
```json
{
  "code": 0,
  "data": [
    { "id": 1, "name": "测试项目", "slug": "test-project", ... }
  ],
  "msg": "成功"
}
```

测试 `GET /app-api/ip/travel-diary/list`，应返回对应数据。

**如果返回 401**：说明该接口被 Spring Security 拦截，需在 `application-local.yaml` 中确认 `security.mock.enable: true` 或检查框架的 URL 白名单配置（`/app-api/**` 通常不需要 Token）。

---

## Phase 4 — 前端项目初始化

---

### Task 10: 复制模板并安装依赖

**Files:**
- 复制 `D:\UserData\idea\portfolio-website-design\` → `D:\UserData\idea\personal-ip\personal-ip-frontend\`
- Create: `personal-ip-frontend/.env.local`

- [ ] **Step 1: 复制模板目录**

在文件管理器或终端中：
```powershell
# 在 PowerShell 中执行
Copy-Item -Recurse "D:\UserData\idea\portfolio-website-design\*" `
          "D:\UserData\idea\personal-ip\personal-ip-frontend\"
```

注意：不复制 `.next/` 和 `node_modules/`（太大且不需要），只复制源码：
```powershell
$src = "D:\UserData\idea\portfolio-website-design"
$dst = "D:\UserData\idea\personal-ip\personal-ip-frontend"

Get-ChildItem $src -Exclude ".next","node_modules" | Copy-Item -Destination $dst -Recurse
```

- [ ] **Step 2: 创建 .env.local**

新建 `personal-ip-frontend/.env.local`：

```env
NEXT_PUBLIC_API_BASE=http://localhost:48080
```

- [ ] **Step 3: 安装依赖**

```powershell
cd D:\UserData\idea\personal-ip\personal-ip-frontend
pnpm install
```

- [ ] **Step 4: 确认启动**

```powershell
pnpm dev
```

浏览器访问 `http://localhost:3000`，应看到 portfolio-website-design 的原始首页正常显示（音效、小树背景、右下角小人均正常）。

---

### Task 11: 创建 API 请求层

**Files:**
- Create: `personal-ip-frontend/lib/api/client.ts`
- Create: `personal-ip-frontend/lib/api/projects.ts`
- Create: `personal-ip-frontend/lib/api/travel.ts`

- [ ] **Step 1: 创建 client.ts（统一 fetch 封装）**

```typescript
// lib/api/client.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:48080'

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/app-api${path}`, {
    next: { revalidate: 3600 }, // SSG 缓存 1 小时
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  const json = await res.json()
  if (json.code !== 0) throw new Error(`Business error ${json.code}: ${json.msg}`)
  return json.data as T
}
```

- [ ] **Step 2: 创建 projects.ts**

```typescript
// lib/api/projects.ts
import { apiFetch } from './client'

export interface Project {
  id: number
  name: string
  slug: string
  description: string | null
  coverUrl: string | null
  previewUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  techStack: string | null   // "Next.js,Java,Three.js"
  content: string | null
  featured: boolean
  createTime: string
}

export function getProjectList(): Promise<Project[]> {
  return apiFetch<Project[]>('/ip/project/list')
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return apiFetch<Project | null>(`/ip/project/get?slug=${encodeURIComponent(slug)}`)
}
```

- [ ] **Step 3: 创建 travel.ts**

```typescript
// lib/api/travel.ts
import { apiFetch } from './client'

export interface TravelDiary {
  id: number
  title: string
  destination: string | null
  tripDate: string | null     // "2024-03-15"
  coverUrl: string | null
  accentColor: string         // "#FF6B35"
  content: string | null
  photos: string | null       // JSON 字符串，如 '["url1","url2"]'
  sortOrder: number
  createTime: string
}

export function getTravelDiaryList(): Promise<TravelDiary[]> {
  return apiFetch<TravelDiary[]>('/ip/travel-diary/list')
}

export function getTravelDiaryById(id: number): Promise<TravelDiary | null> {
  return apiFetch<TravelDiary | null>(`/ip/travel-diary/get?id=${id}`)
}

/** 将 photos 字段从 JSON 字符串解析为数组 */
export function parsePhotos(photos: string | null): string[] {
  if (!photos) return []
  try { return JSON.parse(photos) } catch { return [] }
}
```

---

## Phase 5 — Projects 前端页面

---

### Task 12: Projects 列表页

**Files:**
- Create: `personal-ip-frontend/components/projects/ProjectCard.tsx`
- Create: `personal-ip-frontend/app/projects/page.tsx`

- [ ] **Step 1: 创建 ProjectCard.tsx**

```tsx
// components/projects/ProjectCard.tsx
'use client'

import { useRef, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/lib/api/projects'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const springX = useSpring(0, { stiffness: 200, damping: 20 })
  const springY = useSpring(0, { stiffness: 200, damping: 20 })

  const techList = project.techStack ? project.techStack.split(',') : []

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      ref={ref}
      className="relative border-b border-white/10 py-6 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-[#AFFF00] transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-gray-400 mt-1 text-sm">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {techList.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded border border-white/20 text-gray-300 font-mono"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
          <span className="text-gray-500 group-hover:text-white transition-colors ml-4">→</span>
        </div>
      </Link>

      {/* 悬浮预览图，跟随鼠标 */}
      {project.previewUrl && isHovered && (
        <motion.div
          className="fixed pointer-events-none z-50 w-64 h-40 rounded-lg overflow-hidden shadow-2xl"
          style={{ left: mousePos.x + 20, top: mousePos.y - 80 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <img
            src={project.previewUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 创建 app/projects/page.tsx**

```tsx
// app/projects/page.tsx
import { getProjectList } from '@/lib/api/projects'
import { ProjectCard } from '@/components/projects/ProjectCard'

export const revalidate = 3600  // SSG，每小时重新生成

export default async function ProjectsPage() {
  let projects = []
  try {
    projects = await getProjectList()
  } catch (e) {
    // 后端未启动时不崩溃
    console.error('Failed to fetch projects:', e)
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2 font-['Barlow_Condensed']">
          PROJECTS
        </h1>
        <p className="text-gray-400 mb-12">Things I've built.</p>

        {projects.length === 0 ? (
          <p className="text-gray-500">暂无项目，请先在管理后台添加。</p>
        ) : (
          <div>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
```

---

### Task 13: Projects 详情页

**Files:**
- Create: `personal-ip-frontend/app/projects/[slug]/page.tsx`

- [ ] **Step 1: 创建详情页**

```tsx
// app/projects/[slug]/page.tsx
import { getProjectBySlug, getProjectList } from '@/lib/api/projects'
import { notFound } from 'next/navigation'

// 构建时预生成所有已发布项目的详情页
export async function generateStaticParams() {
  try {
    const projects = await getProjectList()
    return projects.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export default async function ProjectDetailPage({ params }: Props) {
  let project = null
  try {
    project = await getProjectBySlug(params.slug)
  } catch (e) {
    console.error(e)
  }

  if (!project) notFound()

  const techList = project.techStack ? project.techStack.split(',') : []

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* 封面图 */}
        {project.coverUrl && (
          <div className="w-full h-64 rounded-xl overflow-hidden mb-8">
            <img src={project.coverUrl} alt={project.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 标题 */}
        <h1 className="text-5xl font-bold text-white mb-4 font-['Barlow_Condensed']">
          {project.name}
        </h1>

        {/* 描述 */}
        {project.description && (
          <p className="text-gray-300 text-lg mb-6">{project.description}</p>
        )}

        {/* 技术栈徽章 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {techList.map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1 rounded-full bg-white/10 text-[#AFFF00] font-mono border border-[#AFFF00]/30"
            >
              {tech.trim()}
            </span>
          ))}
        </div>

        {/* 外链 */}
        <div className="flex gap-4 mb-10">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 rounded border border-white/20 text-white hover:border-[#AFFF00] transition-colors text-sm">
              GitHub →
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 rounded bg-[#AFFF00] text-black font-bold text-sm hover:bg-white transition-colors">
              Live Demo →
            </a>
          )}
        </div>

        {/* Markdown 正文（简单渲染，后续可换 react-markdown） */}
        {project.content && (
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
              {project.content}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}
```

> **后续优化**：安装 `react-markdown` + `remark-gfm` 替换 `<pre>` 渲染 Markdown，此处先用 pre 跑通流程。

---

## Phase 6 — Travel Diary 前端页面

---

### Task 14: Travel Diary 页面

**Files:**
- Create: `personal-ip-frontend/components/travel/PhotoStrip.tsx`
- Create: `personal-ip-frontend/components/travel/DiaryChapter.tsx`
- Create: `personal-ip-frontend/app/travel/page.tsx`

- [ ] **Step 1: 创建 PhotoStrip.tsx（胶卷横向图片组）**

```tsx
// components/travel/PhotoStrip.tsx
'use client'

import { motion } from 'framer-motion'

interface Props {
  photos: string[]
  accentColor: string
}

export function PhotoStrip({ photos, accentColor }: Props) {
  if (photos.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-3 mt-6 scrollbar-hide">
      {photos.map((url, i) => (
        <motion.div
          key={url + i}
          className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden cursor-zoom-in"
          whileHover={{ scale: 1.05, zIndex: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ boxShadow: `0 0 0 1px ${accentColor}33` }}
        >
          <img src={url} alt="" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: 创建 DiaryChapter.tsx（单章节）**

```tsx
// components/travel/DiaryChapter.tsx
'use client'

import { motion } from 'framer-motion'
import { PhotoStrip } from './PhotoStrip'
import { parsePhotos, type TravelDiary } from '@/lib/api/travel'

interface Props {
  diary: TravelDiary
  index: number
}

export function DiaryChapter({ diary, index }: Props) {
  const photos = parsePhotos(diary.photos)

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="mb-24 scroll-mt-24"
      id={`chapter-${diary.id}`}
    >
      {/* 彩色章节线 */}
      <div
        className="w-12 h-1 mb-6 rounded-full"
        style={{ backgroundColor: diary.accentColor }}
      />

      {/* 封面 */}
      {diary.coverUrl && (
        <div className="w-full h-72 rounded-2xl overflow-hidden mb-8">
          <img
            src={diary.coverUrl}
            alt={diary.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 标题 & 元信息 */}
      <div className="mb-6">
        <h2
          className="text-4xl font-bold mb-2"
          style={{ color: diary.accentColor, fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {diary.title}
        </h2>
        <div className="flex gap-4 text-sm text-gray-400 font-mono">
          {diary.destination && <span>📍 {diary.destination}</span>}
          {diary.tripDate && <span>📅 {diary.tripDate}</span>}
        </div>
      </div>

      {/* 正文 */}
      {diary.content && (
        <div
          className="text-gray-300 leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
        >
          {diary.content}
        </div>
      )}

      {/* 胶卷相册 */}
      <PhotoStrip photos={photos} accentColor={diary.accentColor} />
    </motion.section>
  )
}
```

- [ ] **Step 3: 创建 app/travel/page.tsx**

```tsx
// app/travel/page.tsx
import { getTravelDiaryList } from '@/lib/api/travel'
import { DiaryChapter } from '@/components/travel/DiaryChapter'

export const revalidate = 3600

export default async function TravelPage() {
  let diaries = []
  try {
    diaries = await getTravelDiaryList()
  } catch (e) {
    console.error('Failed to fetch travel diaries:', e)
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* 页面标题 */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-white mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            TRAVEL
          </h1>
          <p className="text-gray-400"
             style={{ fontFamily: "'Caveat', cursive" }}>
            每一次出发，都是一次重新认识自己。
          </p>
        </div>

        {/* 左侧导航 + 正文两栏（大屏） */}
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">

          {/* 章节导航（桌面端固定侧栏） */}
          {diaries.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-mono">
                  Chapters
                </p>
                <nav className="space-y-2">
                  {diaries.map((diary) => (
                    <a
                      key={diary.id}
                      href={`#chapter-${diary.id}`}
                      className="block text-sm text-gray-400 hover:text-white transition-colors py-1 border-l-2 border-transparent hover:border-white pl-3"
                      style={{ borderColor: 'transparent' }}
                    >
                      {diary.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* 章节内容 */}
          <div>
            {diaries.length === 0 ? (
              <p className="text-gray-500">暂无旅行日记，请在管理后台添加。</p>
            ) : (
              diaries.map((diary, index) => (
                <DiaryChapter key={diary.id} diary={diary} index={index} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
```

---

## Phase 7 — 更新导航栏

---

### Task 15: 更新 Navbar 加入新路由

**Files:**
- Modify: `personal-ip-frontend/components/navigation.tsx`

- [ ] **Step 1: 在 navigation.tsx 中加入 Projects 和 Travel 路由**

打开 `components/navigation.tsx`，找到导航项数组（通常是一个包含 `href` 和 `label` 的对象数组），添加两个新条目：

```tsx
const navItems = [
  { href: '/',         label: 'Home'     },
  { href: '/projects', label: 'Projects' },   // 新增
  { href: '/travel',   label: 'Travel'   },   // 新增
  // 其余现有项保持不动
]
```

- [ ] **Step 2: 验证导航跳转**

浏览器访问 `http://localhost:3000`，点击导航栏：
- 点击 Projects → 跳转到 `/projects`，显示从后端获取的项目列表
- 点击 Travel → 跳转到 `/travel`，显示旅行日记

- [ ] **Step 3: 全流程验收**

完整走一遍：
1. `http://localhost:1024` 管理后台新增项目和旅行日记（status=发布）
2. 刷新 `http://localhost:3000/projects`，新数据出现
3. 点击项目卡片，跳转详情页，内容正确
4. 刷新 `http://localhost:3000/travel`，章节内容出现，主题色正确

**至此 Phase 1-7 全部完成，Projects + Travel Diary 全栈打通。**

---

## 执行顺序速查

```
Task 1  → 创建 Maven 模块
Task 2  → 注册到父 pom + server
Task 3  → ip_project 建表
Task 4  → 代码生成器：Projects
Task 5  → 精简 + AppProjectController
Task 6  → ip_travel_diary 建表
Task 7  → 代码生成器：Travel Diary
Task 8  → 精简 + AppTravelDiaryController
Task 9  → 重启后端，Swagger 验证
Task 10 → 复制前端模板，pnpm install
Task 11 → lib/api 层
Task 12 → Projects 列表页 + ProjectCard
Task 13 → Projects 详情页
Task 14 → Travel Diary 页面
Task 15 → 更新 Navbar + 全流程验收
```
