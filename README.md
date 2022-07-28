# Workout Manager 

## What is it?
Webapp created to help you automate your workout flow!
You can check it out [here](https://workout-manager-ebon.vercel.app).

## The stack I used

Everything is written in Typescript.

- NextJS
- ChakraUI
- Prisma
- tRPC
- react use-form
- NextAuth (Github and Google Oauth)
- MySQL

DB is hosted on planetscale and the site itself is hosted on vercel.

I used a Next.js and decided to put all frontend and backend code there as it's relatively small project.

## If you want to set it up locally:
1. Copy the repository.
2. In root directory create .env file.
3. You should add all of the below variables to your env file:
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_ID=
GOOGLE_SECRET=
```
4. Enter 
```
npm run dev
``` 
and you are ready to go!
