-- =====================================================
-- IP 模块菜单 SQL（在 ruoyi-vue-pro 数据库中执行）
-- 执行前请确认 system_menu 表中不存在 id=5000~5099 的记录
-- =====================================================

-- -------------------------------------------------------
-- 一级目录：IP 管理  (type=1, parent_id=0)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5000, 'IP管理', '', 1, 50, 0, '/ip', 'ep:star', NULL, NULL, 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);

-- -------------------------------------------------------
-- 二级菜单：项目展示  (type=2, parent_id=5000)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5001, '项目展示', '', 2, 1, 5000, 'project', 'ep:briefcase', 'ip/project/index', 'IpProject', 0, 1, 1, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- 项目展示 - 按钮权限  (type=3, parent_id=5001)
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES
(5002, '项目查询', 'ip:project:query',  3, 1, 5001, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5003, '项目新增', 'ip:project:create', 3, 2, 5001, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5004, '项目修改', 'ip:project:update', 3, 3, 5001, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5005, '项目删除', 'ip:project:delete', 3, 4, 5001, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- -------------------------------------------------------
-- 二级菜单：旅行日记  (type=2, parent_id=5000)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5010, '旅行日记', '', 2, 2, 5000, 'travel-diary', 'ep:map-location', 'ip/travelDiary/index', 'IpTravelDiary', 0, 1, 1, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- 旅行日记 - 按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES
(5011, '旅行日记查询', 'ip:travel-diary:query',  3, 1, 5010, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5012, '旅行日记新增', 'ip:travel-diary:create', 3, 2, 5010, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5013, '旅行日记修改', 'ip:travel-diary:update', 3, 3, 5010, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5014, '旅行日记删除', 'ip:travel-diary:delete', 3, 4, 5010, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- -------------------------------------------------------
-- 二级菜单：随想记录  (type=2, parent_id=5000)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5020, '随想记录', '', 2, 3, 5000, 'thought', 'ep:chat-dot-round', 'ip/thought/index', 'IpThought', 0, 1, 1, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- 随想记录 - 按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES
(5021, '随想查询', 'ip:thought:query',  3, 1, 5020, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5022, '随想新增', 'ip:thought:create', 3, 2, 5020, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5023, '随想修改', 'ip:thought:update', 3, 3, 5020, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5024, '随想删除', 'ip:thought:delete', 3, 4, 5020, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- -------------------------------------------------------
-- 二级菜单：博客文章  (type=2, parent_id=5000)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5030, '博客文章', '', 2, 4, 5000, 'article', 'ep:document', 'ip/article/index', 'IpArticle', 0, 1, 1, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- 博客文章 - 按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES
(5031, '文章查询', 'ip:article:query',  3, 1, 5030, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5032, '文章新增', 'ip:article:create', 3, 2, 5030, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5033, '文章修改', 'ip:article:update', 3, 3, 5030, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5034, '文章删除', 'ip:article:delete', 3, 4, 5030, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- -------------------------------------------------------
-- 二级菜单：团队成员  (type=2, parent_id=5000)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5040, '团队成员', '', 2, 5, 5000, 'team', 'ep:user', 'ip/team/index', 'IpTeamMember', 0, 1, 1, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- 团队成员 - 按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES
(5041, '团队成员查询', 'ip:team-member:query',  3, 1, 5040, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5042, '团队成员新增', 'ip:team-member:create', 3, 2, 5040, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5043, '团队成员修改', 'ip:team-member:update', 3, 3, 5040, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5044, '团队成员删除', 'ip:team-member:delete', 3, 4, 5040, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- -------------------------------------------------------
-- 二级菜单：旅行行程  (type=2, parent_id=5000)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5050, '旅行行程', '', 2, 6, 5000, 'travel-trip', 'ep:map-location', 'ip/travel/trip/index', 'IpTravelTrip', 0, 1, 1, 0, 'admin', NOW(), 'admin', NOW(), 0);

INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES
(5051, '旅行行程查询', 'ip:travel-trip:query',  3, 1, 5050, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5052, '旅行行程新增', 'ip:travel-trip:create', 3, 2, 5050, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5053, '旅行行程修改', 'ip:travel-trip:update', 3, 3, 5050, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5054, '旅行行程删除', 'ip:travel-trip:delete', 3, 4, 5050, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0);

-- -------------------------------------------------------
-- 二级菜单：旅行章节  (type=2, parent_id=5000)
-- -------------------------------------------------------
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES (5060, '旅行章节', '', 2, 7, 5000, 'travel-chapter', 'ep:notebook', 'ip/travel/chapter/index', 'IpTravelChapter', 0, 1, 1, 0, 'admin', NOW(), 'admin', NOW(), 0);

INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`)
VALUES
(5061, '旅行章节查询', 'ip:travel-chapter:query',  3, 1, 5060, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5062, '旅行章节新增', 'ip:travel-chapter:create', 3, 2, 5060, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5063, '旅行章节修改', 'ip:travel-chapter:update', 3, 3, 5060, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0),
(5064, '旅行章节删除', 'ip:travel-chapter:delete', 3, 4, 5060, '', '', '', '', 0, 1, 0, 0, 'admin', NOW(), 'admin', NOW(), 0);
