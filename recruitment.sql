/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80042
 Source Host           : localhost:3306
 Source Schema         : recruitment

 Target Server Type    : MySQL
 Target Server Version : 80042
 File Encoding         : 65001

 Date: 04/07/2025 16:16:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for company_info
-- ----------------------------
DROP TABLE IF EXISTS `company_info`;
CREATE TABLE `company_info`  (
  `company_id` int NOT NULL AUTO_INCREMENT COMMENT '企业唯一标识ID（主键，自增）',
  `company_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `logo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `introduction` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `industry` enum('互联网','制造','金融','教育','医疗','其他') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`company_id`) USING BTREE,
  UNIQUE INDEX `company_name`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_2`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_3`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_4`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_5`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_6`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_7`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_8`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_9`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_10`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_11`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_12`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_13`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_14`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_15`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_16`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_17`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_18`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_19`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_20`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_21`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_22`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_23`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_24`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_25`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_26`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_27`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_28`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_29`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_30`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_31`(`company_name` ASC) USING BTREE,
  UNIQUE INDEX `company_name_32`(`company_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '企业核心信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of company_info
-- ----------------------------
INSERT INTO `company_info` VALUES (4, '网易科技', '/uploads/avatars/file-1749829051510-365356374.png', '15911111110', '广东广州', '网易公司（NASDAQ: NTES）1997年6月由丁磊创立于广州，是中国领先的互联网科技企业，业务涵盖游戏、邮箱、音乐（网易云音乐）、教育（有道）、电商（严选、考拉） 等领域，覆盖超10亿用户。2000年于纳斯达克上市，2020年登陆港交所，2024年位列《财富》中国民企500强第204位。公司以“网聚人的力量，以科技创新缔造美好生活”为使命，拥有超万件专利，持续推动数字内容与技术创新。\r\n\r\n补充说明（若用户需延伸了解）：\r\n核心产品  \r\n\r\n游戏：《梦幻西游》《阴阳师》《永劫无间》等自研及代理大作，全球领先的游戏开发商；  \r\n\r\n邮箱：中文第一大邮箱品牌，用户超10亿；  \r\n\r\n教育：网易公开课、有道智能学习平台，推动教育普惠。\r\n技术与社会责任  \r\n\r\n专利超万件，聚焦AI、区块链、音视频技术；  \r\n\r\n推出“一块屏”教育项目，助力偏远地区教育公平；  \r\n\r\n2024年增设“未成年人模式”，强化网络保护。', '互联网', '2025-06-12 17:09:56', '2025-06-14 13:30:22');
INSERT INTO `company_info` VALUES (6, '腾讯科技', '/uploads/avatars/file-1749973393347-601162840.png', '15977777777', '广东深圳', '腾讯公司（Tencent）成立于1998年11月，总部位于中国深圳，由马化腾、张志东等五人联合创立。作为中国最大的互联网综合服务提供商之一，其核心产品包括QQ和微信（WeChat），覆盖社交、游戏、金融、云计算等领域。2004年在香港联交所上市，2024年位列《财富》世界500强第141名。腾讯以“用户为本，科技向善”为愿景，致力于通过数字技术提升生活品质。', '互联网', '2025-06-13 15:58:38', '2025-07-04 08:13:56');
INSERT INTO `company_info` VALUES (7, '字节跳动', '/uploads/avatars/file-1749882735579-835151439.png', '19500000000', '上海市', '字节跳动（ByteDance）成立于2012年3月，总部位于北京，是一家以人工智能技术为核心的全球科技公司。其愿景是建设“全球创作与交流平台”。公司核心产品包括今日头条、抖音、TikTok、西瓜视频等，通过算法推荐和个性化信息服务开创全新内容消费模式。2015年启动“技术出海”战略后，业务覆盖全球150个国家和地区，支持75种语言。2022年更名为北京抖音信息服务有限公司，聚焦信息平台与电商两大主干业务，同时发展企业服务（飞书、火山引擎）及新兴领域（如游戏、教育）。截至2023年，其产品全球月活跃用户超19亿。', '互联网', '2025-06-14 06:28:18', '2025-06-14 06:32:18');
INSERT INTO `company_info` VALUES (8, '医健数联', '/uploads/avatars/file-1749883309946-923973048.jpg', '15500000000', '广东深圳', '医健数联科技（深圳）有限公司成立于2023年，总部位于深圳福田，注册资本100万元。公司以医疗信息系统集成、物联网技术为核心，提供计算机软硬件开发、数据分析及医疗器械销售等服务。截至2025年，公司已积累​​31项软件著作权、4项专利​​（含动态血压监测、心电采集等医疗设备技术），并对外投资健康管理企业。其业务覆盖医疗大数据平台建设、远程健康管理及智能诊断解决方案，致力于通过技术优化医疗资源配置。', '医疗', '2025-06-14 06:40:57', '2025-06-14 06:43:33');
INSERT INTO `company_info` VALUES (9, 'Shopee', '/uploads/avatars/file-1749883627637-84339640.png', '15300000000', '广东深圳南山区', 'Shopee（虾皮购物）​​成立于2015年，总部位于新加坡，是东南亚及中国台湾地区领先的​​电商平台​​。母公司​​Sea Group（冬海集团）​​为东南亚首家纽交所上市互联网企业（股票代码：SE），业务涵盖游戏（Garena）、电商（Shopee）及数字金融（SeaMoney）三大板块。Shopee以移动端为核心，主打C2C（个人卖家）与B2C（品牌商家）混合模式，商品覆盖电子消费品、家居、美妆、母婴、服饰等全品类。', '金融', '2025-06-14 06:46:25', '2025-06-14 06:48:36');
INSERT INTO `company_info` VALUES (10, 'aa', '/uploads/avatars/file-1751545757269-869108338.png', '15911111111', 'dfwe', NULL, '其他', '2025-06-15 08:11:19', '2025-07-03 12:29:18');
INSERT INTO `company_info` VALUES (11, 'qq', '/uploads/avatars/file-1751545765398-68829995.png', '18911111111', '11', NULL, '其他', '2025-06-19 02:07:33', '2025-07-03 12:29:27');

-- ----------------------------
-- Table structure for job_position
-- ----------------------------
DROP TABLE IF EXISTS `job_position`;
CREATE TABLE `job_position`  (
  `job_id` int NOT NULL AUTO_INCREMENT COMMENT '岗位唯一标识ID（主键，自增）',
  `company_id` int NOT NULL COMMENT '关联企业ID（外键）',
  `position_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `hire_count` smallint UNSIGNED NULL DEFAULT 1,
  `publish_time` datetime NULL DEFAULT NULL,
  `other_requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` enum('招聘中','已结束') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '招聘中',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `min_salary` int NOT NULL,
  `max_salary` int NOT NULL,
  `review_status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending' COMMENT '职位审核状态：pending待审核，approved已通过，rejected已驳回',
  `reject_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '岗位审核驳回原因',
  PRIMARY KEY (`job_id`) USING BTREE,
  INDEX `company_id`(`company_id` ASC) USING BTREE,
  CONSTRAINT `job_position_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company_info` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '企业发布的招聘岗位信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_position
-- ----------------------------
INSERT INTO `job_position` VALUES (3, 4, '嵌入式开发', '嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，', 7, '2025-06-13 05:38:49', NULL, '招聘中', '江西南昌', '451744嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，嵌入式开发，', 16, 18, 'approved', NULL);
INSERT INTO `job_position` VALUES (4, 4, '安卓开发工程师', '安卓开发工程师安卓开发工程师安卓开发工程师安卓开发工程师安卓开发工程师安卓开发工程师', 5, '2025-06-13 07:21:06', NULL, '已结束', '江西抚州', '安卓开发工程师安卓开发工程师', 6, 8, 'approved', NULL);
INSERT INTO `job_position` VALUES (5, 6, '全栈开发工程师', '全栈开发工程师全栈开发工程师全栈开发工程师全栈开发工程师', 5, '2025-06-13 16:01:42', NULL, '招聘中', '广东深圳', '全栈开发工程师全栈开发工程师全栈开发工程师', 20, 30, 'rejected', '不合理');
INSERT INTO `job_position` VALUES (6, 6, '前端开发工程师', '前端开发工程师前端开发工程师前端开发工程师', 4, '2025-06-13 16:04:43', NULL, '招聘中', '广东广州', '前端开发工程师前端开发工程师', 12, 14, 'approved', NULL);
INSERT INTO `job_position` VALUES (7, 6, '安卓开发工程师', '安卓开发工程师安卓开发工程师', 4, '2025-06-13 16:05:17', NULL, '招聘中', '江西南昌', '安卓开发工程师安卓开发工程师安卓开发工程师', 14, 16, 'approved', NULL);
INSERT INTO `job_position` VALUES (8, 7, '客户端开发实习生', '客户端开发实习生客户端开发实习生客户端开发实习生客户端开发实习生', 6, '2025-06-14 06:34:19', NULL, '招聘中', '湖北武汉', '客户端开发实习生客户端开发实习生客户端开发实习生', 6, 8, 'approved', NULL);
INSERT INTO `job_position` VALUES (9, 7, 'web前端开发', 'web前端开发web前端开发web前端开发web前端开发', 5, '2025-06-14 06:35:24', NULL, '招聘中', '北京市海定区', 'web前端开发web前端开发web前端开发web前端开发web前端开发web前端开发', 12, 14, 'pending', NULL);
INSERT INTO `job_position` VALUES (10, 8, '前端开发工程师', '前端开发工程师前端开发工程师前端开发工程师前端开发工程师', 5, '2025-06-14 06:45:00', NULL, '招聘中', '广东深圳福田区', '前端开发工程师前端开发工程师', 7, 8, 'approved', NULL);
INSERT INTO `job_position` VALUES (11, 9, '后端开发工程师', '后端开发工程师后端开发工程师后端开发工程师后端开发工程师', 3, '2025-06-14 06:49:28', NULL, '招聘中', '广东深圳南山区', '后端开发工程师后端开发工程师后端开发工程师', 16, 20, 'approved', NULL);
INSERT INTO `job_position` VALUES (12, 6, 'C++开发工程师', 'C++开发工程师C++开发工程师C++开发工程师C++开发工程师', 1, '2025-06-14 06:51:13', NULL, '招聘中', '广东深圳', 'C++开发工程师C++开发工程师C++开发工程师', 20, 34, 'approved', NULL);
INSERT INTO `job_position` VALUES (13, 6, 'Java开发工程师', 'Java开发工程师Java开发工程师Java开发工程师Java开发工程师', 4, '2025-06-14 06:51:51', NULL, '招聘中', '广东广州', 'Java开发工程师Java开发工程师Java开发工程师', 16, 18, 'approved', NULL);
INSERT INTO `job_position` VALUES (14, 6, '物联网小程序开发工程师', '物联网小程序开发工程师物联网小程序开发工程师', 4, '2025-06-14 06:53:17', NULL, '招聘中', '江西南昌', '物联网小程序开发工程师物联网小程序开发工程师物联网小程序开发工程师', 12, 20, 'approved', NULL);
INSERT INTO `job_position` VALUES (15, 6, '微信小程序开发工程师', '微信小程序开发工程师微信小程序开发工程师', 7, '2025-06-14 06:53:57', NULL, '已结束', '江西赣州', '微信小程序开发工程师微信小程序开发工程师微信小程序开发工程师', 9, 10, 'pending', NULL);
INSERT INTO `job_position` VALUES (16, 6, '测试岗位1', '111', 2, '2025-07-04 07:10:18', NULL, '招聘中', '江苏杭州', '111', 10, 12, 'pending', NULL);

-- ----------------------------
-- Table structure for job_seeker
-- ----------------------------
DROP TABLE IF EXISTS `job_seeker`;
CREATE TABLE `job_seeker`  (
  `seeker_id` int NOT NULL AUTO_INCREMENT COMMENT '求职者唯一标识ID（主键，自增）',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `gender` enum('男','女','其他') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `birth_date` date NOT NULL,
  `age` int NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `hometown` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `highest_degree` enum('高中','专科','本科','硕士','博士') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `major` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `degree` enum('学士','硕士','博士','其他') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `school` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `skills` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`seeker_id`) USING BTREE,
  UNIQUE INDEX `idx_phone`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_2`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_3`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_4`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_5`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_6`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_7`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_8`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_9`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_10`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_11`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_12`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_13`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_14`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_15`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_16`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_17`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_18`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_19`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_20`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_21`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_22`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_23`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_24`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_25`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_26`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_27`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_28`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_29`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_30`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_31`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `phone_32`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '求职者个人信息与教育背景表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_seeker
-- ----------------------------
INSERT INTO `job_seeker` VALUES (1, '小明', NULL, '男', '2004-06-16', 20, '15911211111', '江西赣州', '本科', '软件工程', '学士', '东华理工大学', 'Java、vue', '2025-06-12 13:38:59');
INSERT INTO `job_seeker` VALUES (2, '快乐的小乐', '/uploads/avatars/file-1751509568533-100152685.jpg', '女', '2004-08-07', 20, '15911111112', '江西南昌', '硕士', '网络工程', '学士', '东华理工大学', '计算机网络、数据结构', '2025-06-12 18:27:01');
INSERT INTO `job_seeker` VALUES (5, 'aaa', NULL, '男', '2025-06-16', NULL, '15611111111', NULL, '专科', NULL, NULL, NULL, NULL, '2025-06-15 08:10:22');
INSERT INTO `job_seeker` VALUES (6, 'bbb', '/uploads/avatars/file-1751545803437-476686205.jpg', '男', '2025-06-01', NULL, '15811111111', '', '本科', '', NULL, '', '', '2025-06-15 08:10:51');
INSERT INTO `job_seeker` VALUES (7, 'ww', '/uploads/avatars/file-1751545820295-170681268.jpg', '男', '2025-06-09', NULL, '18911111111', '', '高中', '', NULL, '', '', '2025-06-19 02:07:58');
INSERT INTO `job_seeker` VALUES (12, '社区卫生·', '/uploads/avatars/file-1751545828612-308455720.jpg', '女', '2025-06-08', NULL, '15922222222', '111', '本科', '', NULL, '', '', '2025-06-19 02:11:30');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL COMMENT '发送者用户ID',
  `receiver_id` int NOT NULL COMMENT '接收者用户ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sent_at` datetime NOT NULL,
  `is_read` tinyint NOT NULL DEFAULT 0 COMMENT '0未读，1已读',
  PRIMARY KEY (`message_id`) USING BTREE,
  INDEX `sender_id`(`sender_id` ASC) USING BTREE,
  INDEX `receiver_id`(`receiver_id` ASC) USING BTREE,
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user_auth` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user_auth` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '聊天消息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (1, 6, 7, '111', '2025-06-13 08:18:21', 1);
INSERT INTO `message` VALUES (2, 7, 6, '222', '2025-06-13 08:21:18', 0);
INSERT INTO `message` VALUES (3, 6, 7, 'nn\n', '2025-06-13 08:21:38', 1);
INSERT INTO `message` VALUES (4, 7, 6, '你好', '2025-06-13 08:21:49', 0);
INSERT INTO `message` VALUES (5, 7, 6, '啊啊', '2025-06-13 10:16:08', 0);
INSERT INTO `message` VALUES (6, 7, 9, '您好', '2025-06-13 16:06:08', 1);
INSERT INTO `message` VALUES (7, 9, 7, '您好', '2025-06-13 16:07:14', 1);
INSERT INTO `message` VALUES (8, 7, 9, 'hi', '2025-06-15 08:06:01', 1);
INSERT INTO `message` VALUES (9, 9, 7, 'hi', '2025-06-15 08:07:06', 1);
INSERT INTO `message` VALUES (10, 7, 9, '哈哈哈哈哈哈哈哈哈', '2025-06-19 00:13:51', 1);
INSERT INTO `message` VALUES (11, 9, 7, '如果个人个人', '2025-06-19 00:19:42', 1);
INSERT INTO `message` VALUES (14, 7, 15, '11', '2025-07-03 08:22:39', 0);
INSERT INTO `message` VALUES (15, 15, 7, '你好', '2025-07-03 15:52:53', 0);
INSERT INTO `message` VALUES (16, 7, 15, '你好', '2025-07-03 16:51:35', 0);
INSERT INTO `message` VALUES (17, 15, 7, '你好', '2025-07-03 16:51:46', 0);
INSERT INTO `message` VALUES (18, 15, 9, '你好', '2025-07-04 03:20:59', 1);
INSERT INTO `message` VALUES (28, 15, 6, '您的岗位\"安卓开发工程师\"被驳回，理由：无', '2025-07-04 06:36:05', 0);
INSERT INTO `message` VALUES (29, 15, 9, '您的岗位\"全栈开发工程师\"被驳回，理由：不合理', '2025-07-04 06:37:40', 1);
INSERT INTO `message` VALUES (30, 15, 9, '1', '2025-07-04 06:49:12', 1);
INSERT INTO `message` VALUES (31, 15, 9, '1', '2025-07-04 06:52:52', 1);
INSERT INTO `message` VALUES (32, 9, 7, '你好', '2025-07-04 08:14:20', 1);
INSERT INTO `message` VALUES (33, 7, 9, '你好', '2025-07-04 08:14:45', 1);

-- ----------------------------
-- Table structure for resume
-- ----------------------------
DROP TABLE IF EXISTS `resume`;
CREATE TABLE `resume`  (
  `resume_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `seeker_id` int NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `originalname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `upload_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`resume_id`) USING BTREE,
  INDEX `job_id`(`job_id` ASC) USING BTREE,
  INDEX `seeker_id`(`seeker_id` ASC) USING BTREE,
  CONSTRAINT `resume_ibfk_176` FOREIGN KEY (`job_id`) REFERENCES `job_position` (`job_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resume_ibfk_177` FOREIGN KEY (`seeker_id`) REFERENCES `job_seeker` (`seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resume
-- ----------------------------
INSERT INTO `resume` VALUES (24, 4, 2, '1749888863592-524043139.docx', '简历-1.docx', '2025-06-14 08:14:23');
INSERT INTO `resume` VALUES (25, 12, 2, '1749888915657-188749335.pdf', '简历-2.pdf', '2025-06-14 08:15:15');
INSERT INTO `resume` VALUES (26, 7, 2, '1749888973452-128921818.pdf', '简历-2.pdf', '2025-06-14 08:16:13');
INSERT INTO `resume` VALUES (27, 15, 2, '1749974774665-196188141.pdf', '简历-2.pdf', '2025-06-15 08:06:14');
INSERT INTO `resume` VALUES (28, 14, 2, '1751614949363-799555829.pdf', 'ç®å-2.pdf', '2025-07-04 07:42:29');
INSERT INTO `resume` VALUES (33, 13, 7, '1751616411060-172291839.pdf', 'ç®å-2.pdf', '2025-07-04 08:06:51');
INSERT INTO `resume` VALUES (34, 6, 7, '1751616434784-360430078.pdf', 'ç®å-2.pdf', '2025-07-04 08:07:14');
INSERT INTO `resume` VALUES (35, 13, 2, '1751616762208-880692427.pdf', '简历-2.pdf', '2025-07-04 08:12:42');

-- ----------------------------
-- Table structure for super_admin
-- ----------------------------
DROP TABLE IF EXISTS `super_admin`;
CREATE TABLE `super_admin`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username_36`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_37`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_38`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_2`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_3`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_4`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_5`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_6`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_7`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_8`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_9`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_10`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_11`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_12`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_13`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_14`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_15`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_16`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_17`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_18`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_19`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_20`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_21`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_22`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_23`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_24`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_25`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_26`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_27`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_28`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_29`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_30`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_31`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of super_admin
-- ----------------------------
INSERT INTO `super_admin` VALUES (1, '管理员', '111111');

-- ----------------------------
-- Table structure for user_auth
-- ----------------------------
DROP TABLE IF EXISTS `user_auth`;
CREATE TABLE `user_auth`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('company','seeker','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `related_id` int NOT NULL,
  `last_login` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_2`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_3`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_4`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_5`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_6`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_7`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_8`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_9`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_10`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_11`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_12`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_13`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_14`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_15`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_16`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_17`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_18`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_19`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_20`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_21`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_22`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_23`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_24`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_25`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_26`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_27`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_28`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_29`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_30`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_31`(`username` ASC) USING BTREE,
  UNIQUE INDEX `username_32`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户认证表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_auth
-- ----------------------------
INSERT INTO `user_auth` VALUES (6, '网易', '$2a$10$EOQrVDphdH0ngUVFqveQHe5LdWLHGicDprKZZm9RPRytjoFElFRMm', 'company', 4, '2025-06-19 02:08:59');
INSERT INTO `user_auth` VALUES (7, '快乐的小乐', '$2a$10$2AnowfnPvav7V9B9Cvi2WejyeRVoFL1mfvhj/9p6ZY54u6.x47qRm', 'seeker', 2, '2025-07-04 07:54:08');
INSERT INTO `user_auth` VALUES (9, '腾讯', '$2a$10$JTTQaNKVpyIYyYYG4O3Tn.Q7EfhU0P8YvyBfc64/YMRzSRLfOUHdO', 'company', 6, '2025-07-04 07:07:10');
INSERT INTO `user_auth` VALUES (10, '字节跳动', '$2a$10$a1b.s5lrWLTtILQpal5GyudSPlGlyhoQKH8pPh78jAuQ8ZC/LcdQG', 'company', 7, '2025-06-14 06:28:36');
INSERT INTO `user_auth` VALUES (11, '医健数联', '$2a$10$up5IvRStt9J/8nnC0Bteh.PI1nUY0mU3vURPROdScUs94ea8PfWbK', 'company', 8, '2025-06-14 06:44:03');
INSERT INTO `user_auth` VALUES (12, 'Shopee', '$2a$10$TE0ROtxzjoWcV7lqet3lZ.uUSClClQIsf/zUUhNbtDsRmCuLONhR6', 'company', 9, '2025-06-14 06:46:31');
INSERT INTO `user_auth` VALUES (15, '管理员1', '$2a$10$wra7JbPu1/.DDnTjBqAbNOh/VrTgFQePGdomKk7ybUqrRqVPlxxLi', 'admin', 5, '2025-07-04 08:15:47');
INSERT INTO `user_auth` VALUES (16, 'bbb', '$2a$10$6gOms7Yo0qXUIM6MNcpsx.a/qj1uumbmr8Oz1G8MYJneProD5cYrm', 'seeker', 6, '2025-06-15 08:10:51');
INSERT INTO `user_auth` VALUES (17, 'aa', '$2a$10$2god/iZzx/BRy090uPTl/.PcIr2dYHrAlb4K.6LN9Wn4Vu66IV18y', 'company', 10, '2025-06-15 08:11:19');
INSERT INTO `user_auth` VALUES (18, 'qq', '$2a$10$/IQXntHWTVSGzjPf/ZIBDuEM0a2Z1nR87NmzbQAw.xKyUSzp8FjJa', 'company', 11, '2025-06-19 02:08:04');
INSERT INTO `user_auth` VALUES (19, 'ww', '$2a$10$WBPtcnmpwcc3n9jeFspo1.5bfV/eThR9tZ556/zLWCwHHUwtRq7oi', 'seeker', 7, '2025-06-19 02:09:19');
INSERT INTO `user_auth` VALUES (20, '求职者01', '$2a$10$cXwWphwOyLf8cMvdvkjh4eksnyTRQ9UR37FlqmykbbE5oGmdTvLja', 'seeker', 12, '2025-06-19 02:11:52');

SET FOREIGN_KEY_CHECKS = 1;
