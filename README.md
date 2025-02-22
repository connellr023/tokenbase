# TokenBase

> A modular, AI-powered assistant platform that provides real-time chat, role-based access, and conversation tracking, designed for self-hosted or small organizational deployments.

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![SurrealDB](https://img.shields.io/badge/SurrealDB-FF00A0?style=for-the-badge&logo=surrealdb&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-f6f6f6?style=for-the-badge&logo=ollama&logoColor=black)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Structure

- `build/package/`
  - Contains dockerfiles for all services
- `cmd/tokenbase/`
  - Entry point for the main backend service
- `scripts/`
  - Contains scripts for setting up the project (will likely be executed in Docker)
- `test/`
  - Contains all unit tests for the main backend service
- `internal/`
  - Contains all business logic for the main backend service
- `web/`
  - Contains the frontend source code for the main frontend service

## Services

- Backend service (**Go**)
- Frontend service (**Next.js**)
- Database service (**SurrealDB**)
- LLM service (**TinyLlama** served with **Ollama**)

## Development

1. Clone the repository
2. Run `docker-compose up --build` to build and run the services from scratch
3. Run `docker-compose up` to start the services after the initial build
4. Run `docker-compose up --build <service>` to build and run a specific service from scratch

## Running Backend Tests

Run:

```sh
go -v test ./test/...
```

In order to run all tests in the `test` directory.

## Contributors

- Connell Reffo (10186960)
- Nick McCamis (30192610)
- Erina Kibria (30176743)
- Jacob Koep (30153351)

This project was created for **SENG 513** in **2025**.
