# API Reference — Q-Empire Mobile App

## Integrated APIs

### 1. HuggingFace Inference API (Free Tier)

**Base URL**: `https://api-inference.huggingface.co/models/`

**Authentication**: Bearer token in Authorization header

**Rate Limits**: 10,000 requests/month (free tier)

**Endpoints**:

#### Text Generation
```
POST /{model_id}
Body: { "inputs": "Your prompt here" }
Response: [{ "generated_text": "..." }]
```

**Models Used**:
- `gpt2` — General text generation
- `distilbert-base-uncased-finetuned-sst-2-english` — Sentiment analysis
- `dslim/bert-base-NER` — Named entity recognition
- `facebook/bart-large-cnn` — Text summarization

#### Example Request
```javascript
const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_HF_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ inputs: 'Write a mission statement for a tech startup' }),
});
```

---

### 2. Q-Empire Webhook API (Backend)

**Base URL**: `https://api.qempire.app` (or local `http://localhost:8080`)

#### Health Check
```
GET /
Response: { "status": "online", "service": "Q-Empire Agent Swarm" }
```

#### Create Task
```
POST /task
Body: {
  "type": "BUILD_WEBSITE",
  "payload": {
    "business_name": "TestCorp",
    "industry": "Technology"
  }
}
Response: { "status": "queued", "task_id": "task_abc123", "position": 1 }
```

#### Get Task Status
```
GET /task/{task_id}
Response: {
  "task_id": "task_abc123",
  "status": "pending",
  "result": null,
  "error": null
}
```

#### List Tasks
```
GET /tasks
Response: {
  "pending": 2,
  "needs_clarification": 0,
  "completed": 5,
  "tasks": { ... }
}
```

#### Onboard Client
```
POST /onboard
Body: {
  "business_name": "...",
  "industry": "...",
  "email": "...",
  "package_id": "foundation",
  "automations_selected": ["lead-chatbot", "email-welcome"]
}
Response: {
  "status": "success",
  "package": "foundation",
  "tasks_created": [...],
  "message": "Michelle & Q-Bot are now building your empire!"
}
```

---

### 3. RevenueCat Purchases API

**SDK**: `react-native-purchases`

#### Initialize
```javascript
import Purchases from 'react-native-purchases';

await Purchases.configure({ apiKey: 'YOUR_API_KEY' });
```

#### Get Offerings
```javascript
const offerings = await Purchases.getOfferings();
const current = offerings.current;
```

#### Purchase Package
```javascript
const { customerInfo } = await Purchases.purchasePackage(pkg);
// Check customerInfo.entitlements.active for "pro", "elite", etc.
```

#### Restore Purchases
```javascript
const { customerInfo } = await Purchases.restorePurchases();
```

---

### 4. PostHog Analytics API

**SDK**: `posthog-react-native`

#### Initialize
```javascript
import PostHog from 'posthog-react-native';

await PostHog.initAsync('YOUR_API_KEY', { host: 'https://app.posthog.com' });
```

#### Track Event
```javascript
PostHog.capture('project_created', {
  industry: 'Technology',
  package: 'empire-pro',
});
```

#### Identify User
```javascript
PostHog.identify(userId, {
  email: user.email,
  tier: user.tier,
});
```

---

### 5. Expo Notifications API

**SDK**: `expo-notifications`

#### Request Permissions
```javascript
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.requestPermissionsAsync();
```

#### Schedule Notification
```javascript
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Q-Empire Update',
    body: 'Your website is ready! 🎉',
    data: { projectId: 'proj_123' },
  },
  trigger: null, // Immediate
});
```

---

## Environment Variables

Create `.env` in `mobile/` directory (never commit):

```
EXPO_PUBLIC_HF_API_KEY=your_huggingface_token
EXPO_PUBLIC_POSTHOG_KEY=your_posthog_key
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EXPO_PUBLIC_WEBHOOK_URL=https://api.qempire.app
```

For `.env.example` (committed template):
```
EXPO_PUBLIC_HF_API_KEY=your_huggingface_token_here
EXPO_PUBLIC_POSTHOG_KEY=your_posthog_key_here
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EXPO_PUBLIC_WEBHOOK_URL=http://localhost:8080
```

---

## Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| HF_001 | HuggingFace rate limit exceeded | Wait 60 seconds, retry |
| HF_002 | Model loading | Try again in 30 seconds |
| API_001 | Webhook unreachable | Check network, enable offline mode |
| AUTH_001 | Invalid credentials | Re-login, check token |
| SUB_001 | Purchase failed | Restore purchases, contact support |
