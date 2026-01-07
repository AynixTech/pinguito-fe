# API Upload Immagini Campagne - Documentazione Backend

## Overview

Il backend supporta l'upload di immagini per i post delle campagne tramite FormData.
Il frontend Angular è stato configurato per inviare i dati in questo formato.

---

## Endpoint

### POST `/api/campaigns/createCampaign`

Crea una nuova campagna con supporto per upload di immagini.

#### Request Headers
```
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>
```

#### Request Body (FormData)

Il frontend invia i dati in questo formato:

```typescript
const formData = new FormData();

// 1. Dati campagna come JSON string
const campaignData = {
  companyUuid: "uuid-azienda",
  name: "Nome campagna",
  budget: 1000,
  description: "Descrizione campagna",
  startDate: "2024-01-01T00:00:00",
  endDate: "2024-01-31T23:59:59",
  channels: ["facebook", "instagram"],
  status: "planned",
  targetAudience: "Giovani 18-25",
  
  // Post senza i file (imageUrl sarà popolato dal backend)
  facebookPosts: [
    {
      aiGeneratedContent: "Contenuto del post...",
      aiSummary: "Sintesi breve...",
      aiKeywords: "#keyword1 #keyword2",
      scheduledDate: "2024-01-01T10:00:00",
      imageUrl: "" // Lasciare vuoto, verrà popolato dal backend
    }
  ],
  instagramPosts: [...],
  tiktokVideos: [...],
  emailPosts: [...]
};

formData.append('campaignData', JSON.stringify(campaignData));

// 2. File immagini (separati)
// Formato nome campo: "{channel}Post_{index}_image"
formData.append('facebookPost_0_image', fileObject); // Immagine per post Facebook indice 0
formData.append('facebookPost_1_image', fileObject2); // Immagine per post Facebook indice 1
formData.append('instagramPost_0_image', fileObject3); // Immagine per post Instagram indice 0
// ... altri file
```

---

## Implementazione Frontend (Angular)

### Service: campaign.service.ts

```typescript
createCampaign(campaign: CreateCampaignRequest): Observable<any> {
  const formData = new FormData();
  
  // Funzione helper per preparare i post senza i file
  const preparePostsWithoutFiles = (posts: any[]) => {
    return posts.map(post => {
      const { imageFile, ...postData } = post;
      return postData;
    });
  };
  
  // Prepara i dati della campagna
  const campaignData: any = {
    companyUuid: campaign.companyUuid,
    name: campaign.name,
    budget: campaign.budget,
    description: campaign.description,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    channels: campaign.channels,
    status: campaign.status
  };
  
  // Aggiungi i post preparati (senza file)
  if (campaign.facebookPosts) {
    campaignData.facebookPosts = preparePostsWithoutFiles(campaign.facebookPosts);
  }
  if (campaign.instagramPosts) {
    campaignData.instagramPosts = preparePostsWithoutFiles(campaign.instagramPosts);
  }
  if (campaign.tiktokVideos) {
    campaignData.tiktokVideos = preparePostsWithoutFiles(campaign.tiktokVideos);
  }
  
  // Aggiungi i dati come JSON string
  formData.append('campaignData', JSON.stringify(campaignData));
  
  // Aggiungi i file immagini
  if (campaign.facebookPosts) {
    campaign.facebookPosts.forEach((post: any, index: number) => {
      if (post.imageFile) {
        formData.append(`facebookPost_${index}_image`, post.imageFile);
      }
    });
  }
  
  if (campaign.instagramPosts) {
    campaign.instagramPosts.forEach((post: any, index: number) => {
      if (post.imageFile) {
        formData.append(`instagramPost_${index}_image`, post.imageFile);
      }
    });
  }
  
  if (campaign.tiktokVideos) {
    campaign.tiktokVideos.forEach((post: any, index: number) => {
      if (post.imageFile) {
        formData.append(`tiktokPost_${index}_image`, post.imageFile);
      }
    });
  }
  
  // NON specificare Content-Type, Angular lo gestisce automaticamente
  return this.http.post(`${this.apiUrl}/campaigns/createCampaign`, formData);
}
```

