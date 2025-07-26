const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const models = require('./models');
const path = require('path'); // 引入 path 模块
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// 禁用 Etag，以避免浏览器缓存导致的 304 Not Modified
app.set('etag', false);

// 中间件
app.use(cors());
app.use(express.json());

// Temporarily disable Helmet to diagnose CSP/CORP issues
// app.use(helmet({
//   crossOriginResourcePolicy: false,
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       baseUri: ["'self'"],
//       fontSrc: ["'self'", "https:", "data:", "blob:", "ws:", "http://localhost:5000"],
//       formAction: ["'self'"],
//       frameAncestors: ["'self'"],
//       imgSrc: ["'self'", "data:", "http://localhost:5000"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       connectSrc: ["'self'", "ws:", "http://localhost:5000"],
//       upgradeInsecureRequests: [],
//       objectSrc: ["'none'"],
//       scriptSrcAttr: ["'none'"],
//     },
//   },
// }));
app.use(morgan('dev'));

// Custom middleware to ensure Cross-Origin-Resource-Policy is not sent for /uploads
app.use('/uploads', (req, res, next) => {
  res.removeHeader('Cross-Origin-Resource-Policy'); // Remove the header if it was set by other middleware
  next();
});

// Log the absolute path to the uploads directory
console.log('Serving static files from:', path.join(__dirname, 'uploads'));

// Log requests to /uploads to debug if they reach here
app.use('/uploads', (req, res, next) => {
  console.log(`[DEBUG] Request for static file: ${req.originalUrl}`);
  next();
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve resume files from the specified absolute path
app.use('/uploads/resumes', express.static('D:/Test/招聘系统pro/backend/uploads/resumes/'));
console.log('Serving resume static files from:', 'D:/Test/招聘系统pro/backend/uploads/resumes/', 'at /uploads/resumes');

// 新增静态映射，支持 /resumes_static/xxx.pdf 访问简历文件
app.use('/resumes_static', express.static(path.join(__dirname, 'uploads/resumes')));
console.log('Serving resume static files from:', path.join(__dirname, 'uploads/resumes'), 'at /resumes_static');

// 路由
const authRoutes = require('./routes/auth'); // 引入auth路由模块
const jobRoutes = require('./routes/job');
const resumeRoutes = require('./routes/resume');
const seekerJobRoutes = require('./routes/seekerJobs'); // 引入求职者岗位路由
const messageRoutes = require('./routes/message');
const companyRoutes = require('./routes/company'); // 引入公司路由
const profileRoutes = require('./routes/profile'); // 引入个人中心路由
const uploadRoutes = require('./routes/upload'); // 引入上传路由
const adminRoutes = require('./routes/admin'); // 引入管理员路由

// 使用auth路由模块
app.use('/api/auth', authRoutes);

// 招聘方相关路由
app.use('/api/jobs', jobRoutes);

// 求职者相关路由
app.use('/api/seeker', seekerJobRoutes);

app.use('/api/resume', resumeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/company', companyRoutes); // 使用公司路由
app.use('/api/profile', profileRoutes); // 使用个人中心路由
app.use('/api/upload', uploadRoutes); // 使用上传路由
app.use('/api/admin', adminRoutes); // 使用管理员路由

app.get('/', (req, res) => {
  res.json({ message: '招聘系统后端 API 正常运行' });
});

// 打印环境变量用于调试
console.log('环境变量:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});

// 同步数据库
const PORT = process.env.PORT || 5000;
models.sequelize.sync({ alter: true })
  .then(() => {
    console.log('数据库同步成功');
    const server = http.createServer(app);
    const io = socketIo(server, { cors: { origin: '*' } });

    const userSocketMap = new Map();

    io.on('connection', (socket) => {
      socket.on('login', (userId) => {
        userSocketMap.set(userId, socket);
        socket.userId = userId;
      });
      socket.on('disconnect', () => {
        if (socket.userId) userSocketMap.delete(socket.userId);
      });
    });

    app.set('io', io);
    app.set('userSocketMap', userSocketMap);

    server.listen(PORT, () => {
      console.log(`服务器正在运行在 http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('数据库同步失败:', err);
  });