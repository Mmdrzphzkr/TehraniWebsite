This folder contains a Strapi v5 project scaffold for Tehrani website.

Quick start (local, requires Docker):

1. Start Postgres:
   docker compose up -d

2. Create the Strapi project (once Postgres is running):
   npx create-strapi@latest cms --no-run

   If the command refuses to create the folder because it exists, run it outside and point to this folder or remove the folder first.

3. Copy or ensure the provided src/api/** content-type schema files exist (they are checked in).

4. Install dependencies and run Strapi:
   cd cms
   npm install
   npm run develop

5. Open http://localhost:1337/admin to finish admin setup.

Notes:
- This environment cannot run Docker containers from the assistant; the docker-compose.yml is provided but launching containers must be done on the developer machine.
- After Strapi starts, it will register content-types defined under src/api.
- Roles and API tokens should be created in the Admin UI. A bootstrap script is provided in src/bootstrap/ to help automate role/token creation.
