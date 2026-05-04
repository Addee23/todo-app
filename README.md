# Todo App

En enkel todo-app byggd med Next.js, TypeScript, Tailwind CSS och MySQL via XAMPP.

Appen kan:

- hamta todos fran databasen
- lagga till nya todos
- markera todos som klara/oklara
- ta bort todos

## Tekniker

- Next.js App Router
- React Client Components
- TypeScript
- Tailwind CSS
- MySQL/XAMPP
- mysql2

## Starta Databasen

1. Oppna XAMPP Control Panel.
2. Starta Apache.
3. Starta MySQL.

I detta projekt ar MySQL konfigurerat for port `3307`.

## Skapa Databasen

Oppna phpMyAdmin:

```text
http://localhost/phpmyadmin
```

Kor SQL-koden i filen:

```text
database.sql
```

## Installera Projektet

```bash
npm install
```

## Starta Projektet

```bash
npm run dev
```

Oppna sedan:

```text
http://localhost:3000
```

Om port `3000` ar upptagen kan Next.js starta pa `3001` i stallet.

## Databasinställningar

Databaskopplingen finns i:

```text
lib/db.ts
```

Standardinstallningen ar:

```text
host: localhost
port: 3307
user: root
password: tomt
database: todo_app
```
