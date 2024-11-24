const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// dist 폴더를 정적 파일로 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// 모든 경로에서 index.html 제공
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
