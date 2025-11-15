const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// Onde os arquivos serão salvos
const UPLOAD_FOLDER = path.resolve(__dirname, '..', '..', 'public', 'uploads');

const storage = multer.diskStorage({
  destination: UPLOAD_FOLDER,
  filename(request, file, callback) {
    // Cria um hash aleatório para o nome do arquivo
    const fileHash = crypto.randomBytes(10).toString('hex');
    // O nome final será "hash-nomeoriginal.jpg"
    const fileName = `${fileHash}-${file.originalname}`;

    return callback(null, fileName);
  },
});

// Exportamos a instância do multer com a configuração de storage
const upload = multer({
  storage: storage,
});

module.exports = {
  upload,
  UPLOAD_FOLDER,
};