---

## Response

```json
{
  "uuid": "campaign-uuid",
  "name": "Nome campagna",
  "companyUuid": "company-uuid",
  "budget": 1000,
  "status": "planned",
  "channels": "[\"facebook\",\"instagram\"]",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Nota**: I post vengono salvati separatamente nel database con le immagini associate.

---

## Servire Immagini Statiche

Le immagini caricate sono accessibili tramite:

```
GET /uploads/campaigns/{filename}
```

Esempio:
```
https://pinguito-bffe.onrender.com/uploads/campaigns/campaign-1735902123456-123456789.jpg
```

Il backend popola automaticamente il campo `mediaUrl` di ogni post con il percorso corretto:
```json
{
  "message": "Contenuto...",
  "mediaUrl": "/uploads/campaigns/campaign-1735902123456-123456789.jpg",
  "scheduledAt": "2024-01-01T10:00:00Z"
}
```

---

## Validazioni

### File Upload
- **Formati accettati**: JPEG, JPG, PNG, GIF, WEBP
- **Dimensione massima**: 5MB per file
- **Errore se formato non valido**: `"Solo file immagine sono permessi (JPEG, PNG, GIF, WEBP)"`
- **Errore se troppo grande**: `"File troppo grande. Massimo 5MB"`

### Dati Campagna
- **Campi obbligatori**: `name`, `companyUuid`
- **Errore se mancanti**: `"Dati obbligatori mancanti (name, companyUuid)"`

---

## Migrazione Database

I modelli sono stati aggiornati con il campo `summary` per FacebookPost e InstagramPost.

Se usi migrazioni Sequelize, esegui:

```sql
ALTER TABLE campaign_facebook_posts ADD COLUMN summary TEXT;
ALTER TABLE campaign_instagram_posts ADD COLUMN summary TEXT;
```

---

## Backward Compatibility

Il controller supporta **sia JSON che FormData**:

1. **Solo JSON** (senza immagini): Invia JSON normale come prima
2. **FormData con immagini**: Invia `campaignData` come campo JSON string + file separati

Esempio con JSON normale (senza upload):
```typescript
this.http.post('/api/campaigns/createCampaign', {
  name: "Campagna",
  companyUuid: "uuid",
  facebookPosts: [...]
});
```

---

## Gestione Errori

```typescript
// Errore multer (file troppo grande, tipo non valido)
{
  "message": "File troppo grande. Massimo 5MB"
}

// Errore parsing JSON
{
  "message": "Errore nel parsing dei dati della campagna"
}

// Errore validazione
{
  "message": "Dati obbligatori mancanti (name, companyUuid)"
}
```

---

## Test con cURL

```bash
curl -X POST https://pinguito-bffe.onrender.com/api/campaigns/createCampaign \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F 'campaignData={"name":"Test Campaign","companyUuid":"uuid","facebookPosts":[{"aiGeneratedContent":"Post content","aiSummary":"Summary","scheduledDate":"2024-01-01T10:00:00"}]}' \
  -F "facebookPost_0_image=@/path/to/image.jpg"
```

---

## Note Importanti

1. **CORS**: Il backend accetta richieste da:
   - `http://localhost:4111` (development)
   - `https://pinguito-fe.onrender.com` (production)

2. **Storage**: Le immagini sono salvate localmente in `uploads/campaigns/`
   - **Render.com**: Le immagini vengono eliminate ad ogni redeploy (storage effimero)
   - **Consiglio**: Migrare a Cloudinary o S3 per produzione

3. **Sicurezza**:
   - Solo admin e monitoring possono creare campagne
   - File validati per tipo e dimensione
   - Nomi file sanitizzati automaticamente

4. **Performance**:
   - Le immagini non vengono compresse/ridimensionate
   - Considerare ottimizzazione lato client prima dell'upload

---

## Modifiche Apportate al Frontend

