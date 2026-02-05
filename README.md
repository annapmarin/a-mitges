# a-mitges

Aplicació web per gestionar grups i despeses compartides. Permet crear grups, afegir participants, registrar despeses i visualitzar un resum de qui deu què a qui. La aplicació fa servir autenticació amb Google i Firestore (Firebase) per persistència.

## Tecnologies

- Frontend: React + TypeScript
- Bundler: Vite
- Autenticació i base de dades: Firebase (Auth, Firestore)

## Prerrequisits

- Node.js (recomanat >= 16)
- Compte de Firebase i un projecte configurat si voleu persistència remota

## Instal·lació i execució

1. Instal·leu dependències:

```bash
npm install
```

2. Executar en mode desenvolupament:

```bash
npm run dev
```

3. Generar build de producció:

```bash
npm run build
```

4. Previsualitzar el build:

```bash
npm run preview
```

## Configuració

La inicialització de Firebase es troba a [src/config/firebase.ts](src/config/firebase.ts). Creeu un projecte a Firebase i afegiu les claus de configuració al fitxer corresponent o a variables d'entorn segons el vostre flux de treball.

Si utilitzeu un fitxer `.env`, assegureu-vos d'afegir les variables necessàries abans d'iniciar l'aplicació.

## Estructura del projecte

- `src/` — codi font
  - `pages/` — vistes i pàgines
  - `components/` — components React reutilitzables
  - `services/` — connexió amb Firestore i lògica de negoci
  - `hooks/` — hooks personalitzats
  - `config/` — configuracions (per ex. Firebase)
  - `styles/` — fitxers CSS

## Arxius rellevants

- Inicialització Firebase: [src/config/firebase.ts](src/config/firebase.ts)
- Rutes de l'aplicació: [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx)
- Pàgina principal: [src/pages/HomePage.tsx](src/pages/HomePage.tsx)
