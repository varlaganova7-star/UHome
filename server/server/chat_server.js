require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:5500", "http://127.0.0.1:5500"], // Ваш фронтенд
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB подключена'))
    .catch(err => console.error('❌ Ошибка MongoDB:', err));

// ===== МОДЕЛЬ СООБЩЕНИЯ =====
const messageSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    media: [{
        type: { type: String, enum: ['image', 'video', 'file'] },
        url: String,
        name: String,
        size: String
    }],
    sender: {
        userId: { type: String, required: true },
        role: { type: String, required: true, enum: ['student', 'admin', 'Studsovet', 'Electrick', 'Slesar', 'Santex'] },
        name: String,
        avatar: String
    },
    recipient: {
        type: String,
        enum: ['admin', 'student', 'all'], // Кому адресовано
        default: 'admin'
    },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// ===== АУТЕНТИФИКАЦИЯ =====
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// ===== API РОУТЫ =====

// 🔐 Логин (упрощённый для демо)
app.post('/api/auth/login', (req, res) => {
    const { role, name } = req.body;
    
    // В реальном проекте здесь проверка пароля в БД!
    const token = jwt.sign(
        { userId: `${role}_${Date.now()}`, role, name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    res.json({ 
        token, 
        user: { role, name, avatar: `https://ui-avatars.com/api/?name=${name}&background=F47920&color=fff` }
    });
});

// 📥 Получить историю сообщений
app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const { role } = req.user;
        
        // Студент видит свои + ответы админа, админ видит всё
        const query = role === 'admin' || role === 'Studsovet'
            ? {}
            : { $or: [{ 'sender.role': role }, { recipient: 'all' }] };
        
        const messages = await Message.find(query)
            .sort({ createdAt: 1 })
            .limit(100);
            
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка загрузки сообщений' });
    }
});

// 📤 Отправить сообщение
app.post('/api/messages', authenticateToken, async (req, res) => {
    try {
        const { text, media, recipient = 'admin' } = req.body;
        const { userId, role, name } = req.user;
        
        const message = new Message({
            text,
            media,
            sender: {
                userId,
                role,
                name,
                avatar: `https://ui-avatars.com/api/?name=${name}&background=F47920&color=fff`
            },
            recipient
        });
        
        await message.save();
        
        // 🔄 Мгновенно отправляем всем подключённым клиентам
        io.emit('new_message', message);
        
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка отправки сообщения' });
    }
});

// ===== SOCKET.IO: REAL-TIME =====
io.on('connection', (socket) => {
    console.log('🔗 Клиент подключён:', socket.id);
    
    // Присоединение к "комнате" по роли
    socket.on('join', (userData) => {
        socket.join(userData.role);
        console.log(`👤 ${userData.name} (${userData.role}) присоединился`);
    });
    
    // Отправка сообщения через сокеты (альтернатива REST)
    socket.on('send_message', async (data) => {
        try {
            const message = new Message(data);
            await message.save();
            
            // Отправляем всем, кроме отправителя
            socket.broadcast.emit('new_message', message);
            // И отправителю тоже (для подтверждения)
            socket.emit('new_message', message);
        } catch (err) {
            socket.emit('error', { message: 'Не удалось отправить сообщение' });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('🔌 Клиент отключён:', socket.id);
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});