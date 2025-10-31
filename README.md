<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1nb80gUzomvu2Fr1PhMASZ7iLyWSmA5I_

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


sequenceDiagram
    participant U as 🧑‍💻 Utilisateur (Navigateur Web)
    participant FE as 💠 Frontend (Vercel - React/Next.js)
    participant BE as ⚙️ Backend API (Serverless Function)
    participant G as 🤖 Google Gemini API
    participant S as 🗄️ Supabase (Auth + Database)

    %% Étape 1 : L'utilisateur interagit avec l'UI
    U->>FE: Ouvre l'application web (HTTPS)
    FE-->>U: Retour du HTML / CSS / JS

    %% Étape 2 : Authentification et chargement
    FE->>S: Requête Auth (login / sign-up)
    S-->>FE: Token JWT utilisateur

    %% Étape 3 : Appel IA
    FE->>BE: Appel /api/gemini.ts avec prompt utilisateur
    BE->>G: Requête vers Google Gemini API
    G-->>BE: Réponse IA (texte / data)
    BE-->>FE: Réponse filtrée et sécurisée

    %% Étape 4 : Sauvegarde dans la base
    FE->>S: Insertion / Mise à jour (table objectives)
    S-->>FE: Confirmation (JSON)

    %% Étape 5 : Affichage
    FE-->>U: Résultats affichés à l’écran
