# TokenBase

> A modular, AI-powered assistant platform that provides real-time chat, role-based access, and conversation tracking, designed for self-hosted or small organizational deployments.

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![SurrealDB](https://img.shields.io/badge/SurrealDB-FF00A0?style=for-the-badge&logo=surrealdb&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-f6f6f6?style=for-the-badge&logo=ollama&logoColor=black)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Code Formatting

The following code formatters **must** be used to contribute to this repository or a workflow will fail:

- [Prettier](https://prettier.io/) for all frontend code
- [Go fmt](https://golang.org/cmd/gofmt/) for all backend code

## Structure

- `build/package/`
  - Contains dockerfiles for all services
- `cmd/tokenbase/`
  - Entry point for the main backend service
- `schema/`
  - Contains all database schema definition scripts
- `scripts/`
  - Contains general scripts that can also be executed in a container
- `test/`
  - Contains all unit tests for the main backend service
- `internal/`
  - Contains all business logic for the main backend service
- `web/`
  - Contains the frontend source code for the main frontend service

## Services

- Backend service (**Go**)
- Cache service (**Redis**)
- Frontend service (**Next.js**)
- Database service (**SurrealDB**)
- LLM service (**TinyLlama** served with **Ollama**)

## Development

1. Clone the repository
2. Run `docker-compose up --build` to build and run the services from scratch
3. Run `docker-compose up` to start the services after the initial build
4. Run `docker-compose up <service> --build -d` to build and run a specific service from scratch
5. Run `docker-compose down` to stop the services
6. Run `docker-compose down -v` to stop the services and remove all volumes

## Running Backend Tests

Run:

```sh
go -v test ./test/...
```

In order to run all tests in the `test` directory.
