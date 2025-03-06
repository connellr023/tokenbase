<div align="center">
  <h1><i>tokenbase</i></h1>
</div>

> A modular, AI-powered assistant platform that provides real-time chat, role-based access, and conversation tracking, designed for self-hosted or small organizational deployments.

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![SurrealDB](https://img.shields.io/badge/SurrealDB-FF00A0?style=for-the-badge&logo=surrealdb&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-f6f6f6?style=for-the-badge&logo=ollama&logoColor=black)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Contributing

### Pull Requests

Before merging a pull request, the following checks must pass:

- ![Backend CI](https://github.com/connellr023/tokenbase/actions/workflows/backend-ci.yaml/badge.svg)
- ![Frontend CI](https://github.com/connellr023/tokenbase/actions/workflows/frontend-ci.yaml/badge.svg)
- ![Formatter CI](https://github.com/connellr023/tokenbase/actions/workflows/formatter-ci.yaml/badge.svg)

If all checks pass, ensure **Squash and Merge** is selected and then merge the pull request.

### Code Formatting

The following code formatters are required for this project:

- [Prettier](https://prettier.io/) for all frontend code
- [Go fmt](https://golang.org/cmd/gofmt/) for all backend code

If these formatters are not used, the CI pipeline will create a commit with the properly formatted code.

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
- Database service (**SurrealDB**)
- LLM service (**TinyLlama** served with **Ollama**)
- Frontend service (**Next.js**) (_Production Only_)

## Development

### With an NVIDIA GPU

First, install the **NVIDIA Container Toolkit** by following the instructions [here](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html).

Then, run:

```sh
docker-compose up --build
```

or

```sh
docker-compose up
```

To restart a specific service, run:

```sh
docker-compose restart <service>
```

To rebuild a specific service, run:

```sh
docker-compose up --build -d <service>
```

To stop all services, run:

```sh
docker-compose down
```

### Without an NVIDIA GPU

You will have to run the LLM off of the CPU. To do this, use the other `docker-compose` file:

```sh
docker-compose -f docker-compose-cpu.yaml up --build
```

To restart a specific service, run:

```sh
docker-compose -f docker-compose-cpu.yaml restart <service>
```

To stop all services, run:

```sh
docker-compose -f docker-compose-cpu.yaml down
```

### Starting the frontend service

Ensure all dependencies are installed by running in the `web` directory:

```sh
npm i
```

To start the frontend service, goto the `web` directory and run:

```sh
npm run dev
```

## Production

To run the optimized production environment, use the production `docker-compose` file:

```sh
docker-compose -f docker-compose-prod.yaml up --build
```

## Running Backend Tests

Run:

```sh
go -v test ./test/...
```

In order to run all tests in the `test` directory.

## Running Frontend Tests

Run:

```sh
npm test
```

In the `web` directory to run all frontend tests.
