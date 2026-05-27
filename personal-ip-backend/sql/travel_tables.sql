-- =====================================================
-- Travel 模块建表 SQL（在 ruoyi-vue-pro 数据库中执行）
-- 三张表：ip_travel_trip / ip_travel_chapter / ip_travel_photo
-- =====================================================

-- -------------------------------------------------------
-- 旅行行程表
-- -------------------------------------------------------
DROP TABLE IF EXISTS `ip_travel_trip`;
CREATE TABLE `ip_travel_trip` (
  `id`           bigint        NOT NULL AUTO_INCREMENT COMMENT '主键',
  `year`         int           NOT NULL                COMMENT '年份，如 2026',
  `title`        varchar(100)  NOT NULL                COMMENT '主标题，如 BALI',
  `title_year`   varchar(32)   NOT NULL                COMMENT '年份标题，如 2026',
  `subtitle`     varchar(200)  DEFAULT NULL            COMMENT '副标题',
  `chinese`      varchar(200)  DEFAULT NULL            COMMENT '中文标题',
  `tagline`      varchar(500)  DEFAULT NULL            COMMENT '标语/诗句',
  `film_label`   varchar(500)  DEFAULT NULL            COMMENT '胶片标签说明',
  `film_header`  varchar(300)  DEFAULT NULL            COMMENT '右侧页眉',
  `dev_credit`   varchar(200)  DEFAULT NULL            COMMENT '显影信息',
  `side_text`    varchar(300)  DEFAULT NULL            COMMENT '侧面旋转文字',
  `cover_img`    varchar(500)  DEFAULT NULL            COMMENT '封面图 URL',
  `accent_color` varchar(32)   DEFAULT NULL            COMMENT '强调色，如 #e04030',
  `sort_order`   int           DEFAULT 0               COMMENT '排序权重',
  `status`       tinyint       DEFAULT 0               COMMENT '状态 0草稿 1发布',
  `creator`      varchar(64)   DEFAULT ''              COMMENT '创建者',
  `create_time`  datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`      varchar(64)   DEFAULT ''              COMMENT '更新者',
  `update_time`  datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      tinyint       NOT NULL DEFAULT 0      COMMENT '是否删除 0否 1是',
  `tenant_id`    bigint        NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_year` (`year`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='旅行行程表';

-- -------------------------------------------------------
-- 旅行章节表
-- -------------------------------------------------------
DROP TABLE IF EXISTS `ip_travel_chapter`;
CREATE TABLE `ip_travel_chapter` (
  `id`            bigint        NOT NULL AUTO_INCREMENT COMMENT '主键',
  `trip_id`       bigint        NOT NULL                COMMENT '所属行程 ID',
  `num`           varchar(8)    NOT NULL                COMMENT '章节序号，如 01',
  `name`          varchar(100)  NOT NULL                COMMENT '章节名称，如 BROMO',
  `chinese`       varchar(100)  DEFAULT NULL            COMMENT '中文名称',
  `date_label`    varchar(16)   DEFAULT NULL            COMMENT '日期标签，如 04.26',
  `region`        varchar(100)  DEFAULT NULL            COMMENT '地区',
  `country`       varchar(100)  DEFAULT NULL            COMMENT '国家',
  `area`          varchar(100)  DEFAULT NULL            COMMENT '区域',
  `coords`        varchar(50)   DEFAULT NULL            COMMENT '坐标',
  `location_cn`   varchar(100)  DEFAULT NULL            COMMENT '地点中文',
  `time`          varchar(16)   DEFAULT NULL            COMMENT '时间，如 04:29',
  `tags`          varchar(500)  DEFAULT NULL            COMMENT '标签',
  `quote`         text          DEFAULT NULL            COMMENT '引用/诗句',
  `caption`       varchar(500)  DEFAULT NULL            COMMENT '照片说明',
  `spots`         varchar(1000) DEFAULT NULL            COMMENT '拍摄点（JSON 数组）',
  `cover_img`     varchar(500)  DEFAULT NULL            COMMENT '封面图',
  `cover_grad`    varchar(300)  DEFAULT NULL            COMMENT '封面渐变',
  `tint_color`    varchar(50)   DEFAULT NULL            COMMENT '色调',
  `bg`            varchar(32)   DEFAULT NULL            COMMENT '背景色',
  `text_color`    varchar(32)   DEFAULT NULL            COMMENT '文字颜色',
  `accent`        varchar(32)   DEFAULT NULL            COMMENT '章节强调色',
  `page_num`      varchar(8)    DEFAULT NULL            COMMENT '页码',
  `total_exp`     varchar(8)    DEFAULT NULL            COMMENT '总曝光数',
  `contact_sheet` varchar(8)    DEFAULT NULL            COMMENT '联系表编号',
  `sort_order`    int           DEFAULT 0               COMMENT '排序权重',
  `creator`       varchar(64)   DEFAULT ''              COMMENT '创建者',
  `create_time`   datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`       varchar(64)   DEFAULT ''              COMMENT '更新者',
  `update_time`   datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`       tinyint       NOT NULL DEFAULT 0      COMMENT '是否删除 0否 1是',
  `tenant_id`     bigint        NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_trip_id` (`trip_id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='旅行章节表';

-- -------------------------------------------------------
-- 章节照片表
-- -------------------------------------------------------
DROP TABLE IF EXISTS `ip_travel_photo`;
CREATE TABLE `ip_travel_photo` (
  `id`          bigint        NOT NULL AUTO_INCREMENT COMMENT '主键',
  `chapter_id`  bigint        NOT NULL                COMMENT '所属章节 ID',
  `url`         varchar(500)  NOT NULL                COMMENT '照片 URL',
  `sort_order`  int           DEFAULT 0               COMMENT '排序权重',
  `creator`     varchar(64)   DEFAULT ''              COMMENT '创建者',
  `create_time` datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`     varchar(64)   DEFAULT ''              COMMENT '更新者',
  `update_time` datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`     tinyint       NOT NULL DEFAULT 0      COMMENT '是否删除 0否 1是',
  `tenant_id`   bigint        NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_chapter_id` (`chapter_id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='旅行章节照片表';
