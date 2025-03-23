# My Workspace App

✨ A new, shiny investment app is ready. ✨
It's creative internal name is workspace and the creative backend name is backend.

[It is build with nx](https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and includes a small angular frontend app and a NestJS backend to fetch data.

## Setup

To be able to access the external api, you need to provide the api key. For this ou need to create a `.env` file in the root of the Project:

```
API_KEY=my4p1k3y
```

## Run tasks

To run the dev server for the app:

```sh
npx nx serve workspace
```

To run the dev server for the backend:

```sh
npx nx serve backend
```

To run storybook:

```sh
npx nx run workspace:storybook
```