✅ **campaign.service.ts**: Aggiornato per usare FormData  
✅ **create-campaign.component.ts**: Rimosso JSON.stringify su channels  
✅ **Form controls**: Aggiunti campi imageUrl e imageFile per ogni post  
✅ **Upload UI**: Bottone sfoglia + preview immagine con azioni


## Overview

Il frontend ora permette agli utenti di caricare immagini per ogni post della campagna. Questa documentazione spiega come il backend deve gestire queste immagini.

---

## Struttura Dati Frontend

Ogni post ora include due nuovi campi:

```typescript
{
  aiGeneratedContent: string,
  aiSummary: string,
  aiKeywords: string,
  scheduledDate: string,
  imageUrl: string,      // Preview URL o URL finale dell'immagine
  imageFile: File | null // File immagine da caricare
}
```

---

## Endpoint Richiesto

### POST `/api/campaigns` (Modifica Esistente)

Il frontend invierà i dati della campagna con le immagini usando **FormData** invece di JSON.

#### Request Headers
```
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>
```

#### Request Body (FormData)

```javascript
// Campi campagna principali (come stringa JSON)
campaignData: {
  companyUuid: "uuid",
  name: "Nome campagna",
  budget: 1000,
  description: "Descrizione",
  startDate: "2024-01-01T00:00:00",
  endDate: "2024-01-31T23:59:59",
  channels: ["facebook", "instagram"],
  status: "planned",
  targetAudience: "Giovani 18-25",
  // Post senza file
  facebookPosts: [
    {
      aiGeneratedContent: "...",
      aiSummary: "...",
      aiKeywords: "...",
      scheduledDate: "2024-01-01T10:00:00",
      imageUrl: "" // Vuoto se non c'è immagine
    }
  ]
}

// File immagini (separati)
facebookPost_0_image: File  // Immagine per il post 0
facebookPost_1_image: File  // Immagine per il post 1
// ... altri file
```

---

## Implementazione Backend Consigliata

### 1. Gestione FormData

```javascript
// Express + Multer
const multer = require('multer');
const path = require('path');

// Configurazione storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/campaigns/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `campaign-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filtro per accettare solo immagini
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Solo immagini sono permesse!'));
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Route
router.post('/campaigns', 
  authenticateToken,
  upload.any(), // Accetta qualsiasi numero di file
  createCampaign
);
```

### 2. Controller

```javascript
async function createCampaign(req, res) {
  try {
    // Parse dei dati JSON
    const campaignData = JSON.parse(req.body.campaignData);
    
    // Mappa i file caricati agli indici dei post
    const filesMap = {};
    req.files.forEach(file => {
      // Nome campo: "facebookPost_0_image", "facebookPost_1_image", etc.
      const match = file.fieldname.match(/(\w+)Post_(\d+)_image/);
      if (match) {
        const channel = match[1]; // "facebook", "instagram", etc.
        const index = parseInt(match[2]);
        
        if (!filesMap[channel]) filesMap[channel] = {};
        filesMap[channel][index] = {
          filename: file.filename,
          path: file.path,
          url: `/uploads/campaigns/${file.filename}` // URL pubblico
        };
      }
    });
    
    // Aggiungi imageUrl ai post corrispondenti
    if (campaignData.facebookPosts && filesMap.facebook) {
      campaignData.facebookPosts.forEach((post, index) => {
        if (filesMap.facebook[index]) {
          post.imageUrl = filesMap.facebook[index].url;
        }
      });
    }
    
    // Salva nel database
    const campaign = await Campaign.create(campaignData);
    
    res.status(201).json({
      success: true,
      message: 'Campagna creata con successo',
      data: campaign
    });
    
  } catch (error) {
    console.error('Errore creazione campagna:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la creazione della campagna',
      error: error.message
    });
  }
}
```

### 3. Servire File Statici (Express)

```javascript
// app.js o server.js
const express = require('express');
const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

---

## Alternative: Upload Cloud (S3, Cloudinary)

