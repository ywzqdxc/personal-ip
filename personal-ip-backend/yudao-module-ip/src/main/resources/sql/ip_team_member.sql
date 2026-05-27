-- 在 ruoyi-vue-pro 数据库中执行
CREATE TABLE IF NOT EXISTS `ip_team_member` (
  `id`           bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name`         varchar(100) NOT NULL                COMMENT '姓名',
  `role`         varchar(100)     DEFAULT NULL        COMMENT '职位/身份',
  `avatar_url`   varchar(500)     DEFAULT NULL        COMMENT '头像 URL',
  `bio`          varchar(500)     DEFAULT NULL        COMMENT '简介',
  `github_url`   varchar(300)     DEFAULT NULL        COMMENT 'GitHub 主页',
  `linkedin_url` varchar(300)     DEFAULT NULL        COMMENT 'LinkedIn 主页',
  `sort_order`   int          NOT NULL DEFAULT 0      COMMENT '排序',
  `status`       tinyint      NOT NULL DEFAULT 1      COMMENT '状态 0隐藏 1显示',
  `creator`      varchar(64)      DEFAULT ''          COMMENT '创建者',
  `create_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`      varchar(64)      DEFAULT ''          COMMENT '更新者',
  `update_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否删除',
  `tenant_id`    bigint       NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='团队成员';


SELECT id FROM system_menu WHERE id BETWEEN 5000 AND 5050;