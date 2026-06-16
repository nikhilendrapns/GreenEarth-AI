# Platform API Schema & Contract Specifications

This document defines the REST API routes, request parameters, response schemas, and JSON contracts established between the GreenEarthAI single-page front-end and our backend middleware.

---

## 1. Global Endpoints Index

All API interactions originate from the client and route securely over port `3000` to the Express backend.

```
POST /api/assessment/profile     # Decodes diagnostic input parameters and evaluates carbon metrics
POST /api/coach/message          # Dispatches a user query to the Sustainability Coach agent
POST /api/journal/analyze        # Audits daily journal comments, returning emotional logs and points
POST /api/simulator/forecast     # Projects 5-to-10 year environmental forecasts based on pledges
```

---

## 2. API Contract Specifications

### 1. `POST /api/assessment/profile`
Evaluates the client's questionnaire answers and generates their carbon profile.

* **Payload Parameters**:
```json
{
  "answers": {
    "diet": "vegetarian",
    "flights": "none",
    "homeEnergy": "green_solar",
    "waste": "compost_and_recycle",
    "isWFH": true
  }
}
```

* **Response Payload (Standard Schema JSON)**:
```json
{
  "score": 4.1,
  "archetype": "Eco-Minimalist Sentinel 🍃",
  "vitalityPoints": 160,
  "explanation": "Your solar energy adaptation and local plant diet keep footprint metrics in high ranges. Focus remains now on recycling loops to reach maximum tiers.",
  "achievableActions": [
    {
      "id": "act-compost-01",
      "title": "Establish backyard worm compost feed",
      "impact": "High Impact",
      "recoveryScore": 25,
      "why": "Restores biological soils and prevents heavy organic trash emissions."
    }
  ]
}
```

---

### 2. `POST /api/coach/message`
Dispatches chat commands to the specialized Sustainability advisory agent.

* **Payload Parameters**:
```json
{
  "message": "Which has a lower carbon impact - electric scooters or bikes?",
  "estimatedTotalCO2": 6.8
}
```

* **Response Payload**:
```json
{
  "reply": "Standard manual bicycles have a negligible footprint compared to electric options because of manufacturing. However, scooters remain 88% better than internal combustion vehicles.",
  "confidenceScore": 0.95
}
```

---

### 3. `POST /api/journal/analyze`
Scans daily journal uploads for ecological actions.

* **Payload Parameters**:
```json
{
  "journalText": "Today I manually cycled to the organic farmers market instead of driving my gas-powered car, and purchased local grains."
}
```

* **Response Payload**:
```json
{
  "recoveredPoints": 35,
  "insightSummary": "Cycled instead of driving, locally sourced grains.",
  "moodShift": "Hopeful"
}
```