### Cloudinary Example

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(file) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'campaigns',
    resource_type: 'auto'
  });
  
  return result.secure_url;
}

// Nel controller
if (filesMap.facebook[index]) {
  const cloudinaryUrl = await uploadToCloudinary(filesMap.facebook[index]);
  post.imageUrl = cloudinaryUrl;
}
```

---

## Schema Database

Aggiorna lo schema del post per includere il campo immagine:

```sql
-- MongoDB/Mongoose
{
  aiGeneratedContent: String,
  aiSummary: String,
  aiKeywords: String,
  scheduledDate: Date,
  imageUrl: String,  // Nuovo campo
  createdAt: Date,
  updatedAt: Date
}

-- PostgreSQL
ALTER TABLE campaign_posts 
ADD COLUMN image_url VARCHAR(500);
```

---

## Esempio Response

```json
{
  "success": true,
  "message": "Campagna creata con successo",
  "data": {
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Campagna Inverno 2024",
    "budget": 1000,
    "facebookPosts": [
      {
        "id": 1,
        "aiGeneratedContent": "Contenuto del post...",
        "aiSummary": "Sintesi...",
        "aiKeywords": "keywords",
        "scheduledDate": "2024-01-01T10:00:00Z",
        "imageUrl": "/uploads/campaigns/campaign-1234567890-123456789.jpg"
      },
      {
        "id": 2,
        "aiGeneratedContent": "Altro contenuto...",
        "imageUrl": null
      }
    ]
  }
}
```

---

## Validazione Backend

```javascript
// Validazioni consigliate
const validateCampaignImage = {
  maxSize: 5 * 1024 * 1024,  // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxDimensions: {
    width: 4096,
    height: 4096
  }
};

// Verifica dimensioni immagine
const sharp = require('sharp');

async function validateImageDimensions(filePath) {
  const metadata = await sharp(filePath).metadata();
  
  if (metadata.width > validateCampaignImage.maxDimensions.width ||
      metadata.height > validateCampaignImage.maxDimensions.height) {
    throw new Error('Immagine troppo grande. Max 4096x4096px');
  }
  
  return true;
}
```

---

## Gestione Errori

```javascript
// Middleware error handler
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File troppo grande. Massimo 5MB'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message
  });
});
```

---

## Note Importanti

1. **CORS**: Assicurati che il backend accetti multipart/form-data
2. **Sicurezza**: 
   - Valida sempre i file caricati
   - Sanifica i nomi dei file
   - Limita dimensione e tipo
3. **Performance**: 
   - Considera compressione immagini (sharp, imagemagick)
   - Usa CDN per servire le immagini
4. **Cleanup**: 
   - Implementa logica per eliminare immagini orfane
   - Elimina file quando una campagna viene cancellata

---

## Test Endpoint

```bash
# Con curl
curl -X POST http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "campaignData={\"name\":\"Test\",\"budget\":1000,...}" \
  -F "facebookPost_0_image=@/path/to/image.jpg" \
  -F "facebookPost_1_image=@/path/to/image2.jpg"
```

---

## Modifiche Frontend Necessarie

Nel service Angular, modificare per inviare FormData:

```typescript
// campaign.service.ts
createCampaign(data: CreateCampaignRequest): Observable<any> {
  const formData = new FormData();
  
  // Separa i file dai dati
  const { facebookPosts, ...campaignData } = data;
  
  const postsWithoutFiles = facebookPosts.map(post => {
    const { imageFile, ...postData } = post;
    return postData;
  });
  
  // Aggiungi dati come JSON
  formData.append('campaignData', JSON.stringify({
    ...campaignData,
    facebookPosts: postsWithoutFiles
  }));
  
  // Aggiungi i file
  facebookPosts.forEach((post, index) => {
    if (post.imageFile) {
      formData.append(`facebookPost_${index}_image`, post.imageFile);
    }
  });
  
  return this.http.post(`${this.apiUrl}/campaigns`, formData);
  // Non serve specificare Content-Type, Angular lo gestisce automaticamente
}
```
